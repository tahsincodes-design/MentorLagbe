import { forwardJobs } from "@/lib/jobs-proxy"

type Context = { params: Promise<{ tuitionId: string }> }

async function bookmark(request: Request, { params }: Context) {
  const { tuitionId } = await params
  return forwardJobs(request, `/saved/${encodeURIComponent(tuitionId)}`)
}

export { bookmark as PUT, bookmark as DELETE }
