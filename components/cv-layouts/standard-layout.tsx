import { CVLayoutProps } from "./types"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export function StandardLayout({ cvData, theme, isEditing, editedData, onEdit }: CVLayoutProps) {
    const data = isEditing && editedData ? editedData : cvData

    return (
        <div className="p-12 print:p-8">
            <div className={`border-b-4 ${theme.border} pb-6 mb-8 flex items-start gap-6`}>
                {data.personalInfo.profilePhoto && (
                    <div className="shrink-0">
                        <img
                            src={data.personalInfo.profilePhoto || "/placeholder.svg"}
                            alt={data.personalInfo.fullName}
                            className={`w-32 h-32 rounded-lg object-cover border-4 ${theme.border} shadow-lg`}
                        />
                    </div>
                )}
                <div className="flex-1">
                    {isEditing ? (
                        <Input
                            value={data.personalInfo.fullName}
                            onChange={(e) =>
                                onEdit?.({
                                    ...data,
                                    personalInfo: { ...data.personalInfo, fullName: e.target.value },
                                })
                            }
                            className="text-4xl font-bold mb-2 h-auto border-2 border-dashed"
                        />
                    ) : (
                        <h1 className={`text-4xl font-bold ${theme.primary} mb-3 uppercase tracking-wide`}>
                            {data.personalInfo.fullName}
                        </h1>
                    )}
                    <div className={`flex flex-wrap gap-4 text-sm text-foreground/80 ${theme.bg} p-3 rounded-lg`}>
                        {data.personalInfo.age && (
                            <>
                                <span className="flex items-center gap-1">
                                    <span className="font-semibold">Age:</span> {data.personalInfo.age}
                                </span>
                                <span>•</span>
                            </>
                        )}
                        <span className="flex items-center gap-1">
                            <span className="font-semibold">Email:</span> {data.personalInfo.email}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                            <span className="font-semibold">Phone:</span> +232 {data.personalInfo.phone}
                        </span>
                        {data.personalInfo.location && (
                            <>
                                <span>•</span>
                                <span className="flex items-center gap-1">
                                    <span className="font-semibold">Location:</span> {data.personalInfo.location}
                                </span>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {data.personalInfo.summary && (
                <div className="mb-8">
                    <h2 className={`text-2xl font-bold ${theme.primary} mb-4 uppercase tracking-wide border-l-4 ${theme.border} pl-3`}>
                        Professional Summary
                    </h2>
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
                        <p className="text-foreground leading-relaxed text-justify p-4 rounded-lg bg-opacity-50" style={{ backgroundColor: theme.bg }}>
                            {data.personalInfo.summary}
                        </p>
                    )}
                </div>
            )}

            {data.education.length > 0 && (
                <div className="mb-8">
                    <h2 className={`text-2xl font-bold ${theme.primary} mb-4 uppercase tracking-wide border-l-4 ${theme.border} pl-3`}>
                        Education
                    </h2>
                    <div className="space-y-4">
                        {data.education.map((edu) => (
                            <div
                                key={edu.id}
                                className={`transition-all hover:bg-opacity-50 p-3 rounded-lg border-l-2 ${theme.border.replace("border-", "border-opacity-30 ")}`}
                                style={{ backgroundColor: `${theme.bg.replace("bg-", "") === "white" ? "#f8f9fa" : ""}` }}
                            >
                                <div className="flex justify-between items-start mb-1">
                                    <h3 className={`text-lg font-semibold ${theme.icon_text}`}>
                                        {edu.degree} {edu.fieldOfStudy && `in ${edu.fieldOfStudy}`}
                                    </h3>
                                    <span className={`text-sm text-muted-foreground ${theme.icon_bg} px-2 py-1 rounded`}>
                                        {edu.startDate} - {edu.current ? "Present" : edu.endDate}
                                    </span>
                                </div>
                                <p className="text-foreground font-medium">{edu.institution}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {data.experience.length > 0 && (
                <div className="mb-8">
                    <h2 className={`text-2xl font-bold ${theme.primary} mb-4 uppercase tracking-wide border-l-4 ${theme.border} pl-3`}>
                        Work Experience
                    </h2>
                    <div className="space-y-5">
                        {data.experience.map((exp) => (
                            <div
                                key={exp.id}
                                className={`transition-all hover:bg-opacity-50 p-3 rounded-lg border-l-2 ${theme.border.replace("border-", "border-opacity-30 ")}`}
                            >
                                <div className="flex justify-between items-start mb-1">
                                    <h3 className={`text-lg font-semibold ${theme.icon_text}`}>{exp.position}</h3>
                                    <span className={`text-sm text-muted-foreground ${theme.icon_bg} px-2 py-1 rounded`}>
                                        {exp.startDate} - {exp.current ? "Present" : exp.endDate}
                                    </span>
                                </div>
                                <p className="text-foreground font-medium mb-2">
                                    {exp.company} {exp.location && `• ${exp.location}`}
                                </p>
                                {exp.description && (
                                    <p className="text-foreground/80 leading-relaxed whitespace-pre-line">{exp.description}</p>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {data.skills.length > 0 && (
                <div className="mb-8">
                    <h2 className={`text-2xl font-bold ${theme.primary} mb-4 uppercase tracking-wide border-l-4 ${theme.border} pl-3`}>
                        Skills & Competencies
                    </h2>
                    <div className="flex flex-wrap gap-2">
                        {data.skills.map((skill, index) => (
                            <span
                                key={index}
                                className={`px-4 py-2 ${theme.icon_bg} ${theme.icon_text} rounded-lg text-sm font-semibold border ${theme.border} print:border-2`}
                            >
                                {skill}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {data.languages.length > 0 && (
                <div className="mb-8">
                    <h2 className={`text-2xl font-bold ${theme.primary} mb-4 uppercase tracking-wide border-l-4 ${theme.border} pl-3`}>
                        Languages
                    </h2>
                    <div className="grid grid-cols-2 gap-4">
                        {data.languages.map((lang, index) => (
                            <div
                                key={index}
                                className={`flex justify-between ${theme.bg} p-3 rounded-lg border ${theme.border}`}
                            >
                                <span className={`font-semibold ${theme.icon_text}`}>{lang.language}</span>
                                <span className="text-foreground/70 capitalize bg-white px-2 rounded">{lang.proficiency}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
