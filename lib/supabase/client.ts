import { createBrowserClient } from "@supabase/ssr"
import type { SupabaseClient } from "@supabase/supabase-js"
import { getSupabaseAnonKey, getSupabaseUrl } from "./env"
import type { Database } from "./database"

let client: SupabaseClient<Database> | undefined

export function createClient() {
  if (client) {
    return client
  }

  client = createBrowserClient<Database>(getSupabaseUrl(), getSupabaseAnonKey())
  return client
}
