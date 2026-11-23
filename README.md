<div align="center">
  <h1>MentorLagbe</h1>
  <p><strong>Find the right tuition. Share what you teach.</strong></p>
  <p>A tuition marketplace where students discover lessons and tutors manage listings and applications.</p>
  <img src="public/hero-student.jpg" alt="A student writing in a notebook beside a laptop" width="560">
  <p>
    <a href="#what-you-can-do">Features</a> ·
    <a href="#run-locally">Local setup</a> ·
    <a href="#faq">FAQ</a>
  </p>
</div>

## What you can do

| Role | Workflow |
| --- | --- |
| **Student** | Browse approved, active tuitions and filter by subject, location, and monthly fee. Bookmark listings in **Saved Tuitions**, apply with a short message, and track the decision in **My Applications**. |
| **Tutor** | Create, edit, pause, or delete listings from **My Tuitions**. Use **Needs review** to find listings with pending applications and see the reason if an admin declines a listing. |
| **Admin** | Sign in with the admin access code, review the **Pending approval** queue, and leave a reason when rejecting a listing. |

**Tutor membership** starts with Free, which allows two saved listings. The monthly **MentorLagbe Pro** plan allows unlimited listings and adds dashboard totals for published tuitions and applications. Stripe handles checkout, invoices, payment updates, and cancellation.

### Main pages

| Page | Path |
| --- | --- |
| Browse and filter tuitions | `/tuitions` |
| Tuition details | `/tuitions/[tuitionId]` |
| My Tuitions and posting | `/tuitions/manage`, `/tuitions/new` |
| Tuition Approvals | `/admin/tuitions` |
| Saved Tuitions | `/tuitions/saved` |
| My Applications | `/applications` |
| Tutor membership | `/membership` |
| How It Works | `/how-it-works` |
| About and contact | `/about` |

## How it’s built

- **Web app** uses Next.js App Router, React, TypeScript, Tailwind CSS, and shadcn/ui.
- **API and data** use a separate Express server and MongoDB. Both services use the `mentor-lagbe` database.
- **Authentication** uses Better Auth for browser sessions. Next.js and Express exchange short-lived JWTs for the jobs API. [Authentication setup](docs/jobs-authentication.md)
- **Integrations** use Stripe for tutor memberships, Resend for the contact form, and ImgBB for profile image uploads. [Stripe setup](docs/stripe-membership.md)

## Run locally

You’ll need Node.js 22 or newer, npm, the separate **MentorLagbe-Server** project, and a MongoDB deployment with replica-set support. A local replica set or MongoDB Atlas works. Tuition posting and related updates use MongoDB transactions.

### 1. Configure both projects

Create a private `.env` file at each project’s root. Replace the placeholders with your own values.

**Next.js · MentorLagbe**

```dotenv
MONGODB_URI=<your-mongodb-connection-string>
BETTER_AUTH_URL=http://localhost:3000
BETTER_AUTH_SECRET=<random-auth-secret>
JOBS_API_URL=http://localhost:5000
JWT_SECRET=<shared-jobs-secret>
ADMIN_ACCESS_CODE=<your-private-admin-code>
```

**Express · MentorLagbe-Server**

```dotenv
MONGODB_URI=<the-same-mongodb-connection-string>
JWT_SECRET=<the-same-shared-jobs-secret>
PORT=5000
```

Generate independent values for `BETTER_AUTH_SECRET` and `JWT_SECRET` by running this command twice. Copy the JWT value to both project environments.

```bash
node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"
```

To grant admin access, set the existing user's `role` to `"admin"` in MongoDB's `mentor-lagbe.user` collection. Have them sign in again using the **Admin** option and `ADMIN_ACCESS_CODE`.

Keep both `.env` files out of Git. Configure the optional services when you need them.

| Feature | Configuration |
| --- | --- |
| Stripe Pro checkout | Follow the [Stripe guide](docs/stripe-membership.md) for the monthly price, sandbox credentials, portal, and webhook. Match test mode and the sandbox account ID across both projects. |
| Contact form | Set `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, and a `RESEND_FROM_EMAIL` sender authorized by Resend in the web app. |
| Profile image upload | Set `IMGBB_API_KEY` in the web app. |

### 2. Start the API and web app

In the **MentorLagbe-Server** terminal:

```bash
npm ci
node index.js
```

In the **MentorLagbe** terminal:

```bash
npm ci
npm run dev
```

Open [MentorLagbe on localhost](http://localhost:3000). Check the [Express health endpoint](http://localhost:5000/api/health) to confirm that the API can reach MongoDB.

### 3. Check the web app

```bash
npm run typecheck
npm run lint
npm run build
```

## FAQ

<details>
<summary><strong>Do students need a paid plan to apply?</strong></summary>

Students can browse public tuitions and apply after signing in with a student account. The monthly fee on a listing is set by the tutor. MentorLagbe Pro covers tutor listing limits and dashboard features.

</details>

<details>
<summary><strong>Why can’t students find a tuition I just posted or edited?</strong></summary>

A new listing starts as pending approval. Editing its details sends it back for review. It appears in public search once an admin approves it and it is active.

</details>

<details>
<summary><strong>What happens to a tutor’s listings when Pro ends?</strong></summary>

Existing listings stay editable. The two-listing Free limit applies to new posts, so tutors with two or more listings can delete one or more before posting again.

</details>

<details>
<summary><strong>Why are listings failing to load locally?</strong></summary>

Check that Express is running and that `JOBS_API_URL` points to it. Confirm that both projects have the same `JWT_SECRET` and MongoDB connection, then restart both services after changing environment variables.

</details>

<details>
<summary><strong>How do I test Pro without charging a real card?</strong></summary>

Use your Stripe sandbox and its monthly Price ID, enable test mode in both services, and complete checkout with a Stripe test card. The [Stripe guide](docs/stripe-membership.md) covers webhook forwarding so later billing events update the tutor’s plan.

</details>
