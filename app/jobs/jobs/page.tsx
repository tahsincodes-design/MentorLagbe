"use client"

import * as React from "react"

import { JobsBrowser } from "@/components/jobs/jobs-browser"
import { JobsSidebar } from "@/components/jobs/jobs-sidebar"
import { useSession } from "@/lib/auth-client"

export default function JobsPage() {
  const { data: session, isPending } = useSession()
  const user = session?.user

  if (isPending) {
    return (
      <div className="min-h-[calc(100svh-5rem)] animate-pulse bg-muted/30" />
    )
  }

  return (
    <div className="mx-auto flex min-h-[calc(100svh-5rem)] max-w-[1180px] overflow-hidden border-x border-border bg-background">
      <JobsSidebar
        name={user?.name}
        email={user?.email}
        image={user?.image}
        role={user?.role ?? "student"}
      />
      <JobsBrowser role={user?.role ?? "student"} userEmail={user?.email} />
    </div>
  )
}
