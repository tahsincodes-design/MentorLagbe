import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"

import { buttonVariants } from "@/components/ui/button"
import { tuitionBrowsePath } from "@/lib/tuitions/routes"
import { cn } from "@/lib/utils"

export function AboutHero() {
  return (
    <section
      aria-labelledby="about-heading"
      className="grid overflow-hidden rounded-[2rem] bg-brand-navy text-brand-cream lg:grid-cols-[1.12fr_0.88fr]"
    >
      <div className="flex flex-col items-start justify-center bg-[radial-gradient(ellipse_at_top_left,#2d3f66_0%,transparent_68%)] px-6 py-10 sm:px-10 sm:py-14 lg:px-12 lg:py-16">
        <p className="text-sm font-semibold text-[#ffb6aa]">
          About MentorLagbe
        </p>
        <h1
          id="about-heading"
          className="mt-4 max-w-[13ch] text-[clamp(2.5rem,6vw,4.75rem)] leading-[1.03] font-bold tracking-[-0.065em] text-balance"
        >
          Find a tutor who fits how you learn.
        </h1>
        <p className="mt-5 max-w-[38ch] text-base leading-relaxed text-brand-cream/80 sm:text-lg">
          MentorLagbe gives students a place to discover tuitions and tutors a
          place to tell students what they teach.
        </p>
        <Link
          href={tuitionBrowsePath}
          className={cn(
            buttonVariants({ size: "lg" }),
            "mt-7 h-11 rounded-full bg-brand-coral px-5 text-brand-navy hover:bg-[#ff8a7c]"
          )}
        >
          Browse Tuitions
          <ArrowUpRight aria-hidden="true" className="size-4" />
        </Link>
      </div>
      <div className="grid place-items-center bg-[radial-gradient(ellipse_at_center,#164f55_0%,#10243b_75%)] p-4 sm:p-6 lg:p-7">
        <div className="relative aspect-[3/2] w-full max-w-[500px] overflow-hidden rounded-[1.5rem] shadow-xl ring-1 ring-brand-cream/15">
          <Image
            src="/about-student.png"
            alt="A student writing in a notebook at a desk"
            fill
            preload
            unoptimized
            className="object-cover object-bottom"
          />
        </div>
      </div>
    </section>
  )
}
