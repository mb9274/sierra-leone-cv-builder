import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"
import { CVData } from "@/lib/types"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get("file") as File
    
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Validate file type and size
    const allowedTypes = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"]
    const maxSize = 5 * 1024 * 1024 // 5MB

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: "Invalid file type. Only PDF, DOC, and DOCX files are allowed" }, { status: 400 })
    }

    if (file.size > maxSize) {
      return NextResponse.json({ error: "File too large. Maximum size is 5MB" }, { status: 400 })
    }

    // For now, we'll simulate CV extraction
    // In a real implementation, you'd use a PDF parser library like pdf-parse or a service like Google Cloud Vision API
    const buffer = await file.arrayBuffer()
    
    // Simulate CV data extraction from file
    const extractedCV: CVData = {
      id: `cv-${Date.now()}`,
      personalInfo: {
        fullName: "Uploaded from: " + file.name,
        email: user.email || "",
        phone: "",
        location: "",
        summary: `CV uploaded from ${file.name} on ${new Date().toLocaleDateString()}`
      },
      education: [],
      experience: [],
      skills: [],
      languages: [],
      createdAt: new Date(),
      updatedAt: new Date()
    }

    // Save to database
    const { error } = await supabase
      .from('cvs')
      .insert({
        user_id: user.id,
        data: extractedCV
      })

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ error: "Failed to save CV" }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true, 
      message: "CV uploaded successfully",
      cv: extractedCV
    })

  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ message: "CV upload endpoint" })
}
