import { createHash, timingSafeEqual } from "node:crypto"
import { mongodbAdapter } from "@better-auth/mongo-adapter"
import { betterAuth } from "better-auth"
import { APIError, createAuthMiddleware } from "better-auth/api"
import { getSessionCookie } from "better-auth/cookies"
import { nextCookies } from "better-auth/next-js"
import { MongoClient } from "mongodb"

const uri = process.env.MONGODB_URI?.trim()

if (!uri) {
  throw new Error("MONGODB_URI is missing. Add it to .env")
}

const globalForMongo = globalThis as typeof globalThis & {
  mentorLagbeMongoClient?: MongoClient
}

const client = (globalForMongo.mentorLagbeMongoClient ??= new MongoClient(uri, {
  serverSelectionTimeoutMS: 5_000,
}))

// The URI in .env has no database name, so pick it here.
export const db = client.db("mentor-lagbe")

function requireAdminCode(code: string | null | undefined) {
  const expected = process.env.ADMIN_ACCESS_CODE?.trim()
  const digest = (value: string) => createHash("sha256").update(value).digest()

  if (!expected || !code || !timingSafeEqual(digest(code), digest(expected))) {
    throw new APIError("FORBIDDEN", {
      message: "A valid admin access code is required.",
    })
  }
}

function createAuth() {
  return betterAuth({
    baseURL: process.env.BETTER_AUTH_URL?.trim(),
    secret: process.env.BETTER_AUTH_SECRET,
    database: mongodbAdapter(db, { client }),
    emailAndPassword: {
      enabled: true,
    },
    rateLimit: {
      enabled: true,
    },
    session: {
      additionalFields: {
        adminCodeVerified: {
          type: "boolean",
          input: false,
          required: false,
        },
      },
    },
    hooks: {
      before: createAuthMiddleware(async (context) => {
        if (context.path !== "/sign-up/email") return
        const role = context.body?.role ?? "student"
        if (role === "admin") {
          throw new APIError("FORBIDDEN", {
            message: "An administrator must assign this role.",
          })
        }
        if (role !== "student" && role !== "mentor") {
          throw new APIError("BAD_REQUEST", {
            message: "Choose a valid account role.",
          })
        }
      }),
    },
    databaseHooks: {
      user: {
        update: {
          before: async (user) => {
            if ("role" in user) {
              throw new APIError("FORBIDDEN", {
                message: "Account roles cannot be changed here.",
              })
            }
          },
        },
      },
      session: {
        create: {
          before: async (session, context) => {
            const user = await context?.context.internalAdapter.findUserById(
              session.userId
            )
            if (
              user &&
              "role" in user &&
              String(user.role).toLowerCase() === "admin"
            ) {
              requireAdminCode(context?.headers?.get("x-admin-code"))
              return { data: { adminCodeVerified: true } }
            }
          },
        },
      },
    },
    user: {
      additionalFields: {
        role: {
          type: "string",
          required: false,
          defaultValue: "student",
          input: true,
        },
        bio: {
          type: "string",
          required: false,
          input: true,
        },
        location: {
          type: "string",
          required: false,
          input: true,
        },
      },
    },
    plugins: [nextCookies()],
  })
}

let auth: ReturnType<typeof createAuth> | undefined

export async function getAuth() {
  // Explicit connect also replaces a topology left closed by a failed startup.
  await client.connect()
  return (auth ??= createAuth())
}

export async function getAuthSession(headers: Headers) {
  if (!getSessionCookie(headers)) return null
  const auth = await getAuth()
  return auth.api.getSession({ headers })
}
