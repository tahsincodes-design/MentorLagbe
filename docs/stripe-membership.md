# Stripe membership setup

MentorLagbe keeps the tutor’s role separate from billing. MongoDB stores membership records in the `memberships` collection by Better Auth user ID, with separate fields for live billing and each configured Stripe test sandbox.

## Environment

Set these server-side variables in Next.js.

| Variable | Value |
| --- | --- |
| `STRIPE_API_SECRET_KEY` | Stripe secret key for the selected mode |
| `STRIPE_MEMBERSHIP_MODE` | `test` or `live`. Set the same value in the Express server environment |
| `STRIPE_TEST_SANDBOX_ID` | The test sandbox's Stripe account ID (`acct_…`). Set the same value in the Express server environment. Applies in test mode |
| `STRIPE_PRO_PRICE_ID` | Active monthly recurring Price ID for MentorLagbe Pro in that mode |
| `STRIPE_WEBHOOK_SECRET` | Signing secret for the Stripe endpoint that delivers to this deployment |
| `STRIPE_PORTAL_CONFIGURATION_ID` | Optional configuration ID. Without it, Stripe uses the mode’s default billing portal |
| `BILLING_BASE_URL` | Optional Checkout and portal return origin. Defaults to `BETTER_AUTH_URL` |

Use an HTTPS return origin for live billing. Enable invoice history, payment method updates, and subscription cancellation in the Stripe portal configuration.

When switching sandboxes, set the account ID, API keys, monthly Price ID, portal configuration, and webhook secret for the new sandbox. Existing customer IDs and subscriptions stay with their original sandbox. Test mode without the account ID reads the legacy `test` billing field.

## Webhooks

In Stripe Workbench, register `/api/stripe/webhook` on the app’s public HTTPS origin. Choose **Your account** and the **Snapshot** payload format, then subscribe to these events.

- `checkout.session.completed`
- `customer.subscription.created`, `customer.subscription.updated`, `customer.subscription.deleted`, `customer.subscription.paused`, `customer.subscription.resumed`
- `invoice.paid`, `invoice.payment_failed`

For development, select the matching sandbox in the Stripe CLI and run this command. Use the signing secret printed by the CLI for that local listener and restart Next.js after changing it. [Stripe CLI webhook forwarding](https://docs.stripe.com/cli/listen)

```powershell
stripe listen --all-snapshot --forward-to http://localhost:3000/api/stripe/webhook
```

## Posting allowance

Free tutors can keep up to two saved tuitions, including pending and paused listings. Pro tutors can post without that limit. Existing listings remain after cancellation or expiry, and Free tutors can delete a listing to free a slot.
