import { Suspense } from "react"

import { PageSkeleton } from "@/components/site/page-skeleton"
import { TuitionBrowser } from "@/components/tuitions/browse/tuition-browser"

export default function TuitionsPage() {
  return (
    <div className="mx-auto min-h-[calc(100svh-5rem)] max-w-6xl">
      <Suspense fallback={<PageSkeleton label="Loading tuitions" />}>
        <TuitionBrowser />
      </Suspense>
    </div>
  )
}
