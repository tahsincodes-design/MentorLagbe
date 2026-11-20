"use client"

import * as React from "react"
import {
  CalendarCheck,
  ChevronLeft,
  ChevronRight,
  Clock,
  CreditCard,
  Search,
  Trophy,
  type LucideIcon,
} from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

type Step = {
  number: string
  title: string
  description: string
  detail: string
  duration: string
  tags: string[]
  icon: LucideIcon
}

const steps: Step[] = [
  {
    number: "01",
    title: "Search & Explore",
    description: "Find the right tutor for your goals.",
    detail:
      "Compare subjects, experience, reviews, and tuition types before you decide.",
    duration: "2 min",
    tags: ["Subjects", "Experience", "Reviews"],
    icon: Search,
  },
  {
    number: "02",
    title: "Apply or Enroll",
    description: "Choose a session or join a tuition batch.",
    detail: "Check the schedule and send your request in a few clicks.",
    duration: "3 min",
    tags: ["Online", "In-person", "Batch"],
    icon: CalendarCheck,
  },
  {
    number: "03",
    title: "Choose Your Plan",
    description: "Pick the learning option that fits you.",
    detail:
      "Start with a basic plan or unlock more features with Stripe anytime.",
    duration: "1 min",
    tags: ["Basic", "Monthly", "Upgradeable"],
    icon: CreditCard,
  },
  {
    number: "04",
    title: "Start Learning",
    description: "Learn with guidance from expert tutors.",
    detail: "Track progress and build confidence with every lesson.",
    duration: "Ongoing",
    tags: ["Live lessons", "Tasks", "Progress"],
    icon: Trophy,
  },
]

export function HowItWorks() {
  const timelineRef = React.useRef<HTMLDivElement>(null)
  const dotRefs = React.useRef<(HTMLSpanElement | null)[]>([])
  const [progress, setProgress] = React.useState(0)
  const [activeStep, setActiveStep] = React.useState(0)

  React.useEffect(() => {
    const timeline = timelineRef.current
    if (!timeline) return

    let frame = 0

    const update = () => {
      frame = 0
      const anchor = window.innerHeight * 0.6
      const rect = timeline.getBoundingClientRect()
      const ratio = (anchor - rect.top) / Math.max(rect.height, 1)

      setProgress(Math.min(1, Math.max(0, ratio)))

      let nextStep = 0
      dotRefs.current.forEach((dot, index) => {
        if (dot && dot.getBoundingClientRect().top <= anchor) nextStep = index
      })
      setActiveStep((current) => (current === nextStep ? current : nextStep))
    }

    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(update)
    }

    update()
    window.addEventListener("scroll", schedule, { passive: true })
    window.addEventListener("resize", schedule)

    return () => {
      window.removeEventListener("scroll", schedule)
      window.removeEventListener("resize", schedule)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <section
      id="how-it-works"
      aria-labelledby="how-heading"
      className="relative scroll-mt-28 overflow-hidden py-16 sm:py-20"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 select-none"
      >
        <span className="absolute top-20 left-[10%] h-0.5 w-7 -rotate-12 rounded-full bg-brand-coral/70" />
        <span className="absolute top-24 left-[10.5%] h-0.5 w-5 rotate-12 rounded-full bg-brand-coral/60" />
        <span className="absolute top-16 left-[12.5%] h-0.5 w-4 rotate-[70deg] rounded-full bg-brand-coral/50" />
        <span className="absolute top-1/3 -right-24 size-72 rounded-full bg-brand-coral/5 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-5xl px-5 sm:px-8">
        <div className="mx-auto max-w-xl text-center">
          <div className="flex items-center justify-center gap-3">
            <span className="h-[2px] w-8 rounded-full bg-brand-coral sm:w-10" />
            <h2
              id="how-heading"
              className="text-3xl font-extrabold tracking-tight sm:text-4xl"
            >
              How It Works
            </h2>
            <span className="h-[2px] w-8 rounded-full bg-brand-coral sm:w-10" />
          </div>
          <p className="mt-3 text-sm text-muted-foreground sm:text-base">
            Get started in just a few simple steps
          </p>
        </div>

        <div ref={timelineRef} className="relative mt-12 sm:mt-16">
          <div
            aria-hidden="true"
            className="absolute top-2 bottom-2 left-[22px] w-[3px] rounded-full bg-border md:left-1/2 md:-translate-x-1/2"
          >
            <div
              className="w-full rounded-full bg-brand-coral transition-[height] duration-150 ease-out"
              style={{ height: `${progress * 100}%` }}
            />
          </div>

          <ol className="relative space-y-6 md:space-y-10">
            {steps.map((step, index) => {
              const Icon = step.icon
              const isActive = activeStep === index
              const isPassed = index < activeStep
              const isLeft = index % 2 === 0

              return (
                <li key={step.number} className="relative">
                  <span
                    ref={(element) => {
                      dotRefs.current[index] = element
                    }}
                    aria-hidden="true"
                    className={cn(
                      "absolute top-1/2 left-[22px] z-10 -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] border-background transition-all duration-300 md:left-1/2",
                      isActive
                        ? "size-4 scale-110 bg-brand-coral shadow-[0_0_0_6px_rgba(255,104,88,0.16)]"
                        : isPassed
                          ? "size-3 bg-brand-coral/70"
                          : "size-3 bg-border"
                    )}
                  />

                  <div
                    aria-hidden="true"
                    className={cn(
                      "absolute top-1/2 hidden w-8 -translate-y-1/2 items-center gap-1 md:flex",
                      isLeft ? "right-1/2" : "left-1/2"
                    )}
                  >
                    {isLeft ? (
                      <ChevronRight
                        className={cn(
                          "size-3.5 shrink-0",
                          isActive
                            ? "text-brand-coral"
                            : "text-muted-foreground/50"
                        )}
                      />
                    ) : null}
                    <span
                      className={cn(
                        "h-[2px] flex-1 rounded-full transition-colors",
                        isActive ? "bg-brand-coral/70" : "bg-border"
                      )}
                    />
                    {isLeft ? null : (
                      <ChevronLeft
                        className={cn(
                          "size-3.5 shrink-0",
                          isActive
                            ? "text-brand-coral"
                            : "text-muted-foreground/50"
                        )}
                      />
                    )}
                  </div>

                  <div className="grid md:grid-cols-2 md:gap-16">
                    <div
                      className={cn(
                        "w-full pl-12 md:max-w-[30rem] md:pl-0",
                        isLeft
                          ? "md:col-start-1 md:justify-self-end"
                          : "md:col-start-2 md:justify-self-start"
                      )}
                    >
                      <Card
                        className={cn(
                          "gap-0 rounded-3xl py-0 ring-0 transition-all duration-300",
                          isActive
                            ? "border-brand-navy bg-brand-navy text-brand-cream shadow-[0_28px_60px_-26px_rgba(20,33,61,0.75)] dark:border-brand-cream dark:bg-brand-cream dark:text-brand-navy"
                            : "border-border bg-card text-card-foreground shadow-[0_16px_38px_-26px_rgba(20,33,61,0.5)]"
                        )}
                      >
                        <CardContent className="flex items-start gap-4 p-5">
                          <div
                            className={cn(
                              "grid size-14 shrink-0 place-items-center rounded-2xl transition-colors",
                              isActive
                                ? "bg-brand-coral text-white"
                                : "bg-muted text-brand-coral-deep dark:text-brand-coral"
                            )}
                          >
                            <Icon className="size-7" strokeWidth={1.8} />
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between gap-2">
                              <span
                                className={cn(
                                  "text-[0.68rem] font-bold tracking-[0.2em] uppercase",
                                  isActive
                                    ? "text-brand-coral"
                                    : "text-muted-foreground"
                                )}
                              >
                                Step {step.number}
                              </span>
                              <span
                                className={cn(
                                  "inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-[0.65rem] font-semibold",
                                  isActive
                                    ? "bg-brand-cream/10 text-brand-cream dark:bg-brand-navy/10 dark:text-brand-navy"
                                    : "bg-muted text-muted-foreground"
                                )}
                              >
                                <Clock className="size-3" />
                                {step.duration}
                              </span>
                            </div>

                            <h3 className="mt-1 text-lg font-extrabold sm:text-xl">
                              {step.title}
                            </h3>
                            <p
                              className={cn(
                                "mt-1.5 text-sm leading-6 font-semibold",
                                isActive
                                  ? "text-brand-cream/85 dark:text-brand-navy/80"
                                  : "text-card-foreground/85"
                              )}
                            >
                              {step.description}
                            </p>
                            <p
                              className={cn(
                                "mt-1 text-xs leading-5",
                                isActive
                                  ? "text-brand-cream/60 dark:text-brand-navy/60"
                                  : "text-muted-foreground"
                              )}
                            >
                              {step.detail}
                            </p>

                            <ul className="mt-3 flex flex-wrap gap-1.5">
                              {step.tags.map((tag) => (
                                <li
                                  key={tag}
                                  className={cn(
                                    "rounded-full border px-2.5 py-0.5 text-[0.65rem] font-semibold",
                                    isActive
                                      ? "border-brand-cream/25 bg-brand-cream/10 text-brand-cream dark:border-brand-navy/20 dark:bg-brand-navy/10 dark:text-brand-navy"
                                      : "border-border bg-muted/60 text-muted-foreground"
                                  )}
                                >
                                  {tag}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </li>
              )
            })}
          </ol>
        </div>
      </div>
    </section>
  )
}
