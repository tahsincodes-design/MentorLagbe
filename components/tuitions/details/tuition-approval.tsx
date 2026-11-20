"use client"

import * as React from "react"
import { useRouter } from "next/navigation"

import { reviewTuition } from "@/lib/tuitions/api"
import { approvalLabels, type Job } from "@/lib/tuitions/types"
import { Button } from "@/components/ui/button"

export function TuitionApproval({ job }: { job: Job }) {
  const router = useRouter()
  const [busy, setBusy] = React.useState(false)
  const [refreshing, startRefresh] = React.useTransition()
  const [error, setError] = React.useState("")

  async function review(decision: "approved" | "rejected") {
    setBusy(true)
    setError("")
    try {
      await reviewTuition(job._id, job.revision, decision)
      startRefresh(() => router.refresh())
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Could not review this tuition."
      )
      startRefresh(() => router.refresh())
    } finally {
      setBusy(false)
    }
  }

  return (
    <section className="self-start rounded-3xl border bg-card p-6">
      <h2 className="text-lg font-bold">Review tuition</h2>
      <p role="status" className="mt-2 text-sm text-muted-foreground">
        {approvalLabels[job.approvalStatus]}
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        <Button
          type="button"
          disabled={busy || refreshing || job.approvalStatus === "approved"}
          onClick={() => void review("approved")}
        >
          Approve
        </Button>
        <Button
          type="button"
          variant="outline"
          disabled={busy || refreshing || job.approvalStatus === "rejected"}
          onClick={() => void review("rejected")}
        >
          Reject
        </Button>
      </div>
      {error ? (
        <p role="alert" className="mt-3 text-sm text-destructive">
          {error}
        </p>
      ) : null}
    </section>
  )
}
