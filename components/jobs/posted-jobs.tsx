"use client"

import * as React from "react"
import { Plus } from "lucide-react"

import { fetchJobs } from "@/components/jobs/job-api"
import type { Job } from "@/components/jobs/job-types"
import { AddJobDialog } from "@/components/jobs/add-job-dialog"
import { JobCard } from "@/components/jobs/job-card"
import { JobsMarquee } from "@/components/jobs/jobs-marquee"
import { Button } from "@/components/ui/button"

export function PostedJobs({
  role,
  openAddJob,
  onOpenAddJobChange,
}: {
  role: string
  openAddJob?: boolean
  onOpenAddJobChange?: (open: boolean) => void
}) {
  const [jobs, setJobs] = React.useState<Job[]>([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState("")
  const [internalAddOpen, setInternalAddOpen] = React.useState(false)
  const addOpen = openAddJob ?? internalAddOpen

  function setAddOpen(open: boolean) {
    setInternalAddOpen(open)
    onOpenAddJobChange?.(open)
  }

  const loadJobs = React.useCallback(async () => {
    try {
      setJobs(await fetchJobs())
      setError("")
    } catch (loadError) {
      setError(
        loadError instanceof Error ? loadError.message : "Could not load jobs."
      )
    } finally {
      setLoading(false)
    }
  }, [])

  React.useEffect(() => {
    let active = true

    async function loadInitialJobs() {
      try {
        const data = await fetchJobs()
        if (active) setJobs(data)
      } catch (loadError) {
        if (active) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Could not load jobs."
          )
        }
      } finally {
        if (active) setLoading(false)
      }
    }

    void loadInitialJobs()
    return () => {
      active = false
    }
  }, [])

  const normalizedRole = role.toLowerCase()
  const canPost = normalizedRole === "student" || normalizedRole === "admin"
  const visibleJobs = jobs.filter((job) => job.canManage)

  return (
    <main className="min-w-0 flex-1 px-4 py-5 sm:px-6 lg:px-8">
      <section className="rounded-3xl border border-brand-coral/15 bg-card px-5 py-6 sm:px-7">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-bold tracking-[0.16em] text-brand-coral-deep uppercase">
              Tuition management
            </p>
            <h1 className="mt-2 text-2xl font-extrabold tracking-tight sm:text-3xl">
              {normalizedRole === "admin"
                ? "All Posted Jobs"
                : "My Posted Jobs"}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Review, update, activate or close your tuition posts.
            </p>
          </div>
          {canPost ? (
            <Button
              type="button"
              onClick={() => setAddOpen(true)}
              className="rounded-xl bg-brand-coral px-5 text-white hover:bg-brand-coral-deep"
            >
              <Plus className="size-4" />
              Add Job
            </Button>
          ) : null}
        </div>
      </section>

      <div className="mt-5">
        <JobsMarquee jobs={visibleJobs} />
      </div>

      {loading ? (
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {[1, 2].map((item) => (
            <div
              key={item}
              className="h-44 animate-pulse rounded-2xl bg-muted"
            />
          ))}
        </div>
      ) : error ? (
        <div className="mt-5 rounded-2xl border border-destructive/20 bg-destructive/5 p-5 text-sm text-destructive">
          {error}
        </div>
      ) : visibleJobs.length ? (
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {visibleJobs.map((job) => (
            <JobCard
              key={job._id}
              job={job}
              onChanged={() => void loadJobs()}
            />
          ))}
        </div>
      ) : (
        <div className="mt-5 rounded-2xl border border-border bg-card p-8 text-center">
          <p className="font-bold">No posted jobs yet</p>
          {canPost ? (
            <Button
              type="button"
              variant="outline"
              onClick={() => setAddOpen(true)}
              className="mt-4 rounded-xl"
            >
              <Plus className="size-4" />
              Add your first job
            </Button>
          ) : null}
        </div>
      )}

      {canPost ? (
        <AddJobDialog
          open={addOpen}
          onOpenChange={setAddOpen}
          onCreated={() => void loadJobs()}
        />
      ) : null}
    </main>
  )
}
