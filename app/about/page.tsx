import type { Metadata } from "next"
import { Mail } from "lucide-react"

import { AboutHero } from "@/components/about/about-hero"
import { AboutOverview } from "@/components/about/about-overview"
import { SiteFooter } from "@/components/site/site-footer"
import { buttonVariants } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "About MentorLagbe",
  description:
    "Learn how MentorLagbe helps students discover tuitions and tutors share what they teach.",
}

export default function AboutPage() {
  return (
    <>
      <main className="mx-auto w-full max-w-6xl px-4 pt-6 pb-2 sm:px-8 sm:pt-10">
        <AboutHero />
        <AboutOverview />
        <section
          aria-labelledby="contact-heading"
          className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-3xl bg-brand-coral/10 px-6 py-6 sm:px-8"
        >
          <h2
            id="contact-heading"
            className="text-xl font-semibold tracking-tight sm:text-2xl"
          >
            Have a question about MentorLagbe?
          </h2>
          <a
            href="mailto:hello@mentorlagbe.com"
            className={buttonVariants({
              variant: "outline",
              className: "rounded-full",
            })}
          >
            <Mail aria-hidden="true" className="size-4" />
            Email us
          </a>
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
