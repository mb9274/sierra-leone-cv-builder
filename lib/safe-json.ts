export function readStoredJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback

  try {
    const raw = localStorage.getItem(key)
    if (!raw) return fallback

    return JSON.parse(raw) as T
  } catch (error) {
    console.error(`Failed to read stored JSON for ${key}:`, error)
    return fallback
  }
}
