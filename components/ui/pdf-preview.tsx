"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Download, Eye, AlertCircle, FileText } from "lucide-react"
import { getCvLocation } from "@/lib/cv-location"

interface PDFPreviewProps {
  file: File
  onExtracted?: (data: any) => void
  onError?: (error: string) => void
  onManualFallback?: () => void
}

export function PDFPreview({ file, onExtracted, onError, onManualFallback }: PDFPreviewProps) {
  const [loading, setLoading] = useState(false)
  const [extractedData, setExtractedData] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)

  useEffect(() => {
    // Create object URL for file preview
    if (file) {
      const url = URL.createObjectURL(file)
      setPdfUrl(url)
      
      return () => {
        URL.revokeObjectURL(url)
      }
    }
  }, [file])

  const handleExtractText = async () => {
    setLoading(true)
    setError(null)

    try {
      console.log("Starting text extraction for:", file.name)
      
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/cv/upload", {
        method: "POST",
        body: formData
      })

      const result = await response.json()
      console.log("API response:", result)

      if (!response.ok) {
        const details = result.details || result.debug ? JSON.stringify(result.debug, null, 2) : ""
        throw new Error([result.error || "Extraction failed", details].filter(Boolean).join("\n"))
      }

      const debug = result.debug
      const looksScanned =
        (debug?.fallbackTextLength || 0) < 30 &&
        (debug?.sourceTextLength || 0) < 30 &&
        (debug?.coreFieldCount || 0) < 2 &&
        (debug?.sectionCount || 0) < 1

      if (looksScanned) {
        setError(
          "This PDF looks scanned or image-based, so automatic extraction cannot recover the full CV. Opening the manual editor instead.",
        )
        onError?.(
          "This PDF looks scanned or image-based, so automatic extraction cannot recover the full CV. Opening the manual editor instead.",
        )
        onManualFallback?.()
        return
      }

      setExtractedData({ ...result.cv, debug })
      onExtracted?.(result.cv)
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to extract text from PDF"
      console.error("Extraction error:", errorMessage)
      setError(errorMessage)
      onError?.(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = () => {
    if (pdfUrl) {
      const a = document.createElement('a')
      a.href = pdfUrl
      a.download = file.name
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
    }
  }

  if (
    file.type !== "application/pdf" &&
    !file.type.includes("word") &&
    !file.type.startsWith("image/")
  ) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          This preview component supports PDF, Word, and image files. Selected file: {file.name} ({file.type})
        </AlertDescription>
      </Alert>
    )
  }

  const isPDF = file.type === 'application/pdf'
  const fileDisplayName = file.name

  return (
    <div className="space-y-4">
      {/* PDF Preview Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="size-5" />
            {isPDF ? 'PDF' : 'Document'} Preview: {fileDisplayName}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Embedded File Viewer */}
          <div className="border rounded-lg overflow-hidden" style={{ height: "500px" }}>
            {pdfUrl ? (
              isPDF ? (
                <iframe
                  src={`${pdfUrl}#view=FitH`}
                  className="w-full h-full"
                  title="PDF Preview"
                  onError={() => setError("Failed to load PDF preview")}
                />
              ) : (
                <div className="flex items-center justify-center h-full bg-gray-50 p-8">
                  <div className="text-center">
                    <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">{fileDisplayName}</h3>
                    <p className="text-gray-600 mb-4">Word document preview not available</p>
                    <p className="text-sm text-gray-500">Click "Extract Text for Editing" to process this document</p>
                  </div>
                </div>
              )
            ) : (
              <div className="flex items-center justify-center h-full bg-gray-50">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            )}
          </div>
          
          {/* Action Buttons */}
          <div className="flex gap-2 mt-4">
            <Button
              variant="outline"
              onClick={handleDownload}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Download Original
            </Button>
            
            <Button
              onClick={handleExtractText}
              disabled={loading}
              className="flex items-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Extracting...
                </>
              ) : (
                <>
                  <Eye className="h-4 w-4" />
                  Extract Text for Editing
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Error Display */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Extracted Data Preview */}
      {extractedData && (
        <Card>
          <CardHeader>
            <CardTitle>Extracted Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {extractedData.debug && (
                <Alert className="border-slate-200 bg-slate-50">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="whitespace-pre-wrap text-xs">
                    {JSON.stringify(extractedData.debug, null, 2)}
                  </AlertDescription>
                </Alert>
              )}

              {extractedData.debug && (
                <Alert className="border-amber-200 bg-amber-50">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="space-y-3">
                    <p className="text-sm text-amber-900">
                      This file looks partially extractable. If it is scanned or image-based, the upload can miss sections.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <Button variant="outline" size="sm" onClick={onManualFallback}>
                        Open manual editor
                      </Button>
                    </div>
                  </AlertDescription>
                </Alert>
              )}

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                <h4 className="font-semibold">Personal Information</h4>
                <p><strong>Name:</strong> {extractedData.personalInfo?.fullName || "Not provided"}</p>
                <p><strong>Email:</strong> {extractedData.personalInfo?.email || "Not provided"}</p>
                <p><strong>Phone:</strong> {extractedData.personalInfo?.phone || "Not provided"}</p>
                {getCvLocation(extractedData.personalInfo) && <p><strong>Location:</strong> {getCvLocation(extractedData.personalInfo)}</p>}
                {extractedData.personalInfo?.summary && (
                  <p><strong>Summary:</strong> {extractedData.personalInfo.summary}</p>
                )}
              </div>
                <div>
                  <h4 className="font-semibold">Source Text</h4>
                  <p className="text-sm text-gray-600">Captured full document text for fallback editing.</p>
                  <p className="text-xs text-gray-500">{extractedData.sourceText ? `${extractedData.sourceText.length} characters` : "No raw text captured"}</p>
                </div>
              </div>

              {extractedData.education?.length > 0 && (
                <div>
                  <h4 className="font-semibold">Education</h4>
                  {extractedData.education.map((edu: any, i: number) => (
                    <div key={i} className="ml-4 mb-2">
                      <p><strong>{edu.degree}</strong></p>
                      <p className="text-sm text-gray-600">{edu.institution}</p>
                    </div>
                  ))}
                </div>
              )}

              {extractedData.experience?.length > 0 && (
                <div>
                  <h4 className="font-semibold">Experience</h4>
                  {extractedData.experience.map((exp: any, i: number) => (
                    <div key={i} className="ml-4 mb-2">
                      <p><strong>{exp.position}</strong> at {exp.company}</p>
                      {exp.description && <p className="text-sm text-gray-600 whitespace-pre-line">{exp.description}</p>}
                    </div>
                  ))}
                </div>
              )}

              {extractedData.projects?.length > 0 && (
                <div>
                  <h4 className="font-semibold">Projects</h4>
                  {extractedData.projects.map((project: any, i: number) => (
                    <div key={i} className="ml-4 mb-2">
                      <p><strong>{project.name}</strong></p>
                      <p className="text-sm text-gray-600">{project.description}</p>
                    </div>
                  ))}
                </div>
              )}

              {extractedData.certifications?.length > 0 && (
                <div>
                  <h4 className="font-semibold">Certifications</h4>
                  {extractedData.certifications.map((cert: any, i: number) => (
                    <div key={i} className="ml-4 mb-2">
                      <p><strong>{cert.name}</strong></p>
                    </div>
                  ))}
                </div>
              )}

              {extractedData.languages?.length > 0 && (
                <div>
                  <h4 className="font-semibold">Languages</h4>
                  <div className="flex flex-wrap gap-2">
                    {extractedData.languages.map((lang: any, i: number) => (
                      <span key={i} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                        {lang.language} {lang.proficiency ? `(${lang.proficiency})` : ""}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {extractedData.skills?.length > 0 && (
                <div>
                  <h4 className="font-semibold">Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {extractedData.skills.map((skill: string, i: number) => (
                      <span key={i} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {extractedData.projects?.length > 0 && (
                <div>
                  <h4 className="font-semibold">Projects</h4>
                  {extractedData.projects.map((project: any, i: number) => (
                    <div key={i} className="ml-4 mb-2">
                      <p><strong>{project.name}</strong></p>
                      <p className="text-sm text-gray-600 whitespace-pre-line">{project.description}</p>
                    </div>
                  ))}
                </div>
              )}

              {extractedData.volunteering?.length > 0 && (
                <div>
                  <h4 className="font-semibold">Volunteering</h4>
                  {extractedData.volunteering.map((item: any, i: number) => (
                    <div key={i} className="ml-4 mb-2">
                      <p><strong>{item.organization}</strong></p>
                      <p className="text-sm text-gray-600">{item.description}</p>
                    </div>
                  ))}
                </div>
              )}

              {extractedData.awards?.length > 0 && (
                <div>
                  <h4 className="font-semibold">Awards</h4>
                  {extractedData.awards.map((award: any, i: number) => (
                    <div key={i} className="ml-4 mb-2">
                      <p><strong>{award.name}</strong></p>
                      <p className="text-sm text-gray-600">{award.organization} {award.year ? `(${award.year})` : ""}</p>
                    </div>
                  ))}
                </div>
              )}

              {extractedData.hobbies?.length > 0 && (
                <div>
                  <h4 className="font-semibold">Hobbies</h4>
                  <p className="text-sm text-gray-600">{extractedData.hobbies.join(", ")}</p>
                </div>
              )}

              {extractedData.referees?.length > 0 && (
                <div>
                  <h4 className="font-semibold">Referees</h4>
                  {extractedData.referees.map((ref: any, i: number) => (
                    <div key={i} className="ml-4 mb-2">
                      <p><strong>{ref.name || "Reference"}</strong></p>
                      <p className="text-sm text-gray-600">{ref.title} {ref.organization ? `• ${ref.organization}` : ""}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
