import { tuitionBrowsePath } from "@/lib/tuitions/routes"
import { membershipPath } from "@/lib/membership/plans"

export const howItWorksPath = "/how-it-works"

export const publicNavigation = [
  { label: "Home", href: "/" },
  { label: "Browse Tuitions", href: tuitionBrowsePath },
  { label: "How It Works", href: howItWorksPath },
  { label: "About", href: "/about" },
  { label: "Membership", href: membershipPath },
]
