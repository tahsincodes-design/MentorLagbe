"use client"

import * as React from "react"
import { Loader2, Upload } from "lucide-react"
import { toast } from "sonner"

import { createJob } from "@/components/jobs/job-api"
import type { JobPayload } from "@/components/jobs/job-types"
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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

const emptyPayload: JobPayload = {
  title: "",
  description: "",
  subject: "",
  salary: "",
  location: "Online",
}

export function AddJobDialog({
  open,
  onOpenChange,
  onCreated,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreated: () => void
}) {
  const [payload, setPayload] = React.useState<JobPayload>(emptyPayload)
  const [saving, setSaving] = React.useState(false)
  const [error, setError] = React.useState("")

  function updateField(
    field: Exclude<keyof JobPayload, "isActive">,
    value: string
  ) {
    setPayload((current) => ({ ...current, [field]: value }))
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    setError("")

    if (!payload.title.trim() || !payload.description.trim()) {
      setError("Tuition title and description are required.")
      return
    }

    setSaving(true)
    try {
      await createJob({
        ...payload,
        title: payload.title.trim(),
        description: payload.description.trim(),
      })
      toast.success("Tuition submitted for approval")
      setPayload(emptyPayload)
      onOpenChange(false)
      onCreated()
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Could not post this tuition."
      )
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[calc(100svh-2rem)] overflow-y-auto rounded-2xl p-5 sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-extrabold">
            Post a Tuition
          </DialogTitle>
          <DialogDescription>
            Students can find your tuition after an admin approves it.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="job-title">Tuition Title *</Label>
              <Input
                id="job-title"
                required
                maxLength={160}
                value={payload.title}
                onChange={(event) => updateField("title", event.target.value)}
                placeholder="e.g. Mathematics for HSC"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="job-subject">Subject</Label>
              <Input
                id="job-subject"
                value={payload.subject}
                onChange={(event) => updateField("subject", event.target.value)}
                maxLength={160}
                placeholder="e.g. Physics"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="job-description">Description *</Label>
            <Textarea
              id="job-description"
              rows={4}
              maxLength={1500}
              required
              value={payload.description}
              onChange={(event) =>
                updateField("description", event.target.value)
              }
              placeholder="Describe what you teach and when lessons take place."
            />
            <p className="text-right text-[0.65rem] text-muted-foreground">
              {payload.description.length}/1500
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="job-salary">Monthly Fee (৳)</Label>
              <Input
                id="job-salary"
                type="number"
                min="0"
                step="0.01"
                value={payload.salary}
                onChange={(event) => updateField("salary", event.target.value)}
                placeholder="e.g. 2000"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="job-location">Location</Label>
              <Input
                id="job-location"
                value={payload.location}
                onChange={(event) =>
                  updateField("location", event.target.value)
                }
                placeholder="e.g. Dhanmondi, Dhaka"
              />
            </div>
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
                <Upload className="size-4" />
              )}
              Post Tuition
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
