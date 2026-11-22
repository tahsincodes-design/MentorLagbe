import { inferAdditionalFields } from "better-auth/client/plugins"
import { createAuthClient } from "better-auth/react"

import type { getAuth } from "@/lib/auth"

export const authClient = createAuthClient({
  plugins: [inferAdditionalFields<Awaited<ReturnType<typeof getAuth>>>()],
})

export const { signIn, signUp, signOut, updateUser, useSession } = authClient
