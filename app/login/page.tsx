"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowRight, Eye, EyeOff, Loader2, Lock, Mail } from "lucide-react"

import { AuthShell } from "@/components/auth/auth-shell"
import { roles, type UserRole } from "@/components/auth/roles"
import { SiteFooter } from "@/components/site-footer"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { signIn, signOut } from "@/lib/auth-client"
import { cn } from "@/lib/utils"

export default function LoginPage() {
  const router = useRouter()
  const [tab, setTab] = React.useState("credentials")
  const [role, setRole] = React.useState<UserRole>("student")
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [rememberMe, setRememberMe] = React.useState(true)
  const [showPassword, setShowPassword] = React.useState(false)
  const [error, setError] = React.useState("")
  const [loading, setLoading] = React.useState(false)

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    setError("")
    setLoading(true)

    const result = await signIn.email({ email, password, rememberMe })

    if (result.error) {
      setError(result.error.message ?? "Invalid email or password.")
      setLoading(false)
      return
    }

    const accountRole = result.data?.user?.role

    if (accountRole && accountRole !== role) {
      await signOut()
      const label =
        roles.find((item) => item.value === accountRole)?.label ?? accountRole
      setError(
        `This account is registered as a ${label}. Pick ${label} and try again.`
      )
      setLoading(false)
      return
    }

    router.push("/")
    router.refresh()
  }

  return (
    <div className="flex min-h-[calc(100svh-5rem)] flex-col">
      <AuthShell
        badge="Welcome Back"
        title="Sign In to"
        highlight="MentorLagbe"
        subtitle="Continue your journey of learning and mentorship."
        breakHighlight
        features={[
          { label: "Access your dashboard" },
          { label: "Manage your tuitions or applications" },
          { label: "Upgrade to Pro for more features" },
        ]}
        illustration={{
          src: "/illustrations/mentor.png",
          alt: "Mentor working on a laptop at a desk",
          width: 365,
          height: 325,
        }}
      >
        <Card className="rounded-3xl shadow-[0_28px_60px_-40px_rgba(20,33,61,0.5)] ring-0">
          <CardHeader>
            <CardTitle className="text-2xl font-extrabold">Sign In</CardTitle>
            <CardDescription>
              Welcome back! Please sign in to continue.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Tabs value={tab} onValueChange={(value) => setTab(String(value))}>
              <TabsList className="grid h-11 w-full grid-cols-2 rounded-xl bg-muted p-1">
                <TabsTrigger
                  value="credentials"
                  className="rounded-lg text-sm font-semibold data-active:bg-brand-navy data-active:text-brand-cream dark:data-active:bg-brand-navy dark:data-active:text-brand-cream"
                >
                  Email &amp; Password
                </TabsTrigger>
                <TabsTrigger
                  value="role"
                  className="rounded-lg text-sm font-semibold data-active:bg-brand-navy data-active:text-brand-cream dark:data-active:bg-brand-navy dark:data-active:text-brand-cream"
                >
                  Role Login
                </TabsTrigger>
              </TabsList>

              <TabsContent value="credentials">
                <form
                  onSubmit={handleSubmit}
                  className="flex flex-col gap-4 pt-3"
                >
                  <div className="flex gap-2">
                    {roles.map((item) => (
                      <button
                        key={item.value}
                        type="button"
                        onClick={() => setRole(item.value)}
                        aria-pressed={role === item.value}
                        className={cn(
                          "flex-1 rounded-lg border px-2 py-1.5 text-xs font-bold transition-colors",
                          role === item.value
                            ? "border-brand-coral bg-brand-coral/10 text-brand-coral-deep dark:text-brand-coral"
                            : "border-border text-muted-foreground hover:bg-muted"
                        )}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>

                  <div className="relative">
                    <Mail className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      type="email"
                      name="email"
                      autoComplete="email"
                      placeholder="Email Address"
                      aria-label="Email Address"
                      required
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      className="h-11 rounded-xl pl-9"
                    />
                  </div>

                  <div className="relative">
                    <Lock className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      autoComplete="current-password"
                      placeholder="Password"
                      aria-label="Password"
                      required
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

                  <div className="flex items-center justify-between gap-3">
                    <Label
                      htmlFor="remember"
                      className="cursor-pointer gap-2 text-xs font-semibold text-muted-foreground"
                    >
                      <Checkbox
                        id="remember"
                        checked={rememberMe}
                        onCheckedChange={setRememberMe}
                      />
                      Remember Me
                    </Label>
                    <span
                      title="Password reset is coming soon"
                      className="cursor-not-allowed text-xs font-semibold text-brand-coral-deep/50 dark:text-brand-coral/50"
                    >
                      Forgot Password?
                    </span>
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
                        Sign In
                        <ArrowRight className="size-4" />
                      </>
                    )}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="role">
                <div className="flex flex-col gap-2 pt-3">
                  {roles.map((item) => {
                    const Icon = item.icon

                    return (
                      <button
                        key={item.value}
                        type="button"
                        onClick={() => {
                          setRole(item.value)
                          setTab("credentials")
                        }}
                        className="flex w-full items-center gap-3 rounded-xl border border-border px-4 py-3 text-sm font-bold transition-colors hover:border-brand-coral/50 hover:bg-brand-coral/5"
                      >
                        <Icon className="size-5 text-brand-coral" />
                        Login as {item.label}
                        <ArrowRight className="ml-auto size-4 text-muted-foreground" />
                      </button>
                    )
                  })}
                </div>
              </TabsContent>
            </Tabs>

            <p className="mt-5 text-center text-sm text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link
                href="/register"
                className="font-semibold text-brand-coral-deep hover:underline dark:text-brand-coral"
              >
                Sign Up
              </Link>
            </p>
          </CardContent>
        </Card>
      </AuthShell>
      <SiteFooter />
    </div>
  )
}
