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
                    <span>{data.personalInfo.email || "Email: Not provided"}</span>
                    <span>{data.personalInfo.phone ? `+232 ${data.personalInfo.phone}` : "Phone: Not provided"}</span>
                    <span>{data.personalInfo.location || "Location: Not provided"}</span>
                    {data.personalInfo.addressCity && <span>{data.personalInfo.addressCity}, {data.personalInfo.addressCountry}</span>}
                    {data.personalInfo.linkedin && <span className="text-primary underline">{data.personalInfo.linkedin}</span>}
                    {data.personalInfo.portfolio && <span className="text-primary underline">{data.personalInfo.portfolio}</span>}
                    {data.availability && <span className="text-primary font-bold uppercase text-[10px] tracking-tighter border border-primary/20 px-2 rounded">Available: {data.availability}</span>}
                </div>
            </div>

            <div className="mb-10">
                <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-4 border-b border-slate-100 pb-2">
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
                    <p className="text-slate-700 leading-relaxed italic text-center text-lg px-8">
                        {data.personalInfo.summary ? `"${data.personalInfo.summary}"` : "Summary not provided"}
                    </p>
                )}
            </div>

            <div className="mb-10">
                <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-6 border-b border-slate-100 pb-2">
                    Work Experience
                </h2>
                <div className="space-y-8">
                    {data.experience && data.experience.length > 0 ? data.experience.map((exp) => (
                        <div key={exp.id}>
                            <div className="flex justify-between items-baseline mb-2">
                                <h3 className="text-lg font-bold font-serif">{exp.position}</h3>
                                <span className="text-sm text-slate-500 font-mono">
                                    {exp.startDate} — {exp.current ? "Present" : exp.endDate}
                                </span>
                            </div>
                            <div className="text-slate-600 font-medium mb-2 italic">{exp.company}, {exp.location}</div>
                            {exp.description && (
                                <p className="text-slate-700 leading-7 whitespace-pre-line mb-2">{exp.description}</p>
                            )}
                            {exp.achievements && (
                                <div className="mt-2">
                                    <p className="text-xs font-bold uppercase text-slate-400 mb-1">Key Achievements:</p>
                                    <p className="text-slate-600 text-sm italic">{exp.achievements}</p>
                                </div>
                            )}
                        </div>
                    )) : <p className="text-slate-400 italic text-sm text-center">No experience listed</p>}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-10">
                <div>
                    <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-6 border-b border-slate-100 pb-2">
                        Education
                    </h2>
                    <div className="space-y-6">
                        {data.education && data.education.length > 0 ? data.education.map((edu) => (
                            <div key={edu.id}>
                                <h3 className="font-bold font-serif">{edu.institution}</h3>
                                <p className="text-slate-700">{edu.degree} {edu.fieldOfStudy ? `in ${edu.fieldOfStudy}` : ""}</p>
                                <p className="text-sm text-slate-500 mt-1 font-mono">
                                    {edu.startDate} — {edu.current ? "Present" : edu.endDate}
                                </p>
                            </div>
                        )) : <p className="text-slate-400 italic text-sm">No education listed</p>}
                    </div>
                </div>

                <div>
                    <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-6 border-b border-slate-100 pb-2">
                        Skills
                    </h2>
                    <div className="flex flex-wrap gap-x-6 gap-y-3">
                        {data.skills && data.skills.length > 0 ? data.skills.map((skill, index) => (
                            <span key={index} className="text-slate-700 font-medium flex items-center gap-2">
                                <span className="size-1.5 rounded-full bg-primary/40"></span>
                                {skill}
                            </span>
                        )) : <p className="text-slate-400 italic text-sm">No skills listed</p>}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-10">
                <div>
                    <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-6 border-b border-slate-100 pb-2">
                        Certifications
                    </h2>
                    <div className="space-y-4">
                        {data.certifications && data.certifications.length > 0 ? data.certifications.map((cert) => (
                            <div key={cert.id}>
                                <h3 className="font-bold font-serif text-slate-800">{cert.name}</h3>
                                <p className="text-sm text-slate-600">{cert.organization} • {cert.year}</p>
                            </div>
                        )) : <p className="text-slate-400 italic text-sm">No certifications listed</p>}
                    </div>
                </div>

                <div>
                    <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-6 border-b border-slate-100 pb-2">
                        Languages
                    </h2>
                    <div className="space-y-3">
                        {data.languages && data.languages.length > 0 ? data.languages.map((lang, index) => (
                            <div key={index} className="flex justify-between items-center text-sm">
                                <span className="font-bold">{lang.language}</span>
                                <span className="text-slate-500 italic">{lang.proficiency}</span>
                            </div>
                        )) : <p className="text-slate-400 italic text-sm">No languages listed</p>}
                    </div>
                </div>
            </div>

            <div className="mb-10">
                <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-6 border-b border-slate-100 pb-2">
                    Projects
                </h2>
                <div className="space-y-6">
                    {data.projects && data.projects.length > 0 ? data.projects.map((proj) => (
                        <div key={proj.id}>
                            <div className="flex justify-between items-baseline mb-2">
                                <h3 className="text-lg font-bold font-serif">{proj.name}</h3>
                                {proj.link && <span className="text-sm text-primary font-mono lowercase">{proj.link}</span>}
                            </div>
                            <p className="text-slate-700 leading-7">{proj.description}</p>
                            {proj.outcome && (
                                <p className="text-sm text-slate-500 mt-2 font-medium">Outcome: {proj.outcome}</p>
                            )}
                            {proj.technologies && proj.technologies.length > 0 && (
                                <div className="mt-3 flex flex-wrap gap-2">
                                    {proj.technologies.map((tech, i) => (
                                        <span key={i} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded italic">
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
                    <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-6 border-b border-slate-100 pb-2">
                        Technical Writing
                    </h2>
                    <div className="space-y-4">
                        {data.technicalWriting.map((item) => (
                            <div key={item.id} className="border-l-2 border-slate-100 pl-4 py-1">
                                <h3 className="font-bold text-slate-800">{item.title}</h3>
                                <div className="flex justify-between items-center text-xs text-slate-500 mt-1">
                                    <span>{item.platform}</span>
                                    <span className="font-mono underline">{item.link}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-10">
                <div>
                    <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-6 border-b border-slate-100 pb-2">
                        Volunteering
                    </h2>
                    <div className="space-y-6">
                        {data.volunteering && data.volunteering.length > 0 ? data.volunteering.map((vol) => (
                            <div key={vol.id}>
                                <h3 className="font-bold font-serif text-slate-800">{vol.organization}</h3>
                                <p className="text-slate-700 text-sm font-medium">{vol.role}</p>
                                <p className="text-xs text-slate-500 font-mono italic">{vol.startDate} - {vol.endDate}</p>
                                {vol.description && <p className="text-sm text-slate-600 mt-2 line-clamp-3">{vol.description}</p>}
                            </div>
                        )) : <p className="text-slate-400 italic text-sm">No volunteering listed</p>}
                    </div>
                </div>

                <div>
                    <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-6 border-b border-slate-100 pb-2">
                        Awards & Hobbies
                    </h2>
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <p className="text-[10px] font-bold text-slate-300 uppercase tracking-tighter">Awards:</p>
                            {data.awards && data.awards.length > 0 ? data.awards.map((award) => (
                                <div key={award.id} className="text-sm">
                                    <span className="font-bold text-slate-700">{award.name}</span>
                                    <span className="text-slate-500"> — {award.organization} ({award.year})</span>
                                </div>
                            )) : <p className="text-slate-400 italic text-xs">No awards</p>}
                        </div>
                        <div className="space-y-2">
                            <p className="text-[10px] font-bold text-slate-300 uppercase tracking-tighter">Hobbies:</p>
                            <div className="flex flex-wrap gap-2">
                                {data.hobbies && data.hobbies.length > 0 ? data.hobbies.map((hobby, i) => (
                                    <span key={i} className="text-sm text-slate-600 bg-slate-50 px-2 py-1 rounded border border-slate-100">{hobby}</span>
                                )) : <p className="text-slate-400 italic text-xs">No hobbies</p>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mb-10 pt-10 border-t border-slate-100">
                <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-6 border-b border-slate-100 pb-2">
                    Referees
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {data.referees && data.referees.length > 0 ? data.referees.map((ref) => (
                        <div key={ref.id} className="text-sm">
                            {ref.availableOnRequest ? (
                                <p className="font-bold italic text-slate-700 py-4">Referees available on request</p>
                            ) : (
                                <>
                                    <h3 className="font-bold font-serif text-slate-900 mb-1">{ref.name}</h3>
                                    <p className="text-slate-700">{ref.title}</p>
                                    <p className="text-slate-600">{ref.organization}</p>
                                    <div className="mt-2 space-y-0.5 text-xs text-slate-500">
                                        {ref.phone && <p>Tel: {ref.phone}</p>}
                                        {ref.email && <p>Email: {ref.email}</p>}
                                    </div>
                                </>
                            )}
                        </div>
                    )) : <p className="text-slate-400 italic text-sm text-center col-span-2">No referees listed</p>}
                </div>
            </div>
        </div>
    )
}
