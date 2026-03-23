import { CVLayoutProps } from "./types"
import { getCvLocation } from "@/lib/cv-location"

export function BoldRedLayout({ cvData, theme, isEditing, editedData, onEdit }: CVLayoutProps) {
    const data = isEditing && editedData ? editedData : cvData
    const location = getCvLocation(data.personalInfo)

    return (
        <div className="min-h-[1100px] relative bg-white overflow-hidden">
            {/* Red/Black Header */}
            <div className="relative bg-gradient-to-r from-red-700 to-red-600 text-white p-10 pb-16">
                <div className="absolute top-0 right-0 w-48 h-48">
                    <div className="w-full h-full bg-red-900/40 clip-hexagon flex items-center justify-center">
                        {data.personalInfo.profilePhoto ? (
                            <img src={data.personalInfo.profilePhoto} alt={data.personalInfo.fullName} className="w-36 h-36 object-cover clip-hexagon" />
                        ) : (
                            <span className="text-5xl font-bold text-white/60">{data.personalInfo.fullName?.charAt(0) || "?"}</span>
                        )}
                    </div>
                </div>
                <h1 className="text-4xl font-extrabold uppercase tracking-wider pr-52">{data.personalInfo.fullName || "Your Name"}</h1>
                <p className="text-red-100 mt-2 text-lg tracking-wide">{data.experience?.[0]?.position || "Professional Title"}</p>
            </div>

            {/* Curved dark section */}
            <div className="absolute left-0 w-[38%] top-[160px] bottom-0 bg-gray-900 text-white" style={{ borderTopRightRadius: '60px' }}>
                <div className="p-8 pt-12 space-y-8">
                    {/* Contact */}
                    <div>
                        <h3 className="text-red-500 font-bold uppercase tracking-widest text-sm mb-4 flex items-center gap-2">
                            <span className="size-6 bg-red-600 rounded-full flex items-center justify-center text-[10px]">📞</span>
                            Contact
                        </h3>
                        <div className="space-y-2 text-sm text-gray-300">
                            {data.personalInfo.phone && <p>{data.personalInfo.phone}</p>}
                            {data.personalInfo.email && <p className="break-all">{data.personalInfo.email}</p>}
                            {data.personalInfo.linkedin && <p className="truncate">{data.personalInfo.linkedin}</p>}
                            {location && <p>{location}</p>}
                        </div>
                    </div>

                    {/* Reference */}
                    {data.referees && data.referees.length > 0 && (
                        <div>
                            <h3 className="text-red-500 font-bold uppercase tracking-widest text-sm mb-4 flex items-center gap-2">
                                <span className="size-6 bg-red-600 rounded-full flex items-center justify-center text-[10px]">👤</span>
                                Reference
                            </h3>
                            {data.referees.map((ref) => (
                                <div key={ref.id} className="text-sm text-gray-300 mb-3">
                                    {ref.availableOnRequest ? (
                                        <p className="italic">Available on request</p>
                                    ) : (
                                        <>
                                            <p className="font-bold text-red-400">{ref.name}</p>
                                            <p>{ref.title}</p>
                                            {ref.phone && <p>{ref.phone}</p>}
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Skills */}
                    <div>
                        <h3 className="text-red-500 font-bold uppercase tracking-widest text-sm mb-4 flex items-center gap-2">
                            <span className="size-6 bg-red-600 rounded-full flex items-center justify-center text-[10px]">⚙️</span>
                            Skills
                        </h3>
                        <div className="space-y-2">
                            {data.skills && data.skills.length > 0 ? data.skills.map((skill, i) => (
                                <div key={i} className="flex items-center gap-2">
                                    <span className="text-sm text-gray-300">{skill}</span>
                                    <div className="flex-1 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                                        <div className="h-full bg-red-500 rounded-full" style={{ width: `${70 + Math.random() * 30}%` }} />
                                    </div>
                                </div>
                            )) : <p className="text-gray-500 text-xs italic">No skills listed</p>}
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Content */}
            <div className="ml-[40%] p-8 pt-6 space-y-8">
                {/* About Me */}
                <div>
                    <h2 className="text-2xl font-extrabold text-gray-900 uppercase tracking-wide mb-3 flex items-center gap-2">
                        <span className="size-7 bg-red-600 rounded-full flex items-center justify-center text-white text-xs">💡</span>
                        About Me
                    </h2>
                    <p className="text-gray-600 leading-relaxed text-sm">{data.personalInfo.summary || "Summary not provided"}</p>
                </div>

                {/* Education */}
                <div>
                    <h2 className="text-2xl font-extrabold text-gray-900 uppercase tracking-wide mb-4">Education</h2>
                    {data.education && data.education.length > 0 ? data.education.map((edu) => (
                        <div key={edu.id} className="mb-4 border-b border-gray-100 pb-3">
                            <div className="flex justify-between items-baseline">
                                <h3 className="font-bold text-red-700">{edu.degree}</h3>
                                <span className="text-sm font-bold text-gray-500">{edu.startDate} - {edu.endDate}</span>
                            </div>
                            <p className="text-red-500 text-sm font-medium">{edu.institution}</p>
                        </div>
                    )) : <p className="text-gray-400 italic text-sm">No education listed</p>}
                </div>

                {/* Experience */}
                <div>
                    <h2 className="text-2xl font-extrabold text-gray-900 uppercase tracking-wide mb-4">Experience</h2>
                    {data.experience && data.experience.length > 0 ? data.experience.map((exp) => (
                        <div key={exp.id} className="mb-5 border-b border-gray-100 pb-4">
                            <div className="flex justify-between items-baseline">
                                <h3 className="font-bold text-red-700">{exp.company}</h3>
                                <span className="text-sm font-bold text-gray-500">{exp.startDate} - {exp.current ? "Present" : exp.endDate}</span>
                            </div>
                            <p className="text-red-500 text-sm font-medium mb-1">{exp.position}</p>
                            {exp.description && <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">{exp.description}</p>}
                        </div>
                    )) : <p className="text-gray-400 italic text-sm">No experience listed</p>}
                </div>
            </div>

            <style jsx>{`
                .clip-hexagon { clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%); }
            `}</style>
        </div>
    )
}
