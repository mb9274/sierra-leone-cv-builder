import type { CVData } from "./types"

export type ExtractedCv = Omit<CVData, "id" | "createdAt" | "updatedAt"> & {
  sourceText: string
}

const SECTION_ALIASES: Record<string, string[]> = {
  summary: ["summary", "professional summary", "profile", "personal profile", "objective", "about me"],
  experience: ["experience", "work experience", "employment history", "work history", "professional experience"],
  education: ["education", "academic background", "qualifications", "academic qualifications"],
  skills: ["skills", "technical skills", "competencies", "core skills"],
  languages: ["languages", "language skills"],
  projects: ["projects", "project experience", "selected projects"],
  certifications: ["certifications", "certificates", "training", "courses"],
  volunteering: ["volunteering", "volunteer work", "community service"],
  awards: ["awards", "achievements", "honours", "honors"],
  hobbies: ["hobbies", "interests"],
  referees: ["references", "referees", "recommendations"],
  technicalWriting: ["technical writing", "publications", "articles"],
  links: ["links", "social links", "websites"],
}

const ALL_SECTION_HEADERS = Object.values(SECTION_ALIASES).flat()

function normalizeText(text: string) {
  return text
    .replace(/\r/g, "\n")
    .replace(/\u00a0/g, " ")
    .replace(/[ \t]+/g, " ")
    .split("\n")
    .map((line) => line.trim())
    .join("\n")
}

function linesFromText(text: string) {
  return normalizeText(text)
    .split("\n")
    .map((line) => line.replace(/^[*\-\u2022]+\s*/, "").trim())
    .filter(Boolean)
}

function isHeader(line: string) {
  const normalized = line.toLowerCase().replace(/[:\-]/g, "").trim()
  return ALL_SECTION_HEADERS.some((header) => normalized === header || normalized.startsWith(`${header} `))
}

function headerKey(line: string) {
  const normalized = line.toLowerCase().replace(/[:\-]/g, "").trim()
  for (const [key, aliases] of Object.entries(SECTION_ALIASES)) {
    if (aliases.some((alias) => normalized === alias || normalized.startsWith(`${alias} `))) {
      return key
    }
  }
  return null
}

function sectionMap(lines: string[]) {
  const sections: Record<string, string[]> = {}
  let currentKey = "preamble"

  for (const line of lines) {
    const key = headerKey(line)
    if (key) {
      currentKey = key
      if (!sections[currentKey]) sections[currentKey] = []
      continue
    }

    if (!sections[currentKey]) sections[currentKey] = []
    sections[currentKey].push(line)
  }

  return sections
}

function splitBlocks(lines: string[]) {
  const blocks: string[][] = []
  let current: string[] = []

  for (const line of lines) {
    if (!line) continue
    if (isHeader(line)) {
      if (current.length) blocks.push(current)
      current = [line]
      continue
    }
    current.push(line)
  }

  if (current.length) blocks.push(current)
  return blocks
}

function firstMatch(text: string, patterns: RegExp[]) {
  for (const pattern of patterns) {
    const match = text.match(pattern)
    if (match?.[0]) return match[0]
  }
  return ""
}

function extractEmail(text: string) {
  return firstMatch(text, [/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/])
}

function extractPhone(text: string) {
  return firstMatch(text, [
    /\+232[\s.-]?\d{2}[\s.-]?\d{3}[\s.-]?\d{3}/,
    /\+?\d{1,3}[\s.-]?\d{2,4}[\s.-]?\d{3}[\s.-]?\d{3,4}/,
    /\b\d{8,14}\b/,
  ])
}

function extractUrl(text: string, patterns: RegExp[]) {
  return firstMatch(text, patterns)
}

function extractName(lines: string[], fileName: string) {
  const headerLine = lines.find(
    (line) =>
      line.length >= 3 &&
      line.length <= 70 &&
      !/@/.test(line) &&
      !/curriculum vitae|resume|cv/i.test(line) &&
      !/^(\d|email|phone|tel|contact)/i.test(line),
  )

  if (headerLine) return headerLine
  return fileName.replace(/\.[^/.]+$/, "").replace(/[-_]+/g, " ").trim() || "Uploaded CV"
}

function extractLocation(lines: string[]) {
  const labelLine = lines.find((line) => /location|address|city|town|province/i.test(line))
  if (labelLine) {
    const parts = labelLine.split(":")
    if (parts.length > 1 && parts[1].trim()) return parts[1].trim()
  }

  return lines.find((line) => /freetown|bo|makeni|kenema|sierra leone/i.test(line)) || ""
}

function getSectionText(sections: Record<string, string[]>, key: string) {
  return (sections[key] || []).join("\n").trim()
}

function parseList(sectionText: string) {
  return linesFromText(sectionText)
    .flatMap((line) => line.split(/[,;/|]/).map((part) => part.trim()))
    .map((item) => item.replace(/[:\-]+$/, "").trim())
    .filter(Boolean)
}

function parseSkills(text: string, sections: Record<string, string[]>) {
  const section = getSectionText(sections, "skills") || text
  const commonSkills = [
    "javascript",
    "typescript",
    "react",
    "next.js",
    "node.js",
    "python",
    "sql",
    "html",
    "css",
    "excel",
    "word",
    "powerpoint",
    "microsoft office",
    "communication",
    "teamwork",
    "leadership",
    "project management",
    "problem solving",
    "customer service",
    "data entry",
    "data analysis",
    "accounting",
    "finance",
    "marketing",
    "sales",
    "teaching",
    "healthcare",
    "graphic design",
    "research",
    "administration",
  ]

  const lowered = section.toLowerCase()
  const matched = commonSkills.filter((skill) => lowered.includes(skill))
  const bulletSkills = parseList(section)
  return [...new Set([...matched, ...bulletSkills])].slice(0, 20)
}

function parseDateRange(text: string) {
  const years = text.match(/\b(19|20)\d{2}\b/g) || []
  if (years.length >= 2) return { startDate: years[0], endDate: years[years.length - 1] }
  if (years.length === 1) return { startDate: years[0], endDate: /present|current|ongoing/i.test(text) ? "Present" : years[0] }
  if (/present|current|ongoing/i.test(text)) return { startDate: "", endDate: "Present" }
  return { startDate: "", endDate: "" }
}

function parseEducation(sections: Record<string, string[]>) {
  const text = getSectionText(sections, "education")
  if (!text) return []

  return splitBlocks(linesFromText(text))
    .map((block, index) => {
      const joined = block.join(" ")
      const institution =
        block.find((line) => /university|college|school|institute|academy|polytechnic/i.test(line)) || block[0] || ""
      const degree =
        block.find((line) => /bachelor|master|phd|diploma|certificate|degree|hnd|waec|wace/i.test(line)) || block[1] || ""
      const fieldOfStudy =
        block.find((line) => /science|business|engineering|finance|education|marketing|technology|computer|health/i.test(line)) ||
        block[2] ||
        ""
      const { startDate, endDate } = parseDateRange(joined)

      return {
        id: `edu-${index + 1}`,
        institution,
        degree,
        fieldOfStudy,
        startDate,
        endDate,
        current: /present|current/i.test(joined),
      }
    })
    .filter((item) => item.institution || item.degree || item.fieldOfStudy)
}

function parseExperience(sections: Record<string, string[]>) {
  const text = getSectionText(sections, "experience")
  if (!text) return []

  return splitBlocks(linesFromText(text))
    .map((block, index) => {
      const joined = block.join(" ")
      const company =
        block.find((line) => /company|ltd|limited|bank|ministry|agency|solutions|communications|telecom|hospital|school|college|ngo/i.test(line)) ||
        block[0] ||
        ""
      const position =
        block.find((line) => /developer|officer|assistant|manager|analyst|coordinator|specialist|teacher|nurse|designer|consultant|intern/i.test(line)) ||
        block[1] ||
        "Professional Experience"
      const { startDate, endDate } = parseDateRange(joined)
      const description = block.slice(2).join("\n") || joined

      return {
        id: `exp-${index + 1}`,
        company,
        position,
        location: "",
        startDate,
        endDate,
        current: /present|current/i.test(joined),
        description,
        achievements: description,
      }
    })
    .filter((item) => item.company || item.position || item.description)
}

function parseSimpleSectionItems(sectionText: string, mapItem: (value: string, index: number) => any) {
  return parseList(sectionText).map(mapItem).filter(Boolean)
}

export function extractCvData(text: string, userEmail: string, fileName: string): ExtractedCv {
  const normalizedText = normalizeText(text)
  const lines = linesFromText(normalizedText)
  const sections = sectionMap(lines)

  const summary =
    getSectionText(sections, "summary") ||
    lines
      .filter((line) => !isHeader(line))
      .slice(0, 5)
      .join(" ")
      .slice(0, 400)

  const personalInfo = {
    fullName: extractName(lines, fileName),
    email: extractEmail(normalizedText) || userEmail || "",
    phone: extractPhone(normalizedText),
    location: extractLocation(lines),
    addressCity: "",
    addressCountry: "",
    age: firstMatch(normalizedText, [/\b(18|19|20|21|22|23|24|25|26|27|28|29|30)\b/]),
    summary,
    profilePhoto: "",
    linkedin: extractUrl(normalizedText, [/(?:https?:\/\/)?(?:www\.)?linkedin\.com\/[^\s)]+/i]),
    portfolio: extractUrl(normalizedText, [/(?:https?:\/\/)?(?:www\.)?(?:github\.com|behance\.net|portfolio\.com)\/[^\s)]+/i]),
  }

  const skills = parseSkills(normalizedText, sections)

  return {
    personalInfo,
    education: parseEducation(sections),
    experience: parseExperience(sections),
    skills,
    languages: parseSimpleSectionItems(getSectionText(sections, "languages"), (value) => ({
      language: value,
      proficiency: /fluent|native|advanced/i.test(value) ? value.match(/fluent|native|advanced/i)?.[0] || "Fluent" : "Fluent",
    })),
    projects: parseSimpleSectionItems(getSectionText(sections, "projects"), (value, index) => ({
      id: `proj-${index + 1}`,
      name: value,
      description: value,
      link: "",
      technologies: [],
      outcome: "",
    })),
    certifications: parseSimpleSectionItems(getSectionText(sections, "certifications"), (value, index) => ({
      id: `cert-${index + 1}`,
      name: value,
      organization: "",
      year: "",
    })),
    volunteering: parseSimpleSectionItems(getSectionText(sections, "volunteering"), (value, index) => ({
      id: `vol-${index + 1}`,
      organization: value,
      role: value,
      startDate: "",
      endDate: "",
      description: value,
    })),
    awards: parseSimpleSectionItems(getSectionText(sections, "awards"), (value, index) => ({
      id: `award-${index + 1}`,
      name: value,
      organization: "",
      year: "",
      reason: value,
    })),
    hobbies: parseList(getSectionText(sections, "hobbies")),
    referees: parseSimpleSectionItems(getSectionText(sections, "referees"), (value, index) => ({
      id: `ref-${index + 1}`,
      name: value,
      title: "",
      organization: "",
      phone: "",
      email: "",
      availableOnRequest: true,
    })),
    technicalWriting: parseSimpleSectionItems(getSectionText(sections, "technicalWriting"), (value, index) => ({
      id: `tw-${index + 1}`,
      title: value,
      link: value,
      platform: "",
    })),
    links: parseSimpleSectionItems(getSectionText(sections, "links"), (value, index) => ({
      id: `link-${index + 1}`,
      label: value,
      url: value,
    })),
    templateId: "sierra-leone-professional",
    sourceText: normalizedText,
  }
}

