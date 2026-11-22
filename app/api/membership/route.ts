import { isTutorRole } from "@/components/auth/roles"
import { auth } from "@/lib/auth"
import {
  BillingError,
  createMembershipCheckout,
  createMembershipPortal,
} from "@/lib/membership/stripe"

export async function POST(request: Request) {
  if (request.headers.get("sec-fetch-site") === "cross-site") {
    return Response.json(
      { message: "Open billing from MentorLagbe." },
      { status: 403 }
    )
  }

  try {
    const session = await auth.api.getSession({ headers: request.headers })
    if (!session)
      return Response.json(
        { message: "Please sign in first." },
        { status: 401 }
      )
    if (!isTutorRole(session.user.role)) {
      return Response.json(
        { message: "Memberships are for tutor accounts." },
        { status: 403 }
      )
    }

    const action = (await request.json().catch(() => null))?.action
    if (action !== "checkout" && action !== "portal") {
      return Response.json(
        { message: "Choose a valid billing action." },
        { status: 400 }
      )
    }

    const url =
      action === "checkout"
        ? await createMembershipCheckout(session.user.id, session.user.email)
        : await createMembershipPortal(session.user.id)
    return Response.json(
      { url },
      { headers: { "Cache-Control": "private, no-store" } }
    )
  } catch (error) {
    if (error instanceof BillingError) {
      return Response.json({ message: error.message }, { status: error.status })
    }
    console.error(
      "Could not open Stripe billing.",
      error instanceof Error ? error.name : ""
    )
    return Response.json(
      { message: "Billing is unavailable right now. Please try again." },
      { status: 502 }
    )
  }
}
