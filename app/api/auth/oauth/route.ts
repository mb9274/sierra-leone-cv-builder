import { NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"
import { getSupabaseAnonKey, getSupabaseUrl } from "@/lib/supabase/env"
import { getAuthFriendlyMessage } from "@/lib/auth-errors"

export async function GET(request: NextRequest) {
  try {
    const requestUrl = new URL(request.url)
    const provider = requestUrl.searchParams.get("provider") || "google"
    const next = requestUrl.searchParams.get("next") || "/dashboard"

    const response = NextResponse.next()
    const supabase = createServerClient(getSupabaseUrl(), getSupabaseAnonKey(), {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options)
          })
        },
      },
    })

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: provider as "google",
      options: {
        redirectTo: `${requestUrl.origin}/auth/callback?next=${encodeURIComponent(next)}`,
      },
    })

    if (error || !data?.url) {
      return NextResponse.json(
        { error: { message: getAuthFriendlyMessage(error, "We could not start Google sign-in.") } },
        { status: 400 },
      )
    }

    return NextResponse.redirect(data.url)
  } catch (error) {
    const message = getAuthFriendlyMessage(error, "We could not start Google sign-in.")
    return NextResponse.json({ error: { message } }, { status: 500 })
  }
}
