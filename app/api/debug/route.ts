import { createAdminClient, Query, ID } from "@/lib/appwrite/server"
import { NextResponse } from "next/server"
import { appwriteConfig } from "@/lib/appwrite/config"
import { getAuthenticatedUser } from "@/lib/appwrite/server"

export async function GET() {
  try {
    const user = await getAuthenticatedUser()

    if (!user) {
      return NextResponse.json({ user: null }, { status: 401 })
    }

    const { databases } = await createAdminClient()

    const result = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.collectionId,
      [Query.equal("user_id", user.$id), Query.limit(1)],
    )

    return NextResponse.json({
      message: "Database connection check",
      userId: user.$id,
      cvCount: result.total,
      hasData: result.documents.length > 0,
      columns: result.documents[0] ? Object.keys(result.documents[0]) : [],
    })
  } catch (error) {
    return NextResponse.json({
      error: error instanceof Error ? error.message : "Unknown error",
      message: "Debug endpoint failed",
    })
  }
}
