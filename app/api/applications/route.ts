import { readMyApplications } from "@/lib/jobs-proxy"

export function GET(request: Request) {
  return readMyApplications(request.headers)
}
