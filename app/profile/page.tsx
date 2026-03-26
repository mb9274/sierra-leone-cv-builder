"use client"
export const dynamic = "force-dynamic"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Eye, Edit, User, ExternalLink, Cloud } from "lucide-react"
import type { CVData } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"
import { normalizeCvRecord } from "@/lib/cv-storage"
import { saveLocalCv } from "@/lib/cv-collection"

export default function ProfilePage() {
  const router = useRouter()
  const { toast } = useToast()
  const [cvs, setCvs] = useState<CVData[]>([])
  const [userInfo, setUserInfo] = useState({ name: "", email: "" })
  const [avatarDataUrl, setAvatarDataUrl] = useState<string>("")
  const [loading, setLoading] = useState(true)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    const loadData = async () => {
      try {
        const sessionResponse = await fetch("/api/auth/session")
        if (!sessionResponse.ok) {
          router.push("/auth/sign-in?next=/profile")
          return
        }

        const session = await sessionResponse.json()
        if (!session.user) {
          router.push("/auth/sign-in?next=/profile")
          return
        }

        setUserInfo({
          name: session.user.name || "User",
          email: session.user.email || "",
        })

        const cvsResponse = await fetch("/api/cvs")
        if (cvsResponse.ok) {
          const payload = await cvsResponse.json()
          setCvs((payload.cvs || []).map((cv: any) => normalizeCvRecord(cv)))
        }
      } catch (error) {
        console.error("Profile load error:", error)
        router.push("/auth/sign-in?next=/profile")
      } finally {
        setLoading(false)
      }

      const savedAvatar = localStorage.getItem("profile_avatar")
      if (savedAvatar) {
        setAvatarDataUrl(savedAvatar)
      }
    }

    loadData()
  }, [])

  const handlePickAvatar = () => {
    fileInputRef.current?.click()
  }

  const handleAvatarSelected = (file: File | null) => {
    if (!file) return
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid File",
        description: "Please select an image file.",
        variant: "destructive",
      })
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      const result = typeof reader.result === "string" ? reader.result : ""
      if (!result) return
      try {
        localStorage.setItem("profile_avatar", result)
      } catch {}
      setAvatarDataUrl(result)
      toast({
        title: "Profile Photo Updated",
        description: "Your profile image has been saved.",
      })
    }
    reader.readAsDataURL(file)
  }

  const handleRemoveAvatar = () => {
    try {
      localStorage.removeItem("profile_avatar")
    } catch {}
    setAvatarDataUrl("")
    toast({
      title: "Profile Photo Removed",
      description: "Your profile image has been removed.",
    })
  }

  const handleViewOriginalFile = async (cv: CVData) => {
    try {
      const response = await fetch(`/api/cvs/${cv.id}/file-url`)
      if (!response.ok) {
        throw new Error("Original file link is not available")
      }

      const result = await response.json()
      if (result.url) {
        window.open(result.url, "_blank", "noopener,noreferrer")
      }
    } catch (error) {
      toast({
        title: "File not available",
        description: error instanceof Error ? error.message : "Could not open the original file.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {loading && (
          <div className="mb-6 rounded-lg border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
            Loading your profile...
          </div>
        )}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="size-16 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
                {avatarDataUrl ? (
                  <Image
                    src={avatarDataUrl}
                    alt="Profile"
                    width={64}
                    height={64}
                    className="size-full object-cover"
                    unoptimized
                  />
                ) : (
                  <User className="size-8 text-primary" />
                )}
              </div>
              <div>
                <CardTitle className="text-2xl">{userInfo.name || "User Profile"}</CardTitle>
                <CardDescription>{userInfo.email || "No email provided"}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2 mb-6">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleAvatarSelected(e.target.files?.[0] || null)}
              />
              <Button variant="outline" onClick={handlePickAvatar}>
                {avatarDataUrl ? "Change Photo" : "Upload Photo"}
              </Button>
              {avatarDataUrl && (
                <Button variant="outline" onClick={handleRemoveAvatar}>
                  Remove Photo
                </Button>
              )}
            </div>

            <div className="grid sm:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-muted rounded-lg">
                <p className="text-2xl font-bold text-foreground">{cvs.length}</p>
                <p className="text-sm text-muted-foreground">CVs Created</p>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <p className="text-2xl font-bold text-foreground">0</p>
                <p className="text-sm text-muted-foreground">Applications</p>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <p className="text-2xl font-bold text-foreground">Member</p>
                <p className="text-sm text-muted-foreground">Status</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Your CVs</CardTitle>
            <CardDescription>View and manage your saved CVs</CardDescription>
          </CardHeader>
          <CardContent>
            {cvs.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="size-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground mb-4">No CVs created yet</p>
                <Button onClick={() => router.push("/builder")}>Create Your First CV</Button>
              </div>
            ) : (
              <div className="space-y-4">
                {cvs.map((cv) => (
                  <div
                    key={cv.id}
                    className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="size-8 text-primary" />
                      <div>
                        <p className="font-semibold">{cv.personalInfo?.fullName || "Untitled CV"}</p>
                        <p className="text-sm text-muted-foreground">
                          Last edited: {new Date(cv.updatedAt).toLocaleDateString()}
                        </p>
                        {cv.storagePath && (
                          <div className="mt-2 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                            <Cloud className="size-3.5" />
                            Saved to Supabase Storage
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          saveLocalCv(cv)
                          router.push("/preview")
                        }}
                      >
                        <Eye className="size-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          saveLocalCv(cv)
                          router.push("/builder")
                        }}
                      >
                        <Edit className="size-4" />
                      </Button>
                      {cv.storagePath && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewOriginalFile(cv)}
                        >
                          <ExternalLink className="size-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
