"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  FileText,
  Plus,
  Edit2,
  Trash2,
  Clock,
  Briefcase,
  BookOpen,
  FileSearch,
  Phone,
  Upload,
  Sparkles,
  Eye,
  AlertCircle,
} from "lucide-react"
import type { CVData } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { createClient } from "@/lib/supabase/client"

export default function DashboardPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [cvs, setCvs] = useState<CVData[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isUploading, setIsUploading] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState("")
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

  useEffect(() => {
    loadCVs()
  }, [])

  const loadCVs = async () => {
    const { createClient } = await import("@/lib/supabase/client")
    const supabase = createClient()
    
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data: cvs, error } = await supabase
      .from('cvs')
      .select('data, created_at, updated_at')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false })

    if (cvs) {
      setCvs(cvs.map((cv: any, index: number) => ({
        ...cv.data,
        id: cv.data.id || `cv-${index}`,
        createdAt: cv.created_at,
        updatedAt: cv.updated_at
      })))
    }
  }

  const handleEditCV = async (cv: CVData) => {
    const { createClient } = await import("@/lib/supabase/client")
    const supabase = createClient()
    
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    // Store current CV in Supabase or session
    sessionStorage.setItem("cvbuilder_current", JSON.stringify(cv))
    router.push("/builder")
  }

  const handleDeleteCV = async (cvId: string) => {
    if (!confirm("Are you sure you want to delete this CV?")) return

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) return

    // Try to delete by matching the ID in the JSON data
    const { error } = await supabase
      .from('cvs')
      .delete()
      .eq('user_id', user.id)
      .eq('data->>id', cvId)

    if (error) {
      console.error("Delete error:", error)
      toast({ 
        title: "Error", 
        description: "Failed to delete CV. Please try again.",
        variant: "destructive"
      })
      return
    }

    const updatedCVs = cvs.filter((cv) => cv.id !== cvId)
    setCvs(updatedCVs)
    toast({ title: "CV Deleted" })
  }

  const [showCreateModal, setShowCreateModal] = useState(false)

  const handleCreateNew = () => {
    // Create a new CV directly and navigate to builder
    sessionStorage.removeItem("cvbuilder_current")
    router.push("/builder")
  }

  const handleViewCV = (cv: CVData) => {
    sessionStorage.setItem("cvbuilder_current", JSON.stringify(cv))
    router.push("/preview")
  }

  const handleUploadCV = () => {
    router.push("/cv")
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
      
      // Navigate to builder with uploaded CV
      const uploadedCV = result.cv
      sessionStorage.setItem("cvbuilder_current", JSON.stringify(uploadedCV))
      router.push("/builder")
      
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upload CV file")
      setIsUploading(false)
    }
  }

  const handleAIGenerate = async () => {
    if (!aiForm.fullName || !aiForm.email || !aiForm.skills) {
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

      const { createClient } = await import("@/lib/supabase/client")
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
      
      // Navigate to builder with generated CV
      sessionStorage.setItem("cvbuilder_current", JSON.stringify(newCV))
      router.push("/builder")
      
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate CV")
      setIsGenerating(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <main className="p-4 sm:p-6 md:p-10 max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-500 mt-1">Welcome back! Access all your tools and applications.</p>
          </div>
          <Button
            onClick={handleCreateNew}
            className="h-12 px-6 bg-[#4CAF50] hover:bg-[#45a049] active:bg-[#3f9143] text-white rounded-lg gap-2 shadow-lg shadow-green-200 w-full sm:w-auto"
          >
            <Plus className="size-5" />
            Create New
          </Button>
        </div>

        {/* CV Creation Section */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-4">Create Your CV</h2>
            <p className="text-gray-600">Choose option that works best for you</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Upload Option */}
            <Card className="border-2 border-blue-200 hover:border-blue-400 transition-all">
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Upload className="h-10 w-10 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Upload and Edit My CV</h3>
                  <p className="text-gray-600 mb-6">
                    Upload your existing CV in PDF or Word format and edit it directly in our platform
                  </p>
                </div>
                
                <div className="space-y-4 mb-6">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Upload className="mx-auto h-8 w-8 text-gray-400 mb-3" />
                    <p className="text-sm font-medium mb-2">Upload your CV file</p>
                    <p className="text-xs text-gray-500 mb-4">
                      Supported formats: PDF, DOC, DOCX (Max 5MB)
                    </p>
                    <Input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileUpload}
                      disabled={isUploading}
                      className="mx-auto max-w-xs"
                    />
                  </div>
                  {isUploading && (
                    <div className="text-center">
                      <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                      <p className="text-sm text-gray-600 mt-2">Uploading and processing your CV...</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* AI Generate Option */}
            <Card className="border-2 border-purple-200 hover:border-purple-400 transition-all">
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="h-10 w-10 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Generate My CV with AI</h3>
                  <p className="text-gray-600 mb-6">
                    Let AI create a professional CV for you with just a few details
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
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
                      <Label htmlFor="ai-skills">Skills *</Label>
                      <Textarea
                        id="ai-skills"
                        value={aiForm.skills}
                        onChange={(e) => setAiForm(prev => ({ ...prev, skills: e.target.value }))}
                        placeholder="JavaScript, Project Management, Communication..."
                        rows={3}
                      />
                    </div>
                  </div>

                  <Button
                    onClick={handleAIGenerate}
                    disabled={isGenerating || !aiForm.fullName || !aiForm.email || !aiForm.skills}
                    className="w-full bg-purple-600 hover:bg-purple-700"
                  >
                    {isGenerating ? (
                      <>
                        <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Generating CV...
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-4 w-4" />
                        Generate My CV with AI
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 border border-red-200 bg-red-50 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <span className="text-red-800">{error}</span>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <FileText className="size-5 text-[#4CAF50]" />
            My Resumes
          </h2>
        </div>

        {cvs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 bg-white rounded-2xl border-2 border-dashed border-gray-100">
            <div className="size-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
              <FileText className="size-10 text-gray-300" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No resumes yet</h3>
            <p className="text-gray-400 mb-8 max-w-xs text-center">Start your career journey by creating your first professional resume.</p>
            <Button
              onClick={handleCreateNew}
              variant="outline"
              className="border-[#4CAF50] text-[#4CAF50] hover:bg-[#4CAF50] hover:text-white active:bg-[#3f9143] h-11 px-8 rounded-lg"
            >
              Get Started
            </Button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cvs.filter(cv => cv.personalInfo.fullName.toLowerCase().includes(searchTerm.toLowerCase())).map((cv) => (
              <Card key={cv.id} className="group overflow-hidden border-none shadow-sm hover:shadow-md transition-all duration-300 rounded-xl bg-white">
                <div className="h-48 bg-gray-50 relative flex items-center justify-center overflow-hidden border-b border-gray-100">
                  <div className="w-32 h-44 bg-white shadow-xl rounded-sm transform group-hover:scale-105 transition-transform duration-300 p-3 flex flex-col gap-2">
                    <div className="h-2 w-12 bg-gray-100 rounded" />
                    <div className="h-1.5 w-full bg-gray-50 rounded" />
                    <div className="h-1.5 w-full bg-gray-50 rounded" />
                    <div className="h-1.5 w-3/4 bg-gray-50 rounded" />
                  </div>
                </div>
                <CardContent className="p-5">
                  <h3 className="font-bold text-gray-900 truncate">{cv.personalInfo.fullName || "Untitled Resume"}</h3>
                  <div className="flex items-center gap-2 text-xs text-gray-400 mt-2">
                    <Clock className="size-3" />
                    <span>Last updated 2 days ago</span>
                  </div>

                  <div className="flex gap-2 mt-6">
                    <Button
                      className="flex-1 h-9 rounded-lg bg-gray-100 text-gray-900 hover:bg-gray-200"
                      variant="ghost"
                      onClick={() => handleViewCV(cv)}
                    >
                      <Eye className="size-4 mr-2" />
                      View
                    </Button>
                    <Button
                      className="flex-1 h-9 rounded-lg bg-gray-100 text-gray-900 hover:bg-gray-200"
                      variant="ghost"
                      onClick={() => handleEditCV(cv)}
                    >
                      <Edit2 className="size-4 mr-2" />
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 rounded-lg text-red-500 hover:bg-red-50 hover:text-red-600"
                      onClick={() => handleDeleteCV(cv.id)}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      <Toaster />
    </div>
  )
}
