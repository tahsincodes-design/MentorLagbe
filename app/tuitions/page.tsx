"use client"

import { TuitionBrowser } from "@/components/tuitions/browse/tuition-browser"
import { TuitionSidebar } from "@/components/tuitions/shared/tuition-sidebar"
import { useSession } from "@/lib/auth-client"

export default function TuitionsPage() {
  const { data: session, isPending } = useSession()
  const user = session?.user
  const role = user ? (user.role ?? "student") : undefined

  if (isPending) {
    return (
      <div className="min-h-[calc(100svh-5rem)] animate-pulse bg-muted/30" />
    )
  }

  return (
    <div className="mx-auto flex min-h-[calc(100svh-5rem)] max-w-[1180px] overflow-hidden border-x border-border bg-background">
      <TuitionSidebar
        name={user?.name}
        email={user?.email}
        image={user?.image}
        role={role}
      />
      <TuitionBrowser key={user?.id ?? "guest"} role={role} />
    </div>
  )
}
