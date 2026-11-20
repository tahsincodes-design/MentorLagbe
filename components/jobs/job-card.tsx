"use client"

import * as React from "react"
import Link from "next/link"
import { Pencil, Trash2, Users } from "lucide-react"
import { toast } from "sonner"

import { deleteJob, setJobStatus } from "@/components/jobs/job-api"
import { approvalLabels, type Job } from "@/components/jobs/job-types"
import { EditJobDialog } from "@/components/jobs/edit-job-dialog"
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

export function JobCard({
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
      <Card className="gap-0 rounded-2xl py-0 transition-shadow hover:shadow-lg">
        <CardContent className="p-4 sm:p-5">
          <div className="flex items-start gap-3">
            <div className="grid size-11 shrink-0 place-items-center rounded-xl bg-brand-navy text-brand-cream">
              <span className="text-lg font-extrabold">
                {(job.subject ?? job.title).slice(0, 1).toUpperCase()}
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-base font-extrabold">{job.title}</h3>
                <Badge
                  className={
                    isOpen
                      ? "rounded-full bg-brand-coral/10 text-brand-coral-deep"
                      : "rounded-full bg-muted text-muted-foreground"
                  }
                >
                  {isOpen ? "Active" : "Paused"}
                </Badge>
                {job.canManage || job.canModerate ? (
                  <Badge variant="outline">
                    {approvalLabels[job.approvalStatus]}
                  </Badge>
                ) : null}
              </div>
              {job.subject ? (
                <p className="mt-1 text-xs font-semibold text-brand-coral-deep">
                  {job.subject}
                </p>
              ) : null}
              <p className="mt-2 line-clamp-2 text-sm leading-5 text-muted-foreground">
                {job.description}
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
                {job.salary != null && job.salary !== "" ? (
                  <span className="font-bold text-brand-coral-deep">
                    ৳{job.salary}/month
                  </span>
                ) : null}
                {job.location ? <span>{job.location}</span> : null}
                <span className="flex items-center gap-1">
                  <Users className="size-3.5" />
                  {job.postedBy?.name ?? "Tutor"}
                </span>
              </div>
            </div>
          </div>

          <Link
            href={`/jobs/jobs/${encodeURIComponent(jobId)}`}
            className={buttonVariants({
              variant: "outline",
              size: "sm",
              className: "mt-4",
            })}
          >
            {job.canModerate ? "Review tuition" : "View tuition details"}
          </Link>

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
        <EditJobDialog
          job={job}
          open={editOpen}
          onOpenChange={setEditOpen}
          onUpdated={onChanged}
        />
      ) : null}
    </>
  )
}
