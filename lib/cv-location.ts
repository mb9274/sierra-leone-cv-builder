export function getCvLocation(personalInfo?: {
  location?: string
  addressCity?: string
  addressCountry?: string
}) {
  if (!personalInfo) return ""

  return (
    personalInfo.location ||
    [personalInfo.addressCity, personalInfo.addressCountry].filter(Boolean).join(", ")
  )
}
