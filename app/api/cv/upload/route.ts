import { NextRequest, NextResponse } from "next/server"
import { createAdminClient, Query, ID } from "@/lib/appwrite/server"
import { appwriteConfig } from "@/lib/appwrite/config"
import { getAuthenticatedUser } from "@/lib/appwrite/server"

export const runtime = "nodejs"

const ALLOWED_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/webp",
  "image/tiff",
]

const MAX_SIZE = 5 * 1024 * 1024

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get("file") as File | null

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: `Invalid file type: ${file.type}. Only PDF, DOC, DOCX, PNG, JPG, WEBP, and TIFF files are allowed` },
        { status: 400 },
      )
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: `File too large: ${Math.round(file.size / 1024 / 1024)}MB. Maximum size is 5MB` },
        { status: 400 },
      )
    }

    const { databases, storage } = await createAdminClient()

    let storageMeta: { storageBucket: string; storagePath: string; originalFileName: string; mimeType: string } | null = null

    try {
      const fileBuffer = Buffer.from(await file.arrayBuffer())
      const sanitized = file.name.replace(/[^\w.\-]+/g, "_")
      const storagePath = `${user.$id}/${Date.now()}-${sanitized}`

      const uploaded = await storage.createFile(
        appwriteConfig.bucketId,
        ID.unique(),
        new File([fileBuffer], file.name, { type: file.type }),
      )

      storageMeta = {
        storageBucket: appwriteConfig.bucketId,
        storagePath: uploaded.$id,
        originalFileName: file.name,
        mimeType: file.type,
      }
    } catch (err) {
      console.warn("Storage upload failed, continuing without file:", err instanceof Error ? err.message : err)
    }

    const cvData = {
      personalInfo: {
        fullName: "",
        email: user.email || "",
        phone: "",
        summary: "",
      },
      education: [],
      experience: [],
      skills: [],
      languages: [],
      ...(storageMeta || {}),
    }

    const doc = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.collectionId,
      ID.unique(),
      {
        user_id: user.$id,
        data: JSON.stringify(cvData),
      },
    )

    return NextResponse.json({
      success: true,
      message: "CV uploaded successfully",
      cv: {
        id: doc.$id,
        ...cvData,
        createdAt: doc.$createdAt,
        updatedAt: doc.$updatedAt,
        ...(storageMeta || {}),
      },
      storageStatus: storageMeta ? "saved" : "skipped",
    })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json(
      { error: `Internal server error: ${error instanceof Error ? error.message : "Unknown error"}` },
      { status: 500 },
    )
  }
}

export async function GET() {
  return NextResponse.json({ message: "CV upload endpoint" })
}
