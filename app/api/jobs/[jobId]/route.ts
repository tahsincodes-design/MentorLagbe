import { forwardJobs } from "@/lib/jobs-proxy"

type Context = { params: Promise<{ jobId: string }> }

async function handleJob(request: Request, { params }: Context) {
  const { jobId } = await params
  return forwardJobs(request, `/${encodeURIComponent(jobId)}`)
}

export {
  handleJob as GET,
  handleJob as PUT,
  handleJob as PATCH,
  handleJob as DELETE,
}
