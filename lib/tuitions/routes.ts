import { membershipPath } from "@/lib/membership/plans"
import { readTuitionSearch, tuitionSearchQuery } from "@/lib/tuitions/search"

export const tuitionBrowsePath = "/tuitions"
export const tuitionManagePath = "/tuitions/manage"
export const tuitionNewPath = "/tuitions/new"
export const tuitionApprovalsPath = "/admin/tuitions"
export const savedTuitionsPath = "/tuitions/saved"
export const myApplicationsPath = "/applications"
export const dashboardPath = "/dashboard"

export function tuitionDetailPath(tuitionId: string) {
  return `${tuitionBrowsePath}/${encodeURIComponent(tuitionId)}`
}

export function isTuitionDetailPath(path: string) {
  return /^\/tuitions\/[a-f\d]{24}$/i.test(path)
}

export function tuitionSignInPath(next: string) {
  return `/login?next=${encodeURIComponent(next)}`
}

export function tuitionReturnPath(value: string | null) {
  if (
    value === tuitionManagePath ||
    value === tuitionNewPath ||
    value === tuitionApprovalsPath ||
    value === savedTuitionsPath ||
    value === myApplicationsPath ||
    value === dashboardPath ||
    value === membershipPath
  )
    return value
  const [path, query] = value?.split("?", 2) ?? []
  const search = readTuitionSearch(new URLSearchParams(query))
  if (path === tuitionBrowsePath) return path + tuitionSearchQuery(search)
  const match = path?.match(/^\/(?:tuitions|jobs\/jobs)\/([a-f\d]{24})$/i)
  if (!match) return "/"
  return tuitionDetailPath(match[1]) + tuitionSearchQuery(search)
}
