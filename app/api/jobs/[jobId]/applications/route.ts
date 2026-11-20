import { forwardJobs } from "@/lib/jobs-proxy"

export async function POST(
  request: Request,
  { params }: { params: Promise<{ jobId: string }> }
) {
  const { jobId } = await params
  return forwardJobs(request, `/${encodeURIComponent(jobId)}/applications`)
}
