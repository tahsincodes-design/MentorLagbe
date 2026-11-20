import { isIP } from "node:net"
import { z } from "zod"

import { contactInbox, contactLimits } from "@/lib/contact"

const contactSchema = z.object({
  name: z.string().trim().min(1).max(contactLimits.name),
  email: z.string().trim().max(contactLimits.email).pipe(z.email()),
  subject: z
    .string()
    .trim()
    .min(1)
    .max(contactLimits.subject)
    .regex(/^[^\r\n]+$/),
  message: z.string().trim().min(1).max(contactLimits.message),
  submissionId: z.uuid(),
  website: z.string().max(200).optional(),
})

const windowMs = 10 * 60 * 1000
const submissions = new Map<string, { count: number; resetAt: number }>()
let pruneAt = 0

function reserveSubmission(request: Request) {
  const now = Date.now()
  if (now >= pruneAt) {
    for (const [key, entry] of submissions) {
      if (entry.resetAt <= now) submissions.delete(key)
    }
    pruneAt = now + windowMs
  }

  const forwarded = request.headers
    .get("x-forwarded-for")
    ?.split(",")
    .at(-1)
    ?.trim()
  const key = forwarded && isIP(forwarded) ? forwarded : "unidentified"
  const entry = submissions.get(key)
  if (entry && entry.resetAt > now) {
    if (entry.count >= 5) return Math.ceil((entry.resetAt - now) / 1000)
    entry.count++
  } else {
    if (!entry && submissions.size >= 1000) return Math.ceil(windowMs / 1000)
    submissions.set(key, { count: 1, resetAt: now + windowMs })
  }
  return 0
}

export async function POST(request: Request) {
  if (request.headers.get("sec-fetch-site") === "cross-site") {
    return Response.json(
      { message: "Please submit from the About page." },
      { status: 403 }
    )
  }
  if (Number(request.headers.get("content-length")) > 32 * 1024) {
    return Response.json(
      { message: "The message is too long." },
      { status: 413 }
    )
  }

  const result = contactSchema.safeParse(await request.json().catch(() => null))
  if (!result.success) {
    return Response.json(
      {
        message:
          "Check your name, email, subject, and message, then try again.",
      },
      { status: 400 }
    )
  }

  const { name, email, subject, message, submissionId, website } = result.data
  if (website) return Response.json({ success: true })

  const apiKey = process.env.RESEND_API_KEY?.trim()
  const from =
    process.env.RESEND_FROM_EMAIL?.trim() || `MentorLagbe <${contactInbox}>`
  const to = process.env.CONTACT_TO_EMAIL?.trim() || contactInbox
  if (!apiKey || !z.email().safeParse(to).success) {
    console.error(
      "Contact email is missing its API key or has an invalid recipient."
    )
    return Response.json(
      { message: "The contact form is temporarily unavailable." },
      { status: 503 }
    )
  }

  const retryAfter = reserveSubmission(request)
  if (retryAfter) {
    return Response.json(
      {
        message: "Too many messages. Please wait a few minutes and try again.",
      },
      { status: 429, headers: { "Retry-After": String(retryAfter) } }
    )
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "Idempotency-Key": `mentorlagbe-contact/${submissionId}`,
      },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: email,
        subject: `[MentorLagbe contact] ${subject}`,
        text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
      }),
      redirect: "error",
      signal: AbortSignal.timeout(12_000),
    })
    const data = await response.json().catch(() => null)
    if (response.ok && typeof data?.id === "string") {
      return Response.json({ success: true })
    }
    console.error(
      "Resend rejected or did not confirm the contact email.",
      response.status
    )
  } catch {
    console.error("Resend contact email request failed.")
  }

  return Response.json(
    { message: "We couldn’t send your message. Please try again." },
    { status: 502 }
  )
}
