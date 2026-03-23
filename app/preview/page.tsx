"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Download, Briefcase, Edit, Printer, Check, FileSearch } from "lucide-react"
import type { CVData } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { StandardLayout } from "@/components/cv-layouts/standard-layout"
import { SidebarLayout } from "@/components/cv-layouts/sidebar-layout"
import { MinimalLayout } from "@/components/cv-layouts/minimal-layout"
import { BoldRedLayout } from "@/components/cv-layouts/bold-red-layout"
import { TealSidebarLayout } from "@/components/cv-layouts/teal-sidebar-layout"
import { BlueWaveLayout } from "@/components/cv-layouts/blue-wave-layout"
import { loadAvailableCvs } from "@/lib/cv-collection"

const templateThemes: Record<string, any> = {
  "sierra-leone-professional": {
    layout: "standard",
    primary: "text-green-800",
    border: "border-green-600",
    bg: "bg-green-50",
    accent: "bg-green-600",
    icon_bg: "bg-green-100",
    icon_text: "text-green-600",
    header_bg: "bg-gradient-to-r from-green-50 to-emerald-50",
    header_border: "border-green-300",
  },
  "freetown-modern": {
    layout: "sidebar",
    primary: "text-blue-800",
    border: "border-blue-600",
    bg: "bg-blue-50",
    accent: "bg-blue-600",
    icon_bg: "bg-blue-100",
    icon_text: "text-blue-600",
    header_bg: "bg-gradient-to-r from-blue-50 to-indigo-50",
    header_border: "border-blue-300",
  },
  "classic-salone": {
    layout: "minimal",
    primary: "text-yellow-900",
    border: "border-yellow-600",
    bg: "bg-yellow-50",
    accent: "bg-yellow-600",
    icon_bg: "bg-yellow-100",
    icon_text: "text-yellow-700",
    header_bg: "bg-gradient-to-r from-yellow-50 to-orange-50",
    header_border: "border-yellow-300",
  },
  "bo-business": {
    layout: "standard",
    primary: "text-red-900",
    border: "border-red-600",
    bg: "bg-red-50",
    accent: "bg-red-600",
    icon_bg: "bg-red-100",
    icon_text: "text-red-700",
    header_bg: "bg-gradient-to-r from-red-50 to-rose-50",
    header_border: "border-red-300",
  },
  "makeni-minimal": {
    layout: "minimal",
    primary: "text-slate-900",
    border: "border-slate-600",
    bg: "bg-slate-50",
    accent: "bg-slate-800",
    icon_bg: "bg-slate-200",
    icon_text: "text-slate-800",
    header_bg: "bg-gradient-to-r from-slate-100 to-gray-100",
    header_border: "border-slate-300",
  },
  "kenema-creative": {
    layout: "sidebar",
    primary: "text-purple-900",
    border: "border-purple-500",
    bg: "bg-purple-50",
    accent: "bg-purple-600",
    icon_bg: "bg-purple-100",
    icon_text: "text-purple-600",
    header_bg: "bg-gradient-to-r from-purple-50 to-pink-50",
    header_border: "border-purple-300",
  },
  "lion-mountains": {
    layout: "sidebar",
    primary: "text-teal-900",
    border: "border-teal-600",
    bg: "bg-teal-50",
    accent: "bg-teal-700",
    icon_bg: "bg-teal-100",
    icon_text: "text-teal-700",
    header_bg: "bg-gradient-to-r from-teal-50 to-emerald-50",
    header_border: "border-teal-300",
  },
  "bold-red-designer": {
    layout: "bold-red",
    primary: "text-red-800",
    border: "border-red-600",
    bg: "bg-red-50",
    accent: "bg-red-600",
    icon_bg: "bg-red-100",
    icon_text: "text-red-600",
    header_bg: "bg-gradient-to-r from-red-50 to-rose-50",
    header_border: "border-red-300",
  },
  "teal-professional": {
    layout: "teal-sidebar",
    primary: "text-teal-900",
    border: "border-teal-700",
    bg: "bg-teal-50",
    accent: "bg-teal-800",
    icon_bg: "bg-teal-100",
    icon_text: "text-teal-700",
    header_bg: "bg-gradient-to-r from-teal-50 to-emerald-50",
    header_border: "border-teal-400",
  },
  "blue-wave-modern": {
    layout: "blue-wave",
    primary: "text-blue-900",
    border: "border-blue-600",
    bg: "bg-blue-50",
    accent: "bg-blue-700",
    icon_bg: "bg-blue-100",
    icon_text: "text-blue-700",
    header_bg: "bg-gradient-to-r from-blue-50 to-cyan-50",
    header_border: "border-blue-300",
  },
}

export default function PreviewPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [cvData, setCvData] = useState<CVData | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editedData, setEditedData] = useState<CVData | null>(null)
  const [saving, setSaving] = useState(false)
  /* Verification state removed */

  const normalizeCvDates = (data: any): CVData => {
    return {
      ...data,
      createdAt: data?.createdAt ? new Date(data.createdAt) : new Date(),
      updatedAt: data?.updatedAt ? new Date(data.updatedAt) : new Date(),
    } as CVData
  }

  useEffect(() => {
    let mounted = true

    const loadCurrentCv = async () => {
      const savedCV = localStorage.getItem("cvbuilder_current")
      if (savedCV) {
        try {
          const data = normalizeCvDates(JSON.parse(savedCV))
          if (!mounted) return
          setCvData(data)
          setEditedData(data)
          return
        } catch (e) {
          console.error("[v0] Failed to parse current CV:", e)
        }
      }

      const availableCvs = await loadAvailableCvs()
      if (!mounted || availableCvs.length === 0) {
        router.push("/builder")
        return
      }

      const data = normalizeCvDates(availableCvs[0])
      setCvData(data)
      setEditedData(data)
      localStorage.setItem("cvbuilder_current", JSON.stringify(data))
    }

    loadCurrentCv()

    return () => {
      mounted = false
    }
  }, [router])

  const handleSaveChanges = () => {
    if (editedData) {
      setSaving(true)
      const now = new Date()
      const nextCv: CVData = { ...editedData, updatedAt: now }
      localStorage.setItem("cvbuilder_current", JSON.stringify(nextCv))

      let savedCVs = []
      try {
        savedCVs = JSON.parse(localStorage.getItem("cvbuilder_cvs") || "[]")
      } catch (e) {
        console.error("[v0] Failed to parse saved CVs:", e)
      }

      const index = savedCVs.findIndex((cv: CVData) => cv.id === nextCv.id)
      const nextList = index !== -1 ? savedCVs.map((cv: CVData) => (cv.id === nextCv.id ? nextCv : cv)) : [nextCv, ...savedCVs]
      try {
        localStorage.setItem("cvbuilder_cvs", JSON.stringify(nextList))
      } catch (e) {
        console.error("[v0] Failed to save CVs to localStorage:", e)
      }

      setCvData(nextCv)
      setEditedData(nextCv)
      setTimeout(() => {
        setSaving(false)
        setIsEditing(false)
        toast({
          title: "Changes Saved",
          description: "Your CV has been updated successfully.",
        })
      }, 500)
    }
  }

  const handlePrint = () => {
    window.print()
  }

  const handleDownloadPDF = () => {
    const filename = cvData?.personalInfo.fullName
      ? `${cvData.personalInfo.fullName.replace(/\s+/g, "_")}_CV.pdf`
      : "CV.pdf"

    toast({
      title: "Preparing Download",
      description: `Your CV (${filename}) is ready. Use your browser print dialog to save as PDF.`,
    })

    window.print()
  }

  const handleViewJobs = () => {
    router.push("/jobs")
  }


  if (!cvData || !editedData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="size-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading your CV...</p>
        </div>
      </div>
    )
  }

  const theme = templateThemes[cvData.templateId || "sierra-leone-professional"] || templateThemes["sierra-leone-professional"]

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm print:hidden sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.push("/builder")}>
              <ArrowLeft className="size-5" />
            </Button>
            <h1 className="text-2xl font-bold text-foreground">Your Professional CV</h1>
          </div>
          <div className="flex gap-2">
            {isEditing ? (
              <>
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSaveChanges} disabled={saving}>
                  {saving ? (
                    <>
                      <div className="size-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Check className="mr-2 size-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" onClick={() => setIsEditing(true)}>
                  <Edit className="mr-2 size-4" />
                  Edit Preview
                </Button>
                <Button
                  variant="outline"
                  onClick={() => router.push("/ats-checker")}
                  className="border-blue-500/40 bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100"
                >
                  <FileSearch className="mr-2 size-4" />
                  ATS Checker
                </Button>
                <Button variant="outline" onClick={handlePrint}>
                  <Printer className="mr-2 size-4" />
                  Print CV
                </Button>
                <Button onClick={handleDownloadPDF}>
                  <Download className="mr-2 size-4" />
                  Download PDF
                </Button>
                <Button onClick={handleViewJobs} className="bg-primary">
                  <Briefcase className="mr-2 size-4" />
                  Find Jobs
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 print:p-0">
        <div className="max-w-4xl mx-auto mb-6 print:hidden">
          {/* Verification Card Removed */}
        </div>

        <Card className="max-w-4xl mx-auto bg-white shadow-2xl print:shadow-none print:border-0 transition-all overflow-hidden">
          <div className="bg-white shadow-2xl print:shadow-none print:border-0 transition-all overflow-hidden">
            {/* Render Layout based on theme */}
            {theme.layout === "bold-red" ? (
              <BoldRedLayout
                cvData={cvData}
                theme={theme}
                isEditing={isEditing}
                editedData={editedData}
                onEdit={setEditedData}
              />
            ) : theme.layout === "teal-sidebar" ? (
              <TealSidebarLayout
                cvData={cvData}
                theme={theme}
                isEditing={isEditing}
                editedData={editedData}
                onEdit={setEditedData}
              />
            ) : theme.layout === "blue-wave" ? (
              <BlueWaveLayout
                cvData={cvData}
                theme={theme}
                isEditing={isEditing}
                editedData={editedData}
                onEdit={setEditedData}
              />
            ) : theme.layout === "sidebar" ? (
              <SidebarLayout
                cvData={cvData}
                theme={theme}
                isEditing={isEditing}
                editedData={editedData}
                onEdit={setEditedData}
              />
            ) : theme.layout === "minimal" ? (
              <MinimalLayout
                cvData={cvData}
                theme={theme}
                isEditing={isEditing}
                editedData={editedData}
                onEdit={setEditedData}
              />
            ) : (
              <StandardLayout
                cvData={cvData}
                theme={theme}
                isEditing={isEditing}
                editedData={editedData}
                onEdit={setEditedData}
              />
            )}
          </div>
        </Card>

        <div className="max-w-4xl mx-auto mt-8 grid md:grid-cols-3 gap-6 print:hidden">
          <Card
            className="p-6 border-2 border-blue-500/40 hover:border-blue-500 transition-all hover:scale-105 cursor-pointer bg-gradient-to-br from-blue-50 to-indigo-50"
            onClick={() => router.push("/ats-checker")}
          >
            <FileSearch className="size-10 text-blue-600 mb-4" />
            <h3 className="text-xl font-bold text-foreground mb-2">Check ATS Score</h3>
            <p className="text-muted-foreground mb-4">
              Test how well your CV passes Applicant Tracking Systems (ATS) used by 90% of employers in Sierra Leone.
            </p>
            <Button className="w-full bg-blue-600 hover:bg-blue-700">Test Now</Button>
          </Card>

          <Card
            className="p-6 border-2 hover:border-primary transition-all hover:scale-105 cursor-pointer"
            onClick={handlePrint}
          >
            <Printer className="size-10 text-primary mb-4" />
            <h3 className="text-xl font-bold text-foreground mb-2">Print Your CV</h3>
            <p className="text-muted-foreground mb-4">Print a physical copy of your CV for in-person applications.</p>
            <Button variant="outline" className="w-full bg-transparent">
              Print Now
            </Button>
          </Card>

          <Card
            className="p-6 border-2 hover:border-primary transition-all hover:scale-105 cursor-pointer"
            onClick={handleDownloadPDF}
          >
            <Download className="size-10 text-primary mb-4" />
            <h3 className="text-xl font-bold text-foreground mb-2">Download Your CV</h3>
            <p className="text-muted-foreground mb-4">
              Save your CV as a PDF to share with employers or upload to job portals.
            </p>
            <Button variant="outline" className="w-full bg-transparent">
              Download PDF
            </Button>
          </Card>

          <Card
            className="p-6 border-2 hover:border-primary transition-all hover:scale-105 cursor-pointer"
            onClick={handleViewJobs}
          >
            <Briefcase className="size-10 text-primary mb-4" />
            <h3 className="text-xl font-bold text-foreground mb-2">Find Matching Jobs</h3>
            <p className="text-muted-foreground mb-4">
              We'll scan your CV and match you with relevant job openings in Sierra Leone.
            </p>
            <Button className="w-full">View Job Matches</Button>
          </Card>
        </div>
      </div>

      <Toaster />

      <style jsx global>{`
        @media print {
          body {
            background: white;
          }
          @page {
            margin: 0.5in;
            size: A4;
          }
        }
      `}</style>
    </div>
  )
}
