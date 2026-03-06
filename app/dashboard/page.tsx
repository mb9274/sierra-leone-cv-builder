"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  FileText,
  Plus,
  Edit2,
  Trash2,
  Clock,
} from "lucide-react"
import type { CVData } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"

export default function DashboardPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [cvs, setCvs] = useState<CVData[]>([])
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    loadCVs()
  }, [])

  const loadCVs = () => {
    const savedCVs = localStorage.getItem("cvbuilder_cvs")
    if (savedCVs) {
      setCvs(JSON.parse(savedCVs))
    }
  }

  const handleEditCV = (cv: CVData) => {
    localStorage.setItem("cvbuilder_current", JSON.stringify(cv))
    router.push("/builder")
  }

  const handleDeleteCV = (cvId: string) => {
    if (confirm("Are you sure you want to delete this CV?")) {
      const updatedCVs = cvs.filter((cv) => cv.id !== cvId)
      setCvs(updatedCVs)
      localStorage.setItem("cvbuilder_cvs", JSON.stringify(updatedCVs))
      toast({ title: "CV Deleted" })
    }
  }

  const handleCreateNew = () => {
    localStorage.removeItem("cvbuilder_current")
    router.push("/builder")
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <main className="p-6 sm:p-10 max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Resumes</h1>
              <p className="text-gray-500 mt-1">Manage and edit your professional CVs</p>
            </div>
            <Button
              onClick={handleCreateNew}
              className="h-11 px-6 bg-[#4CAF50] hover:bg-[#45a049] active:bg-[#3f9143] text-white rounded-lg gap-2 shadow-lg shadow-green-200"
            >
              <Plus className="size-5" />
              Create New
            </Button>
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
