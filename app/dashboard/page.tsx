"use client"
export const dynamic = "force-dynamic"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/hooks/use-toast"
import { loadAvailableCvs, loadLocalCvs, saveLocalCv } from "@/lib/cv-collection"
import { normalizeCvRecord } from "@/lib/cv-storage"
import { getCvLocation } from "@/lib/cv-location"
import { Chatbot } from "@/components/chatbot"
import type { CVData } from "@/lib/types"
import {
  ArrowDownRight,
  ArrowUpRight,
  Bell,
  BookOpen,
  BriefcaseBusiness,
  ClipboardList,
  Eye,
  FileText,
  GraduationCap,
  Home,
  LayoutGrid,
  LogOut,
  MessageSquareText,
  MoreHorizontal,
  Search,
  ShieldCheck,
  Upload,
  UserRound,
} from "lucide-react"

type SidebarItem = {
  label: string
  href: string
  icon: React.ComponentType<{ className?: string }>
}

const lineData = [
  { label: "Mar", value: 3000 },
  { label: "Apr", value: 3500 },
  { label: "May", value: 4653 },
  { label: "Jun", value: 4200 },
  { label: "Jul", value: 4778 },
]

const activityData = [
  { label: "Profile", value: 32 },
  { label: "Education", value: 25 },
  { label: "Experience", value: 17 },
  { label: "Skills", value: 16 },
  { label: "Storage", value: 10 },
]

export default function DashboardPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [cvs, setCvs] = useState<CVData[]>([])
  const [currentUser, setCurrentUser] = useState<{ name: string; email: string } | null>(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [error, setError] = useState("")
  const [assistantOpen, setAssistantOpen] = useState(false)

  useEffect(() => {
    loadDashboard()
  }, [])

  const loadDashboard = async () => {
    try {
      const sessionResponse = await fetch("/api/auth/session", { cache: "no-store" })
      if (sessionResponse.status === 401) {
        router.push("/auth/sign-in?next=/dashboard")
        return
      }

      if (sessionResponse.ok) {
        const session = await sessionResponse.json()
        const user = session.user
        if (user) {
          setCurrentUser({
            name: user.name || user.email || "Signed in user",
            email: user.email || "",
          })
        }
      }

      const availableCvs = await loadAvailableCvs()
      if (availableCvs.length > 0) {
        setCvs(availableCvs.map((cv: any) => normalizeCvRecord(cv)))
        setError("")
        return
      }

      const localCvs = loadLocalCvs()
      if (localCvs.length > 0) {
        setCvs(localCvs)
        setError("Server CV sync is unavailable. Showing locally saved CVs.")
        return
      }

      setCvs([])
      setError("")
    } catch (err) {
      console.error("Dashboard load error:", err)
      const localCvs = loadLocalCvs()

      if (localCvs.length > 0) {
        setCvs(localCvs)
        setError("Server CV sync is unavailable. Showing locally saved CVs.")
        return
      }

      setCvs([])
      setError("")
    } finally {
      setAuthLoading(false)
    }
  }

  const primaryCv = cvs[0] || null
  const activeLocation = primaryCv ? getCvLocation(primaryCv) : "Freetown, Sierra Leone"
  const totalSkills = cvs.reduce((sum, cv) => sum + (cv.skills?.length || 0), 0)
  const avgSkills = cvs.length > 0 ? Math.round(totalSkills / cvs.length) : 0
  const atsReady = cvs.filter((cv) => {
    const hasBasics = Boolean(cv.personalInfo?.fullName && cv.personalInfo?.email && cv.personalInfo?.phone)
    const hasSummary = Boolean(cv.personalInfo?.summary && cv.personalInfo.summary.length >= 50)
    const hasWork = (cv.experience?.length || 0) > 0
    const hasSkills = (cv.skills?.length || 0) >= 5
    return hasBasics && hasSummary && hasWork && hasSkills
  }).length
  const completionScore = primaryCv
    ? [
        primaryCv.personalInfo?.fullName,
        primaryCv.personalInfo?.email,
        primaryCv.personalInfo?.phone,
        primaryCv.personalInfo?.summary,
        primaryCv.education?.length,
        primaryCv.experience?.length,
        primaryCv.skills?.length,
      ].filter(Boolean).length * 14
    : 0

  const recentCvs = [...cvs]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .filter((cv) => cv.personalInfo?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()))
    .slice(0, 3)

  const sidebarItems: SidebarItem[] = [
    { label: "Dashboard", href: "/dashboard", icon: Home },
    { label: "Builder", href: "/builder", icon: FileText },
    { label: "Upload CV", href: "/cv", icon: Upload },
    { label: "ATS Checker", href: "/ats-checker", icon: ShieldCheck },
    { label: "Jobs", href: "/jobs", icon: BriefcaseBusiness },
    { label: "Applications", href: "/applications", icon: ClipboardList },
    { label: "Cover Letter", href: "/cover-letter", icon: MessageSquareText },
    { label: "Interview", href: "/interview", icon: GraduationCap },
    { label: "Learning", href: "/learning-center", icon: BookOpen },
    { label: "Profile", href: "/profile", icon: UserRound },
  ]

  const openCv = (cv: CVData, target: "/builder" | "/preview") => {
    sessionStorage.setItem("cvbuilder_current", JSON.stringify(cv))
    saveLocalCv(cv)
    router.push(target)
  }

  const handleGenerateCV = () => {
    router.push("/generate")
  }

  const handleDeleteCV = async (cvId: string) => {
    if (!confirm("Are you sure you want to delete this CV?")) return

    const response = await fetch(`/api/cvs/${cvId}`, {
      method: "DELETE",
    })

    if (!response.ok) {
      const result = await response.json().catch(() => null)
      console.error("Delete error:", result)
      toast({
        title: "Error",
        description: "Failed to delete CV. Please try again.",
        variant: "destructive",
      })
      return
    }

    setCvs((prev) => prev.filter((cv) => cv.id !== cvId))
    toast({ title: "CV Deleted" })
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="flex min-h-screen">
        <aside className="hidden w-64 shrink-0 border-r border-slate-200 bg-white p-6 shadow-lg lg:flex lg:flex-col">
          <div className="mb-8">
            <h1 className="text-xl font-black tracking-[0.28em] text-slate-900">FINCHECK</h1>
            <p className="mt-2 text-xs uppercase tracking-[0.35em] text-slate-400">CV Dashboard</p>
          </div>

          <nav className="space-y-2">
            {sidebarItems.map((item) => {
              const Icon = item.icon
              const active = item.href === "/dashboard"
              return (
                <button
                  key={item.href}
                  type="button"
                  onClick={() => router.push(item.href)}
                  className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                    active ? "bg-blue-50 text-blue-600" : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <Icon className="size-4" />
                  {item.label}
                </button>
              )
            })}
          </nav>

          <div className="mt-auto space-y-2 pt-8">
            <button
              type="button"
              onClick={() => router.push("/settings")}
              className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-900"
            >
              <LayoutGrid className="size-4" />
              Statistics
            </button>
            <button
              type="button"
              onClick={() => router.push("/auth/sign-out")}
              className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-900"
            >
              <LogOut className="size-4" />
              Log out
            </button>
          </div>
        </aside>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                {authLoading
                  ? "Checking session..."
                  : currentUser
                    ? `Hi ${currentUser.name}, Welcome back!`
                    : "Welcome back!"}
              </p>
              <h2 className="text-2xl font-semibold text-slate-900">Dashboard</h2>
              {currentUser?.email && <p className="mt-1 text-xs text-slate-500">Session email: {currentUser.email}</p>}
              {error && <p className="mt-2 text-xs font-medium text-amber-600">{error}</p>}
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button
                type="button"
                onClick={() => setAssistantOpen((prev) => !prev)}
                className="h-11 rounded-full bg-emerald-600 px-4 text-white hover:bg-emerald-700"
              >
                <MessageSquareText className="mr-2 size-4" />
                AI Assistant
              </Button>
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                <Input
                  type="text"
                  placeholder="Type to search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="h-11 w-full rounded-full border-slate-300 bg-white pl-10 pr-4 shadow-sm sm:w-64"
                />
              </div>
              <div className="flex items-center gap-3">
                <Button variant="outline" size="icon" className="rounded-full bg-white">
                  <Bell className="size-4" />
                </Button>
                <div className="flex size-11 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white shadow">
                  {currentUser?.name?.[0]?.toUpperCase() || "U"}
                </div>
                <Button variant="ghost" size="icon" className="rounded-full text-slate-500">
                  <MoreHorizontal className="size-4" />
                </Button>
              </div>
            </div>
          </div>

          {assistantOpen && (
            <div className="mb-6 max-w-2xl">
              <Chatbot userName={currentUser?.name || undefined} embedded />
            </div>
          )}

          <div className="mb-6 grid gap-4 md:grid-cols-[1.5fr_1fr]">
            <Card className="border-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 text-white shadow-xl">
              <CardContent className="flex h-full flex-col justify-between p-5">
                  <div>
                    <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-white/80">
                    <ShieldCheck className="size-3.5" />
                    AI CV Generator
                  </div>
                  <h3 className="mt-4 text-2xl font-semibold">Generate a full CV with AI</h3>
                  <p className="mt-2 max-w-md text-sm leading-6 text-white/75">
                    Enter your full name, email, skills, and background, and let the AI create a complete CV for you.
                  </p>
                </div>
                <div className="mt-5 flex flex-wrap gap-3">
                  <Button onClick={handleGenerateCV} className="bg-white text-slate-900 hover:bg-slate-100">
                    Generate Full CV
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => router.push("/cv")}
                    className="border-white/20 bg-white/5 text-white hover:bg-white/10"
                  >
                    Upload CV
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 bg-white shadow-sm">
              <CardContent className="p-5">
                <p className="font-semibold text-slate-900">Quick Actions</p>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => router.push("/preview")}
                    className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-left transition hover:bg-white hover:shadow-sm"
                  >
                    <Eye className="size-5 text-indigo-600" />
                    <p className="mt-3 text-sm font-semibold text-slate-900">Preview</p>
                  </button>
                  <button
                    type="button"
                    onClick={() => router.push("/ats-checker")}
                    className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-left transition hover:bg-white hover:shadow-sm"
                  >
                    <ShieldCheck className="size-5 text-blue-600" />
                    <p className="mt-3 text-sm font-semibold text-slate-900">ATS Checker</p>
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mb-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <Card className="border-0 bg-gradient-to-br from-teal-400 to-teal-500 text-white shadow-lg">
              <CardContent className="p-4">
                <p className="text-sm/6 text-white/90">Total CVs</p>
                <p className="text-2xl font-bold">{cvs.length}</p>
                <p className="mt-1 text-sm text-white/90 flex items-center gap-1">
                  <ArrowUpRight className="size-4" />
                  {cvs.length > 0 ? "Saved and synced" : "Start your first CV"}
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 bg-gradient-to-br from-blue-400 to-blue-500 text-white shadow-lg">
              <CardContent className="p-4">
                <p className="text-sm/6 text-white/90">ATS Ready</p>
                <p className="text-2xl font-bold">{atsReady}</p>
                <p className="mt-1 text-sm text-white/90 flex items-center gap-1">
                  <ArrowUpRight className="size-4" />
                  CVs ready to apply
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 bg-gradient-to-br from-pink-400 to-pink-500 text-white shadow-lg">
              <CardContent className="p-4">
                <p className="text-sm/6 text-white/90">Avg Skills</p>
                <p className="text-2xl font-bold">{avgSkills}</p>
                <p className="mt-1 text-sm text-white/90 flex items-center gap-1">
                  <ArrowDownRight className="size-4" />
                  Skills per CV
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 bg-gradient-to-br from-violet-400 to-violet-500 text-white shadow-lg">
              <CardContent className="p-4">
                <p className="text-sm/6 text-white/90">Active Location</p>
                <p className="text-xl font-bold leading-tight">{activeLocation}</p>
                <p className="mt-1 text-sm text-white/90 flex items-center gap-1">
                  <ArrowUpRight className="size-4" />
                  Current profile location
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="mb-6 grid gap-4 xl:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)]">
            <Card className="border-0 bg-white shadow-sm">
              <CardContent className="p-5">
                <p className="mb-3 font-semibold text-slate-900">CV Activity</p>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                  <div className="flex h-56 items-end gap-3">
                    {lineData.map((point, index) => {
                      const height = `${Math.max(20, ((point.value - 2600) / 2400) * 100)}%`
                      return (
                        <div key={point.label} className="flex flex-1 flex-col items-center gap-2">
                          <div className="flex h-full w-full items-end">
                            <div
                              className={`w-full rounded-t-2xl ${index % 4 === 0 ? "bg-teal-400" : index % 4 === 1 ? "bg-blue-400" : index % 4 === 2 ? "bg-pink-400" : "bg-violet-400"}`}
                              style={{ height }}
                            />
                          </div>
                          <div className="text-xs font-medium text-slate-500">{point.label}</div>
                        </div>
                      )
                    })}
                  </div>
                  <div className="mt-4 flex items-center justify-between text-sm text-slate-500">
                    <span>Mar</span>
                    <span>Jul</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 bg-white shadow-sm">
              <CardContent className="p-5">
                <p className="mb-3 font-semibold text-slate-900">Activity</p>
                <div className="flex items-center justify-center rounded-2xl bg-slate-50 px-4 py-6">
                  <div className="text-center">
                    <div className="text-3xl font-black text-slate-900">{Math.min(100, completionScore || 0)}%</div>
                    <p className="mt-1 text-sm text-slate-500">Profile strength</p>
                  </div>
                </div>
                <div className="mt-5 space-y-3">
                  {activityData.map((item) => (
                    <div key={item.label}>
                      <div className="mb-1 flex items-center justify-between text-sm">
                        <span className="text-slate-600">{item.label}</span>
                        <span className="font-medium text-slate-900">{item.value}%</span>
                      </div>
                      <div className="h-2 rounded-full bg-slate-200">
                        <div className="h-2 rounded-full bg-blue-500" style={{ width: `${item.value}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 xl:grid-cols-2">
            <Card className="border-0 bg-white shadow-sm">
              <CardContent className="p-5">
                <p className="mb-3 font-semibold text-slate-900">Recent CV Activity</p>
                {recentCvs.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-slate-200 px-4 py-10 text-center text-sm text-slate-500">
                    No CVs created yet. Start with the CV Builder.
                  </div>
                ) : (
                  <div className="overflow-hidden rounded-2xl border border-slate-200">
                    <table className="min-w-full text-left text-sm">
                      <thead className="bg-slate-50 text-slate-500">
                        <tr>
                          <th className="px-4 py-3 font-medium">Resume</th>
                          <th className="px-4 py-3 font-medium">Status</th>
                          <th className="px-4 py-3 font-medium">Date</th>
                          <th className="px-4 py-3 font-medium">Location</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {recentCvs.map((cv) => {
                          const status = cv.skills?.length && cv.experience?.length ? "Ready" : "Needs work"
                          return (
                            <tr key={cv.id} className="text-slate-700">
                              <td className="px-4 py-3 font-medium text-slate-900">
                                {cv.personalInfo?.fullName || "Untitled CV"}
                              </td>
                              <td className="px-4 py-3">{status}</td>
                              <td className="px-4 py-3">{new Date(cv.updatedAt).toLocaleDateString()}</td>
                              <td className="px-4 py-3">{getCvLocation(cv) || "Not set"}</td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="border-0 bg-white shadow-sm">
              <CardContent className="p-5">
                <p className="mb-3 font-semibold text-slate-900">My Goals</p>
                <div className="space-y-4">
                  <div>
                    <div className="mb-2 flex items-center justify-between text-sm text-slate-600">
                      <span>Profile completion</span>
                      <span>{Math.min(100, completionScore || 0)}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-200">
                      <div
                        className="h-2 rounded-full bg-blue-500"
                        style={{ width: `${Math.min(100, completionScore || 0)}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="mb-2 flex items-center justify-between text-sm text-slate-600">
                      <span>ATS readiness</span>
                      <span>{cvs.length ? Math.round((atsReady / cvs.length) * 100) : 0}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-200">
                      <div
                        className="h-2 rounded-full bg-teal-500"
                        style={{ width: `${cvs.length ? Math.round((atsReady / cvs.length) * 100) : 0}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="mb-2 flex items-center justify-between text-sm text-slate-600">
                      <span>Job applications</span>
                      <span>{Math.min(100, cvs.length * 20)}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-200">
                      <div className="h-2 rounded-full bg-pink-500" style={{ width: `${Math.min(100, cvs.length * 20)}%` }} />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>

      <Toaster />
    </div>
  )
}
