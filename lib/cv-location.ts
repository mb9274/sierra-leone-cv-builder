type LocationSource = {
  location?: string
  addressCity?: string
  addressCountry?: string
  personalInfo?: {
    location?: string
    addressCity?: string
    addressCountry?: string
  }
}

export function getCvLocation(source?: LocationSource) {
  if (!source) return "Freetown, Sierra Leone"

  const personalInfo = source.personalInfo || source

  return (
    personalInfo.location ||
    [personalInfo.addressCity, personalInfo.addressCountry].filter(Boolean).join(", ") ||
    source.location ||
    [source.addressCity, source.addressCountry].filter(Boolean).join(", ") ||
    "Freetown, Sierra Leone"
  )
}
