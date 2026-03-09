import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")
  const next = requestUrl.searchParams.get("next") || "/dashboard"
  const safeNext = next.startsWith("/") ? next : "/dashboard"

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (error) {
      console.error("Error exchanging code for session:", error)
      // Redirect to sign-in with error
      return NextResponse.redirect(new URL("/auth/sign-in?error=auth_callback_error", requestUrl.origin))
    }
  }

  return NextResponse.redirect(new URL(safeNext, requestUrl.origin))
}
