import { mongodbAdapter } from "@better-auth/mongo-adapter"
import { betterAuth } from "better-auth"
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

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL?.trim(),
  secret: process.env.BETTER_AUTH_SECRET,
  database: mongodbAdapter(db, { client }),
  emailAndPassword: {
    enabled: true,
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
