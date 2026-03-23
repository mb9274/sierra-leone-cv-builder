import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = await createClient()
    
    // Try to get any CV to see the structure
    const { data: testData, error: testError } = await supabase
      .from('cvs')
      .select('*')
      .limit(1)
    
    if (testError) {
      return NextResponse.json({ 
        error: testError,
        message: "Database query failed"
      })
    }
    
    return NextResponse.json({
      message: "Database structure check",
      sampleData: testData,
      columns: testData && testData.length > 0 ? Object.keys(testData[0]) : []
    })
    
  } catch (error) {
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Unknown error',
      message: "Debug endpoint failed"
    })
  }
}
