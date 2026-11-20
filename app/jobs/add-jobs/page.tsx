"use client"

import * as React from "react"
import { useRouter } from "next/navigation"

import { JobsSidebar } from "@/components/jobs/jobs-sidebar"
import { PostedJobs } from "@/components/jobs/posted-jobs"
import { isTutorRole } from "@/components/auth/roles"
import { useSession } from "@/lib/auth-client"

export default function AddJobsPage() {
  const router = useRouter()
  const { data: session, isPending } = useSession()
  const user = session?.user
  const [open, setOpen] = React.useState(false)

  React.useEffect(() => {
    if (isPending) return
    if (!user) {
      router.replace("/login")
      return
    }
    const role = (user.role ?? "student").toLowerCase()
    if (!isTutorRole(role) && role !== "admin") {
      router.replace("/jobs/jobs")
    }
  }, [isPending, user, router])

  if (isPending || !user) {
    return (
      <div className="min-h-[calc(100svh-5rem)] animate-pulse bg-muted/30" />
    )
  }

  const role = (user.role ?? "student").toLowerCase()
  if (!isTutorRole(role) && role !== "admin") return null

  return (
    <div className="mx-auto flex min-h-[calc(100svh-5rem)] max-w-[1180px] overflow-hidden border-x border-border bg-background">
      <JobsSidebar
        name={user.name}
        email={user.email}
        image={user.image}
        role={role}
        openAddJob={() => setOpen(true)}
      />
      <PostedJobs role={role} openAddJob={open} onOpenAddJobChange={setOpen} />
    </div>
  )
}
