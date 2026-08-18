import { createClient as createSupabaseClient } from "@supabase/supabase-js"
import type { SupabaseClient } from "@supabase/supabase-js"
import { getSupabaseServiceRoleKey, getSupabaseUrl } from "./env"
import type { Database } from "./database"

let adminClient: SupabaseClient<Database> | undefined

export function createAdminClient() {
  if (adminClient) return adminClient

  const serviceRoleKey = getSupabaseServiceRoleKey()

  if (!serviceRoleKey) {
    throw new Error("Supabase admin client is not configured")
  }

  adminClient = createSupabaseClient<Database>(getSupabaseUrl(), serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })

  return adminClient
}
