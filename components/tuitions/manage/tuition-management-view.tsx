import { TuitionDashboard } from "@/components/tuitions/manage/tuition-dashboard"
import { TuitionSidebar } from "@/components/tuitions/shared/tuition-sidebar"

export function TuitionManagementView({
  user,
  role,
  startPosting,
}: {
  user: { name: string; email: string; image?: string | null }
  role: string
  startPosting?: boolean
}) {
  return (
    <div className="mx-auto flex min-h-[calc(100svh-5rem)] max-w-[1180px] overflow-hidden border-x border-border bg-background">
      <TuitionSidebar
        name={user.name}
        email={user.email}
        image={user.image}
        role={role}
      />
      <TuitionDashboard role={role} startPosting={startPosting} />
    </div>
  )
}
