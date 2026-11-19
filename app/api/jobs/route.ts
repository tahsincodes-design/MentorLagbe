import { NextRequest, NextResponse } from "next/server"

import { auth } from "@/lib/auth"

const API_BASE_URL = (
  process.env.NEXT_PUBLIC_BASE_API_URL ?? "http://localhost:5000"
).replace(/\/$/, "")

export async function GET() {
  try {
    const response = await fetch(`${API_BASE_URL}/jobs`, {
      method: "GET",
      cache: "no-store",
      headers: {
        Accept: "application/json",
      },
    })

    const data = await response.json().catch(() => null)

    if (!response.ok) {
      return NextResponse.json(
        data ?? { success: false, message: "Could not load jobs." },
        { status: response.status }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Could not fetch jobs:", error)
    return NextResponse.json(
      { success: false, message: "Could not reach the jobs API." },
      { status: 502 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    })

    if (!session?.user) {
      return NextResponse.json(
        { success: false, message: "Please sign in to post a job." },
        { status: 401 }
      )
    }

    const role = (session.user.role ?? "student").toLowerCase()
    if (role !== "student" && role !== "admin") {
      return NextResponse.json(
        { success: false, message: "Only students and admins can post jobs." },
        { status: 403 }
      )
    }

    const body = await request.json()
    const response = await fetch(`${API_BASE_URL}/jobs`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "x-user-email": session.user.email,
        "x-user-name": session.user.name,
        "x-user-role": role,
        "user-email": session.user.email,
        "user-name": session.user.name,
        "user-role": role,
        email: session.user.email,
        role,
      },
      body: JSON.stringify(body),
    })

    const data = await response.json().catch(() => null)

    if (!response.ok) {
      return NextResponse.json(
        data ?? { success: false, message: "Could not post the job." },
        { status: response.status }
      )
    }

    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error("Could not create job:", error)
    return NextResponse.json(
      { success: false, message: "Could not reach the jobs API." },
      { status: 502 }
    )
  }
}
