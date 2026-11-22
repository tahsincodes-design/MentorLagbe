import { Mail, MapPin, Phone } from "lucide-react"

import { BrandLogo } from "@/components/site/brand-logo"
import { publicNavigation } from "@/components/site/navigation"
import { SiteNavigationLink } from "@/components/site/site-navigation-link"
import { Separator } from "@/components/ui/separator"
import { contactInbox } from "@/lib/contact"
import { cn } from "@/lib/utils"

const contacts = [
  {
    label: contactInbox,
    href: `mailto:${contactInbox}`,
    icon: Mail,
  },
  { label: "+880 1234 567890", href: "tel:+8801234567890", icon: Phone },
]

const linkClassName =
  "group/footer-link relative w-fit text-sm text-brand-cream/65 after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:origin-left after:scale-x-0 after:bg-brand-coral hover:text-brand-coral hover:after:scale-x-100 focus-visible:text-brand-coral focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-coral/60 focus-visible:ring-offset-4 focus-visible:ring-offset-brand-navy focus-visible:after:scale-x-100 motion-safe:transition-[color,translate] motion-safe:duration-200 motion-safe:after:transition-transform motion-safe:after:duration-200 motion-safe:hover:translate-x-0.5"

export function SiteFooter() {
  return (
    <footer
      id="about"
      className="mt-8 scroll-mt-28 bg-brand-navy text-brand-cream"
    >
      <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8 sm:py-12 lg:px-12">
        <div className="grid gap-9 sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1.2fr] lg:gap-8">
          <div>
            <BrandLogo
              inverse
              className="w-fit motion-safe:transition-transform motion-safe:duration-200 motion-safe:hover:-translate-y-0.5"
            />
            <p className="mt-3 text-sm font-semibold text-brand-cream/75">
              Learn. Grow. Succeed.
            </p>
          </div>

          <div>
            <h2 className="text-sm font-bold text-brand-cream">Quick Links</h2>
            <nav aria-label="Footer" className="mt-4 flex flex-col gap-2.5">
              {publicNavigation.map((item) => (
                <SiteNavigationLink
                  key={item.href}
                  href={item.href}
                  className={linkClassName}
                >
                  {item.label}
                </SiteNavigationLink>
              ))}
            </nav>
          </div>

          <div>
            <h2 className="text-sm font-bold text-brand-cream">Contact Us</h2>
            <address className="mt-4 flex flex-col gap-3 not-italic">
              {contacts.map(({ label, href, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  className={cn(linkClassName, "flex items-center gap-2.5")}
                >
                  <Icon
                    aria-hidden="true"
                    className="size-4 shrink-0 text-brand-cream/50 group-hover/footer-link:text-brand-coral group-focus-visible/footer-link:text-brand-coral motion-safe:transition-colors"
                  />
                  {label}
                </a>
              ))}
              <span className="flex items-center gap-2.5 text-sm text-brand-cream/65">
                <MapPin className="size-4 shrink-0 text-brand-cream/50" />
                Dhaka, Bangladesh
              </span>
            </address>
          </div>
        </div>

        <Separator className="my-7 bg-brand-cream/15" />

        <p className="text-xs text-brand-cream/55">
          © 2026 MentorLagbe. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
