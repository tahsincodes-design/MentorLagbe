"use client"

import * as React from "react"
import { Menu, Search, X } from "lucide-react"

import { BrandLogo } from "@/components/brand-logo"
import { Button, buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const navItems = [
  { label: "Home", href: "#home" },
  { label: "Browse Tuitions", href: "#browse-tuitions" },
  { label: "Pricing", href: "#pricing" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "About", href: "#about" },
]

const signInClassName = cn(
  buttonVariants({ variant: "outline" }),
  "h-10 rounded-full border-brand-coral/40 bg-transparent px-5 text-sm font-semibold text-brand-navy shadow-none hover:bg-brand-coral/10 hover:text-brand-navy dark:bg-transparent dark:hover:bg-brand-coral/15"
)

const signUpClassName = cn(
  buttonVariants(),
  "h-10 rounded-full bg-brand-coral px-5 text-sm font-semibold text-white shadow-[0_10px_20px_-10px_rgba(255,104,88,0.9)] hover:bg-brand-coral-deep"
)

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = React.useState(false)

  return (
    <header className="sticky top-0 z-50 px-3 pt-3 sm:px-4 sm:pt-4">
      <div className="mx-auto max-w-6xl">
        <div className="rounded-full border border-brand-navy/10 bg-brand-surface/95 px-3 py-2 shadow-[0_18px_40px_-24px_rgba(20,33,61,0.45)] backdrop-blur-md sm:px-5">
          <div className="grid grid-cols-[auto_1fr] items-center gap-3 md:grid-cols-[auto_1fr_auto]">
            <BrandLogo />

            <nav
              aria-label="Primary"
              className="hidden items-center justify-center gap-6 lg:flex xl:gap-8"
            >
              {navItems.map((item) => {
                const active = item.href === "#home"

                return (
                  <a
                    key={item.href}
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "group relative py-2 text-sm font-semibold transition-colors",
                      active
                        ? "text-brand-navy"
                        : "text-brand-navy/65 hover:text-brand-navy"
                    )}
                  >
                    {item.label}
                    <span
                      className={cn(
                        "absolute inset-x-1 -bottom-0.5 h-0.5 rounded-full bg-brand-coral transition-transform duration-200",
                        active
                          ? "scale-x-100"
                          : "scale-x-0 group-hover:scale-x-100"
                      )}
                    />
                  </a>
                )
              })}
            </nav>

            <div className="flex items-center justify-end gap-1 sm:gap-2">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label="Search"
                className="size-10 rounded-full text-brand-navy hover:bg-brand-navy/5 hover:text-brand-navy"
              >
                <Search className="size-[1.15rem]" />
              </Button>

              <a
                href="#sign-in"
                className={cn(signInClassName, "hidden sm:inline-flex")}
              >
                Sign In
              </a>
              <a
                href="#sign-up"
                className={cn(signUpClassName, "hidden sm:inline-flex")}
              >
                Sign Up
              </a>

              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label={menuOpen ? "Close menu" : "Open menu"}
                aria-expanded={menuOpen}
                aria-controls="mobile-menu"
                onClick={() => setMenuOpen((open) => !open)}
                className="size-10 rounded-full text-brand-navy hover:bg-brand-navy/5 hover:text-brand-navy lg:hidden"
              >
                {menuOpen ? (
                  <X className="size-5" />
                ) : (
                  <Menu className="size-5" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {menuOpen ? (
          <div
            id="mobile-menu"
            className="mt-2 rounded-3xl border border-brand-navy/10 bg-brand-surface p-3 shadow-xl lg:hidden"
          >
            <nav aria-label="Mobile" className="flex flex-col gap-1">
              {navItems.map((item) => {
                const active = item.href === "#home"

                return (
                  <a
                    key={item.href}
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    onClick={() => setMenuOpen(false)}
                    className={cn(
                      "rounded-2xl px-4 py-3 text-sm font-semibold transition-colors",
                      active
                        ? "bg-brand-coral/10 text-brand-navy"
                        : "text-brand-navy/70 hover:bg-brand-navy/5 hover:text-brand-navy"
                    )}
                  >
                    {item.label}
                  </a>
                )
              })}
            </nav>

            <div className="mt-3 grid grid-cols-2 gap-2 border-t border-brand-navy/10 pt-3">
              <a
                href="#sign-in"
                onClick={() => setMenuOpen(false)}
                className={cn(signInClassName, "w-full")}
              >
                Sign In
              </a>
              <a
                href="#sign-up"
                onClick={() => setMenuOpen(false)}
                className={cn(signUpClassName, "w-full")}
              >
                Sign Up
              </a>
            </div>
          </div>
        ) : null}
      </div>
    </header>
  )
}
