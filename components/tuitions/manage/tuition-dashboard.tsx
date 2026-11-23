"use client"

import * as React from "react"
import Link from "next/link"
import { Plus } from "lucide-react"

import { isTutorRole } from "@/components/auth/roles"
import { TuitionCardsSkeleton } from "@/components/site/page-skeleton"
import { fetchTuitionDashboard } from "@/lib/tuitions/api"
import {
  membershipPath,
  type DashboardMembership,
} from "@/lib/membership/plans"
import type { Job } from "@/lib/tuitions/types"
import { CreateTuitionDialog } from "@/components/tuitions/manage/create-tuition-dialog"
import { TuitionCard } from "@/components/tuitions/shared/tuition-card"
import { TuitionMarquee } from "@/components/tuitions/shared/tuition-marquee"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function TuitionDashboard({
  role,
  startPosting = false,
}: {
  role: string
  startPosting?: boolean
}) {
  const [jobs, setJobs] = React.useState<Job[]>([])
  const [membership, setMembership] = React.useState<DashboardMembership>()
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState("")
  const [addOpen, setAddOpen] = React.useState(startPosting)

  const loadJobs = React.useCallback(async () => {
    try {
      const dashboard = await fetchTuitionDashboard()
      setJobs(dashboard.data)
      setMembership(dashboard.membership)
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
        const dashboard = await fetchTuitionDashboard()
        if (active) {
          setJobs(dashboard.data)
          setMembership(dashboard.membership)
        }
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

  const normalizedRole = role.toLowerCase()
  const isTutor = isTutorRole(normalizedRole)
  const atLimit =
    membership &&
    membership.tuitionLimit !== null &&
    membership.tuitionCount >= membership.tuitionLimit
  const canPost = isTutor && !loading && !error && !atLimit
  const isAdmin = normalizedRole === "admin"
  const awaitingReview = isAdmin
    ? jobs.filter((job) => job.approvalStatus === "pending")
    : jobs.filter((job) => (job.pendingApplications ?? 0) > 0)

  function renderJobs(list: Job[], emptyMessage: string) {
    return list.length ? (
      <div className="mt-3 grid gap-4 motion-safe:animate-in motion-safe:duration-200 motion-safe:fade-in md:grid-cols-2">
        {list.map((job) => (
          <TuitionCard
            key={job._id}
            job={job}
            onChanged={() => void loadJobs()}
          />
        ))}
      </div>
    ) : (
      <p className="mt-3 rounded-2xl border bg-card p-6 text-center text-sm text-muted-foreground">
        {emptyMessage}
      </p>
    )
  }

  return (
    <main className="min-w-0 flex-1 px-4 py-5 sm:px-6 lg:px-8">
      <section className="rounded-3xl border border-brand-coral/15 bg-card px-5 py-6 sm:px-7">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-bold tracking-[0.16em] text-brand-coral-deep uppercase">
              Tuition management
            </p>
            <h1 className="mt-2 text-2xl font-extrabold tracking-tight sm:text-3xl">
              {isAdmin ? "Tuition approvals" : "My tuitions"}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {isAdmin
                ? "Review tuition posts before students can apply."
                : "Manage your tuitions and review student applications."}
            </p>
          </div>
          {canPost ? (
            <Button
              type="button"
              onClick={() => setAddOpen(true)}
              className="rounded-xl bg-brand-coral px-5 text-white hover:bg-brand-coral-deep"
            >
              <Plus className="size-4" />
              Post tuition
            </Button>
          ) : null}
        </div>
        {membership ? (
          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 border-t pt-4 text-sm">
            <strong>
              {membership.plan === "premium" ? "Pro plan" : "Free plan"}
            </strong>
            <span className="text-muted-foreground">
              {membership.tuitionCount}
              {membership.tuitionLimit === null
                ? ""
                : ` of ${membership.tuitionLimit}`}{" "}
              saved tuitions
            </span>
            {membership.insights ? (
              <span className="text-muted-foreground">
                {membership.insights.published} published ·{" "}
                {membership.insights.applications} applications
              </span>
            ) : null}
            <Link
              href={membershipPath}
              className="font-semibold underline underline-offset-4"
            >
              {membership.plan === "premium" ? "Manage membership" : "View Pro"}
            </Link>
            {atLimit ? (
              <p className="w-full text-muted-foreground">
                Delete a listing to free a slot, or upgrade for unlimited
                listings.
              </p>
            ) : null}
          </div>
        ) : null}
      </section>

      {isAdmin ? <TuitionMarquee jobs={jobs} /> : null}

      {loading ? (
        <div className="mt-5">
          <TuitionCardsSkeleton />
        </div>
      ) : error ? (
        <div className="mt-5 rounded-2xl border border-destructive/20 bg-destructive/5 p-5 text-sm text-destructive">
          {error}
        </div>
      ) : (
        <Tabs defaultValue={isAdmin ? "pending" : "all"} className="mt-5">
          <TabsList
            aria-label={
              isAdmin ? "Tuition approval filters" : "My tuition filters"
            }
            className="h-auto max-w-full flex-wrap justify-start"
          >
            <TabsTrigger value="pending" className="h-8 px-2">
              {isAdmin ? "Pending approval" : "Needs review"}
              <Badge variant="secondary" className="ml-0.5">
                {awaitingReview.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="all" className="h-8 px-2">
              All tuitions
            </TabsTrigger>
          </TabsList>
          <TabsContent value="pending">
            {renderJobs(
              awaitingReview,
              isAdmin
                ? "No tuitions awaiting approval."
                : "No student applications awaiting your review."
            )}
          </TabsContent>
          <TabsContent value="all">
            {renderJobs(jobs, "No tuitions yet.")}
          </TabsContent>
        </Tabs>
      )}

      {canPost ? (
        <CreateTuitionDialog
          open={addOpen}
          onOpenChange={setAddOpen}
          onCreated={() => void loadJobs()}
        />
      ) : null}
    </main>
  )
}
