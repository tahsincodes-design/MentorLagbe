"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  ArrowRight,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  ShieldCheck,
  Star,
  User,
  Zap,
} from "lucide-react"

import { AuthShell } from "@/components/auth/auth-shell"
import { ImageDropzone } from "@/components/auth/image-dropzone"
import { RolePicker } from "@/components/auth/role-picker"
import { type UserRole } from "@/components/auth/roles"
import { SiteFooter } from "@/components/site-footer"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { signUp } from "@/lib/auth-client"

export default function RegisterPage() {
  const router = useRouter()
  const [role, setRole] = React.useState<UserRole>("student")
  const [name, setName] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [image, setImage] = React.useState("")
  const [showPassword, setShowPassword] = React.useState(false)
  const [error, setError] = React.useState("")
  const [loading, setLoading] = React.useState(false)

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    setError("")
    setLoading(true)

    const result = await signUp.email({
      name,
      email,
      password,
      image: image || undefined,
      role,
    })

    if (result.error) {
      setError(result.error.message ?? "Could not create your account.")
      setLoading(false)
      return
    }

    router.push("/")
    router.refresh()
  }

  return (
    <div className="flex min-h-[calc(100svh-5rem)] flex-col">
      <AuthShell
        badge="Join MentorLagbe"
        title="Start Your Learning Journey with"
        highlight="MentorLagbe"
        subtitle="Find the best tutors, share your knowledge, and achieve your goals together."
        features={[
          { label: "Verified Tutors", icon: ShieldCheck },
          { label: "Easy Booking", icon: Zap },
          { label: "Trusted Platform", icon: Star },
        ]}
        featureStyle="chips"
        illustration={{
          src: "/illustrations/student.png",
          alt: "Student learning on a laptop",
          width: 380,
          height: 312,
        }}
      >
        <Card className="rounded-3xl shadow-[0_28px_60px_-40px_rgba(20,33,61,0.5)] ring-0">
          <CardHeader>
            <CardTitle className="text-2xl font-extrabold">
              Create Your Account
            </CardTitle>
            <CardDescription>Choose your role to get started</CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <RolePicker value={role} onChange={setRole} />

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="name" className="sr-only">
                  Full Name
                </Label>
                <div className="relative">
                  <User className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="name"
                    name="name"
                    autoComplete="name"
                    placeholder="Full Name"
                    required
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    className="h-11 rounded-xl pl-9"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="email" className="sr-only">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="Email Address"
                    required
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className="h-11 rounded-xl pl-9"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="password" className="sr-only">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="Password (min 8 characters)"
                    required
                    minLength={8}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className="h-11 rounded-xl pr-10 pl-9"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((show) => !show)}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    className="absolute top-1/2 right-2 grid size-8 -translate-y-1/2 place-items-center rounded-lg text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? (
                      <EyeOff className="size-4" />
                    ) : (
                      <Eye className="size-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <p className="text-xs font-semibold text-muted-foreground">
                  Profile Photo (Optional)
                </p>
                <ImageDropzone value={image} onChange={setImage} />
              </div>

              {error ? (
                <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
                  {error}
                </p>
              ) : null}

              <Button
                type="submit"
                size="lg"
                disabled={loading}
                className="h-11 w-full rounded-xl bg-brand-coral text-sm font-bold text-white hover:bg-brand-coral-deep"
              >
                {loading ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <>
                    Create Account
                    <ArrowRight className="size-4" />
                  </>
                )}
              </Button>

              <p className="text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="font-semibold text-brand-coral-deep hover:underline dark:text-brand-coral"
                >
                  Sign In
                </Link>
              </p>
            </form>
          </CardContent>
        </Card>
      </AuthShell>
      <SiteFooter />
    </div>
  )
}
