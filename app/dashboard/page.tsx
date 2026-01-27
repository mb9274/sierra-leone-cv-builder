"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  FileText,
  Plus,
  Eye,
  Edit,
  Trash2,
  Briefcase,
  BarChart3,
  ClipboardList,
  MapPin,
  BookOpen,
  Building2,
  FileSearch,
  Phone,
} from "lucide-react"
import type { CVData } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"

export default function DashboardPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [cvs, setCvs] = useState<CVData[]>([])
  const [applicationCount, setApplicationCount] = useState(0)
  const [analytics, setAnalytics] = useState({
    totalUsers: 1247,
    cvsCreated: 3891,
    jobsApplied: 2156,
    coursesCompleted: 892,
  })

  useEffect(() => {
    loadCVs()
    loadApplicationCount()
    const interval = setInterval(() => {
      setAnalytics((prev) => ({
        totalUsers: prev.totalUsers + Math.floor(Math.random() * 3),
        cvsCreated: prev.cvsCreated + Math.floor(Math.random() * 5),
        jobsApplied: prev.jobsApplied + Math.floor(Math.random() * 2),
        coursesCompleted: prev.coursesCompleted + Math.floor(Math.random() * 2),
      }))
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const loadCVs = () => {
    const savedCVs = localStorage.getItem("cvbuilder_cvs")
    if (savedCVs) {
      setCvs(JSON.parse(savedCVs))
    }
  }

  const loadApplicationCount = () => {
    const savedApplications = localStorage.getItem("job_applications")
    if (savedApplications) {
      const applications = JSON.parse(savedApplications)
      setApplicationCount(applications.length)
    }
  }

  const handleViewCV = (cv: CVData) => {
    localStorage.setItem("cvbuilder_current", JSON.stringify(cv))
    router.push("/preview")
  }

  const handleEditCV = (cv: CVData) => {
    localStorage.setItem("cvbuilder_current", JSON.stringify(cv))
    toast({
      title: "CV Loaded",
      description: "You can now edit your CV.",
    })
    router.push("/builder")
  }

  const handleDeleteCV = (cvId: string) => {
    const confirmed = confirm("Are you sure you want to delete this CV?")
    if (confirmed) {
      const updatedCVs = cvs.filter((cv) => cv.id !== cvId)
      setCvs(updatedCVs)
      localStorage.setItem("cvbuilder_cvs", JSON.stringify(updatedCVs))
      toast({
        title: "CV Deleted",
        description: "Your CV has been removed.",
      })
    }
  }

  const handleCreateNew = () => {
    localStorage.removeItem("cvbuilder_current")
    router.push("/builder")
  }

  const handleAnalyzeCV = (cv: CVData) => {
    localStorage.setItem("cvbuilder_current", JSON.stringify(cv))
    router.push("/score")
  }

  const handleInterviewPrep = (cv: CVData) => {
    localStorage.setItem("cvbuilder_current", JSON.stringify(cv))
    router.push("/interview")
  }

  const handleViewDocuments = (cv: CVData) => {
    localStorage.setItem("cvbuilder_current", JSON.stringify(cv))
    router.push("/documents")
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="size-10 rounded-lg bg-[#4CAF50] flex items-center justify-center">
              <FileText className="size-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">Konek Salone</h1>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => router.push("/")}>
              Home
            </Button>
            <Button variant="outline" onClick={() => router.push("/applications")}>
              <ClipboardList className="mr-2 size-4" />
              My Applications
              {applicationCount > 0 && (
                <span className="ml-2 px-2 py-0.5 bg-[#4CAF50] text-white text-xs rounded-full animate-pulse">
                  {applicationCount}
                </span>
              )}
            </Button>
            <Button variant="outline" onClick={() => router.push("/employer")} className="border-blue-500/40">
              <Building2 className="mr-2 size-4" />
              Employer Portal
            </Button>
            <Button variant="outline" onClick={() => router.push("/job-map")}>
              <MapPin className="mr-2 size-4" />
              Job Map
            </Button>

            <Button
              variant="outline"
              onClick={() => router.push("/ats-checker")}
              className="border-blue-500/40 bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100"
            >
              <FileSearch className="mr-2 size-4" />
              ATS Checker
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push("/contact")}
              className="border-green-500/40 bg-gradient-to-r from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100"
            >
              <Phone className="mr-2 size-4" />
              Contact Us
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto mb-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold mb-1">{analytics.totalUsers.toLocaleString()}</div>
                <div className="text-sm opacity-90">Total Users</div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold mb-1">{analytics.cvsCreated.toLocaleString()}</div>
                <div className="text-sm opacity-90">CVs Created</div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold mb-1">{analytics.jobsApplied.toLocaleString()}</div>
                <div className="text-sm opacity-90">Jobs Applied</div>
              </CardContent>
            </Card>

          </div>
        </div>

        {/* Welcome Section */}
        <div className="max-w-5xl mx-auto mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-4">My CVs</h2>
          <p className="text-xl text-muted-foreground mb-6">
            Manage your professional CVs and track your job applications.
          </p>
          <Button
            size="lg"
            onClick={handleCreateNew}
            className="h-12 bg-[#4CAF50] hover:bg-[#45a049] transition-all hover:scale-105"
          >
            <Plus className="mr-2 size-5" />
            Create New CV
          </Button>
        </div>

        {/* CVs Grid */}
        <div className="max-w-5xl mx-auto">
          {cvs.length === 0 ? (
            <Card className="border-2 border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-16">
                <FileText className="size-20 text-muted-foreground mb-4 animate-pulse" />
                <h3 className="text-2xl font-bold text-foreground mb-2">No CVs Yet</h3>
                <p className="text-muted-foreground mb-6 text-center max-w-md">
                  Start building your professional CV today. Our AI-powered tool will guide you through the process.
                </p>
                <Button size="lg" onClick={handleCreateNew} className="bg-[#4CAF50] hover:bg-[#45a049]">
                  <Plus className="mr-2 size-5" />
                  Create Your First CV
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {cvs.map((cv) => (
                <Card
                  key={cv.id}
                  className="hover:shadow-lg transition-all hover:scale-105 border-[#4CAF50]/30 border-2"
                >
                  <CardHeader>
                    <CardTitle className="text-xl">{cv.personalInfo.fullName}</CardTitle>
                    <CardDescription>Created on {formatDate(cv.createdAt)}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <div className="flex items-center justify-between">
                        <span>Education:</span>
                        <span className="font-medium text-foreground">{cv.education.length} entries</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Experience:</span>
                        <span className="font-medium text-foreground">{cv.experience.length} entries</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Skills:</span>
                        <span className="font-medium text-foreground">{cv.skills.length} skills</span>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-4">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 bg-transparent border-[#4CAF50]/40 transition-all hover:scale-105"
                        onClick={() => handleViewCV(cv)}
                      >
                        <Eye className="mr-2 size-4" />
                        View
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 bg-transparent border-[#4CAF50]/40 transition-all hover:scale-105"
                        onClick={() => handleEditCV(cv)}
                      >
                        <Edit className="mr-2 size-4" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteCV(cv.id)}
                        className="transition-all hover:scale-105"
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button
                        size="sm"
                        className="flex-1 bg-[#4CAF50] hover:bg-[#45a049] transition-all hover:scale-105"
                        onClick={() => handleViewDocuments(cv)}
                      >
                        <FileText className="mr-2 size-4" />
                        Documents
                      </Button>
                      <Button
                        size="sm"
                        className="flex-1 bg-[#4CAF50] hover:bg-[#45a049] transition-all hover:scale-105"
                        onClick={() => handleAnalyzeCV(cv)}
                      >
                        <BarChart3 className="mr-2 size-4" />
                        CV Score
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {cvs.length > 0 && (
          <div className="max-w-5xl mx-auto mt-12 grid md:grid-cols-4 gap-6">
            <Card
              className="border-2 border-blue-500/40 hover:border-blue-500 transition-colors cursor-pointer bg-gradient-to-br from-blue-50 to-indigo-50"
              onClick={() => router.push("/ats-checker")}
            >
              <CardContent className="pt-6">
                <FileSearch className="size-10 text-blue-600 mb-4" />
                <h3 className="text-xl font-bold text-foreground mb-2">ATS Checker</h3>
                <p className="text-muted-foreground">
                  Check if your CV passes Applicant Tracking Systems used by employers in Sierra Leone.
                </p>
              </CardContent>
            </Card>

            <Card
              className="border-2 border-[#4CAF50]/40 hover:border-[#4CAF50] transition-colors cursor-pointer"
              onClick={() => router.push("/applications")}
            >
              <CardContent className="pt-6">
                <div className="relative">
                  <ClipboardList className="size-10 text-[#4CAF50] mb-4" />
                  {applicationCount > 0 && (
                    <span className="absolute top-0 left-8 px-2 py-0.5 bg-[#4CAF50] text-white text-xs rounded-full font-bold">
                      {applicationCount}
                    </span>
                  )}
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">My Applications</h3>
                <p className="text-muted-foreground">Track your submitted job applications.</p>
              </CardContent>
            </Card>

            <Card
              className="border-2 border-[#4CAF50]/40 hover:border-[#4CAF50] transition-colors cursor-pointer"
              onClick={() => router.push("/jobs")}
            >
              <CardContent className="pt-6">
                <Briefcase className="size-10 text-[#4CAF50] mb-4" />
                <h3 className="text-xl font-bold text-foreground mb-2">Find Jobs</h3>
                <p className="text-muted-foreground">Browse job opportunities matched to your skills.</p>
              </CardContent>
            </Card>

            <Card
              className="border-2 border-[#4CAF50]/40 hover:border-[#4CAF50] transition-colors cursor-pointer"
              onClick={() => router.push("/job-map")}
            >
              <CardContent className="pt-6">
                <MapPin className="size-10 text-[#4CAF50] mb-4" />
                <h3 className="text-xl font-bold text-foreground mb-2">Job Map</h3>
                <p className="text-muted-foreground">Find nearby jobs with map-based search.</p>
              </CardContent>
            </Card>



            <Card
              className="border-2 border-green-500/40 hover:border-green-500 transition-colors cursor-pointer bg-gradient-to-br from-green-50 to-emerald-50"
              onClick={() => router.push("/contact")}
            >
              <CardContent className="pt-6">
                <Phone className="size-10 text-green-600 mb-4" />
                <h3 className="text-xl font-bold text-foreground mb-2">Contact Us</h3>
                <p className="text-muted-foreground">Get help with CV building, jobs, or learning resources.</p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      <Toaster />
    </div>
  )
}
