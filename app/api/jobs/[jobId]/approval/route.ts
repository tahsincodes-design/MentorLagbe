import { forwardJobs } from "@/lib/jobs-proxy"

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ jobId: string }> }
) {
  const { jobId } = await params
  return forwardJobs(request, `/${encodeURIComponent(jobId)}/approval`)
}
