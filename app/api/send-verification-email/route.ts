import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { ApiResponse, handleApiError } from "@/lib/api-utils"
import { getSupabaseUrl } from "@/lib/supabase/env"

export async function POST(request: Request) {
  try {
    const { email, fullName, verificationId } = await request.json()

    if (!email || !verificationId) {
      return ApiResponse.error("Email and verification ID are required", 400, "VALIDATION_ERROR")
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return ApiResponse.error("Invalid email format", 400, "VALIDATION_ERROR")
    }

    const cookieStore = await cookies()
    const supabase = createServerClient(getSupabaseUrl(), process.env.SUPABASE_SERVICE_ROLE_KEY!, {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
        },
      },
    })

    // Prefer the actual request origin so links follow the deployment/domain that served the request.
    const requestOrigin = (() => {
      try {
        return new URL(request.url).origin
      } catch {
        return null
      }
    })()

    const appBaseUrl =
      requestOrigin ||
      process.env.NEXT_PUBLIC_APP_URL ||
      process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ||
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000")

    const verificationUrl = `${appBaseUrl}/verify?id=${verificationId}`

    // For now, we'll store the notification in a database table
    // You can set up Supabase email templates or use a service like Resend
    const emailData = {
      to_email: email,
      full_name: fullName,
      verification_id: verificationId,
      verification_url: verificationUrl,
      sent_at: new Date().toISOString(),
      status: "pending",
    }

    // For a production app, integrate with Resend, SendGrid, or Supabase email functions
    console.log("[v0] Email verification data:", emailData)

    // Return success with verification details
    return ApiResponse.success({
      message: "Verification ID generated successfully",
      verificationId,
      verificationUrl,
      email,
      status: "pending"
    })
  } catch (error) {
    return handleApiError(error)
  }
}
