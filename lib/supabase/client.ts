import { createBrowserClient } from "@supabase/ssr"
import type { SupabaseClient } from "@supabase/supabase-js"
import { getSupabaseAnonKey, getSupabaseUrl } from "./env"

let client: SupabaseClient | undefined

export function createClient() {
  if (client) {
    return client
  }

  client = createBrowserClient(getSupabaseUrl(), getSupabaseAnonKey())
  return client
}
