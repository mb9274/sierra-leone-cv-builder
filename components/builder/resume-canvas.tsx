"use client"

import { useMemo } from "react"
import {
    Plus,
    Square,
    Circle,
    Copy,
    Trash2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

interface ResumeCanvasProps {
    data: any
    templateId?: string
    zoomLevel?: number
    selectedElement?: string | null
    onSelectElement?: (id: string | null) => void
}

export function ResumeCanvas({ data, templateId = "minimal", zoomLevel = 100, selectedElement, onSelectElement }: ResumeCanvasProps) {
    const { toast } = useToast()

    const getStyle = (id: string) => {
        const s = data.styles?.[id] || {}

        const styleObj: any = {
            textAlign: s.textAlign,
            fontStyle: s.italic ? 'italic' : 'normal',
            textDecoration: `${s.underline ? 'underline' : ''} ${s.strike ? 'line-through' : ''}`.trim(),
            fontFamily: s.fontFamily,
            lineHeight: s.lineHeight,
            letterSpacing: s.letterSpacing,
            boxShadow: s.shadow ? `0 ${s.shadow}px ${parseInt(s.shadow) * 2}px rgba(0,0,0,0.1)` : undefined,
            filter: s.blur ? `blur(${s.blur}px)` : undefined,
            opacity: s.opacity ? parseInt(s.opacity) / 100 : undefined,
            fontSize: s.fontSize,
            color: s.color,
        }

        if (s.color) styleObj['--cv-color'] = s.color;
        if (s.fontSize) styleObj['--cv-font-size'] = s.fontSize;
        if (s.bold || s.fontWeight) styleObj['--cv-font-weight'] = s.bold ? 'bold' : s.fontWeight;

        return styleObj;
    }

    // Use professional mock data if none provided to show a nice preview initially
    const resumeData = useMemo(() => {
        return {
            personalInfo: {
                fullName: data.personalInfo?.fullName || "David St. Peter",
                jobTitle: data.personalInfo?.jobTitle || "Professional",
                email: data.personalInfo?.email || "yourname@gmail.com",
                phone: data.personalInfo?.phone || "+000 123 456 789",
                location: data.personalInfo?.location || "Your Location",
                summary: data.personalInfo?.summary || "Write a professional summary that highlights your key skills and achievements...",
                profilePhoto: data.personalInfo?.profilePhoto || "/placeholder-user.jpg",
            },
            experience: data.experience || [],
            education: data.education || [],
            skills: data.skills || [],
            links: data.links || [],
            ...data
        }
    }, [data])

    return (
        <main className="flex-1 bg-gray-100 overflow-auto flex flex-col items-center py-4 md:py-12 relative custom-scrollbar">
            {/* Floating Canvas controls */}
            <div
                className="bg-white shadow-2xl transition-all duration-300 origin-top mb-8 md:mb-12"
                style={{
                    width: "min(100%, 95vw)", // Full width on mobile, constrained on desktop
                    maxWidth: "860px",
                    minHeight: "auto",
                    transformOrigin: "top center",
                    transform: `scale(${zoomLevel / 100})`,
                }}
            >
                {/* Professional Resume Layout */}
                <div className="p-6 md:p-12 h-full flex flex-col">
                    <header
                        className={`flex items-start justify-between mb-6 md:mb-12 p-2 rounded transition-all cursor-pointer hover:ring-2 hover:ring-blue-100 ${selectedElement === 'personalInfo' ? 'ring-2 ring-blue-500 bg-blue-50/30' : ''}`}
                        onClick={() => onSelectElement?.('personalInfo')}
                        style={getStyle('personalInfo')}
                    >
                        <div className="flex gap-4 md:gap-8 items-center">
                            <div className="size-16 md:size-24 rounded-full overflow-hidden border-2 border-gray-100 bg-gray-50 flex-shrink-0">
                                <img
                                    src={resumeData.personalInfo.profilePhoto}
                                    alt="Profile"
                                    className="size-full object-cover grayscale"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150';
                                    }}
                                />
                            </div>
                            <div>
                                <h1 className="tracking-tight mb-2 leading-tight"
                                    style={{
                                        fontSize: '3em',
                                        fontWeight: 'var(--cv-font-weight, bold)',
                                        color: 'var(--cv-color, #111827)'
                                    }}>
                                    {resumeData.personalInfo.fullName}
                                </h1>
                                <p className="opacity-80"
                                    style={{
                                        fontSize: '1.25em',
                                        fontWeight: 'var(--cv-font-weight, 500)',
                                        color: 'var(--cv-color, #6b7280)'
                                    }}>
                                    {resumeData.personalInfo.jobTitle}
                                    {resumeData.personalInfo.location ? ` | ${resumeData.personalInfo.location}` : ''}
                                </p>
                            </div>
                        </div>
                    </header>

                    <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-8 md:gap-16 flex-1">
                        {/* Left Column */}
                        <div className="space-y-12">
                            <section
                                className={`space-y-4 p-2 rounded transition-all cursor-pointer hover:ring-2 hover:ring-blue-100 ${selectedElement === 'education' ? 'ring-2 ring-blue-500 bg-blue-50/30' : ''}`}
                                onClick={() => onSelectElement?.('education')}
                                style={getStyle('education')}
                            >
                                <h2 className="uppercase tracking-widest border-b-2 pb-1 inline-block mb-4"
                                    style={{ fontSize: '0.875em', fontWeight: 'var(--cv-font-weight, bold)', color: 'var(--cv-color, #000000)', borderColor: 'var(--cv-color, #000000)' }}>
                                    Education
                                </h2>
                                {resumeData.education.map((edu: any, i: number) => (
                                    <div key={i} className="space-y-1">
                                        <p className="opacity-70 uppercase" style={{ fontSize: '0.75em', fontWeight: 'var(--cv-font-weight, bold)', color: 'var(--cv-color, #9ca3af)' }}>{edu.startDate} - {edu.endDate}</p>
                                        <p style={{ fontSize: '0.875em', fontWeight: 'var(--cv-font-weight, bold)', color: 'var(--cv-color, #111827)' }}>{edu.degree}</p>
                                        <p className="opacity-80" style={{ fontSize: '0.875em', fontWeight: 'var(--cv-font-weight, normal)', color: 'var(--cv-color, #6b7280)' }}>{edu.institution}</p>
                                    </div>
                                ))}
                            </section>

                            <section
                                className={`space-y-4 p-2 rounded transition-all cursor-pointer hover:ring-2 hover:ring-blue-100 ${selectedElement === 'contact' ? 'ring-2 ring-blue-500 bg-blue-50/30' : ''}`}
                                onClick={() => onSelectElement?.('contact')}
                                style={getStyle('contact')}
                            >
                                <h2 className="uppercase tracking-widest border-b-2 pb-1 inline-block mb-4"
                                    style={{ fontSize: '0.875em', fontWeight: 'var(--cv-font-weight, bold)', color: 'var(--cv-color, #000000)', borderColor: 'var(--cv-color, #000000)' }}>
                                    Contact
                                </h2>
                                <div className="space-y-4">
                                    <div className="space-y-1">
                                        <p className="opacity-70 uppercase" style={{ fontSize: '0.75em', fontWeight: 'var(--cv-font-weight, bold)', color: 'var(--cv-color, #9ca3af)' }}>Phone</p>
                                        <p style={{ fontSize: '0.875em', fontWeight: 'var(--cv-font-weight, bold)', color: 'var(--cv-color, #111827)' }}>{resumeData.personalInfo.phone}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="opacity-70 uppercase" style={{ fontSize: '0.75em', fontWeight: 'var(--cv-font-weight, bold)', color: 'var(--cv-color, #9ca3af)' }}>Email</p>
                                        <p className="truncate" style={{ fontSize: '0.875em', fontWeight: 'var(--cv-font-weight, bold)', color: 'var(--cv-color, #111827)' }}>{resumeData.personalInfo.email}</p>
                                    </div>
                                    {(resumeData.personalInfo.linkedin || resumeData.personalInfo.portfolio || (resumeData.links && resumeData.links.length > 0)) && (
                                        <div className={`space-y-4 p-2 -mx-2 rounded transition-all cursor-pointer hover:ring-2 hover:ring-blue-100 ${selectedElement === 'links' ? 'ring-2 ring-blue-500 bg-blue-50/30' : ''}`}
                                            onClick={(e) => { e.stopPropagation(); onSelectElement?.('links') }}
                                            style={getStyle('links')}>
                                            {resumeData.personalInfo.linkedin && (
                                                <div className="space-y-1">
                                                    <p className="opacity-70 uppercase" style={{ fontSize: '0.75em', fontWeight: 'var(--cv-font-weight, bold)', color: 'var(--cv-color, #9ca3af)' }}>LinkedIn</p>
                                                    <p className="truncate" style={{ fontSize: '0.875em', fontWeight: 'var(--cv-font-weight, bold)', color: 'var(--cv-color, #111827)' }}>{resumeData.personalInfo.linkedin}</p>
                                                </div>
                                            )}
                                            {resumeData.personalInfo.portfolio && (
                                                <div className="space-y-1">
                                                    <p className="opacity-70 uppercase" style={{ fontSize: '0.75em', fontWeight: 'var(--cv-font-weight, bold)', color: 'var(--cv-color, #9ca3af)' }}>Portfolio</p>
                                                    <p className="truncate" style={{ fontSize: '0.875em', fontWeight: 'var(--cv-font-weight, bold)', color: 'var(--cv-color, #111827)' }}>{resumeData.personalInfo.portfolio}</p>
                                                </div>
                                            )}
                                            {resumeData.links?.map((link: any, i: number) => (
                                                <div key={i} className="space-y-1">
                                                    <p className="opacity-70 uppercase" style={{ fontSize: '0.75em', fontWeight: 'var(--cv-font-weight, bold)', color: 'var(--cv-color, #9ca3af)' }}>{link.label}</p>
                                                    <p className="truncate" style={{ fontSize: '0.875em', fontWeight: 'var(--cv-font-weight, bold)', color: 'var(--cv-color, #111827)' }}>{link.url}</p>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </section>

                            {(resumeData.skills && resumeData.skills.length > 0) && (
                                <section
                                    className={`space-y-4 p-2 rounded transition-all cursor-pointer hover:ring-2 hover:ring-blue-100 ${selectedElement === 'skills' ? 'ring-2 ring-blue-500 bg-blue-50/30' : ''}`}
                                    onClick={() => onSelectElement?.('skills')}
                                    style={getStyle('skills')}
                                >
                                    <h2 className="uppercase tracking-widest border-b-2 pb-1 inline-block mb-4"
                                        style={{ fontSize: '0.875em', fontWeight: 'var(--cv-font-weight, bold)', color: 'var(--cv-color, #000000)', borderColor: 'var(--cv-color, #000000)' }}>
                                        Skills
                                    </h2>
                                    <div className="space-y-2">
                                        {resumeData.skills.map((skill: string, i: number) => (
                                            <p key={i} style={{ fontSize: '0.875em', fontWeight: 'var(--cv-font-weight, bold)', color: 'var(--cv-color, #111827)' }}>
                                                {skill}
                                            </p>
                                        ))}
                                    </div>
                                </section>
                            )}
                        </div>

                        {/* Right Column */}
                        <div className="space-y-12">
                            <section
                                className={`space-y-4 p-2 rounded transition-all cursor-pointer hover:ring-2 hover:ring-blue-100 ${selectedElement === 'summary' ? 'ring-2 ring-blue-500 bg-blue-50/30' : ''}`}
                                onClick={() => onSelectElement?.('summary')}
                                style={getStyle('summary')}
                            >
                                <h2 className="uppercase tracking-widest border-b-2 pb-1 inline-block mb-4"
                                    style={{ fontSize: '0.875em', fontWeight: 'var(--cv-font-weight, bold)', color: 'var(--cv-color, #000000)', borderColor: 'var(--cv-color, #000000)' }}>
                                    Profile
                                </h2>
                                <p className="leading-relaxed opacity-90" style={{ fontSize: '0.875em', fontWeight: 'var(--cv-font-weight, 500)', color: 'var(--cv-color, #4b5563)' }}>
                                    {resumeData.personalInfo.summary}
                                </p>
                            </section>

                            <section
                                className={`space-y-6 p-2 rounded transition-all cursor-pointer hover:ring-2 hover:ring-blue-100 ${selectedElement === 'experience' ? 'ring-2 ring-blue-500 bg-blue-50/30' : ''}`}
                                onClick={() => onSelectElement?.('experience')}
                                style={getStyle('experience')}
                            >
                                <h2 className="uppercase tracking-widest border-b-2 pb-1 inline-block mb-4"
                                    style={{ fontSize: '0.875em', fontWeight: 'var(--cv-font-weight, bold)', color: 'var(--cv-color, #000000)', borderColor: 'var(--cv-color, #000000)' }}>
                                    Experience
                                </h2>
                                {resumeData.experience.map((exp: any, i: number) => (
                                    <div key={i} className="grid grid-cols-[80px_1fr] gap-8">
                                        <p className="opacity-70 uppercase" style={{ fontSize: '0.75em', fontWeight: 'var(--cv-font-weight, bold)', color: 'var(--cv-color, #9ca3af)' }}>{exp.startDate} - {exp.endDate}</p>
                                        <div className="space-y-2">
                                            <p style={{ fontSize: '0.875em', fontWeight: 'var(--cv-font-weight, bold)', color: 'var(--cv-color, #111827)' }}>{exp.position}</p>
                                            <p className="uppercase tracking-wider opacity-60" style={{ fontSize: '0.6875em', fontWeight: 'var(--cv-font-weight, bold)', color: 'var(--cv-color, #9ca3af)' }}>{exp.company}</p>
                                            <p className="leading-relaxed opacity-90" style={{ fontSize: '0.875em', fontWeight: 'var(--cv-font-weight, 500)', color: 'var(--cv-color, #6b7280)' }}>
                                                {exp.description}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </section>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #ccc;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #bbb;
        }
      `}</style>
        </main >
    )
}
