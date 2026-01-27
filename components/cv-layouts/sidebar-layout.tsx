import { CVLayoutProps } from "./types"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { MapPin, Mail, Phone, Calendar } from "lucide-react"

export function SidebarLayout({ cvData, theme, isEditing, editedData, onEdit }: CVLayoutProps) {
    const data = isEditing && editedData ? editedData : cvData

    // Extract background color from theme.bg class name safely
    const bgColorClass = theme.bg.includes('bg-') ? theme.bg : 'bg-slate-100';

    return (
        <div className="flex h-full min-h-[1000px]">
            {/* Sidebar - Left Column */}
            <div className={`w-1/3 p-8 ${bgColorClass} text-slate-800`}>
                <div className="flex flex-col gap-6">
                    <div className="flex justify-center mb-4">
                        {data.personalInfo.profilePhoto ? (
                            <img
                                src={data.personalInfo.profilePhoto}
                                alt={data.personalInfo.fullName}
                                className={`w-40 h-40 rounded-full object-cover border-4 border-white shadow-xl`}
                            />
                        ) : (
                            <div className="w-40 h-40 rounded-full bg-white/50 flex items-center justify-center border-4 border-white shadow-xl">
                                <span className="text-4xl font-bold text-slate-400">
                                    {data.personalInfo.fullName.charAt(0)}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-4">
                        <h3 className={`uppercase tracking-widest font-bold text-sm border-b-2 ${theme.border} pb-1 mb-2`}>Contact</h3>

                        <div className="flex items-center gap-3 text-sm">
                            <Mail className="size-4 shrink-0 opacity-70" />
                            <span className="break-all">{data.personalInfo.email}</span>
                        </div>

                        <div className="flex items-center gap-3 text-sm">
                            <Phone className="size-4 shrink-0 opacity-70" />
                            <span>+232 {data.personalInfo.phone}</span>
                        </div>

                        {data.personalInfo.location && (
                            <div className="flex items-center gap-3 text-sm">
                                <MapPin className="size-4 shrink-0 opacity-70" />
                                <span>{data.personalInfo.location}</span>
                            </div>
                        )}

                        {data.personalInfo.age && (
                            <div className="flex items-center gap-3 text-sm">
                                <Calendar className="size-4 shrink-0 opacity-70" />
                                <span>{data.personalInfo.age} Years Old</span>
                            </div>
                        )}
                    </div>

                    {/* Skills */}
                    {data.skills.length > 0 && (
                        <div className="space-y-4 mt-4">
                            <h3 className={`uppercase tracking-widest font-bold text-sm border-b-2 ${theme.border} pb-1 mb-2`}>Skills</h3>
                            <div className="flex flex-wrap gap-2">
                                {data.skills.map((skill, index) => (
                                    <span key={index} className="text-sm bg-white/60 px-2 py-1 rounded">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Languages */}
                    {data.languages.length > 0 && (
                        <div className="space-y-4 mt-4">
                            <h3 className={`uppercase tracking-widest font-bold text-sm border-b-2 ${theme.border} pb-1 mb-2`}>Languages</h3>
                            <div className="space-y-2">
                                {data.languages.map((lang, index) => (
                                    <div key={index} className="flex justify-between items-center text-sm">
                                        <span>{lang.language}</span>
                                        <span className="text-xs opacity-70">{lang.proficiency}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Main Content - Right Column */}
            <div className="w-2/3 p-8 bg-white">
                <div className="mb-10">
                    {isEditing ? (
                        <Input
                            value={data.personalInfo.fullName}
                            onChange={(e) =>
                                onEdit?.({
                                    ...data,
                                    personalInfo: { ...data.personalInfo, fullName: e.target.value },
                                })
                            }
                            className="text-5xl font-extrabold uppercase tracking-tight text-slate-900 mb-2 h-auto border-2 border-dashed"
                        />
                    ) : (
                        <h1 className="text-5xl font-extrabold uppercase tracking-tight text-slate-900 mb-2">
                            {data.personalInfo.fullName}
                        </h1>
                    )}
                    {/* We can infer job title from first experience or leave blank, for now using location/summary snippet or generic 'Professional' */}
                    <p className={`text-xl font-medium ${theme.primary} tracking-wide`}>
                        {data.experience[0]?.position || "Professional"}
                    </p>
                </div>

                {data.personalInfo.summary && (
                    <div className="mb-10">
                        <h2 className={`text-lg font-bold uppercase tracking-widest ${theme.primary} mb-4 flex items-center gap-2`}>
                            <span className={`w-8 h-1 ${theme.accent} inline-block rounded-full`}></span> Profile
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
                                className="border-2 border-dashed text-slate-600 leading-relaxed"
                            />
                        ) : (
                            <p className="text-slate-600 leading-relaxed text-justify">
                                {data.personalInfo.summary}
                            </p>
                        )}
                    </div>
                )}

                {data.experience.length > 0 && (
                    <div className="mb-10">
                        <h2 className={`text-lg font-bold uppercase tracking-widest ${theme.primary} mb-6 flex items-center gap-2`}>
                            <span className={`w-8 h-1 ${theme.accent} inline-block rounded-full`}></span> Experience
                        </h2>
                        <div className="space-y-8 border-l-2 border-slate-100 pl-6 ml-1">
                            {data.experience.map((exp) => (
                                <div key={exp.id} className="relative">
                                    <span className={`absolute -left-[31px] top-1.5 w-4 h-4 rounded-full border-2 border-white ${theme.accent}`}></span>
                                    <div className="flex justify-between items-baseline mb-1">
                                        <h3 className="text-xl font-bold text-slate-800">{exp.position}</h3>
                                        <span className="text-sm font-medium text-slate-500 whitespace-nowrap">
                                            {exp.startDate} – {exp.current ? "Present" : exp.endDate}
                                        </span>
                                    </div>
                                    <div className="text-slate-600 font-medium mb-3">{exp.company}, {exp.location}</div>
                                    {exp.description && (
                                        <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">{exp.description}</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {data.education.length > 0 && (
                    <div className="mb-8">
                        <h2 className={`text-lg font-bold uppercase tracking-widest ${theme.primary} mb-6 flex items-center gap-2`}>
                            <span className={`w-8 h-1 ${theme.accent} inline-block rounded-full`}></span> Education
                        </h2>
                        <div className="grid gap-6">
                            {data.education.map((edu) => (
                                <div key={edu.id}>
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="text-lg font-bold text-slate-800">
                                                {edu.degree} {edu.fieldOfStudy && `in ${edu.fieldOfStudy}`}
                                            </h3>
                                            <p className="text-slate-600">{edu.institution}</p>
                                        </div>
                                        <span className="text-sm font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                                            {edu.startDate} – {edu.current ? "Present" : edu.endDate}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

            </div>
        </div>
    )
}
