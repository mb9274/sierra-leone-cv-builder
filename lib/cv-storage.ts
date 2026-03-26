import type { CVData } from "./types"
import { getCvLocation } from "./cv-location"

type CVRecord = {
  id?: string
  data?: any
  created_at?: string | Date
  updated_at?: string | Date
  createdAt?: string | Date
  updatedAt?: string | Date
  full_name?: string
  email?: string
  phone?: string
  summary?: string
  age?: number | string
  location?: string
  addressCity?: string
  addressCountry?: string
  photo_url?: string
  template?: string
  templateId?: string
  storageBucket?: string
  storagePath?: string
  originalFileName?: string
  mimeType?: string
  education?: CVData["education"]
  experience?: CVData["experience"]
  skills?: CVData["skills"]
  languages?: CVData["languages"]
  links?: CVData["links"]
  projects?: CVData["projects"]
  technicalWriting?: CVData["technicalWriting"]
  certifications?: CVData["certifications"]
  volunteering?: CVData["volunteering"]
  awards?: CVData["awards"]
  hobbies?: CVData["hobbies"]
  referees?: CVData["referees"]
  availability?: CVData["availability"]
  styles?: CVData["styles"]
  sourceText?: string
  personalInfo?: Partial<CVData["personalInfo"]>
}

function stripEmoji(value: string) {
  return value
    .replace(/\p{Extended_Pictographic}/gu, "")
    .replace(/[\u200D\uFE0E\uFE0F]/g, "")
    .trim()
}

function sanitizeValue<T>(value: T): T {
  if (typeof value === "string") {
    return stripEmoji(value) as T
  }

  if (Array.isArray(value)) {
    return value.map((item) => sanitizeValue(item)) as T
  }

  if (value && typeof value === "object" && !(value instanceof Date)) {
    const next: Record<string, unknown> = {}
    for (const [key, item] of Object.entries(value as Record<string, unknown>)) {
      next[key] = sanitizeValue(item)
    }
    return next as T
  }

  return value
}

export function sanitizeCvRecord(record: CVRecord) {
  return sanitizeValue(record)
}

function toDate(value: string | Date | undefined, fallback = new Date()) {
  if (!value) return fallback
  return value instanceof Date ? value : new Date(value)
}

function hashString(input: string) {
  let hash = 0

  for (let i = 0; i < input.length; i++) {
    hash = (hash << 5) - hash + input.charCodeAt(i)
    hash |= 0
  }

  return Math.abs(hash).toString(36)
}

function buildFallbackId(record: CVRecord, source: any) {
  const createdAt = source?.createdAt || record.createdAt || record.created_at || ""
  const name = source?.personalInfo?.fullName || record.full_name || ""
  const email = source?.personalInfo?.email || record.email || ""
  const seed = [String(createdAt), name, email, source?.sourceText || record.sourceText || ""].join("|").trim()

  if (!seed || seed === "|||") {
    return `cv_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`
  }

  return `cv_${hashString(seed)}`
}

function normalizePersonalInfo(record: CVRecord, source: any): CVData["personalInfo"] {
  const personalInfo = source?.personalInfo || {}
  const location =
    getCvLocation({
      location: personalInfo.location || record.location,
      addressCity: personalInfo.addressCity || record.addressCity,
      addressCountry: personalInfo.addressCountry || record.addressCountry,
      personalInfo,
    }) ||
    ""

  return {
    fullName: personalInfo.fullName || record.full_name || "",
    email: personalInfo.email || record.email || "",
    phone: personalInfo.phone || record.phone || "",
    location,
    addressCity: personalInfo.addressCity || "",
    addressCountry: personalInfo.addressCountry || "",
    age: personalInfo.age || (record.age !== undefined ? String(record.age) : ""),
    summary: personalInfo.summary || record.summary || "",
    profilePhoto: personalInfo.profilePhoto || record.photo_url || "",
    linkedin: personalInfo.linkedin || "",
    portfolio: personalInfo.portfolio || "",
  }
}

export function normalizeCvRecord(record: CVRecord): CVData {
  const source = record.data && typeof record.data === "object" ? record.data : record
  const safeSource = sanitizeValue(source)
  const id = safeSource?.id || record.id || buildFallbackId(record, safeSource)

  return {
    ...(safeSource || {}),
    id,
    templateId: safeSource?.templateId || record.templateId || record.template || "sierra-leone-professional",
    personalInfo: normalizePersonalInfo(record, safeSource),
    education: safeSource?.education || record.education || [],
    experience: safeSource?.experience || record.experience || [],
    skills: safeSource?.skills || record.skills || [],
    languages: safeSource?.languages || record.languages || [],
    links: safeSource?.links || record.links || [],
    projects: safeSource?.projects || record.projects || [],
    technicalWriting: safeSource?.technicalWriting || record.technicalWriting || [],
    certifications: safeSource?.certifications || record.certifications || [],
    volunteering: safeSource?.volunteering || record.volunteering || [],
    awards: safeSource?.awards || record.awards || [],
    hobbies: safeSource?.hobbies || record.hobbies || [],
    referees: safeSource?.referees || record.referees || [],
    availability: safeSource?.availability || record.availability || "",
    styles: safeSource?.styles || record.styles || {},
    sourceText: safeSource?.sourceText || record.sourceText || "",
    storageBucket: safeSource?.storageBucket || record.storageBucket || "",
    storagePath: safeSource?.storagePath || record.storagePath || "",
    originalFileName: safeSource?.originalFileName || record.originalFileName || "",
    mimeType: safeSource?.mimeType || record.mimeType || "",
    createdAt: toDate(safeSource?.createdAt || record.createdAt || record.created_at),
    updatedAt: toDate(safeSource?.updatedAt || record.updatedAt || record.updated_at),
  } as CVData
}
