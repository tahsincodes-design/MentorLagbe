"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import { reviewTuition } from "@/lib/tuitions/api"
import { approvalLabels, type Job } from "@/lib/tuitions/types"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export function TuitionApproval({ job }: { job: Job }) {
  const router = useRouter()
  const [busy, setBusy] = React.useState(false)
  const [refreshing, startRefresh] = React.useTransition()
  const [error, setError] = React.useState("")
  const [rejectOpen, setRejectOpen] = React.useState(false)
  const [reason, setReason] = React.useState("")

  async function review(decision: "approved" | "rejected") {
    setBusy(true)
    setError("")
    try {
      await reviewTuition(
        job._id,
        job.revision,
        decision,
        decision === "rejected" ? reason.trim() : undefined
      )
      toast.success(
        decision === "approved"
          ? "Tuition approved"
          : "Tuition rejected. The tutor can see your reason."
      )
      setRejectOpen(false)
      setReason("")
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
        <Badge variant="outline">{approvalLabels[job.approvalStatus]}</Badge>
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
          onClick={() => {
            setError("")
            setRejectOpen(true)
          }}
        >
          Reject
        </Button>
      </div>
      {error && !rejectOpen ? (
        <p role="alert" className="mt-3 text-sm text-destructive">
          {error}
        </p>
      ) : null}
      <Dialog
        open={rejectOpen}
        onOpenChange={(open) => {
          if (!busy) {
            setRejectOpen(open)
            if (!open) setError("")
          }
        }}
      >
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Reject this tuition</DialogTitle>
            <DialogDescription>
              The tutor will see your reason and can revise the listing.
            </DialogDescription>
          </DialogHeader>
          <form
            className="grid gap-3"
            onSubmit={(event) => {
              event.preventDefault()
              if (!busy && !refreshing && reason.trim()) void review("rejected")
            }}
          >
            <div className="grid gap-2">
              <Label htmlFor="rejection-reason">Rejection reason</Label>
              <Textarea
                id="rejection-reason"
                value={reason}
                maxLength={500}
                rows={4}
                required
                disabled={busy}
                onChange={(event) => setReason(event.target.value)}
                placeholder="Explain what the tutor needs to change."
              />
            </div>
            {error ? (
              <p role="alert" className="text-sm text-destructive">
                {error}
              </p>
            ) : null}
            <DialogFooter>
              <DialogClose
                render={
                  <Button type="button" variant="outline" disabled={busy} />
                }
              >
                Cancel
              </DialogClose>
              <Button
                type="submit"
                variant="destructive"
                disabled={busy || refreshing || !reason.trim()}
              >
                {busy ? "Saving…" : "Reject tuition"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </section>
  )
}
