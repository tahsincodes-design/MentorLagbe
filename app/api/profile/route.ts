import { NextRequest, NextResponse } from "next/server"

import { auth, db } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    })

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = session.user.id

    // TODO(API): replace "applications" with the actual collection name.
    // Store application documents with fields: userId and status.
    const applications = db.collection("applications")
    const totalApplied = await applications.countDocuments({ userId })
    const accepted = await applications.countDocuments({
      userId,
      status: "accepted",
    })

    // TODO(API): replace "subscriptions" with the actual collection name.
    // Store subscription documents with fields: userId and plan.
    const subscription = await db.collection("subscriptions").findOne({
      userId,
    })

    const plan =
      typeof subscription?.plan === "string" ? subscription.plan : "Free"

    return NextResponse.json({
      stats: {
        totalApplied,
        accepted,
      },
      plan,
    })
  } catch (error) {
    console.error("Could not load profile data:", error)
    return NextResponse.json(
      { error: "Could not load profile data" },
      { status: 500 }
    )
  }
}
