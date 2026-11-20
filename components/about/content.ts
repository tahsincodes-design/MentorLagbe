import {
  BookOpen,
  ClipboardCheck,
  FileText,
  GraduationCap,
  PencilLine,
} from "lucide-react"

export const audiences = [
  {
    title: "For students",
    description:
      "Browse approved tuitions and compare the subject, location, and monthly fee when listed. Apply from the tuition details page and check the status there.",
    icon: GraduationCap,
  },
  {
    title: "For tutors",
    description:
      "Post a tuition from your dashboard, describe what you teach, and review applications from interested students once the post is approved.",
    icon: BookOpen,
  },
]

export const tuitionSteps = [
  {
    title: "Tutors post",
    description: "A tutor adds the subject, lesson details, location, and fee.",
    icon: PencilLine,
  },
  {
    title: "Admins review",
    description:
      "An admin reviews the listing before it appears in Browse Tuitions.",
    icon: ClipboardCheck,
  },
  {
    title: "Students apply",
    description:
      "Students send a short message and the tutor reviews the application.",
    icon: FileText,
  },
]
