import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, BookOpen, ChevronDown, GraduationCap } from "lucide-react"

import { SiteFooter } from "@/components/site/site-footer"
import { buttonVariants } from "@/components/ui/button"
import { freeTuitionLimit, membershipPath } from "@/lib/membership/plans"
import {
  myApplicationsPath,
  tuitionBrowsePath,
  tuitionManagePath,
} from "@/lib/tuitions/routes"
import { cn } from "@/lib/utils"

export const metadata: Metadata = {
  title: "How It Works | MentorLagbe",
  description:
    "See how to find and apply for tuitions as a student or post and review applications as a tutor.",
}

const workflows = [
  {
    id: "students",
    title: "For students",
    icon: BookOpen,
    steps: [
      {
        title: "Find a tuition",
        description:
          "Filter approved listings by subject, location, and monthly fee. Open a listing to see the tutor’s description and details.",
      },
      {
        title: "Send an application",
        description:
          "Sign in with a student account and tell the tutor what you want to learn. Your application starts as Pending review.",
      },
      {
        title: "Follow the decision",
        description:
          "Visit My Applications to see whether the tutor has accepted or declined your request.",
      },
    ],
    href: tuitionBrowsePath,
    action: "Browse tuitions",
    secondary: { href: myApplicationsPath, label: "My applications" },
  },
  {
    id: "tutors",
    title: "For tutors",
    icon: GraduationCap,
    steps: [
      {
        title: "Create a listing",
        description:
          "Sign in with a tutor account and open My Tuitions. Add the subject, what you teach, the location, and your monthly fee.",
      },
      {
        title: "Wait for approval",
        description:
          "An admin reviews your listing. Students can find it once it’s approved and active. Check its status from My Tuitions.",
      },
      {
        title: "Review applications",
        description:
          "Open your listing to read student messages and accept or decline each application. Pause the listing when you stop taking applications.",
      },
    ],
    href: tuitionManagePath,
    action: "Open My Tuitions",
    secondary: { href: membershipPath, label: "Compare tutor plans" },
  },
]

const questions = [
  {
    question: "Do students need a membership to apply?",
    answer:
      "Students can browse listings and apply with a student account. The monthly fee on a listing is the amount the tutor lists for tuition. MentorLagbe Pro is a separate membership for tutors.",
  },
  {
    question: "How many listings can a tutor post?",
    answer: `Free tutors can keep up to ${freeTuitionLimit} listings, including pending and paused ones. MentorLagbe Pro allows unlimited listings.`,
  },
  {
    question: "What happens when a tutor edits a listing?",
    answer:
      "Changes to the listing details send it back for admin review. You can check the updated approval status in My Tuitions.",
  },
]

export default function HowItWorksPage() {
  return (
    <>
      <main className="mx-auto max-w-6xl px-4 pt-6 pb-4 sm:px-8 sm:pt-10">
        <header className="grid overflow-hidden rounded-[2rem] bg-brand-navy text-brand-cream md:grid-cols-[1.15fr_1fr]">
          <div className="p-6 sm:p-10 lg:p-12">
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
              How It Works
            </h1>
            <p className="mt-4 max-w-md text-base leading-7 text-brand-cream/85">
              Find a tuition that fits your goals, or post what you teach and
              hear from students who want to learn with you.
            </p>
            <nav
              aria-label="On this page"
              className="mt-6 flex flex-wrap gap-2"
            >
              {workflows.map(({ id, title }) => (
                <Link
                  key={id}
                  href={`#${id}`}
                  className="inline-flex items-center gap-2 rounded-full border border-brand-cream/30 px-4 py-2 text-sm font-semibold transition-colors hover:bg-brand-cream/10 focus-visible:ring-2 focus-visible:ring-brand-cream focus-visible:outline-none"
                >
                  {title}
                  <ChevronDown aria-hidden="true" className="size-4" />
                </Link>
              ))}
            </nav>
          </div>
          <div className="relative aspect-video overflow-hidden md:aspect-auto md:min-h-full">
            <Image
              src="/study-workspace.jpg"
              alt="Overhead view of a learner using a laptop at a study desk"
              fill
              sizes="(max-width: 767px) 150vw, (max-width: 1152px) 66vw, 730px"
              className="origin-top scale-[1.47] object-cover object-top"
            />
          </div>
        </header>

        <div className="mt-6 grid items-stretch gap-4 md:grid-cols-2">
          {workflows.map(
            ({ id, title, icon: Icon, steps, href, action, secondary }) => (
              <section
                key={id}
                id={id}
                aria-labelledby={`${id}-heading`}
                className="flex scroll-mt-24 flex-col rounded-3xl border bg-card p-5 sm:p-7"
              >
                <h2
                  id={`${id}-heading`}
                  className="flex items-center gap-3 text-2xl font-bold tracking-tight"
                >
                  <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-brand-coral/15">
                    <Icon aria-hidden="true" className="size-5" />
                  </span>
                  {title}
                </h2>
                <ol className="mt-5 divide-y border-y">
                  {steps.map((step, index) => (
                    <li key={step.title} className="flex gap-3 py-4">
                      <span
                        aria-hidden="true"
                        className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-full bg-muted text-xs font-bold"
                      >
                        {index + 1}
                      </span>
                      <div>
                        <h3 className="font-semibold">{step.title}</h3>
                        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                          {step.description}
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>
                <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-2 pt-5">
                  <Link
                    href={href}
                    className={cn(buttonVariants(), "h-10 rounded-full px-4")}
                  >
                    {action}
                    <ArrowRight aria-hidden="true" className="size-4" />
                  </Link>
                  <Link
                    href={secondary.href}
                    className={cn(buttonVariants({ variant: "link" }), "px-0")}
                  >
                    {secondary.label}
                  </Link>
                </div>
              </section>
            )
          )}
        </div>

        <section
          aria-labelledby="questions-heading"
          className="mt-8 rounded-3xl border bg-card p-5 sm:p-7"
        >
          <h2
            id="questions-heading"
            className="text-2xl font-bold tracking-tight"
          >
            Common questions
          </h2>
          <div className="mt-3 divide-y">
            {questions.map(({ question, answer }) => (
              <details key={question} className="group py-3">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 rounded py-1 font-semibold focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none [&::-webkit-details-marker]:hidden">
                  {question}
                  <ChevronDown
                    aria-hidden="true"
                    className="size-4 shrink-0 transition-transform group-open:rotate-180 motion-reduce:transition-none"
                  />
                </summary>
                <p className="max-w-2xl pt-2 text-sm leading-relaxed text-muted-foreground">
                  {answer}
                </p>
              </details>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
