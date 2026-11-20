import { auth } from "@/lib/auth"

function errorResponse(status: number, message: string) {
  return Response.json({ success: false, message }, { status })
}

export async function forwardJobs(request: Request, path = "") {
  const dashboard =
    !path &&
    request.method === "GET" &&
    new URL(request.url).searchParams.get("view") === "manage"
  return requestJobs(
    request.method,
    path,
    request.headers,
    () => request.json(),
    dashboard
  )
}

export function readJobDetails(jobId: string, headers: Headers) {
  return requestJobs("GET", `/${encodeURIComponent(jobId)}`, headers)
}

async function requestJobs(
  method: string,
  path: string,
  requestHeaders: Headers,
  readBody?: () => Promise<unknown>,
  dashboard = false
) {
  if (
    path &&
    !/^\/[a-f\d]{24}(?:\/approval|\/applications(?:\/[a-f\d]{24})?)?$/i.test(
      path
    )
  ) {
    return errorResponse(404, "The requested job or application was not found.")
  }
  const secret = process.env.JOBS_API_SECRET?.trim()
  if (!secret) return errorResponse(503, "The jobs service is not configured.")

  const readOnly = method === "GET"
  try {
    const session = await auth.api.getSession({ headers: requestHeaders })
    if (!readOnly && !session)
      return errorResponse(401, "Please sign in to continue.")

    const adminNeedsCode =
      session?.user.role?.toLowerCase() === "admin" &&
      !session.session.adminCodeVerified
    if (adminNeedsCode && (!readOnly || dashboard)) {
      return errorResponse(403, "Sign in again with your admin access code.")
    }

    const headers = new Headers({
      Accept: "application/json",
      "x-jobs-api-secret": secret,
    })
    if (session && !adminNeedsCode) headers.set("x-user-id", session.user.id)

    let body: string | undefined
    if (method !== "GET" && method !== "DELETE") {
      const data = await readBody?.().catch(() => null)
      if (!data || typeof data !== "object" || Array.isArray(data)) {
        return errorResponse(400, "Send a valid JSON object.")
      }
      body = JSON.stringify(data)
      headers.set("Content-Type", "application/json")
    }

    const baseUrl = (
      process.env.JOBS_API_URL?.trim() ||
      process.env.NEXT_PUBLIC_BASE_API_URL?.trim() ||
      "http://localhost:5000"
    ).replace(/\/+$/, "")
    const response = await fetch(
      `${baseUrl}/jobs${path}${dashboard ? "?view=manage" : ""}`,
      {
        method,
        headers,
        body,
        cache: "no-store",
        redirect: "error",
        signal: AbortSignal.timeout(10_000),
      }
    )
    const data = await response.json().catch(() => null)
    if (!data) {
      return errorResponse(
        502,
        "The jobs service returned an unexpected response. Check that the updated server is running."
      )
    }
    return Response.json(data, {
      status: response.status,
      headers: { "Cache-Control": "private, no-store" },
    })
  } catch (error) {
    console.error("Jobs request failed:", error)
    return errorResponse(
      502,
      "Could not reach the jobs service. Please try again."
    )
  }
}
