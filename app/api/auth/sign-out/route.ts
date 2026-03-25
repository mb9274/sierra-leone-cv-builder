import { NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"
import { getSupabaseAnonKey, getSupabaseUrl } from "@/lib/supabase/env"

export async function POST(request: NextRequest) {
  try {
    const response = NextResponse.json({ ok: true })

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

    const { error } = await supabase.auth.signOut()

    if (error) {
      return NextResponse.json({ error: { message: error.message } }, { status: 400 })
    }

    return response
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to sign out."
    return NextResponse.json({ error: { message } }, { status: 500 })
  }
}
