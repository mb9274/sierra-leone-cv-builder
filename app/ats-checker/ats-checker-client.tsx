"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  FileText,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Shield,
  Award,
  Target,
  BookOpen,
  ArrowLeft,
  FileSearch,
  Zap,
  TrendingUp,
  Plus,
  AlertTriangle,
  Info,
  Lightbulb,
  Upload,
  Briefcase,
} from "lucide-react"
import type { CVData } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"

interface ATSCheckResult {
  score: number
  passed: boolean
  issues: Array<{
    type: "error" | "warning" | "success"
    category: string
    message: string
    recommendation: string
  }>
  strengths: string[]
  improvements: string[]
}

export default function ATSCheckerClient() {
  const router = useRouter()
  const { toast } = useToast()
  const [cvData, setCvData] = useState<CVData | null>(null)
  const [checking, setChecking] = useState(false)
  const [result, setResult] = useState<ATSCheckResult | null>(null)
  const [selectedCV, setSelectedCV] = useState<string>("")
  const [savedCVs, setSavedCVs] = useState<CVData[]>([])
  const [employerMode, setEmployerMode] = useState(false)
  const [testCVText, setTestCVText] = useState("")
  const [testingCV, setTestingCV] = useState(false)
  const [testResult, setTestResult] = useState<any>(null)

  useEffect(() => {
    // Load current CV from preview
    const currentCV = localStorage.getItem("cvbuilder_current")
    if (currentCV) {
      try {
        setCvData(JSON.parse(currentCV))
      } catch (e) {
        console.error("[v0] Failed to parse current CV:", e)
      }
    }

    // Load all saved CVs
    const allCVs = localStorage.getItem("cvbuilder_cvs")
    if (allCVs) {
      try {
        setSavedCVs(JSON.parse(allCVs))
      } catch (e) {
        console.error("[v0] Failed to parse saved CVs:", e)
      }
    }
  }, [])

  const analyzeCVForATS = (cv: CVData): ATSCheckResult => {
    const issues: ATSCheckResult["issues"] = []
    const strengths: string[] = []
    const improvements: string[] = []
    let score = 100

    // Check personal info
    if (!cv.personalInfo.fullName || cv.personalInfo.fullName.length < 3) {
      issues.push({
        type: "error",
        category: "Personal Info",
        message: "Full name is missing or too short",
        recommendation: "Add your complete full name (first name and last name)",
      })
      score -= 10
    } else {
      strengths.push("Complete contact information provided")
    }

    if (!cv.personalInfo.email || !cv.personalInfo.email.includes("@")) {
      issues.push({
        type: "error",
        category: "Contact",
        message: "Valid email address required",
        recommendation: "Add a professional email address",
      })
      score -= 10
    }

    if (!cv.personalInfo.phone || cv.personalInfo.phone.length < 10) {
      issues.push({
        type: "warning",
        category: "Contact",
        message: "Phone number missing or invalid",
        recommendation: "Add your phone number in +232 format",
      })
      score -= 5
    }

    // Check summary
    if (!cv.personalInfo.summary || cv.personalInfo.summary.length < 50) {
      issues.push({
        type: "warning",
        category: "Summary",
        message: "Professional summary is too short",
        recommendation: "Write a compelling 3-5 sentence summary highlighting your key skills and experience",
      })
      score -= 8
      improvements.push("Expand your professional summary to 50-150 words")
    } else if (cv.personalInfo.summary.length > 150) {
      strengths.push("Strong professional summary that highlights key qualifications")
    }

    // Check education
    if (cv.education.length === 0) {
      issues.push({
        type: "warning",
        category: "Education",
        message: "No education history provided",
        recommendation: "Add at least one education entry with institution, degree, and dates",
      })
      score -= 10
      improvements.push("Add your educational background")
    } else {
      strengths.push(`${cv.education.length} education ${cv.education.length === 1 ? "entry" : "entries"} included`)

      // Check education completeness
      cv.education.forEach((edu, idx) => {
        if (!edu.institution || !edu.degree || !edu.fieldOfStudy) {
          issues.push({
            type: "warning",
            category: "Education",
            message: `Education entry ${idx + 1} is incomplete`,
            recommendation: "Include institution name, degree type, and field of study",
          })
          score -= 3
        }
      })
    }

    // Check work experience
    if (cv.experience.length === 0) {
      issues.push({
        type: "warning",
        category: "Experience",
        message: "No work experience listed",
        recommendation: "Add your work history including job titles, companies, dates, and achievements",
      })
      score -= 15
      improvements.push("Add your work experience with detailed descriptions")
    } else {
      strengths.push(
        `${cv.experience.length} work experience ${cv.experience.length === 1 ? "entry" : "entries"} included`,
      )

      // Check experience descriptions
      cv.experience.forEach((exp, idx) => {
        if (!exp.description || exp.description.length < 50) {
          issues.push({
            type: "warning",
            category: "Experience",
            message: `Experience entry ${idx + 1} needs more detail`,
            recommendation:
              "Add 3-5 bullet points describing your responsibilities and achievements using action verbs",
          })
          score -= 5
          improvements.push(`Expand description for ${exp.position} role`)
        }

        // Check for action verbs
        const actionVerbs = [
          "led",
          "managed",
          "developed",
          "created",
          "implemented",
          "improved",
          "increased",
          "reduced",
          "achieved",
        ]
        const hasActionVerbs = actionVerbs.some((verb) => exp.description?.toLowerCase().includes(verb))

        if (!hasActionVerbs) {
          improvements.push(`Use action verbs in ${exp.position} description (e.g., Led, Managed, Developed)`)
          score -= 2
        }
      })
    }

    // Check skills
    if (cv.skills.length < 5) {
      issues.push({
        type: "warning",
        category: "Skills",
        message: "Too few skills listed",
        recommendation: "Add at least 5-10 relevant skills that match job requirements",
      })
      score -= 10
      improvements.push("Add more relevant technical and soft skills")
    } else if (cv.skills.length >= 10) {
      strengths.push(`Strong skills section with ${cv.skills.length} skills listed`)
    } else {
      strengths.push(`${cv.skills.length} skills listed`)
    }

    // Check for keywords
    const importantKeywords = [
      "team",
      "project",
      "management",
      "customer",
      "communication",
      "leadership",
      "problem solving",
    ]
    const cvText = JSON.stringify(cv).toLowerCase()
    const keywordsFound = importantKeywords.filter((keyword) => cvText.includes(keyword))

    if (keywordsFound.length < 3) {
      issues.push({
        type: "warning",
        category: "Keywords",
        message: "Limited industry keywords detected",
        recommendation: "Include relevant keywords like 'team collaboration', 'project management', 'customer service'",
      })
      score -= 7
      improvements.push("Add more industry-specific keywords throughout your CV")
    } else {
      strengths.push(`Good keyword usage - ${keywordsFound.length} important terms found`)
    }

    // Check formatting (ATS-friendly indicators)
    if (!cv.personalInfo.location) {
      issues.push({
        type: "warning",
        category: "Location",
        message: "Location not specified",
        recommendation: "Add your city and country (e.g., Freetown, Sierra Leone)",
      })
      score -= 5
    }

    // Languages check
    if (cv.languages.length === 0) {
      improvements.push("Add language proficiency (e.g., English - Fluent)")
      score -= 3
    } else {
      strengths.push(`${cv.languages.length} language(s) listed`)
    }

    // Ensure score is between 0-100
    score = Math.max(0, Math.min(100, score))

    return {
      score,
      passed: score >= 70,
      issues,
      strengths,
      improvements,
    }
  }

  const handleTestCVText = () => {
    if (!testCVText || testCVText.trim().length < 100) {
      toast({
        title: "Invalid CV Text",
        description: "Please paste a complete CV (at least 100 characters)",
        variant: "destructive",
      })
      return
    }

    setTestingCV(true)

    setTimeout(() => {
      // Analyze CV text for common patterns
      const lowerText = testCVText.toLowerCase()
      let score = 50 // Start at 50

      const analysis: any = {
        issues: [],
        strengths: [],
        improvements: [],
      }

      // Check for basic sections
      if (lowerText.includes("experience") || lowerText.includes("employment")) {
        analysis.strengths.push("Work experience section found")
        score += 10
      } else {
        analysis.issues.push({
          type: "error",
          category: "Structure",
          message: "No work experience section detected",
          recommendation: "Include a clear 'Work Experience' or 'Employment History' section",
        })
        score -= 15
      }

      if (lowerText.includes("education") || lowerText.includes("qualification")) {
        analysis.strengths.push("Education section found")
        score += 10
      } else {
        analysis.issues.push({
          type: "warning",
          category: "Structure",
          message: "No education section detected",
          recommendation: "Include an 'Education' or 'Qualifications' section",
        })
        score -= 10
      }

      if (lowerText.includes("skill")) {
        analysis.strengths.push("Skills section included")
        score += 10
      } else {
        analysis.improvements.push("Add a dedicated skills section")
        score -= 8
      }

      // Check for contact info
      if (lowerText.includes("@") && lowerText.includes(".")) {
        analysis.strengths.push("Email address provided")
        score += 5
      } else {
        analysis.issues.push({
          type: "error",
          category: "Contact",
          message: "No email address found",
          recommendation: "Include a valid email address",
        })
        score -= 10
      }

      if (lowerText.match(/\+232|232\d{8}|\d{3}[-\s]?\d{3}[-\s]?\d{4}/)) {
        analysis.strengths.push("Phone number provided")
        score += 5
      } else {
        analysis.improvements.push("Add a phone number for contact")
        score -= 5
      }

      // Check for action verbs
      const actionVerbs = [
        "led",
        "managed",
        "developed",
        "created",
        "implemented",
        "improved",
        "increased",
        "achieved",
        "coordinated",
        "executed",
      ]
      const foundVerbs = actionVerbs.filter((verb) => lowerText.includes(verb))

      if (foundVerbs.length >= 3) {
        analysis.strengths.push(`Strong action verbs used (${foundVerbs.length} found)`)
        score += 10
      } else {
        analysis.improvements.push("Use more action verbs to describe achievements")
        score -= 5
      }

      // Check length
      if (testCVText.length > 2000) {
        analysis.strengths.push("Comprehensive CV with detailed information")
        score += 5
      } else if (testCVText.length < 500) {
        analysis.issues.push({
          type: "warning",
          category: "Content",
          message: "CV appears too short",
          recommendation: "Expand with more details about experience, skills, and achievements",
        })
        score -= 10
      }

      // Ensure score is 0-100
      score = Math.max(0, Math.min(100, score))

      setTestResult({
        score,
        passed: score >= 70,
        ...analysis,
      })
      setTestingCV(false)

      toast({
        title: "CV Analysis Complete",
        description: `This CV scored ${score}/100`,
      })
    }, 2000)
  }

  const handleCheckCV = () => {
    if (!cvData) {
      toast({
        title: "No CV Selected",
        description: "Please select a CV to check",
        variant: "destructive",
      })
      return
    }

    setChecking(true)

    // Simulate checking process
    setTimeout(() => {
      const analysisResult = analyzeCVForATS(cvData)
      setResult(analysisResult)
      setChecking(false)

      toast({
        title: "ATS Check Complete",
        description: `Your CV scored ${analysisResult.score}/100`,
      })
    }, 2000)
  }

  const handleSelectCV = (cvId: string) => {
    const selected = savedCVs.find((cv) => cv.id === cvId)
    if (selected) {
      setCvData(selected)
      setSelectedCV(cvId)
      setResult(null) // Reset result when switching CVs
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return "bg-green-500"
    if (score >= 60) return "bg-yellow-500"
    return "bg-red-500"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-blue-50/30 to-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={() => router.back()}>
                <ArrowLeft className="mr-2 size-4" />
                Back
              </Button>
              <div className="flex items-center gap-2">
                <FileSearch className="size-8 text-blue-600" />
                <h1 className="text-2xl font-bold">ATS Checker</h1>
              </div>
            </div>
            <Button variant="outline" onClick={() => router.push("/dashboard")}>
              Dashboard
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          <Tabs defaultValue="user" className="mb-8">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="user">
                <FileText className="mr-2 size-4" />
                Check My CV
              </TabsTrigger>
              <TabsTrigger value="employer">
                <Briefcase className="mr-2 size-4" />
                Employer: Test CV
              </TabsTrigger>
            </TabsList>

            <TabsContent value="user" className="space-y-6">
              <Alert className="border-yellow-200 bg-yellow-50">
                <Lightbulb className="size-5 text-yellow-600" />
                <AlertTitle className="text-lg font-bold text-yellow-900">
                  How to Create a Professional CV That Gets You Hired
                </AlertTitle>
                <AlertDescription className="mt-4 space-y-3 text-yellow-900">
                  <div className="space-y-2">
                    <p className="font-semibold flex items-center gap-2">
                      <AlertTriangle className="size-4" />
                      Critical: Avoid These Common CV Mistakes
                    </p>
                    <ul className="list-disc list-inside space-y-1 ml-4 text-sm">
                      <li>
                        <strong>Typos and grammar errors</strong> - 58% of CVs are rejected due to spelling mistakes
                      </li>
                      <li>
                        <strong>Using unprofessional email</strong> - Use firstname.lastname@email.com, not
                        coolguy123@email.com
                      </li>
                      <li>
                        <strong>Including photos unless requested</strong> - Focus on skills, not appearance
                      </li>
                      <li>
                        <strong>Lying about skills/experience</strong> - Employers verify everything, be honest
                      </li>
                      <li>
                        <strong>Generic CV for all jobs</strong> - Customize for each position
                      </li>
                      <li>
                        <strong>Missing contact information</strong> - Always include phone (+232 format) and email
                      </li>
                    </ul>
                  </div>

                  <div className="space-y-2 mt-4">
                    <p className="font-semibold flex items-center gap-2">
                      <CheckCircle2 className="size-4" />
                      What Employers in Sierra Leone Look For
                    </p>
                    <ul className="list-disc list-inside space-y-1 ml-4 text-sm">
                      <li>
                        <strong>Clear structure:</strong> Contact Info → Summary → Experience → Education → Skills
                      </li>
                      <li>
                        <strong>Quantified achievements:</strong> "Increased sales by 30%" not "Responsible for sales"
                      </li>
                      <li>
                        <strong>Action verbs:</strong> Led, Managed, Developed, Implemented, Achieved
                      </li>
                      <li>
                        <strong>Relevant skills:</strong> Match skills to the job description
                      </li>
                      <li>
                        <strong>Professional summary:</strong> 3-5 sentences highlighting your best qualities
                      </li>
                      <li>
                        <strong>Education details:</strong> Institution, degree, graduation date, GPA (if 3.0+)
                      </li>
                    </ul>
                  </div>

                  <div className="space-y-2 mt-4">
                    <p className="font-semibold flex items-center gap-2">
                      <Info className="size-4" />
                      Sierra Leone Employers Prefer:
                    </p>
                    <ul className="list-disc list-inside space-y-1 ml-4 text-sm">
                      <li>CVs that are 1-2 pages (not more than 3 pages)</li>
                      <li>Phone numbers in +232 format (e.g., +232 76 123 456)</li>
                      <li>Clear mention of location (Freetown, Bo, Makeni, etc.)</li>
                      <li>Language skills (English proficiency level)</li>
                      <li>References available upon request (don't list full details)</li>
                      <li>Simple, clean formatting - no fancy designs or colors</li>
                    </ul>
                  </div>

                  <div className="mt-4 p-3 bg-white rounded border border-yellow-300">
                    <p className="font-semibold text-sm">💡 Pro Tip:</p>
                    <p className="text-sm mt-1">
                      Before applying, research the company. Mention specific reasons why you want to work there in your
                      cover letter. This shows genuine interest and increases your chances by 40%!
                    </p>
                  </div>
                </AlertDescription>
              </Alert>

              {/* Info Banner */}
              <Card className="mb-8 border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <Shield className="size-12 text-blue-600 flex-shrink-0" />
                    <div>
                      <h2 className="text-2xl font-bold text-foreground mb-2">
                        Applicant Tracking System (ATS) Checker
                      </h2>
                      <p className="text-muted-foreground mb-4">
                        Most employers in Sierra Leone use ATS software to screen CVs before humans see them. Our
                        checker analyzes your CV to ensure it passes these automated systems and reaches hiring
                        managers.
                      </p>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="size-5 text-green-600" />
                          <span className="text-sm">Format Analysis</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Target className="size-5 text-blue-600" />
                          <span className="text-sm">Keyword Optimization</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Award className="size-5 text-yellow-600" />
                          <span className="text-sm">Industry Standards</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* CV Selection */}
              {savedCVs.length > 0 && !cvData && (
                <Card className="mb-8">
                  <CardHeader>
                    <CardTitle>Select a CV to Check</CardTitle>
                    <CardDescription>Choose one of your saved CVs to analyze</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4">
                      {savedCVs.map((cv) => (
                        <Card
                          key={cv.id}
                          className={`cursor-pointer transition-all hover:border-blue-500 ${selectedCV === cv.id ? "border-blue-500 bg-blue-50" : ""
                            }`}
                          onClick={() => handleSelectCV(cv.id)}
                        >
                          <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                              <div>
                                <h3 className="font-semibold text-lg">{cv.personalInfo.fullName}</h3>
                                <p className="text-sm text-muted-foreground">
                                  {cv.experience.length} experience • {cv.skills.length} skills
                                </p>
                              </div>
                              <FileText className="size-8 text-blue-600" />
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Check Button */}
              {cvData && !result && (
                <Card className="mb-8">
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <FileSearch className="size-20 text-blue-600 mx-auto mb-4" />
                      <h3 className="text-2xl font-bold mb-2">Ready to Check Your CV</h3>
                      <p className="text-muted-foreground mb-6">
                        We'll analyze your CV for: Format compatibility • Keyword optimization • Content quality • ATS
                        best practices
                      </p>
                      <Button
                        size="lg"
                        onClick={handleCheckCV}
                        disabled={checking}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        {checking ? (
                          <>
                            <Zap className="mr-2 size-5 animate-pulse" />
                            Analyzing CV...
                          </>
                        ) : (
                          <>
                            <FileSearch className="mr-2 size-5" />
                            Check My CV
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Results */}
              {result && (
                <>
                  {/* Score Card */}
                  <Card className="mb-8 border-2">
                    <CardContent className="pt-6">
                      <div className="text-center mb-6">
                        <div className={`text-6xl font-bold mb-2 ${getScoreColor(result.score)}`}>
                          {result.score}/100
                        </div>
                        <div className="flex items-center justify-center gap-2 mb-4">
                          {result.passed ? (
                            <>
                              <CheckCircle2 className="size-6 text-green-600" />
                              <span className="text-xl font-semibold text-green-600">ATS Compatible</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="size-6 text-red-600" />
                              <span className="text-xl font-semibold text-red-600">Needs Improvement</span>
                            </>
                          )}
                        </div>
                        <Progress value={result.score} className="h-3" />
                        <p className="text-muted-foreground mt-4">
                          {result.passed
                            ? "Your CV meets ATS standards and should pass most automated screening systems."
                            : "Your CV may have trouble passing ATS filters. Review the recommendations below."}
                        </p>
                      </div>

                      <div className="grid md:grid-cols-3 gap-4">
                        <div className="text-center p-4 bg-red-50 rounded-lg">
                          <XCircle className="size-8 text-red-600 mx-auto mb-2" />
                          <div className="text-2xl font-bold text-red-600">
                            {result.issues.filter((i) => i.type === "error").length}
                          </div>
                          <div className="text-sm text-muted-foreground">Critical Issues</div>
                        </div>
                        <div className="text-center p-4 bg-yellow-50 rounded-lg">
                          <AlertCircle className="size-8 text-yellow-600 mx-auto mb-2" />
                          <div className="text-2xl font-bold text-yellow-600">
                            {result.issues.filter((i) => i.type === "warning").length}
                          </div>
                          <div className="text-sm text-muted-foreground">Warnings</div>
                        </div>
                        <div className="text-center p-4 bg-green-50 rounded-lg">
                          <CheckCircle2 className="size-8 text-green-600 mx-auto mb-2" />
                          <div className="text-2xl font-bold text-green-600">{result.strengths.length}</div>
                          <div className="text-sm text-muted-foreground">Strengths</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Strengths */}
                  {result.strengths.length > 0 && (
                    <Card className="mb-6">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <CheckCircle2 className="size-6 text-green-600" />
                          What's Working Well
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {result.strengths.map((strength, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <CheckCircle2 className="size-5 text-green-600 mt-0.5 flex-shrink-0" />
                              <span>{strength}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  )}

                  {/* Issues */}
                  {result.issues.length > 0 && (
                    <Card className="mb-6">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <AlertCircle className="size-6 text-yellow-600" />
                          Issues Found ({result.issues.length})
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {result.issues.map((issue, idx) => (
                            <div
                              key={idx}
                              className={`p-4 rounded-lg ${issue.type === "error"
                                ? "bg-red-50 border border-red-200"
                                : "bg-yellow-50 border border-yellow-200"
                                }`}
                            >
                              <div className="flex items-start gap-3">
                                {issue.type === "error" ? (
                                  <XCircle className="size-5 text-red-600 mt-0.5 flex-shrink-0" />
                                ) : (
                                  <AlertCircle className="size-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                                )}
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <Badge variant="outline">{issue.category}</Badge>
                                    <span className="font-semibold">{issue.message}</span>
                                  </div>
                                  <p className="text-sm text-muted-foreground">
                                    <strong>Fix:</strong> {issue.recommendation}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Improvements */}
                  {result.improvements.length > 0 && (
                    <Card className="mb-6">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <TrendingUp className="size-6 text-blue-600" />
                          Suggested Improvements
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {result.improvements.map((improvement, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <TrendingUp className="size-5 text-blue-600 mt-0.5 flex-shrink-0" />
                              <span>{improvement}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  )}

                  {/* Actions */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Next Steps</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-2 gap-4">
                        <Button
                          variant="outline"
                          onClick={() => {
                            localStorage.setItem("cvbuilder_current", JSON.stringify(cvData))
                            router.push("/builder")
                          }}
                          className="h-auto py-4"
                        >
                          <div className="text-left">
                            <div className="font-semibold flex items-center gap-2 mb-1">
                              <FileText className="size-5" />
                              Edit Your CV
                            </div>
                            <div className="text-sm text-muted-foreground">
                              Make improvements based on recommendations
                            </div>
                          </div>
                        </Button>
                        <Button variant="outline" onClick={() => router.push("/learning")} className="h-auto py-4">
                          <div className="text-left">
                            <div className="font-semibold flex items-center gap-2 mb-1">
                              <BookOpen className="size-5" />
                              Learn Best Practices
                            </div>
                            <div className="text-sm text-muted-foreground">
                              Take courses on CV writing and job search
                            </div>
                          </div>
                        </Button>
                      </div>
                      <Button onClick={() => setResult(null)} variant="ghost" className="w-full mt-4">
                        Check Another CV
                      </Button>
                    </CardContent>
                  </Card>
                </>
              )}

              {/* Empty State */}
              {!cvData && savedCVs.length === 0 && (
                <Card>
                  <CardContent className="pt-12 pb-12 text-center">
                    <FileText className="size-20 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-2xl font-bold mb-2">No CVs Found</h3>
                    <p className="text-muted-foreground mb-6">
                      Create your first CV to start checking ATS compatibility
                    </p>
                    <Button onClick={() => router.push("/builder")} size="lg" className="bg-blue-600 hover:bg-blue-700">
                      <Plus className="mr-2 size-5" />
                      Create Your CV
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="employer" className="space-y-6">
              <Alert className="border-blue-200 bg-blue-50">
                <Briefcase className="size-5 text-blue-600" />
                <AlertTitle className="text-lg font-bold">Employer CV Testing Tool</AlertTitle>
                <AlertDescription className="mt-2">
                  Quickly evaluate candidate CVs for quality, completeness, and ATS compatibility. Paste the CV text
                  below to get an instant analysis with scoring and recommendations.
                </AlertDescription>
              </Alert>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Upload className="size-5" />
                    Test Candidate CV
                  </CardTitle>
                  <CardDescription>
                    Paste the candidate's CV text below to analyze its quality and ATS compatibility
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Textarea
                    placeholder="Paste the candidate's CV text here...&#10;&#10;Include all sections: Contact Info, Summary, Experience, Education, Skills, etc."
                    value={testCVText}
                    onChange={(e) => setTestCVText(e.target.value)}
                    rows={12}
                    className="font-mono text-sm"
                  />
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      {testCVText.length} characters • {Math.floor(testCVText.split(/\s+/).length)} words
                    </span>
                    <Button
                      onClick={handleTestCVText}
                      disabled={testingCV || testCVText.length < 100}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      {testingCV ? (
                        <>
                          <Zap className="mr-2 size-4 animate-pulse" />
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <FileSearch className="mr-2 size-4" />
                          Test This CV
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {testResult && (
                <>
                  <Card className="border-2">
                    <CardContent className="pt-6">
                      <div className="text-center mb-6">
                        <div className={`text-6xl font-bold mb-2 ${getScoreColor(testResult.score)}`}>
                          {testResult.score}/100
                        </div>
                        <div className="flex items-center justify-center gap-2 mb-4">
                          {testResult.passed ? (
                            <>
                              <CheckCircle2 className="size-6 text-green-600" />
                              <span className="text-xl font-semibold text-green-600">Strong Candidate CV</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="size-6 text-red-600" />
                              <span className="text-xl font-semibold text-red-600">CV Needs Improvement</span>
                            </>
                          )}
                        </div>
                        <Progress value={testResult.score} className="h-3" />
                      </div>

                      <div className="grid md:grid-cols-3 gap-4">
                        <div className="text-center p-4 bg-red-50 rounded-lg">
                          <XCircle className="size-8 text-red-600 mx-auto mb-2" />
                          <div className="text-2xl font-bold text-red-600">{testResult.issues.length}</div>
                          <div className="text-sm text-muted-foreground">Issues Found</div>
                        </div>
                        <div className="text-center p-4 bg-green-50 rounded-lg">
                          <CheckCircle2 className="size-8 text-green-600 mx-auto mb-2" />
                          <div className="text-2xl font-bold text-green-600">{testResult.strengths.length}</div>
                          <div className="text-sm text-muted-foreground">Strengths</div>
                        </div>
                        <div className="text-center p-4 bg-blue-50 rounded-lg">
                          <TrendingUp className="size-8 text-blue-600 mx-auto mb-2" />
                          <div className="text-2xl font-bold text-blue-600">{testResult.improvements.length}</div>
                          <div className="text-sm text-muted-foreground">Improvements</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {testResult.strengths.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <CheckCircle2 className="size-5 text-green-600" />
                          CV Strengths
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {testResult.strengths.map((strength: string, idx: number) => (
                            <li key={idx} className="flex items-start gap-2">
                              <CheckCircle2 className="size-5 text-green-600 mt-0.5 flex-shrink-0" />
                              <span>{strength}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  )}

                  {testResult.issues.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <AlertCircle className="size-5 text-red-600" />
                          Issues & Recommendations
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {testResult.issues.map((issue: any, idx: number) => (
                            <div
                              key={idx}
                              className={`p-4 rounded-lg ${issue.type === "error"
                                ? "bg-red-50 border border-red-200"
                                : "bg-yellow-50 border border-yellow-200"
                                }`}
                            >
                              <div className="flex items-start gap-3">
                                {issue.type === "error" ? (
                                  <XCircle className="size-5 text-red-600 mt-0.5 flex-shrink-0" />
                                ) : (
                                  <AlertCircle className="size-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                                )}
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <Badge variant="outline">{issue.category}</Badge>
                                  </div>
                                  <p className="font-semibold mb-1">{issue.message}</p>
                                  <p className="text-sm text-muted-foreground">{issue.recommendation}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {testResult.improvements.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <TrendingUp className="size-5 text-blue-600" />
                          Suggested Improvements
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {testResult.improvements.map((improvement: string, idx: number) => (
                            <li key={idx} className="flex items-start gap-2">
                              <Lightbulb className="size-5 text-blue-600 mt-0.5 flex-shrink-0" />
                              <span>{improvement}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  )}

                  <div className="flex gap-4">
                    <Button
                      onClick={() => {
                        setTestCVText("")
                        setTestResult(null)
                      }}
                      variant="outline"
                      className="flex-1"
                    >
                      Test Another CV
                    </Button>
                  </div>
                </>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <Toaster />
    </div>
  )
}
