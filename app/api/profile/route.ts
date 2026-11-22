import { NextRequest, NextResponse } from "next/server"

import { db, getAuthSession } from "@/lib/auth"
import { getBillingAccount, hasPremium } from "@/lib/membership/store"

export async function GET(request: NextRequest) {
  try {
    const session = await getAuthSession(request.headers)

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = session.user.id

    const applications = db.collection("applications")
    const studentEmail = session.user.email
    const [totalApplied, accepted] = await Promise.all([
      applications.countDocuments({ studentEmail }),
      applications.countDocuments({ studentEmail, status: "accepted" }),
    ])

    const plan = hasPremium(await getBillingAccount(userId)) ? "Pro" : "Free"

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
