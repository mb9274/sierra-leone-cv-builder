import type { CVData } from "./types"

// Generate professional summary suggestions
export function generateSummary(context: { name?: string; education?: any[]; experience?: any[] }): string {
  const { name, education, experience } = context
  const degree = education?.[0]?.degree || "Bachelor's Degree"
  const field = education?.[0]?.fieldOfStudy || "your field"
  const yearsExp = experience?.length || 0

  const templates = [
    `Results-driven professional with ${degree} in ${field} and ${yearsExp}+ years of experience. Proven track record in delivering high-quality work and exceeding expectations. Strong analytical and problem-solving skills with excellent communication abilities.`,
    `Motivated ${field} graduate with ${yearsExp}+ years of hands-on experience. Demonstrated expertise in project management, team collaboration, and strategic planning. Committed to continuous learning and professional development.`,
    `Dynamic professional with ${degree} in ${field}. ${yearsExp}+ years of experience in delivering innovative solutions and driving organizational success. Excellent interpersonal skills and ability to work in fast-paced environments.`,
  ]

  return templates[Math.floor(Math.random() * templates.length)]
}

// Generate experience bullet points
export function generateExperienceSuggestions(context: { role?: string; company?: string }): string[] {
  const { role, company } = context

  return [
    `Led cross-functional team initiatives that improved operational efficiency by 25%, resulting in significant cost savings and enhanced productivity.`,
    `Developed and implemented strategic solutions that increased customer satisfaction scores by 30% and reduced response times by 40%.`,
    `Collaborated with stakeholders to deliver high-impact projects on time and within budget, managing resources effectively across multiple departments.`,
    `Analyzed complex data sets to identify trends and opportunities, providing actionable insights that drove business growth and informed decision-making.`,
    `Mentored junior team members and facilitated knowledge-sharing sessions, contributing to a culture of continuous improvement and professional development.`,
  ]
}

// Generate skills suggestions
export function generateSkills(context: { education?: any[]; experience?: any[] }): string[] {
  const education = context.education?.[0]
  const hasExperience = (context.experience?.length || 0) > 0

  const skillSets = {
    technical: [
      "Microsoft Office Suite",
      "Data Analysis",
      "Project Management",
      "Research & Documentation",
      "Quality Assurance",
    ],
    soft: ["Communication", "Team Collaboration", "Problem Solving", "Time Management", "Leadership"],
    industry: ["Strategic Planning", "Process Improvement", "Stakeholder Management", "Report Writing", "Budgeting"],
  }

  const skills = [...skillSets.technical.slice(0, 3), ...skillSets.soft.slice(0, 3), ...skillSets.industry.slice(0, 2)]

  return skills
}

// Analyze CV and return scores
export function analyzeCVScore(cvData: CVData) {
  let atsScore = 50
  let toneScore = 60
  let grammarScore = 70
  let matchScore = 60

  const improvements: string[] = []

  // ATS Score calculation
  if (cvData.personalInfo.email && cvData.personalInfo.phone) atsScore += 10
  if (cvData.education.length > 0) atsScore += 10
  if (cvData.experience.length > 0) atsScore += 15
  if (cvData.skills.length >= 5) atsScore += 15

  // Tone Score
  if (cvData.personalInfo.summary && cvData.personalInfo.summary.length > 50) toneScore += 20
  if (cvData.experience.some((exp) => exp.description && exp.description.length > 100)) toneScore += 20

  // Grammar Score
  if (cvData.personalInfo.summary && !cvData.personalInfo.summary.match(/\b(i|me|my)\b/i)) grammarScore += 10
  if (cvData.experience.length > 0) grammarScore += 20

  // Match Score
  if (cvData.skills.length >= 8) matchScore += 20
  if (cvData.experience.length >= 2) matchScore += 20

  // Generate improvements
  if (atsScore < 80) {
    improvements.push(
      "Add more relevant keywords from job descriptions to improve ATS compatibility. Include industry-specific terms and action verbs.",
    )
  }
  if (toneScore < 80) {
    improvements.push(
      "Use stronger action verbs and quantify your achievements with specific metrics and percentages where possible.",
    )
  }
  if (grammarScore < 80) {
    improvements.push(
      "Review for consistency in tense usage, bullet point formatting, and remove any first-person pronouns.",
    )
  }
  if (matchScore < 80) {
    improvements.push(
      "Add more skills that are commonly required in Sierra Leone job market, such as Microsoft Office, Communication, and Project Management.",
    )
  }
  if (cvData.experience.length === 0) {
    improvements.push(
      "Add work experience, internships, or volunteer positions to demonstrate your practical skills and dedication.",
    )
  }

  return {
    atsScore: Math.min(atsScore, 100),
    atsExplanation:
      atsScore >= 80
        ? "Your CV is well-formatted for Applicant Tracking Systems with relevant keywords and clear sections."
        : "Your CV needs more relevant keywords and better formatting to pass ATS filters effectively.",
    toneScore: Math.min(toneScore, 100),
    toneExplanation:
      toneScore >= 80
        ? "Your CV maintains a professional tone throughout with strong action verbs and clear accomplishments."
        : "Consider using more powerful action verbs and specific achievements to strengthen your professional tone.",
    grammarScore: Math.min(grammarScore, 100),
    grammarExplanation:
      grammarScore >= 80
        ? "Your CV demonstrates excellent grammar, consistency, and professional writing standards."
        : "Review your CV for consistency in tense, formatting, and ensure all sections follow professional writing conventions.",
    matchScore: Math.min(matchScore, 100),
    matchExplanation:
      matchScore >= 80
        ? "Your skills and experience align well with common job requirements in Sierra Leone's market."
        : "Consider adding more relevant skills and experience that match typical job requirements in your field.",
    improvements,
  }
}

// Generate interview questions
export function generateInterviewQuestions(cvData: CVData) {
  const role = cvData.experience[0]?.position || "this position"
  const field = cvData.education[0]?.fieldOfStudy || "your field"

  return {
    commonQuestions: [
      {
        question: "Tell me about yourself.",
        modelAnswer: `I am a motivated professional with a ${cvData.education[0]?.degree || "degree"} in ${field}. ${cvData.experience.length > 0 ? `I have experience in ${role} where I developed strong skills in team collaboration and problem-solving.` : "I am eager to apply my academic knowledge in a professional setting."} I am passionate about contributing to organizational success and continuous learning.`,
      },
      {
        question: "Why do you want to work for our company?",
        modelAnswer:
          "I am impressed by your company's commitment to innovation and community development in Sierra Leone. Your values align with my professional goals, and I believe my skills would contribute meaningfully to your team's success. I am particularly excited about the opportunity to grow with an organization that values employee development.",
      },
      {
        question: "What are your greatest strengths?",
        modelAnswer: `My greatest strengths include ${cvData.skills.slice(0, 3).join(", ")}. I am a quick learner who adapts well to new challenges and works effectively both independently and as part of a team. I take pride in delivering high-quality work and meeting deadlines consistently.`,
      },
    ],
    technicalQuestions: [
      {
        question: `What experience do you have with ${cvData.skills[0] || "the key skills"} required for this role?`,
        modelAnswer: `${cvData.experience.length > 0 ? `In my role as ${role}, I regularly used ${cvData.skills[0]} to accomplish tasks and deliver results.` : `During my studies, I developed strong proficiency in ${cvData.skills[0]} through coursework and projects.`} I am committed to staying current with industry best practices and continuously improving my technical abilities.`,
      },
      {
        question: "How do you stay updated with developments in your field?",
        modelAnswer:
          "I actively follow industry publications, participate in professional networks, and take online courses to enhance my skills. I believe in continuous learning and regularly seek opportunities to expand my knowledge through workshops, seminars, and peer collaboration.",
      },
      {
        question: "Describe a challenging technical problem you solved.",
        modelAnswer:
          "I once faced a situation where standard approaches were not yielding results. I took initiative to research alternative solutions, consulted with colleagues, and tested different methodologies. Through persistence and analytical thinking, I identified an innovative approach that successfully resolved the issue and improved our process efficiency.",
      },
    ],
    projectQuestions: [
      {
        question: `Tell me about a significant project or achievement from your ${cvData.experience.length > 0 ? "work experience" : "studies"}.`,
        modelAnswer: `${cvData.experience.length > 0 ? `During my time as ${role}, I led a project that required careful planning and coordination.` : "During my academic studies, I completed a comprehensive project that demonstrated my abilities."} I collaborated with team members, managed timelines effectively, and delivered results that exceeded expectations. This experience taught me valuable lessons about leadership, communication, and problem-solving.`,
      },
      {
        question: "How do you handle tight deadlines and pressure?",
        modelAnswer:
          "I thrive under pressure by staying organized and prioritizing tasks effectively. I break large projects into manageable steps, communicate proactively with stakeholders, and maintain focus on quality while meeting deadlines. I view challenging situations as opportunities to demonstrate my capabilities and resilience.",
      },
      {
        question: "Describe a time when you worked as part of a team.",
        modelAnswer:
          "I have always valued teamwork and collaboration. In previous experiences, I contributed my skills while respecting others' perspectives and expertise. I believe effective communication, mutual support, and shared accountability are essential for team success. I am comfortable both leading initiatives and supporting colleagues as needed.",
      },
    ],
  }
}
