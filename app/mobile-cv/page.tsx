import App from "@/src/App"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export default async function MobileCvPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/sign-in?next=/mobile-cv")
  }

  return <App />
}
