"use client"

import { useLayoutEffect, type ReactNode } from "react"
import { useAnimate } from "motion/react-mini"
import { usePathname } from "next/navigation"

import { consumeHomeScroll, homeRefreshEvent } from "@/lib/home-navigation"

export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const [scope, animate] = useAnimate<HTMLDivElement>()

  useLayoutEffect(() => {
    if (consumeHomeScroll() && pathname === "/") {
      window.scrollTo({ top: 0, behavior: "instant" })
    }

    const content = scope.current
    const motionPreference = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    )
    if (!content || typeof content.animate !== "function") return

    let transition: ReturnType<typeof animate> | undefined
    function play() {
      if (motionPreference.matches || !content) return
      transition?.cancel()
      transition = animate(
        content,
        { opacity: [0.58, 1], transform: ["translateY(8px)", "none"] },
        { duration: 0.28, ease: [0.22, 0.72, 0.28, 1] }
      )
    }

    function stopWhenReduced(event: MediaQueryListEvent) {
      if (event.matches) transition?.cancel()
    }

    // Animate the committed page without remounting the router's children.
    play()
    window.addEventListener(homeRefreshEvent, play)
    motionPreference.addEventListener("change", stopWhenReduced)
    return () => {
      window.removeEventListener(homeRefreshEvent, play)
      motionPreference.removeEventListener("change", stopWhenReduced)
      transition?.cancel()
    }
  }, [animate, pathname, scope])

  return (
    <div ref={scope} data-page-transition>
      {children}
    </div>
  )
}
