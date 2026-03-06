"use client"

import { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  LayoutGrid,
  ClipboardList,
  Briefcase,
  MapPin,
  BookOpen,
  User,
  FileSearch,
  Phone,
  LogOut,
} from "lucide-react"

export function AppSidebar() {
  const router = useRouter()
  const pathname = usePathname()
  const [applicationCount, setApplicationCount] = useState(0)

  useEffect(() => {
    try {
      const savedApplications = localStorage.getItem("job_applications")
      if (savedApplications) {
        const applications = JSON.parse(savedApplications)
        setApplicationCount(applications.length)
      }
    } catch {
      setApplicationCount(0)
    }
  }, [pathname])

  const handleSignOut = () => {
    localStorage.removeItem("user")
    router.replace("/auth/sign-in")
  }

  const isActive = (href: string) => pathname === href
  const isActivePrefix = (prefix: string) => !!pathname && pathname.startsWith(prefix)

  return (
    <aside className="w-64 border-r bg-white h-screen p-6 sticky top-0 hidden lg:flex flex-col">
      <div className="flex items-center gap-3 mb-8">
        <div className="size-8 rounded bg-black flex items-center justify-center">
          <div className="size-4 bg-white rounded-full translate-x-1" />
        </div>
        <span className="font-bold text-xl tracking-tight">AI CV Builder</span>
      </div>

      <div className="space-y-1">
        <Button
          variant={isActive("/dashboard") ? "secondary" : "ghost"}
          className={`w-full justify-start gap-3 h-11 border-none ${
            isActive("/dashboard")
              ? "bg-blue-50 text-blue-600 hover:bg-blue-100"
              : "text-gray-500 hover:text-black"
          }`}
          onClick={() => router.push("/dashboard")}
        >
          <LayoutGrid className="size-4" />
          All Resumes
        </Button>

        <div className="pt-3">
          <div className="px-4 pb-2 text-[10px] uppercase font-bold tracking-widest text-gray-400 font-sans">
            Jobs
          </div>

          <Button
            variant={isActivePrefix("/jobs") ? "secondary" : "ghost"}
            className={`w-full justify-start gap-3 h-11 border-none ${
              isActivePrefix("/jobs")
                ? "bg-blue-50 text-blue-600 hover:bg-blue-100"
                : "text-gray-500 hover:text-black"
            }`}
            onClick={() => router.push("/jobs")}
          >
            <Briefcase className="size-4" />
            Jobs
          </Button>

          <Button
            variant={isActive("/job-map") ? "secondary" : "ghost"}
            className={`w-full justify-start gap-3 h-10 border-none ml-3 pl-8 ${
              isActive("/job-map")
                ? "bg-blue-50 text-blue-600 hover:bg-blue-100"
                : "text-gray-500 hover:text-black"
            }`}
            onClick={() => router.push("/job-map")}
          >
            <MapPin className="size-4" />
            Job Map
          </Button>
        </div>

        <Button
          variant={isActive("/applications") ? "secondary" : "ghost"}
          className={`w-full justify-start gap-3 h-11 border-none ${
            isActive("/applications")
              ? "bg-blue-50 text-blue-600 hover:bg-blue-100"
              : "text-gray-500 hover:text-black"
          }`}
          onClick={() => router.push("/applications")}
        >
          <ClipboardList className="size-4" />
          Applications
          {applicationCount > 0 && (
            <Badge className="ml-auto bg-blue-600 h-5 px-1.5 min-w-[20px] justify-center">
              {applicationCount}
            </Badge>
          )}
        </Button>

        <Button
          variant={isActive("/learning-center") ? "secondary" : "ghost"}
          className={`w-full justify-start gap-3 h-11 border-none ${
            isActive("/learning-center")
              ? "bg-blue-50 text-blue-600 hover:bg-blue-100"
              : "text-gray-500 hover:text-black"
          }`}
          onClick={() => router.push("/learning-center")}
        >
          <BookOpen className="size-4" />
          Learning Center
        </Button>

        <Button
          variant={isActivePrefix("/profile") ? "secondary" : "ghost"}
          className={`w-full justify-start gap-3 h-11 border-none ${
            isActivePrefix("/profile")
              ? "bg-blue-50 text-blue-600 hover:bg-blue-100"
              : "text-gray-500 hover:text-black"
          }`}
          onClick={() => router.push("/profile")}
        >
          <User className="size-4" />
          Profile
        </Button>

        <Button
          variant={isActive("/ats-checker") ? "secondary" : "ghost"}
          className={`w-full justify-start gap-3 h-11 border-none ${
            isActive("/ats-checker")
              ? "bg-blue-50 text-blue-600 hover:bg-blue-100"
              : "text-gray-500 hover:text-black"
          }`}
          onClick={() => router.push("/ats-checker")}
        >
          <FileSearch className="size-4" />
          ATS Checker
        </Button>
      </div>

      <div className="mt-10">
        <h3 className="text-[10px] uppercase font-bold tracking-widest text-gray-400 px-4 mb-4 font-sans">
          Services
        </h3>
        <div className="space-y-1">
          <Button
            variant={isActive("/contact") ? "secondary" : "ghost"}
            className={`w-full justify-start gap-3 h-11 text-sm border-none ${
              isActive("/contact")
                ? "bg-blue-50 text-blue-600 hover:bg-blue-100"
                : "text-gray-500 hover:text-black"
            }`}
            onClick={() => router.push("/contact")}
          >
            <Phone className="size-4" />
            Contact Support
          </Button>
        </div>
      </div>

      <div className="mt-auto pt-6 border-t">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 h-11 text-gray-500 hover:text-red-600 hover:bg-red-50"
          onClick={handleSignOut}
        >
          <LogOut className="size-4" />
          Sign Out
        </Button>
      </div>
    </aside>
  )
}
