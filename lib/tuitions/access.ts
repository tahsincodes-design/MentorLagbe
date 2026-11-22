import { headers } from "next/headers"
import { redirect } from "next/navigation"

import { auth } from "@/lib/auth"
import { tuitionSignInPath } from "@/lib/tuitions/routes"

export async function requireTuitionSession(next: string) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect(tuitionSignInPath(next))

  const role = (session.user.role ?? "student").toLowerCase()
  if (role === "admin" && !session.session.adminCodeVerified) {
    redirect(tuitionSignInPath(next))
  }
  return { user: session.user, role }
}
