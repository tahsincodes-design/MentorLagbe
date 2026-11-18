import {
  GraduationCap,
  ShieldCheck,
  Users,
  type LucideIcon,
} from "lucide-react"

export type UserRole = "student" | "mentor" | "admin"

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
    label: "Mentor",
    description: "Teach & share your expertise",
    icon: Users,
  },
  {
    value: "admin",
    label: "Admin",
    description: "Manage platform & users",
    icon: ShieldCheck,
  },
]
