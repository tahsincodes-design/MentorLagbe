import { redirect } from "next/navigation"

import { isTutorRole } from "@/components/auth/roles"
import { TuitionManagementView } from "@/components/tuitions/manage/tuition-management-view"
import { requireTuitionSession } from "@/lib/tuitions/access"
import {
  tuitionApprovalsPath,
  tuitionBrowsePath,
  tuitionManagePath,
  tuitionNewPath,
} from "@/lib/tuitions/routes"

export default async function ManageTuitionsPage({
  searchParams,
}: {
  searchParams: Promise<{ post?: string }>
}) {
  const post = (await searchParams).post === "1"
  const { user, role } = await requireTuitionSession(
    post ? tuitionNewPath : tuitionManagePath
  )
  if (role === "admin" && !post) redirect(tuitionApprovalsPath)
  if (!isTutorRole(role)) redirect(tuitionBrowsePath)

  return <TuitionManagementView user={user} role={role} startPosting={post} />
}
