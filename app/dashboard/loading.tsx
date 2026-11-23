import { DashboardSkeleton } from "@/components/site/page-skeleton"

export default function Loading() {
  return (
    <div className="mx-auto grid max-w-6xl items-start gap-5 px-4 py-6 sm:px-6 lg:grid-cols-[14rem_minmax(0,1fr)] lg:py-9">
      <div
        aria-hidden="true"
        className="h-24 rounded-2xl bg-muted motion-safe:animate-pulse lg:h-96"
      />
      <main className="space-y-5">
        <div
          aria-hidden="true"
          className="h-28 rounded-3xl bg-muted motion-safe:animate-pulse"
        />
        <DashboardSkeleton />
      </main>
    </div>
  )
}
