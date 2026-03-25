import { createClient } from "@supabase/supabase-js"
import { getSupabaseAnonKey, getSupabaseUrl } from "../../lib/supabase/env"

export const supabase = createClient(getSupabaseUrl(), getSupabaseAnonKey())
