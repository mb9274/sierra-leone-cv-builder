"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { TopBar } from "@/components/builder/top-bar"
import { FormSidebar } from "@/components/builder/form-sidebar"
import { ResumeCanvas } from "@/components/builder/resume-canvas"
import { StylePanel } from "@/components/builder/style-panel"
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/hooks/use-toast"
import type { CVData } from "@/lib/types"

const DEFAULT_PERSONAL_INFO = {
  fullName: "David St. Peter",
  jobTitle: "Professional",
  email: "yourname@gmail.com",
  phone: "+000 123 456 789",
  location: "Your Location",
  summary: "Write a professional summary that highlights your key skills and achievements...",
  profilePhoto: "",
  linkedin: "",
  portfolio: "",
}

export default function CVBuilderPage() {
  const router = useRouter()
  const { toast } = useToast()

  const [zoomLevel, setZoomLevel] = useState(32)
  const [isSaved, setIsSaved] = useState(true)
  const [history, setHistory] = useState<any[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const historyIndexRef = useRef(-1)
  const [cvData, setCvData] = useState<Partial<CVData>>({
    personalInfo: DEFAULT_PERSONAL_INFO,
    experience: [
      {
        id: "exp1",
        position: "Senior UX Designer",
        company: "Company Name",
        location: "Freetown, Sierra Leone",
        startDate: "2020",
        endDate: "Present",
        current: true,
        description: "Lorem ipsum is simply dummy text of the printing and typesetting industry."
      },
      {
        id: "exp2",
        position: "Junior UX Designer",
        company: "Company Name",
        location: "Bo, Sierra Leone",
        startDate: "2017",
        endDate: "2019",
        current: false,
        description: "Lorem ipsum is simply dummy text offered the printing and typesetting industry."
      }
    ],
    education: [
      {
        id: "edu1",
        degree: "Degree Name",
        institution: "University name here",
        fieldOfStudy: "Design",
        startDate: "2014",
        endDate: "2016",
        current: false
      }
    ],
    skills: ["UX Design", "Product Design", "UI Design"],
    languages: [],
    projects: [],
    links: [],
    templateId: "sierra-leone-professional",
    styles: {} // Add styles to CVData if not present
  })
  const [selectedElement, setSelectedElement] = useState<string | null>(null)

  const ensureCvForStorage = (data: Partial<CVData>): CVData => {
    const now = new Date()
    const id = (data as any)?.id || `cv_${Date.now()}`

    return {
      id,
      createdAt: (data as any)?.createdAt ? new Date((data as any).createdAt) : now,
      updatedAt: now,
      templateId: (data as any)?.templateId || "sierra-leone-professional",
      personalInfo: {
        ...DEFAULT_PERSONAL_INFO,
        ...(data.personalInfo || {}),
      },
      experience: (data.experience || []) as any,
      education: (data.education || []) as any,
      skills: (data.skills || []) as any,
      languages: (data.languages || []) as any,
      projects: (data.projects || []) as any,
      links: (data.links || []) as any,
    } as CVData
  }

  const persistCurrent = (data: Partial<CVData>) => {
    const cv = ensureCvForStorage(data)
    try {
      localStorage.setItem("cvbuilder_current", JSON.stringify(cv))
    } catch { }

    try {
      const raw = localStorage.getItem("cvbuilder_cvs")
      const list: CVData[] = raw ? JSON.parse(raw) : []
      const idx = list.findIndex((c) => c.id === cv.id)
      const next = idx >= 0 ? list.map((c) => (c.id === cv.id ? cv : c)) : [cv, ...list]
      localStorage.setItem("cvbuilder_cvs", JSON.stringify(next))
    } catch { }
  }

  // Load saved data
  useEffect(() => {
    const savedCV = localStorage.getItem("cvbuilder_current")
    if (savedCV) {
      try {
        const parsed = JSON.parse(savedCV)
        const normalized = ensureCvForStorage(parsed)
        setCvData(normalized)
        setHistory([normalized])
        setHistoryIndex(0)
      } catch (e) {
        console.error("Failed to load saved CV:", e)
      }
    } else {
      const normalized = ensureCvForStorage(cvData)
      setCvData(normalized)
      setHistory([normalized])
      setHistoryIndex(0)
    }
  }, [])

  // Auto-save logic
  useEffect(() => {
    const autoSave = setTimeout(() => {
      if (cvData && Object.keys(cvData).length > 0) {
        setIsSaved(false)
        try {
          persistCurrent(cvData)
          setTimeout(() => setIsSaved(true), 500)
        } catch (e) {
          console.error("Auto-save failed:", e)
        }
      }
    }, 1000)

    return () => clearTimeout(autoSave)
  }, [cvData])

  useEffect(() => {
    historyIndexRef.current = historyIndex
  }, [historyIndex])

  const clone = (value: any) => JSON.parse(JSON.stringify(value))

  const setByPath = (obj: any, path: string, value: any) => {
    const parts = path.split(".").filter(Boolean)
    const root = clone(obj ?? {})

    let current: any = root
    for (let i = 0; i < parts.length; i++) {
      const key = parts[i]
      const isLast = i === parts.length - 1
      const isIndex = /^\d+$/.test(key)
      const normalizedKey: any = isIndex ? Number.parseInt(key, 10) : key

      if (isLast) {
        current[normalizedKey] = value
        break
      }

      const nextKey = parts[i + 1]
      const nextIsIndex = /^\d+$/.test(nextKey)
      if (current[normalizedKey] == null) {
        current[normalizedKey] = nextIsIndex ? [] : {}
      }
      current = current[normalizedKey]
    }

    return root
  }

  const handleDataChange = (path: string, value: any) => {
    setCvData((prev: any) => {
      const next = setByPath(prev, path, value)
      setHistory((h) => {
        const idx = historyIndexRef.current
        const base = h.length ? h.slice(0, idx + 1) : []
        const nextHistory = [...base, clone(next)]
        setHistoryIndex(nextHistory.length - 1)
        return nextHistory
      })
      return next
    })
  }

  const handleUndo = () => {
    setHistoryIndex((idx) => {
      if (idx <= 0) return idx
      const nextIdx = idx - 1
      setCvData(history[nextIdx])
      return nextIdx
    })
  }

  const handleRedo = () => {
    setHistoryIndex((idx) => {
      if (idx >= history.length - 1) return idx
      const nextIdx = idx + 1
      setCvData(history[nextIdx])
      return nextIdx
    })
  }

  const handleDownload = () => {
    persistCurrent(cvData)
    toast({
      title: "Preparing Download",
      description: "Your professional CV is being generated...",
    })
    router.push("/preview")
  }

  const handleShare = () => {
    persistCurrent(cvData)
    const shareUrl = `${window.location.origin}/preview`

    const done = () =>
      toast({
        title: "Share Link Copied",
        description: "You can now share your CV with recruiters.",
      })

    try {
      if (navigator?.clipboard?.writeText) {
        navigator.clipboard
          .writeText(shareUrl)
          .then(done)
          .catch(() => done())
        return
      }
    } catch { }

    done()
  }

  const handleAIAssist = async () => {
    try {
      toast({
        title: "AI Suggestions",
        description: "Analyzing your CV and generating improvements...",
      })

      const response = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "enhance_cv",
          cvData,
        }),
      })

      if (!response.ok) {
        throw new Error(`AI request failed: ${response.status}`)
      }

      const data = await response.json()

      const enhanced = data?.enhancedData ?? data

      if (enhanced && typeof enhanced === "object") {
        setCvData((prev: any) => {
          const next = { ...prev, ...enhanced }
          setHistory((h) => {
            const idx = historyIndexRef.current
            const base = h.length ? h.slice(0, idx + 1) : []
            const nextHistory = [...base, clone(next)]
            setHistoryIndex(nextHistory.length - 1)
            return nextHistory
          })
          persistCurrent(next)
          return next
        })
      }

      toast({
        title: "AI Suggestions Ready",
        description: "Your CV has been improved. Review the updates in the form and preview.",
      })
    } catch (e: any) {
      toast({
        title: "AI Suggestions Failed",
        description: e?.message || "Please try again.",
      })
    }
  }

  const handleMore = () => {
    toast({
      title: "More",
      description: "More options coming soon.",
    })
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50 overflow-hidden font-sans">
      <TopBar
        zoomLevel={zoomLevel}
        setZoomLevel={setZoomLevel}
        isSaved={isSaved}
        onDownload={() => {
          toast({
            title: "Download Started",
            description: "Your professional CV is being generated as a PDF...",
          })
        }}
        onShare={() => {
          toast({
            title: "Link Copied",
            description: "CV link has been copied to your clipboard.",
          })
        }}
        onAIAssist={() => {
          toast({
            title: "AI Assistant",
            description: "Our AI is analyzing your CV to suggest improvements...",
          })
        }}
        onMore={handleMore}
        onUndo={handleUndo}
        onRedo={handleRedo}
        canUndo={historyIndex > 0}
        canRedo={historyIndex < history.length - 1}
      />

      <div className="flex flex-1 overflow-hidden">
        <FormSidebar
          data={cvData}
          onChange={handleDataChange}
          selectedElement={selectedElement}
          onSelectElement={setSelectedElement}
        />

        <ResumeCanvas
          data={cvData}
          zoomLevel={zoomLevel}
          templateId={(cvData as any)?.templateId}
          selectedElement={selectedElement}
          onSelectElement={setSelectedElement}
        />

        <StylePanel
          data={cvData}
          onChange={handleDataChange}
          selectedElement={selectedElement}
          onClose={() => setSelectedElement(null)}
        />
      </div>

      <Toaster />
    </div>
  )
}
