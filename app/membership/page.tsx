import type { Metadata } from "next"
import Link from "next/link"
import { headers } from "next/headers"
import { Check, GraduationCap } from "lucide-react"

import { isTutorRole } from "@/components/auth/roles"
import { BillingButton } from "@/components/membership/billing-button"
import { SiteFooter } from "@/components/site/site-footer"
import { buttonVariants } from "@/components/ui/button"
import { getAuthSession } from "@/lib/auth"
import { freeTuitionLimit, membershipPath } from "@/lib/membership/plans"
import {
  getBillingAccount,
  getBillingMode,
  hasPremium,
} from "@/lib/membership/store"
import {
  confirmMembershipCheckout,
  getProPrice,
  getStripe,
  synchronizeCustomer,
} from "@/lib/membership/stripe"
import { tuitionManagePath } from "@/lib/tuitions/routes"
import { cn } from "@/lib/utils"

export const metadata: Metadata = { title: "Tutor Membership | MentorLagbe" }

export default async function MembershipPage({
  searchParams,
}: {
  searchParams: Promise<{
    checkout?: string
    session_id?: string
    billing?: string
  }>
}) {
  const params = await searchParams
  const session = await getAuthSession(await headers())
  const tutor =
    session?.user && isTutorRole(session.user.role) ? session.user : null
  const stripePrice = getProPrice().catch(() => null)
  let account = tutor ? await getBillingAccount(tutor.id) : undefined
  let notice: string | undefined
  if (
    tutor &&
    (params.checkout === "success" || params.billing === "returned")
  ) {
    try {
      if (params.checkout === "success") {
        const confirmed =
          typeof params.session_id === "string" &&
          (await confirmMembershipCheckout(tutor.id, params.session_id))
        notice = confirmed
          ? "Stripe confirmed your payment."
          : "This checkout hasn’t been confirmed."
      } else if (account?.customerId) {
        await synchronizeCustomer(getStripe(), account.customerId)
        notice = "Your billing status is up to date."
      }
      account = await getBillingAccount(tutor.id)
    } catch {
      notice =
        "We couldn’t refresh your billing status yet. Try reloading this page."
    }
  } else if (params.checkout === "cancelled") {
    notice = "Checkout was closed. You can resume whenever you’re ready."
  }

  const price = await stripePrice
  const premium = hasPremium(account)
  const testMode = getBillingMode() === "test"
  const checkoutReady = testMode || !!process.env.STRIPE_WEBHOOK_SECRET?.trim()
  const formattedPrice =
    price && price.unit_amount != null
      ? formatStripePrice(price.currency, price.unit_amount)
      : null
  const signInUrl = `/login?next=${encodeURIComponent(membershipPath)}`
  const dateFormatter = new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeZone: "Asia/Dhaka",
  })

  return (
    <>
      <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-8 sm:py-12">
        <header className="max-w-2xl">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
            Tutor membership
          </h1>
          <p className="mt-3 text-muted-foreground">
            Choose how many tuition listings you want to manage.
          </p>
        </header>
        {testMode ? (
          <p className="mt-4 rounded-xl border bg-muted/50 px-4 py-2 text-sm text-muted-foreground">
            Stripe test mode. Checkout uses test cards and does not charge real
            money.
          </p>
        ) : null}
        {notice ? (
          <p
            role="status"
            className="mt-4 rounded-xl border bg-card p-3 text-sm"
          >
            {notice}
          </p>
        ) : null}
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <section className="flex card-elevation flex-col gap-4 rounded-[2rem] border bg-card p-6 sm:p-8">
            <h2 className="text-2xl font-bold">Free</h2>
            <p className="text-4xl font-extrabold tracking-tight">
              No monthly fee
            </p>
            <PlanFeatures
              features={[
                `Up to ${freeTuitionLimit} saved tuition listings`,
                "Review student applications",
                "Edit, pause, and delete your listings",
              ]}
            />
            {tutor ? (
              <Link
                href={tuitionManagePath}
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "mt-auto h-11 w-full rounded-full"
                )}
              >
                {premium
                  ? "Go to My Tuitions"
                  : "Current plan · Go to My Tuitions"}
              </Link>
            ) : (
              <Link
                href={session ? "/register" : signInUrl}
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "mt-auto h-11 w-full rounded-full"
                )}
              >
                {session ? "Use a tutor account" : "Sign in as a tutor"}
              </Link>
            )}
          </section>

          <section className="flex card-elevation flex-col gap-4 rounded-[2rem] border border-brand-coral/35 bg-brand-navy bg-[radial-gradient(ellipse_at_top_left,#2d3f66_0%,transparent_75%)] p-6 text-brand-cream sm:p-8">
            <h2 className="flex flex-wrap items-center gap-3 text-2xl font-bold">
              MentorLagbe Pro
              {premium ? (
                <span className="rounded-full bg-brand-coral/20 px-3 py-1 text-xs font-semibold text-[#ffb6aa]">
                  Current plan
                </span>
              ) : null}
            </h2>
            <p className="text-4xl font-extrabold tracking-tight">
              {formattedPrice ?? "Price unavailable"}
              {formattedPrice ? (
                <span className="ml-1.5 text-base font-medium text-brand-cream/75">
                  / month
                </span>
              ) : null}
            </p>
            <PlanFeatures
              features={[
                "Unlimited tuition listings",
                "Application and published-listing totals on your dashboard",
                "Manage invoices, payment details, and cancellation in Stripe",
              ]}
            />
            {premium && account?.cancelAt ? (
              <p className="text-sm text-brand-cream/85">
                Pro ends on {dateFormatter.format(account.cancelAt)}. Your
                existing tuitions stay available.
              </p>
            ) : null}
            {!premium && account?.subscriptionId ? (
              <p className="text-sm text-brand-cream/85">
                Pro is inactive. Open billing to check your payment or
                subscription.
              </p>
            ) : null}
            <div className="mt-auto pt-2">
              {tutor && (premium || account?.subscriptionId) ? (
                <BillingButton action="portal" />
              ) : tutor && formattedPrice && checkoutReady ? (
                <BillingButton action="checkout" />
              ) : tutor ? (
                <p className="text-sm">Checkout is temporarily unavailable.</p>
              ) : (
                <Link
                  href={session ? "/register" : signInUrl}
                  className={cn(
                    buttonVariants(),
                    "h-11 w-full rounded-full bg-brand-coral text-brand-navy hover:bg-[#ff8a7c]"
                  )}
                >
                  {session
                    ? "Create a tutor account"
                    : "Sign in with a tutor account"}
                </Link>
              )}
              {tutor &&
              !premium &&
              !account?.subscriptionId &&
              account?.customerId ? (
                <div className="mt-2">
                  <BillingButton action="portal" />
                </div>
              ) : null}
            </div>
          </section>
        </div>
        <p className="mt-5 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          <GraduationCap aria-hidden="true" className="mr-1 inline size-4" />{" "}
          All listings follow the same approval process. If you return to Free
          with more than two listings, you can still manage them. Delete
          listings to free a slot before posting again.
        </p>
      </main>
      <SiteFooter />
    </>
  )
}

function formatStripePrice(currency: string, amount: number) {
  const formatter = new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: currency.toUpperCase(),
    currencyDisplay: "code",
  })
  // These currencies use two-decimal Stripe amounts despite having special payout or display rules.
  const digits = ["isk", "ugx"].includes(currency)
    ? 2
    : (formatter.resolvedOptions().maximumFractionDigits ?? 2)
  return formatter.format(amount / 10 ** digits)
}

function PlanFeatures({ features }: { features: string[] }) {
  return (
    <ul className="grid gap-3 pb-3 text-sm">
      {features.map((feature) => (
        <li key={feature} className="flex items-start gap-2">
          <Check
            aria-hidden="true"
            className="mt-0.5 size-4 shrink-0 text-brand-coral"
          />
          {feature}
        </li>
      ))}
    </ul>
  )
}
