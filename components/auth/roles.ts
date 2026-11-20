import {
  GraduationCap,
  ShieldCheck,
  Users,
  type LucideIcon,
} from "lucide-react"

export type UserRole = "student" | "mentor" | "admin"

export function isTutorRole(role?: string | null) {
  const normalized = role?.toLowerCase()
  return normalized === "mentor" || normalized === "tutor"
}

export const roles: {
  value: UserRole
  label: string
  description: string
  icon: LucideIcon
}[] = [
  {
    value: "student",
    label: "Student",
    description: "Find tutors & join batches",
    icon: GraduationCap,
  },
  {
    value: "mentor",
    label: "Tutor",
    description: "Post tuitions & teach students",
    icon: Users,
  },
  {
    value: "admin",
    label: "Admin",
    description: "Manage platform & users",
    icon: ShieldCheck,
  },
]
