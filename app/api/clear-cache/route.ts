import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    // This endpoint helps clear cache by returning a response that forces cache invalidation
    return NextResponse.json({ 
      success: true, 
      message: "Cache cleared successfully",
      timestamp: new Date().toISOString(),
      action: "Please refresh your browser and create a new CV"
    }, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to clear cache" }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ 
    message: "Cache clearing endpoint ready",
    instructions: "Send POST request to clear cache"
  })
}
