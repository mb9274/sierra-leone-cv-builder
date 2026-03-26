import { createClient as createSupabaseClient } from "@supabase/supabase-js"
import { getSupabaseServiceRoleKey, getSupabaseUrl } from "./env"

let adminClient: ReturnType<typeof createSupabaseClient> | undefined

export function createAdminClient() {
  if (adminClient) return adminClient

  const serviceRoleKey = getSupabaseServiceRoleKey()

  if (!serviceRoleKey) {
    throw new Error("Supabase admin client is not configured")
  }

  adminClient = createSupabaseClient(getSupabaseUrl(), serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })

  return adminClient
}
