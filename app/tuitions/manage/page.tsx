"use client"

import * as React from "react"
import { useRouter } from "next/navigation"

import { TuitionSidebar } from "@/components/tuitions/shared/tuition-sidebar"
import { TuitionDashboard } from "@/components/tuitions/manage/tuition-dashboard"
import { isTutorRole } from "@/components/auth/roles"
import { useSession } from "@/lib/auth-client"
import { tuitionBrowsePath, tuitionManagePath } from "@/lib/tuitions/routes"

export default function ManageTuitionsPage() {
  const router = useRouter()
  const { data: session, isPending } = useSession()
  const user = session?.user
  const [open, setOpen] = React.useState(false)

  React.useEffect(() => {
    if (isPending) return
    if (!user) {
      router.replace(`/login?next=${encodeURIComponent(tuitionManagePath)}`)
      return
    }
    const role = (user.role ?? "student").toLowerCase()
    if (!isTutorRole(role) && role !== "admin") {
      router.replace(tuitionBrowsePath)
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
      <TuitionSidebar
        name={user.name}
        email={user.email}
        image={user.image}
        role={role}
        openAddJob={() => setOpen(true)}
      />
      <TuitionDashboard
        role={role}
        openAddJob={open}
        onOpenAddJobChange={setOpen}
      />
    </div>
  )
}
