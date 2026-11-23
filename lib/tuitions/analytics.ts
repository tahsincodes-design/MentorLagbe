export type DashboardAnalytics = {
  role: "student" | "tutor" | "admin"
  applications: { pending: number; accepted: number; rejected: number }
  tuitions: { pending: number; approved: number; rejected: number } | null
  months: {
    month: string
    applications: number
    acceptedApplications: number
    rejectedApplications: number
    tuitions: number
    approvedTuitions: number
    rejectedTuitions: number
  }[]
}
