import { redirect } from "next/navigation"

import { TuitionManagementView } from "@/components/tuitions/manage/tuition-management-view"
import { requireTuitionSession } from "@/lib/tuitions/access"
import { tuitionApprovalsPath, tuitionBrowsePath } from "@/lib/tuitions/routes"

export default async function TuitionApprovalsPage() {
  const { user, role } = await requireTuitionSession(tuitionApprovalsPath)
  if (role !== "admin") redirect(tuitionBrowsePath)

  return <TuitionManagementView user={user} role={role} />
}
