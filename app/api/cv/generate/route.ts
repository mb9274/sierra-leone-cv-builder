import { createClient } from "@/lib/supabase/server"
import type { CVData } from "@/lib/types"
import { NextRequest, NextResponse } from "next/server"

type GenerateInput = {
  fullName: string
  email: string
  phone?: string
  location?: string
  jobTitle?: string
  experience?: string
  education?: string
  skills?: string
  careerGoals?: string
}

type RoleFamily = "software" | "business" | "finance" | "education" | "healthcare" | "communications" | "general"

type RoleProfile = {
  fieldOfStudy: string
  title: string
  companies: string[]
  positions: string[]
  skills: string[]
  projects: string[]
  certifications: string[]
  hobbies: string[]
  volunteering: string
  awards: string
  summaryFocus: string
}

function normalizeSkills(value?: string) {
  return String(value || "")
    .split(",")
    .map((skill) => skill.trim())
    .filter(Boolean)
}

function uniq(values: string[]) {
  return [...new Set(values.filter(Boolean))]
}

function slugifyName(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, ".").replace(/^\.+|\.+$/g, "")
}

function cleanJsonResponse(text: string) {
  let jsonString = text.trim()

  if (jsonString.includes("```json")) {
    jsonString = jsonString.split("```json")[1].split("```")[0].trim()
  } else if (jsonString.includes("```")) {
    jsonString = jsonString.split("```")[1].split("```")[0].trim()
  }

  const start = jsonString.indexOf("{")
  const end = jsonString.lastIndexOf("}")
  if (start !== -1 && end !== -1 && end > start) {
    jsonString = jsonString.slice(start, end + 1)
  }

  return jsonString
}

function detectRoleFamily(input: GenerateInput, skills: string[]): RoleFamily {
  const text = [input.fullName, input.jobTitle, input.experience, input.education, input.careerGoals, ...skills].join(" ").toLowerCase()

  if (/(software|developer|programmer|engineer|frontend|backend|full stack|web dev|web development|app development|it support|computer science)/.test(text)) {
    return "software"
  }

  if (/(business|entrepreneur|operations|administration|office|sales|marketing|commerce|management|customer success|supply chain)/.test(text)) {
    return "business"
  }

  if (/(finance|accounting|bank|bookkeeping|audit|auditing|treasury|revenue|payroll)/.test(text)) {
    return "finance"
  }

  if (/(teach|teacher|education|school|lecturer|training|curriculum|academic)/.test(text)) {
    return "education"
  }

  if (/(nurse|health|medical|clinic|hospital|pharmacy|public health|midwife)/.test(text)) {
    return "healthcare"
  }

  if (/(communication|journalism|media|public relations|content|writing|broadcast|social media)/.test(text)) {
    return "communications"
  }

  return "general"
}

function getRoleProfile(role: RoleFamily): RoleProfile {
  switch (role) {
    case "software":
      return {
        fieldOfStudy: "Computer Science",
        title: "Software Developer",
        companies: ["Sierra Leone Telecom", "Orange Sierra Leone", "StartUp Sierra Leone"],
        positions: ["Software Developer", "Frontend Developer", "Junior Software Engineer"],
        skills: ["JavaScript", "TypeScript", "React", "Node.js", "REST APIs", "Git", "SQL", "Problem Solving"],
        projects: [
          "Built a responsive business management platform for service delivery and reporting",
          "Created a job application dashboard with authentication and document upload",
          "Developed a portfolio site to showcase technical work and client projects",
        ],
        certifications: [
          "Web Development Certification",
          "Cloud and Deployment Fundamentals",
          "Project Management Professional",
        ],
        hobbies: ["Open-source development", "Tech reading", "Hackathons", "Mentoring"],
        volunteering: "Supported digital literacy sessions for youth and community groups.",
        awards: "Recognized for delivering reliable software solutions and clean user interfaces.",
        summaryFocus: "software development, product delivery, and solving business problems with code",
      }
    case "business":
      return {
        fieldOfStudy: "Business Administration",
        title: "Business Development Officer",
        companies: ["Sierra Leone Commercial Bank", "Guma Valley Water Company", "SLMTB"],
        positions: ["Business Development Officer", "Operations Coordinator", "Administrative Officer"],
        skills: ["Business Strategy", "Operations Management", "Sales", "Customer Service", "Data Analysis", "Reporting", "Communication", "Leadership"],
        projects: [
          "Improved customer service workflow and response tracking for a growing business unit",
          "Completed a market research project to support product and service growth",
          "Implemented an operations tracker that improved team accountability and reporting",
        ],
        certifications: [
          "Business Analysis Certification",
          "Project Management Certification",
          "Customer Relationship Management Certificate",
        ],
        hobbies: ["Reading business books", "Networking", "Community service", "Entrepreneurship"],
        volunteering: "Mentored young entrepreneurs and supported local community development activities.",
        awards: "Commended for improving efficiency, communication, and team performance.",
        summaryFocus: "business growth, operations, customer service, and team coordination",
      }
    case "finance":
      return {
        fieldOfStudy: "Accounting and Finance",
        title: "Finance Officer",
        companies: ["Bank of Sierra Leone", "Zenith Bank", "Sierra Leone Commercial Bank"],
        positions: ["Accountant", "Finance Officer", "Accounts Assistant"],
        skills: ["Accounting", "Financial Reporting", "Budgeting", "Excel", "Audit Support", "Reconciliation", "Data Analysis", "Attention to Detail"],
        projects: [
          "Prepared monthly budget tracking and expenditure reports for management review",
          "Supported audit preparation and improved records management procedures",
          "Built a finance dashboard for monitoring expenses and revenue trends",
        ],
        certifications: [
          "Accounting Professional Certification",
          "Financial Reporting Certificate",
          "Excel for Business Finance",
        ],
        hobbies: ["Financial reading", "Community support", "Business networking", "Learning new tools"],
        volunteering: "Assisted with financial literacy outreach for young people and small business owners.",
        awards: "Recognized for accuracy, integrity, and reliable financial reporting.",
        summaryFocus: "financial reporting, budgeting, reconciliation, and accurate record keeping",
      }
    case "education":
      return {
        fieldOfStudy: "Education",
        title: "Education Officer",
        companies: ["Ministry of Basic and Senior Secondary Education", "Njala University", "Local schools"],
        positions: ["Teacher", "Education Officer", "Training Facilitator"],
        skills: ["Teaching", "Lesson Planning", "Curriculum Development", "Assessment", "Communication", "Mentoring", "Classroom Management", "Report Writing"],
        projects: [
          "Designed a lesson improvement plan to support learner engagement and performance",
          "Created an attendance and progress tracking system for students",
          "Led a community education outreach program to improve literacy awareness",
        ],
        certifications: [
          "Teaching Methodology Certificate",
          "Curriculum Development Training",
          "Child Safeguarding Certificate",
        ],
        hobbies: ["Reading", "Mentoring", "Community work", "Educational content"],
        volunteering: "Supported literacy and youth education initiatives in the community.",
        awards: "Acknowledged for commitment to learning outcomes and student development.",
        summaryFocus: "teaching, training, curriculum support, and learner development",
      }
    case "healthcare":
      return {
        fieldOfStudy: "Public Health",
        title: "Healthcare Assistant",
        companies: ["Connaught Hospital", "Princess Christian Maternity Hospital", "District Health Services"],
        positions: ["Nurse", "Healthcare Assistant", "Public Health Officer"],
        skills: ["Patient Care", "Communication", "Health Education", "Record Keeping", "Teamwork", "Report Writing", "Empathy", "Organization"],
        projects: [
          "Supported a community health awareness campaign focused on prevention and early care",
          "Helped improve patient record handling and service coordination",
          "Assisted in outreach work for maternal and child health education",
        ],
        certifications: [
          "Healthcare Support Certificate",
          "Public Health Training",
          "Patient Care and Safety Certificate",
        ],
        hobbies: ["Reading health topics", "Community support", "Volunteering", "Wellness activities"],
        volunteering: "Supported health outreach and awareness activities in local communities.",
        awards: "Recognized for compassion, discipline, and dependable patient support.",
        summaryFocus: "patient care, health education, record keeping, and compassionate service",
      }
    case "communications":
      return {
        fieldOfStudy: "Mass Communication",
        title: "Communications Officer",
        companies: ["SLBC", "Newspaper houses", "NGO communication teams"],
        positions: ["Communications Officer", "Content Writer", "Media Assistant"],
        skills: ["Writing", "Editing", "Public Relations", "Social Media", "Content Strategy", "Storytelling", "Research", "Communication"],
        projects: [
          "Produced content for awareness campaigns and community engagement",
          "Managed social media communication for a local initiative",
          "Created newsletters and reports to support stakeholder communication",
        ],
        certifications: [
          "Digital Media Certificate",
          "Public Relations Training",
          "Content Writing Certification",
        ],
        hobbies: ["Writing", "Reading", "Storytelling", "Media trends"],
        volunteering: "Supported communication activities for youth and community campaigns.",
        awards: "Commended for clarity, creativity, and effective public communication.",
        summaryFocus: "communications, storytelling, public relations, and audience engagement",
      }
    default:
      return {
        fieldOfStudy: "Business Administration",
        title: "Professional Officer",
        companies: ["Professional Organization", "Community Organisation", "Local Enterprise"],
        positions: ["Professional Officer", "Assistant Officer", "Coordinator"],
        skills: ["Communication", "Problem Solving", "Teamwork", "Reporting", "Organization", "Customer Service"],
        projects: [
          "Coordinated a service improvement initiative for a small organization",
          "Assisted with reporting and operational support tasks",
          "Contributed to a community-focused project with measurable outcomes",
        ],
        certifications: [
          "Professional Development Certificate",
          "Project Coordination Training",
          "Office Administration Certificate",
        ],
        hobbies: ["Reading", "Community service", "Learning", "Networking"],
        volunteering: "Participated in community service and support initiatives.",
        awards: "Recognized for professionalism, reliability, and teamwork.",
        summaryFocus: "professional delivery, coordination, teamwork, and service improvement",
      }
  }
}

function getFieldOfStudyFromSkills(skills: string[]) {
  const skillToField: Record<string, string> = {
    javascript: "Computer Science",
    typescript: "Computer Science",
    react: "Computer Science",
    nodejs: "Computer Science",
    python: "Computer Science",
    web: "Computer Science",
    accounting: "Accounting and Finance",
    finance: "Accounting and Finance",
    marketing: "Business Administration",
    sales: "Business Administration",
    teaching: "Education",
    education: "Education",
    nursing: "Nursing",
    medicine: "Medicine",
    engineering: "Engineering",
    communication: "Mass Communication",
    design: "Graphic Design",
    project: "Business Administration",
    data: "Data Science",
  }

  for (const skill of skills) {
    const lower = skill.toLowerCase()
    for (const [key, field] of Object.entries(skillToField)) {
      if (lower.includes(key)) return field
    }
  }

  return "Business Administration"
}

function inferCompanyFromText(text: string) {
  const match = text.match(/(?:at|with|for)\s+([A-Z][A-Za-z0-9&.,' -]{2,80})/i)
  return match?.[1]?.trim().replace(/[.,;]+$/, "") || ""
}

function inferCompany(role: RoleFamily) {
  const profile = getRoleProfile(role)
  return profile.companies[0] || "Professional Organization"
}

function generatePhoneNumber() {
  const prefixes = ["76", "77", "78", "79", "88", "30"]
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)]
  const suffix = Math.floor(Math.random() * 900000) + 100000
  return `+232-${prefix}-${suffix}`
}

function formatAsBullets(text: string) {
  return text
    .split(/\r?\n+/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => (line.startsWith("-") ? line : `- ${line}`))
    .join("\n")
}

function buildSummary(input: GenerateInput, skills: string[], role: RoleFamily) {
  const profile = getRoleProfile(role)
  const skillHighlight = skills.slice(0, 3).join(", ")
  const roleLabel = input.jobTitle || profile.title
  const goals = input.careerGoals ? ` ${input.careerGoals.trim()}` : ""

  return `Results-oriented ${roleLabel} professional with expertise in ${skillHighlight}. Strong background in ${profile.summaryFocus}. Proven ability to deliver practical results, work in fast-paced environments, and contribute to team success. Excellent communication, problem-solving, and learning mindset.${goals}`
}

function buildEducation(input: GenerateInput, fieldOfStudy: string, role: RoleFamily) {
  const educationText = input.education?.trim()
  const profile = getRoleProfile(role)

  if (educationText) {
    const lines = educationText.split(/\r?\n+/).map((line) => line.trim()).filter(Boolean)
    const institution = lines.find((line) => /university|college|school|institute/i.test(line)) || lines[0] || "Fourah Bay College, University of Sierra Leone"
    const degree = lines.find((line) => /degree|b\.sc|bachelor|master|diploma|certificate|hnd|waec/i.test(line)) || `Bachelor of Science (${fieldOfStudy})`
    return [
      {
        id: "edu-1",
        institution,
        degree,
        fieldOfStudy,
        startDate: "2018",
        endDate: "2022",
        current: false,
      },
    ]
  }

  return [
    {
      id: "edu-1",
      institution: "Fourah Bay College, University of Sierra Leone",
      degree: `Bachelor of Science (${fieldOfStudy})`,
      fieldOfStudy,
      startDate: "2018",
      endDate: "2022",
      current: false,
    },
    {
      id: "edu-2",
      institution: "Prince of Wales Secondary School",
      degree: "West African Senior School Certificate",
      fieldOfStudy: role === "software" ? "General Science" : profile.fieldOfStudy,
      startDate: "2012",
      endDate: "2017",
      current: false,
    },
  ]
}

function buildExperience(input: GenerateInput, skills: string[], role: RoleFamily) {
  const profile = getRoleProfile(role)
  const sourceText = input.experience?.trim()
  const primaryPosition = input.jobTitle || profile.title
  const companyFromText = sourceText ? inferCompanyFromText(sourceText) : ""
  const company = companyFromText || inferCompany(role)

  if (sourceText) {
    return [
      {
        id: "exp-1",
        company,
        position: primaryPosition,
        location: input.location || "Freetown, Sierra Leone",
        startDate: "2022",
        endDate: "Present",
        current: true,
        description: formatAsBullets(sourceText),
        achievements: sourceText,
      },
    ]
  }

  return [
    {
      id: "exp-1",
      company,
      position: primaryPosition,
      location: input.location || "Freetown, Sierra Leone",
      startDate: "2022",
      endDate: "Present",
      current: true,
      description: [
        `- Applied expertise in ${skills.slice(0, 2).join(" and ")} to deliver measurable results`,
        `- Improved workflows, communication, and delivery standards within the ${role} function`,
        "- Supported stakeholders through clear communication and problem solving",
      ].join("\n"),
      achievements: `Delivered consistent improvements in ${profile.summaryFocus}.`,
    },
    {
      id: "exp-2",
      company: profile.companies[1] || "Professional Organization",
      position: profile.positions[1] || "Junior Specialist",
      location: input.location || "Freetown, Sierra Leone",
      startDate: "2020",
      endDate: "2022",
      current: false,
      description: [
        `- Assisted in projects related to ${skills.slice(0, 3).join(", ")}`,
        "- Contributed to day-to-day operations, reporting, and cross-team coordination",
        `- Built practical experience through structured tasks relevant to ${role}`,
      ].join("\n"),
      achievements: `Developed a strong foundation in ${profile.summaryFocus}.`,
    },
  ]
}

function buildProjects(input: GenerateInput, skills: string[], role: RoleFamily) {
  const profile = getRoleProfile(role)
  const goal = input.careerGoals || "professional growth"
  return [
    {
      id: "proj-1",
      name: `${profile.title} Portfolio Project`,
      description: profile.projects[0] || `Developed a project focused on ${skills.slice(0, 3).join(", ")} to support ${goal}.`,
      technologies: skills.slice(0, 3),
      outcome: "Demonstrated practical application of core skills.",
    },
    {
      id: "proj-2",
      name:
        role === "software"
          ? "Job Application Platform"
          : role === "business"
            ? "Business Improvement Initiative"
            : "Community Impact Initiative",
      description: profile.projects[1] || `Contributed to a practical initiative using ${skills.slice(0, 2).join(" and ")} to create measurable value.`,
      technologies: skills.slice(1, 4),
      outcome: "Improved collaboration, service delivery, and stakeholder engagement.",
    },
    {
      id: "proj-3",
      name: role === "software" ? "Responsive Service Dashboard" : "Operational Reporting Dashboard",
      description: profile.projects[2] || "Built a practical solution that improved reporting, visibility, and execution.",
      technologies: skills.slice(0, 4),
      outcome: "Strengthened efficiency and decision making.",
    },
  ]
}

function buildCertifications(fieldOfStudy: string, role: RoleFamily) {
  const profile = getRoleProfile(role)
  return [
    {
      id: "cert-1",
      name: profile.certifications[0] || `${fieldOfStudy} Professional Certification`,
      organization: "Sierra Leone Professional Association",
      year: "2023",
    },
    {
      id: "cert-2",
      name: profile.certifications[1] || "Project Management Professional",
      organization: "Project Management Institute",
      year: "2022",
    },
    {
      id: "cert-3",
      name: profile.certifications[2] || "Digital Skills Certification",
      organization: "International Computer Driving License",
      year: "2021",
    },
  ]
}

function buildFallbackCv(input: GenerateInput, skills: string[]): Omit<CVData, "id" | "createdAt" | "updatedAt"> {
  const role = detectRoleFamily(input, skills)
  const profile = getRoleProfile(role)
  const fieldOfStudy = profile.fieldOfStudy || getFieldOfStudyFromSkills(skills)
  const name = input.fullName.trim()
  const mergedSkills = uniq([...(skills.length ? skills : profile.skills), ...profile.skills.slice(0, 6)])

  return {
    personalInfo: {
      fullName: name,
      email: input.email.trim(),
      phone: input.phone || generatePhoneNumber(),
      location: input.location || "Freetown, Sierra Leone",
      summary: buildSummary(input, mergedSkills, role),
      age: "25-30",
      linkedin: `linkedin.com/in/${slugifyName(name)}`,
      portfolio: `github.com/${slugifyName(name).replace(/\./g, "")}`,
    },
    education: buildEducation(input, fieldOfStudy, role),
    experience: buildExperience(input, mergedSkills, role),
    skills: mergedSkills,
    languages: [
      { language: "English", proficiency: "Fluent" },
      { language: "Krio", proficiency: "Native" },
      ...(role === "communications" || role === "education" ? [{ language: "French", proficiency: "Basic" }] : []),
    ],
    projects: buildProjects(input, mergedSkills, role),
    certifications: buildCertifications(fieldOfStudy, role),
    volunteering: [
      {
        id: "vol-1",
        organization: role === "software" ? "Digital Skills Community" : profile.companies[0],
        role: role === "software" ? "Technology Volunteer" : "Community Volunteer",
        startDate: "2020",
        endDate: "Present",
        description: profile.volunteering,
      },
    ],
    awards: [
      {
        id: "award-1",
        name: role === "software" ? "Innovation Award" : role === "business" ? "Excellence in Leadership Award" : "Best Performance Award",
        organization: input.education?.trim() ? input.education.split(/\r?\n+/)[0] || "Academic Institution" : "Academic Institution",
        year: "2022",
        reason: profile.awards,
      },
    ],
    hobbies: input.careerGoals ? [input.careerGoals, ...profile.hobbies] : profile.hobbies,
    referees: [
      {
        id: "ref-1",
        name: `Reference for ${name}`,
        title: input.jobTitle || "Professional Reference",
        organization: input.location || "Sierra Leone",
        phone: input.phone || "",
        email: input.email.trim(),
        availableOnRequest: true,
      },
    ],
  }
}

function mergeCv(aiCV: any, input: GenerateInput, skills: string[]) {
  const fallback = buildFallbackCv(input, skills)

  return {
    ...fallback,
    personalInfo: {
      ...fallback.personalInfo,
      ...(aiCV.personalInfo || {}),
      fullName: input.fullName.trim(),
      email: input.email.trim(),
      phone: input.phone || aiCV.personalInfo?.phone || fallback.personalInfo.phone,
      location: input.location || aiCV.personalInfo?.location || fallback.personalInfo.location,
      summary: aiCV.personalInfo?.summary || fallback.personalInfo.summary,
      linkedin: aiCV.personalInfo?.linkedin || fallback.personalInfo.linkedin,
      portfolio: aiCV.personalInfo?.portfolio || fallback.personalInfo.portfolio,
    },
    education: aiCV.education?.length ? aiCV.education : fallback.education,
    experience: aiCV.experience?.length ? aiCV.experience : fallback.experience,
    skills: aiCV.skills?.length ? aiCV.skills : fallback.skills,
    languages: aiCV.languages?.length ? aiCV.languages : fallback.languages,
    projects: aiCV.projects?.length ? aiCV.projects : fallback.projects,
    certifications: aiCV.certifications?.length ? aiCV.certifications : fallback.certifications,
    volunteering: aiCV.volunteering?.length ? aiCV.volunteering : fallback.volunteering,
    awards: aiCV.awards?.length ? aiCV.awards : fallback.awards,
    hobbies: aiCV.hobbies?.length ? aiCV.hobbies : fallback.hobbies,
    referees: aiCV.referees?.length ? aiCV.referees : fallback.referees,
    templateId: aiCV.templateId || "sierra-leone-professional",
  } satisfies Omit<CVData, "id" | "createdAt" | "updatedAt">
}

async function generateCvWithGemini(input: GenerateInput, skills: string[]) {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) return buildFallbackCv(input, skills)

  const role = detectRoleFamily(input, skills)
  const profile = getRoleProfile(role)
  const mergedSkills = uniq([...(skills.length ? skills : profile.skills), ...profile.skills.slice(0, 6)])

  const prompt = `
You are an expert CV writer for the Sierra Leonean job market.

Create a complete CV in strict JSON using the input below.

Rules:
- Keep the full name and email exactly as provided.
- Build the CV around this role family: ${role}.
- The target role is: ${input.jobTitle || profile.title}.
- Use the phone, location, job title, experience notes, education notes, and career goals if provided.
- Do not invent a different person.
- If information is missing, generate realistic content consistent with the input.
- The CV must feel specific to ${profile.summaryFocus}.
- Create at least 2 experience entries, 2 education entries when possible, 3 projects, and 3 certifications.
- Return only valid JSON.

Input:
Full Name: ${input.fullName}
Email: ${input.email}
Phone: ${input.phone || "Not provided"}
Location: ${input.location || "Not provided"}
Job Title: ${input.jobTitle || "Not provided"}
Experience Notes: ${input.experience || "Not provided"}
Education Notes: ${input.education || "Not provided"}
Career Goals: ${input.careerGoals || "Not provided"}
Skills: ${mergedSkills.join(", ")}
Role Profile:
- Field of Study: ${profile.fieldOfStudy}
- Example Positions: ${profile.positions.join(", ")}
- Example Companies: ${profile.companies.join(", ")}

JSON shape:
{
  "personalInfo": {
    "fullName": "",
    "email": "",
    "phone": "",
    "location": "",
    "summary": "",
    "age": "",
    "linkedin": "",
    "portfolio": ""
  },
  "education": [],
  "experience": [],
  "skills": [],
  "languages": [],
  "projects": [],
  "certifications": [],
  "volunteering": [],
  "awards": [],
  "hobbies": [],
  "referees": [],
  "templateId": "sierra-leone-professional"
}
`

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.25,
          maxOutputTokens: 4096,
          responseMimeType: "application/json",
        },
      }),
    },
  )

  if (!response.ok) {
    throw new Error(`Gemini API error: ${response.statusText}`)
  }

  const data = await response.json()
  const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text || ""
  const cleaned = cleanJsonResponse(generatedText)

  try {
    const aiCV = JSON.parse(cleaned)
    return mergeCv(aiCV, input, mergedSkills)
  } catch (error) {
    throw new Error(`Failed to parse Gemini response: ${error instanceof Error ? error.message : "Unknown error"}`)
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const input: GenerateInput = {
      fullName: String(body.fullName || "").trim(),
      email: String(body.email || "").trim(),
      phone: String(body.phone || "").trim(),
      location: String(body.location || "").trim(),
      jobTitle: String(body.jobTitle || "").trim(),
      experience: String(body.experience || "").trim(),
      education: String(body.education || "").trim(),
      skills: String(body.skills || "").trim(),
      careerGoals: String(body.careerGoals || "").trim(),
    }

    if (!input.fullName || !input.email) {
      return NextResponse.json(
        { error: "Missing required fields: fullName and email are required" },
        { status: 400 },
      )
    }

    const skills = normalizeSkills(input.skills || input.jobTitle || input.careerGoals)
    const generatedCV = await generateCvWithGemini(input, skills).catch(() => buildFallbackCv(input, skills))

    const primary = await supabase
      .from("cvs")
      .insert({
        user_id: user.id,
        data: generatedCV,
      })
      .select("id, data, created_at, updated_at")
      .single()

    if (!primary.error) {
      return NextResponse.json({
        success: true,
        message: "CV generated successfully",
        data: {
          ...generatedCV,
          id: primary.data.id,
          createdAt: primary.data.created_at,
          updatedAt: primary.data.updated_at,
        },
      })
    }

    const message = String(primary.error.message || "").toLowerCase()
    const needsLegacyFallback =
      (message.includes("column") && message.includes("data")) ||
      message.includes("null value in column \"age\"") ||
      message.includes("age")

    if (needsLegacyFallback) {
      const legacy = await supabase
        .from("cvs")
        .insert({
          user_id: user.id,
          full_name: generatedCV.personalInfo.fullName,
          email: generatedCV.personalInfo.email,
          phone: generatedCV.personalInfo.phone,
          age: 25,
          summary: generatedCV.personalInfo.summary || "",
          education: generatedCV.education || [],
          experience: generatedCV.experience || [],
          skills: generatedCV.skills || [],
          languages: generatedCV.languages || [],
          photo_url: generatedCV.personalInfo.profilePhoto || "",
          template: generatedCV.templateId || "sierra-leone-professional",
        })
        .select("id, created_at, updated_at")
        .single()

      if (!legacy.error) {
        return NextResponse.json({
          success: true,
          message: "CV generated successfully",
          data: {
            ...generatedCV,
            id: legacy.data.id,
            createdAt: legacy.data.created_at,
            updatedAt: legacy.data.updated_at,
          },
        })
      }

      return NextResponse.json({ error: `Database error: ${legacy.error.message}` }, { status: 500 })
    }

    return NextResponse.json({ error: `Database error: ${primary.error.message}` }, { status: 500 })
  } catch (error) {
    console.error("AI generation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ message: "Enhanced CV AI generation endpoint" })
}
