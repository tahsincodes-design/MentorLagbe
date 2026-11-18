"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { ChevronDown, LogOut, Menu, Search, X } from "lucide-react"

import { BrandLogo } from "@/components/brand-logo"
import { ThemeToggle } from "@/components/theme-toggle"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { signOut, useSession } from "@/lib/auth-client"
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
  "h-10 rounded-full border-brand-coral/40 bg-transparent px-5 text-sm font-semibold text-foreground shadow-none hover:bg-brand-coral/10 hover:text-foreground dark:bg-transparent dark:hover:bg-brand-coral/15"
)

const signUpClassName = cn(
  buttonVariants(),
  "h-10 rounded-full bg-brand-coral px-5 text-sm font-semibold text-white shadow-[0_10px_20px_-10px_rgba(255,104,88,0.9)] hover:bg-brand-coral-deep"
)

export function SiteHeader() {
  const router = useRouter()
  const [menuOpen, setMenuOpen] = React.useState(false)
  const { data: session } = useSession()
  const user = session?.user

  const initials = (user?.name || user?.email || "ML")
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()

  async function handleSignOut() {
    setMenuOpen(false)
    await signOut()
    router.refresh()
  }

  return (
    <header className="sticky top-0 z-50 px-3 pt-3 sm:px-4 sm:pt-4">
      <div className="mx-auto max-w-6xl">
        <div className="rounded-full border border-border bg-card/95 px-3 py-2 shadow-[0_18px_40px_-24px_rgba(20,33,61,0.45)] backdrop-blur-md sm:px-5">
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
                        ? "text-foreground"
                        : "text-muted-foreground hover:text-foreground"
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
              <ThemeToggle />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label="Search"
                className="hidden size-10 rounded-full text-foreground hover:bg-foreground/5 hover:text-foreground sm:inline-flex"
              >
                <Search className="size-[1.15rem]" />
              </Button>

              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger
                    aria-label="Account menu"
                    className="flex items-center gap-1 rounded-full p-0.5 outline-none focus-visible:ring-2 focus-visible:ring-brand-coral/60"
                  >
                    <Avatar className="size-9">
                      {user.image ? (
                        <AvatarImage src={user.image} alt={user.name} />
                      ) : null}
                      <AvatarFallback className="bg-brand-navy text-xs font-bold text-brand-cream">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <ChevronDown className="hidden size-3.5 text-muted-foreground sm:block" />
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="end" className="w-60">
                    <DropdownMenuGroup>
                      <DropdownMenuLabel>
                        <p className="truncate text-sm font-semibold text-foreground">
                          {user.name}
                        </p>
                        <p className="truncate text-xs font-normal">
                          {user.email}
                        </p>
                      </DropdownMenuLabel>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      <DropdownMenuLabel className="flex items-center gap-1.5">
                        <span className="rounded-full bg-brand-coral/10 px-2 py-0.5 text-[0.65rem] font-bold tracking-wide text-brand-coral-deep uppercase dark:text-brand-coral">
                          {user.role ?? "student"}
                        </span>
                      </DropdownMenuLabel>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      variant="destructive"
                      onClick={handleSignOut}
                    >
                      <LogOut />
                      Sign out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : null}

              {!user ? (
                <>
                  <a
                    href="/login"
                    className={cn(signInClassName, "hidden sm:inline-flex")}
                  >
                    Sign In
                  </a>
                  <a
                    href="/register"
                    className={cn(signUpClassName, "hidden sm:inline-flex")}
                  >
                    Sign Up
                  </a>
                </>
              ) : null}

              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label={menuOpen ? "Close menu" : "Open menu"}
                aria-expanded={menuOpen}
                aria-controls="mobile-menu"
                onClick={() => setMenuOpen((open) => !open)}
                className="size-10 rounded-full text-foreground hover:bg-foreground/5 hover:text-foreground lg:hidden"
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
            className="mt-2 rounded-3xl border border-border bg-card p-3 shadow-xl lg:hidden"
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
                        ? "bg-brand-coral/10 text-foreground"
                        : "text-muted-foreground hover:bg-foreground/5 hover:text-foreground"
                    )}
                  >
                    {item.label}
                  </a>
                )
              })}
            </nav>

            {user ? (
              <div className="mt-3 flex items-center gap-2 border-t border-border pt-3">
                <Avatar className="size-9">
                  {user.image ? (
                    <AvatarImage src={user.image} alt={user.name} />
                  ) : null}
                  <AvatarFallback className="bg-brand-navy text-xs font-bold text-brand-cream">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">{user.name}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {user.email}
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleSignOut}
                  className="rounded-full"
                >
                  <LogOut className="size-3.5" />
                  Sign out
                </Button>
              </div>
            ) : (
              <div className="mt-3 grid grid-cols-2 gap-2 border-t border-border pt-3">
                <a
                  href="/login"
                  onClick={() => setMenuOpen(false)}
                  className={cn(signInClassName, "w-full")}
                >
                  Sign In
                </a>
                <a
                  href="/register"
                  onClick={() => setMenuOpen(false)}
                  className={cn(signUpClassName, "w-full")}
                >
                  Sign Up
                </a>
              </div>
            )}
          </div>
        ) : null}
      </div>
    </header>
  )
}
