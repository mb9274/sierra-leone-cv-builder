import { NextRequest, NextResponse } from "next/server"
import { sessionCookieName } from "@/lib/appwrite/config"
import { getSessionSecret } from "@/lib/appwrite/server"
import { Client, Account } from "node-appwrite"
import { appwriteConfig } from "@/lib/appwrite/config"

export async function POST(request: NextRequest) {
  try {
    const secret = await getSessionSecret()

    if (secret) {
      const client = new Client()
        .setEndpoint(appwriteConfig.endpoint)
        .setProject(appwriteConfig.projectId)
        .setSession(secret)

      const account = new Account(client)
      await account.deleteSession("current").catch(() => {})
    }

    const response = NextResponse.json({ ok: true })
    response.cookies.delete(sessionCookieName())
    return response
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to sign out."
    return NextResponse.json({ error: { message } }, { status: 500 })
  }
}
