import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { extractCvData, type ExtractedCv } from "@/lib/cv-extractor"

export const runtime = "nodejs"

const STORAGE_BUCKET = "cv-uploads"

const ALLOWED_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/webp",
  "image/tiff",
]

const MAX_SIZE = 5 * 1024 * 1024

type UploadDebug = {
  fileName: string
  fileType: string
  extractionMethod: "merged-text"
  parserSources: string[]
  ocrUsed: boolean
  ocrPagesProcessed: number
  fallbackTextLength: number
  sourceTextLength: number
  coreFieldCount: number
  sectionCount: number
  notes: string[]
}

type UploadProgressEvent = {
  stage: "starting" | "analyzing" | "ocr" | "saving" | "done"
  message: string
  currentPage?: number
  totalPages?: number
}

type UploadResult = {
  success: true
  message: string
  debug: UploadDebug
  cv: ExtractedCv & {
    id: string
    createdAt: Date
    updatedAt: Date
    storageBucket?: string
    storagePath?: string
    originalFileName?: string
    mimeType?: string
  }
  storageStatus: "saved" | "skipped"
}

function withIds<T extends Record<string, any>>(items: T[] | undefined, prefix: string): T[] | undefined {
  if (!items?.length) return items
  return items.map((item, index) => ({
    id: item.id || `${prefix}-${index + 1}`,
    ...item,
  }))
}

function normalizeExtractedCv(cv: Partial<ExtractedCv>, fallback: ExtractedCv, sourceText: string): ExtractedCv {
  const location =
    cv.personalInfo?.location ||
    [cv.personalInfo?.addressCity, cv.personalInfo?.addressCountry].filter(Boolean).join(", ") ||
    fallback.personalInfo.location ||
    [fallback.personalInfo.addressCity, fallback.personalInfo.addressCountry].filter(Boolean).join(", ")

  return {
    ...fallback,
    ...cv,
    personalInfo: {
      ...fallback.personalInfo,
      ...(cv.personalInfo || {}),
      fullName: cv.personalInfo?.fullName || fallback.personalInfo.fullName,
      email: cv.personalInfo?.email || fallback.personalInfo.email,
      phone: cv.personalInfo?.phone || fallback.personalInfo.phone,
      location,
      summary: cv.personalInfo?.summary || fallback.personalInfo.summary,
      linkedin: cv.personalInfo?.linkedin || fallback.personalInfo.linkedin,
      portfolio: cv.personalInfo?.portfolio || fallback.personalInfo.portfolio,
      profilePhoto: cv.personalInfo?.profilePhoto || fallback.personalInfo.profilePhoto,
      age: cv.personalInfo?.age || fallback.personalInfo.age,
    },
    education: withIds(cv.education, "edu") || fallback.education,
    experience: withIds(cv.experience, "exp") || fallback.experience,
    skills: cv.skills?.length ? cv.skills : fallback.skills,
    languages: cv.languages?.length ? cv.languages : fallback.languages,
    projects: withIds(cv.projects, "proj") || fallback.projects,
    certifications: withIds(cv.certifications, "cert") || fallback.certifications,
    volunteering: withIds(cv.volunteering, "vol") || fallback.volunteering,
    awards: withIds(cv.awards, "award") || fallback.awards,
    hobbies: cv.hobbies?.length ? cv.hobbies : fallback.hobbies,
    referees: withIds(cv.referees, "ref") || fallback.referees,
    technicalWriting: withIds(cv.technicalWriting, "tw") || fallback.technicalWriting,
    links: withIds(cv.links, "link") || fallback.links,
    templateId: cv.templateId || fallback.templateId || "sierra-leone-professional",
    sourceText: sourceText || cv.sourceText || fallback.sourceText || "",
  }
}

function normalizeTextBlock(text: string) {
  return String(text || "")
    .replace(/\r/g, "\n")
    .replace(/\u00a0/g, " ")
    .replace(/[ \t]+/g, " ")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .join("\n")
}

function mergeTextSources(...sources: Array<string | undefined | null>) {
  const lines = new Set<string>()
  const merged: string[] = []

  for (const source of sources) {
    const normalized = normalizeTextBlock(source || "")
    if (!normalized) continue

    for (const line of normalized.split("\n")) {
      const cleaned = line.trim()
      if (!cleaned || lines.has(cleaned)) continue
      lines.add(cleaned)
      merged.push(cleaned)
    }
  }

  return merged.join("\n")
}

async function extractPdfTextWithPdfParse(file: File) {
  try {
    const { PDFParse } = await import("pdf-parse")
    const buffer = Buffer.from(await file.arrayBuffer())
    const parser = new PDFParse({ data: buffer })
    const parsed = await parser.getText()
    await parser.destroy()
    return parsed.text || ""
  } catch (error) {
    console.error("PDF extraction failed:", error)
    return ""
  }
}

async function ocrImageBuffer(buffer: Buffer) {
  try {
    const tesseractModule = await import("tesseract.js")
    const createWorker = tesseractModule.createWorker ?? tesseractModule.default?.createWorker
    const recognize = tesseractModule.recognize ?? tesseractModule.default?.recognize
    const sparseTextMode = (tesseractModule as any).PSM?.SPARSE_TEXT || "11"

    if (createWorker) {
      const worker = await createWorker("eng")
      try {
        const runs = [
          { psm: sparseTextMode, threshold: false, label: "sparse" },
          { psm: "6", threshold: false, label: "block" },
          { psm: "3", threshold: false, label: "auto" },
        ]

        const texts: string[] = []

        for (const run of runs) {
          await worker.setParameters({
            tessedit_pageseg_mode: run.psm,
            preserve_interword_spaces: "1",
            user_defined_dpi: "300",
          })

          const output = await worker.recognize(buffer)
          const runText = output.data?.text || ""
          if (runText.trim()) texts.push(runText)
        }

        return mergeTextSources(...texts)
      } finally {
        await worker.terminate()
      }
    }

    if (!recognize) return ""

    const result = await recognize(buffer, "eng")
    return result.data?.text || ""
  } catch (error) {
    console.error("OCR image recognition failed:", error)
    return ""
  }
}

async function ocrPdfPages(file: File, emit?: (event: UploadProgressEvent) => void) {
  try {
    const sharpModule = await import("sharp")
    const sharp = sharpModule.default || sharpModule
    const buffer = Buffer.from(await file.arrayBuffer())
    const meta = await sharp(buffer, { density: 320 }).metadata()
    const pageCount = Math.max(1, meta.pages || 1)
    const pageTexts: string[] = []
    emit?.({
      stage: "ocr",
      message: `Starting OCR across ${pageCount} page(s)...`,
      currentPage: 0,
      totalPages: pageCount,
    })

    for (let pageIndex = 0; pageIndex < pageCount; pageIndex += 1) {
      try {
        emit?.({
          stage: "ocr",
          message: `OCR processing page ${pageIndex + 1} of ${pageCount}...`,
          currentPage: pageIndex + 1,
          totalPages: pageCount,
        })

        const pageVariants = await Promise.all([
          sharp(buffer, { density: 320, page: pageIndex })
            .grayscale()
            .normalize()
            .sharpen({ sigma: 1.2 })
            .png()
            .toBuffer(),
          sharp(buffer, { density: 420, page: pageIndex })
            .grayscale()
            .normalize()
            .png()
            .toBuffer(),
          sharp(buffer, { density: 360, page: pageIndex })
            .grayscale()
            .normalize()
            .sharpen({ sigma: 2 })
            .threshold(185)
            .png()
            .toBuffer(),
        ])

        const pageText = mergeTextSources(
          ...(await Promise.all(pageVariants.map((variant) => ocrImageBuffer(variant)))),
        )
        if (pageText.trim()) pageTexts.push(pageText)
      } catch (pageError) {
        console.error(`OCR failed for PDF page ${pageIndex + 1}:`, pageError)
      }
    }

    return {
      text: mergeTextSources(...pageTexts),
      pagesProcessed: pageCount,
    }
  } catch (error) {
    console.error("PDF OCR failed:", error)
    return { text: "", pagesProcessed: 0 }
  }
}

async function ocrImageFile(file: File) {
  try {
    const sharpModule = await import("sharp")
    const sharp = sharpModule.default || sharpModule
    const buffer = Buffer.from(await file.arrayBuffer())
    const variants = await Promise.all([
      sharp(buffer)
        .resize({ width: 2200, withoutEnlargement: false })
        .grayscale()
        .normalize()
        .sharpen({ sigma: 1.2 })
        .png()
        .toBuffer(),
      sharp(buffer)
        .resize({ width: 2600, withoutEnlargement: false })
        .grayscale()
        .normalize()
        .png()
        .toBuffer(),
      sharp(buffer)
        .resize({ width: 2400, withoutEnlargement: false })
        .grayscale()
        .normalize()
        .sharpen({ sigma: 2 })
        .threshold(182)
        .png()
        .toBuffer(),
    ])
    const text = mergeTextSources(...(await Promise.all(variants.map((variant) => ocrImageBuffer(variant)))))
    return { text, pagesProcessed: 1 }
  } catch (error) {
    console.error("Image OCR failed:", error)
    return { text: "", pagesProcessed: 0 }
  }
}

async function extractPdfTextWithPdf2Json(file: File) {
  try {
    const pdf2jsonModule = await import("pdf2json")
    const PDFParser = (pdf2jsonModule as any).default || (pdf2jsonModule as any).PDFParser || pdf2jsonModule
    const buffer = Buffer.from(await file.arrayBuffer())

    return await new Promise<string>((resolve) => {
      const parser = new PDFParser(null, true)

      const cleanup = () => {
        try {
          parser.destroy?.()
        } catch {
          // Ignore cleanup errors.
        }
      }

      parser.on("pdfParser_dataError", () => {
        cleanup()
        resolve("")
      })

      parser.on("pdfParser_dataReady", (data: any) => {
        try {
          const pages = Array.isArray(data?.Pages) ? data.Pages : []
          const pageText = pages
            .map((page: any) => {
              const texts = Array.isArray(page?.Texts) ? [...page.Texts] : []
              texts.sort((a: any, b: any) => (a?.y || 0) - (b?.y || 0) || (a?.x || 0) - (b?.x || 0))

              return texts
                .map((text: any) =>
                  Array.isArray(text?.R)
                    ? text.R
                        .map((run: any) => {
                          const value = typeof run?.T === "string" ? decodeURIComponent(run.T) : ""
                          return value.replace(/\s+/g, " ").trim()
                        })
                        .filter(Boolean)
                        .join(" ")
                    : "",
                )
                .filter(Boolean)
                .join("\n")
            })
            .filter(Boolean)
            .join("\n\n")

          cleanup()
          resolve(pageText)
        } catch (error) {
          console.error("PDF2JSON text extraction failed:", error)
          cleanup()
          resolve("")
        }
      })

      parser.parseBuffer(buffer)
    })
  } catch (error) {
    console.error("PDF2JSON unavailable or failed:", error)
    return ""
  }
}

async function extractPdfText(file: File, emit?: (event: UploadProgressEvent) => void) {
  const primary = await extractPdfTextWithPdfParse(file)
  const secondary = await extractPdfTextWithPdf2Json(file)
  emit?.({
    stage: "analyzing",
    message: "Reading the PDF text and running OCR across every page...",
  })

  const ocr = await ocrPdfPages(file, emit)
  const merged = mergeTextSources(primary, secondary, ocr.text)
  return {
    text: merged,
    sources: ocr.text ? ["pdf-parse", "pdf2json", "ocr"] : ["pdf-parse", "pdf2json"],
    ocrUsed: Boolean(ocr.text.trim()),
    ocrPagesProcessed: ocr.pagesProcessed,
  }
}

function stripHtmlToText(html: string) {
  return normalizeTextBlock(
    String(html || "")
      .replace(/<\/(p|div|li|tr|h[1-6])>/gi, "\n")
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<[^>]+>/g, " ")
      .replace(/&nbsp;/gi, " ")
      .replace(/&amp;/gi, "&")
      .replace(/&lt;/gi, "<")
      .replace(/&gt;/gi, ">")
      .replace(/&quot;/gi, '"')
      .replace(/&#39;/gi, "'"),
  )
}

async function extractFileText(file: File, emit?: (event: UploadProgressEvent) => void) {
  if (file.type === "application/pdf") {
    const pdfText = await extractPdfText(file, emit)
    return {
      text: pdfText.text,
      sources: pdfText.sources,
      ocrUsed: pdfText.ocrUsed,
      ocrPagesProcessed: pdfText.ocrPagesProcessed,
    }
  }

  if (file.type.includes("wordprocessingml.document")) {
    try {
      const mammothModule = await import("mammoth")
      const mammoth = mammothModule as any
      const extractor = mammoth.extractRawText ?? mammoth.default?.extractRawText
      const convertToHtml = mammoth.convertToHtml ?? mammoth.default?.convertToHtml
      if (!extractor && !convertToHtml) return { text: "", sources: ["mammoth"], ocrUsed: false, ocrPagesProcessed: 0 }

      const buffer = Buffer.from(await file.arrayBuffer())
      const textResults: string[] = []

      if (extractor) {
        const result = await extractor({ buffer })
        if (result.value) textResults.push(result.value)
      }

      if (convertToHtml) {
        const htmlResult = await convertToHtml({ buffer }, { includeDefaultStyleMap: true, ignoreEmptyParagraphs: false })
        if (htmlResult.value) textResults.push(stripHtmlToText(htmlResult.value))
      }

      return {
        text: mergeTextSources(...textResults),
        sources: ["mammoth-raw-text", "mammoth-html"],
        ocrUsed: false,
        ocrPagesProcessed: 0,
      }
    } catch (error) {
      console.error("DOCX extraction failed:", error)
      return { text: "", sources: ["mammoth"], ocrUsed: false, ocrPagesProcessed: 0 }
    }
  }

  if (file.type === "application/msword") {
    try {
      return { text: await file.text(), sources: ["word-binary-text"], ocrUsed: false, ocrPagesProcessed: 0 }
    } catch (error) {
      console.error("DOC extraction failed:", error)
      return { text: "", sources: ["word-binary-text"], ocrUsed: false, ocrPagesProcessed: 0 }
    }
  }

  if (file.type.startsWith("image/")) {
    emit?.({
      stage: "ocr",
      message: "OCR processing the uploaded image...",
      currentPage: 1,
      totalPages: 1,
    })
    const ocr = await ocrImageFile(file)
    return {
      text: ocr.text,
      sources: ocr.text ? ["ocr"] : [],
      ocrUsed: Boolean(ocr.text.trim()),
      ocrPagesProcessed: ocr.pagesProcessed,
    }
  }

  return { text: "", sources: [], ocrUsed: false, ocrPagesProcessed: 0 }
}

function getExtractionQuality(cv: ExtractedCv) {
  const coreFieldCount = [
    cv.personalInfo.fullName,
    cv.personalInfo.email,
    cv.personalInfo.phone,
    cv.personalInfo.location,
    cv.personalInfo.summary,
  ].filter((value) => String(value || "").trim()).length

  const sectionCount = [
    cv.education.length,
    cv.experience.length,
    cv.skills.length,
    cv.languages.length,
    cv.projects?.length || 0,
    cv.certifications?.length || 0,
    cv.volunteering?.length || 0,
    cv.awards?.length || 0,
    cv.hobbies?.length || 0,
    cv.referees?.length || 0,
  ].filter((count) => count > 0).length

  return { coreFieldCount, sectionCount }
}

function makeLegacyInsert(cv: ExtractedCv, userId: string) {
  return {
    user_id: userId,
    full_name: cv.personalInfo.fullName,
    email: cv.personalInfo.email,
    phone: cv.personalInfo.phone,
    age: cv.personalInfo.age ? Number.parseInt(cv.personalInfo.age, 10) : 25,
    summary: cv.personalInfo.summary || "",
    education: cv.education || [],
    experience: cv.experience || [],
    skills: cv.skills || [],
    languages: cv.languages || [],
    photo_url: cv.personalInfo.profilePhoto || "",
    template: cv.templateId || "sierra-leone-professional",
  }
}

async function uploadOriginalFile(
  file: File,
  userId: string,
  supabase: Awaited<ReturnType<typeof createAdminClient>>,
) {
  const storagePath = `${userId}/${Date.now()}-${file.name.replace(/[^\w.\-]+/g, "_")}`
  const fileBuffer = Buffer.from(await file.arrayBuffer())

  const { error } = await supabase.storage.from(STORAGE_BUCKET).upload(storagePath, fileBuffer, {
    contentType: file.type,
    upsert: false,
  })

  if (error) {
    throw new Error(`Storage upload failed: ${error.message}`)
  }

  return {
    storageBucket: STORAGE_BUCKET,
    storagePath,
    originalFileName: file.name,
    mimeType: file.type,
  }
}

async function processUpload(
  file: File,
  user: { id: string; email?: string | null },
  emit?: (event: UploadProgressEvent) => void,
): Promise<UploadResult> {
  emit?.({ stage: "starting", message: `Preparing ${file.name} for upload...` })

  const supabase = await createAdminClient()
  let storageMeta:
    | {
        storageBucket: string
        storagePath: string
        originalFileName: string
        mimeType: string
      }
    | null = null
  let storageErrorMessage = ""

  try {
    storageMeta = await uploadOriginalFile(file, user.id, supabase)
  } catch (error) {
    storageErrorMessage = error instanceof Error ? error.message : "Storage upload failed"
    console.warn("Original file storage upload failed:", storageErrorMessage)
  }

  const textResult = await extractFileText(file, emit)
  const fallbackText = textResult.text
  const extractedCV = extractCvData(fallbackText, user.email || "", file.name)
  const quality = getExtractionQuality(extractedCV)
  const debug: UploadDebug = {
    fileName: file.name,
    fileType: file.type,
    extractionMethod: "merged-text",
    parserSources: textResult.sources,
    ocrUsed: textResult.ocrUsed,
    ocrPagesProcessed: textResult.ocrPagesProcessed,
    fallbackTextLength: fallbackText.length,
    sourceTextLength: extractedCV.sourceText?.length || 0,
    coreFieldCount: quality.coreFieldCount,
    sectionCount: quality.sectionCount,
    notes: [],
  }

  if (storageErrorMessage) {
    debug.notes.push(`Original file was not saved to Supabase Storage: ${storageErrorMessage}`)
  }

  if (!fallbackText.trim()) {
    debug.notes.push("No extractable text was found in this file.")
    debug.notes.push("If the PDF is scanned or image-based, upload text-based CV content or convert it to searchable text first.")
  } else if (fallbackText.length < 200) {
    debug.notes.push("The extracted text is short. The source file may be image-heavy, a table layout, or partially unreadable.")
  }

  if (debug.ocrUsed) {
    debug.notes.push(`OCR was applied to ${debug.ocrPagesProcessed} PDF page(s) or image file(s).`)
  }

  emit?.({ stage: "saving", message: "Saving the extracted CV..." })

  const primary = await supabase
    .from("cvs")
    .insert({
      user_id: user.id,
      data: {
        ...extractedCV,
        ...(storageMeta || {}),
      },
    })
    .select("id, data, created_at, updated_at")
    .single()

  if (!primary.error) {
    const cv = {
      ...normalizeExtractedCv(
        {
          ...extractedCV,
          ...(storageMeta || {}),
        },
        extractedCV,
        extractedCV.sourceText || fallbackText,
      ),
      id: primary.data.id,
      createdAt: new Date(primary.data.created_at),
      updatedAt: new Date(primary.data.updated_at),
      ...(storageMeta || {}),
    }

    emit?.({ stage: "done", message: "CV uploaded successfully" })
    return {
      success: true,
      message: "CV uploaded successfully",
      debug,
      cv,
      storageStatus: storageMeta?.storagePath ? "saved" : "skipped",
    }
  }

  const primaryMessage = String(primary.error.message || "").toLowerCase()
  const needsLegacyFallback =
    (primaryMessage.includes("column") && primaryMessage.includes("data")) ||
    primaryMessage.includes("null value in column \"age\"") ||
    primaryMessage.includes("age")

  if (needsLegacyFallback) {
    const legacy = await supabase
      .from("cvs")
      .insert(makeLegacyInsert(extractedCV, user.id))
      .select("id, full_name, email, phone, age, summary, education, experience, skills, languages, photo_url, template, created_at, updated_at")
      .single()

    if (!legacy.error) {
      const cv = {
        ...normalizeExtractedCv(
          {
            ...extractedCV,
            ...(storageMeta || {}),
          },
          extractedCV,
          extractedCV.sourceText || fallbackText,
        ),
        id: legacy.data.id,
        createdAt: new Date(legacy.data.created_at),
        updatedAt: new Date(legacy.data.updated_at),
        ...(storageMeta || {}),
      }

      emit?.({ stage: "done", message: "CV uploaded successfully" })
      return {
        success: true,
        message: "CV uploaded successfully",
        debug,
        cv,
        storageStatus: storageMeta?.storagePath ? "saved" : "skipped",
      }
    }

    if (storageMeta?.storagePath) {
      try {
        await supabase.storage.from(STORAGE_BUCKET).remove([storageMeta.storagePath])
      } catch {
        // Ignore cleanup errors if the DB insert fails.
      }
    }

    throw new Error(`Database error: ${legacy.error.message}`)
  }

  if (storageMeta?.storagePath) {
    try {
      await supabase.storage.from(STORAGE_BUCKET).remove([storageMeta.storagePath])
    } catch {
      // Ignore cleanup errors if the DB insert fails.
    }
  }

  throw new Error(`Database error: ${primary.error.message}`)
}

function createSseResponse(task: (emit: (event: UploadProgressEvent) => void) => Promise<UploadResult>) {
  const encoder = new TextEncoder()

  const stream = new ReadableStream({
    start(controller) {
      const send = (event: string, payload: unknown) => {
        controller.enqueue(encoder.encode(`event: ${event}\ndata: ${JSON.stringify(payload)}\n\n`))
      }

      task((progress) => send("progress", progress))
        .then((result) => {
          send("done", result)
          controller.close()
        })
        .catch((error) => {
          console.error("Upload streaming error:", error)
          send("error", { message: error instanceof Error ? error.message : "Upload failed" })
          controller.close()
        })
    },
  })

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  })
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get("file") as File | null

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: `Invalid file type: ${file.type}. Only PDF, DOC, DOCX, PNG, JPG, WEBP, and TIFF files are allowed` },
        { status: 400 },
      )
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: `File too large: ${Math.round(file.size / 1024 / 1024)}MB. Maximum size is 5MB` },
        { status: 400 },
      )
    }

    const wantsProgress = new URL(request.url).searchParams.get("progress") === "1"

    if (wantsProgress) {
      return createSseResponse((emit) => processUpload(file, user, emit))
    }

    const result = await processUpload(file, user)
    return NextResponse.json(result)
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json(
      { error: `Internal server error: ${error instanceof Error ? error.message : "Unknown error"}` },
      { status: 500 },
    )
  }
}

export async function GET() {
  return NextResponse.json({ message: "CV upload endpoint" })
}
