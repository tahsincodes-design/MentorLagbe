import { getAuthSession } from "@/lib/auth"
import {
  getJobsJwtKey,
  jobsJwtCookie,
  jobsJwtReceiptHeader,
  signJobsRequest,
  verifyJobsReceipt,
} from "@/lib/jobs-jwt"

function errorResponse(status: number, message: string) {
  return Response.json(
    { success: false, message },
    { status, headers: { "Cache-Control": "private, no-store" } }
  )
}

export async function forwardJobs(request: Request, path = "") {
  const requestedView = new URL(request.url).searchParams.get("view")
  const view =
    !path &&
    request.method === "GET" &&
    (requestedView === "manage" || requestedView === "highest-paid")
      ? requestedView
      : undefined
  return requestJobs(
    request.method,
    path,
    request.headers,
    () => request.json(),
    view
  )
}

export function readJobDetails(jobId: string, headers: Headers) {
  return requestJobs("GET", `/${encodeURIComponent(jobId)}`, headers)
}

export function readMyApplications(headers: Headers) {
  return requestJobs("GET", "/applications", headers)
}

export function readSavedTuitions(headers: Headers) {
  return requestJobs("GET", "/saved", headers)
}

async function requestJobs(
  method: string,
  path: string,
  requestHeaders: Headers,
  readBody?: () => Promise<unknown>,
  view?: "manage" | "highest-paid"
) {
  const applicationHistory = path === "/applications"
  const savedTuitions = /^\/saved(?:\/[a-f\d]{24})?$/i.test(path)
  if (
    path &&
    !applicationHistory &&
    !savedTuitions &&
    path !== "/analytics" &&
    !/^\/[a-f\d]{24}(?:\/approval|\/applications(?:\/[a-f\d]{24})?)?$/i.test(
      path
    )
  ) {
    return errorResponse(404, "The requested job or application was not found.")
  }
  const key = getJobsJwtKey()
  if (!key) return errorResponse(503, "The jobs service is not configured.")

  const readOnly = method === "GET"
  const requiresSession = !readOnly || Boolean(path) || view === "manage"
  const requestSite = requestHeaders.get("sec-fetch-site")
  if (!readOnly && requestSite && requestSite !== "same-origin") {
    return errorResponse(403, "Open MentorLagbe to make changes.")
  }
  try {
    const session = await getAuthSession(requestHeaders)
    if (requiresSession && !session)
      return errorResponse(401, "Please sign in to continue.")
    if (
      applicationHistory &&
      (session?.user.role ?? "student").toLowerCase() !== "student"
    ) {
      return errorResponse(403, "Only students can view this page.")
    }

    const adminNeedsCode =
      session?.user.role?.toLowerCase() === "admin" &&
      !session.session.adminCodeVerified
    if (adminNeedsCode && requiresSession) {
      return errorResponse(401, "Sign in again with your admin access code.")
    }

    const headers = new Headers({ Accept: "application/json" })
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
    const resource = `/jobs${path}${view ? `?view=${view}` : ""}`
    const url = new URL(baseUrl + resource)
    if (
      url.protocol !== "https:" &&
      (url.protocol !== "http:" ||
        !["localhost", "127.0.0.1", "[::1]"].includes(url.hostname))
    ) {
      return errorResponse(
        503,
        "The jobs service connection is not configured."
      )
    }

    const { token, requestId } = await signJobsRequest({
      key,
      method,
      resource,
      user:
        session && !adminNeedsCode
          ? {
              id: session.user.id,
              role: (session.user.role ?? "student").toLowerCase(),
              adminVerified: session.session.adminCodeVerified === true,
            }
          : undefined,
    })
    headers.set("Cookie", `${jobsJwtCookie}=${token}`)
    const response = await fetch(url, {
      method,
      headers,
      body,
      cache: "no-store",
      redirect: "error",
      signal: AbortSignal.timeout(10_000),
    })
    if (
      !(await verifyJobsReceipt(
        response.headers.get(jobsJwtReceiptHeader),
        requestId,
        key
      ))
    ) {
      await response.body?.cancel().catch(() => {})
      return errorResponse(502, "Could not verify the jobs service response.")
    }
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
