"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      aria-label="Toggle color theme"
      title="Toggle color theme"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      className="size-10 rounded-full text-foreground hover:bg-foreground/5 hover:text-foreground"
    >
      <Sun className="hidden size-[1.15rem] dark:block" />
      <Moon className="block size-[1.15rem] dark:hidden" />
    </Button>
  )
}
