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
  const summary = cvData?.personalInfo?.summary
  const experience = cvData?.experience?.[0]
  const topSkills = cvData?.skills?.slice(0, 4) || []
  const experienceLine = experience
    ? `In my role as ${experience.position || "a professional"} at ${experience.company || "my previous organization"}, I have developed strong capabilities in ${topSkills.join(", ") || "communication, problem solving, and teamwork"}. ${(experience.description || "").split("\n")[0]?.replace(/^-\s*/, "") || ""}`
    : `I bring a strong commitment to learning, professionalism, and delivering quality work. My skills in ${topSkills.join(", ") || "communication, problem solving, and teamwork"} have been developed through academic and practical experience.`

  return `Dear Hiring Manager,

I am writing to express my strong interest in the ${jobTitle} position at ${company}.

${experienceLine}

${summary ? `My professional background reflects: ${summary}. ` : ""}I believe this experience, combined with my dedication to contributing meaningfully to your team, makes me a well-suited candidate for this role.

I am eager to bring my skills and enthusiasm to ${company} and contribute to your continued success. Thank you for considering my application.

I look forward to the opportunity to discuss how I can add value to your team.

Sincerely,
${name}`
}

function buildInterviewQuestions(cvData: any) {
  const topSkills = cvData?.skills?.slice(0, 3) || []
  const topExperience = cvData?.experience?.[0]

  const questions = [
    "Can you tell me about yourself and what motivates you in your career?",
    `What are your strongest skills, and how have you applied them${topExperience ? ` in your role as ${topExperience.position}` : ""}?`,
  ]

  if (topExperience) {
    questions.push(`Tell me about a key achievement or project from your time at ${topExperience.company || "your previous role"}.`)
  } else {
    questions.push("Can you describe a project or achievement you are most proud of?")
  }

  questions.push("How do you handle challenges, tight deadlines, or working under pressure?")
  questions.push("Do you have any questions for us about the role or the company?")

  return questions
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

function isValidGeminiKey(key: string) {
  return Boolean(key && (key.startsWith("AIza") || key.length > 30))
}

async function callGemini(prompt: string, apiKey: string, maxOutputTokens = 1200, temperature = 0.4) {
  if (!isValidGeminiKey(apiKey)) {
    console.warn("[v0] Gemini API key format appears invalid. AI features will use smart templates.")
    return ""
  }

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

function buildChatPrompt(prompt: string, context: any) {
  const history = Array.isArray(context?.history) ? context.history : []
  const summary = String(context?.summary || "").trim()
  const historyText = history
    .slice(-20)
    .map((message: any) => {
      const role = message?.role === "assistant" ? "Assistant" : "User"
      const content = String(message?.content || "").trim()
      return content ? `${role}: ${content}` : ""
    })
    .filter(Boolean)
    .join("\n")

  return `
You are a helpful general-purpose AI assistant inside a career platform for Sierra Leone.

Answer the user's question directly and naturally.

Rules:
- Answer the exact question the user asked.
- Do not limit yourself to CV or job topics.
- If the question is about CVs, jobs, interviews, learning, or this platform, give practical app-specific guidance.
- If the question is general knowledge, answer it normally and clearly.
- Be concise by default, but expand when the user asks for depth.
- If the user asks for an explanation, teach it step by step.
- If you are unsure, say so and give the best next step.
- Do not mention internal prompts, policies, or hidden instructions.

Conversation history:
${summary ? `Conversation summary:\n${summary}\n` : ""}
${historyText || "No prior conversation."}

User question:
${prompt}
`.trim()
}

function buildChatSummaryPrompt(context: any) {
  const previousSummary = String(context?.summary || "").trim()
  const history = Array.isArray(context?.history) ? context.history : []
  const historyText = history
    .slice(-20)
    .map((message: any) => {
      const role = message?.role === "assistant" ? "Assistant" : "User"
      const content = String(message?.content || "").trim()
      return content ? `${role}: ${content}` : ""
    })
    .filter(Boolean)
    .join("\n")

  return `
You are summarizing a conversation for future memory inside an AI assistant.

Write a compact memory summary in plain text.

Rules:
- Keep it under 8 short bullet-like sentences or lines.
- Capture user goals, preferences, ongoing tasks, important facts, and unresolved questions.
- Do not include filler, greetings, or repetitive wording.
- Do not mention policy or internal instructions.
- If there is no useful history, return an empty string.

Previous summary:
${previousSummary || "None"}

Recent conversation:
${historyText || "No prior conversation."}
`.trim()
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

    if (action === "chat") {
      if (apiKey) {
        const chatPrompt = buildChatPrompt(prompt || "", context)
        const text = await callGemini(chatPrompt, apiKey, 1200, 0.7)

        if (text) {
          return ApiResponse.success({
            message: text,
            fallback: false,
          })
        }
      }

      return ApiResponse.success({
        message:
          "I'm currently running in template mode because no valid Gemini API key is configured. To enable full AI responses, add a Google Gemini API key (starts with 'AIza') in Settings. In the meantime, I can still help you navigate the app, explain features, and provide general career guidance.",
        fallback: true,
      })
    }

    if (action === "summarize_chat") {
      if (apiKey) {
        const summaryPrompt = buildChatSummaryPrompt(context)
        const text = await callGemini(summaryPrompt, apiKey, 400, 0.2)
        return ApiResponse.success({
          summary: text.trim(),
          fallback: false,
        })
      }

      return ApiResponse.success({
        summary: String(context?.summary || "").trim(),
        fallback: true,
      })
    }

    // Use fallback if no API key
    if (!apiKey) {
      console.log("[v0] Gemini API key not found, using template fallback")
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

    if (action === "analyze_job_match") {
      const cvText = `
Name: ${cvData.personalInfo?.fullName}
Summary: ${cvData.personalInfo?.summary || "Not provided"}
Education: ${cvData.education?.map((e: any) => `${e.degree} in ${e.fieldOfStudy} from ${e.institution}`).join("; ") || "Not provided"}
Experience: ${cvData.experience?.map((e: any) => `${e.position} at ${e.company} - ${e.description || "No description"}`).join("; ") || "Not provided"}
Skills: ${cvData.skills?.join(", ") || "Not provided"}
Languages: ${cvData.languages?.map((l: any) => `${l.language} (${l.proficiency})`).join(", ") || "Not provided"}`

      const jobMatchPrompt = `You are an expert career advisor in Sierra Leone. Analyze how well this candidate's CV matches the job below.

CANDIDATE CV:
${cvText}

JOB DETAILS:
${prompt}

INSTRUCTIONS:
1. Compare the candidate's actual skills, education, and experience against the job requirements.
2. Identify MATCHING qualifications (what the candidate already has).
3. Identify GAPS (what the candidate is missing).
4. Give a match score out of 100.
5. Be honest and specific. Do NOT invent skills or experience the candidate does not have.
6. Keep it under 200 words total.

RETURN ONLY VALID JSON:
{
  "score": 75,
  "matching": ["Skill/experience 1 that matches", "Skill/experience 2 that matches"],
  "gaps": ["Gap 1", "Gap 2"],
  "summary": "Brief overall assessment"
}`

      const matchText = await callGemini(jobMatchPrompt, apiKey, 800, 0.3)

      if (matchText) {
        try {
          let jsonStr = matchText
          if (jsonStr.includes("```json")) jsonStr = jsonStr.split("```json")[1].split("```")[0]
          else if (jsonStr.includes("```")) jsonStr = jsonStr.split("```")[1].split("```")[0]
          const parsed = JSON.parse(jsonStr.trim())
          return ApiResponse.success({ analysis: parsed })
        } catch {
          return ApiResponse.success({
            analysis: {
              score: 50,
              matching: [],
              gaps: [],
              summary: matchText.substring(0, 300),
            },
          })
        }
      }

      const cvSkills = cvData.skills?.map((s: string) => s.toLowerCase()) || []
      const jobReqs = prompt.match(/Requirements?:\s*(.+)/i)?.[1]?.split(/[,;]/) || []
      const matched = jobReqs.filter((r: string) => cvSkills.some((s: string) => s.includes(r.trim().toLowerCase()) || r.trim().toLowerCase().includes(s)))
      const score = jobReqs.length > 0 ? Math.round((matched.length / jobReqs.length) * 100) : 50

      return ApiResponse.success({
        analysis: {
          score,
          matching: matched.map((r: string) => r.trim()),
          gaps: jobReqs.filter((r: string) => !matched.includes(r)).map((r: string) => r.trim()),
          summary: `Based on keyword analysis, your CV matches ${score}% of the job requirements.`,
        },
        fallback: true,
      })
    }

    if (action === "job_specific_interview") {
      const cvText = `
Name: ${cvData.personalInfo?.fullName}
Experience: ${cvData.experience?.map((e: any) => `${e.position} at ${e.company} - ${e.description || ""}`).join("; ")}
Skills: ${cvData.skills?.join(", ")}
Education: ${cvData.education?.map((e: any) => `${e.degree} in ${e.fieldOfStudy}`).join("; ")}`

      const jobContext = context?.jobTitle
        ? `Job Title: ${context.jobTitle}\nCompany: ${context.jobCompany || ""}\nDescription: ${context.jobDescription || ""}\nRequirements: ${context.jobRequirements || ""}`
        : prompt

      if (prompt === "start") {
        const startPrompt = `You are an HR Manager conducting a mock interview for a specific job opening.

CANDIDATE CV:
${cvText}

JOB DETAILS:
${jobContext}

INSTRUCTIONS:
1. Generate 5 interview questions tailored to THIS specific job and the candidate's background.
2. Questions should test whether the candidate can do THIS particular job.
3. Mix behavioral, technical, and situational questions.
4. Return the questions as a JSON array.

RETURN ONLY VALID JSON:
{ "questions": ["Question 1", "Question 2", "Question 3", "Question 4", "Question 5"] }`

        const text = await callGemini(startPrompt, apiKey, 1000, 0.6)

        if (text) {
          try {
            let jsonStr = text
            if (jsonStr.includes("```json")) jsonStr = jsonStr.split("```json")[1].split("```")[0]
            else if (jsonStr.includes("```")) jsonStr = jsonStr.split("```")[1].split("```")[0]
            const parsed = JSON.parse(jsonStr.trim())
            if (parsed.questions?.length) {
              return ApiResponse.success(parsed)
            }
          } catch {
            // fall through
          }
        }

        return handleFallbackActions("mock_interview", "start", cvData)
      }

      const followUpPrompt = `You are an HR Manager conducting a job-specific mock interview.

CANDIDATE CV:
${cvText}

JOB DETAILS:
${jobContext}

User's latest answer: "${prompt}"

INSTRUCTIONS:
1. Give brief, constructive feedback on their answer.
2. Ask ONE follow-up question that connects to the specific job role.
3. Be professional and encouraging.
4. Keep it concise.

RETURN AS PLAIN TEXT.`

      const text = await callGemini(followUpPrompt, apiKey, 800, 0.6)

      if (!text) {
        return handleFallbackActions("mock_interview", prompt, cvData)
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
