import { headers } from "next/headers"
import { redirect } from "next/navigation"

import { getAuthSession } from "@/lib/auth"
import { tuitionSignInPath } from "@/lib/tuitions/routes"

export async function requireTuitionSession(next: string) {
  const session = await getAuthSession(await headers())
  if (!session) redirect(tuitionSignInPath(next))

  const role = (session.user.role ?? "student").toLowerCase()
  if (role === "admin" && !session.session.adminCodeVerified) {
    redirect(tuitionSignInPath(next))
  }
  return { user: session.user, role }
}
