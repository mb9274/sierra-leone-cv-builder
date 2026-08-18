import { NextResponse, type NextRequest } from "next/server"
import { appwriteConfig, sessionCookieName } from "@/lib/appwrite/config"

const protectedPrefixes = [
  "/dashboard",
  "/builder",
  "/preview",
  "/profile",
  "/applications",
  "/settings",
  "/payments",
  "/generate",
]

export async function proxy(request: NextRequest) {
  const sessionSecret = request.cookies.get(sessionCookieName())?.value

  const pathname = request.nextUrl.pathname
  const isProtected = protectedPrefixes.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  )

  if (!sessionSecret && isProtected) {
    const url = request.nextUrl.clone()
    url.pathname = "/auth/sign-in"
    url.searchParams.set("next", pathname)
    return NextResponse.redirect(url)
  }

  if (!sessionSecret && pathname.startsWith("/employer")) {
    const url = request.nextUrl.clone()
    url.pathname = "/auth/sign-in"
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
}
