export type JobStatus = "open" | "closed"

export type Job = {
  _id: string
  title: string
  description: string
  subject?: string
  salary?: number | string | null
  location?: string
  status?: JobStatus | string
  createdAt?: string
  postedBy?: {
    name?: string
  }
  canManage?: boolean
}

export type JobPayload = {
  title: string
  description: string
  subject: string
  salary: string
  location: string
  status?: JobStatus
}

export type ApplicationStatus = "pending" | "accepted" | "rejected"

export type JobApplication = {
  _id: string
  name: string
  message: string
  status: ApplicationStatus
}

export type JobDetails = {
  data: Job
  application: { status: ApplicationStatus } | null
  applicants: JobApplication[]
}
