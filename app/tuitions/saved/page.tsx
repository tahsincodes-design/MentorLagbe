import type { Metadata } from "next"
import Link from "next/link"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { ArrowUpRight, Bookmark } from "lucide-react"

import { SavedTuitionList } from "@/components/tuitions/saved/saved-tuition-list"
import { buttonVariants } from "@/components/ui/button"
import { readSavedTuitions } from "@/lib/jobs-proxy"
import {
  savedTuitionsPath,
  tuitionBrowsePath,
  tuitionSignInPath,
} from "@/lib/tuitions/routes"
import type { SavedTuition } from "@/lib/tuitions/types"
import { cn } from "@/lib/utils"

export const metadata: Metadata = {
  title: "Saved Tuitions | MentorLagbe",
  robots: { index: false, follow: false },
}

export default async function SavedTuitionsPage() {
  const response = await readSavedTuitions(await headers())
  if (response.status === 401) redirect(tuitionSignInPath(savedTuitionsPath))
  const items: SavedTuition[] | null = response.ok
    ? (await response.json()).data
    : null

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-7 sm:px-8 sm:py-10">
      <header className="flex flex-wrap items-end justify-between gap-5 rounded-[2rem] bg-brand-navy bg-[radial-gradient(ellipse_at_top_left,#33466e_0%,transparent_74%)] px-6 py-8 text-brand-cream sm:px-9">
        <div>
          <Bookmark
            aria-hidden="true"
            className="mb-3 size-6 text-brand-coral"
          />
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            Saved tuitions
          </h1>
          <p className="mt-2 text-sm text-brand-cream/80">
            Return to the listings you bookmarked.
          </p>
        </div>
        <Link
          href={tuitionBrowsePath}
          className={cn(
            buttonVariants(),
            "h-10 rounded-full bg-brand-coral px-4 text-brand-navy hover:bg-[#ff8a7c]"
          )}
        >
          Browse tuitions
          <ArrowUpRight aria-hidden="true" className="size-4" />
        </Link>
      </header>
      {items ? (
        <SavedTuitionList items={items} />
      ) : (
        <div
          role="alert"
          className="mt-5 rounded-2xl border bg-card p-5 text-sm"
        >
          <p>Couldn’t load your saved tuitions.</p>
          <form action={savedTuitionsPath} className="mt-3">
            <button className={buttonVariants({ variant: "outline" })}>
              Try again
            </button>
          </form>
        </div>
      )}
    </main>
  )
}
