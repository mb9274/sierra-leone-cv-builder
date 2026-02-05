import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { prompt, context, type, action, cvData, apiKey: providedApiKey } = await request.json()

    const apiKey = process.env.GEMINI_API_KEY || providedApiKey

    if (!apiKey) {
      console.log("[v0] Gemini API key not found, using template fallback")

      if (action === "generate_cover_letter") {
        const fallbackLetter = `Dear Hiring Manager,

I am writing to express my strong interest in the ${prompt.split('\n')[0] || 'position'} at your company. With my background in ${cvData.experience?.[0]?.position || 'the field'}, I am confident that I would be a valuable asset to your team.

My experience at ${cvData.experience?.[0]?.company || 'my previous company'} has equipped me with strong skills in ${cvData.skills?.slice(0, 3).join(", ") || "professional communication and problem solving"}. I am impressed by your company's reputation and would welcome the opportunity to contribute my skills to your projects.

Thank you for your time and consideration. I look forward to hearing from you.

Sincerely,
${cvData.personalInfo?.fullName || "Your Name"}`

        return NextResponse.json({ coverLetter: fallbackLetter, fallback: true })
      }

      if (action === "mock_interview") {
        if (prompt === "start") {
          return NextResponse.json({
            questions: [
              "Could you tell me about your background and experience?",
              "What are your greatest professional strengths?",
              "Why are you interested in this position?",
              "Where do you see yourself in five years?",
              "Do you have any questions for us?"
            ],
            fallback: true
          })
        }
        return NextResponse.json({
          message: "That's a great answer. Can you tell me more about a specific challenge you faced in your previous role?",
          fallback: true
        })
      }

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
    } else if (action === "generate_cover_letter") {
      const cvText = `
Name: ${cvData.personalInfo?.fullName}
Summary: ${cvData.personalInfo?.summary}
Experience: ${cvData.experience?.map((e: any) => `${e.position} at ${e.company} (${e.description})`).join("; ")}
Skills: ${cvData.skills?.join(", ")}
`
      const coverLetterPrompt = `
You are an expert career coach from Sierra Leone. 
Write a highly professional and tailored cover letter based on the following:

USER CV DATA:
${cvText}

JOB DETAILS:
${prompt}

INSTRUCTIONS:
1. Use a professional, confident, and polite tone.
2. Highlight relevant skills and experiences from the CV that match the job details.
3. Keep it within 300-400 words.
4. Use standard cover letter layout (Salutation, Introduction, Body Paragraphs, Conclusion, Sign-off).
5. Ensure it feels local to the Sierra Leonean job market (e.g., formal and respectful).

RETURN ONLY THE COVER LETTER TEXT.`

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: coverLetterPrompt }] }],
          }),
        }
      )

      if (!response.ok) throw new Error(`Gemini API error: ${response.statusText}`)
      const data = await response.json()
      const coverLetter = data.candidates?.[0]?.content?.parts?.[0]?.text || ""
      return NextResponse.json({ coverLetter })

    } else if (action === "mock_interview") {
      const cvText = `
Name: ${cvData.personalInfo?.fullName}
Experience: ${cvData.experience?.map((e: any) => `${e.position} at ${e.company}`).join(", ")}
Skills: ${cvData.skills?.join(", ")}
`
      let interviewPrompt = ""
      if (prompt === "start") {
        interviewPrompt = `
You are an HR Manager conducting a mock interview for the following candidate:
${cvText}

INSTRUCTIONS:
1. Generate 5 challenging but fair interview questions based on their experience and skills.
2. Return the questions as a JSON array of strings.

RETURN ONLY VALID JSON:
{ "questions": ["Question 1", "Question 2", ...] }`
      } else {
        interviewPrompt = `
You are an HR Manager conducting a mock interview.
Candidate CV: ${cvText}
User Response: "${prompt}"

INSTRUCTIONS:
1. Provide briefly constructive feedback on their response.
2. Then ask the NEXT relevant follow-up question.
3. Be professional and encouraging.

RETURN THE FEEDBACK AND NEXT QUESTION AS PLAIN TEXT.`
      }

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: interviewPrompt }] }],
          }),
        }
      )

      if (!response.ok) throw new Error(`Gemini API error: ${response.statusText}`)
      const data = await response.json()
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || ""

      if (prompt === "start") {
        try {
          // Clean possible markdown
          let jsonStr = text
          if (jsonStr.includes("```json")) jsonStr = jsonStr.split("```json")[1].split("```")[0]
          else if (jsonStr.includes("```")) jsonStr = jsonStr.split("```")[1].split("```")[0]
          return NextResponse.json(JSON.parse(jsonStr.trim()))
        } catch (e) {
          return NextResponse.json({ questions: ["Tell me about yourself.", "Why should we hire you?"] })
        }
      }

      return NextResponse.json({ message: text })
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
