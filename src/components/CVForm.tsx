 "use client"

import { useMemo } from "react"
import { CVData } from "../types"

type Props = {
  value: CVData
  onChange: (next: CVData) => void
  onGenerate: () => void
  errors: Partial<Record<keyof CVData, string>>
}

function parseLines(value: string) {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
}

function updateField<K extends keyof CVData>(value: CVData, key: K, next: CVData[K]) {
  return { ...value, [key]: next }
}

export function CVForm({ value, onChange, onGenerate, errors }: Props) {
  const skillCount = useMemo(() => value.skills.length, [value.skills])

  return (
    <section className="space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Full name</label>
        <input
          value={value.fullName}
          onChange={(e) => onChange(updateField(value, "fullName", e.target.value))}
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base outline-none focus:border-slate-900"
          placeholder="Your full name"
        />
        {errors.fullName && <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Email</label>
          <input
            type="email"
            inputMode="email"
            value={value.email}
            onChange={(e) => onChange(updateField(value, "email", e.target.value))}
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base outline-none focus:border-slate-900"
            placeholder="name@example.com"
          />
          {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Phone</label>
          <input
            inputMode="tel"
            value={value.phone}
            onChange={(e) => onChange(updateField(value, "phone", e.target.value))}
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base outline-none focus:border-slate-900"
            placeholder="+232 76 123 456"
          />
          {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Location</label>
        <input
          value={value.location}
          onChange={(e) => onChange(updateField(value, "location", e.target.value))}
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base outline-none focus:border-slate-900"
          placeholder="Freetown, Sierra Leone"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Professional summary</label>
        <textarea
          value={value.summary}
          onChange={(e) => onChange(updateField(value, "summary", e.target.value))}
          rows={4}
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base outline-none focus:border-slate-900"
          placeholder="Write a short professional summary..."
        />
        {errors.summary && <p className="mt-1 text-sm text-red-600">{errors.summary}</p>}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">
          Skills <span className="text-slate-400">(comma separated)</span>
        </label>
        <textarea
          value={value.skills.join(", ")}
          onChange={(e) =>
            onChange(
              updateField(
                value,
                "skills",
                e.target.value
                  .split(",")
                  .map((item) => item.trim())
                  .filter(Boolean),
              ),
            )
          }
          rows={3}
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base outline-none focus:border-slate-900"
          placeholder="Communication, Teamwork, Excel"
        />
        <p className="mt-1 text-xs text-slate-500">{skillCount} skill(s) added</p>
        {errors.skills && <p className="mt-1 text-sm text-red-600">{errors.skills}</p>}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">
          Education <span className="text-slate-400">(one entry per line)</span>
        </label>
        <textarea
          value={value.education.join("\n")}
          onChange={(e) => onChange(updateField(value, "education", parseLines(e.target.value)))}
          rows={4}
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base outline-none focus:border-slate-900"
          placeholder="University of Sierra Leone | BSc Computer Science | 2020"
        />
        {errors.education && <p className="mt-1 text-sm text-red-600">{errors.education}</p>}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">
          Experience <span className="text-slate-400">(one entry per line)</span>
        </label>
        <textarea
          value={value.experience.join("\n")}
          onChange={(e) => onChange(updateField(value, "experience", parseLines(e.target.value)))}
          rows={5}
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base outline-none focus:border-slate-900"
          placeholder="ABC Company | Sales Assistant | 2022-2024 | Helped customers and met targets"
        />
        {errors.experience && <p className="mt-1 text-sm text-red-600">{errors.experience}</p>}
      </div>

      <button
        type="button"
        onClick={onGenerate}
        className="w-full rounded-2xl bg-slate-900 px-4 py-3 text-base font-semibold text-white shadow-lg shadow-slate-300 active:scale-[0.99]"
      >
        Generate CV
      </button>
    </section>
  )
}
