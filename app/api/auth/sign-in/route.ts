import { NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"
import { getSupabaseAnonKey, getSupabaseUrl } from "@/lib/supabase/env"
import { getAuthFriendlyMessage } from "@/lib/auth-errors"

export async function POST(request: NextRequest) {
  try {
    const { email, password, next } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: { message: "Email and password are required." } },
        { status: 400 },
      )
    }

    const response = NextResponse.json({
      ok: true,
      next: next || "/dashboard",
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

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      return NextResponse.json(
        { error: { message: getAuthFriendlyMessage(error, "We could not sign you in.") } },
        { status: 401 },
      )
    }

    return response
  } catch (error) {
    const message = getAuthFriendlyMessage(error, "We could not sign you in.")
    return NextResponse.json({ error: { message } }, { status: 500 })
  }
}
