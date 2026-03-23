import { CVLayoutProps } from "./types"
import { getCvLocation } from "@/lib/cv-location"

export function TealSidebarLayout({ cvData, theme, isEditing, editedData, onEdit }: CVLayoutProps) {
    const data = isEditing && editedData ? editedData : cvData
    const location = getCvLocation(data.personalInfo)

    return (
        <div className="flex min-h-[1100px]">
            {/* Left Sidebar - Dark Teal */}
            <div className="w-[38%] bg-teal-900 text-white p-0">
                {/* Profile Photo Area */}
                <div className="flex justify-center py-10 bg-teal-800">
                    {data.personalInfo.profilePhoto ? (
                        <img
                            src={data.personalInfo.profilePhoto}
                            alt={data.personalInfo.fullName}
                            className="w-40 h-40 rounded-full object-cover border-4 border-teal-600 shadow-xl"
                        />
                    ) : (
                        <div className="w-40 h-40 rounded-full bg-teal-700 border-4 border-teal-600 flex items-center justify-center shadow-xl">
                            <span className="text-5xl font-bold text-teal-300">{data.personalInfo.fullName?.charAt(0) || "?"}</span>
                        </div>
                    )}
                </div>

                <div className="p-8 space-y-8">
                    {/* Contact */}
                    <div>
                        <h3 className="text-teal-300 font-bold uppercase tracking-widest text-sm mb-4 border-b border-teal-700 pb-2">Contact</h3>
                        <div className="space-y-3 text-sm text-teal-100">
                            {data.personalInfo.phone && (
                                <div className="flex items-center gap-3">
                                    <span className="size-6 bg-teal-700 rounded-full flex items-center justify-center text-[10px]">📞</span>
                                    <span>{data.personalInfo.phone}</span>
                                </div>
                            )}
                            {data.personalInfo.email && (
                                <div className="flex items-center gap-3">
                                    <span className="size-6 bg-teal-700 rounded-full flex items-center justify-center text-[10px]">✉️</span>
                                    <span className="break-all text-xs">{data.personalInfo.email}</span>
                                </div>
                            )}
                            {data.personalInfo.linkedin && (
                                <div className="flex items-center gap-3">
                                    <span className="size-6 bg-teal-700 rounded-full flex items-center justify-center text-[10px]">🌐</span>
                                    <span className="truncate text-xs">{data.personalInfo.linkedin}</span>
                                </div>
                            )}
                            {location && (
                                <div className="flex items-center gap-3">
                                    <span className="size-6 bg-teal-700 rounded-full flex items-center justify-center text-[10px]">📍</span>
                                    <span>{location}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Education */}
                    <div>
                        <h3 className="text-teal-300 font-bold uppercase tracking-widest text-sm mb-4 border-b border-teal-700 pb-2">Education</h3>
                        <div className="space-y-4">
                            {data.education && data.education.length > 0 ? data.education.map((edu) => (
                                <div key={edu.id} className="text-sm">
                                    <p className="font-bold text-white">{edu.institution}</p>
                                    <p className="text-teal-200">{edu.degree} {edu.fieldOfStudy && `in ${edu.fieldOfStudy}`}</p>
                                    <p className="text-teal-400 text-xs mt-1">{edu.startDate} - {edu.endDate}</p>
                                </div>
                            )) : <p className="text-teal-500 text-xs italic">No education listed</p>}
                        </div>
                    </div>

                    {/* Awards */}
                    {data.awards && data.awards.length > 0 && (
                        <div>
                            <h3 className="text-teal-300 font-bold uppercase tracking-widest text-sm mb-4 border-b border-teal-700 pb-2">Award</h3>
                            {data.awards.map((award) => (
                                <div key={award.id} className="text-sm mb-2">
                                    <p className="font-bold text-white">{award.name}</p>
                                    <p className="text-teal-300 text-xs">{award.organization} | {award.year}</p>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Languages */}
                    {data.languages && data.languages.length > 0 && (
                        <div>
                            <h3 className="text-teal-300 font-bold uppercase tracking-widest text-sm mb-4 border-b border-teal-700 pb-2">Languages</h3>
                            <div className="space-y-2">
                                {data.languages.map((lang, i) => (
                                    <div key={i} className="flex justify-between text-sm">
                                        <span className="text-teal-100">{lang.language}</span>
                                        <span className="text-teal-400 text-xs italic">{lang.proficiency}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Right Content */}
            <div className="w-[62%] bg-white p-10">
                {/* Name & Title */}
                <div className="mb-8 border-b border-gray-200 pb-6">
                    <h1 className="text-3xl font-extrabold text-teal-900 tracking-tight">{data.personalInfo.fullName || "Your Name"}</h1>
                    <p className="text-teal-600 font-medium text-lg mt-1">{data.experience?.[0]?.position || "Professional Title"}</p>
                </div>

                {/* Summary */}
                <div className="mb-8">
                    <p className="text-gray-600 leading-relaxed text-sm italic">{data.personalInfo.summary || "Summary not provided"}</p>
                </div>

                {/* Work Experience */}
                <div className="mb-8">
                    <h2 className="text-xl font-extrabold text-teal-900 uppercase tracking-wider mb-6 border-b-2 border-teal-200 pb-2">Work Experience</h2>
                    <div className="space-y-6">
                        {data.experience && data.experience.length > 0 ? data.experience.map((exp) => (
                            <div key={exp.id}>
                                <div className="flex justify-between items-baseline mb-1">
                                    <h3 className="font-bold text-gray-900">{exp.company} ({exp.startDate} - {exp.current ? "Present" : exp.endDate})</h3>
                                </div>
                                <p className="text-teal-700 font-medium text-sm mb-2">{exp.position}</p>
                                {exp.description && (
                                    <div className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">{exp.description}</div>
                                )}
                            </div>
                        )) : <p className="text-gray-400 italic text-sm">No experience listed</p>}
                    </div>
                </div>

                {/* Skills */}
                <div className="mb-8">
                    <h2 className="text-xl font-extrabold text-teal-900 uppercase tracking-wider mb-4 border-b-2 border-teal-200 pb-2">Skills</h2>
                    <div className="space-y-3">
                        {data.skills && data.skills.length > 0 ? data.skills.map((skill, i) => (
                            <div key={i} className="flex items-center gap-3">
                                <span className="text-sm text-gray-700 w-40">{skill}</span>
                                <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-teal-700 rounded-full" style={{ width: `${65 + Math.random() * 35}%` }} />
                                </div>
                            </div>
                        )) : <p className="text-gray-400 italic text-sm">No skills listed</p>}
                    </div>
                </div>

                {/* References */}
                {data.referees && data.referees.length > 0 && (
                    <div>
                        <h2 className="text-xl font-extrabold text-teal-900 uppercase tracking-wider mb-4 border-b-2 border-teal-200 pb-2">References</h2>
                        <div className="grid grid-cols-2 gap-4">
                            {data.referees.map((ref) => (
                                <div key={ref.id} className="text-sm">
                                    {ref.availableOnRequest ? (
                                        <p className="text-gray-500 italic">Available on request</p>
                                    ) : (
                                        <>
                                            <p className="font-bold text-gray-900">{ref.name}</p>
                                            <p className="text-gray-600">{ref.title}</p>
                                            {ref.phone && <p className="text-teal-700 text-xs">{ref.phone}</p>}
                                            {ref.email && <p className="text-teal-700 text-xs">{ref.email}</p>}
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
