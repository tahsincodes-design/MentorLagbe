import { membershipPath } from "@/lib/membership/plans"
import { readTuitionSearch, tuitionSearchQuery } from "@/lib/tuitions/search"

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
  const [path, query] = value?.split("?", 2) ?? []
  const match = path?.match(/^\/(?:tuitions|jobs\/jobs)\/([a-f\d]{24})$/i)
  if (!match) return "/"
  const search = readTuitionSearch(new URLSearchParams(query))
  return tuitionDetailPath(match[1]) + tuitionSearchQuery(search)
}
