import { forwardJobs } from "@/lib/jobs-proxy"

export function GET(request: Request) {
  return forwardJobs(request, "/saved")
}
