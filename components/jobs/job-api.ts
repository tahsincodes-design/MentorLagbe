import type { Job, JobPayload, JobStatus } from "@/components/jobs/job-types"

const API_BASE_URL = (
  process.env.NEXT_PUBLIC_BASE_API_URL ?? "http://localhost:5000"
).replace(/\/$/, "")

async function getAuthHeaders() {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  }
  return headers
}

async function readResponse<T>(response: Response): Promise<T> {
  const data = await response.json().catch(() => null)

  if (!response.ok) {
    throw new Error(
      data?.message ??
        data?.error ??
        `Request failed with status ${response.status}`
    )
  }

  return data as T
}

export async function fetchJobs(): Promise<Job[]> {
  const response = await fetch("/api/jobs", {
    method: "GET",
    cache: "no-store",
  })
  const data = await readResponse<{ success: boolean; data?: Job[] }>(response)
  return Array.isArray(data.data) ? data.data : []
}

export async function createJob(payload: JobPayload): Promise<Job> {
  const headers = await getAuthHeaders()
  const response = await fetch("/api/jobs", {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
  })
  const data = await readResponse<{ success: boolean; data?: Job }>(response)
  if (!data.data) throw new Error("The API did not return the created job.")
  return data.data
}

export async function updateJob(jobId: string, payload: JobPayload) {
  const headers = await getAuthHeaders()
  const response = await fetch(`${API_BASE_URL}/jobs/${jobId}`, {
    method: "PUT",
    headers,
    body: JSON.stringify(payload),
  })
  return readResponse<{ success: boolean; data?: Job }>(response)
}

export async function setJobStatus(jobId: string, status: JobStatus) {
  const headers = await getAuthHeaders()
  const response = await fetch(`${API_BASE_URL}/jobs/${jobId}`, {
    method: "PATCH",
    headers,
    body: JSON.stringify({ status }),
  })
  return readResponse<{ success: boolean; data?: Job }>(response)
}

export async function deleteJob(jobId: string) {
  const headers = await getAuthHeaders()
  const response = await fetch(`${API_BASE_URL}/jobs/${jobId}`, {
    method: "DELETE",
    headers,
  })
  return readResponse<{ success: boolean }>(response)
}
