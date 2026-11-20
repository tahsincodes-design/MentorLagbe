"use client"

import * as React from "react"
import Link from "next/link"
import { Search } from "lucide-react"

import { isTutorRole } from "@/components/auth/roles"
import { fetchJobs } from "@/lib/tuitions/api"
import type { Job } from "@/lib/tuitions/types"
import { TuitionCard } from "@/components/tuitions/shared/tuition-card"
import { TuitionMarquee } from "@/components/tuitions/shared/tuition-marquee"
import { buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { tuitionManagePath } from "@/lib/tuitions/routes"

export function TuitionBrowser({ role }: { role?: string }) {
  const [jobs, setJobs] = React.useState<Job[]>([])
  const [search, setSearch] = React.useState("")
  const [category, setCategory] = React.useState("")
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState("")

  const loadJobs = React.useCallback(async () => {
    try {
      setJobs(await fetchJobs())
      setError("")
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Could not load tuitions."
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
              : "Could not load tuitions."
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

  const normalizedRole = role?.toLowerCase()
  const showMarquee = normalizedRole === "student" || normalizedRole === "admin"
  const hasDashboard = isTutorRole(normalizedRole) || normalizedRole === "admin"
  const subjects = new Map(
    jobs.flatMap(({ subject }) =>
      subject ? [[subject.toLowerCase(), subject] as const] : []
    )
  )
  const categories = [["", "All"] as const, ...subjects]

  const visibleJobs = jobs.filter((job) => {
    const matchesSearch =
      !search ||
      `${job.title} ${job.description} ${job.subject ?? ""}`
        .toLowerCase()
        .includes(search.toLowerCase())
    const matchesCategory =
      !subjects.has(category) || (job.subject ?? "").toLowerCase() === category
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
            Browse tuitions
          </h1>
          <p className="mt-1 text-sm text-brand-navy/70">
            Find a tuition that fits your learning goals.
          </p>
        </div>
        {hasDashboard ? (
          <div className="mt-5 flex flex-wrap gap-2">
            <Link
              href={tuitionManagePath}
              className={buttonVariants({ variant: "outline" })}
            >
              {normalizedRole === "admin" ? "Tuition approvals" : "My tuitions"}
            </Link>
          </div>
        ) : null}
      </section>

      {showMarquee ? <TuitionMarquee jobs={jobs} /> : null}

      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search tuitions"
            aria-label="Search tuitions"
            className="h-10 rounded-xl pl-9"
          />
        </div>
      </div>

      <div className="mt-3 flex gap-2 overflow-x-auto pb-2">
        {categories.map(([value, label]) => (
          <button
            key={value}
            type="button"
            onClick={() => setCategory(value)}
            aria-pressed={
              category === value || (!value && !subjects.has(category))
            }
            className={`shrink-0 rounded-full border px-4 py-2 text-xs font-bold transition-colors ${
              category === value || (!value && !subjects.has(category))
                ? "border-brand-coral bg-brand-coral text-white"
                : "border-border bg-card text-muted-foreground hover:border-brand-coral/40 hover:text-foreground"
            }`}
          >
            {label}
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
          {visibleJobs.map((job) => (
            <TuitionCard
              key={job._id}
              job={job}
              onChanged={() => void loadJobs()}
            />
          ))}
        </div>
      ) : (
        <div className="mt-5 rounded-2xl border border-border bg-card p-8 text-center">
          <p className="font-bold">No tuitions found</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Try another search or category.
          </p>
        </div>
      )}
    </main>
  )
}
