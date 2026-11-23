export function TuitionCardsSkeleton({
  label = "Loading tuitions",
  count = 4,
}: {
  label?: string
  count?: number
}) {
  return (
    <div role="status" className="grid gap-4 md:grid-cols-2">
      <span className="sr-only">{label}</span>
      {Array.from({ length: count }, (_, index) => (
        <div
          key={index}
          aria-hidden="true"
          className="space-y-3 rounded-2xl border bg-card p-5 motion-safe:animate-pulse"
        >
          <div className="h-4 w-20 rounded-full bg-muted" />
          <div className="h-6 w-2/3 rounded bg-muted" />
          <div className="h-4 w-full rounded bg-muted" />
          <div className="h-9 w-24 rounded-full bg-muted" />
        </div>
      ))}
    </div>
  )
}

export function PageSkeleton({
  label,
  count,
}: {
  label: string
  count?: number
}) {
  return (
    <main className="mx-auto min-h-screen max-w-6xl space-y-5 px-4 py-7 sm:px-8 sm:py-10">
      <div
        aria-hidden="true"
        className="space-y-3 rounded-3xl border bg-card p-6 motion-safe:animate-pulse"
      >
        <div className="h-8 w-2/5 rounded bg-muted" />
        <div className="h-4 w-3/5 rounded bg-muted" />
      </div>
      <TuitionCardsSkeleton label={label} count={count} />
    </main>
  )
}

export function DashboardSkeleton({ compact = false }: { compact?: boolean }) {
  return (
    <div role="status" className="grid gap-5">
      <span className="sr-only">Loading dashboard analytics</span>
      <div
        aria-hidden="true"
        className={compact ? "" : "grid gap-5 md:grid-cols-2"}
      >
        {Array.from({ length: compact ? 1 : 2 }, (_, index) => (
          <div
            key={index}
            className="space-y-4 rounded-xl border bg-card p-4 motion-safe:animate-pulse"
          >
            <div className="h-5 w-36 rounded bg-muted" />
            <div className="flex flex-wrap items-center gap-5">
              <div className="size-32 rounded-full border-16 border-muted" />
              <div className="min-w-20 flex-1 space-y-3">
                <div className="h-4 rounded bg-muted" />
                <div className="h-4 rounded bg-muted" />
                <div className="h-4 rounded bg-muted" />
              </div>
            </div>
          </div>
        ))}
      </div>
      <div
        aria-hidden="true"
        className="space-y-4 rounded-xl border bg-card p-4 motion-safe:animate-pulse"
      >
        <div className="h-5 w-32 rounded bg-muted" />
        <div className="h-44 rounded-lg bg-muted" />
      </div>
    </div>
  )
}
