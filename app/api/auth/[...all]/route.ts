import { getAuth } from "@/lib/auth"

async function handleAuth(request: Request) {
  let auth
  try {
    auth = await getAuth()
  } catch (error) {
    console.error(
      "Auth database connection failed.",
      error instanceof Error ? error.name : ""
    )
    return Response.json(
      {
        message:
          "Sign-in is temporarily unavailable. Please try again shortly.",
      },
      { status: 503, headers: { "Cache-Control": "no-store" } }
    )
  }
  return auth.handler(request)
}

export { handleAuth as GET, handleAuth as POST }
