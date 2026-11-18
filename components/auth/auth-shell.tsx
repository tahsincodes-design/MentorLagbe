import type { ReactNode } from "react"
import Image from "next/image"
import { Check, type LucideIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"

type Feature = {
  label: string
  icon?: LucideIcon
}

export function AuthShell({
  badge,
  title,
  highlight,
  subtitle,
  features,
  featureStyle = "list",
  breakHighlight = false,
  illustration,
  children,
}: {
  badge: string
  title: string
  highlight: string
  subtitle: string
  features: Feature[]
  featureStyle?: "list" | "chips"
  breakHighlight?: boolean
  illustration: { src: string; alt: string; width: number; height: number }
  children: ReactNode
}) {
  return (
    <section className="relative flex-1 overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <div className="absolute -top-24 -left-20 size-72 rounded-full bg-brand-coral/5 blur-3xl" />
        <div className="absolute right-0 bottom-0 size-64 rounded-full bg-brand-navy/5 blur-3xl dark:bg-brand-cream/5" />
      </div>

      <div className="mx-auto grid max-w-6xl gap-8 px-5 py-10 sm:px-8 lg:grid-cols-[1fr_minmax(0,27rem)] lg:items-start lg:gap-14 lg:py-14">
        <div className="mx-auto flex w-full max-w-md flex-col items-center text-center lg:mx-0 lg:max-w-xl lg:items-start lg:text-left">
          <Badge
            variant="outline"
            className="rounded-full border-brand-coral/30 bg-brand-coral/10 px-3.5 py-1 text-[0.7rem] font-semibold text-brand-coral-deep dark:text-brand-coral"
          >
            {badge}
          </Badge>

          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-balance sm:text-4xl lg:text-[2.6rem] lg:leading-[1.1]">
            {title}{" "}
            <span
              className={
                breakHighlight ? "block text-brand-coral" : "text-brand-coral"
              }
            >
              {highlight}
            </span>
          </h1>

          <p className="mt-3 max-w-md text-sm leading-6 text-muted-foreground sm:text-base">
            {subtitle}
          </p>

          {featureStyle === "chips" ? (
            <ul className="mt-7 flex w-full max-w-sm items-start justify-between gap-2">
              {features.map((feature) => {
                const Icon = feature.icon

                return (
                  <li
                    key={feature.label}
                    className="flex flex-1 flex-col items-center gap-2 text-center"
                  >
                    <span className="grid size-12 place-items-center rounded-full bg-brand-coral/10 text-brand-coral ring-1 ring-brand-coral/20">
                      {Icon ? (
                        <Icon className="size-5" strokeWidth={2} />
                      ) : null}
                    </span>
                    <span className="text-xs leading-4 font-semibold">
                      {feature.label}
                    </span>
                  </li>
                )
              })}
            </ul>
          ) : (
            <ul className="mt-6 flex flex-col gap-3">
              {features.map((feature) => (
                <li
                  key={feature.label}
                  className="flex items-center gap-2.5 text-left text-sm text-foreground/80"
                >
                  <span className="grid size-5 shrink-0 place-items-center rounded-full bg-brand-coral text-white">
                    <Check className="size-3" strokeWidth={3} />
                  </span>
                  {feature.label}
                </li>
              ))}
            </ul>
          )}

          <div className="mt-8 hidden w-full max-w-sm overflow-hidden rounded-[2rem] ring-1 ring-transparent sm:block lg:mt-10 lg:max-w-md dark:opacity-85 dark:ring-1 dark:ring-white/10">
            <Image
              src={illustration.src}
              alt={illustration.alt}
              width={illustration.width}
              height={illustration.height}
              sizes="(min-width: 1024px) 28rem, 24rem"
              className="h-auto w-full select-none"
            />
          </div>
        </div>

        <div className="w-full">{children}</div>
      </div>
    </section>
  )
}
