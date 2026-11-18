"use client"

import * as React from "react"
import { ImagePlus, Loader2 } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

export function ImageDropzone({
  value,
  onChange,
}: {
  value: string
  onChange: (url: string) => void
}) {
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = React.useState(false)
  const [uploading, setUploading] = React.useState(false)
  const [error, setError] = React.useState("")

  async function upload(file: File) {
    setError("")
    setUploading(true)

    try {
      const body = new FormData()
      body.append("file", file)

      const response = await fetch("/api/upload", { method: "POST", body })
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data?.error ?? "Upload failed.")
      }

      onChange(data.url)
    } catch (uploadError) {
      setError(
        uploadError instanceof Error ? uploadError.message : "Upload failed."
      )
    } finally {
      setUploading(false)
    }
  }

  function handleDrop(event: React.DragEvent) {
    event.preventDefault()
    setDragging(false)

    const file = event.dataTransfer.files?.[0]
    if (file) void upload(file)
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        onDragOver={(event) => {
          event.preventDefault()
          setDragging(true)
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        className={cn(
          "flex w-full items-center gap-3 rounded-xl border border-dashed border-border bg-muted/30 p-3 text-left transition-colors",
          "hover:border-brand-coral/50 hover:bg-brand-coral/5",
          dragging && "border-brand-coral bg-brand-coral/5"
        )}
      >
        <Avatar size="lg" className="size-11">
          {value ? <AvatarImage src={value} alt="Profile preview" /> : null}
          <AvatarFallback className="bg-brand-navy text-brand-cream">
            <ImagePlus className="size-5" />
          </AvatarFallback>
        </Avatar>

        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold">
            {value ? "Photo added" : "Drop an image here"}
          </p>
          <p className="truncate text-xs text-muted-foreground">
            {uploading
              ? "Uploading to ImgBB…"
              : value
                ? "Click to replace the photo"
                : "or click to browse · PNG or JPG, max 5MB"}
          </p>
        </div>

        {uploading ? (
          <Loader2 className="size-4 shrink-0 animate-spin text-brand-coral" />
        ) : null}
      </button>

      {value ? (
        <button
          type="button"
          onClick={() => onChange("")}
          className="mt-1.5 text-xs font-semibold text-muted-foreground hover:text-brand-coral"
        >
          Remove photo
        </button>
      ) : null}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0]
          if (file) void upload(file)
          event.target.value = ""
        }}
      />

      {error ? (
        <p className="mt-1.5 text-xs text-destructive">{error}</p>
      ) : null}
    </div>
  )
}
