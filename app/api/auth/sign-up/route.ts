import { NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"
import { getSupabaseAnonKey, getSupabaseUrl } from "@/lib/supabase/env"

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
        { error: { message: error.message } },
        { status: 400 },
      )
    }

    return response
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to sign up."
    return NextResponse.json({ error: { message } }, { status: 500 })
  }
}
