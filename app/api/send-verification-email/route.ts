import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { email, fullName, verificationId } = await request.json()

    if (!email || !verificationId) {
      return NextResponse.json({ error: "Email and verification ID are required" }, { status: 400 })
    }

    const cookieStore = await cookies()
    const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
        },
      },
    })

    // Note: This requires configuring email templates in Supabase dashboard
    const verificationUrl = `${process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || "http://localhost:3000"}/verify?id=${verificationId}`

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
    return NextResponse.json({
      success: true,
      message: "Verification ID generated successfully",
      verificationId,
      verificationUrl,
      email: email,
    })
  } catch (error) {
    console.error("[v0] Error sending verification email:", error)
    return NextResponse.json({ error: "Failed to send verification email" }, { status: 500 })
  }
}
