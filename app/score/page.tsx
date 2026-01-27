"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, CheckCircle2, AlertCircle, Loader2, ArrowLeft } from "lucide-react"
import type { CVData } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { analyzeCVScore } from "@/lib/ai-helpers"

interface CVScores {
  atsScore: number
  atsExplanation: string
  toneScore: number
  toneExplanation: string
  grammarScore: number
  grammarExplanation: string
  matchScore: number
  matchExplanation: string
  improvements: string[]
}

export default function CVScorePage() {
  const router = useRouter()
  const { toast } = useToast()
  const [cv, setCv] = useState<CVData | null>(null)
  const [scores, setScores] = useState<CVScores | null>(null)
  const [loading, setLoading] = useState(false)
  const [showImprovements, setShowImprovements] = useState(false)

  useEffect(() => {
    const savedCV = localStorage.getItem("cvbuilder_current")
    if (savedCV) {
      const cvData = JSON.parse(savedCV)
      setCv(cvData)
    } else {
      toast({
        title: "No CV Found",
        description: "Please select a CV from your dashboard.",
        variant: "destructive",
      })
      router.push("/dashboard")
    }
  }, [])

  const analyzeCV = async (cvData: CVData) => {
    setLoading(true)
    try {
      // Simulate brief loading for better UX
      await new Promise((resolve) => setTimeout(resolve, 800))

      const scores = analyzeCVScore(cvData)
      setScores(scores)
    } catch (error) {
      console.error("Error analyzing CV:", error)
      toast({
        title: "Analysis Failed",
        description: "Could not analyze your CV. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const getScoreIcon = (score: number) => {
    if (score >= 80) return <CheckCircle2 className="size-6 text-green-600" />
    return <AlertCircle className="size-6 text-yellow-600" />
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="size-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-xl text-muted-foreground">Analyzing your CV...</p>
        </div>
      </div>
    )
  }

  if (!scores && cv) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
        <header className="border-b border-border bg-card/50 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="size-10 rounded-lg bg-primary flex items-center justify-center">
                <FileText className="size-6 text-primary-foreground" />
              </div>
              <h1 className="text-2xl font-bold text-foreground">CV Score</h1>
            </div>
            <Button variant="outline" onClick={() => router.push("/dashboard")}>
              <ArrowLeft className="mr-2 size-4" />
              Back to Dashboard
            </Button>
          </div>
        </header>

        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <h2 className="text-4xl font-bold text-foreground">Ready to Analyze Your CV?</h2>
            <p className="text-xl text-muted-foreground">
              Get instant feedback on your CV's ATS compatibility, tone, grammar, and job match score.
            </p>
            <Button size="lg" onClick={() => cv && analyzeCV(cv)} className="mt-6">
              Analyze My CV
            </Button>
          </div>
        </div>

        <Toaster />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="size-10 rounded-lg bg-primary flex items-center justify-center">
              <FileText className="size-6 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">CV Score</h1>
          </div>
          <Button variant="outline" onClick={() => router.push("/dashboard")}>
            <ArrowLeft className="mr-2 size-4" />
            Back to Dashboard
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-foreground mb-4">CV Analysis Results</h2>
          <p className="text-xl text-muted-foreground mb-8">See how your CV performs across key metrics</p>

          {scores && (
            <>
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                {/* ATS Score */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>ATS Score</CardTitle>
                      {getScoreIcon(scores.atsScore)}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className={`text-5xl font-bold mb-4 ${getScoreColor(scores.atsScore)}`}>{scores.atsScore}</div>
                    <p className="text-muted-foreground">{scores.atsExplanation}</p>
                  </CardContent>
                </Card>

                {/* Professional Tone Score */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Professional Tone</CardTitle>
                      {getScoreIcon(scores.toneScore)}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className={`text-5xl font-bold mb-4 ${getScoreColor(scores.toneScore)}`}>
                      {scores.toneScore}
                    </div>
                    <p className="text-muted-foreground">{scores.toneExplanation}</p>
                  </CardContent>
                </Card>

                {/* Grammar Score */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Grammar Score</CardTitle>
                      {getScoreIcon(scores.grammarScore)}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className={`text-5xl font-bold mb-4 ${getScoreColor(scores.grammarScore)}`}>
                      {scores.grammarScore}
                    </div>
                    <p className="text-muted-foreground">{scores.grammarExplanation}</p>
                  </CardContent>
                </Card>

                {/* Job Match Score */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Job Match Score</CardTitle>
                      {getScoreIcon(scores.matchScore)}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className={`text-5xl font-bold mb-4 ${getScoreColor(scores.matchScore)}`}>
                      {scores.matchScore}
                    </div>
                    <p className="text-muted-foreground">{scores.matchExplanation}</p>
                  </CardContent>
                </Card>
              </div>

              {/* Improvements Section */}
              <Card className="border-2">
                <CardHeader>
                  <CardTitle className="text-2xl">AI Suggestions</CardTitle>
                  <CardDescription>Recommendations to improve your CV</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button onClick={() => setShowImprovements(!showImprovements)} className="mb-4">
                    {showImprovements ? "Hide" : "Show"} Improvement Tips
                  </Button>

                  {showImprovements && (
                    <div className="space-y-3">
                      {scores.improvements.map((improvement, index) => (
                        <div key={index} className="flex gap-3 p-4 bg-muted/50 rounded-lg">
                          <div className="flex-shrink-0 size-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                            {index + 1}
                          </div>
                          <p className="text-foreground">{improvement}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              <div className="mt-8 flex gap-4">
                <Button size="lg" onClick={() => router.push("/builder")}>
                  Improve My CV
                </Button>
                <Button size="lg" variant="outline" onClick={() => router.push("/jobs")}>
                  Find Jobs
                </Button>
              </div>
            </>
          )}
        </div>
      </div>

      <Toaster />
    </div>
  )
}
