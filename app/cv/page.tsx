"use client"
export const dynamic = "force-dynamic"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Upload, FileText, ArrowLeft, Eye, Trash2, CheckCircle, AlertCircle, Loader2, ExternalLink, Cloud } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"
import type { CVData } from "@/lib/types"
import { normalizeCvRecord } from "@/lib/cv-storage"
import { saveLocalCv } from "@/lib/cv-collection"

type UploadProgress = {
  stage: string
  message: string
  currentPage?: number
  totalPages?: number
}

function parseSseEvent(chunk: string) {
  const lines = chunk
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)

  const eventLine = lines.find((line) => line.startsWith("event:"))
  const dataLine = lines.find((line) => line.startsWith("data:"))
  const event = eventLine ? eventLine.slice("event:".length).trim() : "message"

  if (!dataLine) return { event, data: null }

  try {
    return {
      event,
      data: JSON.parse(dataLine.slice("data:".length).trim()),
    }
  } catch {
    return { event, data: null }
  }
}

async function readUploadStream(
  response: Response,
  onProgress: (progress: UploadProgress) => void,
): Promise<any> {
  const reader = response.body?.getReader()
  if (!reader) {
    throw new Error("Upload stream is unavailable")
  }

  const decoder = new TextDecoder()
  let buffer = ""

  while (true) {
    const { done, value } = await reader.read()
    if (done) break

    buffer += decoder.decode(value, { stream: true })
    const events = buffer.split("\n\n")
    buffer = events.pop() || ""

    for (const rawEvent of events) {
      const { event, data } = parseSseEvent(rawEvent)
      if (event === "progress" && data) {
        onProgress(data)
      } else if (event === "done" && data) {
        return data
      } else if (event === "error") {
        throw new Error(data?.message || "Upload failed")
      }
    }
  }

  throw new Error("Upload stream ended unexpectedly")
}

export default function CVManagementPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [cvs, setCvs] = useState<CVData[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [uploadProgress, setUploadProgress] = useState<UploadProgress | null>(null)
  const [uploadSummary, setUploadSummary] = useState<{
    kind: "success" | "warning"
    title: string
    message: string
    confidence?: "high" | "partial" | "low"
  } | null>(null)

  useEffect(() => {
    loadCVs()
  }, [])

  const loadCVs = async () => {
    try {
      const sessionResponse = await fetch("/api/auth/session")
      if (!sessionResponse.ok) {
        router.push("/auth/sign-in")
        return
      }

      const session = await sessionResponse.json()
      if (!session.user) {
        router.push("/auth/sign-in")
        return
      }

      const cvsResponse = await fetch("/api/cvs")
      if (!cvsResponse.ok) {
        throw new Error("Failed to load CVs")
      }

      const payload = await cvsResponse.json()
      if (payload.cvs) {
        setCvs(payload.cvs.map((cv: any) => normalizeCvRecord(cv)))
      }
    } catch (error) {
      console.error("Failed to load CVs:", error)
      setError("Failed to load CVs")
    } finally {
      setLoading(false)
    }
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    console.log("File selected:", file.name, file.type, file.size)

    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "image/png",
      "image/jpeg",
      "image/jpg",
      "image/webp",
      "image/tiff",
    ]
    const maxSize = 5 * 1024 * 1024

    if (!allowedTypes.includes(file.type)) {
      setError(`Invalid file type: ${file.type}. Only PDF, DOC, and DOCX files are allowed`)
      return
    }

    if (file.size > maxSize) {
      setError(`File too large: ${Math.round(file.size / 1024 / 1024)}MB. Maximum size is 5MB`)
      return
    }

    setIsUploading(true)
    setError("")
    setUploadSummary(null)
    setUploadProgress({
      stage: "starting",
      message: "Preparing your CV upload...",
    })

    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/cv/upload?progress=1", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const result = await response.json().catch(() => null)
        throw new Error(result?.error || "Upload failed")
      }

      const contentType = response.headers.get("content-type") || ""
      const result = contentType.includes("text/event-stream")
        ? await readUploadStream(response, setUploadProgress)
        : await response.json()

      const debug = result.debug
      const looksImageOnly =
        (debug?.fallbackTextLength || 0) < 30 &&
        (debug?.sourceTextLength || 0) < 30 &&
        (debug?.coreFieldCount || 0) < 2 &&
        (debug?.sectionCount || 0) < 1

      if (looksImageOnly) {
        setUploadSummary({
          kind: "warning",
          title: "Manual editor needed",
          message: "The file looked scanned or image-only, so the app could not recover all CV details automatically.",
          confidence: "low",
        })
        toast({
          title: "Image-only or scanned file detected",
          description: "This file does not contain enough readable text, so we are opening the manual editor.",
        })
        handleManualFallback()
        return
      }

      const uploadMessage =
        result.storageStatus === "saved"
          ? "Full CV data saved, and the original file was stored in Supabase Storage."
          : "Full CV data saved, but the original file was not stored in Supabase Storage."
      const confidence =
        debug?.coreFieldCount >= 4 && debug?.sectionCount >= 3
          ? "high"
          : debug?.coreFieldCount >= 2 || debug?.sectionCount >= 1
            ? "partial"
            : "low"

      setUploadSummary({
        kind: "success",
        title: "Upload complete",
        message: uploadMessage,
        confidence,
      })

      sessionStorage.setItem("cvbuilder_current", JSON.stringify(result.cv))
      saveLocalCv(result.cv)
      toast({
        title: "CV uploaded successfully",
        description:
          result.storageStatus === "saved"
            ? "Saved original file to Supabase Storage and opening the editor."
            : "Storage upload skipped, CV still saved.",
      })
      router.push("/builder")
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to upload CV"
      setError(message)
      setUploadSummary({
        kind: "warning",
        title: "Upload failed",
        message: message,
      })
      toast({
        title: "Upload failed",
        description: message,
        variant: "destructive",
      })
      handleManualFallback()
    } finally {
      setIsUploading(false)
      setUploadProgress(null)
    }
  }

  const handleManualFallback = () => {
    sessionStorage.removeItem("cvbuilder_current")
    localStorage.removeItem("cvbuilder_current")
    toast({
      title: "Manual editor opened",
      description: "You can enter the CV details by hand in the editor.",
    })
    router.push("/builder")
  }

  const handleViewCV = (cv: CVData) => {
    sessionStorage.setItem("cvbuilder_current", JSON.stringify(cv))
    saveLocalCv(cv)
    router.push("/preview")
  }

  const handleEditInBuilder = (cv: CVData) => {
    sessionStorage.setItem("cvbuilder_current", JSON.stringify(cv))
    saveLocalCv(cv)
    router.push("/builder")
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

  const handleDeleteCV = async (cvId: string) => {
    if (!confirm("Are you sure you want to delete this CV?")) return

    try {
      const response = await fetch(`/api/cvs/${cvId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const result = await response.json().catch(() => null)
        throw new Error(result?.error || "Failed to delete CV")
      }

      await loadCVs()
      toast({ title: "CV Deleted Successfully" })
    } catch {
      setError("Failed to delete CV")
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Toaster />

      <header className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.push("/dashboard")}>
              <ArrowLeft className="size-5" />
            </Button>
            <h1 className="text-2xl font-bold">Upload CV</h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {error && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">{error}</AlertDescription>
          </Alert>
        )}

        <div className="max-w-4xl mx-auto space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="size-5" />
                Upload and Edit Your CV
              </CardTitle>
              <CardDescription>
                Upload your existing CV file and we will extract the text for editing. If the file is scanned or image-only, we will open the manual editor.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Alert className="border-amber-200 bg-amber-50">
                <AlertCircle className="h-4 w-4 text-amber-700" />
                <AlertDescription className="text-amber-900">
                  Normal text-based PDFs and DOCX files will be extracted automatically. Scanned or image-only files do not contain readable text, so we will open the manual editor instead.
                </AlertDescription>
              </Alert>

              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <div className="space-y-2">
                  <p className="text-lg font-medium">Upload your CV file</p>
                  <p className="text-sm text-gray-500">Supported formats: PDF, DOC, DOCX, PNG, JPG, WEBP, TIFF (Max 5MB)</p>
                </div>
                <Input
                  type="file"
                  accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.webp,.tif,.tiff"
                  onChange={handleFileUpload}
                  className="mt-4"
                  disabled={isUploading}
                />
              </div>

              {isUploading && (
                <div className="rounded-lg border bg-blue-50 p-4 text-center space-y-3">
                  <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-blue-900">
                      {uploadProgress?.message || "Uploading and processing your CV..."}
                    </p>
                    {typeof uploadProgress?.currentPage === "number" && typeof uploadProgress?.totalPages === "number" && (
                      <p className="text-xs text-blue-700">
                        Page {uploadProgress.currentPage} of {uploadProgress.totalPages}
                      </p>
                    )}
                  </div>
                  {typeof uploadProgress?.currentPage === "number" && typeof uploadProgress?.totalPages === "number" && (
                    <div className="h-2 w-full rounded-full bg-blue-100 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-blue-600 transition-all duration-300"
                        style={{
                          width: `${Math.max(
                            5,
                            Math.min(
                              100,
                              Math.round((uploadProgress.currentPage / uploadProgress.totalPages) * 100),
                            ),
                          )}%`,
                        }}
                      />
                    </div>
                  )}
                </div>
              )}

              {uploadSummary && !isUploading && (
                <Alert className={uploadSummary.kind === "success" ? "border-emerald-200 bg-emerald-50" : "border-amber-200 bg-amber-50"}>
                  <AlertCircle className={`h-4 w-4 ${uploadSummary.kind === "success" ? "text-emerald-700" : "text-amber-700"}`} />
                  <AlertDescription className={uploadSummary.kind === "success" ? "text-emerald-900" : "text-amber-900"}>
                    <div className="space-y-1">
                      <p className="font-semibold">{uploadSummary.title}</p>
                      <p className="text-sm">{uploadSummary.message}</p>
                      {uploadSummary.confidence && (
                        <p className="text-xs font-medium uppercase tracking-wide opacity-80">
                          Extraction confidence:{" "}
                          {uploadSummary.confidence === "high"
                            ? "High confidence"
                            : uploadSummary.confidence === "partial"
                              ? "Partial extraction"
                              : "Low confidence"}
                        </p>
                      )}
                    </div>
                  </AlertDescription>
                </Alert>
              )}

              <div className="flex flex-wrap gap-3 justify-center">
                <Button variant="outline" onClick={handleManualFallback}>
                  Open manual editor
                </Button>
              </div>
            </CardContent>
          </Card>

          {cvs.length > 0 && (
            <div className="mt-12 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold">Your Existing CVs ({cvs.length})</h2>
              </div>

              <div className="grid gap-4">
                {cvs.map((cv) => (
                  <Card key={cv.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold">{cv.personalInfo?.fullName || "Untitled CV"}</h3>
                            {cv.verifiedAt && (
                              <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                                <CheckCircle className="mr-1 h-3 w-3 inline" />
                                Verified
                              </div>
                            )}
                          </div>
                          <p className="text-gray-600 mb-2">{cv.personalInfo?.email || "No email provided"}</p>
                          {cv.personalInfo?.phone && <p className="text-gray-600 mb-2">{cv.personalInfo.phone}</p>}
                          {cv.personalInfo?.summary && (
                            <p className="text-sm text-gray-500 line-clamp-2 mb-3">{cv.personalInfo.summary}</p>
                          )}
                          {cv.storagePath && (
                            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                              <Cloud className="size-3.5" />
                              Saved to Supabase Storage
                            </div>
                          )}
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span>Created: {new Date(cv.createdAt).toLocaleDateString()}</span>
                            <span>Updated: {new Date(cv.updatedAt).toLocaleDateString()}</span>
                          </div>
                          {cv.skills?.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-3">
                              {cv.skills.slice(0, 5).map((skill, index) => (
                                <div key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                                  {skill}
                                </div>
                              ))}
                              {cv.skills.length > 5 && (
                                <div className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                                  +{cv.skills.length - 5} more
                                </div>
                              )}
                            </div>
                          )}
                        </div>

                        <div className="flex gap-2 ml-4">
                          <Button variant="outline" size="sm" onClick={() => handleViewCV(cv)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleEditInBuilder(cv)}>
                            <FileText className="h-4 w-4" />
                          </Button>
                          {cv.storagePath && (
                            <Button variant="outline" size="sm" onClick={() => handleViewOriginalFile(cv)}>
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                          )}
                          <Button variant="outline" size="sm" onClick={() => handleDeleteCV(cv.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
