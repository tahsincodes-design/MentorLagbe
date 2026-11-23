"use client"

import { useEffect, useState } from "react"

import {
  ActivityChart,
  chartColors,
  OutcomeChart,
} from "@/components/dashboard/dashboard-charts"
import { DashboardSkeleton } from "@/components/site/page-skeleton"
import { Button } from "@/components/ui/button"
import { fetchDashboardAnalytics } from "@/lib/tuitions/api"
import type { DashboardAnalytics } from "@/lib/tuitions/analytics"

type Result =
  { data: DashboardAnalytics; error?: never } | { data?: never; error: string }

export function DashboardOverview({ compact }: { compact: boolean }) {
  const [result, setResult] = useState<Result>()
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    const controller = new AbortController()
    fetchDashboardAnalytics(controller.signal).then(
      (data) => {
        if (!controller.signal.aborted) setResult({ data })
      },
      (error: unknown) => {
        if (!controller.signal.aborted) {
          setResult({
            error:
              error instanceof Error
                ? error.message
                : "Could not load dashboard analytics.",
          })
        }
      }
    )
    return () => controller.abort()
  }, [attempt])

  if (!result) return <DashboardSkeleton compact={compact} />
  if (result.error !== undefined) {
    return (
      <div className="rounded-2xl border bg-card p-5">
        <p role="alert" className="text-sm text-destructive">
          {result.error}
        </p>
        <Button
          variant="outline"
          className="mt-3"
          onClick={() => {
            setResult(undefined)
            setAttempt((value) => value + 1)
          }}
        >
          Try again
        </Button>
      </div>
    )
  }

  const { role, applications, tuitions, months } = result.data
  const student = role === "student"
  return (
    <div className="grid gap-5 motion-safe:animate-in motion-safe:fade-in">
      <section
        aria-label="Status breakdowns"
        className={tuitions ? "grid gap-5 md:grid-cols-2" : ""}
      >
        {tuitions ? (
          <OutcomeChart
            title="Tuition post outcomes"
            description={
              role === "tutor"
                ? "Review status of your current posts."
                : "Review status of current posts across MentorLagbe."
            }
            rateLabel="Approval rate"
            segments={[
              {
                label: "Approved",
                value: tuitions.approved,
                color: chartColors.positive,
              },
              {
                label: "Rejected",
                value: tuitions.rejected,
                color: chartColors.negative,
              },
              {
                label: "Pending",
                value: tuitions.pending,
                color: chartColors.pending,
              },
            ]}
          />
        ) : null}
        <OutcomeChart
          title={
            student
              ? "My application outcomes"
              : role === "tutor"
                ? "Student application outcomes"
                : "Platform application outcomes"
          }
          description={
            role === "tutor"
              ? "Applications to your current and past posts."
              : "Status across all application dates."
          }
          rateLabel={student ? "Success rate" : "Acceptance rate"}
          segments={[
            {
              label: "Accepted",
              value: applications.accepted,
              color: chartColors.positive,
            },
            {
              label: "Rejected",
              value: applications.rejected,
              color: chartColors.negative,
            },
            {
              label: "Pending",
              value: applications.pending,
              color: chartColors.pending,
            },
          ]}
        />
      </section>
      <ActivityChart
        months={months}
        series={
          student
            ? [
                {
                  key: "applications",
                  label: "Applications submitted",
                  color: chartColors.activity,
                },
                {
                  key: "acceptedApplications",
                  label: "Accepted",
                  color: chartColors.positive,
                  dash: "6 3",
                },
                {
                  key: "rejectedApplications",
                  label: "Rejected",
                  color: chartColors.negative,
                  dash: "2 4",
                },
              ]
            : role === "tutor"
              ? [
                  {
                    key: "tuitions",
                    label: "Posts created",
                    color: chartColors.pending,
                  },
                  {
                    key: "applications",
                    label: "Applications received",
                    color: chartColors.activity,
                    dash: "6 3",
                  },
                  {
                    key: "acceptedApplications",
                    label: "Applications accepted",
                    color: chartColors.positive,
                    dash: "2 4",
                  },
                ]
              : [
                  {
                    key: "tuitions",
                    label: "Posts created",
                    color: chartColors.activity,
                  },
                  {
                    key: "approvedTuitions",
                    label: "Posts approved",
                    color: chartColors.positive,
                    dash: "6 3",
                  },
                  {
                    key: "rejectedTuitions",
                    label: "Posts rejected",
                    color: chartColors.negative,
                    dash: "2 4",
                  },
                ]
        }
      />
    </div>
  )
}
