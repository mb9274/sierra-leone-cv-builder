 "use client"

import { useMemo, useState } from "react"
import { PDFDocument, StandardFonts, rgb } from "pdf-lib"
import { CVForm } from "./components/CVForm"
import { CVPreview } from "./components/CVPreview"
import type { CVData, UploadState } from "./types"

const emptyCv: CVData = {
  fullName: "",
  email: "",
  phone: "",
  location: "Freetown, Sierra Leone",
  summary: "",
  skills: [],
  education: [],
  experience: [],
}

function validateCv(cv: CVData) {
  const nextErrors: Partial<Record<keyof CVData, string>> = {}
  if (!cv.fullName.trim()) nextErrors.fullName = "Full name is required"
  if (!cv.email.trim()) nextErrors.email = "Email is required"
  if (!cv.phone.trim()) nextErrors.phone = "Phone number is required"
  if (!cv.summary.trim()) nextErrors.summary = "Summary is required"
  if (cv.skills.length === 0) nextErrors.skills = "Add at least one skill"
  if (cv.education.length === 0) nextErrors.education = "Add at least one education line"
  if (cv.experience.length === 0) nextErrors.experience = "Add at least one experience line"
  return nextErrors
}

function wrapText(text: string, maxChars: number) {
  const words = text.trim().split(/\s+/).filter(Boolean)
  const lines: string[] = []
  let currentLine = ""

  for (const word of words) {
    const nextLine = currentLine ? `${currentLine} ${word}` : word
    if (nextLine.length <= maxChars) {
      currentLine = nextLine
    } else {
      if (currentLine) lines.push(currentLine)
      currentLine = word
    }
  }

  if (currentLine) {
    lines.push(currentLine)
  }

  return lines.length > 0 ? lines : [""]
}

async function createCvPdfBlob(cv: CVData) {
  const pdfDoc = await PDFDocument.create()
  let page = pdfDoc.addPage([595.28, 841.89])
  const titleFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold)
  const bodyFont = await pdfDoc.embedFont(StandardFonts.Helvetica)

  const margin = 48
  const pageWidth = page.getWidth()
  const pageHeight = page.getHeight()
  const width = pageWidth - margin * 2
  let y = pageHeight - margin

  const addPage = () => {
    page = pdfDoc.addPage([pageWidth, pageHeight])
    y = pageHeight - margin
  }

  const ensureSpace = (requiredHeight: number) => {
    if (y < margin + requiredHeight) {
      addPage()
    }
  }

  const drawLine = (text: string, font = bodyFont, size = 11, color = rgb(0.13, 0.18, 0.28)) => {
    const lines = wrapText(text, Math.max(24, Math.floor(width / (size * 0.55))))
    for (const line of lines) {
      ensureSpace(size + 10)
      page.drawText(line, { x: margin, y, size, font, color })
      y -= size + 6
    }
  }

  page.drawText(cv.fullName || "CV Resume", {
    x: margin,
    y,
    size: 24,
    font: titleFont,
    color: rgb(0.07, 0.09, 0.15),
  })
  y -= 30

  drawLine([cv.email, cv.phone, cv.location].filter(Boolean).join("  -  "), bodyFont, 10, rgb(0.38, 0.42, 0.5))
  y -= 8

  const sections: Array<{ title: string; items: string[] | string }> = [
    { title: "Summary", items: cv.summary },
    { title: "Skills", items: cv.skills },
    { title: "Education", items: cv.education },
    { title: "Experience", items: cv.experience },
  ]

  for (const section of sections) {
    ensureSpace(64)

    page.drawText(section.title.toUpperCase(), {
      x: margin,
      y,
      size: 12,
      font: titleFont,
      color: rgb(0.13, 0.18, 0.28),
    })
    y -= 18

    const items = Array.isArray(section.items) ? section.items : [section.items]
    const content = items.filter(Boolean)
    if (content.length === 0) {
      drawLine("Not provided", bodyFont, 10, rgb(0.45, 0.45, 0.45))
      y -= 6
      continue
    }

    if (typeof section.items === "string") {
      drawLine(section.items, bodyFont, 11)
    } else {
      for (const item of content) {
        drawLine(`- ${item}`, bodyFont, 11)
      }
    }

    y -= 6
  }

  const bytes = await pdfDoc.save()
  return new Blob([bytes], { type: "application/pdf" })
}

export default function App() {
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [cv, setCv] = useState<CVData>(emptyCv)
  const [previewCv, setPreviewCv] = useState<CVData | null>(null)
  const [errors, setErrors] = useState<Partial<Record<keyof CVData, string>>>({})
  const [uploadState, setUploadState] = useState<UploadState>({ status: "idle" })

  const canPreview = useMemo(() => Object.keys(validateCv(cv)).length === 0, [cv])

  const handleGenerate = () => {
    const nextErrors = validateCv(cv)
    setErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) {
      return
    }

    setPreviewCv(cv)
    setStep(2)
  }

  const handleUpload = async () => {
    if (!previewCv) return
    setUploadState({ status: "uploading", message: "Generating your PDF and saving it to your CV library..." })

    try {
      const fileName = `${previewCv.fullName || "cv"}-${Date.now()}.pdf`
      const blob = await createCvPdfBlob(previewCv)

      const formData = new FormData()
      formData.append("file", new File([blob], fileName, { type: "application/pdf" }))

      const response = await fetch("/api/cv/upload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const result = await response.json().catch(() => null)
        throw new Error(result?.error || result?.message || "Upload failed")
      }

      const result = await response.json().catch(() => null)
      const uploadedCv = result?.cv || null

      setUploadState({
        status: "success",
        message: "Your CV was saved to your library and the PDF was stored in Supabase Storage.",
        filePath: uploadedCv?.storagePath || fileName,
      })
      if (uploadedCv) {
        setPreviewCv(uploadedCv)
      }
      setStep(3)
    } catch (error) {
      setUploadState({
        status: "error",
        message: error instanceof Error ? error.message : "Upload failed",
      })
    }
  }

  const handleDownload = async () => {
    if (!previewCv) return

    const blob = await createCvPdfBlob(previewCv)
    const objectUrl = URL.createObjectURL(blob)
    const anchor = document.createElement("a")
    anchor.href = objectUrl
    anchor.download = `${previewCv.fullName || "cv"}.pdf`
    document.body.appendChild(anchor)
    anchor.click()
    anchor.remove()
    URL.revokeObjectURL(objectUrl)
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,#f8fafc_0,#e2e8f0_45%,#cbd5e1_100%)] px-4 py-6">
      <div className="mx-auto flex w-full max-w-md flex-col gap-5">
        <header className="rounded-[28px] bg-slate-950 px-5 py-6 text-white shadow-2xl shadow-slate-300">
          <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Mobile CV App</p>
          <h1 className="mt-2 text-3xl font-black leading-tight">Build, preview, and upload your CV on mobile</h1>
          <p className="mt-3 text-sm text-slate-300">
            Fill the form, generate a preview, then save the CV to your library and store the PDF.
          </p>
        </header>

        <div className="rounded-3xl bg-white/90 p-3 shadow-xl ring-1 ring-white/60 backdrop-blur">
          <div className="grid grid-cols-3 gap-2 text-center text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            <div className={step >= 1 ? "rounded-2xl bg-slate-900 py-2 text-white" : "rounded-2xl bg-slate-100 py-2"}>
              Form
            </div>
            <div className={step >= 2 ? "rounded-2xl bg-slate-900 py-2 text-white" : "rounded-2xl bg-slate-100 py-2"}>
              Preview
            </div>
            <div className={step >= 3 ? "rounded-2xl bg-slate-900 py-2 text-white" : "rounded-2xl bg-slate-100 py-2"}>
              Save
            </div>
          </div>
        </div>

        {step === 1 && (
          <div className="rounded-[28px] bg-white p-5 shadow-xl ring-1 ring-slate-100">
            <CVForm value={cv} onChange={setCv} onGenerate={handleGenerate} errors={errors} />
            {!canPreview && (
              <p className="mt-4 rounded-2xl bg-amber-50 px-4 py-3 text-sm text-amber-800">
                Please fill in the required fields before generating the preview.
              </p>
            )}
          </div>
        )}

        {step === 2 && previewCv && (
          <div className="rounded-[28px] bg-white p-5 shadow-xl ring-1 ring-slate-100">
              <CVPreview
                cv={previewCv}
                uploadState={uploadState}
                onBack={() => setStep(1)}
                onDownload={handleDownload}
                onUpload={handleUpload}
              />
            </div>
        )}

        {step === 3 && previewCv && (
          <div className="rounded-[28px] bg-white p-5 shadow-xl ring-1 ring-slate-100">
            <div className="space-y-4">
              <div className="rounded-[24px] bg-emerald-50 p-5 text-emerald-900">
                <p className="text-xs font-semibold uppercase tracking-[0.25em]">Save confirmed</p>
                <h2 className="mt-2 text-2xl font-bold">Your CV is now in your library</h2>
                <p className="mt-2 text-sm">
                  {uploadState.status === "success" ? uploadState.message : "Save finished."}
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setStep(1)
                  setUploadState({ status: "idle" })
                  setPreviewCv(null)
                }}
                className="w-full rounded-2xl bg-slate-900 px-4 py-3 text-base font-semibold text-white"
              >
                Start another CV
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
