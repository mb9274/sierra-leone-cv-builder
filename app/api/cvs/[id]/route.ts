import { NextResponse } from "next/server"
import { z } from "zod"
import { ApiResponse, handleApiError, withAuth, parseJsonBody } from "@/lib/api-utils"
import { createAdminClient, Query } from "@/lib/appwrite/server"
import { appwriteConfig } from "@/lib/appwrite/config"
import { normalizeCvRecord } from "@/lib/cv-storage"

const idSchema = z.string().min(1)

const isoDateSchema = z.union([
  z.string().datetime(),
  z.string().min(1),
  z.date().transform((d) => d.toISOString()),
])

const cvSchema = z
  .object({
    id: z.string().min(1),
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
    projects: z.array(z.any()).optional(),
    technicalWriting: z.array(z.any()).optional(),
    certifications: z.array(z.any()).optional(),
    volunteering: z.array(z.any()).optional(),
    awards: z.array(z.any()).optional(),
    hobbies: z.array(z.string()).optional(),
    referees: z.array(z.any()).optional(),
    availability: z.string().optional(),
    createdAt: isoDateSchema,
    updatedAt: isoDateSchema,
  })
  .passthrough()

function toCvRecord(doc: any) {
  const parsed = typeof doc.data === "string" ? JSON.parse(doc.data) : doc.data || {}
  return {
    id: doc.$id,
    data: parsed,
    created_at: doc.$createdAt,
    updated_at: doc.$updatedAt,
    user_id: doc.user_id,
  }
}

async function findUserCv(docId: string, userId: string) {
  const { databases } = await createAdminClient()
  const result = await databases.listDocuments(
    appwriteConfig.databaseId,
    appwriteConfig.collectionId,
    [Query.equal("user_id", userId), Query.equal("$id", docId)],
  )
  return result.documents[0] || null
}

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const parsedId = idSchema.safeParse(id)
    if (!parsedId.success) {
      return ApiResponse.error("Invalid CV ID", 400, "VALIDATION_ERROR")
    }

    return withAuth(async (user) => {
      const doc = await findUserCv(parsedId.data, user.$id)
      if (!doc) return ApiResponse.notFound("CV not found")
      return ApiResponse.success({ cv: doc })
    })
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
      const { databases } = await createAdminClient()

      const doc = await findUserCv(parsedId.data, user.$id)
      if (!doc) return ApiResponse.notFound("CV not found")

      const updated = await databases.updateDocument(
        appwriteConfig.databaseId,
        appwriteConfig.collectionId,
        doc.$id,
        { data: JSON.stringify(cv) },
      )

      return ApiResponse.success({ cv: toCvRecord(updated) })
    })
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
      const doc = await findUserCv(parsedId.data, user.$id)
      if (!doc) return ApiResponse.notFound("CV not found")

      const { databases } = await createAdminClient()
      await databases.deleteDocument(
        appwriteConfig.databaseId,
        appwriteConfig.collectionId,
        doc.$id,
      )

      return ApiResponse.success({ ok: true })
    })
  } catch (error) {
    return handleApiError(error)
  }
}
