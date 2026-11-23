"use client"

import { useCallback, useEffect, useState } from "react"
import Link from "next/link"
import { ArrowUpRight, Banknote } from "lucide-react"

import { TuitionCard } from "@/components/tuitions/shared/tuition-card"
import { useRefreshListingsOnAccountChange } from "@/components/tuitions/shared/use-refresh-listings"
import { Button, buttonVariants } from "@/components/ui/button"
import { homeRefreshEvent } from "@/lib/home-navigation"
import { fetchHighestPaidTuitions } from "@/lib/tuitions/api"
import { tuitionBrowsePath } from "@/lib/tuitions/routes"
import type { Job } from "@/lib/tuitions/types"
import { cn } from "@/lib/utils"

export function HighestPaidTuitions() {
  const [jobs, setJobs] = useState<Job[] | null>(null)
  const [failed, setFailed] = useState(false)
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    const controller = new AbortController()
    fetchHighestPaidTuitions(controller.signal).then(
      (jobs) => {
        if (!controller.signal.aborted) {
          setJobs(jobs)
          setFailed(false)
        }
      },
      () => {
        if (!controller.signal.aborted) setFailed(true)
      }
    )
    return () => controller.abort()
  }, [attempt])

  const reload = useCallback(() => {
    setFailed(false)
    setAttempt((count) => count + 1)
  }, [])
  const reloadForAccount = useCallback(() => {
    setJobs(null)
    reload()
  }, [reload])
  useRefreshListingsOnAccountChange(reloadForAccount)

  useEffect(() => {
    window.addEventListener(homeRefreshEvent, reload)
    return () => window.removeEventListener(homeRefreshEvent, reload)
  }, [reload])

  return (
    <section
      aria-labelledby="highest-paid-heading"
      className="mx-auto max-w-6xl px-4 py-10 sm:px-8 sm:py-14"
    >
      <div className="rounded-[2rem] border border-brand-coral/20 bg-card p-4 sm:p-6 lg:p-8">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2
              id="highest-paid-heading"
              className="flex items-center gap-2 text-2xl font-extrabold tracking-tight sm:text-3xl"
            >
              <Banknote
                aria-hidden="true"
                className="size-6 shrink-0 text-brand-coral-deep"
              />
              Highest monthly fees
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Up to six approved, active tuitions ranked by monthly fee.
            </p>
          </div>
          <Link
            href={tuitionBrowsePath}
            className={cn(
              buttonVariants({ variant: "outline" }),
              "h-10 rounded-full px-4"
            )}
          >
            Browse all tuitions
            <ArrowUpRight aria-hidden="true" className="size-4" />
          </Link>
        </div>
        {failed ? (
          <div
            role="alert"
            className="flex flex-wrap items-center gap-3 rounded-2xl border bg-background p-4 text-sm"
          >
            <p>Couldn’t load featured tuitions.</p>
            <Button variant="outline" onClick={reload}>
              Try again
            </Button>
          </div>
        ) : !jobs ? (
          <div
            role="status"
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
          >
            <span className="sr-only">Loading tuitions</span>
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                aria-hidden="true"
                className="h-40 rounded-2xl bg-muted motion-safe:animate-pulse"
              />
            ))}
          </div>
        ) : jobs.length ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {jobs.map((job) => (
              <div
                key={job._id}
                className="min-w-0 motion-safe:animate-in motion-safe:duration-300 motion-safe:fade-in motion-safe:slide-in-from-bottom-2"
              >
                <TuitionCard job={job} onChanged={reload} />
              </div>
            ))}
          </div>
        ) : (
          <p className="rounded-2xl border bg-background p-5 text-sm text-muted-foreground">
            No tuitions with a monthly fee are available yet.
          </p>
        )}
      </div>
    </section>
  )
}
