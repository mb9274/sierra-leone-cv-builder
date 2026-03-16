"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  Upload, 
  FileText, 
  ArrowLeft,
  Eye,
  Trash2,
  CheckCircle,
  AlertCircle,
  Loader2,
  Sparkles,
  Bot,
  User,
  GraduationCap,
  Briefcase
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"
import type { CVData } from "@/lib/types"
import { createClient } from "@/lib/supabase/client"

export default function CVManagementPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [cvs, setCvs] = useState<CVData[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [activeOption, setActiveOption] = useState<"upload" | "ai" | null>(null)
  const [aiForm, setAiForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    location: "",
    jobTitle: "",
    experience: "",
    education: "",
    skills: "",
    careerGoals: ""
  })
  const [isGenerating, setIsGenerating] = useState(false)

  useEffect(() => {
    // Check URL parameter for mode
    const urlParams = new URLSearchParams(window.location.search)
    const mode = urlParams.get('mode')
    if (mode === 'ai') {
      setActiveOption('ai')
    }
    
    loadCVs()
  }, [])

  const loadCVs = async () => {
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push("/auth/sign-in")
        return
      }

      const { data: cvs, error } = await supabase
        .from('cvs')
        .select('data, created_at, updated_at')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false })

      if (error) throw error

      if (cvs) {
        setCvs(cvs.map((cv: any, index: number) => ({
          ...cv.data,
          id: cv.data.id || `cv-${index}`,
          createdAt: cv.created_at,
          updatedAt: cv.updated_at
        })))
      }
    } catch (err) {
      setError("Failed to load CVs")
    } finally {
      setLoading(false)
    }
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    setError("")

    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/cv/upload", {
        method: "POST",
        body: formData
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Upload failed")
      }

      toast({ 
        title: "CV Uploaded Successfully",
        description: "Your CV has been uploaded and saved."
      })
      
      await loadCVs()
      setIsUploading(false)
      setActiveOption(null)
      
      // Reset file input
      event.target.value = ""
      
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upload CV file")
      setIsUploading(false)
    }
  }

  const handleAIGenerate = async () => {
    if (!aiForm.fullName || !aiForm.email) {
      setError("Please fill in required fields")
      return
    }

    setIsGenerating(true)
    setError("")

    try {
      const response = await fetch("/api/cv/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(aiForm)
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "AI generation failed")
      }

      const newCV: CVData = {
        id: `cv-${Date.now()}`,
        personalInfo: {
          fullName: aiForm.fullName,
          email: aiForm.email,
          phone: aiForm.phone,
          location: aiForm.location,
          summary: result.data.summary || `Professional ${aiForm.jobTitle} with expertise in ${aiForm.skills}`
        },
        education: result.data.education || [],
        experience: result.data.experience || [],
        skills: aiForm.skills.split(",").map(s => s.trim()).filter(s => s),
        languages: [],
        createdAt: new Date(),
        updatedAt: new Date()
      }

      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) throw new Error("Not authenticated")

      const { error } = await supabase
        .from('cvs')
        .insert({
          user_id: user.id,
          data: newCV
        })

      if (error) throw error

      toast({ 
        title: "CV Generated Successfully",
        description: "Your AI-generated CV has been created."
      })
      
      await loadCVs()
      setIsGenerating(false)
      setActiveOption(null)
      
      // Reset form
      setAiForm({
        fullName: "",
        email: "",
        phone: "",
        location: "",
        jobTitle: "",
        experience: "",
        education: "",
        skills: "",
        careerGoals: ""
      })
      
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate CV")
      setIsGenerating(false)
    }
  }

  const handleViewCV = (cv: CVData) => {
    sessionStorage.setItem("cvbuilder_current", JSON.stringify(cv))
    router.push("/preview")
  }

  const handleEditInBuilder = (cv: CVData) => {
    sessionStorage.setItem("cvbuilder_current", JSON.stringify(cv))
    router.push("/builder")
  }

  const handleDeleteCV = async (cvId: string) => {
    if (!confirm("Are you sure you want to delete this CV?")) return

    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) throw new Error("Not authenticated")

      const { error } = await supabase
        .from('cvs')
        .delete()
        .eq('user_id', user.id)
        .eq('id', cvId)

      if (error) throw error

      await loadCVs()
      toast({ title: "CV Deleted Successfully" })
    } catch (err) {
      setError("Failed to delete CV")
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Toaster />
      
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.push("/dashboard")}>
              <ArrowLeft className="size-5" />
            </Button>
            <h1 className="text-2xl font-bold">CV Management</h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Error Alert */}
        {error && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">{error}</AlertDescription>
          </Alert>
        )}

        {/* Main Options */}
        {!activeOption ? (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">Choose How to Create Your CV</h2>
              <p className="text-gray-600 text-lg">Select the option that works best for you</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {/* Upload and Edit Option */}
              <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 border-blue-200 hover:border-blue-400" 
                    onClick={() => setActiveOption("upload")}>
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                    <Upload className="h-8 w-8 text-blue-600" />
                  </div>
                  <CardTitle className="text-xl mb-2">Upload and Edit My CV</CardTitle>
                  <CardDescription className="text-base">
                    Upload your existing CV in PDF or Word format and edit it directly in our platform
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-3 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Supports PDF, DOC, DOCX files</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Extract and edit all sections</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Download updated version</span>
                    </div>
                  </div>
                  <Button className="w-full mt-4 bg-blue-600 hover:bg-blue-700">
                    <Upload className="mr-2 h-4 w-4" />
                    Upload and Edit My CV
                  </Button>
                </CardContent>
              </Card>

              {/* AI Generate Option */}
              <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 border-purple-200 hover:border-purple-400" 
                    onClick={() => setActiveOption("ai")}>
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                    <Sparkles className="h-8 w-8 text-purple-600" />
                  </div>
                  <CardTitle className="text-xl mb-2">Generate My CV with AI</CardTitle>
                  <CardDescription className="text-base">
                    Let AI create a professional CV for you with just a few details
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-3 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Professional wording and structure</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Optimized for job applications</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Simple form to fill out</span>
                    </div>
                  </div>
                  <Button className="w-full mt-4 bg-purple-600 hover:bg-purple-700">
                    <Bot className="mr-2 h-4 w-4" />
                    Generate My CV with AI
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto">
            {/* Back Button */}
            <Button 
              variant="outline" 
              onClick={() => setActiveOption(null)}
              className="mb-6"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Options
            </Button>

            {/* Upload Interface */}
            {activeOption === "upload" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Upload className="size-5" />
                    Upload and Edit Your CV
                  </CardTitle>
                  <CardDescription>
                    Upload your existing CV file and we'll extract the information for you to edit
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <div className="space-y-2">
                      <p className="text-lg font-medium">Upload your CV file</p>
                      <p className="text-sm text-gray-500">
                        Supported formats: PDF, DOC, DOCX (Max 5MB)
                      </p>
                    </div>
                    <Input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileUpload}
                      className="mt-4"
                      disabled={isUploading}
                    />
                  </div>
                  {isUploading && (
                    <div className="text-center">
                      <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
                      <p>Uploading and processing your CV...</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* AI Generation Interface */}
            {activeOption === "ai" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bot className="size-5" />
                    Generate CV with AI
                  </CardTitle>
                  <CardDescription>
                    Fill in your information below and AI will create a professional CV for you
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Personal Information */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold flex items-center gap-2">
                        <User className="h-5 w-5" />
                        Personal Information
                      </h3>
                      <div className="space-y-3">
                        <div>
                          <Label htmlFor="ai-fullName">Full Name *</Label>
                          <Input
                            id="ai-fullName"
                            value={aiForm.fullName}
                            onChange={(e) => setAiForm(prev => ({ ...prev, fullName: e.target.value }))}
                            placeholder="Enter your full name"
                          />
                        </div>
                        <div>
                          <Label htmlFor="ai-email">Email Address *</Label>
                          <Input
                            id="ai-email"
                            type="email"
                            value={aiForm.email}
                            onChange={(e) => setAiForm(prev => ({ ...prev, email: e.target.value }))}
                            placeholder="your.email@example.com"
                          />
                        </div>
                        <div>
                          <Label htmlFor="ai-phone">Phone Number</Label>
                          <Input
                            id="ai-phone"
                            value={aiForm.phone}
                            onChange={(e) => setAiForm(prev => ({ ...prev, phone: e.target.value }))}
                            placeholder="+232 76 123 456"
                          />
                        </div>
                        <div>
                          <Label htmlFor="ai-location">Location</Label>
                          <Input
                            id="ai-location"
                            value={aiForm.location}
                            onChange={(e) => setAiForm(prev => ({ ...prev, location: e.target.value }))}
                            placeholder="Freetown, Sierra Leone"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Professional Information */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold flex items-center gap-2">
                        <Briefcase className="h-5 w-5" />
                        Professional Information
                      </h3>
                      <div className="space-y-3">
                        <div>
                          <Label htmlFor="ai-jobTitle">Current/Target Job Title</Label>
                          <Input
                            id="ai-jobTitle"
                            value={aiForm.jobTitle}
                            onChange={(e) => setAiForm(prev => ({ ...prev, jobTitle: e.target.value }))}
                            placeholder="e.g., Software Developer, Marketing Manager"
                          />
                        </div>
                        <div>
                          <Label htmlFor="ai-experience">Work Experience</Label>
                          <Textarea
                            id="ai-experience"
                            value={aiForm.experience}
                            onChange={(e) => setAiForm(prev => ({ ...prev, experience: e.target.value }))}
                            placeholder="Describe your work experience, companies, and achievements..."
                            rows={3}
                          />
                        </div>
                        <div>
                          <Label htmlFor="ai-education">Education</Label>
                          <Textarea
                            id="ai-education"
                            value={aiForm.education}
                            onChange={(e) => setAiForm(prev => ({ ...prev, education: e.target.value }))}
                            placeholder="Your degrees, certifications, and educational background..."
                            rows={3}
                          />
                        </div>
                        <div>
                          <Label htmlFor="ai-skills">Skills *</Label>
                          <Textarea
                            id="ai-skills"
                            value={aiForm.skills}
                            onChange={(e) => setAiForm(prev => ({ ...prev, skills: e.target.value }))}
                            placeholder="JavaScript, Project Management, Communication, Leadership..."
                            rows={2}
                          />
                        </div>
                        <div>
                          <Label htmlFor="ai-careerGoals">Career Goals</Label>
                          <Textarea
                            id="ai-careerGoals"
                            value={aiForm.careerGoals}
                            onChange={(e) => setAiForm(prev => ({ ...prev, careerGoals: e.target.value }))}
                            placeholder="What are your career aspirations and target roles?"
                            rows={2}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={handleAIGenerate}
                    disabled={isGenerating || !aiForm.fullName || !aiForm.email || !aiForm.skills}
                    className="w-full bg-purple-600 hover:bg-purple-700"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating CV...
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-4 w-4" />
                        Generate My CV with AI
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Existing CVs List */}
        {cvs.length > 0 && (
          <div className="mt-12 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold">Your Existing CVs ({cvs.length})</h2>
            </div>

            <div className="grid gap-4">
              {cvs.map((cv) => (
                <Card key={cv.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold">{cv.personalInfo.fullName}</h3>
                          {cv.verifiedAt && (
                            <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                              <CheckCircle className="mr-1 h-3 w-3 inline" />
                              Verified
                            </div>
                          )}
                        </div>
                        <p className="text-gray-600 mb-2">{cv.personalInfo.email}</p>
                        {cv.personalInfo.phone && (
                          <p className="text-gray-600 mb-2">{cv.personalInfo.phone}</p>
                        )}
                        {cv.personalInfo.summary && (
                          <p className="text-sm text-gray-500 line-clamp-2 mb-3">
                            {cv.personalInfo.summary}
                          </p>
                        )}
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span>Created: {new Date(cv.createdAt).toLocaleDateString()}</span>
                          <span>Updated: {new Date(cv.updatedAt).toLocaleDateString()}</span>
                        </div>
                        {cv.skills.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-3">
                            {cv.skills.slice(0, 5).map((skill, index) => (
                              <div key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                                {skill}
                              </div>
                            ))}
                            {cv.skills.length > 5 && (
                              <div className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                                +{cv.skills.length - 5} more
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex gap-2 ml-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewCV(cv)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditInBuilder(cv)}
                        >
                          <FileText className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteCV(cv.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
