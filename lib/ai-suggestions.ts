import type { CVData, Job } from "./types"

export const getAISuggestions = {
  summary: (education: string, experience: string) => {
    const suggestions = [
      `Recent ${education} graduate with hands-on experience in ${experience}, seeking to leverage academic knowledge and practical skills in a dynamic professional environment.`,
      `Motivated professional with a strong foundation in ${education} and proven track record in ${experience}, committed to delivering excellence and continuous learning.`,
      `Ambitious ${education} graduate combining theoretical knowledge with practical ${experience} experience, ready to contribute innovative solutions to organizational challenges.`,
    ]
    return suggestions
  },

  experience: (position: string) => {
    const templates: Record<string, string[]> = {
      default: [
        "Collaborated with cross-functional teams to deliver high-quality results within tight deadlines",
        "Implemented innovative solutions that improved operational efficiency by measurable metrics",
        "Demonstrated strong problem-solving abilities in fast-paced, dynamic environments",
      ],
      intern: [
        "Assisted senior team members with daily operations and special projects",
        "Gained hands-on experience in professional workflows and industry best practices",
        "Contributed to team success through dedicated learning and proactive participation",
      ],
      volunteer: [
        "Coordinated community initiatives that served over 100+ beneficiaries",
        "Developed organizational and leadership skills through volunteer coordination",
        "Made meaningful impact through dedicated service and community engagement",
      ],
    }

    const key = position.toLowerCase().includes("intern")
      ? "intern"
      : position.toLowerCase().includes("volunteer")
        ? "volunteer"
        : "default"

    return templates[key]
  },

  skills: (field: string) => {
    const skillSets: Record<string, string[]> = {
      "computer science": ["JavaScript", "Python", "React", "Node.js", "SQL", "Git", "Problem Solving"],
      business: ["Microsoft Office", "Project Management", "Data Analysis", "Communication", "Leadership"],
      engineering: ["AutoCAD", "MATLAB", "Technical Writing", "Project Design", "Problem Solving"],
      default: ["Communication", "Teamwork", "Time Management", "Problem Solving", "Adaptability"],
    }

    const key = Object.keys(skillSets).find((k) => field.toLowerCase().includes(k)) || "default"
    return skillSets[key]
  },
}

export const scanCVForJobs = (cv: CVData, jobs: Job[]): Job[] => {
  return jobs
    .map((job) => {
      const cvText = `${cv.personalInfo.summary || ""} ${cv.skills.join(" ")} ${cv.experience.map((e) => e.description || "").join(" ")}`

      // Simple keyword matching
      let score = 0
      job.requirements.forEach((req) => {
        if (cvText.toLowerCase().includes(req.toLowerCase())) {
          score += 20
        }
      })

      return { ...job, matchScore: Math.min(score, 95) }
    })
    .sort((a, b) => b.matchScore - a.matchScore)
}
