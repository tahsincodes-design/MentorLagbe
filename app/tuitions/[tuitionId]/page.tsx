import Link from "next/link"
import { headers } from "next/headers"
import { notFound } from "next/navigation"
import { ArrowLeft, Banknote, BookOpen, MapPin, UserRound } from "lucide-react"

import { TuitionApplications } from "@/components/tuitions/details/tuition-applications"
import { TuitionApproval } from "@/components/tuitions/details/tuition-approval"
import { approvalLabels, type JobDetails } from "@/lib/tuitions/types"
import { Badge } from "@/components/ui/badge"
import { readJobDetails } from "@/lib/jobs-proxy"
import { tuitionBrowsePath } from "@/lib/tuitions/routes"

export default async function TuitionDetailsPage({
  params,
}: {
  params: Promise<{ tuitionId: string }>
}) {
  const { tuitionId } = await params
  const response = await readJobDetails(tuitionId, await headers())
  if (response.status === 404) notFound()

  const backLink = (
    <Link
      href={tuitionBrowsePath}
      className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground"
    >
      <ArrowLeft className="size-4" />
      Browse tuitions
    </Link>
  )

  if (!response.ok) {
    return (
      <main className="mx-auto grid max-w-5xl gap-5 px-4 py-8 sm:px-6">
        {backLink}
        <p
          role="alert"
          className="rounded-xl border border-destructive/20 bg-destructive/5 p-5 text-destructive"
        >
          Could not load this tuition. Refresh the page to try again.
        </p>
      </main>
    )
  }

  const {
    data: job,
    application,
    applicants,
  } = (await response.json()) as JobDetails
  const closed = !job.isActive || job.approvalStatus !== "approved"
  const facts = [
    { label: "Subject", value: job.subject || "Unspecified", icon: BookOpen },
    { label: "Location", value: job.location || "Online", icon: MapPin },
    {
      label: "Monthly fee",
      value:
        job.salary == null || job.salary === ""
          ? "Unspecified"
          : `৳${job.salary}`,
      icon: Banknote,
    },
    {
      label: "Posted by",
      value: job.postedBy?.name || "Tutor",
      icon: UserRound,
    },
  ]

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6">
      {backLink}
      <div className="mt-5 grid gap-5 lg:grid-cols-[3fr_2fr]">
        <article className="min-w-0 rounded-3xl border bg-card p-6 sm:p-8">
          <Badge variant={closed ? "secondary" : "outline"}>
            {job.approvalStatus !== "approved"
              ? approvalLabels[job.approvalStatus]
              : closed
                ? "Paused"
                : "Open to applications"}
          </Badge>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight wrap-break-word sm:text-4xl">
            {job.title}
          </h1>
          <dl className="mt-6 grid gap-4 border-y py-5 sm:grid-cols-2">
            {facts.map(({ label, value, icon: Icon }) => (
              <div key={label} className="flex min-w-0 gap-3">
                <Icon
                  aria-hidden="true"
                  className="mt-0.5 size-5 shrink-0 text-brand-coral-deep"
                />
                <div className="min-w-0">
                  <dt className="text-xs font-medium text-muted-foreground">
                    {label}
                  </dt>
                  <dd className="text-sm font-semibold wrap-break-word">
                    {value}
                  </dd>
                </div>
              </div>
            ))}
          </dl>
          <h2 className="mt-6 text-lg font-bold">Tuition description</h2>
          <p className="mt-2 text-sm leading-relaxed wrap-break-word whitespace-pre-wrap text-muted-foreground">
            {job.description}
          </p>
        </article>
        {job.canModerate ? (
          <TuitionApproval job={job} />
        ) : (
          <TuitionApplications
            jobId={job._id}
            closed={closed}
            canManage={job.canManage}
            application={application}
            applicants={applicants}
          />
        )}
      </div>
    </main>
  )
}
