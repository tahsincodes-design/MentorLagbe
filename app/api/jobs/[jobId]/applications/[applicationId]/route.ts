import { forwardJobs } from "@/lib/jobs-proxy"

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ jobId: string; applicationId: string }> }
) {
  const { jobId, applicationId } = await params
  return forwardJobs(
    request,
    `/${encodeURIComponent(jobId)}/applications/${encodeURIComponent(applicationId)}`
  )
}
