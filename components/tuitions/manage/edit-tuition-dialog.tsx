"use client"

import * as React from "react"
import { Loader2, Save } from "lucide-react"
import { toast } from "sonner"

import { updateJob } from "@/lib/tuitions/api"
import type { Job, JobPayload } from "@/lib/tuitions/types"
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

export function EditTuitionDialog({
  job,
  open,
  onOpenChange,
  onUpdated,
}: {
  job: Job
  open: boolean
  onOpenChange: (open: boolean) => void
  onUpdated: () => void
}) {
  const [payload, setPayload] = React.useState<JobPayload>({
    title: job.title,
    description: job.description,
    subject: job.subject ?? "",
    salary: job.salary == null ? "" : String(job.salary),
    location: job.location ?? "Online",
  })
  const [active, setActive] = React.useState(job.isActive)
  const [saving, setSaving] = React.useState(false)
  const [error, setError] = React.useState("")

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    setSaving(true)
    setError("")
    try {
      const changes: Partial<JobPayload> = {}
      if (payload.title.trim() !== job.title)
        changes.title = payload.title.trim()
      if (payload.description.trim() !== job.description)
        changes.description = payload.description.trim()
      if (payload.subject.trim() !== (job.subject ?? ""))
        changes.subject = payload.subject.trim()
      if (payload.location.trim() !== (job.location ?? "Online"))
        changes.location = payload.location.trim()
      if (payload.salary.trim() !== String(job.salary ?? ""))
        changes.salary = payload.salary.trim()
      if (active !== job.isActive) changes.isActive = active
      if (Object.keys(changes).length) {
        const updated = await updateJob(job._id, changes)
        toast.success(
          updated.approvalStatus === "pending"
            ? "Tuition saved for review"
            : "Tuition updated"
        )
      }
      onOpenChange(false)
      onUpdated()
    } catch (updateError) {
      setError(
        updateError instanceof Error
          ? updateError.message
          : "Could not update this tuition."
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
              required
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
              maxLength={1500}
              required
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
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="edit-subject">Subject</Label>
              <Input
                id="edit-subject"
                value={payload.subject}
                onChange={(event) =>
                  setPayload((current) => ({
                    ...current,
                    subject: event.target.value,
                  }))
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="edit-salary">Monthly Fee</Label>
              <Input
                id="edit-salary"
                inputMode="decimal"
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
              <Label htmlFor="edit-job-active">Active Status</Label>
              <p className="mt-1 text-xs text-muted-foreground">
                Open or close this tuition.
              </p>
            </div>
            <Switch
              id="edit-job-active"
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
