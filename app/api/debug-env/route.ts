import { NextResponse } from "next/server"
import { getSupabaseAnonKey, getSupabaseUrl } from "@/lib/supabase/env"

export function GET() {
  return NextResponse.json({
    hasAppUrl: !!process.env.NEXT_PUBLIC_APP_URL,
    hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    hasSupabaseAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    appUrl: process.env.NEXT_PUBLIC_APP_URL ?? null,
    effectiveSupabaseUrl: getSupabaseUrl(),
    effectiveSupabaseAnonKeySet: !!getSupabaseAnonKey(),
  })
}
