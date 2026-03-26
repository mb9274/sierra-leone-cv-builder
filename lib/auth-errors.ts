const SUPABASE_SETUP_MESSAGE =
  "Sign-in is not connected yet. The app needs Supabase auth settings enabled in Vercel before login will work."

export function getAuthFriendlyMessage(error: unknown, fallback: string) {
  const message = error instanceof Error ? error.message : String(error || "")

  if (
    message.includes("Invalid supabaseUrl") ||
    message.includes("Must be a valid HTTP or HTTPS URL") ||
    message.includes("Missing Supabase env vars") ||
    message.includes("Supabase is not configured")
  ) {
    return SUPABASE_SETUP_MESSAGE
  }

  if (message.includes("Invalid login credentials")) {
    return "That email or password is incorrect. Try again."
  }

  if (message.includes("Email not confirmed")) {
    return "Your account exists, but the email has not been confirmed yet."
  }

  return message || fallback
}

export function isSupabaseSetupError(error: unknown) {
  const message = error instanceof Error ? error.message : String(error || "")
  return (
    message.includes("Invalid supabaseUrl") ||
    message.includes("Must be a valid HTTP or HTTPS URL") ||
    message.includes("Missing Supabase env vars") ||
    message.includes("Supabase is not configured")
  )
}
