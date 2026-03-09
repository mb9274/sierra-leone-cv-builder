"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { TopBar } from "@/components/builder/top-bar"
import { FormSidebar } from "@/components/builder/form-sidebar"
import { ResumeCanvas } from "@/components/builder/resume-canvas"
import { StylePanel } from "@/components/builder/style-panel"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { ChevronLeft, ChevronRight, Menu } from "lucide-react"

const DEFAULT_DATA = {
  personalInfo: {
    fullName: "",
    email: "",
    phone: "",
    location: "",
    addressCity: "",
    addressCountry: "",
    summary: "",
    age: "",
    profilePhoto: "",
    linkedin: "",
    portfolio: "",
  },
  education: [] as any[],
  experience: [] as any[],
  skills: [] as string[],
  languages: [] as any[],
  projects: [] as any[],
  certifications: [] as any[],
  volunteering: [] as any[],
  awards: [] as any[],
  hobbies: [] as string[],
  referees: [] as any[],
  technicalWriting: [] as any[],
  links: [] as any[],
  templateId: "sierra-leone-professional",
}

export default function CVBuilderPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [cvData, setCvData] = useState<any>(DEFAULT_DATA)
  const [selectedElement, setSelectedElement] = useState<string | null>(null)
  const [zoomLevel, setZoomLevel] = useState(50)
  const [isSaved, setIsSaved] = useState(true)
  const [showLeftSidebar, setShowLeftSidebar] = useState(true)
  const [showRightSidebar, setShowRightSidebar] = useState(true)
  const [undoStack, setUndoStack] = useState<any[]>([])
  const [redoStack, setRedoStack] = useState<any[]>([])

  // Load saved data on mount
  useEffect(() => {
    const saved = localStorage.getItem("cvbuilder_current")
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setCvData({ ...DEFAULT_DATA, ...parsed })
      } catch (e) {
        console.error("Failed to load saved CV:", e)
      }
    }
  }, [])

  // Auto-save
  useEffect(() => {
    const timer = setTimeout(() => {
      if (cvData) {
        setIsSaved(false)
        try {
          localStorage.setItem("cvbuilder_current", JSON.stringify(cvData))
        } catch (e) {
          console.error("Auto-save failed:", e)
        }
        setTimeout(() => setIsSaved(true), 500)
      }
    }, 1000)
    return () => clearTimeout(timer)
  }, [cvData])

  const handleChange = useCallback((path: string, value: any) => {
    setCvData((prev: any) => {
      // Save undo state
      setUndoStack((stack) => [...stack.slice(-20), JSON.parse(JSON.stringify(prev))])
      setRedoStack([])

      const keys = path.split(".")
      const updated = JSON.parse(JSON.stringify(prev))
      let obj = updated
      for (let i = 0; i < keys.length - 1; i++) {
        if (!obj[keys[i]]) obj[keys[i]] = {}
        obj = obj[keys[i]]
      }
      obj[keys[keys.length - 1]] = value
      return updated
    })
  }, [])

  const handleUndo = useCallback(() => {
    if (undoStack.length > 0) {
      const previous = undoStack[undoStack.length - 1]
      setRedoStack((stack) => [...stack, JSON.parse(JSON.stringify(cvData))])
      setUndoStack((stack) => stack.slice(0, -1))
      setCvData(previous)
    }
  }, [undoStack, cvData])

  const handleRedo = useCallback(() => {
    if (redoStack.length > 0) {
      const next = redoStack[redoStack.length - 1]
      setUndoStack((stack) => [...stack, JSON.parse(JSON.stringify(cvData))])
      setRedoStack((stack) => stack.slice(0, -1))
      setCvData(next)
    }
  }, [redoStack, cvData])

  const handleDownload = () => {
    window.print()
    toast({ title: "Preparing download...", description: "Use the print dialog to save as PDF." })
  }

  const handleShare = () => {
    // Save the CV first
    const verificationId = `CV${Date.now()}${Math.random().toString(36).substring(2, 9).toUpperCase()}`
    const cvToSave = {
      ...cvData,
      id: cvData.id || Date.now().toString(),
      verificationId,
      updatedAt: new Date(),
      createdAt: cvData.createdAt || new Date(),
    }

    let existingCVs = []
    try { existingCVs = JSON.parse(localStorage.getItem("cvbuilder_cvs") || "[]") } catch { }
    const index = existingCVs.findIndex((c: any) => c.id === cvToSave.id)
    if (index !== -1) existingCVs[index] = cvToSave
    else existingCVs.push(cvToSave)
    localStorage.setItem("cvbuilder_cvs", JSON.stringify(existingCVs))
    localStorage.setItem("cvbuilder_current", JSON.stringify(cvToSave))

    toast({ title: "CV Saved!", description: "Redirecting to preview..." })
    setTimeout(() => router.push("/preview"), 800)
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden print:overflow-visible">
      {/* Top Bar */}
      <TopBar
        onDownload={handleDownload}
        onShare={handleShare}
        onUndo={handleUndo}
        onRedo={handleRedo}
        zoomLevel={zoomLevel}
        setZoomLevel={setZoomLevel}
        isSaved={isSaved}
        canUndo={undoStack.length > 0}
        canRedo={redoStack.length > 0}
      />

      {/* Three Panel Layout */}
      <div className="flex flex-1 overflow-hidden print:block relative">
        {/* Left: Form Sidebar - Hidden on mobile/tablet by default */}
        {showLeftSidebar && (
          <div className="fixed bottom-0 left-0 right-0 h-[85vh] z-50 bg-white border-t shadow-2xl animate-in slide-in-from-bottom duration-300 ease-out md:relative md:w-[300px] lg:relative lg:inset-auto lg:w-[260px] lg:min-w-[260px] lg:max-w-[300px] border-r overflow-y-auto print:hidden">
            <FormSidebar
              data={cvData}
              onChange={handleChange}
              selectedElement={selectedElement}
              onSelectElement={setSelectedElement}
              onClose={() => setShowLeftSidebar(false)}
            />
          </div>
        )}

        {/* Center: Resume Canvas */}
        <div className="flex-1 bg-gray-100 overflow-auto print:bg-white print:overflow-visible relative">
          {/* Toggles - Show on mobile and tablet */}
          <div className={`absolute top-3 left-3 z-10 flex gap-2 print:hidden lg:hidden ${showLeftSidebar ? 'hidden' : ''}`}>
            <Button
              variant="outline"
              className="h-12 w-12 bg-white/95 backdrop-blur shadow-md border-gray-200 hover:bg-white rounded-lg"
              onClick={() => setShowLeftSidebar(true)}
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          </div>
          <div className={`absolute top-3 left-3 z-10 flex gap-2 print:hidden lg:hidden ${showLeftSidebar ? '' : 'hidden'}`}>
            <Button
              variant="outline"
              className="h-12 w-12 bg-white/95 backdrop-blur shadow-md border-gray-200 hover:bg-white rounded-lg"
              onClick={() => setShowLeftSidebar(false)}
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
          </div>
          <div className={`absolute top-3 right-3 z-10 flex gap-2 print:hidden lg:hidden ${showRightSidebar ? 'hidden' : ''}`}>
            <Button
              variant="outline"
              className="h-12 w-12 bg-white/95 backdrop-blur shadow-md border-gray-200 hover:bg-white rounded-lg"
              onClick={() => setShowRightSidebar(true)}
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
          </div>
          <div className={`absolute top-3 right-3 z-10 flex gap-2 print:hidden lg:hidden ${showRightSidebar ? '' : 'hidden'}`}>
            <Button
              variant="outline"
              className="h-12 w-12 bg-white/95 backdrop-blur shadow-md border-gray-200 hover:bg-white rounded-lg"
              onClick={() => setShowRightSidebar(false)}
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          </div>
          <ResumeCanvas
            data={cvData}
            templateId={cvData.templateId}
            zoomLevel={zoomLevel}
            selectedElement={selectedElement}
            onSelectElement={setSelectedElement}
          />
        </div>

        {/* Right: Style Panel - Hidden on mobile/tablet by default */}
        {showRightSidebar && (
          <div className="fixed bottom-0 left-0 right-0 h-[85vh] z-50 bg-white border-t shadow-2xl animate-in slide-in-from-bottom duration-300 ease-out md:fixed md:right-0 md:top-0 md:h-full md:w-80 md:border-l md:animate-in md:slide-in-from-right lg:relative lg:inset-auto lg:w-[300px] lg:min-w-[300px] lg:max-w-[350px] lg:border-l overflow-y-auto print:hidden">
            <StylePanel
              data={cvData}
              onChange={handleChange}
              selectedElement={selectedElement}
              onClose={() => setShowRightSidebar(false)}
            />
          </div>
        )}
      </div>

      <Toaster />
    </div>
  )
}
