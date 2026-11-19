"use client"

import * as React from "react"
import { Loader2, Mail, Save, User, UserCog, MapPin } from "lucide-react"
import { toast } from "sonner"

import { ImageDropzone } from "@/components/auth/image-dropzone"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { updateUser } from "@/lib/auth-client"

type ProfileUser = {
  name: string
  email: string
  image?: string | null
  bio?: string | null
  location?: string | null
}

const BIO_LIMIT = 160

export function EditProfileDialog({
  open,
  onOpenChange,
  user,
  onSaved,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  user: ProfileUser
  onSaved: () => void
}) {
  const [name, setName] = React.useState(user.name)
  const [image, setImage] = React.useState(user.image ?? "")
  const [bio, setBio] = React.useState(user.bio ?? "")
  const [location, setLocation] = React.useState(user.location ?? "")
  const [error, setError] = React.useState("")
  const [saving, setSaving] = React.useState(false)

  const initials = (user.name || user.email || "ML")
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    setError("")

    if (!name.trim()) {
      setError("Please enter your full name.")
      return
    }

    setSaving(true)

    // This is the real update endpoint: better-auth PATCH /api/auth/update-user.
    // It writes name, image, bio and location to the "user" collection.
    const result = await updateUser({
      name: name.trim(),
      image,
      bio: bio.trim(),
      location: location.trim(),
    })

    if (result.error) {
      setError(result.error.message ?? "Could not update your profile.")
      setSaving(false)
      return
    }

    toast.success("Profile Updated Successfully!", {
      description: "Your profile has been updated.",
    })
    setSaving(false)
    onOpenChange(false)
    onSaved()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[calc(100svh-2rem)] overflow-y-auto sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg font-extrabold">
            <UserCog className="size-5 text-brand-coral" />
            Update Profile
          </DialogTitle>
          <DialogDescription>
            Change your photo and account details.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col items-center gap-3 rounded-xl bg-muted/40 p-4">
            <Avatar className="size-20">
              {image ? <AvatarImage src={image} alt={name} /> : null}
              <AvatarFallback className="bg-brand-navy text-xl font-bold text-brand-cream">
                {initials}
              </AvatarFallback>
            </Avatar>

            <div className="w-full max-w-xs">
              <ImageDropzone value={image} onChange={setImage} />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="profile-name">Full Name</Label>
            <div className="relative">
              <User className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="profile-name"
                name="name"
                autoComplete="name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="h-10 pl-9"
                required
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="profile-email">Email Address</Label>
            <div className="relative">
              <Mail className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="profile-email"
                name="email"
                type="email"
                value={user.email}
                readOnly
                disabled
                className="h-10 pl-9"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Email can&apos;t be changed here.
            </p>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="profile-location">Location (Optional)</Label>
            <div className="relative">
              <MapPin className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="profile-location"
                name="location"
                placeholder="Dhaka, Bangladesh"
                value={location}
                onChange={(event) => setLocation(event.target.value)}
                className="h-10 pl-9"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between gap-3">
              <Label htmlFor="profile-bio">Bio (Optional)</Label>
              <span className="text-[0.7rem] text-muted-foreground">
                {bio.length}/{BIO_LIMIT}
              </span>
            </div>
            <Textarea
              id="profile-bio"
              name="bio"
              rows={3}
              maxLength={BIO_LIMIT}
              placeholder="Tell us a little about yourself…"
              value={bio}
              onChange={(event) => setBio(event.target.value)}
              className="min-h-20"
            />
          </div>

          {error ? (
            <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </p>
          ) : null}

          <DialogFooter className="mt-1">
            <DialogClose
              render={<Button type="button" variant="outline" />}
              disabled={saving}
            >
              Cancel
            </DialogClose>
            <Button
              type="submit"
              disabled={saving}
              className="bg-brand-coral text-white hover:bg-brand-coral-deep"
            >
              {saving ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Save className="size-4" />
              )}
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
