import type { Job } from "@/lib/tuitions/types"

export const tuitionSortOptions = [
  ["newest", "Newest first"],
  ["fee-low", "Fee: low to high"],
  ["fee-high", "Fee: high to low"],
] as const

type TuitionSort = (typeof tuitionSortOptions)[number][0]
type TuitionSearchParam = "q" | "subject" | "location" | "min" | "max" | "sort"

export type TuitionSearch = Record<
  Exclude<TuitionSearchParam, "sort">,
  string
> & { sort: TuitionSort }

export function parseMonthlyFee(value: Job["salary"]): number | null {
  if (typeof value === "string" && !/^\d+(?:\.\d*)?$/.test(value.trim())) {
    return null
  }
  if (value == null) return null
  const amount = Number(value)
  return Number.isFinite(amount) && amount >= 0 ? amount : null
}

export function readTuitionSearch(
  params: Pick<URLSearchParams, "get">
): TuitionSearch {
  const min = params.get("min") ?? ""
  const max = params.get("max") ?? ""
  const sort = tuitionSortOptions.find(([key]) => key === params.get("sort"))

  return {
    q: (params.get("q") ?? "").slice(0, 160),
    subject: (params.get("subject") ?? "").trim().toLowerCase(),
    location: (params.get("location") ?? "").trim().toLowerCase(),
    min: parseMonthlyFee(min) === null ? "" : min.trim(),
    max: parseMonthlyFee(max) === null ? "" : max.trim(),
    sort: sort?.[0] ?? "newest",
  }
}

export function tuitionSearchQuery(filters: TuitionSearch) {
  const params = new URLSearchParams()
  for (const [key, value] of Object.entries(filters)) {
    if (value && !(key === "sort" && value === "newest")) params.set(key, value)
  }
  return params.size ? `?${params}` : ""
}

export function tuitionFilterOptions(
  jobs: Job[],
  field: "subject" | "location"
) {
  const labels = new Map<string, string>()
  for (const job of jobs) {
    const label = job[field]?.trim()
    if (label) labels.set(label.toLowerCase(), label)
  }
  return [...labels].sort(([, first], [, second]) =>
    first.localeCompare(second)
  )
}

export function searchTuitions(jobs: Job[], filters: TuitionSearch) {
  const query = filters.q.trim().toLowerCase()
  const min = parseMonthlyFee(filters.min)
  const max = parseMonthlyFee(filters.max)
  const hasFeeFilter = min !== null || max !== null

  const results = jobs.filter((job) => {
    const subject = job.subject?.trim().toLowerCase() ?? ""
    const location = job.location?.trim().toLowerCase() ?? ""
    const matchesQuery =
      `${job.title} ${job.description} ${subject} ${location}`
        .toLowerCase()
        .includes(query)
    if (!matchesQuery) return false
    if (filters.subject && filters.subject !== subject) return false
    if (filters.location && filters.location !== location) return false
    if (!hasFeeFilter) return true

    const fee = parseMonthlyFee(job.salary)
    return (
      fee !== null &&
      (min === null || fee >= min) &&
      (max === null || fee <= max)
    )
  })

  if (filters.sort === "newest") return results

  return results.sort((first, second) => {
    const a = parseMonthlyFee(first.salary)
    const b = parseMonthlyFee(second.salary)
    if (a === null) return b === null ? 0 : 1
    if (b === null) return -1
    return filters.sort === "fee-low" ? a - b : b - a
  })
}
