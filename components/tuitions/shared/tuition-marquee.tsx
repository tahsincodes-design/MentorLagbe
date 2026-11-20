"use client"

import { useState } from "react"
import { Pause, Play } from "lucide-react"

import type { Job } from "@/lib/tuitions/types"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export function TuitionMarquee({ jobs }: { jobs: Job[] }) {
  const [paused, setPaused] = useState(false)
  const tuitions = jobs
    .filter((job) => job.approvalStatus === "approved" && job.isActive)
    .slice(0, 8)

  if (!tuitions.length) return null

  return (
    <section
      aria-label="Recent approved tuitions"
      className="mt-5 flex items-center rounded-xl border border-brand-coral/20 bg-brand-coral/5"
    >
      <Button
        type="button"
        size="icon-sm"
        variant="ghost"
        aria-label={paused ? "Resume tuition marquee" : "Pause tuition marquee"}
        className="ms-2 shrink-0 motion-reduce:hidden"
        onClick={() => setPaused((value) => !value)}
      >
        {paused ? <Play /> : <Pause />}
      </Button>
      <div className="min-w-0 flex-1 overflow-hidden motion-reduce:overflow-x-auto">
        <div
          className="flex w-max motion-safe:grid motion-safe:min-w-[200%] motion-safe:animate-[marquee_24s_linear_infinite] motion-safe:grid-cols-2"
          style={paused ? { animationPlayState: "paused" } : undefined}
        >
          <TuitionTrack tuitions={tuitions} />
          <TuitionTrack tuitions={tuitions} duplicate />
        </div>
      </div>
    </section>
  )
}

function TuitionTrack({
  tuitions,
  duplicate = false,
}: {
  tuitions: Job[]
  duplicate?: boolean
}) {
  return (
    <ul
      aria-hidden={duplicate || undefined}
      className={
        duplicate
          ? "flex shrink-0 items-center gap-4 px-3 py-2.5 motion-reduce:hidden"
          : "flex shrink-0 items-center gap-4 px-3 py-2.5"
      }
    >
      {tuitions.map((job) => (
        <li
          key={job._id}
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
        </li>
      ))}
    </ul>
  )
}
