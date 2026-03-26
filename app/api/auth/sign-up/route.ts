import { NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"
import { getSupabaseAnonKey, getSupabaseUrl } from "@/lib/supabase/env"
import { getAuthFriendlyMessage } from "@/lib/auth-errors"

export async function POST(request: NextRequest) {
  try {
    const { email, password, fullName, next } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: { message: "Email and password are required." } },
        { status: 400 },
      )
    }

    const response = NextResponse.json({
      ok: true,
      message: "Account created successfully. Check your email if confirmation is required.",
      next: next || "/auth/sign-in",
    })

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

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName || "",
        },
        emailRedirectTo: `${new URL(request.url).origin}/auth/callback?next=${encodeURIComponent(
          next || "/auth/sign-in",
        )}`,
      },
    })

    if (error) {
      return NextResponse.json(
        { error: { message: getAuthFriendlyMessage(error, "We could not create your account.") } },
        { status: 400 },
      )
    }

    return response
  } catch (error) {
    const message = getAuthFriendlyMessage(error, "We could not create your account.")
    return NextResponse.json({ error: { message } }, { status: 500 })
  }
}
