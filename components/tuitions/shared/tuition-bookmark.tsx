"use client"

import { useState } from "react"
import Link from "next/link"
import { Bookmark, LoaderCircle } from "lucide-react"
import { toast } from "sonner"

import { Button, buttonVariants } from "@/components/ui/button"
import { setTuitionBookmark } from "@/lib/tuitions/api"
import { tuitionSignInPath } from "@/lib/tuitions/routes"
import { cn } from "@/lib/utils"

export function TuitionBookmark({
  tuitionId,
  title,
  saved,
  returnTo,
  onChange,
}: {
  tuitionId: string
  title: string
  saved?: boolean
  returnTo: string
  onChange?: (saved: boolean) => void
}) {
  const [busy, setBusy] = useState(false)
  const [updated, setUpdated] = useState<boolean>()

  if (saved === undefined) {
    return (
      <Link
        href={tuitionSignInPath(returnTo)}
        aria-label={`Sign in to save ${title}`}
        title="Sign in to save"
        className={cn(
          buttonVariants({ variant: "outline", size: "icon" }),
          "rounded-full"
        )}
      >
        <Bookmark aria-hidden="true" className="size-4" />
      </Link>
    )
  }

  const isSaved = updated ?? saved

  async function toggleBookmark() {
    if (busy) return
    setBusy(true)
    try {
      await setTuitionBookmark(tuitionId, !isSaved)
      setUpdated(!isSaved)
      onChange?.(!isSaved)
      toast.success(isSaved ? "Removed from Saved Tuitions" : "Tuition saved")
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Could not update your saved tuitions."
      )
    } finally {
      setBusy(false)
    }
  }

  const action = isSaved ? "Remove bookmark" : "Save tuition"
  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      aria-label={`${action} for ${title}`}
      aria-pressed={isSaved}
      title={action}
      disabled={busy}
      onClick={() => void toggleBookmark()}
      className={cn(
        "rounded-full",
        isSaved && "border-brand-coral/35 bg-brand-coral/10 text-foreground"
      )}
    >
      {busy ? (
        <LoaderCircle
          aria-hidden="true"
          className="size-4 motion-safe:animate-spin"
        />
      ) : (
        <Bookmark
          aria-hidden="true"
          className={cn("size-4", isSaved && "fill-brand-coral")}
        />
      )}
    </Button>
  )
}
