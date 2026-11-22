"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Bookmark } from "lucide-react"

import { TuitionBookmark } from "@/components/tuitions/shared/tuition-bookmark"
import { TuitionCard } from "@/components/tuitions/shared/tuition-card"
import { buttonVariants } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { savedTuitionsPath, tuitionBrowsePath } from "@/lib/tuitions/routes"
import type { SavedTuition } from "@/lib/tuitions/types"

export function SavedTuitionList({ items }: { items: SavedTuition[] }) {
  const router = useRouter()
  if (!items.length) {
    return (
      <Card className="mt-5 py-0">
        <CardContent className="grid justify-items-center gap-2 p-8 text-center">
          <Bookmark
            aria-hidden="true"
            className="size-6 text-muted-foreground"
          />
          <h2 className="font-semibold">No saved tuitions yet</h2>
          <p className="text-sm text-muted-foreground">
            Use the bookmark button on a tuition to find it here later.
          </p>
          <Link
            href={tuitionBrowsePath}
            className={buttonVariants({ variant: "outline" })}
          >
            Browse tuitions
          </Link>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="mt-5 grid gap-4 sm:grid-cols-2">
      {items.map(({ tuitionId, title, tuition }) =>
        tuition ? (
          <TuitionCard
            key={tuitionId}
            job={tuition}
            onChanged={() => router.refresh()}
            onBookmarkChange={() => router.refresh()}
          />
        ) : (
          <Card key={tuitionId} className="gap-0 rounded-2xl py-0">
            <CardContent className="flex items-start justify-between gap-4 p-5">
              <div className="min-w-0">
                <h3 className="font-semibold wrap-anywhere">{title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  This listing is currently unavailable.
                </p>
              </div>
              <TuitionBookmark
                tuitionId={tuitionId}
                title={title}
                saved
                returnTo={savedTuitionsPath}
                onChange={() => router.refresh()}
              />
            </CardContent>
          </Card>
        )
      )}
    </div>
  )
}
