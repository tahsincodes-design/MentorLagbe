import {
  GraduationCap,
  ShieldCheck,
  Users,
  type LucideIcon,
} from "lucide-react"

export type RegistrationRole = "student" | "mentor"
export type UserRole = RegistrationRole | "admin"

export function isTutorRole(role?: string | null) {
  const normalized = role?.toLowerCase()
  return normalized === "mentor" || normalized === "tutor"
}

export const roles = [
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
] as const satisfies readonly {
  value: UserRole
  label: string
  description: string
  icon: LucideIcon
}[]
