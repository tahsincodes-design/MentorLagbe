"use client"

import * as React from "react"
import { Plus, Search } from "lucide-react"

import { fetchJobs } from "@/components/jobs/job-api"
import type { Job } from "@/components/jobs/job-types"
import { JobCard } from "@/components/jobs/job-card"
import { JobsMarquee } from "@/components/jobs/jobs-marquee"
import { AddJobDialog } from "@/components/jobs/add-job-dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function JobsBrowser({
  role,
  userEmail,
}: {
  role: string
  userEmail?: string
}) {
  const [jobs, setJobs] = React.useState<Job[]>([])
  const [search, setSearch] = React.useState("")
  const [category, setCategory] = React.useState("All")
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState("")
  const [addOpen, setAddOpen] = React.useState(false)

  const loadJobs = React.useCallback(async () => {
    try {
      setJobs(await fetchJobs())
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

  const categories = [
    "All",
    "Mathematics",
    "Physics",
    "Programming",
    "English",
    "IELTS",
  ]

  const visibleJobs = jobs.filter((job) => {
    const matchesSearch =
      !search ||
      `${job.title} ${job.description} ${job.subject ?? ""}`
        .toLowerCase()
        .includes(search.toLowerCase())
    const matchesCategory =
      category === "All" ||
      (job.subject ?? "").toLowerCase() === category.toLowerCase()
    return matchesSearch && matchesCategory
  })

  return (
    <main className="min-w-0 flex-1 px-4 py-5 sm:px-6 lg:px-8">
      <section className="overflow-hidden rounded-3xl border border-brand-coral/15 bg-[linear-gradient(135deg,#ffe3d8_0%,#fff1e8_70%,#dce7fb_100%)] px-5 py-6 sm:px-7">
        <div className="max-w-2xl">
          <p className="text-xs font-bold tracking-[0.16em] text-brand-coral-deep uppercase">
            Find your next learning opportunity
          </p>
          <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-brand-navy sm:text-3xl">
            Explore Available Jobs
          </h1>
          <p className="mt-1 text-sm text-brand-navy/70">
            Browse tuition requests and connect with the right learners.
          </p>
        </div>
        {canPost ? (
          <Button
            type="button"
            onClick={() => setAddOpen(true)}
            className="mt-5 rounded-xl bg-brand-coral px-5 text-white hover:bg-brand-coral-deep"
          >
            <Plus className="size-4" />
            Post a Job
          </Button>
        ) : null}
      </section>

      <div className="mt-5">
        <JobsMarquee jobs={jobs} />
      </div>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search jobs"
            className="h-10 rounded-xl pl-9"
          />
        </div>
      </div>

      <div className="mt-3 flex gap-2 overflow-x-auto pb-2">
        {categories.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setCategory(item)}
            className={`shrink-0 rounded-full border px-4 py-2 text-xs font-bold transition-colors ${
              category === item
                ? "border-brand-coral bg-brand-coral text-white"
                : "border-border bg-card text-muted-foreground hover:border-brand-coral/40 hover:text-foreground"
            }`}
          >
            {item}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {[1, 2, 3, 4].map((item) => (
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
          {visibleJobs.map((job) => {
            const canManage =
              normalizedRole === "admin" ||
              (normalizedRole === "student" &&
                job.postedBy?.email?.toLowerCase() === userEmail?.toLowerCase())

            return (
              <JobCard
                key={job._id ?? job.id ?? `${job.title}-${job.createdAt}`}
                job={job}
                canManage={canManage}
                onChanged={() => void loadJobs()}
              />
            )
          })}
        </div>
      ) : (
        <div className="mt-5 rounded-2xl border border-border bg-card p-8 text-center">
          <p className="font-bold">No jobs found</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Try another search or category.
          </p>
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
