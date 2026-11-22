import { membershipPath } from "@/lib/membership/plans"

export const tuitionBrowsePath = "/tuitions"
export const tuitionManagePath = "/tuitions/manage"
export const myApplicationsPath = "/applications"

export function tuitionDetailPath(tuitionId: string) {
  return `${tuitionBrowsePath}/${encodeURIComponent(tuitionId)}`
}

export function tuitionReturnPath(value: string | null) {
  if (
    value === tuitionManagePath ||
    value === myApplicationsPath ||
    value === membershipPath
  )
    return value
  const match = value?.match(/^\/(?:tuitions|jobs\/jobs)\/([a-f\d]{24})$/i)
  return match ? tuitionDetailPath(match[1]) : "/"
}
