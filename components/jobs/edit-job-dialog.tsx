"use client"

import * as React from "react"
import { Loader2, Save } from "lucide-react"
import { toast } from "sonner"

import { setJobStatus, updateJob } from "@/components/jobs/job-api"
import type { Job, JobPayload, JobStatus } from "@/components/jobs/job-types"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"

export function EditJobDialog({
  job,
  open,
  onOpenChange,
  onUpdated,
}: {
  job: Job | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onUpdated: () => void
}) {
  const [payload, setPayload] = React.useState<JobPayload>({
    title: job?.title ?? "",
    description: job?.description ?? "",
    subject: job?.subject ?? "",
    salary: job?.salary == null ? "" : String(job.salary),
    location: job?.location ?? "Online",
  })
  const [active, setActive] = React.useState(job?.status !== "closed")
  const [saving, setSaving] = React.useState(false)
  const [error, setError] = React.useState("")

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    if (!job) return
    const jobId = job._id ?? job.id
    if (!jobId) {
      setError("This job does not have a valid ID.")
      return
    }

    setSaving(true)
    setError("")
    try {
      await updateJob(jobId, payload)
      await setJobStatus(jobId, (active ? "open" : "closed") as JobStatus)
      toast.success("Tuition updated successfully")
      onOpenChange(false)
      onUpdated()
    } catch (updateError) {
      setError(
        updateError instanceof Error
          ? updateError.message
          : "Could not update this job."
      )
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[calc(100svh-2rem)] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Edit Tuition</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="edit-title">Tuition Title</Label>
            <Input
              id="edit-title"
              value={payload.title}
              onChange={(event) =>
                setPayload((current) => ({
                  ...current,
                  title: event.target.value,
                }))
              }
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="edit-description">Description</Label>
            <Textarea
              id="edit-description"
              rows={4}
              value={payload.description}
              onChange={(event) =>
                setPayload((current) => ({
                  ...current,
                  description: event.target.value,
                }))
              }
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="edit-salary">Monthly Fee</Label>
              <Input
                id="edit-salary"
                value={payload.salary}
                onChange={(event) =>
                  setPayload((current) => ({
                    ...current,
                    salary: event.target.value,
                  }))
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="edit-location">Location</Label>
              <Input
                id="edit-location"
                value={payload.location}
                onChange={(event) =>
                  setPayload((current) => ({
                    ...current,
                    location: event.target.value,
                  }))
                }
              />
            </div>
          </div>
          <div className="flex items-center justify-between rounded-xl border border-border px-4 py-3">
            <div>
              <Label>Active Status</Label>
              <p className="mt-1 text-xs text-muted-foreground">
                Open or close this tuition.
              </p>
            </div>
            <Switch
              checked={active}
              onCheckedChange={setActive}
              className="data-checked:bg-brand-coral"
            />
          </div>
          {error ? (
            <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </p>
          ) : null}
          <DialogFooter>
            <DialogClose
              render={<Button type="button" variant="outline" />}
              disabled={saving}
            >
              Cancel
            </DialogClose>
            <Button
              type="submit"
              disabled={saving}
              className="bg-brand-coral text-white hover:bg-brand-coral-deep"
            >
              {saving ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Save className="size-4" />
              )}
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
