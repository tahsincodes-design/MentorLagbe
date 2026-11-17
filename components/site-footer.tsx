import { Code2, Mail, MapPin, Phone, Play, Users } from "lucide-react"

import { BrandLogo } from "@/components/brand-logo"
import { cn } from "@/lib/utils"

const quickLinks = [
  { label: "Home", href: "#home" },
  { label: "Browse Tuitions", href: "#browse-tuitions" },
  { label: "Pricing", href: "#pricing" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "About", href: "#about" },
]

export function SiteFooter() {
  return (
    <footer
      id="about"
      className="mt-8 scroll-mt-28 bg-brand-navy text-brand-cream"
    >
      <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8 lg:px-12">
        <div className="grid gap-9 sm:grid-cols-2 lg:grid-cols-[1.4fr_0.8fr_1.1fr_0.8fr]">
          <div>
            <BrandLogo inverse />
            <p className="mt-4 max-w-xs text-sm leading-6 text-brand-cream/65">
              Learn with confidence. Find verified tutors and a learning plan
              built around your goals.
            </p>
          </div>

          <div>
            <h2 className="text-sm font-bold text-brand-cream">Quick Links</h2>
            <nav aria-label="Footer" className="mt-4 flex flex-col gap-2.5">
              {quickLinks.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="w-fit text-sm text-brand-cream/65 transition-colors hover:text-brand-coral"
                >
                  {item.label}
                </a>
              ))}
            </nav>
          </div>

          <div>
            <h2 className="text-sm font-bold text-brand-cream">Contact Us</h2>
            <address className="mt-4 flex flex-col gap-3 not-italic">
              <a
                href="mailto:hello@mentorlagbe.com"
                className="flex items-center gap-2 text-sm text-brand-cream/65 transition-colors hover:text-brand-coral"
              >
                <Mail className="size-4" />
                hello@mentorlagbe.com
              </a>
              <a
                href="tel:+8801234567890"
                className="flex items-center gap-2 text-sm text-brand-cream/65 transition-colors hover:text-brand-coral"
              >
                <Phone className="size-4" />
                +880 1234 567890
              </a>
              <span className="flex items-center gap-2 text-sm text-brand-cream/65">
                <MapPin className="size-4" />
                Dhaka, Bangladesh
              </span>
            </address>
          </div>

          <div>
            <h2 className="text-sm font-bold text-brand-cream">Follow Us</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {[
                { label: "Community", href: "#", icon: Users },
                { label: "Projects", href: "#", icon: Code2 },
                { label: "Videos", href: "#", icon: Play },
              ].map(({ label, href, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className={cn(
                    "grid size-9 place-items-center rounded-full border border-brand-cream/15 text-brand-cream/65 transition-colors",
                    "hover:border-brand-coral/50 hover:bg-brand-coral/10 hover:text-brand-coral"
                  )}
                >
                  <Icon className="size-4" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-9 border-t border-brand-cream/10 pt-5 text-center text-xs text-brand-cream/55">
          © 2026 MentorLagbe. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
