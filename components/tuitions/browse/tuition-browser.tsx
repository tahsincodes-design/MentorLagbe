"use client"

import * as React from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Search, SlidersHorizontal } from "lucide-react"

import { isTutorRole } from "@/components/auth/roles"
import {
  TuitionFilters,
  tuitionSelectClass,
} from "@/components/tuitions/browse/tuition-filters"
import { fetchJobs } from "@/lib/tuitions/api"
import type { Job } from "@/lib/tuitions/types"
import { TuitionCard } from "@/components/tuitions/shared/tuition-card"
import { TuitionMarquee } from "@/components/tuitions/shared/tuition-marquee"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { tuitionBrowsePath, tuitionManagePath } from "@/lib/tuitions/routes"
import {
  readTuitionSearch,
  searchTuitions,
  tuitionFilterOptions,
  tuitionSearchQuery,
  tuitionSortOptions,
  type TuitionSearch,
} from "@/lib/tuitions/search"
import { cn } from "@/lib/utils"

const searchChangedEvent = "tuition-search-changed"

function subscribeToSearch(onChange: () => void) {
  window.addEventListener(searchChangedEvent, onChange)
  window.addEventListener("popstate", onChange)
  return () => {
    window.removeEventListener(searchChangedEvent, onChange)
    window.removeEventListener("popstate", onChange)
  }
}

function getLocationSearch() {
  return window.location.search
}

function replaceSearch(query: string) {
  window.history.replaceState(null, "", tuitionBrowsePath + query)
  window.dispatchEvent(new Event(searchChangedEvent))
}

export function TuitionBrowser({ role }: { role?: string }) {
  const [jobs, setJobs] = React.useState<Job[]>([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState("")
  const routeSearch = useSearchParams()
  const locationSearch = React.useSyncExternalStore(
    subscribeToSearch,
    getLocationSearch,
    () => routeSearch.toString()
  )
  const filters = readTuitionSearch(new URLSearchParams(locationSearch))
  const query = tuitionSearchQuery(filters)

  function updateFilter(field: keyof TuitionSearch, value: string) {
    const params = new URLSearchParams(window.location.search)
    params.set(field, value)
    const next = tuitionSearchQuery(readTuitionSearch(params))
    replaceSearch(next)
  }

  function clearFilters() {
    replaceSearch("")
  }

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
  const visibleJobs = searchTuitions(jobs, filters)
  const activeFilterCount =
    [filters.subject, filters.location].filter(Boolean).length +
    Number(Boolean(filters.min || filters.max))
  const filterProps = {
    filters,
    subjects: tuitionFilterOptions(jobs, "subject"),
    locations: tuitionFilterOptions(jobs, "location"),
    onChange: updateFilter,
  }

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

      <section
        aria-label="Tuition search"
        className="mt-5 grid gap-3 rounded-2xl border bg-card p-3 sm:p-4"
      >
        <div className="flex items-center gap-2">
          <div className="relative min-w-0 flex-1">
            <Search
              aria-hidden="true"
              className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              type="search"
              maxLength={160}
              value={filters.q}
              onChange={(event) => updateFilter("q", event.target.value)}
              placeholder="Search tuitions"
              aria-label="Search tuitions"
              className="h-10 rounded-xl pl-9"
            />
          </div>
          <Dialog>
            <DialogTrigger
              render={
                <Button variant="outline" className="h-10 shrink-0 sm:hidden" />
              }
            >
              <SlidersHorizontal aria-hidden="true" className="size-4" />
              Filters{activeFilterCount ? ` (${activeFilterCount})` : ""}
            </DialogTrigger>
            <DialogContent className="top-auto bottom-0 max-h-[90dvh] max-w-none translate-y-0 overflow-y-auto rounded-t-2xl rounded-b-none pb-[max(1rem,env(safe-area-inset-bottom))]">
              <DialogHeader>
                <DialogTitle>Filter tuitions</DialogTitle>
              </DialogHeader>
              <TuitionFilters {...filterProps} />
              <DialogFooter>
                <DialogClose render={<Button />}>Done</DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        <TuitionFilters
          {...filterProps}
          className="hidden sm:grid sm:grid-cols-4"
        />
        <div className="flex flex-wrap items-center justify-between gap-2 border-t pt-3">
          <p role="status" className="text-sm text-muted-foreground">
            {!loading && !error
              ? `${visibleJobs.length} ${visibleJobs.length === 1 ? "tuition" : "tuitions"} found`
              : ""}
          </p>
          <div className="ml-auto flex flex-wrap items-center gap-2">
            {query ? (
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                Clear search
              </Button>
            ) : null}
            <select
              aria-label="Sort tuitions"
              value={filters.sort}
              onChange={(event) => updateFilter("sort", event.target.value)}
              className={cn(tuitionSelectClass, "w-auto max-w-full")}
            >
              {tuitionSortOptions.map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

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
        <div className="mt-5 rounded-2xl border border-destructive/20 bg-destructive/5 p-5 text-sm">
          <p role="alert" className="text-destructive">
            {error}
          </p>
          <Button
            variant="outline"
            size="sm"
            className="mt-3"
            onClick={() => {
              setLoading(true)
              void loadJobs()
            }}
          >
            Try again
          </Button>
        </div>
      ) : visibleJobs.length ? (
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {visibleJobs.map((job) => (
            <TuitionCard
              key={job._id}
              job={job}
              browseQuery={query}
              onChanged={() => void loadJobs()}
            />
          ))}
        </div>
      ) : (
        <div className="mt-5 rounded-2xl border border-border bg-card p-8 text-center">
          <p className="font-bold">
            {jobs.length ? "No matching tuitions" : "No tuitions available yet"}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {jobs.length
              ? "Try a different keyword or broaden your filters."
              : "Check back for new listings."}
          </p>
        </div>
      )}
    </main>
  )
}
