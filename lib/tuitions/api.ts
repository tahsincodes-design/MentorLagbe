import type {
  ApplicationStatus,
  ApprovalStatus,
  Job,
  JobPayload,
} from "@/lib/tuitions/types"

async function request<T>(path: string, method = "GET", payload?: object) {
  const response = await fetch(path, {
    method,
    cache: "no-store",
    headers: payload ? { "Content-Type": "application/json" } : undefined,
    body: payload ? JSON.stringify(payload) : undefined,
  })
  const data = await response.json().catch(() => null)
  if (!response.ok || !data?.success) {
    throw new Error(
      data?.message ?? `Request failed with status ${response.status}`
    )
  }
  return data as T
}

function jobPath(jobId: string) {
  return `/api/jobs/${encodeURIComponent(jobId)}`
}

export async function fetchJobs(view: "browse" | "manage" = "browse") {
  const result = await request<{ data: Job[] }>(
    view === "manage" ? "/api/jobs?view=manage" : "/api/jobs"
  )
  return result.data
}

export async function createJob(payload: JobPayload) {
  const result = await request<{ data: Job }>("/api/jobs", "POST", payload)
  return result.data
}

export async function updateJob(jobId: string, payload: Partial<JobPayload>) {
  const result = await request<{ data: Job }>(jobPath(jobId), "PATCH", payload)
  return result.data
}

export function setJobStatus(jobId: string, isActive: boolean) {
  return updateJob(jobId, { isActive })
}

export function reviewTuition(
  jobId: string,
  revision: number,
  approvalStatus: Exclude<ApprovalStatus, "pending">
) {
  return request(`${jobPath(jobId)}/approval`, "PATCH", {
    approvalStatus,
    revision,
  })
}

export function deleteJob(jobId: string) {
  return request(jobPath(jobId), "DELETE")
}

export async function applyForJob(jobId: string, message: string) {
  const result = await request<{ data: { status: ApplicationStatus } }>(
    `${jobPath(jobId)}/applications`,
    "POST",
    { message }
  )
  return result.data
}

export function reviewJobApplication(
  jobId: string,
  applicationId: string,
  status: "accepted" | "rejected"
) {
  return request(
    `${jobPath(jobId)}/applications/${encodeURIComponent(applicationId)}`,
    "PATCH",
    { status }
  )
}
