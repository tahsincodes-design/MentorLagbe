"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  BriefcaseBusiness,
  ClipboardList,
  LayoutDashboard,
  UserRound,
  Plus,
  LogOut,
} from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { signOut } from "@/lib/auth-client"
import { cn } from "@/lib/utils"
import {
  myApplicationsPath,
  tuitionBrowsePath,
  tuitionManagePath,
} from "@/lib/tuitions/routes"
import { isTutorRole } from "@/components/auth/roles"

type TuitionSidebarProps = {
  name?: string
  email?: string
  image?: string | null
  role?: string
  openAddJob?: () => void
}

export function TuitionSidebar({
  name = "MentorLagbe User",
  email,
  image,
  role,
  openAddJob,
}: TuitionSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const normalizedRole = role?.toLowerCase()

  const isTutor = isTutorRole(normalizedRole)
  const isAdmin = normalizedRole === "admin"
  const items = [
    { label: "Home", href: "/", icon: LayoutDashboard },
    {
      label: "Browse tuitions",
      href: tuitionBrowsePath,
      icon: BriefcaseBusiness,
    },
    ...(isTutor || isAdmin
      ? [
          {
            label: isAdmin ? "Tuition approvals" : "My tuitions",
            href: tuitionManagePath,
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
    ...(role ? [{ label: "Profile", href: "/profile", icon: UserRound }] : []),
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
    <aside className="mx-5 mt-5 hidden w-56 shrink-0 rounded-2xl border-r border-brand-navy/10 bg-brand-navy py-5 text-brand-cream lg:flex lg:min-h-[calc(100svh-5rem)] lg:flex-col">
      <div className="flex flex-col items-center px-4">
        <Avatar className="size-16 ring-2 ring-brand-cream/15">
          {image ? <AvatarImage src={image} alt={name} /> : null}
          <AvatarFallback className="bg-brand-cream text-lg font-bold text-brand-navy">
            {initials}
          </AvatarFallback>
        </Avatar>
        <p className="mt-3 max-w-full truncate text-sm font-bold">{name}</p>
        <span className="mt-1 rounded-full bg-brand-cream/10 px-3 py-1 text-[0.65rem] font-bold text-brand-coral">
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
        className="mt-6 flex flex-1 flex-col gap-1 px-3"
        aria-label="Tuitions"
      >
        {items.map((item) => {
          const Icon = item.icon
          const active =
            pathname === item.href ||
            (item.href === tuitionBrowsePath &&
              pathname !== tuitionManagePath &&
              pathname.startsWith(`${tuitionBrowsePath}/`))

          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "flex h-10 items-center gap-3 rounded-lg px-3 text-sm font-semibold transition-colors",
                active
                  ? "bg-brand-coral text-white"
                  : "text-brand-cream/70 hover:bg-brand-cream/10 hover:text-brand-cream"
              )}
            >
              <Icon className="size-4" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      {isTutor && openAddJob ? (
        <div className="px-3 pb-3">
          <Button
            type="button"
            onClick={openAddJob}
            className="w-full rounded-xl bg-brand-coral text-white hover:bg-brand-coral-deep"
          >
            <Plus className="size-4" />
            Post tuition
          </Button>
        </div>
      ) : null}

      {role ? (
        <div className="border-t border-brand-cream/10 px-3 pt-3">
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
