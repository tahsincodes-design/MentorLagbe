export type JobStatus = "open" | "closed"

export type Job = {
  _id?: string
  id?: string
  title: string
  description: string
  subject?: string
  salary?: number | string | null
  location?: string
  status?: JobStatus | string
  createdAt?: string
  postedBy?: {
    name?: string
    email?: string
    role?: string
  }
}

export type JobPayload = {
  title: string
  description: string
  subject: string
  salary: string
  location: string
}
