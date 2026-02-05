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
                            <span className="break-all">{data.personalInfo.email || "Email not provided"}</span>
                        </div>

                        <div className="flex items-center gap-3 text-sm">
                            <Phone className="size-4 shrink-0 opacity-70" />
                            <span>{data.personalInfo.phone ? `+232 ${data.personalInfo.phone}` : "Phone not provided"}</span>
                        </div>

                        <div className="flex items-center gap-3 text-sm">
                            <MapPin className="size-4 shrink-0 opacity-70" />
                            <span>{data.personalInfo.location || "Location not provided"}</span>
                        </div>

                        {(data.personalInfo.addressCity || data.personalInfo.addressCountry) && (
                            <div className="flex items-center gap-3 text-sm pl-7 text-xs opacity-80">
                                <span>{data.personalInfo.addressCity}, {data.personalInfo.addressCountry}</span>
                            </div>
                        )}

                        {data.personalInfo.linkedin && (
                            <div className="flex items-center gap-3 text-sm">
                                <span className="size-4 shrink-0 opacity-70 font-bold text-[10px]">IN</span>
                                <span className="truncate">{data.personalInfo.linkedin}</span>
                            </div>
                        )}

                        {data.personalInfo.portfolio && (
                            <div className="flex items-center gap-3 text-sm">
                                <span className="size-4 shrink-0 opacity-70 font-bold text-[10px]">W</span>
                                <span className="truncate">{data.personalInfo.portfolio}</span>
                            </div>
                        )}

                        {data.availability && (
                            <div className="flex items-center gap-3 text-sm">
                                <Calendar className="size-4 shrink-0 opacity-70" />
                                <span className={`font-bold uppercase text-[10px] ${theme.accent} inline-block px-2 py-0.5 rounded`}>
                                    Available: {data.availability}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Skills */}
                    <div className="space-y-4 mt-4">
                        <h3 className={`uppercase tracking-widest font-bold text-sm border-b-2 ${theme.border} pb-1 mb-2`}>Skills</h3>
                        <div className="flex flex-wrap gap-2">
                            {data.skills && data.skills.length > 0 ? data.skills.map((skill, index) => (
                                <span key={index} className="text-xs bg-white/60 px-2 py-1 rounded font-medium">
                                    {skill}
                                </span>
                            )) : <p className="text-xs italic opacity-50">No skills listed</p>}
                        </div>
                    </div>

                    {/* Languages */}
                    <div className="space-y-4 mt-4">
                        <h3 className={`uppercase tracking-widest font-bold text-sm border-b-2 ${theme.border} pb-1 mb-2`}>Languages</h3>
                        <div className="space-y-2">
                            {data.languages && data.languages.length > 0 ? data.languages.map((lang, index) => (
                                <div key={index} className="flex justify-between items-center text-sm">
                                    <span className="font-medium">{lang.language}</span>
                                    <span className="text-[10px] opacity-70 italic">{lang.proficiency}</span>
                                </div>
                            )) : <p className="text-xs italic opacity-50">No languages listed</p>}
                        </div>
                    </div>

                    {/* Certifications */}
                    <div className="space-y-4 mt-4">
                        <h3 className={`uppercase tracking-widest font-bold text-sm border-b-2 ${theme.border} pb-1 mb-2`}>Certifications</h3>
                        <div className="space-y-3">
                            {data.certifications && data.certifications.length > 0 ? data.certifications.map((cert) => (
                                <div key={cert.id} className="text-sm">
                                    <p className="font-bold leading-tight">{cert.name}</p>
                                    <p className="text-[10px] opacity-70">{cert.organization} • {cert.year}</p>
                                </div>
                            )) : <p className="text-xs italic opacity-50">No certs listed</p>}
                        </div>
                    </div>

                    {/* Hobbies */}
                    <div className="space-y-4 mt-4">
                        <h3 className={`uppercase tracking-widest font-bold text-sm border-b-2 ${theme.border} pb-1 mb-2`}>Hobbies</h3>
                        <div className="flex flex-wrap gap-1.5">
                            {data.hobbies && data.hobbies.length > 0 ? data.hobbies.map((hobby, i) => (
                                <span key={i} className="text-[10px] border border-slate-300 px-1.5 py-0.5 rounded italic">{hobby}</span>
                            )) : <p className="text-xs italic opacity-50">Not specified</p>}
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content - Right Column */}
            <div className="w-2/3 p-10 bg-white">
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
                            {data.personalInfo.fullName || "Your Full Name"}
                        </h1>
                    )}
                    <p className={`text-xl font-medium ${theme.primary} tracking-wide border-b border-slate-100 pb-2`}>
                        {data.experience?.[0]?.position || "Professional Profile"}
                    </p>
                </div>

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
                        <p className="text-slate-600 leading-relaxed text-justify italic">
                            {data.personalInfo.summary || "Summary not provided"}
                        </p>
                    )}
                </div>

                <div className="mb-10">
                    <h2 className={`text-lg font-bold uppercase tracking-widest ${theme.primary} mb-6 flex items-center gap-2`}>
                        <span className={`w-8 h-1 ${theme.accent} inline-block rounded-full`}></span> Experience
                    </h2>
                    <div className="space-y-8 border-l-2 border-slate-100 pl-6 ml-1">
                        {data.experience && data.experience.length > 0 ? data.experience.map((exp) => (
                            <div key={exp.id} className="relative">
                                <span className={`absolute -left-[31px] top-1.5 w-4 h-4 rounded-full border-2 border-white ${theme.accent}`}></span>
                                <div className="flex justify-between items-baseline mb-1">
                                    <h3 className="text-xl font-bold text-slate-800">{exp.position}</h3>
                                    <span className="text-xs font-medium text-slate-400 whitespace-nowrap">
                                        {exp.startDate} – {exp.current ? "Present" : exp.endDate}
                                    </span>
                                </div>
                                <div className="text-primary font-bold text-xs mb-3">{exp.company} | {exp.location}</div>
                                {exp.description && (
                                    <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line mb-2">{exp.description}</p>
                                )}
                                {exp.achievements && (
                                    <div className="mt-2 text-xs text-slate-500 italic p-2 bg-slate-50 rounded border-l-2 border-primary/20">
                                        {exp.achievements}
                                    </div>
                                )}
                            </div>
                        )) : <p className="text-slate-400 italic text-sm">No experience listed</p>}
                    </div>
                </div>

                <div className="mb-10">
                    <h2 className={`text-lg font-bold uppercase tracking-widest ${theme.primary} mb-6 flex items-center gap-2`}>
                        <span className={`w-8 h-1 ${theme.accent} inline-block rounded-full`}></span> Education
                    </h2>
                    <div className="grid gap-6">
                        {data.education && data.education.length > 0 ? data.education.map((edu) => (
                            <div key={edu.id}>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-lg font-bold text-slate-800">
                                            {edu.degree} {edu.fieldOfStudy && `in ${edu.fieldOfStudy}`}
                                        </h3>
                                        <p className="text-slate-600 font-medium">{edu.institution}</p>
                                    </div>
                                    <span className="text-xs font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                                        {edu.startDate} – {edu.endDate}
                                    </span>
                                </div>
                            </div>
                        )) : <p className="text-slate-400 italic text-sm">No education listed</p>}
                    </div>
                </div>

                <div className="mb-10">
                    <h2 className={`text-lg font-bold uppercase tracking-widest ${theme.primary} mb-6 flex items-center gap-2`}>
                        <span className={`w-8 h-1 ${theme.accent} inline-block rounded-full`}></span> Projects
                    </h2>
                    <div className="space-y-6">
                        {data.projects && data.projects.length > 0 ? data.projects.map((proj) => (
                            <div key={proj.id} className="bg-slate-50/50 p-4 rounded-lg">
                                <div className="flex justify-between items-baseline mb-2">
                                    <h3 className="text-lg font-bold text-slate-800">{proj.name}</h3>
                                    {proj.link && <span className={`text-[10px] font-mono ${theme.primary} lowercase truncate max-w-[120px]`}>{proj.link}</span>}
                                </div>
                                <p className="text-slate-600 text-sm leading-relaxed mb-2">{proj.description}</p>
                                {proj.outcome && <p className="text-[10px] font-bold text-primary mb-2 uppercase tracking-tight">Outcome: {proj.outcome}</p>}
                                {proj.technologies && proj.technologies.length > 0 && (
                                    <div className="flex flex-wrap gap-2">
                                        {proj.technologies.map((tech, i) => (
                                            <span key={i} className="text-[9px] bg-white border border-slate-200 text-slate-500 px-2 py-0.5 rounded italic">
                                                {tech}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )) : <p className="text-slate-400 italic text-sm text-center">No projects listed</p>}
                    </div>
                </div>

                {data.technicalWriting && data.technicalWriting.length > 0 && (
                    <div className="mb-10">
                        <h2 className={`text-lg font-bold uppercase tracking-widest ${theme.primary} mb-6 flex items-center gap-2`}>
                            <span className={`w-8 h-1 ${theme.accent} inline-block rounded-full`}></span> Technical Writing
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {data.technicalWriting.map((item) => (
                                <div key={item.id} className="p-4 border rounded-xl bg-slate-50/30 hover:bg-slate-50 transition-all group">
                                    <h3 className="font-bold text-slate-800 mb-1 group-hover:text-primary transition-colors">{item.title}</h3>
                                    <div className="flex justify-between items-center text-xs">
                                        <span className="font-semibold text-slate-500">{item.platform}</span>
                                        <span className="text-[9px] text-primary italic truncate max-w-[100px]">{item.link}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                    <div>
                        <h2 className={`text-md font-bold uppercase tracking-widest ${theme.primary} mb-6 flex items-center gap-2`}>
                            <span className={`w-4 h-1 ${theme.accent} inline-block rounded-full`}></span> Volunteering
                        </h2>
                        <div className="space-y-4">
                            {data.volunteering && data.volunteering.length > 0 ? data.volunteering.map((vol) => (
                                <div key={vol.id} className="text-sm">
                                    <p className="font-bold">{vol.organization}</p>
                                    <p className="text-xs italic text-slate-500">{vol.role}</p>
                                    <p className="text-[10px] font-mono opacity-60">{vol.startDate} - {vol.endDate}</p>
                                </div>
                            )) : <p className="text-slate-400 italic text-xs">None listed</p>}
                        </div>
                    </div>
                    <div>
                        <h2 className={`text-md font-bold uppercase tracking-widest ${theme.primary} mb-6 flex items-center gap-2`}>
                            <span className={`w-4 h-1 ${theme.accent} inline-block rounded-full`}></span> Awards
                        </h2>
                        <div className="space-y-4">
                            {data.awards && data.awards.length > 0 ? data.awards.map((award) => (
                                <div key={award.id} className="text-sm">
                                    <p className="font-bold">{award.name}</p>
                                    <p className="text-xs text-slate-500">{award.organization} ({award.year})</p>
                                </div>
                            )) : <p className="text-slate-400 italic text-xs">None listed</p>}
                        </div>
                    </div>
                </div>

                <div className="pt-10 border-t border-slate-100">
                    <h2 className={`text-lg font-bold uppercase tracking-widest ${theme.primary} mb-6 text-center`}>
                        References
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {data.referees && data.referees.length > 0 ? data.referees.map((ref) => (
                            <div key={ref.id} className="text-sm border border-slate-100 p-3 rounded-md">
                                {ref.availableOnRequest ? (
                                    <p className="font-bold italic text-slate-400 text-center py-2">Available on request</p>
                                ) : (
                                    <>
                                        <p className="font-bold">{ref.name}</p>
                                        <p className="text-xs text-slate-500">{ref.title} at {ref.organization}</p>
                                        <div className="mt-2 text-[10px] space-x-2 text-primary font-medium">
                                            <span>{ref.email}</span>
                                            <span>{ref.phone}</span>
                                        </div>
                                    </>
                                )}
                            </div>
                        )) : <p className="text-slate-400 italic text-sm text-center col-span-2">No referees listed</p>}
                    </div>
                </div>
            </div>
        </div>
    )
}
