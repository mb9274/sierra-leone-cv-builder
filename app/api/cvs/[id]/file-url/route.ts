import { NextResponse } from "next/server"
import { ApiResponse, handleApiError, withAuth } from "@/lib/api-utils"
import { normalizeCvRecord } from "@/lib/cv-storage"
import { createAdminClient, Query } from "@/lib/appwrite/server"
import { appwriteConfig } from "@/lib/appwrite/config"

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params

    return withAuth(async (user) => {
      const { databases, storage } = await createAdminClient()

      const result = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.collectionId,
        [Query.equal("user_id", user.$id), Query.limit(100)],
      )

      const doc = result.documents.find((d) => d.$id === id)
      if (!doc) return ApiResponse.notFound("CV not found")

      const cv = normalizeCvRecord({
        id: doc.$id,
        data: typeof doc.data === "string" ? JSON.parse(doc.data) : doc.data,
        created_at: doc.$createdAt,
        updated_at: doc.$updatedAt,
      })

      if (!cv.storageBucket || !cv.storagePath) {
        return ApiResponse.error("No stored original file found", 404, "NOT_FOUND")
      }

      try {
        const result = await storage.getFileDownload(cv.storageBucket, cv.storagePath)
        const presignedUrl = `${appwriteConfig.endpoint}/storage/buckets/${cv.storageBucket}/files/${cv.storagePath}/download?project=${appwriteConfig.projectId}`

        return NextResponse.json({
          url: presignedUrl,
          bucket: cv.storageBucket,
          path: cv.storagePath,
          fileName: cv.originalFileName || "original-file",
        })
      } catch {
        return ApiResponse.error("Failed to create file link", 500, "STORAGE_ERROR")
      }
    })
  } catch (error) {
    return handleApiError(error)
  }
}
