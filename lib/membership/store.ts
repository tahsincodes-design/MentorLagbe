import { db } from "@/lib/auth"

export type BillingMode = "test" | "live"
type BillingField = BillingMode | `testSandboxes.${string}`

export type BillingAccount = {
  plan?: "free" | "premium"
  customerId?: string
  subscriptionId?: string | null
  status?: string | null
  accessUntil?: Date | null
  cancelAt?: Date | null
  syncRevision?: number
  checkout?: { token: string; until: Date; sessionId?: string }
}

type Membership = {
  _id: string
  test?: BillingAccount
  live?: BillingAccount
  testSandboxes?: Record<string, BillingAccount>
}

export const memberships = db.collection<Membership>("memberships")

export function getBillingMode(): BillingMode {
  return process.env.STRIPE_MEMBERSHIP_MODE === "test" ? "test" : "live"
}

export function getBillingField(): BillingField {
  const mode = getBillingMode()
  const account = process.env.STRIPE_TEST_SANDBOX_ID?.trim()
  if (mode !== "test" || !account) return mode
  if (!/^acct_[a-zA-Z0-9]+$/.test(account)) {
    throw new Error("Invalid Stripe test sandbox account ID")
  }
  return `testSandboxes.${account}`
}

export function readBillingAccount(
  membership: Membership | null,
  field: BillingField
) {
  if (field === "test" || field === "live") return membership?.[field]
  return membership?.testSandboxes?.[field.slice("testSandboxes.".length)]
}

export async function getBillingAccount(userId: string) {
  return readBillingAccount(
    await memberships.findOne({ _id: userId }),
    getBillingField()
  )
}

export function hasPremium(account: BillingAccount | undefined) {
  return (
    account?.plan === "premium" &&
    account.accessUntil instanceof Date &&
    account.accessUntil.getTime() > Date.now()
  )
}
