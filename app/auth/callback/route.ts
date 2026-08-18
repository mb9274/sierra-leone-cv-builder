import { NextRequest, NextResponse } from "next/server"
import { appwriteConfig } from "@/lib/appwrite/config"

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const next = requestUrl.searchParams.get("next") || "/dashboard"
  const secret = requestUrl.searchParams.get("secret")

  if (!secret) {
    const errorUrl = new URL("/auth/sign-in", request.url)
    errorUrl.searchParams.set("error", "No session secret provided.")
    return NextResponse.redirect(errorUrl)
  }

  const res = await fetch(`${appwriteConfig.endpoint}/account/sessions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Appwrite-Project": appwriteConfig.projectId,
    },
    body: JSON.stringify({ secret }),
  })

  if (!res.ok) {
    const errorUrl = new URL("/auth/sign-in", request.url)
    errorUrl.searchParams.set("error", "Could not complete sign-in.")
    return NextResponse.redirect(errorUrl)
  }

  const setCookie = res.headers.get("set-cookie")
  const response = NextResponse.redirect(new URL(next, request.url))

  if (setCookie) {
    response.headers.set("set-cookie", setCookie)
  }

  return response
}
