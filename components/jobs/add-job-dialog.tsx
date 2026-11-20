"use client"

import * as React from "react"
import { ImagePlus, Loader2, Upload } from "lucide-react"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
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
  const [active, setActive] = React.useState(true)
  const [saving, setSaving] = React.useState(false)
  const [error, setError] = React.useState("")

  function updateField(field: keyof JobPayload, value: string) {
    setPayload((current) => ({ ...current, [field]: value }))
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    setError("")

    if (!payload.title.trim() || !payload.description.trim()) {
      setError("Job title and description are required.")
      return
    }

    setSaving(true)
    try {
      await createJob({
        ...payload,
        title: payload.title.trim(),
        description: payload.description.trim(),
        status: active ? "open" : "closed",
      })
      toast.success("Tuition posted successfully")
      setPayload(emptyPayload)
      setActive(true)
      onOpenChange(false)
      onCreated()
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Could not post this job."
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
            Share your tuition with students and mentors.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="job-title">Tuition Title *</Label>
              <Input
                id="job-title"
                value={payload.title}
                onChange={(event) => updateField("title", event.target.value)}
                placeholder="e.g. Mathematics for HSC"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="job-subject">Subject</Label>
              <Select
                value={payload.subject}
                onValueChange={(value) => updateField("subject", String(value))}
              >
                <SelectTrigger id="job-subject" className="h-10 w-full">
                  <SelectValue placeholder="Select Subject" />
                </SelectTrigger>
                <SelectContent>
                  {[
                    "Mathematics",
                    "Physics",
                    "Programming",
                    "English",
                    "IELTS",
                    "General",
                  ].map((subject) => (
                    <SelectItem key={subject} value={subject}>
                      {subject}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="job-description">Description *</Label>
            <Textarea
              id="job-description"
              rows={4}
              maxLength={1500}
              value={payload.description}
              onChange={(event) =>
                updateField("description", event.target.value)
              }
              placeholder="Describe what you need, schedule, and expectations..."
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

          <div className="rounded-xl border border-dashed border-border bg-muted/30 p-4">
            <div className="flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-lg bg-brand-coral/10 text-brand-coral">
                {payload.title ? (
                  <Upload className="size-5" />
                ) : (
                  <ImagePlus className="size-5" />
                )}
              </span>
              <div>
                <p className="text-sm font-semibold">Banner Image</p>
                <p className="text-xs text-muted-foreground">
                  Optional · PNG, JPG or JPEG, max 5MB
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between rounded-xl border border-border px-4 py-3">
            <div>
              <Label htmlFor="new-job-active">Active Status</Label>
              <p className="mt-1 text-xs text-muted-foreground">
                Turn off to hide this tuition temporarily.
              </p>
            </div>
            <Switch
              id="new-job-active"
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
