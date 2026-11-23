"use client"

import type { ComponentProps } from "react"
import Link, { useLinkStatus } from "next/link"
import { usePathname, useRouter } from "next/navigation"

import { homeRefreshEvent, requestHomeScroll } from "@/lib/home-navigation"

function NavigationPending() {
  const { pending } = useLinkStatus()
  return pending ? (
    <span
      role="status"
      className="pointer-events-none fixed inset-x-0 top-0 z-[100] h-0.5 bg-brand-coral motion-safe:animate-pulse"
    >
      <span className="sr-only">Loading page</span>
    </span>
  ) : null
}

export function SiteNavigationLink({
  href,
  scroll,
  children,
  ...props
}: Omit<ComponentProps<typeof Link>, "onNavigate">) {
  const pathname = usePathname()
  const router = useRouter()
  const isHomeLink = href === "/"

  return (
    <Link
      {...props}
      href={href}
      scroll={isHomeLink ? false : scroll}
      onNavigate={(event) => {
        if (!isHomeLink) return
        if (pathname !== "/") {
          requestHomeScroll()
          return
        }

        event.preventDefault()
        if (window.location.hash || window.location.search) {
          window.history.replaceState(null, "", "/")
        }
        const reduced = window.matchMedia(
          "(prefers-reduced-motion: reduce)"
        ).matches
        window.scrollTo({ top: 0, behavior: reduced ? "instant" : "smooth" })
        router.refresh()
        window.dispatchEvent(new Event(homeRefreshEvent))
      }}
    >
      {children}
      <NavigationPending />
    </Link>
  )
}
