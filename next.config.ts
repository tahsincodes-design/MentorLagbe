import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  redirects() {
    return [
      { source: "/jobs", destination: "/tuitions", permanent: true },
      { source: "/jobs/jobs", destination: "/tuitions", permanent: true },
      {
        source: "/jobs/jobs/:tuitionId",
        destination: "/tuitions/:tuitionId",
        permanent: true,
      },
      {
        source: "/jobs/add-jobs",
        destination: "/tuitions/new",
        permanent: false,
      },
    ]
  },
}

export default nextConfig
