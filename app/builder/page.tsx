"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import {
  User,
  GraduationCap,
  Briefcase,
  Award,
  Globe,
  Plus,
  Trash2,
  ArrowRight,
  ArrowLeft,
  Check,
  Sparkles,
  Upload,
  Loader2,
  CheckCircle2,
  AlertCircle,
  LayoutTemplate,
  FileText,
  Code,
  BookOpen,
  Heart,
  Trophy,
  Smile,
  Users,
} from "lucide-react"
import type { CVData } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { AISuggestionDialog } from "@/components/ai-suggestion-dialog"

const DEFAULT_PERSONAL_INFO = {
  fullName: "",
  email: "",
  phone: "",
  location: "",
  addressCity: "",
  addressCountry: "",
  summary: "",
  age: "",
  profilePhoto: "",
  linkedin: "",
  portfolio: "",
}

const steps = [
  { number: 1, title: "Start", icon: LayoutTemplate },
  { number: 2, title: "Personal Information", icon: User },
  { number: 3, title: "Education", icon: GraduationCap },
  { number: 4, title: "Experience", icon: Briefcase },
  { number: 5, title: "Skills", icon: Award },
  { number: 6, title: "Languages", icon: Globe },
  { number: 7, title: "Certifications", icon: FileText },
  { number: 8, title: "Projects", icon: Code },
  { number: 9, title: "Technical Writing", icon: FileText },
  { number: 10, title: "Volunteering", icon: Heart },
  { number: 11, title: "Awards", icon: Trophy },
  { number: 12, title: "Hobbies", icon: Smile },
  { number: 13, title: "Referees", icon: Users },
  { number: 14, title: "Profile Photo", icon: Upload },
  { number: 15, title: "AI Enhancement", icon: Sparkles },
]

const templates = [
  { id: "sierra-leone-professional", name: "Sierra Leone Professional", color: "green", description: "Clean, traditional format trusted by government." },
  { id: "freetown-modern", name: "Freetown Modern", color: "blue", description: "Contemporary layout for tech and creative roles." },
  { id: "classic-salone", name: "Classic Salone", color: "yellow", description: "Traditional single-column format." },
  { id: "bo-business", name: "Bo Business", color: "red", description: "Bold and corporate, ideal for management roles." },
  { id: "makeni-minimal", name: "Makeni Minimal", color: "slate", description: "Clean and minimalist, focuses on content." },
  { id: "kenema-creative", name: "Kenema Creative", color: "purple", description: "Vibrant and expressive for artistic fields." },
  { id: "lion-mountains", name: "Lion Mountains", color: "teal", description: "Modern and fresh with a nature-inspired palette." },
]

export default function CVBuilderPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [currentStep, setCurrentStep] = useState(1)
  const [aiEnhancing, setAiEnhancing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [completionPercentage, setCompletionPercentage] = useState(0)

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})
  const [fieldStatus, setFieldStatus] = useState<Record<string, "valid" | "invalid" | "empty">>({})

  const [cvData, setCvData] = useState<Partial<CVData>>({
    personalInfo: DEFAULT_PERSONAL_INFO,
    education: [],
    skills: [],
    languages: [],
    projects: [],
    certifications: [],
    volunteering: [],
    awards: [],
    hobbies: [],
    referees: [],
    technicalWriting: [],
    availability: "",
    templateId: "sierra-leone-professional",
  })

  // Education form state
  const [eduForm, setEduForm] = useState({
    institution: "",
    degree: "",
    fieldOfStudy: "",
    startDate: "",
    endDate: "",
    current: false,
  })

  // Experience form state
  const [expForm, setExpForm] = useState({
    company: "",
    position: "",
    location: "",
    startDate: "",
    endDate: "",
    current: false,
    description: "",
    achievements: "",
  })

  // Skills state
  const [skillInput, setSkillInput] = useState("")

  // Projects form state
  const [projectForm, setProjectForm] = useState({
    name: "",
    description: "",
    link: "",
    technologies: "",
    outcome: "",
  })

  const [writingForm, setWritingForm] = useState({
    title: "",
    link: "",
    platform: "",
  })

  // Certifications form state
  const [certForm, setCertForm] = useState({
    name: "",
    organization: "",
    year: "",
  })

  // Volunteering form state
  const [volForm, setVolForm] = useState({
    organization: "",
    role: "",
    startDate: "",
    endDate: "",
    description: "",
  })

  // Awards form state
  const [awardForm, setAwardForm] = useState({
    name: "",
    organization: "",
    year: "",
    reason: "",
  })

  // Hobbies state
  const [hobbyInput, setHobbyInput] = useState("")

  // Referees form state
  const [refereeForm, setRefereeForm] = useState({
    name: "",
    title: "",
    organization: "",
    phone: "",
    email: "",
    availableOnRequest: false,
  })
  const [langForm, setLangForm] = useState({
    language: "",
    proficiency: "intermediate",
  })

  // Profile Photo state
  const [profilePhotoPreview, setProfilePhotoPreview] = useState<string>("")
  const [preferences, setPreferences] = useState<{ jobRole: string; experienceLevel: string } | null>(null)
  const [selectedTemplate, setSelectedTemplate] = useState("sierra-leone-professional")

  // Mock CV Parsing
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      toast({
        title: "Analyzing CV...",
        description: "Extracting information from your document.",
      })

      // Simulate parsing delay
      setTimeout(() => {
        // Mock parsed data
        setCvData((prev) => ({
          ...prev,
          personalInfo: {
            fullName: "Abdul Bangura",
            email: "abdul.b@example.com",
            phone: "076123456",
            location: "Freetown, Sierra Leone",
            summary: "Experienced professional with a background in administration.",
            age: "28",
            profilePhoto: "",
          },
          education: [],
          experience: [],
          skills: ["Microsoft Office", "Communication"],
          languages: [],
        }))
        toast({
          title: "CV Uploaded!",
          description: "We've pre-filled your information. Please review it.",
        })
        setCurrentStep(2) // Move to Personal Info
      }, 1500)
    }
  }

  useEffect(() => {
    // Load saved CV data
    const savedCV = localStorage.getItem("cvbuilder_current")
    if (savedCV) {
      try {
        const parsed = JSON.parse(savedCV)
        setCvData(parsed)
        if (parsed.templateId) {
          setSelectedTemplate(parsed.templateId)
        }
      } catch (e) {
        console.error("[v0] Failed to load saved CV:", e)
      }
    }

    // Load preferences from onboarding
    const savedPrefs = localStorage.getItem("cvbuilder_preferences")
    if (savedPrefs) {
      try {
        setPreferences(JSON.parse(savedPrefs))
      } catch (e) {
        console.error("[v0] Failed to load preferences:", e)
      }
    }
  }, [])

  const calculateCompletion = () => {
    if (!cvData) {
      setCompletionPercentage(0)
      return
    }

    let completed = 0

    // Personal Info (35%)
    if (cvData.personalInfo?.fullName) completed += 10
    if (cvData.personalInfo?.email) completed += 10
    if (cvData.personalInfo?.phone) completed += 10
    if (cvData.personalInfo?.summary) completed += 5

    // Education (20%)
    if (cvData.education && cvData.education.length > 0) completed += 20

    // Experience (20%)
    if (cvData.experience && cvData.experience.length > 0) completed += 20

    // Skills (15%)
    if (cvData.skills && cvData.skills.length > 0) completed += 15

    // Languages (10%)
    if (cvData.languages && cvData.languages.length > 0) completed += 10

    // Profile Photo (5%)
    if (cvData.personalInfo?.profilePhoto) completed += 5

    setCompletionPercentage(completed)
  }

  useEffect(() => {
    calculateCompletion()
  }, [cvData])

  const validateField = (fieldName: string, value: string) => {
    let error = ""
    let status: "valid" | "invalid" | "empty" = "empty"

    if (!value) {
      status = "empty"
      setFieldStatus((prev) => ({ ...prev, [fieldName]: status }))
      return
    }

    switch (fieldName) {
      case "fullName":
        if (!/^[a-zA-Z\s]+$/.test(value)) {
          error = "Name can only contain letters and spaces"
          status = "invalid"
        } else if (value.length < 2) {
          error = "Name must be at least 2 characters"
          status = "invalid"
        } else {
          status = "valid"
        }
        break
      case "email":
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          error = "Please enter a valid email address"
          status = "invalid"
        } else {
          status = "valid"
        }
        break
      case "phone":
        if (!/^\d{8}$/.test(value.replace(/\s/g, ""))) {
          error = "Phone must be 8 digits"
          status = "invalid"
        } else {
          status = "valid"
        }
        break
      case "age":
        const age = Number.parseInt(value)
        if (isNaN(age) || age < 18 || age > 30) {
          error = "Age must be between 18 and 30"
          status = "invalid"
        } else {
          status = "valid"
        }
        break
    }

    setValidationErrors((prev) => ({ ...prev, [fieldName]: error }))
    setFieldStatus((prev) => ({ ...prev, [fieldName]: status }))
  }

  useEffect(() => {
    const autoSave = setTimeout(() => {
      if (cvData && Object.keys(cvData).length > 0) {
        setSaving(true)
        try {
          localStorage.setItem("cvbuilder_current", JSON.stringify(cvData))
        } catch (e) {
          console.error("[v0] Auto-save failed:", e)
        }
        setTimeout(() => {
          setSaving(false)
        }, 500)
      }
    }, 1000)

    return () => clearTimeout(autoSave)
  }, [cvData])

  const handleNameInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^a-zA-Z\s]/g, "") // Only letters and spaces
    handlePersonalInfoChange("fullName", value)
  }

  const handlePhoneInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, "") // Only numbers
    if (value.length <= 8) {
      // Max 8 digits after +232
      handlePersonalInfoChange("phone", value)
    }
  }

  const handleAgeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, "") // Only numbers
    handlePersonalInfoChange("age", value)
  }

  const handlePersonalInfoChange = (field: string, value: any) => {
    setCvData((prev) => ({
      ...prev,
      personalInfo: {
        ...(prev.personalInfo || DEFAULT_PERSONAL_INFO),
        [field]: value,
      },
    }))

    if (["fullName", "email", "phone", "age"].includes(field)) {
      validateField(field, String(value))
    }
  }

  const handleEnhanceWithAI = async () => {
    setAiEnhancing(true)

    toast({
      title: "AI Enhancement Started",
      description: "Analyzing your CV and generating improvements...",
    })

    try {
      const response = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "enhance_cv",
          cvData: cvData,
        }),
      })

      const result = await response.json()

      if (result.summary || result.experience || result.skills) {
        // AI generated enhancements
        setCvData((prev) => ({
          ...prev,
          personalInfo: {
            ...(prev.personalInfo || {}),
            summary: result.summary || prev.personalInfo?.summary,
          } as any,
          experience: result.experience || prev.experience,
          skills: result.skills || prev.skills,
        }))

        toast({
          title: "AI Enhancement Complete!",
          description: "Your CV has been professionally enhanced with AI-powered suggestions.",
          variant: "default",
        })
      } else {
        // Use professional template enhancement
        setCvData((prev) => enhanceWithProfessionalTemplate(prev))

        toast({
          title: "Enhancement Complete",
          description: "Your CV has been enhanced with professional formatting and language.",
        })
      }
    } catch (error) {
      console.error("[v0] AI enhancement error:", error)

      // Fallback to professional template enhancement
      setCvData((prev) => enhanceWithProfessionalTemplate(prev))

      toast({
        title: "Enhancement Complete",
        description: "Your CV has been enhanced with professional templates.",
      })
    } finally {
      setAiEnhancing(false)
    }
  }

  const enhanceWithProfessionalTemplate = (data: Partial<CVData>) => {
    const location = data.personalInfo?.location || "Sierra Leone"
    const topSkills = data.skills?.slice(0, 3).join(", ") || "communication, teamwork, and problem-solving"
    const yearsExp = data.experience?.length || 0
    const education = data.education?.[0]

    // Generate professional summary
    let enhancedSummary = ""
    if (yearsExp > 0) {
      enhancedSummary = `Accomplished professional from ${location} with ${yearsExp}+ years of progressive experience in ${data.experience?.[0]?.position || "the field"}. Demonstrated expertise in ${topSkills}, with a proven track record of delivering results. ${education ? `Holds a ${education.degree} in ${education.fieldOfStudy}.` : ""} Seeking opportunities to leverage skills and experience to contribute to organizational success and growth.`
    } else {
      enhancedSummary = `Motivated and detail-oriented ${education?.fieldOfStudy || "professional"} graduate from ${location}. Strong foundation in ${topSkills}, with excellent academic performance and practical skills. ${education ? `Recently completed ${education.degree} at ${education.institution}.` : ""} Eager to apply knowledge and skills in a challenging role while contributing to organizational objectives.`
    }

    // Enhance experience descriptions
    const enhancedExperience = data.experience?.map((exp) => {
      const enhanced = {
        ...exp,
        description: exp.description || "",
      }

      // If description is short or generic, enhance it
      if (!exp.description || exp.description.length < 100) {
        const position = exp.position.toLowerCase()
        if (position.includes("teacher")) {
          enhanced.description =
            "• Developed and delivered engaging lesson plans aligned with curriculum standards\n• Monitored student progress through regular assessments and provided constructive feedback\n• Collaborated with colleagues to enhance teaching methodologies and student outcomes\n• Maintained positive relationships with students, parents, and school administration"
        } else if (position.includes("sales") || position.includes("marketing")) {
          enhanced.description =
            "• Achieved and exceeded sales targets through effective customer relationship management\n• Identified new business opportunities and expanded customer base by 25%\n• Provided exceptional customer service and resolved client concerns promptly\n• Maintained accurate records of sales activities and customer interactions"
        } else if (position.includes("manager") || position.includes("supervisor")) {
          enhanced.description =
            "• Led and motivated a team of professionals to achieve departmental objectives\n• Implemented efficient processes that improved productivity by 30%\n• Conducted performance evaluations and provided coaching to team members\n• Coordinated cross-functional initiatives and stakeholder communications"
        } else if (position.includes("accountant") || position.includes("finance")) {
          enhanced.description =
            "• Prepared accurate financial reports and maintained organized accounting records\n• Processed invoices, payments, and reconciliations in accordance with company policies\n• Assisted with budget preparation and variance analysis\n• Ensured compliance with financial regulations and internal controls"
        } else {
          enhanced.description =
            "• Performed assigned duties with professionalism and attention to detail\n• Collaborated effectively with team members to achieve organizational goals\n• Maintained accurate documentation and records of all activities\n• Contributed to process improvements and operational efficiency initiatives"
        }
      }

      return enhanced
    })

    // Add suggested skills if list is short
    let enhancedSkills = data.skills || []
    if (enhancedSkills.length < 8) {
      const additionalSkills = [
        "Microsoft Office Suite",
        "Communication Skills",
        "Time Management",
        "Problem Solving",
        "Team Collaboration",
        "Customer Service",
        "Report Writing",
        "Data Analysis",
      ]
      const missingSkills = additionalSkills.filter((skill) => !enhancedSkills.includes(skill))
      enhancedSkills = [...enhancedSkills, ...missingSkills.slice(0, 8 - enhancedSkills.length)]
    }

    return {
      ...data,
      personalInfo: {
        ...(data.personalInfo || {}),
        summary: enhancedSummary,
      } as any,
      experience: enhancedExperience,
      skills: enhancedSkills,
    }
  }

  const handleSaveAndContinue = async () => {
    // Final validation before saving
    validateField("fullName", cvData.personalInfo?.fullName || "")
    validateField("email", cvData.personalInfo?.email || "")
    validateField("phone", cvData.personalInfo?.phone || "")
    validateField("age", String(cvData.personalInfo?.age || ""))

    const hasErrors =
      !cvData.personalInfo?.fullName ||
      !cvData.personalInfo?.email ||
      !cvData.personalInfo?.phone ||
      !cvData.personalInfo?.age ||
      Object.values(validationErrors).some((error) => error) ||
      fieldStatus.fullName === "invalid" ||
      fieldStatus.email === "invalid" ||
      fieldStatus.phone === "invalid" ||
      fieldStatus.age === "invalid"

    if (hasErrors) {
      toast({
        title: "Incomplete Information",
        description: "Please go back to Step 2 and ensure all required fields are filled correctly.",
        variant: "destructive",
      })
      setCurrentStep(2)
      return
    }

    setSaving(true)

    const verificationId = cvData.verificationId || `CV${Date.now()}${Math.random().toString(36).substring(2, 9).toUpperCase()}`
    const cvId = cvData.id || Date.now().toString()
    const completedPersonalInfo = {
      ...DEFAULT_PERSONAL_INFO,
      ...(cvData.personalInfo || {}),
    }

    const cvToSave: CVData = {
      ...cvData,
      id: cvId,
      personalInfo: completedPersonalInfo,
      education: cvData.education || [],
      experience: cvData.experience || [],
      skills: cvData.skills || [],
      languages: cvData.languages || [],
      createdAt: (cvData as any).createdAt || new Date(),
      updatedAt: new Date(),
      verificationId,
      verifiedAt: cvData.verifiedAt || new Date().toISOString(),
    } as CVData

    try {
      // Save to localStorage
      let existingCVs = []
      try {
        existingCVs = JSON.parse(localStorage.getItem("cvbuilder_cvs") || "[]")
      } catch (e) {
        console.error("[v0] Failed to parse existing CVs:", e)
      }

      const index = existingCVs.findIndex((c: any) => c.id === cvId)
      if (index !== -1) {
        existingCVs[index] = cvToSave
      } else {
        existingCVs.push(cvToSave)
      }

      localStorage.setItem("cvbuilder_cvs", JSON.stringify(existingCVs))
      localStorage.setItem("cvbuilder_current", JSON.stringify(cvToSave))
    } catch (e) {
      console.error("[v0] Failed to save CV to localStorage:", e)
      if (e instanceof Error && e.name === "QuotaExceededError") {
        toast({
          title: "Storage Limit Exceeded",
          description: "Your browser's storage is full. Please delete some old CVs from your dashboard to save this one.",
          variant: "destructive",
        })
        setSaving(false)
        return
      }
    }

    try {
      if (cvData.personalInfo?.email) {
        const response = await fetch("/api/send-verification-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: cvData.personalInfo.email,
            fullName: cvData.personalInfo.fullName,
            verificationId,
          }),
        })

        if (response.ok) {
          const data = await response.json()
          console.log("[v0] Verification email sent:", data)
        }
      }
    } catch (error) {
      console.error("[v0] Failed to send verification email:", error)
      // Don't block CV save if email fails
    }

    setTimeout(() => {
      setSaving(false)
      toast({
        title: "CV Saved Successfully!",
        description: `Your verification ID (${verificationId}) has been sent to ${cvData.personalInfo?.email || "your email"}.`,
      })
      router.push("/preview")
    }, 800)
  }

  const handleSaveCV = async () => {
    const verificationId = `CV${Date.now()}${Math.random().toString(36).substring(2, 9).toUpperCase()}`

    const completedPersonalInfo = {
      ...DEFAULT_PERSONAL_INFO,
      ...(cvData.personalInfo || {}),
    }

    const completedCV: CVData = {
      ...cvData,
      id: cvData.id || Math.random().toString(36).substr(2, 9),
      personalInfo: completedPersonalInfo,
      education: cvData.education || [],
      experience: cvData.experience || [],
      skills: cvData.skills || [],
      languages: cvData.languages || [],
      createdAt: (cvData as any).createdAt || new Date(),
      updatedAt: new Date(),
      verificationId, // Add verification ID
      verifiedAt: new Date().toISOString(),
    } as CVData

    // Save to localStorage
    try {
      let existingCVs = []
      try {
        existingCVs = JSON.parse(localStorage.getItem("cvbuilder_cvs") || "[]")
      } catch (e) {
        console.error("[v0] Failed to parse existing CVs:", e)
      }

      const index = existingCVs.findIndex((c: any) => c.id === completedCV.id)
      if (index !== -1) {
        existingCVs[index] = completedCV
      } else {
        existingCVs.push(completedCV)
      }

      localStorage.setItem("cvbuilder_cvs", JSON.stringify(existingCVs))
      localStorage.setItem("cvbuilder_current", JSON.stringify(completedCV))
    } catch (e) {
      console.error("[v0] Failed to save CV to localStorage:", e)
      if (e instanceof Error && e.name === "QuotaExceededError") {
        toast({
          title: "Storage Limit Exceeded",
          description: "Your browser's storage is full. Please delete some old CVs from your dashboard to save this one.",
          variant: "destructive",
        })
        return
      }
    }

    try {
      if (cvData.personalInfo?.email) {
        await fetch("/api/send-verification-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: cvData.personalInfo.email,
            fullName: cvData.personalInfo.fullName,
            verificationId,
          }),
        })
      }
    } catch (error) {
      console.error("[v0] Failed to send verification email:", error)
    }

    toast({
      title: "CV Saved!",
      description: `Your CV has been created successfully. Verification ID sent to your email.`,
    })

    setTimeout(() => {
      router.push("/preview")
    }, 1000)
  }

  const getStepIcon = (status: "valid" | "invalid" | "empty") => {
    if (status === "valid") return <CheckCircle2 className="size-4 text-green-600" />
    if (status === "invalid") return <AlertCircle className="size-4 text-red-600" />
    return null
  }

  const handleNextStep = () => {
    if (currentStep < 15) {
      // Validate fields before moving to the next step
      if (currentStep === 2) {
        validateField("fullName", cvData.personalInfo?.fullName || "")
        validateField("email", cvData.personalInfo?.email || "")
        validateField("phone", cvData.personalInfo?.phone || "")
        validateField("age", String(cvData.personalInfo?.age || ""))

        const hasErrors =
          !cvData.personalInfo?.fullName ||
          !cvData.personalInfo?.email ||
          !cvData.personalInfo?.phone ||
          !cvData.personalInfo?.age ||
          validationErrors.fullName ||
          validationErrors.email ||
          validationErrors.phone ||
          validationErrors.age ||
          fieldStatus.fullName !== "valid" ||
          fieldStatus.email !== "valid" ||
          fieldStatus.phone !== "valid" ||
          fieldStatus.age !== "valid"

        if (hasErrors) {
          toast({
            title: "Validation Error",
            description: "Please fix the errors in the Personal Information section and fill all required fields (*).",
            variant: "destructive",
          })
          return
        }
      }
      setCurrentStep(currentStep + 1)
    } else if (currentStep === 15) {
      handleSaveAndContinue()
    }
  }

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const addEducation = () => {
    if (eduForm.institution && eduForm.degree) {
      setCvData((prev) => ({
        ...prev,
        education: [...(prev.education || []), { ...eduForm, id: Date.now().toString() }],
      }))
      setEduForm({
        institution: "",
        degree: "",
        fieldOfStudy: "",
        startDate: "",
        endDate: "",
        current: false,
      })
      toast({ title: "Education added!" })
    }
  }

  const addExperience = () => {
    if (expForm.company && expForm.position) {
      setCvData((prev) => ({
        ...prev,
        experience: [...(prev.experience || []), { ...expForm, id: Date.now().toString() }],
      }))
      setExpForm({
        company: "",
        position: "",
        location: "",
        startDate: "",
        endDate: "",
        current: false,
        description: "",
        achievements: "",
      })
      toast({ title: "Experience added!" })
    }
  }

  const addProject = () => {
    if (projectForm.name && projectForm.description) {
      setCvData((prev) => ({
        ...prev,
        projects: [
          ...(prev.projects || []),
          { ...projectForm, id: Date.now().toString(), technologies: projectForm.technologies.split(",").map((s) => s.trim()) },
        ],
      }))
      setProjectForm({
        name: "",
        description: "",
        link: "",
        technologies: "",
        outcome: "",
      })
      toast({ title: "Project added!" })
    }
  }

  const addWriting = () => {
    if (writingForm.title && writingForm.link) {
      setCvData((prev) => ({
        ...prev,
        technicalWriting: [...(prev.technicalWriting || []), { ...writingForm, id: Date.now().toString() }],
      }))
      setWritingForm({
        title: "",
        link: "",
        platform: "",
      })
      toast({ title: "Technical writing added!" })
    }
  }

  const addCertification = () => {
    if (certForm.name && certForm.organization) {
      setCvData((prev) => ({
        ...prev,
        certifications: [...(prev.certifications || []), { ...certForm, id: Date.now().toString() }],
      }))
      setCertForm({ name: "", organization: "", year: "" })
      toast({ title: "Certification added!" })
    }
  }

  const addVolunteering = () => {
    if (volForm.organization && volForm.role) {
      setCvData((prev) => ({
        ...prev,
        volunteering: [...(prev.volunteering || []), { ...volForm, id: Date.now().toString() }],
      }))
      setVolForm({ organization: "", role: "", startDate: "", endDate: "", description: "" })
      toast({ title: "Volunteering experience added!" })
    }
  }

  const addAward = () => {
    if (awardForm.name && awardForm.organization) {
      setCvData((prev) => ({
        ...prev,
        awards: [...(prev.awards || []), { ...awardForm, id: Date.now().toString() }],
      }))
      setAwardForm({ name: "", organization: "", year: "", reason: "" })
      toast({ title: "Award added!" })
    }
  }

  const addReferee = () => {
    if (refereeForm.name || refereeForm.availableOnRequest) {
      setCvData((prev) => ({
        ...prev,
        referees: [...(prev.referees || []), { ...refereeForm, id: Date.now().toString() }],
      }))
      setRefereeForm({ name: "", title: "", organization: "", phone: "", email: "", availableOnRequest: false })
      toast({ title: "Referee added!" })
    }
  }

  const addHobby = () => {
    if (hobbyInput.trim()) {
      setCvData((prev) => ({
        ...prev,
        hobbies: [...(prev.hobbies || []), hobbyInput.trim()],
      }))
      setHobbyInput("")
      toast({ title: "Hobby added!" })
    }
  }

  const addSkill = () => {
    if (skillInput.trim()) {
      setCvData((prev) => ({
        ...prev,
        skills: [...(prev.skills || []), skillInput.trim()],
      }))
      setSkillInput("")
    }
  }

  const addLanguage = () => {
    if (langForm.language) {
      setCvData((prev) => ({
        ...prev,
        languages: [...(prev.languages || []), langForm],
      }))
      setLangForm({ language: "", proficiency: "intermediate" })
      toast({ title: "Language added!" })
    }
  }

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const photoUrl = reader.result as string
        setProfilePhotoPreview(photoUrl)
        handlePersonalInfoChange("profilePhoto", photoUrl)
      }
      reader.readAsDataURL(file)
    }
  }

  // Template-based enhancement functions as fallback
  const enhanceSummaryWithTemplate = (summary: string): string => {
    if (!summary) return summary

    // Add professional language patterns
    const enhanced = summary
      .replace(/\bi am\b/gi, "I am a")
      .replace(/\bi have\b/gi, "I possess")
      .replace(/\bgood at\b/gi, "skilled in")
      .replace(/\bwork hard\b/gi, "dedicated professional")

    return enhanced
  }

  const enhanceDescriptionWithTemplate = (description: string): string => {
    if (!description) return description

    // Add action verbs and professional tone
    const actionVerbs = ["Managed", "Developed", "Implemented", "Coordinated", "Achieved"]
    const enhanced = description

    // Ensure bullets start with action verbs
    const lines = enhanced.split("\n")
    const improvedLines = lines.map((line) => {
      const trimmed = line.trim()
      if (trimmed && !actionVerbs.some((verb) => trimmed.startsWith(verb))) {
        return "• " + trimmed.charAt(0).toUpperCase() + trimmed.slice(1)
      }
      return line
    })

    return improvedLines.join("\n")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      {/* Header */}
      {/* Updated header for dashboard navigation and visual progress bar */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm print:hidden sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => router.push("/dashboard")}>
                <ArrowLeft className="size-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-foreground">AI CV Builder</h1>
                {preferences && (
                  <p className="text-sm text-muted-foreground">
                    Building CV for {preferences.jobRole} • {preferences.experienceLevel}
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3">
              {saving && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="size-4 animate-spin" />
                  Saving...
                </div>
              )}
              <div className="text-sm font-medium">
                Step {currentStep} of {steps.length}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span className="font-medium text-foreground">CV Completion</span>
              <span className="text-primary font-bold">{completionPercentage}%</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-500 ease-out"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
            {completionPercentage < 100 && (
              <p className="text-xs text-muted-foreground">
                {completionPercentage < 35 && "Start by filling in your personal information"}
                {completionPercentage >= 35 && completionPercentage < 55 && "Great! Add your education history"}
                {completionPercentage >= 55 && completionPercentage < 75 && "Almost there! Add your work experience"}
                {completionPercentage >= 75 && "Finish up with your skills and languages"}
              </p>
            )}
            {completionPercentage === 100 && (
              <p className="text-xs text-primary font-medium flex items-center gap-1">
                <CheckCircle2 className="size-3" />
                Your CV is complete! Enhance it with AI in Step 7
              </p>
            )}
          </div>
        </div>
      </header>

      {/* Progress Steps */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between max-w-4xl mx-auto mb-8 overflow-x-auto">
          {steps.map((step) => {
            const Icon = step.icon
            const isActive = currentStep === step.number
            const isCompleted = currentStep > step.number
            return (
              <div key={step.number} className="flex flex-col items-center gap-2 min-w-[100px]">
                <div
                  className={`size-12 rounded-full flex items-center justify-center transition-all duration-300 ${isActive
                    ? "bg-primary text-primary-foreground scale-110 shadow-lg"
                    : isCompleted
                      ? "bg-green-600 text-white"
                      : "bg-muted text-muted-foreground"
                    }`}
                >
                  {isCompleted ? <Check className="size-6" /> : <Icon className="size-6" />}
                </div>
                <span
                  className={`text-xs text-center transition-all ${isActive ? "text-foreground font-semibold" : "text-muted-foreground"
                    }`}
                >
                  {step.title}
                </span>
              </div>
            )
          })}
        </div>

        {/* Form Content */}
        <div className="max-w-3xl mx-auto">
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="text-2xl">{steps[currentStep - 1].title}</CardTitle>
              <CardDescription>
                {currentStep === 7 ? "Review and enhance your CV with AI" : "Fill in your information below"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Step 1: Template Selection & Upload */}
              {currentStep === 1 && (
                <div className="space-y-8 animate-in fade-in duration-500">
                  <div className="grid md:grid-cols-2 gap-6">
                    <Card className="border-primary/20 bg-primary/5">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Upload className="size-5" />
                          Upload Existing CV
                        </CardTitle>
                        <CardDescription>
                          Have a CV already? Upload it to auto-fill your details.
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg bg-background hover:bg-muted/50 transition-colors cursor-pointer relative">
                          <Upload className="size-8 text-muted-foreground mb-2" />
                          <p className="text-sm font-medium">Click to upload PDF or Word</p>
                          <p className="text-xs text-muted-foreground mt-1">Max 5MB</p>
                          <Input
                            type="file"
                            accept=".pdf,.doc,.docx"
                            className="absolute inset-0 opacity-0 cursor-pointer"
                            onChange={handleFileUpload}
                          />
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <LayoutTemplate className="size-5" />
                          Choose Template
                        </CardTitle>
                        <CardDescription>
                          Select a design for your new CV.
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {templates.map(t => (
                          <div
                            key={t.id}
                            onClick={() => {
                              setSelectedTemplate(t.id)
                              setCvData((prev) => ({ ...prev, templateId: t.id }))
                            }}
                            className={`p-3 rounded-lg border cursor-pointer flex items-center justify-between transition-all ${selectedTemplate === t.id
                              ? "border-primary bg-primary/5 ring-1 ring-primary"
                              : "hover:border-primary/50"
                              }`}
                          >
                            <div>
                              <p className="font-medium">{t.name}</p>
                              <p className="text-xs text-muted-foreground">{t.description}</p>
                            </div>
                            {selectedTemplate === t.id && <CheckCircle2 className="size-4 text-primary" />}
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}

              {/* Step 2: Personal Information */}
              {currentStep === 2 && (
                <div className="space-y-6 animate-in fade-in duration-500">
                  <div className="space-y-2">
                    <Label htmlFor="fullName" className="flex items-center gap-2">
                      Full Name <span className="text-red-500">*</span>
                      {getStepIcon(fieldStatus.fullName)}
                    </Label>
                    <Input
                      id="fullName"
                      placeholder="e.g., Abdul Kamara"
                      value={cvData.personalInfo?.fullName || ""}
                      onChange={(e) => {
                        const value = e.target.value.replace(/[^a-zA-Z\s]/g, "")
                        handlePersonalInfoChange("fullName", value)
                      }}
                      className={
                        fieldStatus.fullName === "invalid"
                          ? "border-red-500"
                          : fieldStatus.fullName === "valid"
                            ? "border-green-500"
                            : ""
                      }
                    />
                    {validationErrors.fullName && <p className="text-xs text-red-500">{validationErrors.fullName}</p>}
                    <p className="text-xs text-muted-foreground">Letters only, no numbers or symbols</p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="flex items-center gap-2">
                        Email <span className="text-red-500">*</span>
                        {getStepIcon(fieldStatus.email)}
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="abdul.kamara@gmail.com"
                        value={cvData.personalInfo?.email || ""}
                        onChange={(e) => handlePersonalInfoChange("email", e.target.value)}
                        className={
                          fieldStatus.email === "invalid"
                            ? "border-red-500"
                            : fieldStatus.email === "valid"
                              ? "border-green-500"
                              : ""
                        }
                      />
                      {validationErrors.email && <p className="text-xs text-red-500">{validationErrors.email}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="age" className="flex items-center gap-2">
                        Age <span className="text-red-500">*</span>
                        {getStepIcon(fieldStatus.age)}
                      </Label>
                      <Input
                        id="age"
                        type="number"
                        min="18"
                        max="30"
                        placeholder="e.g., 25"
                        value={cvData.personalInfo?.age || ""}
                        onChange={(e) => {
                          const value = e.target.value.replace(/[^0-9]/g, "")
                          handlePersonalInfoChange("age", value)
                        }}
                        className={
                          fieldStatus.age === "invalid"
                            ? "border-red-500"
                            : fieldStatus.age === "valid"
                              ? "border-green-500"
                              : ""
                        }
                      />
                      {validationErrors.age && <p className="text-xs text-red-500">{validationErrors.age}</p>}
                      <p className="text-xs text-muted-foreground">Must be between 18-30 years old</p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="addressCity">City / Town</Label>
                      <Input
                        id="addressCity"
                        placeholder="e.g., Freetown"
                        value={cvData.personalInfo?.addressCity || ""}
                        onChange={(e) => handlePersonalInfoChange("addressCity", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="addressCountry">Country</Label>
                      <Input
                        id="addressCountry"
                        placeholder="e.g., Sierra Leone"
                        value={cvData.personalInfo?.addressCountry || ""}
                        onChange={(e) => handlePersonalInfoChange("addressCountry", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="linkedin">LinkedIn Profile (Optional)</Label>
                      <Input
                        id="linkedin"
                        placeholder="https://linkedin.com/in/..."
                        value={cvData.personalInfo?.linkedin || ""}
                        onChange={(e) => handlePersonalInfoChange("linkedin", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="portfolio">Portfolio or Website (Optional)</Label>
                      <Input
                        id="portfolio"
                        placeholder="https://..."
                        value={cvData.personalInfo?.portfolio || ""}
                        onChange={(e) => handlePersonalInfoChange("portfolio", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="flex items-center gap-2">
                      Phone Number <span className="text-red-500">*</span>
                      {getStepIcon(fieldStatus.phone)}
                    </Label>
                    <div className="flex gap-2">
                      <div className="px-3 py-2 bg-muted rounded-md border border-input flex items-center">
                        <span className="text-sm font-medium">+232</span>
                      </div>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="76 123 456"
                        maxLength={8}
                        value={cvData.personalInfo?.phone || ""}
                        onChange={(e) => {
                          const value = e.target.value.replace(/[^0-9]/g, "")
                          handlePersonalInfoChange("phone", value)
                        }}
                        className={`flex-1 ${fieldStatus.phone === "invalid"
                          ? "border-red-500"
                          : fieldStatus.phone === "valid"
                            ? "border-green-500"
                            : ""
                          }`}
                      />
                    </div>
                    {validationErrors.phone && <p className="text-xs text-red-500">{validationErrors.phone}</p>}
                    <p className="text-xs text-muted-foreground">8 digits only (e.g., 76123456)</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="availability">Availability</Label>
                    <Select
                      value={cvData.availability || ""}
                      onValueChange={(value) => setCvData((prev) => ({ ...prev, availability: value }))}
                    >
                      <SelectTrigger id="availability">
                        <SelectValue placeholder="Select availability" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="immediate">Immediate</SelectItem>
                        <SelectItem value="two-weeks">2 Weeks Notice</SelectItem>
                        <SelectItem value="one-month">1 Month Notice</SelectItem>
                        <SelectItem value="flexible">Flexible</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      placeholder="e.g., Freetown, Western Area"
                      value={cvData.personalInfo?.location || ""}
                      onChange={(e) => handlePersonalInfoChange("location", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="summary">Professional Summary</Label>
                    <Textarea
                      id="summary"
                      rows={4}
                      placeholder="e.g., Motivated professional with 2 years of experience in customer service..."
                      value={cvData.personalInfo?.summary || ""}
                      onChange={(e) => handlePersonalInfoChange("summary", e.target.value)}
                      className="resize-none"
                    />
                    <div className="flex justify-between">
                      <p className="text-xs text-muted-foreground">Brief introduction about yourself</p>
                      <span className="text-xs text-muted-foreground">
                        {cvData.personalInfo?.summary?.length || 0} characters
                      </span>
                    </div>
                  </div>

                  <AISuggestionDialog
                    type="summary"
                    context={{
                      ...cvData.personalInfo,
                      education: cvData.education,
                      experience: cvData.experience,
                    }}
                    onSelect={(value) => handlePersonalInfoChange("summary", Array.isArray(value) ? value[0] : value)}
                  />
                </div>
              )}

              {/* Step 3: Education */}
              {currentStep === 3 && (
                <div className="space-y-6 animate-in fade-in duration-500">
                  {cvData.education && cvData.education.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="font-semibold text-foreground">Added Education:</h4>
                      {cvData.education.map((edu) => (
                        <div key={edu.id} className="p-4 bg-muted rounded-lg flex justify-between items-center">
                          <div>
                            <p className="font-semibold">
                              {edu.degree} in {edu.fieldOfStudy}
                            </p>
                            <p className="text-sm text-muted-foreground">{edu.institution}</p>
                            <p className="text-sm text-muted-foreground">
                              {edu.startDate} - {edu.current ? "Present" : edu.endDate}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setCvData((prev) => ({
                                ...prev,
                                education: prev.education?.filter((e) => e.id !== edu.id) || [],
                              }))
                              toast({ title: "Education removed!" })
                            }}
                          >
                            <Trash2 className="size-4 text-red-500" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="space-y-4 p-4 border-2 border-dashed border-border rounded-lg">
                    <h4 className="font-semibold text-foreground">Add Education</h4>

                    <div className="space-y-2">
                      <Label>Institution *</Label>
                      <Input
                        placeholder="e.g., Fourah Bay College, Njala University"
                        value={eduForm.institution}
                        onChange={(e) => setEduForm({ ...eduForm, institution: e.target.value })}
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Degree *</Label>
                        <Input
                          placeholder="e.g., Bachelor's, Diploma"
                          value={eduForm.degree}
                          onChange={(e) => setEduForm({ ...eduForm, degree: e.target.value })}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Field of Study</Label>
                        <Input
                          placeholder="e.g., Computer Science, Business Admin"
                          value={eduForm.fieldOfStudy}
                          onChange={(e) => setEduForm({ ...eduForm, fieldOfStudy: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Start Date</Label>
                        <Input
                          type="month"
                          value={eduForm.startDate}
                          onChange={(e) => setEduForm({ ...eduForm, startDate: e.target.value })}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>End Date</Label>
                        <Input
                          type="month"
                          value={eduForm.endDate}
                          onChange={(e) => setEduForm({ ...eduForm, endDate: e.target.value })}
                          disabled={eduForm.current}
                        />
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="current-edu"
                        checked={eduForm.current}
                        onCheckedChange={(checked) => setEduForm({ ...eduForm, current: checked as boolean })}
                      />
                      <Label htmlFor="current-edu" className="text-sm cursor-pointer">
                        I currently study here
                      </Label>
                    </div>

                    <Button type="button" onClick={addEducation} className="w-full">
                      <Plus className="size-4 mr-2" />
                      Add Education
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 4: Experience */}
              {currentStep === 4 && (
                <div className="space-y-6 animate-in fade-in duration-500">
                  {cvData.experience && cvData.experience.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="font-semibold text-foreground">Added Experience:</h4>
                      {cvData.experience.map((exp) => (
                        <div key={exp.id} className="p-4 bg-muted rounded-lg flex justify-between items-center">
                          <div>
                            <p className="font-semibold">{exp.position}</p>
                            <p className="text-sm text-muted-foreground">{exp.company}</p>
                            <p className="text-sm text-muted-foreground">
                              {exp.startDate} - {exp.current ? "Present" : exp.endDate}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setCvData((prev) => ({
                                ...prev,
                                experience: prev.experience?.filter((e) => e.id !== exp.id) || [],
                              }))
                              toast({ title: "Experience removed!" })
                            }}
                          >
                            <Trash2 className="size-4 text-red-500" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="space-y-4 p-4 border-2 border-dashed border-border rounded-lg">
                    <h4 className="font-semibold text-foreground">Add Experience</h4>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Company *</Label>
                        <Input
                          placeholder="e.g., Orange SL, Sierra Rutile, Rokel Bank"
                          value={expForm.company}
                          onChange={(e) => setExpForm({ ...expForm, company: e.target.value })}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Position *</Label>
                        <Input
                          placeholder="e.g., Marketing Intern, Sales Assistant"
                          value={expForm.position}
                          onChange={(e) => setExpForm({ ...expForm, position: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Key Responsibilities</Label>
                      <Textarea
                        placeholder="Describe your role and what you did day-to-day"
                        value={expForm.description}
                        onChange={(e) => setExpForm({ ...expForm, description: e.target.value })}
                        rows={3}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Key Achievements</Label>
                      <Textarea
                        placeholder="What did you do well? (e.g., Increased sales by 20%, Led a team of 5)"
                        value={expForm.achievements}
                        onChange={(e) => setExpForm({ ...expForm, achievements: e.target.value })}
                        rows={2}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Location</Label>
                      <Input
                        placeholder="e.g., Freetown"
                        value={expForm.location}
                        onChange={(e) => setExpForm({ ...expForm, location: e.target.value })}
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Start Date</Label>
                        <Input
                          type="month"
                          value={expForm.startDate}
                          onChange={(e) => setExpForm({ ...expForm, startDate: e.target.value })}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>End Date</Label>
                        <Input
                          type="month"
                          value={expForm.endDate}
                          onChange={(e) => setExpForm({ ...expForm, endDate: e.target.value })}
                          disabled={expForm.current}
                        />
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="current-exp"
                        checked={expForm.current}
                        onCheckedChange={(checked) => setExpForm({ ...expForm, current: checked as boolean })}
                      />
                      <Label htmlFor="current-exp" className="text-sm cursor-pointer">
                        I currently work here
                      </Label>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label>Description</Label>
                        <AISuggestionDialog
                          type="experience"
                          context={{
                            position: expForm.position,
                            company: expForm.company,
                            responsibilities: expForm.description,
                          }}
                          onSelect={(value) => {
                            const bullets = Array.isArray(value) ? value.join("\n") : value
                            setExpForm({ ...expForm, description: bullets })
                          }}
                        />
                      </div>
                      <Textarea
                        placeholder="e.g., • Assisted in developing social media campaigns that increased engagement by 30%&#10;• Conducted market research and presented findings to senior management&#10;• Managed customer inquiries and resolved issues promptly"
                        value={expForm.description}
                        onChange={(e) => setExpForm({ ...expForm, description: e.target.value })}
                        rows={4}
                      />
                    </div>

                    <Button type="button" onClick={addExperience} className="w-full">
                      <Plus className="size-4 mr-2" />
                      Add Experience
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 5: Skills */}
              {currentStep === 5 && (
                <div className="space-y-6 animate-in fade-in duration-500">
                  {cvData.skills && cvData.skills.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="font-semibold text-foreground">Your Skills:</h4>
                      <div className="flex flex-wrap gap-2">
                        {cvData.skills.map((skill, index) => (
                          <div
                            key={index}
                            className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium flex items-center gap-1"
                          >
                            {skill}
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-auto w-auto p-0.5"
                              onClick={() => {
                                setCvData((prev) => ({
                                  ...prev,
                                  skills: prev.skills?.filter((_, i) => i !== index) || [],
                                }))
                                toast({ title: "Skill removed!" })
                              }}
                            >
                              <Trash2 className="size-3 text-primary" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="space-y-4 p-4 border-2 border-dashed border-border rounded-lg">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-foreground">Add Skills</h4>
                      <AISuggestionDialog
                        type="skills"
                        context={{
                          fieldOfStudy: cvData.education?.[0]?.fieldOfStudy || "general",
                          experience: cvData.experience?.map((e) => e.position).join(", ") || "various roles",
                          interests: "",
                        }}
                        onSelect={(values) => {
                          const skills = Array.isArray(values) ? values : [values]
                          setCvData((prev) => ({
                            ...prev,
                            skills: [...(prev.skills || []), ...skills],
                          }))
                        }}
                      >
                        <Button type="button" variant="outline" size="sm">
                          <Sparkles className="size-4 mr-2" />
                          Suggest Skills with AI
                        </Button>
                      </AISuggestionDialog>
                    </div>

                    <div className="space-y-2">
                      <Label>Skill</Label>
                      <div className="flex gap-2">
                        <Input
                          placeholder="e.g., Microsoft Office, Customer Service, Data Entry"
                          value={skillInput}
                          onChange={(e) => setSkillInput(e.target.value)}
                          onKeyPress={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault()
                              addSkill()
                            }
                          }}
                        />
                        <Button type="button" onClick={addSkill}>
                          Add
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 6: Languages */}
              {currentStep === 6 && (
                <div className="space-y-6 animate-in fade-in duration-500">
                  {cvData.languages && cvData.languages.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="font-semibold text-foreground">Your Languages:</h4>
                      {cvData.languages.map((lang, index) => (
                        <div key={index} className="p-4 bg-muted rounded-lg flex justify-between items-center">
                          <span className="font-medium">{lang.language}</span>
                          <span className="text-sm text-muted-foreground capitalize">{lang.proficiency}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setCvData((prev) => ({
                                ...prev,
                                languages: prev.languages?.filter((l) => l.language !== lang.language) || [],
                              }))
                              toast({ title: "Language removed!" })
                            }}
                          >
                            <Trash2 className="size-4 text-red-500" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="space-y-4 p-4 border-2 border-dashed border-border rounded-lg">
                    <h4 className="font-semibold text-foreground">Add Language</h4>

                    <div className="space-y-2">
                      <Label>Language</Label>
                      <Input
                        placeholder="e.g., English, Krio, Mende"
                        value={langForm.language}
                        onChange={(e) => setLangForm({ ...langForm, language: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Proficiency</Label>
                      <Select
                        value={langForm.proficiency}
                        onValueChange={(value) => setLangForm({ ...langForm, proficiency: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select proficiency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="basic">Basic</SelectItem>
                          <SelectItem value="intermediate">Intermediate</SelectItem>
                          <SelectItem value="advanced">Advanced</SelectItem>
                          <SelectItem value="native">Native/Fluent</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Button type="button" onClick={addLanguage} className="w-full">
                      <Plus className="size-4 mr-2" />
                      Add Language
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 7: Certifications */}
              {currentStep === 7 && (
                <div className="space-y-6 animate-in fade-in duration-500">
                  {cvData.certifications && cvData.certifications.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="font-semibold text-foreground">Added Certifications</h4>
                      <div className="grid gap-3">
                        {cvData.certifications.map((cert) => (
                          <div key={cert.id} className="p-3 border rounded-lg bg-muted/30 flex justify-between items-start">
                            <div>
                              <p className="font-medium">{cert.name}</p>
                              <p className="text-xs text-muted-foreground">{cert.organization} ({cert.year})</p>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="size-8 text-muted-foreground hover:text-destructive"
                              onClick={() => setCvData(prev => ({ ...prev, certifications: prev.certifications?.filter(c => c.id !== cert.id) }))}
                            >
                              <Trash2 className="size-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="space-y-4 p-4 border-2 border-dashed border-border rounded-lg">
                    <h4 className="font-semibold text-foreground">Add Certification</h4>
                    <div className="space-y-2">
                      <Label>Course or Certificate Name *</Label>
                      <Input
                        placeholder="e.g., AWS Certified Developer"
                        value={certForm.name}
                        onChange={(e) => setCertForm({ ...certForm, name: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Organization / Issuer *</Label>
                      <Input
                        placeholder="e.g., Amazon Web Services"
                        value={certForm.organization}
                        onChange={(e) => setCertForm({ ...certForm, organization: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Year Completed</Label>
                      <Input
                        placeholder="e.g., 2023"
                        value={certForm.year}
                        onChange={(e) => setCertForm({ ...certForm, year: e.target.value })}
                      />
                    </div>
                    <Button type="button" onClick={addCertification} className="w-full">
                      <Plus className="size-4 mr-2" />
                      Add Certification
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 8: Projects */}
              {currentStep === 8 && (
                <div className="space-y-6 animate-in fade-in duration-500">
                  {cvData.projects && cvData.projects.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="font-semibold text-foreground">Projects</h4>
                      <div className="grid gap-3">
                        {cvData.projects.map((proj) => (
                          <div key={proj.id} className="p-3 border rounded-lg bg-muted/30 flex justify-between items-start">
                            <div>
                              <p className="font-medium">{proj.name}</p>
                              <p className="text-xs text-muted-foreground line-clamp-2">{proj.description}</p>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="size-8 text-muted-foreground hover:text-destructive"
                              onClick={() => setCvData(prev => ({ ...prev, projects: prev.projects?.filter(p => p.id !== proj.id) }))}
                            >
                              <Trash2 className="size-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="space-y-4 p-4 border-2 border-dashed border-border rounded-lg">
                    <h4 className="font-semibold text-foreground">Add Project</h4>
                    <div className="space-y-2">
                      <Label>Project Title *</Label>
                      <Input
                        placeholder="e.g., Hospital Management System"
                        value={projectForm.name}
                        onChange={(e) => setProjectForm({ ...projectForm, name: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Short Description *</Label>
                      <Textarea
                        placeholder="What was the project about?"
                        value={projectForm.description}
                        onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                        rows={2}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Outcome or Result</Label>
                      <Input
                        placeholder="e.g., Successfully launched and used by 10 departments"
                        value={projectForm.outcome}
                        onChange={(e) => setProjectForm({ ...projectForm, outcome: e.target.value })}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Link</Label>
                        <Input
                          placeholder="https://..."
                          value={projectForm.link}
                          onChange={(e) => setProjectForm({ ...projectForm, link: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Tools / Skills Used</Label>
                        <Input
                          placeholder="e.g., React, Node, SQL"
                          value={projectForm.technologies}
                          onChange={(e) => setProjectForm({ ...projectForm, technologies: e.target.value })}
                        />
                      </div>
                    </div>
                    <Button type="button" onClick={addProject} className="w-full">
                      <Plus className="size-4 mr-2" />
                      Add Project
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 9: Volunteering */}
              {currentStep === 9 && (
                <div className="space-y-6 animate-in fade-in duration-500">
                  {cvData.volunteering && cvData.volunteering.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="font-semibold text-foreground">Volunteering Experience</h4>
                      <div className="grid gap-3">
                        {cvData.volunteering.map((vol) => (
                          <div key={vol.id} className="p-3 border rounded-lg bg-muted/30 flex justify-between items-start">
                            <div>
                              <p className="font-medium">{vol.organization}</p>
                              <p className="text-xs text-muted-foreground">{vol.role}</p>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="size-8 text-muted-foreground hover:text-destructive"
                              onClick={() => setCvData(prev => ({ ...prev, volunteering: prev.volunteering?.filter(v => v.id !== vol.id) }))}
                            >
                              <Trash2 className="size-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="space-y-4 p-4 border-2 border-dashed border-border rounded-lg">
                    <h4 className="font-semibold text-foreground">Add Volunteering</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Organization Name *</Label>
                        <Input
                          placeholder="e.g., Red Cross"
                          value={volForm.organization}
                          onChange={(e) => setVolForm({ ...volForm, organization: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Role *</Label>
                        <Input
                          placeholder="e.g., Youth Mentor"
                          value={volForm.role}
                          onChange={(e) => setVolForm({ ...volForm, role: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Start Date</Label>
                        <Input
                          placeholder="e.g., Jan 2022"
                          value={volForm.startDate}
                          onChange={(e) => setVolForm({ ...volForm, startDate: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>End Date</Label>
                        <Input
                          placeholder="e.g., Present"
                          value={volForm.endDate}
                          onChange={(e) => setVolForm({ ...volForm, endDate: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>What you helped with</Label>
                      <Textarea
                        placeholder="Describe your activities"
                        value={volForm.description}
                        onChange={(e) => setVolForm({ ...volForm, description: e.target.value })}
                      />
                    </div>
                    <Button type="button" onClick={addVolunteering} className="w-full">
                      <Plus className="size-4 mr-2" />
                      Add Volunteering
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 10: Awards */}
              {currentStep === 10 && (
                <div className="space-y-6 animate-in fade-in duration-500">
                  {cvData.awards && cvData.awards.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="font-semibold text-foreground">Awards & Achievements</h4>
                      <div className="grid gap-3">
                        {cvData.awards.map((award) => (
                          <div key={award.id} className="p-3 border rounded-lg bg-muted/30 flex justify-between items-start">
                            <div>
                              <p className="font-medium">{award.name}</p>
                              <p className="text-xs text-muted-foreground">{award.organization} ({award.year})</p>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="size-8 text-muted-foreground hover:text-destructive"
                              onClick={() => setCvData(prev => ({ ...prev, awards: prev.awards?.filter(a => a.id !== award.id) }))}
                            >
                              <Trash2 className="size-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="space-y-4 p-4 border-2 border-dashed border-border rounded-lg">
                    <h4 className="font-semibold text-foreground">Add Award</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Award Name *</Label>
                        <Input
                          placeholder="e.g., Employee of the Year"
                          value={awardForm.name}
                          onChange={(e) => setAwardForm({ ...awardForm, name: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Organization *</Label>
                        <Input
                          placeholder="e.g., Company ABC"
                          value={awardForm.organization}
                          onChange={(e) => setAwardForm({ ...awardForm, organization: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Year</Label>
                        <Input
                          placeholder="e.g., 2023"
                          value={awardForm.year}
                          onChange={(e) => setAwardForm({ ...awardForm, year: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Reason for Award</Label>
                        <Input
                          placeholder="e.g., Exceptional sales performance"
                          value={awardForm.reason}
                          onChange={(e) => setAwardForm({ ...awardForm, reason: e.target.value })}
                        />
                      </div>
                    </div>
                    <Button type="button" onClick={addAward} className="w-full">
                      <Plus className="size-4 mr-2" />
                      Add Award
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 11: Hobbies */}
              {currentStep === 11 && (
                <div className="space-y-6 animate-in fade-in duration-500">
                  <div className="space-y-2">
                    <h4 className="font-semibold text-foreground">Hobbies & Interests</h4>
                    <p className="text-xs text-muted-foreground">Activities that show positive traits (sports, reading, community work)</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {cvData.hobbies?.map((hobby, index) => (
                        <span key={index} className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm flex items-center gap-2">
                          {hobby}
                          <Trash2 className="size-3 cursor-pointer" onClick={() => setCvData(prev => ({ ...prev, hobbies: prev.hobbies?.filter((_, i) => i !== index) }))} />
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Input
                        placeholder="e.g., Reading, Football, Volunteering"
                        value={hobbyInput}
                        onChange={(e) => setHobbyInput(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && addHobby()}
                      />
                      <Button onClick={addHobby} type="button">Add</Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 8: Projects */}
              {currentStep === 8 && (
                <div className="space-y-6 animate-in fade-in duration-500">
                  {cvData.projects && cvData.projects.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="font-semibold text-foreground">Added Projects:</h4>
                      {cvData.projects.map((proj) => (
                        <div key={proj.id} className="p-4 bg-muted rounded-lg flex justify-between items-center">
                          <div>
                            <p className="font-semibold">{proj.name}</p>
                            <p className="text-sm text-muted-foreground">{proj.description.substring(0, 100)}...</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setCvData(prev => ({ ...prev, projects: prev.projects?.filter(p => p.id !== proj.id) }))}
                          >
                            <Trash2 className="size-4 text-red-500" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="space-y-4 p-4 border-2 border-dashed border-border rounded-lg">
                    <h4 className="font-semibold">Add Project</h4>
                    <div className="space-y-2">
                      <Label>Project Name</Label>
                      <Input value={projectForm.name} onChange={e => setProjectForm({ ...projectForm, name: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <Label>Description</Label>
                      <Textarea value={projectForm.description} onChange={e => setProjectForm({ ...projectForm, description: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <Label>Technologies (comma separated)</Label>
                      <Input value={projectForm.technologies} onChange={e => setProjectForm({ ...projectForm, technologies: e.target.value })} />
                    </div>
                    <Button onClick={addProject} className="w-full">Add Project</Button>
                  </div>
                </div>
              )}

              {/* Step 9: Technical Writing */}
              {currentStep === 9 && (
                <div className="space-y-6 animate-in fade-in duration-500">
                  <div className="text-center space-y-2 mb-4">
                    <FileText className="size-12 text-primary mx-auto opacity-20" />
                    <h3 className="text-lg font-bold">Technical Writing & Publications</h3>
                    <p className="text-sm text-muted-foreground">Add links to articles, blog posts, or documentation you've written.</p>
                  </div>
                  {cvData.technicalWriting && cvData.technicalWriting.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="font-semibold text-foreground">Your Publications:</h4>
                      {cvData.technicalWriting.map((item) => (
                        <div key={item.id} className="p-4 bg-muted rounded-lg flex justify-between items-center border">
                          <div>
                            <p className="font-semibold">{item.title}</p>
                            <p className="text-sm text-primary">{item.platform}</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setCvData(prev => ({ ...prev, technicalWriting: prev.technicalWriting?.filter(p => p.id !== item.id) }))}
                          >
                            <Trash2 className="size-4 text-red-500" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="space-y-4 p-4 border rounded-lg bg-card shadow-sm">
                    <div className="space-y-2">
                      <Label>Title of Article/Post</Label>
                      <Input
                        placeholder="e.g., How to build a React App"
                        value={writingForm.title}
                        onChange={e => setWritingForm({ ...writingForm, title: e.target.value })}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Platform</Label>
                        <Input
                          placeholder="e.g., Medium, Hashnode, Dev.to"
                          value={writingForm.platform}
                          onChange={e => setWritingForm({ ...writingForm, platform: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Link</Label>
                        <Input
                          placeholder="https://..."
                          value={writingForm.link}
                          onChange={e => setWritingForm({ ...writingForm, link: e.target.value })}
                        />
                      </div>
                    </div>
                    <Button onClick={addWriting} className="w-full" variant="outline">
                      <Plus className="size-4 mr-2" />
                      Add Publication
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 10: Volunteering */}
              {currentStep === 10 && (
                <div className="space-y-6 animate-in fade-in duration-500">
                  {cvData.volunteering && cvData.volunteering.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="font-semibold text-foreground">Added Volunteering:</h4>
                      {cvData.volunteering.map((item) => (
                        <div key={item.id} className="p-4 bg-muted rounded-lg flex justify-between items-center">
                          <div>
                            <p className="font-semibold">{item.role}</p>
                            <p className="text-sm text-muted-foreground">{item.organization}</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setCvData(prev => ({ ...prev, volunteering: prev.volunteering?.filter(v => v.id !== item.id) }))}
                          >
                            <Trash2 className="size-4 text-red-500" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="space-y-4 p-4 border-2 border-dashed border-border rounded-lg">
                    <h4 className="font-semibold">Add Volunteering</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Organization</Label>
                        <Input value={volForm.organization} onChange={e => setVolForm({ ...volForm, organization: e.target.value })} />
                      </div>
                      <div className="space-y-2">
                        <Label>Role</Label>
                        <Input value={volForm.role} onChange={e => setVolForm({ ...volForm, role: e.target.value })} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Description</Label>
                      <Textarea value={volForm.description} onChange={e => setVolForm({ ...volForm, description: e.target.value })} />
                    </div>
                    <Button onClick={addVolunteering} className="w-full">Add Volunteering</Button>
                  </div>
                </div>
              )}

              {/* Step 11: Awards */}
              {currentStep === 11 && (
                <div className="space-y-6 animate-in fade-in duration-500">
                  {cvData.awards && cvData.awards.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="font-semibold text-foreground">Added Awards:</h4>
                      {cvData.awards.map((item) => (
                        <div key={item.id} className="p-4 bg-muted rounded-lg flex justify-between items-center">
                          <div>
                            <p className="font-semibold">{item.name}</p>
                            <p className="text-sm text-muted-foreground">{item.organization} ({item.year})</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setCvData(prev => ({ ...prev, awards: prev.awards?.filter(a => a.id !== item.id) }))}
                          >
                            <Trash2 className="size-4 text-red-500" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="space-y-4 p-4 border-2 border-dashed border-border rounded-lg">
                    <h4 className="font-semibold">Add Award</h4>
                    <div className="space-y-2">
                      <Label>Award Name</Label>
                      <Input value={awardForm.name} onChange={e => setAwardForm({ ...awardForm, name: e.target.value })} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Organization</Label>
                        <Input value={awardForm.organization} onChange={e => setAwardForm({ ...awardForm, organization: e.target.value })} />
                      </div>
                      <div className="space-y-2">
                        <Label>Year</Label>
                        <Input value={awardForm.year} onChange={e => setAwardForm({ ...awardForm, year: e.target.value })} />
                      </div>
                    </div>
                    <Button onClick={addAward} className="w-full">Add Award</Button>
                  </div>
                </div>
              )}

              {/* Step 12: Hobbies */}
              {currentStep === 12 && (
                <div className="space-y-6 animate-in fade-in duration-500">
                  <div className="space-y-4">
                    <Label className="text-lg font-bold">Hobbies & Interests</Label>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {cvData.hobbies?.map((hobby, index) => (
                        <span key={index} className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm flex items-center gap-2">
                          {hobby}
                          <Trash2 className="size-3 cursor-pointer" onClick={() => setCvData(prev => ({ ...prev, hobbies: prev.hobbies?.filter((_, i) => i !== index) }))} />
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Input
                        placeholder="e.g., Reading, Football, Volunteering"
                        value={hobbyInput}
                        onChange={(e) => setHobbyInput(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && addHobby()}
                      />
                      <Button onClick={addHobby} type="button">Add</Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 13: Referees */}
              {currentStep === 13 && (
                <div className="space-y-6 animate-in fade-in duration-500">
                  <div className="flex items-center space-x-2 mb-4">
                    <Checkbox
                      id="available-on-request"
                      checked={refereeForm.availableOnRequest}
                      onCheckedChange={(checked) => setRefereeForm({ ...refereeForm, availableOnRequest: checked as boolean })}
                    />
                    <Label htmlFor="available-on-request" className="text-sm cursor-pointer font-medium">
                      Or write: "Referees available on request"
                    </Label>
                  </div>

                  {!refereeForm.availableOnRequest && (
                    <>
                      {cvData.referees && cvData.referees.length > 0 && (
                        <div className="space-y-3">
                          <h4 className="font-semibold text-foreground">Added Referees</h4>
                          <div className="grid gap-3">
                            {cvData.referees.map((ref) => (
                              <div key={ref.id} className="p-3 border rounded-lg bg-muted/30 flex justify-between items-start">
                                <div>
                                  <p className="font-medium">{ref.name}</p>
                                  <p className="text-xs text-muted-foreground">{ref.title} at {ref.organization}</p>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="size-8 text-muted-foreground hover:text-destructive"
                                  onClick={() => setCvData(prev => ({ ...prev, referees: prev.referees?.filter(r => r.id !== ref.id) }))}
                                >
                                  <Trash2 className="size-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="space-y-4 p-4 border-2 border-dashed border-border rounded-lg">
                        <h4 className="font-semibold text-foreground">Add Referee</h4>
                        <div className="space-y-2">
                          <Label>Referee Full Name *</Label>
                          <Input
                            placeholder="e.g., Mr. John Sesay"
                            value={refereeForm.name}
                            onChange={(e) => setRefereeForm({ ...refereeForm, name: e.target.value })}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Job Title</Label>
                            <Input
                              placeholder="e.g., HR Manager"
                              value={refereeForm.title}
                              onChange={(e) => setRefereeForm({ ...refereeForm, title: e.target.value })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Organization</Label>
                            <Input
                              placeholder="e.g., Rokel Commercial Bank"
                              value={refereeForm.organization}
                              onChange={(e) => setRefereeForm({ ...refereeForm, organization: e.target.value })}
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Phone Number</Label>
                            <Input
                              placeholder="e.g., 076 123456"
                              value={refereeForm.phone}
                              onChange={(e) => setRefereeForm({ ...refereeForm, phone: e.target.value })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Email Address</Label>
                            <Input
                              placeholder="e.g., john.sesay@email.com"
                              value={refereeForm.email}
                              onChange={(e) => setRefereeForm({ ...refereeForm, email: e.target.value })}
                            />
                          </div>
                        </div>
                        <Button type="button" onClick={addReferee} className="w-full" variant="outline">
                          Add Referee
                        </Button>
                      </div>
                    </>
                  )}
                  {refereeForm.availableOnRequest && (
                    <Button type="button" onClick={addReferee} className="w-full">
                      Set Referees as Available on Request
                    </Button>
                  )}
                </div>
              )}

              {/* Step 14: Profile Photo */}
              {currentStep === 14 && (
                <div className="space-y-6 animate-in fade-in duration-500">
                  <div className="text-center space-y-4">
                    <div className="relative group w-40 h-40 mx-auto">
                      <div className="w-full h-full rounded-full bg-muted flex items-center justify-center overflow-hidden border-4 border-primary shadow-xl">
                        {profilePhotoPreview ? (
                          <img
                            src={profilePhotoPreview || "/placeholder.svg"}
                            alt="Profile"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <User className="size-20 text-muted-foreground" />
                        )}
                      </div>
                      <Label
                        htmlFor="photo-upload"
                        className="absolute bottom-2 right-2 size-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center cursor-pointer shadow-lg hover:bg-primary/90 transition-all transform hover:scale-110"
                      >
                        <Plus className="size-6" />
                      </Label>
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-2xl font-bold bg-gradient-to-r from-primary to-indigo-600 bg-clip-text text-transparent">
                        Personalize Your CV
                      </h3>
                      <p className="text-muted-foreground max-w-sm mx-auto">
                        A professional photo can increase your chances of being noticed by 21 times!
                      </p>
                    </div>

                    <div className="space-y-4 max-w-md mx-auto">
                      <div className="border-2 border-dashed border-primary/20 rounded-xl p-8 hover:border-primary/50 transition-all bg-card/50 backdrop-blur-sm group relative overflow-hidden">
                        <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={handlePhotoUpload}
                          className="cursor-pointer file:hidden absolute inset-0 opacity-0 z-10"
                          id="photo-upload"
                        />
                        <div className="flex flex-col items-center gap-3 relative z-20">
                          <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                            <Upload className="size-6 text-primary" />
                          </div>
                          <p className="text-sm font-semibold">Click or drag to upload photo</p>
                          <span className="text-xs text-muted-foreground">JPG, PNG or WEBP (Max 2MB)</span>
                        </div>
                      </div>

                      <div className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-lg text-left border border-blue-100 dark:border-blue-900/20">
                        <h4 className="font-bold text-sm text-blue-900 dark:text-blue-300 flex items-center gap-2 mb-2">
                          <CheckCircle2 className="size-4" />
                          Professional Photo Tips
                        </h4>
                        <ul className="text-xs text-blue-800/70 dark:text-blue-400/70 space-y-1.5 ml-6 list-disc">
                          <li>Use a clear, high-quality headshot</li>
                          <li>Ensure good lighting and a plain background</li>
                          <li>Wear appropriate professional attire</li>
                          <li>Smile and look directly at the camera</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 15: AI Enhancement */}
              {currentStep === 15 && (
                <div className="space-y-6 animate-in fade-in duration-500">
                  <div className="text-center space-y-4">
                    <div className="inline-flex items-center justify-center size-20 rounded-full bg-primary/10 mb-4">
                      <Sparkles className="size-10 text-primary" />
                    </div>
                    <h3 className="text-2xl font-bold">Enhance Your CV with AI</h3>
                    <p className="text-muted-foreground max-w-md mx-auto">
                      Our AI will analyze your information and make your CV more professional, impactful, and attractive
                      to employers.
                    </p>
                  </div>

                  <Card className="bg-muted/30">
                    <CardContent className="pt-6">
                      <div className="space-y-4">
                        <div className="flex items-start gap-3">
                          <CheckCircle2 className="size-5 text-green-600 mt-0.5" />
                          <div>
                            <p className="font-medium">Professional Language</p>
                            <p className="text-sm text-muted-foreground">
                              Transform your descriptions into compelling professional statements
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <CheckCircle2 className="size-5 text-green-600 mt-0.5" />
                          <div>
                            <p className="font-medium">Skills Optimization</p>
                            <p className="text-sm text-muted-foreground">
                              Highlight your most relevant skills based on industry standards
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <CheckCircle2 className="size-5 text-green-600 mt-0.5" />
                          <div>
                            <p className="font-medium">ATS-Friendly Format</p>
                            <p className="text-sm text-muted-foreground">
                              Ensure your CV passes applicant tracking systems
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <div className="flex gap-4">
                    <Button
                      onClick={handleEnhanceWithAI}
                      disabled={aiEnhancing}
                      className="flex-1 h-12 text-lg"
                      size="lg"
                    >
                      {aiEnhancing ? (
                        <>
                          <Loader2 className="mr-2 size-5 animate-spin" />
                          Enhancing...
                        </>
                      ) : (
                        <>
                          <Sparkles className="mr-2 size-5" />
                          Enhance with AI
                        </>
                      )}
                    </Button>
                  </div>

                  <Button onClick={handleSaveAndContinue} variant="default" className="w-full h-12 text-lg" size="lg">
                    {saving ? (
                      <>
                        <Loader2 className="mr-2 size-5 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        Save & Preview CV
                        <ArrowRight className="ml-2 size-5" />
                      </>
                    )}
                  </Button>
                </div>
              )}

              {/* Navigation Buttons */}
              {currentStep < 15 && (
                <div className="flex gap-4 pt-4">
                  {currentStep > 1 && (
                    <Button onClick={handlePreviousStep} variant="outline" className="flex-1 bg-transparent">
                      <ArrowLeft className="mr-2 size-4" />
                      Previous
                    </Button>
                  )}
                  <Button onClick={handleNextStep} className="flex-1">
                    Next
                    <ArrowRight className="ml-2 size-4" />
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <Toaster />
    </div >
  )
}
