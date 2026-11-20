import { createHash, timingSafeEqual } from "node:crypto"
import { mongodbAdapter } from "@better-auth/mongo-adapter"
import { betterAuth } from "better-auth"
import { APIError, createAuthMiddleware } from "better-auth/api"
import { nextCookies } from "better-auth/next-js"
import { MongoClient } from "mongodb"

const uri = process.env.MONGODB_URI?.trim()

if (!uri) {
  throw new Error("MONGODB_URI is missing. Add it to .env")
}

// Reuse one client while the dev server reloads instead of opening a new pool
// on every change.
const globalForMongo = globalThis as unknown as {
  mongoClient?: MongoClient
}

const client = globalForMongo.mongoClient ?? new MongoClient(uri)

if (process.env.NODE_ENV !== "production") {
  globalForMongo.mongoClient = client
}

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

export const auth = betterAuth({
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
      if (role !== "student" && role !== "mentor" && role !== "admin") {
        throw new APIError("BAD_REQUEST", {
          message: "Choose a valid account role.",
        })
      }
      if (role === "admin")
        requireAdminCode(context.headers?.get("x-admin-code"))
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
