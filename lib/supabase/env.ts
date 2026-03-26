const DEFAULT_SUPABASE_URL = "https://cbendomiixsjicwlhktl.supabase.co"
const DEFAULT_SUPABASE_ANON_KEY = "sb_publishable_Jxk1rKgQCFIBCjVQzzt2fw_KKYt4ddH"

export function getSupabaseUrl() {
  return process.env.NEXT_PUBLIC_SUPABASE_URL || DEFAULT_SUPABASE_URL
}

export function getSupabaseAnonKey() {
  return (
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    DEFAULT_SUPABASE_ANON_KEY
  )
}

export function getSupabaseServiceRoleKey() {
  return process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || ""
}

export function hasSupabaseConfig() {
  return Boolean(getSupabaseUrl() && getSupabaseAnonKey())
}
