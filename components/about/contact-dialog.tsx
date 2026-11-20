"use client"

import { useRef, useState, type FormEvent } from "react"
import { Check, LoaderCircle, Mail, Send } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { contactInbox, contactLimits } from "@/lib/contact"

const emptyDraft = { name: "", email: "", subject: "", message: "" }

export function ContactDialog() {
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState(emptyDraft)
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle")
  const [error, setError] = useState("")
  const submissionId = useRef<string | null>(null)
  const sending = status === "sending"
  const sent = status === "sent"

  function handleOpenChange(nextOpen: boolean) {
    if (sending) return
    setOpen(nextOpen)
    if (!nextOpen) {
      setError("")
      setStatus("idle")
    }
  }

  function updateDraft(field: keyof typeof emptyDraft, value: string) {
    submissionId.current = null
    setDraft((current) => ({ ...current, [field]: value }))
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (sending) return

    const form = new FormData(event.currentTarget)
    setError("")
    setStatus("sending")
    try {
      submissionId.current ??= crypto.randomUUID()
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...draft,
          website: form.get("website"),
          submissionId: submissionId.current,
        }),
      })
      const data = await response.json().catch(() => null)
      if (!response.ok || !data?.success) {
        setError(
          typeof data?.message === "string"
            ? data.message
            : "We couldn’t send your message. Please try again."
        )
        setStatus("idle")
        return
      }

      submissionId.current = null
      setDraft(emptyDraft)
      setStatus("sent")
    } catch {
      setStatus("idle")
      setError("We couldn’t reach the contact form. Please try again.")
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger
        render={<Button variant="outline" className="h-10 rounded-full px-4" />}
      >
        <Mail aria-hidden="true" className="size-4" />
        Email us
      </DialogTrigger>
      <DialogContent className="max-h-[calc(100dvh-2rem)] gap-0 overflow-y-auto rounded-[1.75rem] p-0 sm:max-w-lg">
        <div className="border-b border-border bg-linear-to-br from-brand-coral/20 via-brand-coral/5 to-transparent px-6 pt-6 pb-5 sm:px-8">
          <span className="grid size-11 place-items-center rounded-2xl bg-brand-coral text-brand-navy">
            {sent ? (
              <Check aria-hidden="true" className="size-5" />
            ) : (
              <Mail aria-hidden="true" className="size-5" />
            )}
          </span>
          <DialogTitle className="mt-4 text-2xl font-bold tracking-tight">
            {sent ? "Message sent" : "Email MentorLagbe"}
          </DialogTitle>
          <DialogDescription className="mt-2 leading-relaxed">
            {sent
              ? "Thanks for reaching out. We’ll reply to the email address you provided."
              : "Send us a question or share your feedback. We’ll reply to your email address."}
          </DialogDescription>
        </div>

        {sent ? (
          <div role="status" className="flex justify-end px-6 py-5 sm:px-8">
            <span className="sr-only">Your message has been sent.</span>
            <DialogClose render={<Button className="h-10 rounded-full px-5" />}>
              Done
            </DialogClose>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="grid gap-4 px-6 py-5 sm:px-8"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="contact-name">Name</Label>
                <Input
                  id="contact-name"
                  name="name"
                  autoComplete="name"
                  required
                  maxLength={contactLimits.name}
                  value={draft.name}
                  onChange={(event) => updateDraft("name", event.target.value)}
                  disabled={sending}
                  className="h-10"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="contact-email">Email address</Label>
                <Input
                  id="contact-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  maxLength={contactLimits.email}
                  value={draft.email}
                  onChange={(event) => updateDraft("email", event.target.value)}
                  disabled={sending}
                  className="h-10"
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="contact-subject">Subject</Label>
              <Input
                id="contact-subject"
                name="subject"
                required
                maxLength={contactLimits.subject}
                value={draft.subject}
                onChange={(event) => updateDraft("subject", event.target.value)}
                disabled={sending}
                className="h-10"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="contact-message">Message</Label>
              <Textarea
                id="contact-message"
                name="message"
                required
                maxLength={contactLimits.message}
                value={draft.message}
                onChange={(event) => updateDraft("message", event.target.value)}
                disabled={sending}
                className="h-28 max-h-48 resize-y"
              />
            </div>
            <div hidden>
              <input name="website" tabIndex={-1} autoComplete="off" />
            </div>

            {error ? (
              <div
                role="alert"
                className="rounded-xl bg-destructive/10 px-3 py-2 text-sm text-destructive"
              >
                <p>{error}</p>
                <a
                  href={`mailto:${contactInbox}`}
                  className="mt-1 inline-block font-medium underline underline-offset-3"
                >
                  Email us directly
                </a>
              </div>
            ) : null}
            <Button
              type="submit"
              disabled={sending}
              className="h-11 rounded-full bg-brand-coral px-5 text-brand-navy hover:bg-[#ff8a7c] sm:justify-self-end"
            >
              {sending ? (
                <LoaderCircle
                  aria-hidden="true"
                  className="size-4 animate-spin"
                />
              ) : (
                <Send aria-hidden="true" className="size-4" />
              )}
              {sending ? "Sending…" : "Send message"}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
