import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"
import { getSupabaseAnonKey, getSupabaseUrl } from "./env"

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const url = getSupabaseUrl()
  const key = getSupabaseAnonKey()

  const protectedPrefixes = [
    "/dashboard",
    "/builder",
    "/preview",
    "/profile",
    "/applications",
    "/settings",
    "/payments",
  ]

  const isProtected = protectedPrefixes.some(
    (p) => request.nextUrl.pathname === p || request.nextUrl.pathname.startsWith(`${p}/`),
  )

  try {
    const supabase = createServerClient(
      url,
      key,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
            supabaseResponse = NextResponse.next({
              request,
            })
            cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options))
          },
        },
      },
    )

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user && isProtected) {
      const url = request.nextUrl.clone()
      url.pathname = "/auth/sign-in"
      url.searchParams.set("next", request.nextUrl.pathname)
      return NextResponse.redirect(url)
    }

    if (request.nextUrl.pathname.startsWith("/employer") && !user) {
      const url = request.nextUrl.clone()
      url.pathname = "/auth/sign-in"
      return NextResponse.redirect(url)
    }

    return supabaseResponse
  } catch (error) {
    if (isProtected) {
      const url = request.nextUrl.clone()
      url.pathname = "/auth/sign-in"
      url.searchParams.set("next", request.nextUrl.pathname)
      return NextResponse.redirect(url)
    }
    return supabaseResponse
  }
}
