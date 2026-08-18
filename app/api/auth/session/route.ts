import { NextResponse } from "next/server"
import { getAuthenticatedUser } from "@/lib/appwrite/server"

export async function GET() {
  try {
    const user = await getAuthenticatedUser()

    if (!user) {
      return NextResponse.json({ user: null }, { status: 401 })
    }

    return NextResponse.json({
      user: {
        id: user.$id,
        email: user.email || "",
        name: user.name || user.email || "Signed in user",
      },
    })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to read session" },
      { status: 500 },
    )
  }
}
