import type { CVData, JobApplication } from "./types"

export interface JourneyStep {
  id: string
  label: string
  description: string
  href: string
  completed: boolean
  current: boolean
}

export function computeCareerJourney(
  cvs: CVData[],
  applications: JobApplication[],
  mockInterviewDone: boolean,
): JourneyStep[] {
  const primaryCv = cvs[0] || null

  const hasProfile = Boolean(
    primaryCv?.personalInfo?.fullName &&
    primaryCv?.personalInfo?.email &&
    primaryCv?.personalInfo?.phone,
  )

  const hasCV = cvs.length > 0

  const hasOpportunity = hasCV

  const hasApplication = applications.length > 0

  const hasInterview = mockInterviewDone

  const steps: JourneyStep[] = [
    {
      id: "profile",
      label: "Profile",
      description: hasProfile
        ? "Your basic info is set up"
        : "Add your name, email, and phone",
      href: "/builder",
      completed: hasProfile,
      current: !hasProfile && !hasCV,
    },
    {
      id: "cv",
      label: "CV",
      description: hasCV
        ? `${cvs.length} CV${cvs.length > 1 ? "s" : ""} created`
        : "Create or upload your CV",
      href: "/builder",
      completed: hasCV,
      current: hasProfile && !hasCV,
    },
    {
      id: "opportunity",
      label: "Opportunity",
      description: hasCV
        ? "Browse matched jobs"
        : "Create a CV first to see matched jobs",
      href: "/jobs",
      completed: hasOpportunity,
      current: hasCV && !hasApplication,
    },
    {
      id: "application",
      label: "Application",
      description: hasApplication
        ? `${applications.length} application${applications.length > 1 ? "s" : ""} submitted`
        : "Apply to a job",
      href: "/jobs",
      completed: hasApplication,
      current: hasCV && !hasApplication,
    },
    {
      id: "interview",
      label: "Interview",
      description: hasInterview
        ? "Practice completed"
        : "Practice with AI interviewer",
      href: "/interview",
      completed: hasInterview,
      current: hasApplication && !hasInterview,
    },
  ]

  return steps
}

export function getJourneyProgress(
  cvs: CVData[],
  applications: JobApplication[],
  mockInterviewDone: boolean,
): number {
  const steps = computeCareerJourney(cvs, applications, mockInterviewDone)
  const completed = steps.filter((s) => s.completed).length
  return Math.round((completed / steps.length) * 100)
}
