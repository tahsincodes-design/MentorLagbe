import type { Metadata } from "next"
import Link from "next/link"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { ArrowUpRight } from "lucide-react"

import { ApplicationsList } from "@/components/applications/applications-list"
import { Button, buttonVariants } from "@/components/ui/button"
import { readMyApplications } from "@/lib/jobs-proxy"
import { myApplicationsPath, tuitionBrowsePath } from "@/lib/tuitions/routes"
import type { StudentApplication } from "@/lib/tuitions/types"
import { cn } from "@/lib/utils"

export const metadata: Metadata = {
  title: "My Applications | MentorLagbe",
  robots: { index: false, follow: false },
}

export default async function ApplicationsPage() {
  const response = await readMyApplications(await headers())
  if (response.status === 401) {
    redirect(`/login?next=${encodeURIComponent(myApplicationsPath)}`)
  }
  if (response.status === 403) redirect(tuitionBrowsePath)

  const applications: StudentApplication[] | null = response.ok
    ? (await response.json()).data
    : null

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-7 sm:px-8 sm:py-10">
      <header className="flex flex-wrap items-end justify-between gap-5 rounded-[2rem] bg-brand-navy bg-[radial-gradient(ellipse_at_top_left,#2d3f66_0%,transparent_74%)] px-6 py-8 text-brand-cream sm:px-9">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            My applications
          </h1>
          <p className="mt-2 max-w-md text-sm leading-relaxed text-brand-cream/80">
            Track the tuitions you’ve applied for and see when tutors respond.
          </p>
        </div>
        <Link
          href={tuitionBrowsePath}
          className={cn(
            buttonVariants(),
            "h-10 rounded-full bg-brand-coral px-4 text-brand-navy hover:bg-[#ff8a7c]"
          )}
        >
          Browse tuitions
          <ArrowUpRight aria-hidden="true" className="size-4" />
        </Link>
      </header>
      {applications ? (
        <ApplicationsList applications={applications} />
      ) : (
        <section
          className="mt-5 rounded-3xl border bg-card p-6"
          aria-labelledby="load-applications"
        >
          <h2 id="load-applications" className="font-semibold">
            Couldn’t load your applications
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Try again in a moment.
          </p>
          <form action={myApplicationsPath} className="mt-4">
            <Button type="submit" variant="outline">
              Try again
            </Button>
          </form>
        </section>
      )}
    </main>
  )
}
