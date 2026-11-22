import { redirect } from "next/navigation"

import { isTutorRole } from "@/components/auth/roles"
import { requireTuitionSession } from "@/lib/tuitions/access"
import {
  tuitionBrowsePath,
  tuitionManagePath,
  tuitionNewPath,
} from "@/lib/tuitions/routes"

export default async function NewTuitionPage() {
  const { role } = await requireTuitionSession(tuitionNewPath)
  if (!isTutorRole(role)) redirect(tuitionBrowsePath)
  redirect(`${tuitionManagePath}?post=1`)
}
