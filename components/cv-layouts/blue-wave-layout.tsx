import { CVLayoutProps } from "./types"
import { getCvLocation } from "@/lib/cv-location"

export function BlueWaveLayout({ cvData, theme, isEditing, editedData, onEdit }: CVLayoutProps) {
    const data = isEditing && editedData ? editedData : cvData
    const location = getCvLocation(data)

    return (
        <div className="min-h-[1100px] relative bg-white overflow-hidden">
            {/* Blue wave top decoration */}
            <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-r from-blue-600 to-cyan-500 opacity-10" style={{ clipPath: 'ellipse(120% 100% at 50% 0%)' }} />
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-r from-blue-600 to-cyan-500 opacity-10" style={{ clipPath: 'ellipse(120% 100% at 50% 100%)' }} />

            <div className="flex relative z-10">
                {/* Left sidebar */}
                <div className="w-[38%] p-0">
                    {/* Profile photo with wave frame */}
                    <div className="flex justify-center pt-10 pb-6">
                        <div className="relative">
                            <div className="w-40 h-40 rounded-full border-4 border-blue-500 overflow-hidden shadow-xl bg-gray-100">
                                {data.personalInfo.profilePhoto ? (
                                    <img src={data.personalInfo.profilePhoto} alt={data.personalInfo.fullName} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-blue-50">
                                        <span className="text-5xl font-bold text-blue-300">{data.personalInfo.fullName?.charAt(0) || "?"}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="px-8 space-y-7">
                        {/* Contact */}
                        <div>
                            <h3 className="text-blue-700 font-extrabold uppercase tracking-widest text-sm mb-3 border-b-2 border-blue-200 pb-1">Contact</h3>
                            <div className="space-y-2 text-sm text-gray-600">
                                {data.personalInfo.phone && (
                                    <div className="flex items-center gap-2">
                                        <span className="size-5 bg-blue-100 rounded-full flex items-center justify-center text-[9px]">📞</span>
                                        <span>{data.personalInfo.phone}</span>
                                    </div>
                                )}
                                {data.personalInfo.email && (
                                    <div className="flex items-center gap-2">
                                        <span className="size-5 bg-blue-100 rounded-full flex items-center justify-center text-[9px]">✉️</span>
                                        <span className="break-all text-xs">{data.personalInfo.email}</span>
                                    </div>
                                )}
                                {data.personalInfo.linkedin && (
                                    <div className="flex items-center gap-2">
                                        <span className="size-5 bg-blue-100 rounded-full flex items-center justify-center text-[9px]">🌐</span>
                                        <span className="truncate text-xs">{data.personalInfo.linkedin}</span>
                                    </div>
                                )}
                                {location && (
                                    <div className="flex items-center gap-2">
                                        <span className="size-5 bg-blue-100 rounded-full flex items-center justify-center text-[9px]">📍</span>
                                        <span>{location}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Education */}
                        <div>
                            <h3 className="text-blue-700 font-extrabold uppercase tracking-widest text-sm mb-3 border-b-2 border-blue-200 pb-1">Education</h3>
                            <div className="space-y-4">
                                {data.education && data.education.length > 0 ? data.education.map((edu) => (
                                    <div key={edu.id}>
                                        <p className="font-bold text-gray-800 text-sm">{edu.degree}</p>
                                        <p className="text-blue-600 text-xs font-medium">{edu.institution}</p>
                                        <p className="text-gray-400 text-xs mt-0.5">{edu.startDate} - {edu.endDate}</p>
                                    </div>
                                )) : <p className="text-gray-400 italic text-xs">No education listed</p>}
                            </div>
                        </div>

                        {/* Expertise/Skills */}
                        <div>
                            <h3 className="text-blue-700 font-extrabold uppercase tracking-widest text-sm mb-3 border-b-2 border-blue-200 pb-1">Expertise</h3>
                            <div className="space-y-1.5">
                                {data.skills && data.skills.length > 0 ? data.skills.map((skill, i) => (
                                    <p key={i} className="text-sm text-gray-600">{skill}</p>
                                )) : <p className="text-gray-400 italic text-xs">No skills listed</p>}
                            </div>
                        </div>

                        {/* Languages */}
                        {data.languages && data.languages.length > 0 && (
                            <div>
                                <h3 className="text-blue-700 font-extrabold uppercase tracking-widest text-sm mb-3 border-b-2 border-blue-200 pb-1">Language</h3>
                                <div className="space-y-1.5">
                                    {data.languages.map((lang, i) => (
                                        <div key={i} className="flex justify-between text-sm">
                                            <span className="text-gray-700">{lang.language}</span>
                                            <span className="text-gray-400 text-xs italic">{lang.proficiency}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Content */}
                <div className="w-[62%] p-10 pt-12">
                    {/* Name & Title */}
                    <div className="mb-6">
                        <h1 className="text-3xl font-extrabold text-blue-800 uppercase tracking-tight">{data.personalInfo.fullName || "Your Name"}</h1>
                        <p className="text-blue-500 font-semibold text-sm uppercase tracking-widest mt-1">{data.experience?.[0]?.position || "Professional Title"}</p>
                    </div>

                    {/* Profile/Summary */}
                    <div className="mb-8">
                        <h2 className="text-lg font-extrabold text-blue-800 uppercase tracking-wider mb-3 border-b-2 border-blue-200 pb-1">Profile</h2>
                        <p className="text-gray-600 leading-relaxed text-sm italic">{data.personalInfo.summary || "Summary not provided"}</p>
                    </div>

                    {/* Work Experience */}
                    <div className="mb-8">
                        <h2 className="text-lg font-extrabold text-blue-800 uppercase tracking-wider mb-4 border-b-2 border-blue-200 pb-1">Work Experience</h2>
                        <div className="space-y-6">
                            {data.experience && data.experience.length > 0 ? data.experience.map((exp) => (
                                <div key={exp.id}>
                                    <h3 className="font-bold text-gray-900">{exp.company}</h3>
                                    <p className="text-blue-600 text-sm font-medium">{exp.position}</p>
                                    <p className="text-gray-400 text-xs mb-1">{exp.startDate} - {exp.current ? "Present" : exp.endDate}</p>
                                    {exp.description && (
                                        <div className="text-gray-600 text-sm leading-relaxed whitespace-pre-line mt-1">{exp.description}</div>
                                    )}
                                </div>
                            )) : <p className="text-gray-400 italic text-sm">No experience listed</p>}
                        </div>
                    </div>

                    {/* References */}
                    <div>
                        <h2 className="text-lg font-extrabold text-blue-800 uppercase tracking-wider mb-4 border-b-2 border-blue-200 pb-1">References</h2>
                        <div className="grid grid-cols-1 gap-4">
                            {data.referees && data.referees.length > 0 ? data.referees.map((ref) => (
                                <div key={ref.id} className="text-sm">
                                    {ref.availableOnRequest ? (
                                        <p className="text-gray-500 italic">Available on request</p>
                                    ) : (
                                        <>
                                            <p className="font-bold text-gray-900">{ref.name}</p>
                                            <p className="text-gray-500">{ref.organization} / {ref.title}</p>
                                            <div className="flex gap-4 text-xs text-blue-600 mt-1">
                                                {ref.phone && <span>Phone: {ref.phone}</span>}
                                                {ref.email && <span>Email: {ref.email}</span>}
                                            </div>
                                        </>
                                    )}
                                </div>
                            )) : <p className="text-gray-400 italic text-sm">No referees listed</p>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
