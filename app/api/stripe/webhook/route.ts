import type Stripe from "stripe"

import { getBillingMode } from "@/lib/membership/store"
import { getStripe, synchronizeCustomer } from "@/lib/membership/stripe"

export async function POST(request: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET?.trim()
  const signature = request.headers.get("stripe-signature")
  if (!secret)
    return new Response("Webhook signing is not configured", { status: 503 })
  if (!signature)
    return new Response("Missing Stripe signature", { status: 400 })

  try {
    const stripe = getStripe()
    let event: Stripe.Event
    try {
      event = stripe.webhooks.constructEvent(
        await request.text(),
        signature,
        secret
      )
    } catch {
      return new Response("Invalid Stripe signature", { status: 400 })
    }
    if (event.livemode !== (getBillingMode() === "live")) {
      return new Response("Incorrect Stripe mode", { status: 400 })
    }

    switch (event.type) {
      case "checkout.session.completed":
      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted":
      case "customer.subscription.paused":
      case "customer.subscription.resumed":
      case "invoice.paid":
      case "invoice.payment_failed": {
        const customer = event.data.object.customer
        const customerId =
          typeof customer === "string" ? customer : customer?.id
        if (customerId) await synchronizeCustomer(stripe, customerId)
        break
      }
    }
    return Response.json({ received: true })
  } catch (error) {
    console.error(
      "Could not synchronize Stripe membership.",
      error instanceof Error ? error.name : ""
    )
    return new Response("Could not synchronize membership", { status: 500 })
  }
}
