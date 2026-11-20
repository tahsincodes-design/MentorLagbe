export const tuitionBrowsePath = "/tuitions"
export const tuitionManagePath = "/tuitions/manage"

export function tuitionDetailPath(tuitionId: string) {
  return `${tuitionBrowsePath}/${encodeURIComponent(tuitionId)}`
}

export function tuitionReturnPath(value: string | null) {
  if (value === tuitionManagePath) return tuitionManagePath
  const match = value?.match(/^\/(?:tuitions|jobs\/jobs)\/([a-f\d]{24})$/i)
  return match ? tuitionDetailPath(match[1]) : "/"
}
