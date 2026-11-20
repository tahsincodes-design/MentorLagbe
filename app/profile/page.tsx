"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  ArrowRight,
  BarChart3,
  Bookmark,
  CalendarDays,
  Camera,
  CheckCircle2,
  Crown,
  FileText,
  Mail,
  MapPin,
  Pencil,
  Search,
  Sparkles,
  Zap,
  type LucideIcon,
} from "lucide-react"

import { isTutorRole, roles } from "@/components/auth/roles"
import { EditProfileDialog } from "@/components/profile/edit-profile-dialog"
import { ProfileBannerArt } from "@/components/profile/profile-banner-art"
import { SiteFooter } from "@/components/site/site-footer"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button, buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useSession } from "@/lib/auth-client"
import { cn } from "@/lib/utils"
import { tuitionBrowsePath } from "@/lib/tuitions/routes"

type AccountStats = {
  totalApplied: number
  accepted: number
}

type ProfileData = {
  stats: AccountStats
  plan: string
}

async function loadProfileData(): Promise<ProfileData> {
  // TODO(API): await fetch("/api/profile") once your profile API is deployed.
  const response = await fetch("/api/profile", { cache: "no-store" })
  if (!response.ok) throw new Error("Could not load profile data")
  return (await response.json()) as ProfileData
}

const quickActions: {
  label: string
  href: string
  icon: LucideIcon
}[] = [
  { label: "Browse Tuitions", href: tuitionBrowsePath, icon: Search },
  { label: "View Saved Tuitions", href: "/#saved-tuitions", icon: Bookmark },
  { label: "Upgrade to Pro", href: "/#pricing", icon: Crown },
]

function getInitials(name: string, email: string) {
  return (name || email || "ML")
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()
}

function formatMonthYear(value: string | Date | null | undefined) {
  if (!value) return "—"

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) return "—"

  return date.toLocaleDateString("en-US", { month: "short", year: "numeric" })
}

export default function ProfilePage() {
  const router = useRouter()
  const { data: session, isPending, refetch } = useSession()
  const user = session?.user

  const [editOpen, setEditOpen] = React.useState(false)
  const [stats, setStats] = React.useState<AccountStats>({
    totalApplied: 0,
    accepted: 0,
  })
  const [currentPlan, setCurrentPlan] = React.useState("Loading")

  // Stats come from the API, not from hardcoded values.
  React.useEffect(() => {
    if (!user?.id) return

    let active = true

    void loadProfileData()
      .then((data) => {
        if (active) {
          setStats(data.stats)
          setCurrentPlan(data.plan)
        }
      })
      .catch(() => {
        if (active) setCurrentPlan("Free")
      })

    return () => {
      active = false
    }
  }, [user?.id])

  // The profile is private: wait for the session API, then send guests to login.
  React.useEffect(() => {
    if (!isPending && !user) {
      router.replace("/login")
    }
  }, [isPending, user, router])

  if (isPending || !user) {
    return <ProfileSkeleton />
  }

  const accountRole = isTutorRole(user.role) ? "mentor" : user.role
  const roleInfo = roles.find((role) => role.value === accountRole) ?? roles[0]
  const RoleIcon = roleInfo.icon
  const memberSince = formatMonthYear(user.createdAt)
  const initials = getInitials(user.name, user.email)

  return (
    <>
      <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-8 sm:py-8">
        <section className="relative overflow-hidden rounded-3xl bg-card px-5 py-6 ring-1 ring-foreground/10 sm:px-8 sm:py-7">
          <ProfileBannerArt className="pointer-events-none absolute top-0 right-3 hidden h-28 w-64 sm:block lg:h-32 lg:w-72" />
          <div className="relative sm:max-w-md">
            <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
              My Profile
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Manage your account information and preferences.
            </p>
          </div>
        </section>

        <Card className="mt-5 rounded-3xl py-0">
          <CardContent className="flex flex-col gap-5 p-5 sm:flex-row sm:items-start sm:gap-6 sm:p-6">
            <div className="flex flex-col items-center gap-3">
              <div className="relative">
                <Avatar className="size-24 after:border-2">
                  {user.image ? (
                    <AvatarImage src={user.image} alt={user.name} />
                  ) : null}
                  <AvatarFallback className="bg-brand-navy text-2xl font-bold text-brand-cream">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <span className="absolute right-0 bottom-0 grid size-7 place-items-center rounded-full bg-brand-coral text-white ring-2 ring-card">
                  <Camera className="size-3.5" />
                </span>
              </div>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setEditOpen(true)}
                className="rounded-full border-brand-coral/40 px-4 text-xs font-semibold text-brand-coral-deep hover:bg-brand-coral/10 hover:text-brand-coral-deep dark:text-brand-coral dark:hover:text-brand-coral"
              >
                Change Photo
              </Button>
            </div>

            <div className="min-w-0 flex-1 text-center sm:pt-1 sm:text-left">
              <div className="flex flex-col items-center gap-2 sm:flex-row sm:flex-wrap">
                <h2 className="truncate text-2xl font-extrabold tracking-tight">
                  {user.name}
                </h2>
                <Badge
                  variant="outline"
                  className="rounded-full border-brand-coral/30 bg-brand-coral/10 text-[0.7rem] font-bold text-brand-coral-deep dark:text-brand-coral"
                >
                  <RoleIcon className="size-3" />
                  {roleInfo.label}
                </Badge>
              </div>

              <div className="mt-2.5 flex flex-col items-center gap-1.5 text-sm text-muted-foreground sm:items-start">
                <p className="flex items-center gap-2">
                  <Mail className="size-4 shrink-0" />
                  <span className="truncate">{user.email}</span>
                </p>
                <p className="flex items-center gap-2">
                  <MapPin className="size-4 shrink-0" />
                  {user.location || (
                    <span className="text-muted-foreground/70">
                      Location not set
                    </span>
                  )}
                </p>
              </div>

              {user.bio ? (
                <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-muted-foreground sm:mx-0">
                  {user.bio}
                </p>
              ) : null}
            </div>

            <Button
              type="button"
              onClick={() => setEditOpen(true)}
              className="self-stretch rounded-xl bg-brand-navy px-5 text-brand-cream shadow-sm hover:bg-brand-navy/90 sm:self-start dark:bg-brand-cream dark:text-brand-navy dark:hover:bg-brand-cream/90"
            >
              <Pencil className="size-4" />
              Edit Profile
            </Button>
          </CardContent>
        </Card>

        <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1fr)_22rem]">
          <div className="flex flex-col gap-5">
            <Card className="rounded-3xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base font-bold">
                  <BarChart3 className="size-4 text-brand-navy dark:text-brand-cream" />
                  Account Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <StatRow
                  icon={FileText}
                  label="Total Applied"
                  value={String(stats.totalApplied)}
                />
                <StatRow
                  icon={CheckCircle2}
                  label="Accepted"
                  value={String(stats.accepted)}
                />
                <StatRow
                  icon={Crown}
                  label="Current Plan"
                  value={currentPlan}
                />
              </CardContent>
            </Card>

            <Card className="rounded-3xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base font-bold">
                  <Zap className="size-4 text-brand-coral" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-1">
                {quickActions.map((action) => {
                  const Icon = action.icon

                  return (
                    <Link
                      key={action.label}
                      href={action.href}
                      className="group flex items-center gap-3 rounded-xl px-2 py-2.5 text-sm font-semibold transition-colors hover:bg-muted/60"
                    >
                      <Icon className="size-4 text-muted-foreground" />
                      <span className="flex-1">{action.label}</span>
                      <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                    </Link>
                  )
                })}
              </CardContent>
            </Card>
          </div>

          <div className="flex flex-col gap-5">
            <Card className="rounded-3xl">
              <CardContent className="flex flex-col items-start gap-1 p-5">
                <p className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
                  <Sparkles className="size-4 text-amber-500" />
                  Plan Status
                </p>
                <p className="mt-1 text-xl font-extrabold">
                  {currentPlan} Plan
                </p>
                <p className="text-xs text-muted-foreground">
                  Upgrade for more benefits
                </p>
                <Link
                  href="/#pricing"
                  className={cn(
                    buttonVariants(),
                    "mt-3 w-full rounded-xl bg-brand-coral text-sm font-semibold text-white hover:bg-brand-coral-deep"
                  )}
                >
                  Upgrade Now
                </Link>
              </CardContent>
            </Card>

            <Card className="rounded-3xl">
              <CardContent className="flex flex-col items-start gap-1 p-5">
                <p className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
                  <CalendarDays className="size-4 text-brand-coral" />
                  Member Since
                </p>
                <p className="mt-1 text-xl font-extrabold">{memberSince}</p>
                <p className="text-xs text-muted-foreground">
                  Thanks for being part of MentorLagbe.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <EditProfileDialog
        key={`${editOpen}-${user.name}-${user.email}-${user.image ?? ""}-${user.bio ?? ""}-${user.location ?? ""}`}
        open={editOpen}
        onOpenChange={setEditOpen}
        user={{
          name: user.name,
          email: user.email,
          image: user.image,
          bio: user.bio,
          location: user.location,
        }}
        onSaved={() => {
          void refetch()
        }}
      />

      <SiteFooter />
    </>
  )
}

function StatRow({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon
  label: string
  value: string
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-lg bg-muted/70 text-muted-foreground">
        <Icon className="size-4" />
      </span>
      <div className="min-w-0">
        <p className="text-xs font-medium text-muted-foreground">{label}</p>
        <p className="text-base font-bold">{value}</p>
      </div>
    </div>
  )
}

function ProfileSkeleton() {
  return (
    <main className="mx-auto w-full max-w-6xl animate-pulse px-4 py-6 sm:px-8 sm:py-8">
      <div className="h-28 rounded-3xl bg-muted" />
      <div className="mt-5 h-44 rounded-3xl bg-muted" />
      <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="h-64 rounded-3xl bg-muted" />
        <div className="h-64 rounded-3xl bg-muted" />
      </div>
    </main>
  )
}
