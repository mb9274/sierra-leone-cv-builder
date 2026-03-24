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

function toDate(value: string | Date | undefined, fallback = new Date()) {
  if (!value) return fallback
  return value instanceof Date ? value : new Date(value)
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

  return {
    ...(source || {}),
    id: source?.id || record.id || "",
    templateId: source?.templateId || record.templateId || record.template || "sierra-leone-professional",
    personalInfo: normalizePersonalInfo(record, source),
    education: source?.education || record.education || [],
    experience: source?.experience || record.experience || [],
    skills: source?.skills || record.skills || [],
    languages: source?.languages || record.languages || [],
    links: source?.links || record.links || [],
    projects: source?.projects || record.projects || [],
    technicalWriting: source?.technicalWriting || record.technicalWriting || [],
    certifications: source?.certifications || record.certifications || [],
    volunteering: source?.volunteering || record.volunteering || [],
    awards: source?.awards || record.awards || [],
    hobbies: source?.hobbies || record.hobbies || [],
    referees: source?.referees || record.referees || [],
    availability: source?.availability || record.availability || "",
    styles: source?.styles || record.styles || {},
    sourceText: source?.sourceText || record.sourceText || "",
    storageBucket: source?.storageBucket || record.storageBucket || "",
    storagePath: source?.storagePath || record.storagePath || "",
    originalFileName: source?.originalFileName || record.originalFileName || "",
    mimeType: source?.mimeType || record.mimeType || "",
    createdAt: toDate(source?.createdAt || record.createdAt || record.created_at),
    updatedAt: toDate(source?.updatedAt || record.updatedAt || record.updated_at),
  } as CVData
}
