import { NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { createClient } from "@/lib/supabase/server"
import { ApiResponse, handleApiError, withAuth } from "@/lib/api-utils"
import { normalizeCvRecord } from "@/lib/cv-storage"

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params

    return withAuth(async (user) => {
      const supabase = createAdminClient()

      const { data, error } = await supabase
        .from("cvs")
        .select("*")
        .eq("id", id)
        .eq("user_id", user.id)
        .single()

      if (error || !data) {
        return ApiResponse.notFound("CV not found")
      }

      const cv = normalizeCvRecord(data)
      if (!cv.storageBucket || !cv.storagePath) {
        return ApiResponse.error("No stored original file found", 404, "NOT_FOUND")
      }

      const signed = await supabase.storage.from(cv.storageBucket).createSignedUrl(cv.storagePath, 60 * 30)
      if (signed.error || !signed.data?.signedUrl) {
        return ApiResponse.error("Failed to create file link", 500, "STORAGE_ERROR", signed.error?.message)
      }

      return NextResponse.json({
        url: signed.data.signedUrl,
        bucket: cv.storageBucket,
        path: cv.storagePath,
        fileName: cv.originalFileName || data.originalFileName || "original-file",
      })
    }, createClient)
  } catch (error) {
    return handleApiError(error)
  }
}
