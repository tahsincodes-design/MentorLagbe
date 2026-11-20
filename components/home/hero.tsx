import Image from "next/image"
import Link from "next/link"
import {
  ArrowRight,
  BookOpen,
  GraduationCap,
  Sparkles,
  Star,
  UserCheck,
  Users,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { tuitionBrowsePath } from "@/lib/tuitions/routes"
import { cn } from "@/lib/utils"

const stats = [
  { label: "Happy Students", value: "10K+", icon: Users },
  { label: "Verified Tutors", value: "5K+", icon: UserCheck },
  { label: "Subjects", value: "20+", icon: BookOpen },
  { label: "Success Rate", value: "98%", icon: Star },
]

export function Hero() {
  return (
    <section
      aria-labelledby="hero-heading"
      className="relative overflow-hidden pb-8 sm:pb-10"
    >
      <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-5 pt-8 pb-10 sm:px-8 sm:pt-12 lg:grid-cols-[1.02fr_0.98fr] lg:gap-6 lg:px-12 lg:pt-14 lg:pb-12 xl:px-16">
        <div className="relative z-10 mx-auto w-full max-w-2xl lg:mx-0">
          <div className="absolute -top-6 right-0 hidden items-end gap-1.5 lg:flex">
            <span className="h-1 w-6 -rotate-12 rounded-full bg-brand-coral" />
            <span className="h-1 w-8 -rotate-6 rounded-full bg-brand-coral" />
            <span className="h-1 w-5 rotate-3 rounded-full bg-brand-coral" />
          </div>

          <Badge
            variant="outline"
            className="h-auto gap-1.5 rounded-full border-brand-coral/30 bg-brand-coral/10 px-3.5 py-1.5 text-[0.7rem] font-semibold text-foreground backdrop-blur-sm"
          >
            <Sparkles className="size-3 text-brand-coral" />
            Find. Learn. Grow.
          </Badge>

          <h1
            id="hero-heading"
            className="mt-5 text-[2.3rem] leading-[1.04] font-extrabold tracking-[-0.04em] text-foreground sm:text-5xl lg:text-[3.4rem] xl:text-[3.75rem]"
          >
            Your Perfect <span className="text-brand-coral">Tutor</span>{" "}
            <span className="block">
              is Just a <span className="text-brand-coral">Click Away</span>
            </span>
          </h1>

          <p className="mt-5 max-w-lg text-base leading-7 text-muted-foreground sm:text-lg">
            Connect with verified tutors, join personalized tuition batches, and
            achieve your academic goals.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-3">
            <Link
              href={tuitionBrowsePath}
              className={cn(
                buttonVariants({ size: "lg" }),
                "h-11 rounded-full bg-foreground px-5 text-background shadow-[0_14px_24px_-16px_rgba(20,33,61,0.8)] hover:bg-foreground/90"
              )}
            >
              Browse Tuitions
              <ArrowRight className="size-4" />
            </Link>
            <Link
              href="/#how-it-works"
              className={cn(
                buttonVariants({ variant: "ghost", size: "lg" }),
                "h-11 rounded-full px-4 text-foreground hover:bg-foreground/5"
              )}
            >
              How It Works
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>

        <div className="relative z-10 mx-auto w-full max-w-[34rem] lg:max-w-none">
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[44%_56%_46%_54%/50%_44%_56%_50%] border-[6px] border-brand-surface bg-brand-sand shadow-[0_32px_70px_-32px_rgba(20,33,61,0.55)]">
            <Image
              src="/hero-student.jpg"
              alt="Smiling student writing in a notebook beside a laptop"
              fill
              priority
              sizes="(min-width: 1024px) 44vw, (min-width: 640px) 80vw, 90vw"
              className="scale-[1.03] object-cover object-[50%_35%]"
            />
          </div>

          <div className="absolute top-2 left-1 z-20 -rotate-12 text-brand-navy drop-shadow-sm sm:left-2 dark:text-brand-cream">
            <GraduationCap className="size-14 sm:size-16" strokeWidth={1.2} />
          </div>

          <div className="absolute top-2 right-1 z-20 grid size-24 -rotate-6 place-items-center rounded-full border border-brand-navy/25 bg-brand-surface/90 shadow-lg backdrop-blur-sm sm:size-28 lg:-right-4">
            <span className="text-center font-script text-[1.7rem] leading-[0.85] text-brand-navy sm:text-3xl">
              Learn
              <br />
              <span className="text-brand-coral">Better!</span>
            </span>
            <span className="absolute bottom-4 h-0.5 w-10 -rotate-3 rounded-full bg-brand-coral/80" />
          </div>
        </div>
      </div>

      <div className="relative z-10 mx-auto w-full max-w-6xl px-4 sm:px-8 lg:px-12">
        <Card className="gap-0 rounded-[2rem] border border-brand-coral/45 bg-card py-0 shadow-[0_24px_50px_-32px_rgba(20,33,61,0.45)] ring-0">
          <CardContent className="grid grid-cols-2 p-0 sm:grid-cols-4">
            {stats.map((stat, index) => {
              const Icon = stat.icon

              return (
                <div
                  key={stat.label}
                  className={cn(
                    "flex items-center justify-center gap-3 border-brand-coral/25 px-4 py-5 sm:px-6 sm:py-6",
                    index < 2 && "border-b sm:border-b-0",
                    index % 2 === 0 && "border-r sm:border-r-0",
                    index > 0 && "sm:border-l"
                  )}
                >
                  <Icon
                    className="size-7 shrink-0 text-foreground sm:size-8"
                    strokeWidth={1.7}
                  />
                  <div className="min-w-0">
                    <p className="text-lg leading-tight font-extrabold text-foreground sm:text-xl">
                      {stat.value}
                    </p>
                    <p className="truncate text-[0.7rem] font-medium text-muted-foreground sm:text-xs">
                      {stat.label}
                    </p>
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
