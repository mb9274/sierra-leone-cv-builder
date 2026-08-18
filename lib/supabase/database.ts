import type { CVData } from "@/lib/types"

export type Database = {
  public: {
    Tables: {
      cvs: {
        Row: {
          id: string
          user_id: string
          data: Record<string, any>
          full_name: string | null
          email: string | null
          phone: string | null
          age: number | null
          summary: string | null
          education: CVData["education"]
          experience: CVData["experience"]
          skills: CVData["skills"]
          languages: CVData["languages"]
          photo_url: string | null
          template: string | null
          originalFileName?: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          data?: Record<string, any>
          full_name?: string | null
          email?: string | null
          phone?: string | null
          age?: number | null
          summary?: string | null
          education?: CVData["education"] | null
          experience?: CVData["experience"] | null
          skills?: CVData["skills"] | null
          languages?: CVData["languages"] | null
          photo_url?: string | null
          template?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          data?: Record<string, any>
          full_name?: string | null
          email?: string | null
          phone?: string | null
          age?: number | null
          summary?: string | null
          education?: CVData["education"] | null
          experience?: CVData["experience"] | null
          skills?: CVData["skills"] | null
          languages?: CVData["languages"] | null
          photo_url?: string | null
          template?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {}
    Functions: {}
    Enums: {}
    CompositeTypes: {}
  }
}
