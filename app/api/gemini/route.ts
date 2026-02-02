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
      const educationText = cvData.education?.length
        ? cvData.education.map((edu: any) => `- ${edu.degree} in ${edu.fieldOfStudy} from ${edu.institution} (${edu.startDate} - ${edu.endDate})`).join("\n")
        : "No education listed"

      const experienceText = cvData.experience?.length
        ? cvData.experience.map((exp: any) => `- ${exp.position} at ${exp.company} (${exp.startDate} - ${exp.endDate})\n  Description: ${exp.description}`).join("\n\n")
        : "No work experience listed"

      const cvEnhancementPrompt = `
You are an expert CV writer specializing in the Sierra Leonean and West African job market. 
Professionalize and enhance the following CV data.

PERSONAL INFORMATION:
- Name: ${cvData.personalInfo?.fullName || "Not provided"}
- Age: ${cvData.personalInfo?.age || "Not provided"}
- Location: ${cvData.personalInfo?.location || "Sierra Leone"}
- Current Summary: ${cvData.personalInfo?.summary || "None"}

EDUCATION:
${educationText}

EXPERIENCE:
${experienceText}

SKILLS:
${cvData.skills?.join(", ") || "None listed"}

LANGUAGES:
${cvData.languages?.map((lang: any) => `${lang.language} (${lang.proficiency})`).join(", ") || "None listed"}

INSTRUCTIONS:
1. REWRITE the Professional Summary to be impactful, action-oriented, and professional. 
   - Tailor it to the user's specific background.
   - Use strong verbs and avoid clichés.
   - MUST BE 2-4 sentences.
2. ENHANCE Work Experience. 
   - If descriptions are short or plain, expand them into 3-4 professional bullet points using action verbs.
   - Ensure the position titles sound professional.
3. OPTIMIZE Skills.
   - Suggest relevant technical and soft skills valued in Sierra Leone.
4. FORMAT: Return ONLY a JSON object.

CRITICAL: Do not use placeholders like "[Name]" or "[Company]". If information is missing, use general professional language.

RETURN ONLY VALID JSON:
{
  "summary": "...",
  "experience": [
    {
      "id": "original_id",
      "position": "...",
      "company": "...",
      "location": "...",
      "startDate": "...",
      "endDate": "...",
      "current": boolean,
      "description": "bulleted list of achievements"
    }
  ],
  "skills": ["skill1", "skill2", ...]
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
              temperature: 0.4, // Lower temperature for more consistent JSON
              maxOutputTokens: 2000,
            },
          }),
        },
      )

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.statusText}`)
      }

      const data = await response.json()
      let generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text || ""

      // Clean up markdown code blocks if present
      if (generatedText.includes("```json")) {
        generatedText = generatedText.split("```json")[1].split("```")[0]
      } else if (generatedText.includes("```")) {
        generatedText = generatedText.split("```")[1].split("```")[0]
      }

      // Try to parse JSON response
      try {
        const enhancedData = JSON.parse(generatedText.trim())
        return NextResponse.json(enhancedData)
      } catch (e) {
        console.error("[v0] JSON parsing error:", e, generatedText)
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
      const eduStr = context.education?.length
        ? context.education.map((e: any) => `${e.degree} in ${e.fieldOfStudy}`).join(", ")
        : "Not specified"
      const expStr = context.experience?.length
        ? context.experience.map((e: any) => e.position).join(", ")
        : "No professional experience"

      fullPrompt = `Generate a 2-3 sentence professional CV summary for a professional with:
Education: ${eduStr}
Experience Skills: ${expStr}
Current Skills: ${context.skills?.join?.(", ") || "General skills"}

Make it compelling and suitable for the Sierra Leonean job market.`
    } else if (type === "experience") {
      fullPrompt = `Professionalize these responsibilities for a ${context.position} at ${context.company}:
${context.responsibilities || "General duties"}

Format as 3-4 impactful bullet points starting with action verbs. Relevant to Sierra Leone.`
    } else if (type === "skills") {
      fullPrompt = `Suggest 10 professional skills (hard and soft) for:
Field: ${context.fieldOfStudy || "General"}
Roles: ${context.experience || "Entry level"}

Return only skill names, one per line.`
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
