"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { X, FileText, Plus, Trash2, Check } from "lucide-react"
import type { Job, CVData, JobApplication } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

interface JobApplicationModalProps {
  job: Job
  onClose: () => void
}

export function JobApplicationModal({ job, onClose }: JobApplicationModalProps) {
  const { toast } = useToast()
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [cvData, setCvData] = useState<CVData | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    location: "",
    coverLetter: "",
    expectedSalary: "",
    availableStartDate: "",
    portfolio: "",
    linkedIn: "",
  })

  const [references, setReferences] = useState<
    Array<{ name: string; position: string; company: string; email: string; phone: string }>
  >([{ name: "", position: "", company: "", email: "", phone: "" }])

  // Load CV data on mount
  useState(() => {
    const savedCV = localStorage.getItem("cvbuilder_current")
    if (savedCV) {
      const cv: CVData = JSON.parse(savedCV)
      setCvData(cv)
      setFormData((prev) => ({
        ...prev,
        fullName: cv.personalInfo.fullName,
        email: cv.personalInfo.email,
        phone: cv.personalInfo.phone,
        location: cv.personalInfo.location || "",
      }))
    }
  })

  const addReference = () => {
    if (references.length < 3) {
      setReferences([...references, { name: "", position: "", company: "", email: "", phone: "" }])
    }
  }

  const removeReference = (index: number) => {
    setReferences(references.filter((_, i) => i !== index))
  }

  const updateReference = (index: number, field: string, value: string) => {
    const updated = [...references]
    updated[index] = { ...updated[index], [field]: value }
    setReferences(updated)
  }

  const handleSubmit = async () => {
    // Validate required fields
    if (!formData.fullName || !formData.email || !formData.phone || !formData.coverLetter) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    // Create application object
    const application: JobApplication = {
      id: `app_${Date.now()}`,
      jobId: job.id,
      jobTitle: job.title,
      company: job.company,
      applicantInfo: {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        location: formData.location,
      },
      coverLetter: formData.coverLetter,
      cvAttached: !!cvData,
      cvId: cvData?.id,
      expectedSalary: formData.expectedSalary,
      availableStartDate: formData.availableStartDate,
      status: "submitted",
      appliedAt: new Date(),
      portfolio: formData.portfolio,
      linkedIn: formData.linkedIn,
      references: references.filter((ref) => ref.name && ref.email),
    }

    try {
      // Save application to localStorage
      const existingApplications = JSON.parse(localStorage.getItem("job_applications") || "[]")
      existingApplications.push(application)
      localStorage.setItem("job_applications", JSON.stringify(existingApplications))

      // Simulate sending email confirmation
      console.log("[v0] Application submitted:", application)
      console.log("[v0] Email confirmation sent to:", formData.email)

      setTimeout(() => {
        setIsSubmitting(false)
        toast({
          title: "Application Submitted Successfully!",
          description: `Your application for ${job.title} at ${job.company} has been submitted. Check your email for confirmation.`,
        })
        onClose()

        setTimeout(() => {
          router.push("/applications")
        }, 500)
      }, 1500)
    } catch (error) {
      setIsSubmitting(false)
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your application. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <Card className="w-full max-w-3xl my-8">
        <CardHeader className="border-b">
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl">Apply for {job.title}</CardTitle>
              <CardDescription>
                {job.company} • {job.location}
              </CardDescription>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="size-5" />
            </Button>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center gap-2 mt-6">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center gap-2 flex-1">
                <div
                  className={`flex items-center justify-center size-8 rounded-full font-semibold ${step >= s ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                    }`}
                >
                  {s}
                </div>
                {s < 3 && <div className={`flex-1 h-1 ${step > s ? "bg-primary" : "bg-muted"}`} />}
              </div>
            ))}
          </div>
        </CardHeader>

        <CardContent className="pt-6">
          {/* Step 1: Personal Information */}
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold mb-4">Personal Information</h3>

              {cvData && (
                <div className="flex items-center gap-2 p-3 bg-green-500/10 border border-green-500/20 rounded-lg mb-4">
                  <Check className="size-5 text-green-600" />
                  <span className="text-sm text-green-700 font-medium">
                    Your CV information has been loaded automatically
                  </span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>
                    Full Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <Label>
                    Email <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="john@example.com"
                  />
                </div>
                <div>
                  <Label>
                    Phone <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+232 XX XXX XXXX"
                  />
                </div>
                <div>
                  <Label>Location</Label>
                  <Input
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="Freetown, Sierra Leone"
                  />
                </div>
              </div>

              <div>
                <Label>LinkedIn Profile</Label>
                <Input
                  value={formData.linkedIn}
                  onChange={(e) => setFormData({ ...formData, linkedIn: e.target.value })}
                  placeholder="https://linkedin.com/in/yourprofile"
                />
              </div>

              <div>
                <Label>Portfolio / Website</Label>
                <Input
                  value={formData.portfolio}
                  onChange={(e) => setFormData({ ...formData, portfolio: e.target.value })}
                  placeholder="https://yourportfolio.com"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button onClick={() => setStep(2)}>Next</Button>
              </div>
            </div>
          )}

          {/* Step 2: Cover Letter & Details */}
          {step === 2 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold mb-4">Application Details</h3>

              <div>
                <Label>
                  Cover Letter <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  value={formData.coverLetter}
                  onChange={(e) => setFormData({ ...formData, coverLetter: e.target.value })}
                  placeholder="Write a compelling cover letter explaining why you're a great fit for this position..."
                  className="min-h-[200px]"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Tip: Highlight your relevant skills and experience that match the job requirements
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Expected Salary</Label>
                  <Input
                    value={formData.expectedSalary}
                    onChange={(e) => setFormData({ ...formData, expectedSalary: e.target.value })}
                    placeholder="e.g., 5,000,000 Leones/month"
                  />
                </div>
                <div>
                  <Label>Available Start Date</Label>
                  <Input
                    type="date"
                    value={formData.availableStartDate}
                    onChange={(e) => setFormData({ ...formData, availableStartDate: e.target.value })}
                  />
                </div>
              </div>

              {cvData && (
                <div className="p-4 bg-muted rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="size-5 text-primary" />
                    <span className="font-semibold">Attached CV</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{cvData.personalInfo.fullName} - CV</p>
                </div>
              )}

              <div className="flex justify-between gap-2 pt-4">
                <Button variant="outline" onClick={() => setStep(1)}>
                  Back
                </Button>
                <Button onClick={() => setStep(3)}>Next</Button>
              </div>
            </div>
          )}

          {/* Step 3: References */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">References</h3>
                {references.length < 3 && (
                  <Button variant="outline" size="sm" onClick={addReference}>
                    <Plus className="size-4 mr-1" />
                    Add Reference
                  </Button>
                )}
              </div>

              <p className="text-sm text-muted-foreground mb-4">
                Add at least one professional reference who can vouch for your qualifications
              </p>

              {references.map((ref, index) => (
                <Card key={index} className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold">Reference {index + 1}</h4>
                    {references.length > 1 && (
                      <Button variant="ghost" size="sm" onClick={() => removeReference(index)}>
                        <Trash2 className="size-4" />
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label>Name</Label>
                      <Input
                        value={ref.name}
                        onChange={(e) => updateReference(index, "name", e.target.value)}
                        placeholder="Reference name"
                      />
                    </div>
                    <div>
                      <Label>Position</Label>
                      <Input
                        value={ref.position}
                        onChange={(e) => updateReference(index, "position", e.target.value)}
                        placeholder="Job title"
                      />
                    </div>
                    <div>
                      <Label>Company</Label>
                      <Input
                        value={ref.company}
                        onChange={(e) => updateReference(index, "company", e.target.value)}
                        placeholder="Company name"
                      />
                    </div>
                    <div>
                      <Label>Email</Label>
                      <Input
                        type="email"
                        value={ref.email}
                        onChange={(e) => updateReference(index, "email", e.target.value)}
                        placeholder="email@example.com"
                      />
                    </div>
                    <div className="col-span-2">
                      <Label>Phone</Label>
                      <Input
                        value={ref.phone}
                        onChange={(e) => updateReference(index, "phone", e.target.value)}
                        placeholder="+232 XX XXX XXXX"
                      />
                    </div>
                  </div>
                </Card>
              ))}

              <div className="flex justify-between gap-2 pt-4">
                <Button variant="outline" onClick={() => setStep(2)}>
                  Back
                </Button>
                <Button onClick={handleSubmit} disabled={isSubmitting}>
                  {isSubmitting ? "Submitting..." : "Submit Application"}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
