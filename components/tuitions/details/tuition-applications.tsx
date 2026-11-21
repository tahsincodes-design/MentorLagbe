"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

import { applyForJob, reviewJobApplication } from "@/lib/tuitions/api"
import {
  applicationStatusLabels,
  type ApplicationStatus,
  type JobApplication,
} from "@/lib/tuitions/types"
import { Badge } from "@/components/ui/badge"
import { Button, buttonVariants } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useSession } from "@/lib/auth-client"
import { myApplicationsPath, tuitionDetailPath } from "@/lib/tuitions/routes"

export function TuitionApplications({
  jobId,
  closed,
  canManage,
  application,
  applicants,
}: {
  jobId: string
  closed: boolean
  canManage: boolean
  application: { status: ApplicationStatus } | null
  applicants: JobApplication[]
}) {
  const router = useRouter()
  const { data: session, isPending } = useSession()
  const [message, setMessage] = React.useState("")
  const [submitted, setSubmitted] = React.useState<ApplicationStatus | null>(
    null
  )
  const [refreshing, startRefresh] = React.useTransition()
  const [busy, setBusy] = React.useState(false)
  const [error, setError] = React.useState("")
  const status = application?.status ?? submitted

  async function submitApplication(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (busy || !message.trim()) return
    setBusy(true)
    setError("")
    try {
      const result = await applyForJob(jobId, message.trim())
      setSubmitted(result.status)
      startRefresh(() => router.refresh())
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Could not send your application."
      )
    } finally {
      setBusy(false)
    }
  }

  async function review(
    applicationId: string,
    decision: "accepted" | "rejected"
  ) {
    if (busy) return
    setBusy(true)
    setError("")
    try {
      await reviewJobApplication(jobId, applicationId, decision)
      startRefresh(() => router.refresh())
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Could not review this application."
      )
    } finally {
      setBusy(false)
    }
  }

  return (
    <section className="self-start rounded-3xl border bg-card p-6">
      <h2 className="text-lg font-bold">
        {canManage ? "Applicants" : "Apply for this tuition"}
      </h2>
      {canManage ? (
        applicants.length ? (
          <ul className="mt-4 space-y-3">
            {applicants.map((applicant) => {
              const decision = applicant.status
              return (
                <li key={applicant._id} className="rounded-xl border p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="font-semibold">{applicant.name}</p>
                    <Badge variant="secondary">
                      {applicationStatusLabels[decision]}
                    </Badge>
                  </div>
                  <p className="mt-2 text-sm wrap-break-word whitespace-pre-wrap text-muted-foreground">
                    {applicant.message}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Button
                      type="button"
                      size="sm"
                      disabled={busy || refreshing || decision === "accepted"}
                      onClick={() => void review(applicant._id, "accepted")}
                    >
                      Accept
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={busy || refreshing || decision === "rejected"}
                      onClick={() => void review(applicant._id, "rejected")}
                    >
                      Decline
                    </Button>
                  </div>
                </li>
              )
            })}
          </ul>
        ) : (
          <p className="mt-3 text-sm text-muted-foreground">
            No applications yet.
          </p>
        )
      ) : status ? (
        <>
          <p
            role="status"
            className="mt-3 flex flex-wrap items-center gap-2 text-sm"
          >
            Application submitted
            <Badge variant="secondary">{applicationStatusLabels[status]}</Badge>
          </p>
          <Link
            href={myApplicationsPath}
            className={buttonVariants({
              variant: "outline",
              className: "mt-4",
            })}
          >
            My applications
          </Link>
        </>
      ) : closed ? (
        <p className="mt-3 text-sm text-muted-foreground">
          This tuition is closed to applications.
        </p>
      ) : isPending ? (
        <p role="status" className="mt-3 text-sm text-muted-foreground">
          Checking your account…
        </p>
      ) : !session ? (
        <Link
          href={`/login?next=${encodeURIComponent(tuitionDetailPath(jobId))}`}
          className={buttonVariants({ className: "mt-4" })}
        >
          Sign in to apply
        </Link>
      ) : (session.user.role ?? "student").toLowerCase() === "student" ? (
        <form onSubmit={submitApplication} className="mt-4 grid gap-3">
          <Label htmlFor="application-message">
            What would you like to learn?
          </Label>
          <Textarea
            id="application-message"
            rows={5}
            maxLength={1000}
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            required
          />
          <Button type="submit" disabled={busy || !message.trim()}>
            {busy ? "Submitting…" : "Submit application"}
          </Button>
        </form>
      ) : (
        <p className="mt-3 text-sm text-muted-foreground">
          Only students can apply.
        </p>
      )}
      {error ? (
        <p role="alert" className="mt-3 text-sm text-destructive">
          {error}
        </p>
      ) : null}
    </section>
  )
}
