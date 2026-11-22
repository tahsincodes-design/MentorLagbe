import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

import { getAuthSession } from "@/lib/auth"

export async function proxy(request: NextRequest) {
  const session = await getAuthSession(request.headers)

  if (!session) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: "/profile",
}
