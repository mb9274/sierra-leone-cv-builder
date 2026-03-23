import { NextResponse } from "next/server"
import { z } from "zod"
import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { ApiResponse, handleApiError, withAuth, parseJsonBody } from "@/lib/api-utils"

const idSchema = z.string().min(1)

const isoDateSchema = z.union([
  z.string().datetime(),
  z.string().min(1),
  z.date().transform((d) => d.toISOString()),
])

const cvSchema = z
  .object({
    id: z.string().min(1),
    verificationId: z.string().min(1).optional(),
    verifiedAt: z.string().min(1).optional(),
    templateId: z.string().min(1).optional(),
    personalInfo: z.object({
      fullName: z.string().optional().default(""),
      email: z.string().optional().default(""),
      phone: z.string().optional().default(""),
      location: z.string().optional(),
      addressCity: z.string().optional(),
      addressCountry: z.string().optional(),
      age: z.string().optional(),
      summary: z.string().optional(),
      profilePhoto: z.string().optional(),
      linkedin: z.string().optional(),
      portfolio: z.string().optional(),
    }),
    education: z
      .array(
        z.object({
          id: z.string().min(1),
          institution: z.string().optional().default(""),
          degree: z.string().optional().default(""),
          fieldOfStudy: z.string().optional().default(""),
          startDate: z.string().optional().default(""),
          endDate: z.string().optional().default(""),
          current: z.boolean().optional().default(false),
        }),
      )
      .optional()
      .default([]),
    experience: z
      .array(
        z.object({
          id: z.string().min(1),
          company: z.string().optional().default(""),
          position: z.string().optional().default(""),
          location: z.string().optional().default(""),
          startDate: z.string().optional().default(""),
          endDate: z.string().optional().default(""),
          current: z.boolean().optional().default(false),
          description: z.string().optional(),
          achievements: z.string().optional(),
        }),
      )
      .optional()
      .default([]),
    skills: z.array(z.string()).optional().default([]),
    languages: z
      .array(
        z.object({
          language: z.string().optional().default(""),
          proficiency: z.string().optional().default(""),
        }),
      )
      .optional()
      .default([]),
    projects: z
      .array(
        z.object({
          id: z.string().min(1),
          name: z.string().optional().default(""),
          description: z.string().optional().default(""),
          link: z.string().optional(),
          technologies: z.array(z.string()).optional(),
          outcome: z.string().optional(),
        }),
      )
      .optional(),
    technicalWriting: z
      .array(
        z.object({
          id: z.string().min(1),
          title: z.string().optional().default(""),
          link: z.string().optional().default(""),
          platform: z.string().optional(),
        }),
      )
      .optional(),
    certifications: z
      .array(
        z.object({
          id: z.string().min(1),
          name: z.string().optional().default(""),
          organization: z.string().optional().default(""),
          year: z.string().optional().default(""),
        }),
      )
      .optional(),
    volunteering: z
      .array(
        z.object({
          id: z.string().min(1),
          organization: z.string().optional().default(""),
          role: z.string().optional().default(""),
          startDate: z.string().optional().default(""),
          endDate: z.string().optional().default(""),
          description: z.string().optional().default(""),
        }),
      )
      .optional(),
    awards: z
      .array(
        z.object({
          id: z.string().min(1),
          name: z.string().optional().default(""),
          organization: z.string().optional().default(""),
          year: z.string().optional().default(""),
          reason: z.string().optional().default(""),
        }),
      )
      .optional(),
    hobbies: z.array(z.string()).optional(),
    referees: z
      .array(
        z.object({
          id: z.string().min(1),
          name: z.string().optional().default(""),
          title: z.string().optional().default(""),
          organization: z.string().optional().default(""),
          phone: z.string().optional().default(""),
          email: z.string().optional().default(""),
          availableOnRequest: z.boolean().optional(),
        }),
      )
      .optional(),
    availability: z.string().optional(),
    createdAt: isoDateSchema,
    updatedAt: isoDateSchema,
  })
  .passthrough()

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const parsedId = idSchema.safeParse(id)
    if (!parsedId.success) {
      return ApiResponse.error("Invalid CV ID", 400, "VALIDATION_ERROR")
    }

    return withAuth(async (user) => {
      const supabase = createAdminClient()

      const { data, error } = await supabase
        .from("cvs")
        .select("id, data, created_at, updated_at")
        .eq("id", parsedId.data)
        .eq("user_id", user.id)
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          return ApiResponse.notFound("CV not found")
        }
        return ApiResponse.error("Failed to fetch CV", 500, "DATABASE_ERROR", error.message)
      }

      return ApiResponse.success({ cv: data })
    }, createClient)
  } catch (error) {
    return handleApiError(error)
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const parsedId = idSchema.safeParse(id)
    if (!parsedId.success) {
      return ApiResponse.error("Invalid CV ID", 400, "VALIDATION_ERROR")
    }

    return withAuth(async (user) => {
      const bodyParse = await parseJsonBody(request, cvSchema)
      if (!bodyParse.success) return bodyParse.response

      const cv = bodyParse.data
      const supabase = createAdminClient()

      // Validate that we have a valid ID
      if (!parsedId.data) {
        return ApiResponse.error("CV ID is required", 400, "VALIDATION_ERROR")
      }

      // Prepare update data - let trigger handle updated_at
      const updateData: any = {
        data: cv,
      }

      console.log("Updating CV with ID:", parsedId.data, "for user:", user.id)

      const { data, error } = await supabase
        .from("cvs")
        .update(updateData)
        .eq("id", parsedId.data)
        .eq("user_id", user.id)
        .select("id, data, created_at, updated_at")
        .single()

      if (error) {
        console.error("Database update error:", error)
        if (error.code === 'PGRST116') {
          return ApiResponse.notFound("CV not found")
        }
        return ApiResponse.error("Failed to update CV", 500, "DATABASE_ERROR", error.message)
      }

      return ApiResponse.success({ cv: data })
    }, createClient)
  } catch (error) {
    return handleApiError(error)
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const parsedId = idSchema.safeParse(id)
    if (!parsedId.success) {
      return ApiResponse.error("Invalid CV ID", 400, "VALIDATION_ERROR")
    }

    return withAuth(async (user) => {
      const supabase = createAdminClient()

      // Validate that we have a valid ID
      if (!parsedId.data) {
        return ApiResponse.error("CV ID is required", 400, "VALIDATION_ERROR")
      }

      console.log("Deleting CV with ID:", parsedId.data, "for user:", user.id)

      const { error } = await supabase
        .from("cvs")
        .delete()
        .eq("id", parsedId.data)
        .eq("user_id", user.id)

      if (error) {
        console.error("Database delete error:", error)
        return ApiResponse.error("Failed to delete CV", 500, "DATABASE_ERROR", error.message)
      }

      return ApiResponse.success({ ok: true })
    }, createClient)
  } catch (error) {
    return handleApiError(error)
  }
}
