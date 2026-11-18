const MAX_SIZE = 5 * 1024 * 1024

export async function POST(request: Request) {
  const apiKey = process.env.IMGBB_API_KEY?.trim()

  if (!apiKey) {
    return Response.json(
      { error: "Image upload is not configured. Add IMGBB_API_KEY to .env." },
      { status: 500 }
    )
  }

  const formData = await request.formData()
  const file = formData.get("file")

  if (!(file instanceof File)) {
    return Response.json({ error: "No image file was sent." }, { status: 400 })
  }

  if (!file.type.startsWith("image/")) {
    return Response.json(
      { error: "Only image files are allowed." },
      { status: 400 }
    )
  }

  if (file.size > MAX_SIZE) {
    return Response.json(
      { error: "Image is too large. Please use one under 5MB." },
      { status: 400 }
    )
  }

  const image = Buffer.from(await file.arrayBuffer()).toString("base64")
  const body = new URLSearchParams({ image, name: file.name })

  const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
    method: "POST",
    body,
  })

  const data = await response.json()

  if (!response.ok || !data?.success) {
    return Response.json(
      { error: data?.error?.message ?? "ImgBB upload failed. Try again." },
      { status: 502 }
    )
  }

  return Response.json({ url: data.data.url })
}
