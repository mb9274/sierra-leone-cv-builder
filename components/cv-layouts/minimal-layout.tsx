import { CVLayoutProps } from "./types"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export function MinimalLayout({ cvData, theme, isEditing, editedData, onEdit }: CVLayoutProps) {
    const data = isEditing && editedData ? editedData : cvData

    return (
        <div className="p-16 print:p-12 max-w-3xl mx-auto text-slate-900">
            {/* Header Centralized */}
            <div className="text-center mb-12 border-b pb-8 border-slate-200">
                {isEditing ? (
                    <Input
                        value={data.personalInfo.fullName}
                        onChange={(e) =>
                            onEdit?.({
                                ...data,
                                personalInfo: { ...data.personalInfo, fullName: e.target.value },
                            })
                        }
                        className="text-4xl font-serif text-center font-bold mb-4 h-auto border-2 border-dashed"
                    />
                ) : (
                    <h1 className="text-4xl font-serif font-bold mb-4 tracking-wide">
                        {data.personalInfo.fullName}
                    </h1>
                )}

                <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-slate-600 font-medium">
                    <span>{data.personalInfo.email}</span>
                    <span>+232 {data.personalInfo.phone}</span>
                    {data.personalInfo.location && <span>{data.personalInfo.location}</span>}
                </div>
            </div>

            {data.personalInfo.summary && (
                <div className="mb-10">
                    {isEditing ? (
                        <Textarea
                            value={data.personalInfo.summary}
                            onChange={(e) =>
                                onEdit?.({
                                    ...data,
                                    personalInfo: { ...data.personalInfo, summary: e.target.value },
                                })
                            }
                            rows={4}
                            className="border-2 border-dashed"
                        />
                    ) : (
                        <p className="text-slate-700 leading-relaxed text-center italic text-lg px-8">
                            "{data.personalInfo.summary}"
                        </p>
                    )}
                </div>
            )}

            {/* Two Columns for Exp and Skills/Edu if dense, but Minimal is usually single column for readability or split sections cleanly. Let's go Single Column for Minimal Elegant look. */}

            {data.experience.length > 0 && (
                <div className="mb-10">
                    <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-6 border-b border-slate-100 pb-2">
                        Experience
                    </h2>
                    <div className="space-y-8">
                        {data.experience.map((exp) => (
                            <div key={exp.id}>
                                <div className="flex justify-between items-baseline mb-2">
                                    <h3 className="text-lg font-bold font-serif">{exp.position}</h3>
                                    <span className="text-sm text-slate-500 font-mono">
                                        {exp.startDate} — {exp.current ? "Present" : exp.endDate}
                                    </span>
                                </div>
                                <div className="text-slate-600 font-medium mb-3 italic">{exp.company}, {exp.location}</div>
                                {exp.description && (
                                    <p className="text-slate-700 leading-7 whitespace-pre-line">{exp.description}</p>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {data.education.length > 0 && (
                    <div className="mb-8">
                        <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-6 border-b border-slate-100 pb-2">
                            Education
                        </h2>
                        <div className="space-y-6">
                            {data.education.map((edu) => (
                                <div key={edu.id}>
                                    <h3 className="font-bold font-serif">{edu.institution}</h3>
                                    <p className="text-slate-700">{edu.degree} in {edu.fieldOfStudy}</p>
                                    <p className="text-sm text-slate-500 mt-1 font-mono">
                                        {edu.startDate} — {edu.current ? "Present" : edu.endDate}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {data.skills.length > 0 && (
                    <div className="mb-8">
                        <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-6 border-b border-slate-100 pb-2">
                            Skills
                        </h2>
                        <div className="flex flex-wrap gap-x-6 gap-y-3">
                            {data.skills.map((skill, index) => (
                                <span key={index} className="text-slate-700 font-medium">
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {data.languages.length > 0 && (
                <div className="mt-8 pt-8 border-t border-slate-100 text-center">
                    <span className="text-slate-500 uppercase text-xs tracking-widest mr-4">Languages:</span>
                    {data.languages.map((lang, index) => (
                        <span key={index} className="mx-3 text-slate-700">
                            {lang.language} <span className="text-slate-400 text-sm">({lang.proficiency})</span>
                        </span>
                    ))}
                </div>
            )}
        </div>
    )
}
