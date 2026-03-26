import { NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"
import { getAuthFriendlyMessage } from "@/lib/auth-errors"
import { getSupabaseAnonKey, getSupabaseUrl } from "@/lib/supabase/env"

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")
  const next = requestUrl.searchParams.get("next") || "/dashboard"

  if (!code) {
    return NextResponse.redirect(new URL(next, request.url))
  }

  const supabaseResponse = NextResponse.redirect(new URL(next, request.url))

  const supabase = createServerClient(
    getSupabaseUrl(),
    getSupabaseAnonKey(),
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            supabaseResponse.cookies.set(name, value, options)
          })
        },
      },
    },
  )

  const { error } = await supabase.auth.exchangeCodeForSession(code)

  if (error) {
    const errorUrl = new URL("/auth/sign-in", request.url)
    errorUrl.searchParams.set(
      "error",
      getAuthFriendlyMessage(error, "We could not complete the sign-in flow."),
    )
    return NextResponse.redirect(errorUrl)
  }

  return supabaseResponse
}
