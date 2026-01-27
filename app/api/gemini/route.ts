import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { prompt, context, type, action, cvData, apiKey: providedApiKey } = await request.json()

    const apiKey = process.env.GEMINI_API_KEY || providedApiKey

    if (!apiKey) {
      // Return friendly message with fallback templates
      console.log("[v0] Gemini API key not found, using template fallback")
      return NextResponse.json(
        {
          error: "Using smart templates instead of AI",
          fallback: true,
        },
        { status: 200 },
      )
    }

    if (action === "enhance_cv") {
      const cvEnhancementPrompt = `You are a professional CV writer for Sierra Leone. Enhance this CV with professional language and impactful descriptions.

**Personal Information:**
Name: ${cvData.personalInfo?.fullName}
Age: ${cvData.personalInfo?.age} years
Location: ${cvData.personalInfo?.location}
Current Summary: ${cvData.personalInfo?.summary}

**Education:**
${cvData.education?.map((edu: any) => `- ${edu.degree} in ${edu.fieldOfStudy} from ${edu.institution}`).join("\n")}

**Experience:**
${cvData.experience?.map((exp: any) => `- ${exp.position} at ${exp.company}\n  Description: ${exp.description}`).join("\n\n")}

**Current Skills:**
${cvData.skills?.join(", ")}

**Languages:**
${cvData.languages?.map((lang: any) => `${lang.language} (${lang.proficiency})`).join(", ")}

Please enhance this CV by:
1. Rewriting the professional summary to be more impactful and tailored to Sierra Leone employers
2. Improving each work experience description with strong action verbs and quantifiable achievements
3. Suggesting 3-5 additional relevant skills based on their background

Return the response in this JSON format:
{
  "summary": "enhanced professional summary",
  "experience": [
    {
      "id": "same as input",
      "company": "same as input",
      "position": "same as input",
      "location": "same as input",
      "startDate": "same as input",
      "endDate": "same as input",
      "current": same as input,
      "description": "enhanced description with bullet points"
    }
  ],
  "skills": ["existing skills plus 3-5 new suggestions"]
}`

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: cvEnhancementPrompt,
                  },
                ],
              },
            ],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 2000,
            },
          }),
        },
      )

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.statusText}`)
      }

      const data = await response.json()
      const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text || ""

      // Try to parse JSON response
      try {
        const enhancedData = JSON.parse(generatedText)
        return NextResponse.json(enhancedData)
      } catch {
        // If not valid JSON, return as is
        return NextResponse.json({
          summary: generatedText.split("\n")[0],
          experience: cvData.experience,
          skills: cvData.skills,
        })
      }
    }

    // Build context-aware prompt
    let fullPrompt = ""

    if (type === "summary") {
      fullPrompt = `Generate a professional CV summary for someone with the following details:
Education: ${context.education || "Not specified"}
Experience: ${context.experience || "No experience"}
Skills: ${context.skills || "General skills"}

Write a 2-3 sentence professional summary in third person that highlights their strengths and career goals. Make it specific to Sierra Leone job market.`
    } else if (type === "experience") {
      fullPrompt = `Generate 3-5 professional bullet points for this work experience:
Position: ${context.position || "Not specified"}
Company: ${context.company || "Not specified"}
Responsibilities: ${context.responsibilities || "General duties"}

Format as bullet points starting with action verbs. Include metrics where possible. Make it relevant to Sierra Leone employers.`
    } else if (type === "skills") {
      fullPrompt = `Suggest 8-10 relevant professional skills for someone with:
Field of Study: ${context.fieldOfStudy || "General"}
Experience: ${context.experience || "Entry level"}

Return only the skill names, one per line. Focus on skills valued in Sierra Leone job market.`
    } else {
      fullPrompt = prompt
    }

    // Call Gemini API
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: fullPrompt,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 500,
          },
        }),
      },
    )

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.statusText}`)
    }

    const data = await response.json()
    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text || ""

    return NextResponse.json({ text: generatedText, success: true })
  } catch (error) {
    console.error("[v0] Gemini API error:", error)
    return NextResponse.json(
      {
        error: "Failed to generate AI content. Using fallback suggestions.",
        fallback: true,
      },
      { status: 200 },
    )
  }
}
