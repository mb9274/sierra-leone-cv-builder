import { NextRequest, NextResponse } from "next/server"
import { appwriteConfig } from "@/lib/appwrite/config"

export async function GET(request: NextRequest) {
  try {
    const requestUrl = new URL(request.url)
    const provider = requestUrl.searchParams.get("provider") || "google"
    const next = requestUrl.searchParams.get("next") || "/dashboard"

    if (provider !== "google") {
      return NextResponse.json(
        { error: { message: "Only Google sign-in is supported." } },
        { status: 400 },
      )
    }

    const failureUrl = `${requestUrl.origin}/auth/sign-in?error=oauth_failed`
    const successUrl = `${requestUrl.origin}/auth/callback?next=${encodeURIComponent(next)}`

    const res = await fetch(`${appwriteConfig.endpoint}/account/sessions/oauth2`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Appwrite-Project": appwriteConfig.projectId,
      },
      body: JSON.stringify({
        provider: "google",
        successUrl,
        failureUrl,
      }),
    })

    if (!res.ok) {
      const body = await res.json().catch(() => ({}))
      return NextResponse.json(
        { error: { message: body.message || "Could not start Google sign-in." } },
        { status: 400 },
      )
    }

    const data = await res.json()
    if (data.url) {
      return NextResponse.redirect(data.url)
    }

    return NextResponse.json(
      { error: { message: "No redirect URL returned from Appwrite." } },
      { status: 500 },
    )
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not start Google sign-in."
    return NextResponse.json({ error: { message } }, { status: 500 })
  }
}
