"use client"

import { usePathname, useRouter } from "next/navigation"
import {
  BriefcaseBusiness,
  Bookmark,
  ClipboardList,
  Crown,
  LayoutDashboard,
  UserRound,
  LogOut,
} from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { SiteNavigationLink } from "@/components/site/site-navigation-link"
import { signOut } from "@/lib/auth-client"
import { cn } from "@/lib/utils"
import { membershipPath } from "@/lib/membership/plans"
import {
  dashboardPath,
  isTuitionDetailPath,
  myApplicationsPath,
  savedTuitionsPath,
  tuitionApprovalsPath,
  tuitionBrowsePath,
  tuitionManagePath,
} from "@/lib/tuitions/routes"
import { isTutorRole } from "@/components/auth/roles"

type TuitionSidebarProps = {
  name?: string
  email?: string
  image?: string | null
  role?: string
  variant?: "dashboard"
}

export function TuitionSidebar({
  name = "MentorLagbe User",
  email,
  image,
  role,
  variant,
}: TuitionSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const normalizedRole = role?.toLowerCase()

  const isTutor = isTutorRole(normalizedRole)
  const isAdmin = normalizedRole === "admin"
  const items = [
    { label: "Dashboard", href: dashboardPath, icon: LayoutDashboard },
    {
      label: "Browse tuitions",
      href: tuitionBrowsePath,
      icon: BriefcaseBusiness,
    },
    ...(isTutor || isAdmin
      ? [
          {
            label: isAdmin ? "Tuition approvals" : "My tuitions",
            href: isAdmin ? tuitionApprovalsPath : tuitionManagePath,
            icon: BriefcaseBusiness,
          },
        ]
      : []),
    ...(normalizedRole === "student"
      ? [
          {
            label: "My applications",
            href: myApplicationsPath,
            icon: ClipboardList,
          },
        ]
      : []),
    ...(isTutor
      ? [{ label: "Membership", href: membershipPath, icon: Crown }]
      : []),
    ...(role
      ? [
          { label: "Saved tuitions", href: savedTuitionsPath, icon: Bookmark },
          { label: "Profile", href: "/profile", icon: UserRound },
        ]
      : []),
  ]

  const initials = (name || email || "ML")
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()

  async function handleSignOut() {
    await signOut()
    router.replace("/login")
  }

  return (
    <aside
      className={cn(
        "min-w-0 flex-col rounded-2xl border border-brand-navy/10 bg-brand-navy py-5 text-brand-cream",
        variant === "dashboard"
          ? "flex lg:sticky lg:top-24"
          : "mx-5 mt-5 hidden w-56 shrink-0 lg:flex lg:min-h-[calc(100svh-5rem)]"
      )}
    >
      <div className="flex items-center gap-3 px-4 lg:flex-col lg:gap-1">
        <Avatar className="size-11 ring-2 ring-brand-cream/15 lg:size-16">
          {image ? <AvatarImage src={image} alt={name} /> : null}
          <AvatarFallback className="bg-brand-cream text-lg font-bold text-brand-navy">
            {initials}
          </AvatarFallback>
        </Avatar>
        <p className="max-w-full truncate text-sm font-bold lg:mt-2">{name}</p>
        <span className="shrink-0 rounded-full bg-brand-cream/10 px-3 py-1 text-[0.65rem] font-bold text-brand-coral">
          {normalizedRole === "admin"
            ? "Admin"
            : isTutor
              ? "Tutor"
              : normalizedRole === "student"
                ? "Student"
                : "Guest"}
        </span>
      </div>

      <nav
        className="mt-4 flex flex-1 flex-wrap gap-1 px-3 lg:mt-6 lg:flex-col"
        aria-label={variant === "dashboard" ? "Dashboard" : "Tuition tools"}
      >
        {items.map((item) => {
          const Icon = item.icon
          const active =
            pathname === item.href ||
            (item.href === tuitionBrowsePath && isTuitionDetailPath(pathname))

          return (
            <SiteNavigationLink
              key={item.label}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex h-10 items-center gap-3 rounded-lg px-3 text-sm font-semibold transition-colors",
                active
                  ? "bg-brand-coral text-white"
                  : "text-brand-cream/70 hover:bg-brand-cream/10 hover:text-brand-cream"
              )}
            >
              <Icon className="size-4" />
              {item.label}
            </SiteNavigationLink>
          )
        })}
      </nav>

      {role ? (
        <div className="mt-3 hidden border-t border-brand-cream/10 px-3 pt-3 lg:block">
          <button
            type="button"
            onClick={handleSignOut}
            className="flex h-10 w-full items-center gap-3 rounded-lg px-3 text-sm font-semibold text-brand-cream/70 hover:bg-brand-cream/10 hover:text-brand-cream"
          >
            <LogOut className="size-4" />
            Sign Out
          </button>
        </div>
      ) : null}
    </aside>
  )
}
