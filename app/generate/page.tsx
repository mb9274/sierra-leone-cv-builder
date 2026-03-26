"use client"
export const dynamic = "force-dynamic"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/hooks/use-toast"
import { saveLocalCv } from "@/lib/cv-collection"
import { sanitizeCvRecord } from "@/lib/cv-storage"
import type { CVData } from "@/lib/types"
import { ArrowLeft, WandSparkles, Loader2, UserRound, Mail, Phone, MapPin, BriefcaseBusiness, GraduationCap, Sparkles } from "lucide-react"

type GenerateForm = {
  fullName: string
  email: string
  phone: string
  location: string
  jobTitle: string
  experience: string
  education: string
  skills: string
  careerGoals: string
}

const initialForm: GenerateForm = {
  fullName: "",
  email: "",
  phone: "",
  location: "",
  jobTitle: "",
  experience: "",
  education: "",
  skills: "",
  careerGoals: "",
}

export default function GeneratePage() {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [checkingAuth, setCheckingAuth] = useState(true)
  const [form, setForm] = useState<GenerateForm>(initialForm)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/session", { cache: "no-store" })
        if (response.status === 401) {
          router.push("/auth/sign-in?next=/generate")
          return
        }
      } finally {
        setCheckingAuth(false)
      }
    }

    checkAuth()
  }, [router])

  const handleChange = (field: keyof GenerateForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleGenerate = async () => {
    if (!form.fullName.trim() || !form.email.trim()) {
      toast({
        title: "Missing information",
        description: "Full name and email are required to generate your CV.",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      const response = await fetch("/api/cv/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: form.fullName.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          location: form.location.trim(),
          jobTitle: form.jobTitle.trim(),
          experience: form.experience.trim(),
          education: form.education.trim(),
          skills: form.skills.trim(),
          careerGoals: form.careerGoals.trim(),
        }),
      })

      const result = await response.json().catch(() => null)

      if (!response.ok) {
        throw new Error(result?.error || "Failed to generate CV")
      }

      const generatedCv: CVData = sanitizeCvRecord(result.data)
      sessionStorage.setItem("cvbuilder_current", JSON.stringify(generatedCv))
      saveLocalCv(generatedCv)

      toast({
        title: "CV generated",
        description: "Your full AI-generated CV is ready.",
      })

      router.push("/preview")
    } catch (error) {
      toast({
        title: "Generation failed",
        description: error instanceof Error ? error.message : "Unable to generate CV right now.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex items-center gap-3 text-slate-500">
          <Loader2 className="size-5 animate-spin" />
          Checking your session...
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#f8fafc,_#e2e8f0_60%,_#cbd5e1)]">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between">
          <Button variant="outline" onClick={() => router.push("/dashboard")} className="bg-white/80 backdrop-blur">
            <ArrowLeft className="mr-2 size-4" />
            Back to Dashboard
          </Button>
          <div className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white">
            <WandSparkles className="size-3.5" />
            AI CV Generator
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <Card className="border-0 bg-white/90 shadow-2xl backdrop-blur">
            <CardHeader className="pb-4">
              <CardTitle className="text-3xl">Generate a full CV</CardTitle>
              <CardDescription className="text-base">
                Enter your details and let AI build the first complete version of your CV.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid gap-5 md:grid-cols-2">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <UserRound className="size-4" />
                    Full Name
                  </Label>
                  <Input
                    value={form.fullName}
                    onChange={(e) => handleChange("fullName", e.target.value)}
                    placeholder="Your full name"
                    className="h-12"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Mail className="size-4" />
                    Email
                  </Label>
                  <Input
                    type="email"
                    value={form.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    placeholder="you@example.com"
                    className="h-12"
                  />
                </div>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Phone className="size-4" />
                    Phone
                  </Label>
                  <Input
                    value={form.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    placeholder="+232 77 123456"
                    className="h-12"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <MapPin className="size-4" />
                    Location
                  </Label>
                  <Input
                    value={form.location}
                    onChange={(e) => handleChange("location", e.target.value)}
                    placeholder="Freetown, Sierra Leone"
                    className="h-12"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <BriefcaseBusiness className="size-4" />
                  Job Title
                </Label>
                <Input
                  value={form.jobTitle}
                  onChange={(e) => handleChange("jobTitle", e.target.value)}
                  placeholder="e.g. Finance Officer, Developer, Teacher"
                  className="h-12"
                />
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <GraduationCap className="size-4" />
                    Education
                  </Label>
                  <Textarea
                    value={form.education}
                    onChange={(e) => handleChange("education", e.target.value)}
                    placeholder="Your school, degree, certificates, or training"
                    className="min-h-28"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Sparkles className="size-4" />
                    Experience Notes
                  </Label>
                  <Textarea
                    value={form.experience}
                    onChange={(e) => handleChange("experience", e.target.value)}
                    placeholder="Work history, internships, volunteer work, or achievements"
                    className="min-h-28"
                  />
                </div>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Skills</Label>
                  <Textarea
                    value={form.skills}
                    onChange={(e) => handleChange("skills", e.target.value)}
                    placeholder="List skills separated by commas, for example: Excel, Reporting, Communication"
                    className="min-h-24"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Career Goals</Label>
                  <Textarea
                    value={form.careerGoals}
                    onChange={(e) => handleChange("careerGoals", e.target.value)}
                    placeholder="What kind of role do you want next?"
                    className="min-h-24"
                  />
                </div>
              </div>

              <Button onClick={handleGenerate} disabled={loading} className="h-12 w-full bg-slate-900 text-white hover:bg-slate-800">
                {loading ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    Generating your CV...
                  </>
                ) : (
                  <>
                    <WandSparkles className="mr-2 size-4" />
                    Generate Full CV
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="border-0 bg-slate-900 text-white shadow-2xl">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold">What this does</h3>
                <ul className="mt-4 space-y-3 text-sm text-white/80">
                  <li>• Uses your full name and email as the CV identity.</li>
                  <li>• Builds a complete CV with summary, experience, education, skills, projects, and more.</li>
                  <li>• Saves the generated CV so you can open it in Preview, Builder, and Dashboard.</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-0 bg-white/90 shadow-xl backdrop-blur">
              <CardHeader>
                <CardTitle className="text-xl">Tips for a strong result</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-slate-600">
                <p>• Put your real full name and email first.</p>
                <p>• Add 5 or more skills for a stronger AI result.</p>
                <p>• Include any work, volunteer, or school experience you want the CV to mention.</p>
                <p>• You can refine the result later in the Builder.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Toaster />
    </div>
  )
}
