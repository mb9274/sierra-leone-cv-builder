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
          <div className="fixed inset-0 z-50 lg:relative lg:inset-auto lg:w-[340px] lg:min-w-[340px] lg:max-w-[400px] border-r bg-white overflow-y-auto print:hidden animate-in slide-in-from-left duration-300">
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
          <div className={`absolute top-4 left-4 z-10 flex gap-2 print:hidden lg:hidden ${showLeftSidebar ? 'hidden' : ''}`}>
            {showLeftSidebar ? (
              <Button
                variant="outline"
                size="sm"
                className="bg-white/90 backdrop-blur shadow-sm border-gray-200 hover:bg-white"
                onClick={() => setShowLeftSidebar(false)}
              >
                <span className="hidden xs:inline">Hide Editor</span>
                <span className="xs:hidden">✕</span>
              </Button>
            ) : (
              <Button
                variant="outline"
                size="sm"
                className="bg-white/90 backdrop-blur shadow-sm border-gray-200 hover:bg-white"
                onClick={() => setShowLeftSidebar(true)}
              >
                <span className="hidden xs:inline">Show Editor</span>
                <span className="xs:hidden">📝</span>
              </Button>
            )}
          </div>
          <div className={`absolute top-4 right-4 z-10 flex gap-2 print:hidden lg:hidden ${showRightSidebar ? 'hidden' : ''}`}>
            {showRightSidebar ? (
              <Button
                variant="outline"
                size="sm"
                className="bg-white/90 backdrop-blur shadow-sm border-gray-200 hover:bg-white"
                onClick={() => setShowRightSidebar(false)}
              >
                <span className="hidden xs:inline">Hide Style</span>
                <span className="xs:hidden">🎨</span>
              </Button>
            ) : (
              <Button
                variant="outline"
                size="sm"
                className="bg-white/90 backdrop-blur shadow-sm border-gray-200 hover:bg-white"
                onClick={() => setShowRightSidebar(true)}
              >
                <span className="hidden xs:inline">Show Style</span>
                <span className="xs:hidden">🎨</span>
              </Button>
            )}
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
          <div className="fixed inset-0 z-50 lg:relative lg:inset-auto lg:w-[320px] lg:min-w-[320px] lg:max-w-[400px] border-l bg-white overflow-y-auto print:hidden animate-in slide-in-from-right duration-300">
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
