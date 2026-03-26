import type { CVData } from "./types"
import { normalizeCvRecord } from "./cv-storage"

const LOCAL_STORAGE_KEY = "cvbuilder_cvs"
const CURRENT_STORAGE_KEY = "cvbuilder_current"

function getTime(value: string | Date | undefined) {
  if (!value) return 0
  const time = value instanceof Date ? value.getTime() : new Date(value).getTime()
  return Number.isFinite(time) ? time : 0
}

function mergeById(records: CVData[]) {
  const merged = new Map<string, CVData>()

  for (const cv of records) {
    const existing = merged.get(cv.id)
    if (!existing) {
      merged.set(cv.id, cv)
      continue
    }

    if (getTime(cv.updatedAt) >= getTime(existing.updatedAt)) {
      merged.set(cv.id, cv)
    }
  }

  return [...merged.values()].sort((a, b) => getTime(b.updatedAt) - getTime(a.updatedAt))
}

function readStoredCurrentCv() {
  if (typeof window === "undefined") return null

  const saved = sessionStorage.getItem(CURRENT_STORAGE_KEY) || localStorage.getItem(CURRENT_STORAGE_KEY)
  if (!saved) return null

  try {
    return JSON.parse(saved)
  } catch (error) {
    console.error("Failed to parse stored current CV:", error)
    return null
  }
}

export function loadLocalCvs(): CVData[] {
  if (typeof window === "undefined") return []

  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY)
    const currentRaw = localStorage.getItem(CURRENT_STORAGE_KEY)

    const parsed = raw ? JSON.parse(raw) : []
    const current = currentRaw ? JSON.parse(currentRaw) : null

    const records = Array.isArray(parsed) ? parsed : []
    if (current && typeof current === "object") {
      records.unshift(current)
    }

    return records.map((record) => normalizeCvRecord(record))
  } catch (error) {
    console.error("Failed to load local CVs:", error)
    return []
  }
}

export function saveLocalCv(cv: CVData) {
  if (typeof window === "undefined") return

  try {
    const storedCurrent = readStoredCurrentCv()
    const createdAt = cv.createdAt || storedCurrent?.createdAt || new Date()
    const id =
      cv.id ||
      storedCurrent?.id ||
      (typeof createdAt === "string" ? createdAt : createdAt.toISOString()).replace(/[:.]/g, "-")

    const current = normalizeCvRecord({
      ...cv,
      id,
      createdAt,
      updatedAt: new Date(),
    })
    localStorage.setItem(CURRENT_STORAGE_KEY, JSON.stringify(current))

    const existing = loadLocalCvs().filter((record) => record.id !== current.id)
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify([current, ...existing]))
  } catch (error) {
    console.error("Failed to save local CV:", error)
  }
}

export async function loadSupabaseCvs(): Promise<CVData[]> {
  try {
    const response = await fetch("/api/cvs", {
      credentials: "include",
      cache: "no-store",
    })

    if (!response.ok) {
      if (response.status !== 401) {
        console.error("Failed to load server CVs:", response.statusText)
      }
      return []
    }

    const data = await response.json()
    const cvs = Array.isArray(data?.cvs) ? data.cvs : []

    return cvs.map((record: any) => normalizeCvRecord(record))
  } catch (error) {
    console.error("Failed to load server CVs:", error)
    return []
  }
}

export async function loadAvailableCvs(): Promise<CVData[]> {
  const [localCvs, remoteCvs] = await Promise.all([Promise.resolve(loadLocalCvs()), loadSupabaseCvs()])
  return mergeById([...remoteCvs, ...localCvs])
}

export async function loadCurrentCv(): Promise<CVData | null> {
  if (typeof window !== "undefined") {
    const sessionSaved = sessionStorage.getItem("cvbuilder_current")
    const localSaved = localStorage.getItem("cvbuilder_current")
    const saved = sessionSaved || localSaved

    if (saved) {
      try {
        return normalizeCvRecord(JSON.parse(saved))
      } catch (error) {
        console.error("Failed to load current CV from storage:", error)
      }
    }
  }

  const availableCvs = await loadAvailableCvs()
  return availableCvs[0] || null
}
