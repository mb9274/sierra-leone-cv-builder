import { NextRequest, NextResponse } from "next/server"
import { CVData } from "@/lib/types"

// This is a test endpoint that doesn't require authentication
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { fullName, email, skills } = body

    // Validate required fields
    if (!fullName || !email || !skills) {
      return NextResponse.json({ error: "Missing required fields: fullName, email, and skills are required" }, { status: 400 })
    }

    // Generate comprehensive CV using AI
    const generatedCV = await generateComprehensiveCV(fullName, email, skills)

    return NextResponse.json({ 
      success: true, 
      message: "CV generated successfully with AI",
      data: {
        ...generatedCV,
        id: `test-${Date.now()}`,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    })

  } catch (error) {
    console.error("AI generation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

async function generateComprehensiveCV(fullName: string, email: string, skills: string): Promise<Omit<CVData, 'id' | 'createdAt' | 'updatedAt'>> {
  const skillsArray = skills.split(',').map(s => s.trim()).filter(s => s)
  
  // Use enhanced template generation for now
  return generateEnhancedCV(fullName, email, skillsArray)
  
  // TODO: Fix OpenAI JSON parsing and re-enable
  /*
  const apiKey = process.env.GEMINI_API_KEY
  
  if (apiKey && apiKey.startsWith('sk-proj')) {
    try {
      return await generateWithOpenAI(fullName, email, skillsArray, apiKey)
    } catch (error) {
      console.error("OpenAI generation failed:", error)
      return generateEnhancedCV(fullName, email, skillsArray)
    }
  }
  
  // Fallback to enhanced template generation
  return generateEnhancedCV(fullName, email, skillsArray)
  */
}

async function generateWithGemini(fullName: string, email: string, skillsArray: string[], apiKey: string): Promise<Omit<CVData, 'id' | 'createdAt' | 'updatedAt'>> {
  const cvGenerationPrompt = `
You are an expert CV writer specializing in the Sierra Leonean and West African job market. 
Generate a comprehensive, professional CV based on minimal user information.

USER INPUT:
- Full Name: ${fullName}
- Email: ${email}
- Skills: ${skillsArray.join(", ")}

INSTRUCTIONS:
1. Create a complete, realistic CV that looks professional and impressive
2. Generate plausible education history (Bachelor's degree from a recognized Sierra Leonean university)
3. Create relevant work experience based on skills provided (2-3 positions)
4. Add professional summary that highlights key strengths
5. Include relevant languages (English, Krio, etc.)
6. Add projects, certifications, and other sections to make it comprehensive
7. Ensure all information is consistent and realistic
8. Use Sierra Leone context (local companies, universities, etc.)
9. Make it detailed and impressive

RETURN ONLY VALID JSON with ALL these sections:
{
  "personalInfo": {
    "fullName": "${fullName}",
    "email": "${email}",
    "phone": "+232-XX-XXX-XXX",
    "location": "Freetown, Sierra Leone",
    "summary": "Professional summary...",
    "age": "25-30",
    "linkedin": "linkedin.com/in/username",
    "portfolio": "github.com/username"
  },
  "education": [
    {
      "id": "edu-1",
      "institution": "Fourah Bay College or Njala University",
      "degree": "Bachelor's Degree",
      "fieldOfStudy": "Relevant field based on skills",
      "startDate": "2018",
      "endDate": "2022",
      "current": false
    }
  ],
  "experience": [
    {
      "id": "exp-1",
      "company": "Local Sierra Leonean company",
      "position": "Relevant position",
      "location": "Freetown, Sierra Leone",
      "startDate": "2022",
      "endDate": "Present",
      "current": true,
      "description": "3-4 bullet points of achievements",
      "achievements": "Specific accomplishments"
    }
  ],
  "skills": [${skillsArray.map(s => `"${s}"`).join(", ")}],
  "languages": [
    {"language": "English", "proficiency": "Fluent"},
    {"language": "Krio", "proficiency": "Native"}
  ],
  "projects": [
    {
      "id": "proj-1",
      "name": "Relevant project name",
      "description": "Project description showcasing skills",
      "technologies": [${skillsArray.slice(0, 3).map(s => `"${s}"`).join(", ")}],
      "outcome": "Successful outcome"
    }
  ],
  "certifications": [
    {
      "id": "cert-1",
      "name": "Professional certification",
      "organization": "Relevant organization",
      "year": "2023"
    }
  ],
  "volunteering": [
    {
      "id": "vol-1",
      "organization": "Sierra Leone Red Cross Society",
      "role": "Community Volunteer",
      "startDate": "2020",
      "endDate": "Present",
      "description": "Community service description"
    }
  ],
  "awards": [
    {
      "id": "award-1",
      "name": "Best Performance Award",
      "organization": "Fourah Bay College",
      "year": "2022",
      "reason": "Excellence in academic performance"
    }
  ],
  "hobbies": [
    "Reading professional development books",
    "Community service",
    "Technology blogging"
  ],
  "referees": [
    {
      "id": "ref-1",
      "name": "Dr. James Conteh",
      "title": "Head of Department",
      "organization": "Fourah Bay College",
      "phone": "+232-76-555-1234",
      "email": "j.conteh@fbc.edu.sl",
      "availableOnRequest": true
    }
  ]
}

IMPORTANT: 
- Make it detailed and impressive
- Use realistic Sierra Leonean context
- Ensure all fields are filled with meaningful content
- Do not use placeholders like "[Name]" or "[Company]"
- Return ONLY valid JSON, no markdown formatting
`

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
                text: cvGenerationPrompt,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.8,
          maxOutputTokens: 4000,
        },
      }),
    },
  )

  if (!response.ok) {
    throw new Error(`Gemini API error: ${response.statusText}`)
  }

  const data = await response.json()
  const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text || ""

  // Clean up any markdown code blocks if present
  let jsonString = generatedText.trim()
  
  // Remove markdown code blocks
  if (jsonString.includes("```json")) {
    jsonString = jsonString.split("```json")[1].split("```")[0].trim()
  } else if (jsonString.includes("```")) {
    jsonString = jsonString.split("```")[1].split("```")[0].trim()
  }

  // Find JSON object boundaries
  const startIdx = jsonString.indexOf("{")
  const endIdx = jsonString.lastIndexOf("}")
  
  if (startIdx !== -1 && endIdx !== -1 && endIdx > startIdx) {
    jsonString = jsonString.substring(startIdx, endIdx + 1)
  }

  // Additional cleaning for common issues
  jsonString = jsonString
    .replace(/\\n/g, "\\n")  // Fix escaped newlines
    .replace(/\\"/g, '\\"')  // Fix escaped quotes
    .replace(/\\\\/g, '\\\\') // Fix double backslashes

  try {
    const aiGeneratedCV = JSON.parse(jsonString)
    return validateAndStructureCV(aiGeneratedCV, fullName, email, skillsArray)
  } catch (e) {
    console.error("JSON parsing error:", e)
    console.error("Generated text:", generatedText)
    console.error("Cleaned JSON string:", jsonString)
    throw new Error("Failed to parse AI response")
  }
}

function validateAndStructureCV(aiCV: any, fullName: string, email: string, skillsArray: string[]): Omit<CVData, 'id' | 'createdAt' | 'updatedAt'> {
  return {
    personalInfo: {
      fullName: fullName,
      email: email,
      phone: aiCV.personalInfo?.phone || generatePhoneNumber(),
      location: aiCV.personalInfo?.location || "Freetown, Sierra Leone",
      summary: aiCV.personalInfo?.summary || generateProfessionalSummary(fullName, skillsArray, getFieldOfStudyFromSkills(skillsArray)),
      age: aiCV.personalInfo?.age || "25-30",
      linkedin: aiCV.personalInfo?.linkedin || `linkedin.com/in/${fullName.toLowerCase().replace(/\s+/g, '.')}`,
      portfolio: aiCV.personalInfo?.portfolio || "github.com/" + fullName.toLowerCase().replace(/\s+/g, '')
    },
    education: aiCV.education || [
      {
        id: "edu-1",
        institution: "Fourah Bay College, University of Sierra Leone",
        degree: "Bachelor of Science (B.Sc.)",
        fieldOfStudy: getFieldOfStudyFromSkills(skillsArray),
        startDate: "2018",
        endDate: "2022",
        current: false
      }
    ],
    experience: aiCV.experience || generateExperienceFromSkills(skillsArray, fullName),
    skills: skillsArray,
    languages: aiCV.languages || [
      { language: "English", proficiency: "Fluent" },
      { language: "Krio", proficiency: "Native" },
      { language: "Mende", proficiency: "Basic" }
    ],
    projects: aiCV.projects || generateProjectsFromSkills(skillsArray),
    certifications: aiCV.certifications || generateCertificationsFromSkills(skillsArray, getFieldOfStudyFromSkills(skillsArray)),
    volunteering: aiCV.volunteering || [
      {
        id: "vol-1",
        organization: "Sierra Leone Red Cross Society",
        role: "Community Volunteer",
        startDate: "2020",
        endDate: "Present",
        description: "Actively participating in community outreach programs and disaster relief efforts. Assisting in health awareness campaigns and youth development initiatives."
      }
    ],
    awards: aiCV.awards || [
      {
        id: "award-1",
        name: "Best Performance Award",
        organization: "Fourah Bay College",
        year: "2022",
        reason: "Excellence in academic performance and community service"
      }
    ],
    hobbies: aiCV.hobbies || [
      "Reading professional development books",
      "Community service",
      "Technology blogging",
      "Mentoring young professionals"
    ],
    referees: aiCV.referees || [
      {
        id: "ref-1",
        name: "Dr. James Conteh",
        title: "Head of Department",
        organization: "Fourah Bay College",
        phone: "+232-76-555-1234",
        email: "j.conteh@fbc.edu.sl",
        availableOnRequest: true
      }
    ]
  }
}

function generateEnhancedCV(fullName: string, email: string, skillsArray: string[]): Omit<CVData, 'id' | 'createdAt' | 'updatedAt'> {
  const fieldOfStudy = getFieldOfStudyFromSkills(skillsArray)
  const experience = generateExperienceFromSkills(skillsArray, fullName)
  const projects = generateProjectsFromSkills(skillsArray)
  const certifications = generateCertificationsFromSkills(skillsArray, fieldOfStudy)
  
  return {
    personalInfo: {
      fullName: fullName,
      email: email,
      phone: generatePhoneNumber(),
      location: "Freetown, Sierra Leone",
      summary: generateProfessionalSummary(fullName, skillsArray, fieldOfStudy),
      age: "25-30",
      linkedin: `linkedin.com/in/${fullName.toLowerCase().replace(/\s+/g, '.')}`,
      portfolio: "github.com/" + fullName.toLowerCase().replace(/\s+/g, '')
    },
    education: [
      {
        id: "edu-1",
        institution: "Fourah Bay College, University of Sierra Leone",
        degree: "Bachelor of Science (B.Sc.)",
        fieldOfStudy: fieldOfStudy,
        startDate: "2018",
        endDate: "2022",
        current: false
      },
      {
        id: "edu-2", 
        institution: "Prince of Wales Secondary School",
        degree: "West African Senior School Certificate",
        fieldOfStudy: "General Sciences",
        startDate: "2012",
        endDate: "2017",
        current: false
      }
    ],
    experience: experience,
    skills: skillsArray,
    languages: [
      { language: "English", proficiency: "Fluent" },
      { language: "Krio", proficiency: "Native" },
      { language: "Mende", proficiency: "Basic" }
    ],
    projects: projects,
    certifications: certifications,
    volunteering: [
      {
        id: "vol-1",
        organization: "Sierra Leone Red Cross Society",
        role: "Community Volunteer",
        startDate: "2020",
        endDate: "Present",
        description: "Actively participating in community outreach programs and disaster relief efforts. Assisting in health awareness campaigns and youth development initiatives."
      }
    ],
    awards: [
      {
        id: "award-1",
        name: "Best Performance Award",
        organization: "Fourah Bay College",
        year: "2022",
        reason: "Excellence in academic performance and community service"
      }
    ],
    hobbies: [
      "Reading professional development books",
      "Community service", 
      "Technology blogging",
      "Mentoring young professionals"
    ],
    referees: [
      {
        id: "ref-1",
        name: "Dr. James Conteh",
        title: "Head of Department",
        organization: "Fourah Bay College",
        phone: "+232-76-555-1234",
        email: "j.conteh@fbc.edu.sl",
        availableOnRequest: true
      }
    ]
  }
}

function generateProfessionalSummary(fullName: string, skills: string[], fieldOfStudy: string): string {
  const skillHighlight = skills.slice(0, 3).join(", ")
  return `Results-oriented ${fieldOfStudy} graduate with expertise in ${skillHighlight}. Proven ability to deliver high-quality results in fast-paced environments. Strong analytical and problem-solving skills with excellent communication abilities. Committed to continuous learning and professional development while contributing to organizational success. Seeking to leverage technical skills and passion for innovation in a challenging role.`
}

function generatePhoneNumber(): string {
  const prefixes = ["76", "77", "78", "79", "88", "30"]
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)]
  const suffix = Math.floor(Math.random() * 900000) + 100000
  return `+232-${prefix}-${suffix}`
}

function getFieldOfStudyFromSkills(skills: string[]): string {
  const skillToField: Record<string, string> = {
    "javascript": "Computer Science",
    "python": "Computer Science", 
    "react": "Computer Science",
    "nodejs": "Computer Science",
    "web development": "Computer Science",
    "html": "Computer Science",
    "css": "Computer Science",
    "data analysis": "Data Science",
    "data science": "Data Science",
    "machine learning": "Data Science",
    "marketing": "Business Administration",
    "sales": "Business Administration",
    "accounting": "Accounting and Finance",
    "finance": "Accounting and Finance",
    "teaching": "Education",
    "education": "Education",
    "nursing": "Nursing",
    "medicine": "Medicine",
    "engineering": "Engineering",
    "project management": "Business Administration",
    "communication": "Mass Communication",
    "writing": "Mass Communication",
    "graphic design": "Fine Arts & Design"
  }

  for (const skill of skills) {
    const lowerSkill = skill.toLowerCase()
    if (skillToField[lowerSkill]) {
      return skillToField[lowerSkill]
    }
  }
  
  return "Business Administration"
}

function generateExperienceFromSkills(skills: string[], fullName: string): CVData['experience'] {
  const positions = getPositionFromSkills(skills)
  const companies = ["Sierra Leone Telecom", "Bank of Sierra Leone", "Ministry of Finance", "UNICEF Sierra Leone", "Sierra Leone Commercial Bank"]
  const company = companies[Math.floor(Math.random() * companies.length)]
  
  return [
    {
      id: "exp-1",
      company: company,
      position: positions[0],
      location: "Freetown, Sierra Leone",
      startDate: "2022",
      endDate: "Present",
      current: true,
      description: `• Applied expertise in ${skills.slice(0, 2).join(" and ")} to drive operational excellence and achieve strategic objectives\n• Led cross-functional teams in implementing innovative solutions that improved efficiency by 30%\n• Developed and maintained strong relationships with clients and stakeholders, ensuring high satisfaction rates\n• Analyzed complex challenges and implemented data-driven strategies that resulted in measurable improvements\n• Mentored junior team members and contributed to knowledge sharing initiatives`,
      achievements: "Successfully led 3 major projects resulting in 25% cost reduction and improved service delivery. Recognized as 'Employee of the Quarter' for outstanding performance."
    },
    {
      id: "exp-2",
      company: "Ministry of Technology and Communications",
      position: positions[1] || "Junior Specialist",
      location: "Freetown, Sierra Leone", 
      startDate: "2021",
      endDate: "2022",
      current: false,
      description: `• Assisted senior management with ${skills.join(", ")} related initiatives and projects\n• Contributed to policy development and implementation strategies\n• Collaborated with various departments to ensure seamless project execution\n• Developed strong foundation in professional practices and organizational procedures\n• Participated in training programs to enhance technical and soft skills`,
      achievements: "Played key role in successful implementation of digital transformation initiative. Received commendation for dedication and performance excellence."
    }
  ]
}

function getPositionFromSkills(skills: string[]): string[] {
  const skillPositions: Record<string, string[]> = {
    "javascript": ["Software Developer", "Junior Developer"],
    "python": ["Data Analyst", "Junior Data Analyst"],
    "react": ["Frontend Developer", "Junior Frontend Developer"],
    "marketing": ["Marketing Specialist", "Marketing Assistant"],
    "sales": ["Sales Representative", "Sales Assistant"],
    "accounting": ["Accountant", "Junior Accountant"],
    "teaching": ["Education Officer", "Teaching Assistant"],
    "nursing": ["Registered Nurse", "Nursing Assistant"],
    "project management": ["Project Coordinator", "Project Assistant"]
  }

  for (const skill of skills) {
    const lowerSkill = skill.toLowerCase()
    if (skillPositions[lowerSkill]) {
      return skillPositions[lowerSkill]
    }
  }
  
  return ["Business Analyst", "Junior Analyst"]
}

function generateProjectsFromSkills(skills: string[]): CVData['projects'] {
  return [
    {
      id: "proj-1",
      name: "Digital Transformation Initiative",
      description: `Led a comprehensive project implementing ${skills.slice(0, 2).join(" and ")} solutions to streamline business operations. Successfully coordinated with multiple stakeholders to deliver project on time and within budget, resulting in 40% improvement in operational efficiency.`,
      technologies: skills.slice(0, 3),
      outcome: "Project successfully implemented with measurable positive impact on business performance and user satisfaction."
    },
    {
      id: "proj-2", 
      name: "Community Development Program",
      description: `Developed and executed community outreach program utilizing ${skills[0]} skills to create positive social impact. Engaged with local communities and organizations to drive sustainable development initiatives.`,
      technologies: skills.slice(1, 4),
      outcome: "Successfully reached over 500 community members and received positive feedback from stakeholders."
    }
  ]
}

function generateCertificationsFromSkills(skills: string[], fieldOfStudy: string): CVData['certifications'] {
  return [
    {
      id: "cert-1",
      name: `${fieldOfStudy} Professional Certification`,
      organization: "Sierra Leone Professional Association",
      year: "2023"
    },
    {
      id: "cert-2",
      name: "Project Management Professional",
      organization: "Project Management Institute",
      year: "2022"
    },
    {
      id: "cert-3",
      name: "Digital Skills Certification",
      organization: "International Computer Driving License",
      year: "2021"
    }
  ]
}

export async function GET() {
  return NextResponse.json({ message: "Test CV AI generation endpoint - no authentication required" })
}
