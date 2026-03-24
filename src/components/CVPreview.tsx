 "use client"

import type { ReactNode } from "react"
import { CVData, UploadState } from "../types"

type Props = {
  cv: CVData | null
  uploadState: UploadState
  onBack: () => void
  onDownload: () => void
  onUpload: () => void
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="space-y-2">
      <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">{title}</h3>
      <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100">{children}</div>
    </section>
  )
}

export function CVPreview({ cv, uploadState, onBack, onDownload, onUpload }: Props) {
  if (!cv) return null

  return (
    <section className="space-y-4">
      <div className="rounded-[28px] bg-slate-900 p-5 text-white shadow-xl">
        <p className="text-xs uppercase tracking-[0.3em] text-slate-300">Preview</p>
        <h2 className="mt-2 text-2xl font-bold">{cv.fullName}</h2>
        <p className="mt-1 text-sm text-slate-300">{cv.location}</p>
      </div>

      <div className="space-y-4">
        <Section title="Contact">
          <p className="text-sm text-slate-700">{cv.email}</p>
          <p className="text-sm text-slate-700">{cv.phone}</p>
        </Section>

        <Section title="Summary">
          <p className="text-sm leading-6 text-slate-700">{cv.summary}</p>
        </Section>

        <Section title="Skills">
          <div className="flex flex-wrap gap-2">
            {cv.skills.map((skill) => (
              <span key={skill} className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700">
                {skill}
              </span>
            ))}
          </div>
        </Section>

        <Section title="Education">
          <ul className="space-y-2">
            {cv.education.map((entry) => (
              <li key={entry} className="text-sm text-slate-700">
                {entry}
              </li>
            ))}
          </ul>
        </Section>

        <Section title="Experience">
          <ul className="space-y-2">
            {cv.experience.map((entry) => (
              <li key={entry} className="text-sm text-slate-700">
                {entry}
              </li>
            ))}
          </ul>
        </Section>
      </div>

      {uploadState.status !== "idle" && (
        <div
          className={`rounded-2xl px-4 py-3 text-sm ${
            uploadState.status === "success"
              ? "bg-emerald-50 text-emerald-800"
              : uploadState.status === "error"
                ? "bg-red-50 text-red-800"
                : "bg-slate-100 text-slate-700"
          }`}
        >
          <p className="font-semibold">{uploadState.status === "success" ? "Upload complete" : uploadState.status === "error" ? "Upload error" : "Uploading..."}</p>
          <p className="mt-1">{uploadState.message}</p>
        </div>
      )}

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onBack}
          className="flex-1 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base font-semibold text-slate-700"
        >
          Edit
        </button>
        <button
          type="button"
          onClick={onDownload}
          className="flex-1 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base font-semibold text-slate-700"
        >
          Download PDF
        </button>
        <button
          type="button"
          onClick={onUpload}
          className="flex-1 rounded-2xl bg-emerald-600 px-4 py-3 text-base font-semibold text-white shadow-lg shadow-emerald-200"
        >
          Upload to Supabase
        </button>
      </div>
    </section>
  )
}
