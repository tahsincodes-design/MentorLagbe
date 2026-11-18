"use client"

import { Check } from "lucide-react"

import { roles, type UserRole } from "@/components/auth/roles"
import { cn } from "@/lib/utils"

export function RolePicker({
  value,
  onChange,
}: {
  value: UserRole
  onChange: (role: UserRole) => void
}) {
  return (
    <div className="grid grid-cols-3 gap-2">
      {roles.map((role) => {
        const Icon = role.icon
        const selected = value === role.value

        return (
          <button
            key={role.value}
            type="button"
            onClick={() => onChange(role.value)}
            aria-pressed={selected}
            className={cn(
              "relative flex flex-col items-center gap-1 rounded-xl border px-2 py-3 text-center transition-colors",
              selected
                ? "border-brand-coral bg-brand-coral/5"
                : "border-border bg-card hover:border-brand-coral/40"
            )}
          >
            {selected ? (
              <span className="absolute top-1.5 right-1.5 grid size-4 place-items-center rounded-full bg-brand-coral text-white">
                <Check className="size-2.5" strokeWidth={3} />
              </span>
            ) : null}
            <Icon
              className={cn(
                "size-6",
                selected ? "text-brand-coral" : "text-foreground/70"
              )}
              strokeWidth={1.8}
            />
            <span className="text-xs font-bold">{role.label}</span>
            <span className="text-[0.6rem] leading-3 text-muted-foreground">
              {role.description}
            </span>
          </button>
        )
      })}
    </div>
  )
}
