# Jobs API authentication

The browser signs in with Better Auth and sends its session cookie to Next.js. For each jobs request, Next.js validates the session and sends Express a short-lived, signed `mentorlagbe_jobs` cookie. Guests receive a token without a user identity so they can browse public listings.

The request token contains the method, resource, and request ID. For signed-in users it also contains the user ID, role, and admin-verification status. Express checks those claims, loads the user from MongoDB, and applies the existing role and ownership checks. Express returns a signed receipt for the same request ID. Next.js verifies it before relaying the API result. The internal cookie and receipt stay between the servers.

## Configuration

- Set the same `JWT_SECRET` in the Next.js and Express server environments. Generate a separate random value for each deployment environment. For example, the following command generates 32 random bytes encoded as hex.

  ```powershell
  node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"
  ```

- Set `JOBS_API_URL` in Next.js to the Express base URL. Use HTTPS across hosts. HTTP is supported for localhost development.
- Deploy the two services together when switching from `JOBS_API_SECRET` or rotating `JWT_SECRET`. Both services need the same value before jobs requests will succeed. Keep the value out of Git and public environment variables.
