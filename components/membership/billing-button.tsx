"use client"

import { useState } from "react"
import { ArrowUpRight, LoaderCircle } from "lucide-react"

import { Button } from "@/components/ui/button"

export function BillingButton({ action }: { action: "checkout" | "portal" }) {
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState("")

  async function openBilling() {
    if (busy) return
    setBusy(true)
    setError("")
    try {
      const response = await fetch("/api/membership", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      })
      const data = await response.json().catch(() => null)
      if (!response.ok || typeof data?.url !== "string") {
        setError(
          typeof data?.message === "string"
            ? data.message
            : "Couldn’t open billing. Please try again."
        )
        setBusy(false)
        return
      }
      window.location.assign(data.url)
    } catch {
      setError("Couldn’t open billing. Please try again.")
      setBusy(false)
    }
  }

  return (
    <div className="grid gap-2">
      <Button
        type="button"
        disabled={busy}
        onClick={openBilling}
        className="h-11 w-full rounded-full bg-brand-coral text-brand-navy hover:bg-[#ff8a7c]"
      >
        {busy
          ? "Opening Stripe…"
          : action === "checkout"
            ? "Upgrade to Pro"
            : "Manage billing"}
        {busy ? (
          <LoaderCircle aria-hidden="true" className="animate-spin" />
        ) : (
          <ArrowUpRight aria-hidden="true" />
        )}
      </Button>
      {error ? (
        <p
          role="alert"
          className="rounded-xl bg-card p-3 text-sm text-destructive"
        >
          {error}
        </p>
      ) : null}
    </div>
  )
}
