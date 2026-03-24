"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
    Plus,
    ChevronDown,
    ChevronUp,
    LayoutGrid,
    Type,
    User,
    History,
    GraduationCap,
    Globe,
    Award,
    Link as LinkIcon,
    Bold,
    Italic,
    Underline,
    AlignLeft,
    AlignCenter,
    AlignRight,
    List,
    Link2,
    Trash2,
    Upload,
    MapPin,
    X
} from "lucide-react"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface FormSidebarProps {
    data: any
    onChange: (path: string, value: any) => void
    selectedElement?: string | null
    onSelectElement?: (id: string | null) => void
    onClose?: () => void
}

export function FormSidebar({ data, onChange, selectedElement, onSelectElement, onClose }: FormSidebarProps) {
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => {
                onChange("personalInfo.profilePhoto", reader.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    return (
        <aside className="w-[350px] max-w-[90vw] border-r bg-white flex flex-col h-[calc(100vh-64px)] overflow-hidden relative">
            {onClose && <Button variant="ghost" size="icon" className="absolute top-2 right-2 z-10 lg:hidden" onClick={onClose}><X className="size-4"/></Button>}
            <Tabs defaultValue="create" className="w-full flex flex-col flex-1 overflow-hidden">
                {/* Sidebar Header */}
                <div className="p-3 md:p-4 border-b">
                    <TabsList className="grid w-full grid-cols-2 bg-gray-100/50 p-1 h-10 md:h-10">
                        <TabsTrigger value="create" className="text-xs md:text-sm rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm">
                            Create
                        </TabsTrigger>
                        <TabsTrigger value="templates" className="text-xs md:text-sm rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm">
                            Templates
                        </TabsTrigger>
                    </TabsList>
                </div>

                <TabsContent value="create" className="mt-0 flex-1 overflow-hidden">
                    <div className="h-full overflow-y-auto custom-scrollbar">
                        <Accordion
                            type="single"
                            collapsible
                            value={selectedElement || ""}
                            onValueChange={(value) => onSelectElement?.(value || null)}
                            className="px-3 md:px-4"
                        >

                            {/* Personal Information */}
                            <AccordionItem
                                value="personalInfo"
                                className="border-b-0 py-2 scroll-mt-4"
                                ref={(el) => {
                                    if (selectedElement === "personalInfo" && el) {
                                        el.scrollIntoView({ block: "start", behavior: "smooth" })
                                    }
                                }}
                            >
                                <AccordionTrigger className="hover:no-underline py-3 group px-2 md:px-3">
                                    <div className="flex items-center gap-3 text-sm font-semibold">
                                        <div className="p-1 rounded bg-gray-50 text-gray-400 group-data-[state=open]:text-blue-600 group-data-[state=open]:bg-blue-50">
                                            <User className="size-4" />
                                        </div>
                                        Personal Information
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="space-y-4 pt-1 px-2 md:px-3">
                                    <div className="grid gap-4" onClick={() => onSelectElement?.('personalInfo')}>
                                        <div className="rounded-3xl border-2 border-blue-300 bg-gradient-to-br from-blue-50 to-white p-5 space-y-4 shadow-md ring-1 ring-blue-100">
                                            <div className="space-y-1">
                                                <div className="flex items-center justify-between gap-3">
                                                <Label htmlFor="location" className="flex items-center gap-2 text-sm uppercase tracking-[0.28em] text-blue-800 font-black">
                                                    <MapPin className="size-4" />
                                                    Location
                                                </Label>
                                                    <span className="rounded-full bg-blue-100 px-3 py-1 text-[10px] font-semibold text-blue-800">
                                                        Required for preview
                                                    </span>
                                                </div>
                                                <p className="text-sm text-blue-900/70">
                                                    Type your location here. Example: Freetown, Sierra Leone.
                                                </p>
                                            </div>
                                            <Input
                                                id="location"
                                                placeholder="Type your location here"
                                                value={data.personalInfo?.location || ""}
                                                onChange={(e) => onChange("personalInfo.location", e.target.value)}
                                                className="h-14 rounded-2xl border-blue-300 bg-white px-4 text-lg font-semibold shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                            />
                                            <p className="text-xs font-medium text-blue-800/80">
                                                City and Country are optional if you already typed the location above.
                                            </p>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="grid gap-2">
                                                    <Label htmlFor="addressCity" className="text-[10px] uppercase tracking-wider text-gray-500 font-bold">City</Label>
                                                    <Input
                                                        id="addressCity"
                                                        placeholder="Freetown"
                                                        value={data.personalInfo?.addressCity || ""}
                                                        onChange={(e) => onChange("personalInfo.addressCity", e.target.value)}
                                                        className="h-10 border-gray-200"
                                                    />
                                                </div>
                                                <div className="grid gap-2">
                                                    <Label htmlFor="addressCountry" className="text-[10px] uppercase tracking-wider text-gray-500 font-bold">Country</Label>
                                                    <Input
                                                        id="addressCountry"
                                                        placeholder="Sierra Leone"
                                                        value={data.personalInfo?.addressCountry || ""}
                                                        onChange={(e) => onChange("personalInfo.addressCountry", e.target.value)}
                                                        className="h-10 border-gray-200"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <details className="rounded-2xl border border-gray-200 bg-white shadow-sm">
                                            <summary className="cursor-pointer list-none px-4 py-3 text-sm font-semibold text-slate-700">
                                                More personal details
                                            </summary>
                                            <div className="space-y-4 border-t px-4 py-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="size-16 rounded-full bg-gray-100 border-2 flex items-center justify-center overflow-hidden shrink-0">
                                                        {data.personalInfo?.profilePhoto && data.personalInfo.profilePhoto !== "/placeholder-user.jpg" ? (
                                                            <img src={data.personalInfo.profilePhoto} alt="Profile" className="size-full object-cover" />
                                                        ) : (
                                                            <User className="size-6 text-gray-400" />
                                                        )}
                                                    </div>
                                                    <div className="flex-1">
                                                        <Label htmlFor="profilePhoto" className="text-[10px] uppercase tracking-wider text-gray-500 font-bold mb-2 block">Profile Photo</Label>
                                                        <div className="flex items-center gap-2">
                                                            <Input
                                                                id="profilePhoto"
                                                                type="file"
                                                                accept="image/*"
                                                                onChange={handleImageUpload}
                                                                className="hidden"
                                                            />
                                                            <Button type="button" variant="outline" size="sm" className="h-8 gap-2 w-full text-xs" onClick={() => document.getElementById("profilePhoto")?.click()}>
                                                                <Upload className="size-3" />
                                                                Upload Image
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="grid gap-2">
                                                    <Label htmlFor="fullName" className="text-[10px] uppercase tracking-wider text-gray-500 font-bold">Full Name</Label>
                                                    <Input
                                                        id="fullName"
                                                        placeholder="e.g. David St. Peter"
                                                        value={data.personalInfo?.fullName || ""}
                                                        onChange={(e) => onChange("personalInfo.fullName", e.target.value)}
                                                        className="h-11 md:h-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                                                    />
                                                </div>
                                                <div className="grid gap-2">
                                                    <Label htmlFor="jobTitle" className="text-[10px] uppercase tracking-wider text-gray-500 font-bold">Job Title</Label>
                                                    <Input
                                                        id="jobTitle"
                                                        placeholder="e.g. UX Designer"
                                                        value={data.personalInfo?.jobTitle || ""}
                                                        onChange={(e) => onChange("personalInfo.jobTitle", e.target.value)}
                                                        className="h-10 border-gray-200"
                                                    />
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div className="grid gap-2">
                                                        <Label htmlFor="email" className="text-[10px] uppercase tracking-wider text-gray-500 font-bold">Email</Label>
                                                        <Input
                                                            id="email"
                                                            type="email"
                                                            placeholder="name@email.com"
                                                            value={data.personalInfo?.email || ""}
                                                            onChange={(e) => onChange("personalInfo.email", e.target.value)}
                                                            className="h-10 border-gray-200"
                                                        />
                                                    </div>
                                                    <div className="grid gap-2">
                                                        <Label htmlFor="phone" className="text-[10px] uppercase tracking-wider text-gray-500 font-bold">Phone</Label>
                                                        <Input
                                                            id="phone"
                                                            placeholder="+000 123 456"
                                                            value={data.personalInfo?.phone || ""}
                                                            onChange={(e) => onChange("personalInfo.phone", e.target.value)}
                                                            className="h-10 border-gray-200"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </details>
                                    </div>
                                </AccordionContent>
                            </AccordionItem>

                            {/* Professional Summary */}
                            <AccordionItem value="summary" className="border-b-0 py-2">
                                <AccordionTrigger className="hover:no-underline py-3 group px-2 md:px-3">
                                    <div className="flex items-center gap-3 text-sm font-semibold">
                                        <div className="p-1 rounded bg-gray-50 text-gray-400 group-data-[state=open]:text-blue-600 group-data-[state=open]:bg-blue-50">
                                            <Type className="size-4" />
                                        </div>
                                        Professional Summary
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="space-y-4 pt-1 px-2 md:px-3">
                                    <div className="grid gap-2" onClick={() => onSelectElement?.('summary')}>
                                        <Textarea
                                            placeholder="Write a brief professional summary..."
                                            value={data.personalInfo?.summary || ""}
                                            onChange={(e) => onChange("personalInfo.summary", e.target.value)}
                                            className="min-h-[100px] md:min-h-[120px] resize-none border-gray-200"
                                        />
                                    </div>
                                </AccordionContent>
                            </AccordionItem>

                            {/* Employment History */}
                            <AccordionItem value="experience" className="border-b-0 py-2">
                                <AccordionTrigger className="hover:no-underline py-3 group px-2 md:px-3">
                                    <div className="flex items-center gap-3 text-base md:text-sm font-semibold whitespace-nowrap overflow-hidden">
                                        <div className="p-1 rounded bg-gray-50 text-gray-400 group-data-[state=open]:text-blue-600 group-data-[state=open]:bg-blue-50 flex-shrink-0">
                                            <History className="size-4" />
                                        </div>
                                        Employment History
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="space-y-4 pt-1 px-2 md:px-3">
                                    <div onClick={() => onSelectElement?.('experience')}>
                                        {data.experience?.map((exp: any, index: number) => (
                                            <div key={index} className="p-3 md:p-4 border rounded-lg space-y-3 mb-4 last:mb-0">
                                                <div className="flex items-center justify-between">
                                                    <div className="font-medium text-sm">{exp.position || "Untitled Position"}</div>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="size-6 text-gray-400 hover:text-red-500"
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            const next = (data.experience || []).filter((_: any, i: number) => i !== index)
                                                            onChange("experience", next)
                                                        }}
                                                    >
                                                        <Trash2 className="size-4" />
                                                    </Button>
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                                                    <div className="grid gap-1">
                                                        <Label className="text-[10px] uppercase tracking-wider text-gray-500 font-bold">Location</Label>
                                                        <Input
                                                            placeholder="City, Country"
                                                            value={exp.location || ""}
                                                            onChange={(e) => onChange(`experience.${index}.location`, e.target.value)}
                                                            className="h-8 text-sm border-gray-200"
                                                        />
                                                    </div>
                                                    <div className="grid gap-1">
                                                        <Label className="text-[10px] uppercase tracking-wider text-gray-500 font-bold">Company</Label>
                                                        <Input
                                                            placeholder="Company Name"
                                                            value={exp.company || ""}
                                                            onChange={(e) => onChange(`experience.${index}.company`, e.target.value)}
                                                            className="h-8 text-sm border-gray-200"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-2 gap-2">
                                                    <div className="grid gap-1">
                                                        <Label className="text-[10px] uppercase tracking-wider text-gray-500 font-bold">Start</Label>
                                                        <Input
                                                            placeholder="2022"
                                                            value={exp.startDate || ""}
                                                            onChange={(e) => onChange(`experience.${index}.startDate`, e.target.value)}
                                                            className="h-8 text-sm border-gray-200"
                                                        />
                                                    </div>
                                                    <div className="grid gap-1">
                                                        <Label className="text-[10px] uppercase tracking-wider text-gray-500 font-bold">End</Label>
                                                        <Input
                                                            placeholder="Present"
                                                            value={exp.endDate || ""}
                                                            onChange={(e) => onChange(`experience.${index}.endDate`, e.target.value)}
                                                            className="h-8 text-sm border-gray-200"
                                                        />
                                                    </div>
                                                </div>

                                                <Textarea
                                                    placeholder="Describe your responsibilities and achievements..."
                                                    value={exp.description || ""}
                                                    onChange={(e) => onChange(`experience.${index}.description`, e.target.value)}
                                                    className="min-h-[80px] md:min-h-[100px] resize-none border-gray-200 text-sm"
                                                />

                                                <Textarea
                                                    placeholder="Key achievements..."
                                                    value={exp.achievements || ""}
                                                    onChange={(e) => onChange(`experience.${index}.achievements`, e.target.value)}
                                                    className="min-h-[70px] resize-none border-gray-200 text-sm"
                                                />
                                            </div>
                                        ))}
                                        <Button
                                            variant="ghost"
                                            className="w-full justify-start text-blue-600 hover:text-blue-700 hover:bg-blue-50 gap-2 h-9 p-0 text-sm font-medium"
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                const newExp = {
                                                    id: Date.now().toString(),
                                                    position: "",
                                                    company: "",
                                                    startDate: "",
                                                    endDate: "",
                                                    current: false,
                                                    description: ""
                                                }
                                                onChange("experience", [...(data.experience || []), newExp])
                                            }}
                                        >
                                            <Plus className="size-4" />
                                            Add One More
                                        </Button>
                                    </div>
                                </AccordionContent>
                            </AccordionItem>

                            {/* Education */}
                            <AccordionItem value="education" className="border-b-0 py-2">
                                <AccordionTrigger className="hover:no-underline py-3 group">
                                    <div className="flex items-center gap-3 text-sm font-semibold">
                                        <div className="p-1 rounded bg-gray-50 text-gray-400 group-data-[state=open]:text-blue-600 group-data-[state=open]:bg-blue-50">
                                            <GraduationCap className="size-4" />
                                        </div>
                                        Education
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="space-y-4 pt-1">
                                    <div onClick={() => onSelectElement?.('education')}>
                                        {data.education?.map((edu: any, index: number) => (
                                            <div key={index} className="p-4 border rounded-lg space-y-3 mb-4 last:mb-0">
                                                <div className="flex items-center justify-between">
                                                    <div className="font-medium text-sm">{edu.degree || "Untitled Education"}</div>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="size-6 text-gray-400 hover:text-red-500"
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            const next = (data.education || []).filter((_: any, i: number) => i !== index)
                                                            onChange("education", next)
                                                        }}
                                                    >
                                                        <Trash2 className="size-4" />
                                                    </Button>
                                                </div>
                                                <div className="text-xs text-gray-500">{edu.institution}</div>
                                                <div className="grid grid-cols-2 gap-2">
                                                    <Input
                                                        placeholder="Degree"
                                                        value={edu.degree || ""}
                                                        onChange={(e) => onChange(`education.${index}.degree`, e.target.value)}
                                                        className="h-8 text-sm border-gray-200"
                                                    />
                                                    <Input
                                                        placeholder="Institution"
                                                        value={edu.institution || ""}
                                                        onChange={(e) => onChange(`education.${index}.institution`, e.target.value)}
                                                        className="h-8 text-sm border-gray-200"
                                                    />
                                                </div>

                                                <Input
                                                    placeholder="Field of study"
                                                    value={edu.fieldOfStudy || ""}
                                                    onChange={(e) => onChange(`education.${index}.fieldOfStudy`, e.target.value)}
                                                    className="h-8 text-sm border-gray-200"
                                                />

                                                <div className="grid grid-cols-2 gap-2">
                                                    <Input
                                                        placeholder="Start year"
                                                        value={edu.startDate || ""}
                                                        onChange={(e) => onChange(`education.${index}.startDate`, e.target.value)}
                                                        className="h-8 text-sm border-gray-200"
                                                    />
                                                    <Input
                                                        placeholder="End year"
                                                        value={edu.endDate || ""}
                                                        onChange={(e) => onChange(`education.${index}.endDate`, e.target.value)}
                                                        className="h-8 text-sm border-gray-200"
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                        <Button
                                            variant="ghost"
                                            className="w-full justify-start text-blue-600 hover:text-blue-700 hover:bg-blue-50 gap-2 h-9 p-0 text-sm font-medium"
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                const newEdu = {
                                                    id: Date.now().toString(),
                                                    degree: "",
                                                    institution: "",
                                                    fieldOfStudy: "",
                                                    startDate: "",
                                                    endDate: "",
                                                    current: false
                                                }
                                                onChange("education", [...(data.education || []), newEdu])
                                            }}
                                        >
                                            <Plus className="size-4" />
                                            Add Education
                                        </Button>
                                    </div>
                                </AccordionContent>
                            </AccordionItem>

                            {/* Websites & Social Links */}
                            <AccordionItem value="links" className="border-b-0 py-2">
                                <AccordionTrigger className="hover:no-underline py-3 group">
                                    <div className="flex items-center gap-3 text-sm font-semibold">
                                        <div className="p-1 rounded bg-gray-50 text-gray-400 group-data-[state=open]:text-blue-600 group-data-[state=open]:bg-blue-50">
                                            <LinkIcon className="size-4" />
                                        </div>
                                        Websites & Social Links
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="space-y-4 pt-1">
                                    <div className="grid gap-4" onClick={() => onSelectElement?.('links')}>
                                        <div className="grid gap-2">
                                            <Label htmlFor="linkedin" className="text-[10px] uppercase tracking-wider text-gray-500 font-bold">LinkedIn URL</Label>
                                            <Input
                                                id="linkedin"
                                                placeholder="https://linkedin.com/in/username"
                                                value={data.personalInfo?.linkedin || ""}
                                                onChange={(e) => onChange("personalInfo.linkedin", e.target.value)}
                                                className="h-10 border-gray-200"
                                            />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="portfolio" className="text-[10px] uppercase tracking-wider text-gray-500 font-bold">Portfolio / Website</Label>
                                            <Input
                                                id="portfolio"
                                                placeholder="https://yourwebsite.com"
                                                value={data.personalInfo?.portfolio || ""}
                                                onChange={(e) => onChange("personalInfo.portfolio", e.target.value)}
                                                className="h-10 border-gray-200"
                                            />
                                        </div>
                                    </div>
                                </AccordionContent>
                            </AccordionItem>

                            {/* Skills */}
                            <AccordionItem value="skills" className="border-b-0 py-2">
                                <AccordionTrigger className="hover:no-underline py-3 group">
                                    <div className="flex items-center gap-3 text-sm font-semibold">
                                        <div className="p-1 rounded bg-gray-50 text-gray-400 group-data-[state=open]:text-blue-600 group-data-[state=open]:bg-blue-50">
                                            <Award className="size-4" />
                                        </div>
                                        Skills
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="space-y-4 pt-1">
                                    <div onClick={() => onSelectElement?.('skills')}>
                                        <div className="flex flex-wrap gap-2">
                                            {data.skills?.map((skill: string, index: number) => (
                                                <div key={index} className="flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm">
                                                    {skill}
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="size-4 hover:bg-blue-100"
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            const newSkills = data.skills?.filter((_: any, i: number) => i !== index) || []
                                                            onChange("skills", newSkills)
                                                        }}
                                                    >
                                                        <Trash2 className="size-3" />
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="flex gap-2 mt-4">
                                            <Input
                                                placeholder="Add a skill..."
                                                className="flex-1 h-9 border-gray-200"
                                                onKeyPress={(e) => {
                                                    if (e.key === 'Enter') {
                                                        const newSkill = e.currentTarget.value.trim()
                                                        if (newSkill) {
                                                            onChange("skills", [...(data.skills || []), newSkill])
                                                            e.currentTarget.value = ""
                                                        }
                                                    }
                                                }}
                                            />
                                            <Button
                                                variant="outline"
                                                className="px-3 h-9 border-gray-200"
                                                onClick={(e) => {
                                                    const input = e.currentTarget.parentElement?.querySelector('input')
                                                    const newSkill = input?.value.trim()
                                                    if (newSkill) {
                                                        onChange("skills", [...(data.skills || []), newSkill])
                                                        if (input) input.value = ""
                                                    }
                                                }}
                                            >
                                                <Plus className="size-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </AccordionContent>
                            </AccordionItem>

                            <AccordionItem value="languages" className="border-b-0 py-2">
                                <AccordionTrigger className="hover:no-underline py-3 group px-2 md:px-3">
                                    <div className="flex items-center gap-3 text-sm font-semibold">
                                        <div className="p-1 rounded bg-gray-50 text-gray-400 group-data-[state=open]:text-blue-600 group-data-[state=open]:bg-blue-50">
                                            <Globe className="size-4" />
                                        </div>
                                        Languages
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="space-y-4 pt-1 px-2 md:px-3">
                                    <div onClick={() => onSelectElement?.('languages')} className="space-y-3">
                                        {data.languages?.map((lang: any, index: number) => (
                                            <div key={index} className="grid grid-cols-[1fr_120px] gap-2">
                                                <Input
                                                    placeholder="Language"
                                                    value={lang.language || ""}
                                                    onChange={(e) => onChange(`languages.${index}.language`, e.target.value)}
                                                    className="h-9 border-gray-200"
                                                />
                                                <Input
                                                    placeholder="Fluent"
                                                    value={lang.proficiency || ""}
                                                    onChange={(e) => onChange(`languages.${index}.proficiency`, e.target.value)}
                                                    className="h-9 border-gray-200"
                                                />
                                            </div>
                                        ))}
                                        <Button
                                            variant="ghost"
                                            className="w-full justify-start text-blue-600 hover:text-blue-700 hover:bg-blue-50 gap-2 h-9 p-0 text-sm font-medium"
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                onChange("languages", [...(data.languages || []), { language: "", proficiency: "Fluent" }])
                                            }}
                                        >
                                            <Plus className="size-4" />
                                            Add Language
                                        </Button>
                                    </div>
                                </AccordionContent>
                            </AccordionItem>

                            <AccordionItem value="projects" className="border-b-0 py-2">
                                <AccordionTrigger className="hover:no-underline py-3 group px-2 md:px-3">
                                    <div className="flex items-center gap-3 text-sm font-semibold">
                                        <div className="p-1 rounded bg-gray-50 text-gray-400 group-data-[state=open]:text-blue-600 group-data-[state=open]:bg-blue-50">
                                            <LayoutGrid className="size-4" />
                                        </div>
                                        Featured Projects
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="space-y-4 pt-1 px-2 md:px-3">
                                    <div onClick={() => onSelectElement?.('projects')} className="space-y-3">
                                        {data.projects?.map((project: any, index: number) => (
                                            <div key={index} className="p-3 border rounded-lg space-y-2">
                                                <div className="flex items-center justify-between gap-2">
                                                    <Input
                                                        placeholder="Project title"
                                                        value={project.name || ""}
                                                        onChange={(e) => onChange(`projects.${index}.name`, e.target.value)}
                                                        className="h-9 border-gray-200"
                                                    />
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="size-6 text-gray-400 hover:text-red-500"
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            onChange("projects", (data.projects || []).filter((_: any, i: number) => i !== index))
                                                        }}
                                                    >
                                                        <Trash2 className="size-4" />
                                                    </Button>
                                                </div>
                                                <Textarea
                                                    placeholder="Project description"
                                                    value={project.description || ""}
                                                    onChange={(e) => onChange(`projects.${index}.description`, e.target.value)}
                                                    className="min-h-[80px] resize-none border-gray-200 text-sm"
                                                />
                                            </div>
                                        ))}
                                        <Button
                                            variant="ghost"
                                            className="w-full justify-start text-blue-600 hover:text-blue-700 hover:bg-blue-50 gap-2 h-9 p-0 text-sm font-medium"
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                onChange("projects", [...(data.projects || []), { id: Date.now().toString(), name: "", description: "", link: "", technologies: [], outcome: "" }])
                                            }}
                                        >
                                            <Plus className="size-4" />
                                            Add Project
                                        </Button>
                                    </div>
                                </AccordionContent>
                            </AccordionItem>

                            <AccordionItem value="certifications" className="border-b-0 py-2">
                                <AccordionTrigger className="hover:no-underline py-3 group px-2 md:px-3">
                                    <div className="flex items-center gap-3 text-sm font-semibold">
                                        <div className="p-1 rounded bg-gray-50 text-gray-400 group-data-[state=open]:text-blue-600 group-data-[state=open]:bg-blue-50">
                                            <Award className="size-4" />
                                        </div>
                                        Certifications
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="space-y-4 pt-1 px-2 md:px-3">
                                    <div onClick={() => onSelectElement?.('certifications')} className="space-y-3">
                                        {data.certifications?.map((cert: any, index: number) => (
                                            <div key={index} className="p-3 border rounded-lg space-y-2">
                                                <div className="flex items-center justify-between gap-2">
                                                    <Input
                                                        placeholder="Certification name"
                                                        value={cert.name || ""}
                                                        onChange={(e) => onChange(`certifications.${index}.name`, e.target.value)}
                                                        className="h-9 border-gray-200"
                                                    />
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="size-6 text-gray-400 hover:text-red-500"
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            onChange("certifications", (data.certifications || []).filter((_: any, i: number) => i !== index))
                                                        }}
                                                    >
                                                        <Trash2 className="size-4" />
                                                    </Button>
                                                </div>
                                                <div className="grid grid-cols-2 gap-2">
                                                    <Input
                                                        placeholder="Organization"
                                                        value={cert.organization || ""}
                                                        onChange={(e) => onChange(`certifications.${index}.organization`, e.target.value)}
                                                        className="h-9 border-gray-200"
                                                    />
                                                    <Input
                                                        placeholder="Year"
                                                        value={cert.year || ""}
                                                        onChange={(e) => onChange(`certifications.${index}.year`, e.target.value)}
                                                        className="h-9 border-gray-200"
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                        <Button
                                            variant="ghost"
                                            className="w-full justify-start text-blue-600 hover:text-blue-700 hover:bg-blue-50 gap-2 h-9 p-0 text-sm font-medium"
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                onChange("certifications", [...(data.certifications || []), { id: Date.now().toString(), name: "", organization: "", year: "" }])
                                            }}
                                        >
                                            <Plus className="size-4" />
                                            Add Certification
                                        </Button>
                                    </div>
                                </AccordionContent>
                            </AccordionItem>

                            <AccordionItem value="volunteering" className="border-b-0 py-2">
                                <AccordionTrigger className="hover:no-underline py-3 group px-2 md:px-3">
                                    <div className="flex items-center gap-3 text-sm font-semibold">
                                        <div className="p-1 rounded bg-gray-50 text-gray-400 group-data-[state=open]:text-blue-600 group-data-[state=open]:bg-blue-50">
                                            <History className="size-4" />
                                        </div>
                                        Volunteering
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="space-y-4 pt-1 px-2 md:px-3">
                                    <div onClick={() => onSelectElement?.('volunteering')} className="space-y-3">
                                        {data.volunteering?.map((vol: any, index: number) => (
                                            <div key={index} className="p-3 border rounded-lg space-y-2">
                                                <Input
                                                    placeholder="Organization"
                                                    value={vol.organization || ""}
                                                    onChange={(e) => onChange(`volunteering.${index}.organization`, e.target.value)}
                                                    className="h-9 border-gray-200"
                                                />
                                                <Input
                                                    placeholder="Role"
                                                    value={vol.role || ""}
                                                    onChange={(e) => onChange(`volunteering.${index}.role`, e.target.value)}
                                                    className="h-9 border-gray-200"
                                                />
                                                <Textarea
                                                    placeholder="Description"
                                                    value={vol.description || ""}
                                                    onChange={(e) => onChange(`volunteering.${index}.description`, e.target.value)}
                                                    className="min-h-[80px] resize-none border-gray-200 text-sm"
                                                />
                                            </div>
                                        ))}
                                        <Button
                                            variant="ghost"
                                            className="w-full justify-start text-blue-600 hover:text-blue-700 hover:bg-blue-50 gap-2 h-9 p-0 text-sm font-medium"
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                onChange("volunteering", [...(data.volunteering || []), { id: Date.now().toString(), organization: "", role: "", startDate: "", endDate: "", description: "" }])
                                            }}
                                        >
                                            <Plus className="size-4" />
                                            Add Volunteering
                                        </Button>
                                    </div>
                                </AccordionContent>
                            </AccordionItem>

                            <AccordionItem value="awards" className="border-b-0 py-2">
                                <AccordionTrigger className="hover:no-underline py-3 group px-2 md:px-3">
                                    <div className="flex items-center gap-3 text-sm font-semibold">
                                        <div className="p-1 rounded bg-gray-50 text-gray-400 group-data-[state=open]:text-blue-600 group-data-[state=open]:bg-blue-50">
                                            <Award className="size-4" />
                                        </div>
                                        Awards & Hobbies
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="space-y-4 pt-1 px-2 md:px-3">
                                    <div className="space-y-3" onClick={() => onSelectElement?.('awards')}>
                                        {data.awards?.map((award: any, index: number) => (
                                            <div key={index} className="p-3 border rounded-lg space-y-2">
                                                <Input
                                                    placeholder="Award name"
                                                    value={award.name || ""}
                                                    onChange={(e) => onChange(`awards.${index}.name`, e.target.value)}
                                                    className="h-9 border-gray-200"
                                                />
                                                <Input
                                                    placeholder="Organization / Year"
                                                    value={award.organization || ""}
                                                    onChange={(e) => onChange(`awards.${index}.organization`, e.target.value)}
                                                    className="h-9 border-gray-200"
                                                />
                                            </div>
                                        ))}
                                        <Button
                                            variant="ghost"
                                            className="w-full justify-start text-blue-600 hover:text-blue-700 hover:bg-blue-50 gap-2 h-9 p-0 text-sm font-medium"
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                onChange("awards", [...(data.awards || []), { id: Date.now().toString(), name: "", organization: "", year: "", reason: "" }])
                                            }}
                                        >
                                            <Plus className="size-4" />
                                            Add Award
                                        </Button>
                                    </div>

                                    <div className="space-y-2" onClick={() => onSelectElement?.('hobbies')}>
                                        <Label className="text-[10px] uppercase tracking-wider text-gray-500 font-bold">Hobbies</Label>
                                        <div className="flex flex-wrap gap-2">
                                            {data.hobbies?.map((hobby: string, index: number) => (
                                                <div key={index} className="flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm">
                                                    {hobby}
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="size-4 hover:bg-blue-100"
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            onChange("hobbies", (data.hobbies || []).filter((_: any, i: number) => i !== index))
                                                        }}
                                                    >
                                                        <Trash2 className="size-3" />
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="flex gap-2">
                                            <Input
                                                placeholder="Add a hobby..."
                                                className="flex-1 h-9 border-gray-200"
                                                onKeyPress={(e) => {
                                                    if (e.key === 'Enter') {
                                                        const newHobby = e.currentTarget.value.trim()
                                                        if (newHobby) {
                                                            onChange("hobbies", [...(data.hobbies || []), newHobby])
                                                            e.currentTarget.value = ""
                                                        }
                                                    }
                                                }}
                                            />
                                            <Button
                                                variant="outline"
                                                className="px-3 h-9 border-gray-200"
                                                onClick={(e) => {
                                                    const input = e.currentTarget.parentElement?.querySelector('input')
                                                    const newHobby = input?.value.trim()
                                                    if (newHobby) {
                                                        onChange("hobbies", [...(data.hobbies || []), newHobby])
                                                        if (input) input.value = ""
                                                    }
                                                }}
                                            >
                                                <Plus className="size-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </AccordionContent>
                            </AccordionItem>

                            <AccordionItem value="referees" className="border-b-0 py-2">
                                <AccordionTrigger className="hover:no-underline py-3 group px-2 md:px-3">
                                    <div className="flex items-center gap-3 text-sm font-semibold">
                                        <div className="p-1 rounded bg-gray-50 text-gray-400 group-data-[state=open]:text-blue-600 group-data-[state=open]:bg-blue-50">
                                            <User className="size-4" />
                                        </div>
                                        Referees
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="space-y-4 pt-1 px-2 md:px-3">
                                    <div onClick={() => onSelectElement?.('referees')} className="space-y-3">
                                        {data.referees?.map((ref: any, index: number) => (
                                            <div key={index} className="p-3 border rounded-lg space-y-2">
                                                <Input
                                                    placeholder="Name"
                                                    value={ref.name || ""}
                                                    onChange={(e) => onChange(`referees.${index}.name`, e.target.value)}
                                                    className="h-9 border-gray-200"
                                                />
                                                <Input
                                                    placeholder="Title / Organization"
                                                    value={ref.title || ""}
                                                    onChange={(e) => onChange(`referees.${index}.title`, e.target.value)}
                                                    className="h-9 border-gray-200"
                                                />
                                                <Input
                                                    placeholder="Phone / Email"
                                                    value={ref.phone || ""}
                                                    onChange={(e) => onChange(`referees.${index}.phone`, e.target.value)}
                                                    className="h-9 border-gray-200"
                                                />
                                            </div>
                                        ))}
                                        <Button
                                            variant="ghost"
                                            className="w-full justify-start text-blue-600 hover:text-blue-700 hover:bg-blue-50 gap-2 h-9 p-0 text-sm font-medium"
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                onChange("referees", [...(data.referees || []), { id: Date.now().toString(), name: "", title: "", organization: "", phone: "", email: "", availableOnRequest: true }])
                                            }}
                                        >
                                            <Plus className="size-4" />
                                            Add Referee
                                        </Button>
                                    </div>
                                </AccordionContent>
                            </AccordionItem>

                        </Accordion>
                    </div>
                </TabsContent>

                <TabsContent value="templates" className="mt-0 flex-1 overflow-hidden">
                    <div className="h-full overflow-y-auto custom-scrollbar p-4">
                        <div className="grid gap-3">
                            {[
                                { id: "sierra-leone-professional", name: "Sierra Leone Professional", desc: "Standard • Green" },
                                { id: "freetown-modern", name: "Freetown Modern", desc: "Sidebar • Blue" },
                                { id: "classic-salone", name: "Classic Salone", desc: "Minimal • Yellow" },
                                { id: "bo-business", name: "Bo Business", desc: "Standard • Red" },
                                { id: "makeni-minimal", name: "Makeni Minimal", desc: "Minimal • Slate" },
                            ].map((t) => {
                                const active = (data.templateId || "sierra-leone-professional") === t.id
                                return (
                                    <button
                                        key={t.id}
                                        type="button"
                                        onClick={() => onChange("templateId", t.id)}
                                        className={`w-full text-left rounded-lg border p-4 transition-colors ${active
                                            ? "border-blue-500 bg-blue-50"
                                            : "border-gray-200 hover:bg-gray-50"
                                            }`}
                                    >
                                        <div className="flex items-center justify-between gap-4">
                                            <div>
                                                <div className="text-sm font-semibold text-gray-900">{t.name}</div>
                                                <div className="text-xs text-gray-500 mt-1">{t.desc}</div>
                                            </div>
                                            <div className={`text-xs font-bold px-2 py-1 rounded ${active ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"}`}>
                                                {active ? "Selected" : "Select"}
                                            </div>
                                        </div>
                                    </button>
                                )
                            })}
                        </div>
                    </div>
                </TabsContent>
            </Tabs>

            <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e5e7eb;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #d1d5db;
        }
      `}</style>
        </aside>
    )
}
