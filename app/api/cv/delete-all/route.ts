import { createAdminClient, Query } from "@/lib/appwrite/server"
import { NextRequest, NextResponse } from "next/server"
import { appwriteConfig } from "@/lib/appwrite/config"
import { getAuthenticatedUser } from "@/lib/appwrite/server"

export async function DELETE(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { databases } = await createAdminClient()

    const result = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.collectionId,
      [Query.equal("user_id", user.$id), Query.limit(100)],
    )

    for (const doc of result.documents) {
      await databases.deleteDocument(
        appwriteConfig.databaseId,
        appwriteConfig.collectionId,
        doc.$id,
      )
    }

    return NextResponse.json({
      success: true,
      message: "All CVs deleted successfully. You can now create a new one!",
    })
  } catch (error) {
    console.error("Delete CVs error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ message: "Delete all CVs endpoint" })
}
