"use client"

import Link from "next/link"
import { ArrowUpRight, ClipboardList, UserRound } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { tuitionBrowsePath, tuitionDetailPath } from "@/lib/tuitions/routes"
import {
  applicationStatusLabels,
  type StudentApplication,
} from "@/lib/tuitions/types"

const filters = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "accepted", label: "Accepted" },
  { value: "rejected", label: "Declined" },
] as const

const statusStyles = {
  pending:
    "border-amber-600/25 bg-amber-500/10 text-amber-800 dark:text-amber-300",
  accepted:
    "border-emerald-600/25 bg-emerald-500/10 text-emerald-800 dark:text-emerald-300",
  rejected:
    "border-rose-600/25 bg-rose-500/10 text-rose-800 dark:text-rose-300",
}

const dateFormatter = new Intl.DateTimeFormat("en-GB", {
  dateStyle: "medium",
  timeZone: "Asia/Dhaka",
})

export function ApplicationsList({
  applications,
}: {
  applications: StudentApplication[]
}) {
  const groups = filters.map((filter) => ({
    ...filter,
    records:
      filter.value === "all"
        ? applications
        : applications.filter(
            (application) => application.status === filter.value
          ),
  }))

  return (
    <Tabs defaultValue="all" className="mt-5 gap-4">
      <TabsList
        aria-label="Filter applications"
        className="grid w-full grid-cols-4 gap-1 rounded-xl group-data-horizontal/tabs:h-11 sm:w-fit"
      >
        {groups.map(({ value, label, records }) => (
          <TabsTrigger
            key={value}
            value={value}
            className="rounded-lg px-1 text-xs sm:px-3 sm:text-sm"
          >
            {label}
            <span className="rounded-full bg-muted px-1.5 text-[0.65rem] tabular-nums">
              {records.length}
            </span>
          </TabsTrigger>
        ))}
      </TabsList>
      {groups.map(({ value, label, records }) => (
        <TabsContent key={value} value={value}>
          {records.length ? (
            <ul className="grid gap-3">
              {records.map((record) => (
                <li key={record._id}>
                  <ApplicationCard application={record} />
                </li>
              ))}
            </ul>
          ) : (
            <div className="grid justify-items-center rounded-3xl border border-dashed bg-card p-7 text-center sm:p-10">
              <ClipboardList
                aria-hidden="true"
                className="size-7 text-muted-foreground"
              />
              <h2 className="mt-3 font-semibold">
                {value === "all"
                  ? "No applications yet"
                  : `No ${label.toLowerCase()} applications`}
              </h2>
              {value === "all" ? (
                <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                  When you apply for a tuition, you’ll be able to follow its
                  progress here.
                </p>
              ) : null}
              <Link
                href={tuitionBrowsePath}
                className={buttonVariants({
                  variant: "outline",
                  className: "mt-4",
                })}
              >
                Browse tuitions
              </Link>
            </div>
          )}
        </TabsContent>
      ))}
    </Tabs>
  )
}

function ApplicationCard({ application }: { application: StudentApplication }) {
  const date = application.createdAt ? new Date(application.createdAt) : null

  return (
    <Card className="card-elevation gap-0 rounded-2xl py-0">
      <CardContent className="flex flex-wrap items-center justify-between gap-4 p-4 sm:p-5">
        <div className="min-w-0 grow">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
            <h2 className="text-base font-bold wrap-anywhere">
              {application.title ?? "Unavailable tuition"}
            </h2>
            <Badge
              variant="outline"
              className={statusStyles[application.status]}
            >
              {applicationStatusLabels[application.status]}
            </Badge>
          </div>
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <UserRound aria-hidden="true" className="size-4 shrink-0" />
              {application.tutorName ?? "Tutor name unavailable"}
            </span>
            {date && !Number.isNaN(date.getTime()) ? (
              <span>
                Applied{" "}
                <time dateTime={date.toISOString()}>
                  {dateFormatter.format(date)}
                </time>
              </span>
            ) : null}
          </div>
        </div>
        {application.available ? (
          <Link
            href={tuitionDetailPath(application.tuitionId)}
            className={buttonVariants({ variant: "outline" })}
          >
            View tuition
            <ArrowUpRight aria-hidden="true" className="size-4" />
          </Link>
        ) : (
          <span className="text-xs text-muted-foreground">
            Listing unavailable
          </span>
        )}
      </CardContent>
    </Card>
  )
}
