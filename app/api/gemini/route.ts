import { type NextRequest, NextResponse } from "next/server"
import { ApiResponse, handleApiError } from "@/lib/api-utils"

function extractJobTitle(prompt: string) {
  const titleMatch = prompt.match(/Job Title:\s*(.+)/i)
  if (titleMatch?.[1]) return titleMatch[1].trim()

  const positionMatch = prompt.match(/Position:\s*(.+)/i)
  if (positionMatch?.[1]) return positionMatch[1].trim()

  const firstLine = prompt.split("\n").map((line) => line.trim()).find(Boolean)
  return firstLine || "the role"
}

function buildCoverLetterFallback(prompt: string, cvData: any) {
  const jobTitle = extractJobTitle(prompt)
  const company =
    prompt.match(/Company:\s*(.+)/i)?.[1]?.trim() ||
    prompt.match(/at\s+(.+?)(?:\n|$)/i)?.[1]?.trim() ||
    "your company"
  const name = cvData?.personalInfo?.fullName || "Your Name"
  const summary = cvData?.personalInfo?.summary || "my professional background"
  const experience = cvData?.experience?.[0]
  const experienceLine = experience
    ? `My background as ${experience.position || "a professional"} at ${experience.company || "my previous company"} has helped me build practical experience in ${cvData?.skills?.slice(0, 3).join(", ") || "communication, problem solving, and teamwork"}.`
    : `I bring a strong commitment to learning, professionalism, and delivering quality work in ${cvData?.skills?.slice(0, 3).join(", ") || "communication, problem solving, and teamwork"}.`

  return `Dear Hiring Manager,

I am writing to express my interest in the ${jobTitle} position at ${company}.

${experienceLine}

My professional summary reflects ${summary}. I believe this background, combined with my motivation to contribute, makes me a strong candidate for this role.

Thank you for your time and consideration. I would welcome the opportunity to discuss how I can contribute to your team.

Sincerely,
${name}`
}

function buildInterviewQuestions(cvData: any) {
  const fullName = cvData?.personalInfo?.fullName || "the candidate"
  const topSkills = cvData?.skills?.slice(0, 3) || []
  const topExperience = cvData?.experience?.[0]

  return [
    `Can you tell me about yourself and what makes you a good fit for this role, ${fullName}?`,
    `How have your skills in ${topSkills.join(", ") || "communication and teamwork"} helped you in past roles?`,
    topExperience
      ? `Tell me about your experience as ${topExperience.position} at ${topExperience.company}.`
      : "Can you describe a project or achievement you are most proud of?",
    "How do you handle pressure, deadlines, or difficult challenges at work?",
    "Do you have any questions for us about the role or the company?",
  ]
}

function buildInterviewFollowUp(prompt: string, cvData: any) {
  const lower = prompt.toLowerCase()
  const firstSkill = cvData?.skills?.[0] || "your work"
  const firstRole = cvData?.experience?.[0]?.position || "your role"
  const firstCompany = cvData?.experience?.[0]?.company || "your previous company"
  const name = cvData?.personalInfo?.fullName || "you"

  if (prompt.trim().length < 30) {
    return `Thanks, ${name}. Could you expand on that with one concrete example from ${firstRole} at ${firstCompany}?`
  }

  if (/(example|specific|project|challenge|achievement|result|outcome)/.test(lower)) {
    return "That is a good direction. Can you give one specific example, the result you achieved, and what you learned from it?"
  }

  if (/(strength|strong|skill|skills|competency)/.test(lower)) {
    return `That sounds relevant. Can you give a short example of when you used ${firstSkill} in a real situation?`
  }

  if (/(team|collaborat|group|colleague)/.test(lower)) {
    return "How do you usually handle teamwork when people have different ideas or priorities?"
  }

  if (/(pressure|deadline|urgent|fast-paced)/.test(lower)) {
    return "That helps. How do you stay organized and make decisions when you are under pressure or facing a deadline?"
  }

  if (/(weakness|improve|better|learn)/.test(lower)) {
    return "That is honest. What have you done to improve in that area, and what is different now?"
  }

  return `Thank you. Could you give one specific example from ${firstRole} at ${firstCompany} and explain the outcome?`
}

function cleanGeminiText(text: string) {
  let output = String(text || "").trim()
  if (output.includes("```json")) output = output.split("```json")[1].split("```")[0].trim()
  else if (output.includes("```")) output = output.split("```")[1].split("```")[0].trim()
  return output
}

async function callGemini(prompt: string, apiKey: string, maxOutputTokens = 1200, temperature = 0.4) {
  const models = ["gemini-1.5-flash", "gemini-1.5-pro", "gemini-pro"]

  for (const model of models) {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
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
                  text: prompt,
                },
              ],
            },
          ],
          generationConfig: {
            temperature,
            maxOutputTokens,
          },
        }),
      },
    )

    if (!response.ok) {
      continue
    }

    const data = await response.json()
    const text = cleanGeminiText(data.candidates?.[0]?.content?.parts?.[0]?.text || "")
    if (text) return text
  }

  return ""
}

function handleFallbackActions(action: string, prompt: string, cvData: any) {
  if (action === "generate_cover_letter") {
    return ApiResponse.success({
      coverLetter: buildCoverLetterFallback(prompt, cvData),
      fallback: true,
    })
  }

  if (action === "mock_interview") {
    if (prompt === "start") {
      return ApiResponse.success({
        questions: buildInterviewQuestions(cvData),
        fallback: true
      })
    }
    return ApiResponse.success({
      message: buildInterviewFollowUp(prompt, cvData),
      fallback: true
    })
  }

  return ApiResponse.success({
    error: "Using smart templates instead of AI",
    fallback: true,
  })
}

export async function POST(request: NextRequest) {
  try {
    const { prompt, context, type, action, cvData, apiKey: providedApiKey } = await request.json()

    // Validate required fields
    if (!action) {
      return ApiResponse.error("Action is required", 400, "VALIDATION_ERROR")
    }

    // Validate cvData if provided
    if (cvData && (!cvData.personalInfo || !cvData.personalInfo.fullName)) {
      return ApiResponse.error("Invalid CV data provided", 400, "VALIDATION_ERROR")
    }

    const apiKey = process.env.GEMINI_API_KEY || providedApiKey

    // Use fallback if no API key or for specific actions
    if (!apiKey || (action !== "generate_cover_letter" && action !== "mock_interview")) {
      console.log("[v0] Gemini API key not found or unsupported action, using template fallback")
      return handleFallbackActions(action, prompt, cvData)
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
      const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text || ""

      // Clean up markdown code blocks if present
      let jsonString = generatedText.trim()
      if (jsonString.includes("```json")) {
        jsonString = jsonString.split("```json")[1].split("```")[0].trim()
      } else if (jsonString.includes("```")) {
        jsonString = jsonString.split("```")[1].split("```")[0].trim()
      }

      // Final attempt to clean up any leading/trailing non-JSON characters
      if (jsonString.includes("{")) {
        jsonString = jsonString.substring(jsonString.indexOf("{"), jsonString.lastIndexOf("}") + 1)
      }

      // Try to parse JSON response
      try {
        const enhancedData = JSON.parse(jsonString)
        return ApiResponse.success(enhancedData)
      } catch (e) {
        console.error("[v0] JSON parsing error:", e, jsonString)
        // If not valid JSON, but has something that looks like a summary, try to extract it
        const summaryMatch = generatedText.match(/"summary":\s*"([^"]*)"/)
        return ApiResponse.success({
          summary: summaryMatch ? summaryMatch[1] : generatedText.split("\n")[0].substring(0, 200),
          experience: cvData.experience || [],
          skills: cvData.skills || [],
          fallback: true,
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
      const coverLetter = await callGemini(coverLetterPrompt, apiKey, 1400, 0.5)
      if (!coverLetter) {
        return handleFallbackActions(action, prompt, cvData)
      }
      return ApiResponse.success({ coverLetter })

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
2. Then ask ONE natural follow-up question that connects to their answer.
3. Avoid repeating the same phrasing such as "I do not get you clear" or "tell me more" unless absolutely necessary.
4. If the answer is short or vague, ask for a concrete example, outcome, or lesson learned.
5. Keep the response concise, professional, and conversational.
3. Be professional and encouraging.

RETURN THE FEEDBACK AND NEXT QUESTION AS PLAIN TEXT.`
      }
      const text = await callGemini(interviewPrompt, apiKey, 1000, 0.6)

      if (prompt === "start") {
        try {
          if (text) {
            let jsonStr = text
            if (jsonStr.includes("```json")) jsonStr = jsonStr.split("```json")[1].split("```")[0]
            else if (jsonStr.includes("```")) jsonStr = jsonStr.split("```")[1].split("```")[0]
            const parsed = JSON.parse(jsonStr.trim())
            if (parsed.questions?.length) {
              return ApiResponse.success(parsed)
            }
          }

          return handleFallbackActions(action, prompt, cvData)
        } catch (e) {
          return handleFallbackActions(action, prompt, cvData)
        }
      }

      if (!text) {
        return handleFallbackActions(action, prompt, cvData)
      }

      return ApiResponse.success({ message: text })
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

    return ApiResponse.success({ text: generatedText, success: true })
  } catch (error) {
    console.error("[v0] Gemini API error:", error)
    return ApiResponse.error("Failed to generate AI content. Using fallback suggestions.", 500, "AI_SERVICE_ERROR", { fallback: true })
  }
}
