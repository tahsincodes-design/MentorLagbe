import { randomUUID } from "node:crypto"
import Stripe from "stripe"

import { membershipPath } from "@/lib/membership/plans"
import {
  getBillingAccount,
  getBillingField,
  getBillingMode,
  memberships,
  readBillingAccount,
} from "@/lib/membership/store"

export class BillingError extends Error {
  constructor(
    message: string,
    public readonly status: number
  ) {
    super(message)
  }
}

export function getStripe() {
  const key = (
    process.env.STRIPE_API_SECRET_KEY ?? process.env.STRIPE_SECRET_KEY
  )?.trim()
  if (!key || !new RegExp(`^(sk|rk)_${getBillingMode()}_`).test(key)) {
    throw new BillingError(
      "Membership payments are unavailable right now.",
      503
    )
  }
  return new Stripe(key, { timeout: 12_000, maxNetworkRetries: 1 })
}

export async function getProPrice(stripe = getStripe()) {
  const id = process.env.STRIPE_PRO_PRICE_ID?.trim()
  if (!id) throw new BillingError("The Pro price is not available.", 503)
  const price = await stripe.prices.retrieve(id)
  if (
    !price.active ||
    price.billing_scheme !== "per_unit" ||
    price.unit_amount == null ||
    price.unit_amount <= 0 ||
    price.recurring?.interval !== "month" ||
    price.recurring.interval_count !== 1
  ) {
    throw new BillingError("The Pro price is not available.", 503)
  }
  return price
}

function stripeId(resource: string | { id: string } | null) {
  return typeof resource === "string" ? resource : resource?.id
}

function membershipUrl() {
  const configured = process.env.BILLING_BASE_URL || process.env.BETTER_AUTH_URL
  if (!configured)
    throw new BillingError(
      "Membership payments are unavailable right now.",
      503
    )
  const url = new URL(membershipPath, configured)
  if (
    url.protocol !== "https:" &&
    !["localhost", "127.0.0.1", "[::1]"].includes(url.hostname)
  ) {
    throw new BillingError(
      "Membership payments are unavailable right now.",
      503
    )
  }
  return url.toString()
}

export async function synchronizeCustomer(stripe: Stripe, customerId: string) {
  const billingField = getBillingField()
  const customerField = `${billingField}.customerId`
  const revisionField = `${billingField}.syncRevision`
  const membership = await memberships.findOneAndUpdate(
    { [customerField]: customerId },
    { $inc: { [revisionField]: 1 } },
    { returnDocument: "after" }
  )
  if (!membership) return

  const price = await getProPrice(stripe)
  const subscriptions = await stripe.subscriptions.list({
    customer: customerId,
    status: "all",
    limit: 100,
  })
  const productId = stripeId(price.product)
  const relevant = subscriptions.data.flatMap((subscription) => {
    const item = subscription.items.data.find(
      ({ price }) =>
        stripeId(price.product) === productId &&
        price.recurring?.interval === "month" &&
        price.recurring.interval_count === 1 &&
        (price.unit_amount ?? 0) > 0
    )
    return item ? [{ subscription, item }] : []
  })
  const active = relevant.find(
    ({ subscription, item }) =>
      (subscription.status === "active" ||
        subscription.status === "trialing") &&
      item.current_period_end * 1000 > Date.now()
  )
  const managed =
    active ??
    relevant.find(
      ({ subscription }) =>
        subscription.status !== "canceled" &&
        subscription.status !== "incomplete_expired"
    )
  const cancelDate =
    managed?.subscription.cancel_at ??
    (managed?.subscription.cancel_at_period_end
      ? managed.item.current_period_end
      : null)
  await memberships.updateOne(
    {
      _id: membership._id,
      [customerField]: customerId,
      [revisionField]: readBillingAccount(membership, billingField)
        ?.syncRevision,
    },
    {
      $set: {
        [`${billingField}.plan`]: active ? "premium" : "free",
        [`${billingField}.subscriptionId`]: managed?.subscription.id ?? null,
        [`${billingField}.status`]:
          (managed ?? relevant[0])?.subscription.status ?? null,
        [`${billingField}.accessUntil`]: active
          ? new Date(active.item.current_period_end * 1000)
          : null,
        [`${billingField}.cancelAt`]: cancelDate
          ? new Date(cancelDate * 1000)
          : null,
      },
    }
  )
  return managed?.subscription
}

async function getOrCreateCustomer(
  stripe: Stripe,
  userId: string,
  email: string
) {
  const billingField = getBillingField()
  const customerField = `${billingField}.customerId`
  const existing = (await getBillingAccount(userId))?.customerId
  if (existing) return existing

  const customer = await stripe.customers.create(
    { email, metadata: { mentorLagbeUserId: userId } },
    { idempotencyKey: `mentorlagbe-customer-v1-${userId}` }
  )
  try {
    await memberships.updateOne(
      { _id: userId, [customerField]: { $exists: false } },
      {
        $set: {
          [customerField]: customer.id,
          [`${billingField}.plan`]: "free",
        },
      },
      { upsert: true }
    )
  } catch (error) {
    if (!(error instanceof Error && "code" in error && error.code === 11000))
      throw error
  }
  const saved = (await getBillingAccount(userId))?.customerId
  if (!saved) throw new Error("Could not save the Stripe customer")
  return saved
}

export async function createMembershipCheckout(userId: string, email: string) {
  if (
    getBillingMode() === "live" &&
    !process.env.STRIPE_WEBHOOK_SECRET?.trim()
  ) {
    throw new BillingError(
      "Membership payments are unavailable right now.",
      503
    )
  }
  const stripe = getStripe()
  const returnUrl = membershipUrl()
  const price = await getProPrice(stripe)
  const customer = await getOrCreateCustomer(stripe, userId, email)
  if (await synchronizeCustomer(stripe, customer)) {
    throw new BillingError(
      "You already have a subscription. Open Manage billing to make changes.",
      409
    )
  }

  const billingField = getBillingField()
  const field = `${billingField}.checkout`
  const now = new Date()
  const attempt = {
    token: randomUUID(),
    until: new Date(now.getTime() + 24 * 60 * 60 * 1000),
  }
  const reserved = await memberships.findOneAndUpdate(
    {
      _id: userId,
      [`${billingField}.subscriptionId`]: null,
      $or: [
        { [field]: { $exists: false } },
        { [`${field}.until`]: { $lte: now } },
      ],
    },
    { $set: { [field]: attempt } },
    { returnDocument: "after" }
  )
  const account =
    readBillingAccount(reserved, billingField) ??
    (await getBillingAccount(userId))
  if (!account?.checkout || account.subscriptionId) {
    throw new BillingError(
      "Your billing status just changed. Refresh and try again.",
      409
    )
  }

  const checkout = account.checkout
  const session = checkout.sessionId
    ? await stripe.checkout.sessions.retrieve(checkout.sessionId)
    : await stripe.checkout.sessions.create(
        {
          mode: "subscription",
          allowed_payment_method_types: ["card"],
          customer,
          client_reference_id: userId,
          line_items: [{ price: price.id, quantity: 1 }],
          success_url: `${returnUrl}?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${returnUrl}?checkout=cancelled`,
        },
        { idempotencyKey: `mentorlagbe-checkout-${checkout.token}` }
      )

  const checkoutFilter = { _id: userId, [`${field}.token`]: checkout.token }
  if (session.status !== "open" || !session.url) {
    if (session.status === "complete")
      await synchronizeCustomer(stripe, customer)
    await memberships.updateOne(checkoutFilter, { $unset: { [field]: "" } })
    throw new BillingError(
      "That checkout has ended. Refresh to see your membership.",
      409
    )
  }
  await memberships.updateOne(checkoutFilter, {
    $set: {
      [`${field}.sessionId`]: session.id,
      [`${field}.until`]: new Date(session.expires_at * 1000),
    },
  })
  return session.url
}

export async function confirmMembershipCheckout(
  userId: string,
  sessionId: string
) {
  if (!/^cs_(test|live)_[a-zA-Z0-9]+$/.test(sessionId)) return false
  const stripe = getStripe()
  const account = await getBillingAccount(userId)
  if (!account?.customerId) return false
  const session = await stripe.checkout.sessions.retrieve(sessionId)
  if (
    session.client_reference_id !== userId ||
    stripeId(session.customer) !== account.customerId ||
    session.mode !== "subscription" ||
    session.status !== "complete" ||
    session.payment_status !== "paid"
  )
    return false

  await synchronizeCustomer(stripe, account.customerId)
  return true
}

export async function createMembershipPortal(userId: string) {
  const account = await getBillingAccount(userId)
  if (!account?.customerId)
    throw new BillingError("Start a Pro membership to open billing.", 409)
  const portal = await getStripe().billingPortal.sessions.create({
    customer: account.customerId,
    configuration:
      process.env.STRIPE_PORTAL_CONFIGURATION_ID?.trim() || undefined,
    return_url: `${membershipUrl()}?billing=returned`,
  })
  return portal.url
}
