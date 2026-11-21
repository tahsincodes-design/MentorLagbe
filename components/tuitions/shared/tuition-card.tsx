"use client"

import * as React from "react"
import Link from "next/link"
import { ArrowUpRight, MapPin, Pencil, Trash2, UserRound } from "lucide-react"
import { toast } from "sonner"

import { deleteJob, setJobStatus } from "@/lib/tuitions/api"
import { approvalLabels, type Job } from "@/lib/tuitions/types"
import { tuitionDetailPath } from "@/lib/tuitions/routes"
import { EditTuitionDialog } from "@/components/tuitions/manage/edit-tuition-dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Button, buttonVariants } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"

const feeFormatter = new Intl.NumberFormat("en-BD")

export function TuitionCard({
  job,
  onChanged,
}: {
  job: Job
  onChanged: () => void
}) {
  const [editOpen, setEditOpen] = React.useState(false)
  const [deleting, setDeleting] = React.useState(false)
  const [updatingStatus, setUpdatingStatus] = React.useState(false)
  const isOpen = job.isActive
  const jobId = job._id
  const busy = deleting || updatingStatus
  const fee =
    typeof job.salary === "number"
      ? feeFormatter.format(job.salary)
      : job.salary

  async function changeStatus(checked: boolean) {
    if (busy) return

    setUpdatingStatus(true)
    try {
      await setJobStatus(jobId, checked)
      toast.success(checked ? "Tuition activated" : "Tuition paused")
      onChanged()
    } catch (statusError) {
      toast.error(
        statusError instanceof Error
          ? statusError.message
          : "Could not update the status."
      )
    } finally {
      setUpdatingStatus(false)
    }
  }

  async function handleDelete() {
    if (busy) return

    setDeleting(true)
    try {
      await deleteJob(jobId)
      toast.success("Tuition deleted")
      onChanged()
    } catch (deleteError) {
      toast.error(
        deleteError instanceof Error
          ? deleteError.message
          : "Could not delete this tuition."
      )
    } finally {
      setDeleting(false)
    }
  }

  return (
    <>
      <Card className="h-full gap-0 rounded-2xl py-0 transition-shadow hover:shadow-md">
        <CardContent className="flex h-full flex-col p-4 sm:p-5">
          <div className="flex flex-wrap items-center gap-2">
            {job.subject ? (
              <Badge
                variant="secondary"
                className="h-auto max-w-full rounded-full wrap-anywhere whitespace-normal"
              >
                {job.subject}
              </Badge>
            ) : null}
            {job.canManage || job.canModerate ? (
              <>
                <Badge variant="outline">
                  {approvalLabels[job.approvalStatus]}
                </Badge>
                <Badge variant="outline">{isOpen ? "Active" : "Paused"}</Badge>
              </>
            ) : null}
          </div>
          <h3 className="mt-2 text-lg font-bold tracking-tight wrap-anywhere">
            {job.title}
          </h3>
          <dl className="mt-3 grid grid-cols-2 gap-3 rounded-xl border bg-muted/30 px-3 py-2.5">
            <div className="min-w-0">
              <dt className="text-xs text-muted-foreground">Monthly fee</dt>
              <dd className="mt-0.5 text-sm font-semibold wrap-anywhere tabular-nums">
                {fee ? `৳${fee}` : "Not listed"}
              </dd>
            </div>
            <div className="min-w-0">
              <dt className="text-xs text-muted-foreground">Location</dt>
              <dd className="mt-0.5 flex items-start gap-1 text-sm font-semibold wrap-anywhere">
                <MapPin
                  aria-hidden="true"
                  className="mt-0.5 size-3.5 shrink-0 text-muted-foreground"
                />
                <span className="min-w-0">{job.location || "Not listed"}</span>
              </dd>
            </div>
          </dl>
          <p className="mt-3 mb-4 line-clamp-2 text-sm leading-5 wrap-anywhere text-muted-foreground">
            {job.description}
          </p>
          <div className="mt-auto flex flex-wrap items-center justify-between gap-3">
            <span className="inline-flex min-w-0 items-center gap-1.5 text-sm wrap-anywhere text-muted-foreground">
              <UserRound aria-hidden="true" className="size-4 shrink-0" />
              <span className="min-w-0">{job.postedBy?.name || "Tutor"}</span>
            </span>
            <Link
              href={tuitionDetailPath(jobId)}
              className={cn(
                buttonVariants({ variant: "outline" }),
                "h-9 rounded-full px-3"
              )}
            >
              {job.canModerate ? "Review tuition" : "View tuition details"}
              <ArrowUpRight aria-hidden="true" className="size-4" />
            </Link>
          </div>

          {job.canManage ? (
            <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-border pt-3">
              <div className="mr-auto flex items-center gap-2">
                <Switch
                  checked={isOpen}
                  aria-label={`Active status for ${job.title}`}
                  disabled={busy}
                  onCheckedChange={changeStatus}
                  className="data-checked:bg-brand-coral"
                />
                <span className="text-xs font-semibold text-muted-foreground">
                  Active
                </span>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={busy}
                onClick={() => setEditOpen(true)}
                className="rounded-lg"
              >
                <Pencil className="size-3.5" />
                Edit
              </Button>
              <AlertDialog>
                <AlertDialogTrigger
                  render={
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="rounded-lg"
                    />
                  }
                  disabled={busy}
                >
                  <Trash2 className="size-3.5" />
                  Delete
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete this tuition?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDelete}
                      className="text-destructive-foreground bg-destructive"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          ) : null}
        </CardContent>
      </Card>

      {editOpen ? (
        <EditTuitionDialog
          job={job}
          open={editOpen}
          onOpenChange={setEditOpen}
          onUpdated={onChanged}
        />
      ) : null}
    </>
  )
}
