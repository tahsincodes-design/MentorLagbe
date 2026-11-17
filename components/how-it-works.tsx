"use client"

import * as React from "react"
import {
  CalendarCheck,
  CreditCard,
  Search,
  Trophy,
  type LucideIcon,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

type Step = {
  number: string
  title: string
  description: string
  detail: string
  meta: string
  icon: LucideIcon
}

const steps: Step[] = [
  {
    number: "01",
    title: "Search & Explore",
    description: "Find the right tutor for your goals.",
    detail: "Compare subjects, experience, reviews, and tuition types.",
    meta: "Subjects • Experience • Reviews",
    icon: Search,
  },
  {
    number: "02",
    title: "Apply or Enroll",
    description: "Choose a session or join a tuition batch.",
    detail: "Check the schedule and send your request in a few clicks.",
    meta: "Online • In-person • Batch",
    icon: CalendarCheck,
  },
  {
    number: "03",
    title: "Choose Your Plan",
    description: "Pick the learning option that fits you.",
    detail: "Start with a basic plan or unlock more features anytime.",
    meta: "Monthly • Flexible • Upgradeable",
    icon: CreditCard,
  },
  {
    number: "04",
    title: "Start Learning",
    description: "Learn with guidance from expert tutors.",
    detail: "Track progress and build confidence with every lesson.",
    meta: "Live lessons • Tasks • Progress",
    icon: Trophy,
  },
]

export function HowItWorks() {
  const sectionRef = React.useRef<HTMLElement>(null)
  const cardRefs = React.useRef<(HTMLDivElement | null)[]>([])
  const [progress, setProgress] = React.useState(0)
  const [activeStep, setActiveStep] = React.useState(0)

  React.useEffect(() => {
    const updateProgress = () => {
      const section = sectionRef.current
      if (!section) return

      const rect = section.getBoundingClientRect()
      const viewportAnchor = window.innerHeight * 0.58
      const start = rect.top
      const end = rect.bottom - viewportAnchor
      const amount =
        end <= start ? 1 : (viewportAnchor - start) / (rect.height - 90)
      setProgress(Math.min(1, Math.max(0, amount)))
    }

    updateProgress()
    window.addEventListener("scroll", updateProgress, { passive: true })
    window.addEventListener("resize", updateProgress)
    return () => {
      window.removeEventListener("scroll", updateProgress)
      window.removeEventListener("resize", updateProgress)
    }
  }, [])

  React.useEffect(() => {
    let frame = 0
    let highlightTimer: ReturnType<typeof setTimeout> | undefined
    let pendingStep = activeStep

    const updateActiveCard = () => {
      frame = 0
      const anchor = window.innerHeight * 0.5
      let nearestIndex = 0
      let nearestDistance = Number.POSITIVE_INFINITY

      cardRefs.current.forEach((card, index) => {
        if (!card) return
        const rect = card.getBoundingClientRect()
        const cardAnchor = rect.top + rect.height / 2
        const distance = Math.abs(cardAnchor - anchor)
        if (distance < nearestDistance) {
          nearestDistance = distance
          nearestIndex = index
        }
      })

      if (nearestIndex === activeStep) return
      pendingStep = nearestIndex

      if (highlightTimer) clearTimeout(highlightTimer)
      highlightTimer = setTimeout(() => {
        setActiveStep(pendingStep)
      }, 120)
    }

    const requestUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(updateActiveCard)
    }

    updateActiveCard()
    window.addEventListener("scroll", requestUpdate, { passive: true })
    window.addEventListener("resize", requestUpdate)
    return () => {
      window.removeEventListener("scroll", requestUpdate)
      window.removeEventListener("resize", requestUpdate)
      if (frame) window.cancelAnimationFrame(frame)
      if (highlightTimer) clearTimeout(highlightTimer)
    }
  }, [activeStep])

  return (
    <section
      ref={sectionRef}
      id="how-it-works"
      aria-labelledby="how-heading"
      className="relative scroll-mt-28 overflow-hidden py-16 sm:py-20"
    >
      <div className="pointer-events-none absolute top-24 left-[12%] h-32 w-32 rounded-full bg-brand-coral/5 blur-3xl" />
      <div className="mx-auto max-w-6xl px-5 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-xl text-center">
          <Badge
            variant="outline"
            className="mb-4 rounded-full border-brand-coral/30 bg-brand-coral/10 px-4 py-1 text-xs font-bold text-brand-coral-deep"
          >
            Simple process
          </Badge>
          <h2
            id="how-heading"
            className="text-3xl font-extrabold tracking-tight sm:text-4xl"
          >
            How It Works
          </h2>
          <p className="mt-2 text-sm text-muted-foreground sm:text-base">
            Get started in just a few clear steps
          </p>
        </div>

        <div className="relative mt-12 md:mt-14">
          <div className="absolute top-0 bottom-0 left-[18px] w-[3px] rounded-full bg-border md:left-1/2 md:-translate-x-1/2">
            <div
              className="w-full rounded-full bg-brand-coral transition-[height] duration-150"
              style={{ height: `${progress * 100}%` }}
            />
          </div>

          <div className="space-y-7 md:space-y-8">
            {steps.map((step, index) => {
              const Icon = step.icon
              const isActive = activeStep === index
              const isLeft = index % 2 === 0

              return (
                <div
                  key={step.number}
                  className={cn(
                    "relative grid min-h-32 pl-12 md:grid-cols-2 md:gap-10 md:pl-0",
                    isLeft ? "md:text-right" : "md:text-left"
                  )}
                >
                  <div
                    className={cn(
                      "absolute top-11 left-[18px] z-20 size-4 -translate-x-1/2 rounded-full border-[3px] border-background transition-all duration-300 md:top-12 md:left-1/2",
                      isActive
                        ? "scale-[1.45] bg-brand-coral shadow-[0_0_0_7px_rgba(255,104,88,0.14)]"
                        : "bg-border"
                    )}
                  />

                  <div
                    ref={(element) => {
                      cardRefs.current[index] = element
                    }}
                    className={cn(
                      "w-full transition-all duration-500",
                      isLeft
                        ? "md:col-start-1 md:max-w-[27rem] md:justify-self-end"
                        : "md:col-start-2 md:max-w-[27rem]"
                    )}
                  >
                    <Card
                      className={cn(
                        "gap-0 rounded-3xl py-0 transition-all duration-300",
                        isActive
                          ? "-translate-y-1 border-brand-coral/60 bg-brand-navy text-brand-cream shadow-[0_24px_55px_-22px_rgba(20,33,61,0.7)]"
                          : "border-border bg-card text-card-foreground shadow-[0_16px_38px_-20px_rgba(20,33,61,0.5)]"
                      )}
                    >
                      <CardContent className="flex min-h-28 items-center gap-3 p-5 sm:min-h-32 sm:p-5">
                        <div
                          className={cn(
                            "grid size-14 shrink-0 place-items-center rounded-xl transition-colors sm:size-14",
                            isActive
                              ? "bg-brand-cream/10 text-brand-coral"
                              : "bg-muted text-foreground"
                          )}
                        >
                          <Icon className="size-7" strokeWidth={1.8} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div
                            className={cn(
                              "flex items-center gap-2",
                              isLeft && "md:justify-end"
                            )}
                          >
                            <span
                              className={cn(
                                "text-xs font-bold tracking-[0.18em]",
                                isActive
                                  ? "text-brand-coral"
                                  : "text-muted-foreground"
                              )}
                            >
                              STEP {step.number}
                            </span>
                          </div>
                          <h3 className="mt-1 text-base font-extrabold sm:text-lg">
                            {step.title}
                          </h3>
                          <p
                            className={cn(
                              "mt-1 text-sm leading-5 font-semibold",
                              isActive
                                ? "text-brand-cream"
                                : "text-card-foreground"
                            )}
                          >
                            {step.description}
                          </p>
                          <p
                            className={cn(
                              "mt-1 text-xs leading-5",
                              isActive
                                ? "text-brand-cream/70"
                                : "text-muted-foreground"
                            )}
                          >
                            {step.detail}
                          </p>
                          <p
                            className={cn(
                              "mt-2 text-[0.68rem] font-bold tracking-wide uppercase",
                              isActive
                                ? "text-brand-coral"
                                : "text-muted-foreground"
                            )}
                          >
                            {step.meta}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
