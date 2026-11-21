export type ApprovalStatus = "pending" | "approved" | "rejected"

export const approvalLabels: Record<ApprovalStatus, string> = {
  pending: "Pending approval",
  approved: "Approved",
  rejected: "Rejected",
}

export type Job = {
  _id: string
  title: string
  description: string
  subject?: string
  salary?: number | string | null
  location?: string
  approvalStatus: ApprovalStatus
  isActive: boolean
  revision: number
  createdAt?: string
  postedBy?: {
    name?: string
  }
  canManage: boolean
  canModerate: boolean
}

export type JobPayload = {
  title: string
  description: string
  subject: string
  salary: string
  location: string
  isActive?: boolean
}

export type ApplicationStatus = "pending" | "accepted" | "rejected"

export const applicationStatusLabels: Record<ApplicationStatus, string> = {
  pending: "Pending review",
  accepted: "Accepted",
  rejected: "Declined",
}

export type StudentApplication = {
  _id: string
  tuitionId: string
  title: string | null
  tutorName: string | null
  status: ApplicationStatus
  createdAt?: string | null
  available: boolean
}

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
