export const membershipPath = "/membership"
export const freeTuitionLimit = 2
export type MembershipPlan = "free" | "premium"

export type DashboardMembership = {
  plan: MembershipPlan
  tuitionCount: number
  tuitionLimit: number | null
  insights?: { published: number; applications: number }
}
