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
                        <span className="flex items-center gap-1">
                            <span className="font-semibold">Email:</span> {data.personalInfo.email || "Not provided"}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                            <span className="font-semibold">Phone:</span> {data.personalInfo.phone ? `+232 ${data.personalInfo.phone}` : "Not provided"}
                        </span>
                        {data.personalInfo.location && (
                            <>
                                <span>•</span>
                                <span className="flex items-center gap-1">
                                    <span className="font-semibold">Location:</span> {data.personalInfo.location}
                                </span>
                            </>
                        )}
                        {data.personalInfo.addressCity && (
                            <>
                                <span>•</span>
                                <span className="flex items-center gap-1">
                                    <span className="font-semibold text-[10px] uppercase">City/Country:</span> {data.personalInfo.addressCity}, {data.personalInfo.addressCountry}
                                </span>
                            </>
                        )}
                        {data.personalInfo.linkedin && (
                            <>
                                <span>•</span>
                                <span className="flex items-center gap-1 text-primary lowercase truncate max-w-[150px]">
                                    {data.personalInfo.linkedin}
                                </span>
                            </>
                        )}
                        {data.availability && (
                            <>
                                <span>•</span>
                                <span className="flex items-center gap-1">
                                    <span className="font-semibold text-primary uppercase text-[10px]">Available:</span> {data.availability}
                                </span>
                            </>
                        )}
                    </div>
                </div>
            </div>

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
                    <p className={`text-foreground leading-relaxed text-justify p-4 rounded-lg bg-opacity-50`} style={{ backgroundColor: theme.bg }}>
                        {data.personalInfo.summary || "Summary not provided"}
                    </p>
                )}
            </div>

            <div className="mb-8">
                <h2 className={`text-2xl font-bold ${theme.primary} mb-4 uppercase tracking-wide border-l-4 ${theme.border} pl-3`}>
                    Work Experience
                </h2>
                <div className="space-y-5">
                    {data.experience && data.experience.length > 0 ? data.experience.map((exp) => (
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
                                <p className="text-foreground/80 leading-relaxed whitespace-pre-line mb-2">{exp.description}</p>
                            )}
                            {exp.achievements && (
                                <div className="mt-2 bg-slate-50/50 p-2 rounded">
                                    <p className="text-[10px] uppercase font-bold text-muted-foreground mb-1">Achievements</p>
                                    <p className="text-sm italic">{exp.achievements}</p>
                                </div>
                            )}
                        </div>
                    )) : <p className="text-muted-foreground italic p-4">No experience listed</p>}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div>
                    <h2 className={`text-xl font-bold ${theme.primary} mb-4 uppercase tracking-wide border-l-4 ${theme.border} pl-3`}>
                        Education
                    </h2>
                    <div className="space-y-4">
                        {data.education && data.education.length > 0 ? data.education.map((edu) => (
                            <div
                                key={edu.id}
                                className={`p-3 rounded-lg border-l-2 ${theme.border.replace("border-", "border-opacity-30 ")}`}
                            >
                                <div className="flex justify-between items-start mb-1">
                                    <h3 className={`font-semibold ${theme.icon_text}`}>
                                        {edu.degree}
                                    </h3>
                                    <span className="text-[10px] text-muted-foreground">
                                        {edu.startDate} - {edu.endDate}
                                    </span>
                                </div>
                                <p className="text-foreground text-sm font-medium">{edu.institution}</p>
                            </div>
                        )) : <p className="text-muted-foreground italic text-sm">No education listed</p>}
                    </div>
                </div>

                <div>
                    <h2 className={`text-xl font-bold ${theme.primary} mb-4 uppercase tracking-wide border-l-4 ${theme.border} pl-3`}>
                        Certifications
                    </h2>
                    <div className="space-y-4">
                        {data.certifications && data.certifications.length > 0 ? data.certifications.map((cert) => (
                            <div
                                key={cert.id}
                                className={`p-3 rounded-lg border-l-2 ${theme.border.replace("border-", "border-opacity-30 ")}`}
                            >
                                <h3 className={`font-semibold ${theme.icon_text}`}>{cert.name}</h3>
                                <p className="text-sm">{cert.organization} ({cert.year})</p>
                            </div>
                        )) : <p className="text-muted-foreground italic text-sm">No certifications listed</p>}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div>
                    <h2 className={`text-xl font-bold ${theme.primary} mb-4 uppercase tracking-wide border-l-4 ${theme.border} pl-3`}>
                        Skills
                    </h2>
                    <div className="flex flex-wrap gap-2">
                        {data.skills && data.skills.length > 0 ? data.skills.map((skill, index) => (
                            <span
                                key={index}
                                className={`px-3 py-1 ${theme.icon_bg} ${theme.icon_text} rounded text-sm font-semibold border ${theme.border}`}
                            >
                                {skill}
                            </span>
                        )) : <p className="text-muted-foreground italic text-sm">No skills listed</p>}
                    </div>
                </div>

                <div>
                    <h2 className={`text-xl font-bold ${theme.primary} mb-4 uppercase tracking-wide border-l-4 ${theme.border} pl-3`}>
                        Languages
                    </h2>
                    <div className="space-y-2">
                        {data.languages && data.languages.length > 0 ? data.languages.map((lang, index) => (
                            <div
                                key={index}
                                className={`flex justify-between p-2 rounded border ${theme.border}`}
                            >
                                <span className={`font-semibold ${theme.icon_text}`}>{lang.language}</span>
                                <span className="text-xs text-foreground/70">{lang.proficiency}</span>
                            </div>
                        )) : <p className="text-muted-foreground italic text-sm">No languages listed</p>}
                    </div>
                </div>
            </div>

            <div className="mb-8">
                <h2 className={`text-2xl font-bold ${theme.primary} mb-4 uppercase tracking-wide border-l-4 ${theme.border} pl-3 text-primary`}>
                    Featured Projects
                </h2>
                <div className="space-y-4">
                    {data.projects && data.projects.length > 0 ? data.projects.map((proj) => (
                        <div
                            key={proj.id}
                            className={`p-4 rounded-xl border-l-4 ${theme.border} bg-slate-50/50 hover:bg-slate-50 transition-colors shadow-sm`}
                        >
                            <div className="flex justify-between items-start mb-2">
                                <h3 className={`text-lg font-bold ${theme.icon_text}`}>{proj.name}</h3>
                                {proj.link && <span className={`text-[10px] text-primary font-mono lowercase bg-white px-2 py-0.5 rounded border`}>{proj.link}</span>}
                            </div>
                            <p className="text-foreground leading-relaxed text-sm mb-3">{proj.description}</p>
                            {proj.technologies && proj.technologies.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {proj.technologies.map((tech, i) => (
                                        <span key={i} className={`text-[10px] font-semibold ${theme.icon_bg} ${theme.icon_text} px-3 py-1 rounded-full border border-current/20`}>
                                            {tech}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    )) : <p className="text-muted-foreground italic p-4 text-center">No projects listed</p>}
                </div>
            </div>

            {data.technicalWriting && data.technicalWriting.length > 0 && (
                <div className="mb-8">
                    <h2 className={`text-2xl font-bold ${theme.primary} mb-4 uppercase tracking-wide border-l-4 ${theme.border} pl-3`}>
                        Technical Writing & Publications
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {data.technicalWriting.map((item) => (
                            <div key={item.id} className="p-4 rounded-xl border border-slate-200 bg-white hover:border-primary/30 transition-all shadow-sm group">
                                <h3 className="font-bold text-slate-800 mb-1 group-hover:text-primary transition-colors">{item.title}</h3>
                                <div className="flex justify-between items-center">
                                    <span className="text-xs font-semibold text-slate-500">{item.platform}</span>
                                    <span className="text-[10px] text-primary font-mono truncate max-w-[120px]">{item.link}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div>
                    <h2 className={`text-xl font-bold ${theme.primary} mb-4 uppercase tracking-wide border-l-4 ${theme.border} pl-3`}>
                        Volunteering
                    </h2>
                    <div className="space-y-4">
                        {data.volunteering && data.volunteering.length > 0 ? data.volunteering.map((vol) => (
                            <div key={vol.id} className="p-3 border-l-2 border-slate-100 italic">
                                <h4 className="font-bold text-sm">{vol.organization}</h4>
                                <p className="text-xs text-slate-500 font-medium">{vol.role}</p>
                                <p className="text-[10px] font-mono">{vol.startDate} - {vol.endDate}</p>
                            </div>
                        )) : <p className="text-muted-foreground italic text-sm">No volunteering listed</p>}
                    </div>
                </div>

                <div>
                    <h2 className={`text-xl font-bold ${theme.primary} mb-4 uppercase tracking-wide border-l-4 ${theme.border} pl-3`}>
                        Awards & Hobbies
                    </h2>
                    <div className="space-y-4 p-3 bg-slate-50/30 rounded">
                        <div className="space-y-1">
                            <p className="text-[9px] uppercase font-bold text-slate-300">Awards:</p>
                            {data.awards && data.awards.length > 0 ? data.awards.map((award) => (
                                <p key={award.id} className="text-xs">
                                    <span className="font-bold">{award.name}</span> — {award.organization} ({award.year})
                                </p>
                            )) : <p className="text-slate-300 italic text-xs">No awards</p>}
                        </div>
                        <div className="space-y-1">
                            <p className="text-[9px] uppercase font-bold text-slate-300">Hobbies:</p>
                            <div className="flex flex-wrap gap-2">
                                {data.hobbies && data.hobbies.length > 0 ? data.hobbies.map((h, i) => (
                                    <span key={i} className="text-xs text-slate-600 font-medium px-2 py-0.5 bg-white rounded border border-slate-100">{h}</span>
                                )) : <p className="text-slate-300 italic text-xs">No hobbies</p>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mb-8 pt-8 border-t-2 border-slate-100">
                <h2 className={`text-2xl font-bold ${theme.primary} mb-6 uppercase tracking-wide text-center`}>
                    Referees
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-4">
                    {data.referees && data.referees.length > 0 ? data.referees.map((ref) => (
                        <div key={ref.id} className="text-center md:text-left bg-slate-50/50 p-4 rounded-xl border border-dashed">
                            {ref.availableOnRequest ? (
                                <p className="font-bold text-slate-700 uppercase tracking-widest text-sm">References Available On Request</p>
                            ) : (
                                <>
                                    <h3 className="font-bold text-slate-900 border-b border-slate-200 pb-1 mb-2 inline-block">{ref.name}</h3>
                                    <p className="text-sm font-medium text-slate-700">{ref.title}</p>
                                    <p className="text-xs text-slate-600 mb-2">{ref.organization}</p>
                                    <div className="space-y-1 text-xs text-primary font-mono">
                                        {ref.phone && <p>{ref.phone}</p>}
                                        {ref.email && <p className="lowercase">{ref.email}</p>}
                                    </div>
                                </>
                            )}
                        </div>
                    )) : <p className="text-muted-foreground italic text-sm text-center col-span-2">No referees listed</p>}
                </div>
            </div>
        </div>
    )
}
