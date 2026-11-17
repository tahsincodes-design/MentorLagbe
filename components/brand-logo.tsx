import { cn } from "@/lib/utils"

function BrandMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
      className={cn("text-brand-navy dark:text-brand-cream", className)}
    >
      <path
        d="M28.56 14.56a1.3 1.3 0 0 0-.025-2.39l-11.17-5.09a2.6 2.6 0 0 0-2.16 0L4.03 12.17a1.3 1.3 0 0 0 0 2.38l11.17 5.09a2.6 2.6 0 0 0 2.16 0l11.2-5.08Z"
        fill="currentColor"
      />
      <path
        d="M8 16.6v4.7c0 2.2 3.6 4 8 4s8-1.8 8-4v-4.7"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M29.3 13.1v7.7"
        className="text-brand-coral"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="29.3" cy="22.5" r="2" className="fill-brand-coral" />
    </svg>
  )
}

export function BrandLogo({ className }: { className?: string }) {
  return (
    <a
      href="#home"
      aria-label="MentorLagbe home"
      className={cn(
        "group flex min-w-0 items-center gap-2.5 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-brand-coral/60 focus-visible:ring-offset-4 focus-visible:ring-offset-background",
        className
      )}
    >
      <BrandMark className="size-9 shrink-0 sm:size-10" />
      <span className="truncate text-xl font-extrabold tracking-tight text-brand-navy sm:text-2xl dark:text-brand-cream">
        Mentor<span className="text-brand-coral">Lagbe</span>
      </span>
    </a>
  )
}
