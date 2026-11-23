import type { Metadata } from "next"
import { redirect } from "next/navigation"

import { isTutorRole } from "@/components/auth/roles"
import { DashboardOverview } from "@/components/dashboard/dashboard-overview"
import { TuitionSidebar } from "@/components/tuitions/shared/tuition-sidebar"
import { requireTuitionSession } from "@/lib/tuitions/access"
import { dashboardPath } from "@/lib/tuitions/routes"

export const metadata: Metadata = {
  title: "Dashboard | MentorLagbe",
  robots: { index: false, follow: false },
}

export default async function DashboardPage() {
  const { user, role } = await requireTuitionSession(dashboardPath)
  if (role !== "student" && role !== "admin" && !isTutorRole(role))
    redirect("/")

  return (
    <div className="mx-auto grid max-w-6xl items-start gap-5 px-4 py-6 sm:px-6 lg:grid-cols-[14rem_minmax(0,1fr)] lg:py-9">
      <TuitionSidebar
        name={user.name}
        email={user.email}
        image={user.image}
        role={role}
        variant="dashboard"
      />
      <main className="min-w-0">
        <header className="mb-5 rounded-3xl bg-brand-navy px-6 py-7 text-brand-cream shadow-md sm:px-8">
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            Dashboard
          </h1>
          <p className="mt-2 text-sm text-brand-cream/75 sm:text-base">
            {role === "student"
              ? "Track your tuition applications and decisions."
              : role === "admin"
                ? "Monitor tuition reviews and application activity across MentorLagbe."
                : "See how your tuition posts and student applications are doing."}
          </p>
        </header>
        <DashboardOverview
          key={user.id + ":" + role}
          compact={role === "student"}
        />
      </main>
    </div>
  )
}
