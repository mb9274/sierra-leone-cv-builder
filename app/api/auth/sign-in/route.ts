import { NextRequest, NextResponse } from "next/server"
import { appwriteConfig, sessionCookieName } from "@/lib/appwrite/config"
import https from "https"

function appwriteRequest(path: string, body: Record<string, unknown>): Promise<{ status: number; body: any; setCookie: string }> {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(body)
    const cookieName = sessionCookieName()
    const req = https.request(
      {
        hostname: new URL(appwriteConfig.endpoint).hostname,
        port: 443,
        path: "/v1" + path,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Appwrite-Project": appwriteConfig.projectId,
          "Content-Length": Buffer.byteLength(data),
        },
      },
      (res) => {
        let responseBody = ""
        let setCookie = ""
        const rawCookies = res.headers["set-cookie"]
        if (Array.isArray(rawCookies)) {
          for (const c of rawCookies) {
            if (c.startsWith(cookieName + "=") && !c.includes("_legacy")) {
              setCookie = c.split(";")[0].substring(cookieName.length + 1)
              break
            }
          }
        }
        res.on("data", (chunk) => (responseBody += chunk))
        res.on("end", () => {
          let parsed: any
          try { parsed = JSON.parse(responseBody) } catch { parsed = { message: responseBody } }
          resolve({ status: res.statusCode || 500, body: parsed, setCookie })
        })
      },
    )
    req.on("error", reject)
    req.write(data)
    req.end()
  })
}

export async function POST(request: NextRequest) {
  try {
    const { email, password, next } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: { message: "Email and password are required." } },
        { status: 400 },
      )
    }

    const result = await appwriteRequest("/account/sessions/email", { email, password })

    if (result.status < 200 || result.status >= 300) {
      const msg = result.body?.message || "Invalid login credentials"
      const friendly =
        msg.includes("Invalid credentials") || msg.includes("credentials")
          ? "That email or password is incorrect. Try again."
          : msg
      return NextResponse.json({ error: { message: friendly } }, { status: 401 })
    }

    const sessionValue = result.setCookie || result.body?.secret || ""

    if (!sessionValue) {
      return NextResponse.json(
        { error: { message: "Session created but no session token found." } },
        { status: 500 },
      )
    }

    const response = NextResponse.json({ ok: true, next: next || "/dashboard" })

    response.cookies.set(sessionCookieName(), sessionValue, {
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30,
    })

    return response
  } catch (error: any) {
    const message = error?.message || "We could not sign you in."
    return NextResponse.json({ error: { message } }, { status: 500 })
  }
}
