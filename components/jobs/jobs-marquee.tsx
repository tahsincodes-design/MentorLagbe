"use client"

import type { Job } from "@/components/jobs/job-types"
import { Badge } from "@/components/ui/badge"

export function JobsMarquee({ jobs }: { jobs: Job[] }) {
  const recentJobs = jobs.filter((job) => job.status !== "closed").slice(0, 8)

  if (!recentJobs.length) {
    return (
      <div className="overflow-hidden rounded-xl border border-brand-coral/20 bg-brand-coral/5 px-4 py-3 text-sm text-muted-foreground">
        No recent jobs are available yet.
      </div>
    )
  }

  return (
    <div className="relative overflow-hidden rounded-xl border border-brand-coral/20 bg-brand-coral/5 py-2.5">
      <div className="flex w-max animate-[marquee_24s_linear_infinite] items-center gap-3 px-3 hover:[animation-play-state:paused]">
        {[...recentJobs, ...recentJobs].map((job, index) => (
          <div
            key={`${job._id}-${index}`}
            className="flex items-center gap-2 text-sm whitespace-nowrap"
          >
            <span className="font-bold text-foreground">{job.title}</span>
            {job.subject ? (
              <Badge
                variant="outline"
                className="rounded-full border-brand-coral/30 bg-card text-[0.65rem] text-brand-coral-deep"
              >
                {job.subject}
              </Badge>
            ) : null}
            {job.salary != null && job.salary !== "" ? (
              <span className="font-semibold text-brand-coral-deep">
                ৳{job.salary}
              </span>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  )
}
