"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowRight, Briefcase, GraduationCap } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useToast } from "@/hooks/use-toast"
import type { CVData } from "@/lib/types"

export default function OnboardingPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [jobRole, setJobRole] = useState("")
  const [experienceLevel, setExperienceLevel] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Check authentication
    const checkAuth = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push("/auth/sign-in")
      }
    }
    checkAuth()
  }, [router])

  const handleStart = async () => {
    if (!jobRole || !experienceLevel) {
      toast({
        title: "Missing Information",
        description: "Please select both job role and experience level.",
        variant: "destructive"
      })
      return
    }

    setIsLoading(true)
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push("/auth/sign-in")
        return
      }

      // Create a new CV with basic structure
      const newCV: Omit<CVData, 'id'> = {
        personalInfo: {
          fullName: "",
          email: user.email || "",
          phone: "",
          location: "",
          age: "",
          summary: getSummaryByRole(jobRole, experienceLevel)
        },
        education: [],
        experience: [],
        skills: getSkillsByRole(jobRole),
        languages: [],
        createdAt: new Date(),
        updatedAt: new Date()
      }

      // Save to Supabase
      const { data, error } = await supabase
        .from('cvs')
        .insert({
          user_id: user.id,
          data: newCV
        })
        .select()
        .single()

      if (error) throw error

      // Store the CV with database-generated UUID
      const cvWithId = {
        ...newCV,
        id: data.id
      }
      
      sessionStorage.setItem("cvbuilder_current", JSON.stringify(cvWithId))
      
      toast({
        title: "CV Created",
        description: "Your CV has been created successfully!"
      })

      // Navigate to builder
      router.push("/builder")
      
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create CV. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const getSummaryByRole = (role: string, level: string): string => {
    const summaries: Record<string, Record<string, string>> = {
      banking: {
        fresh: "Recent graduate with strong analytical skills and knowledge of financial principles, eager to contribute to a dynamic banking team.",
        entry: "Banking professional with 1-2 years experience in customer service and financial operations, seeking to grow in the industry.",
        experienced: "Experienced banking professional with expertise in financial analysis, risk management, and client relationship management."
      },
      ngo: {
        fresh: "Passionate recent graduate committed to making positive social impact through dedicated community development work.",
        entry: "Development professional with experience in project coordination and community engagement, seeking to drive meaningful change.",
        experienced: "Seasoned NGO professional with proven track record in program management and sustainable development initiatives."
      },
      teaching: {
        fresh: "Dedicated education graduate with strong pedagogical skills and passion for student development.",
        entry: "Educator with classroom experience and commitment to fostering inclusive learning environments.",
        experienced: "Experienced teacher with expertise in curriculum development and educational leadership."
      },
      marketing: {
        fresh: "Creative marketing graduate with fresh perspectives and digital media skills ready to drive brand growth.",
        entry: "Marketing professional with experience in campaign management and social media strategy.",
        experienced: "Strategic marketing leader with proven track record in brand development and market expansion."
      },
      it: {
        fresh: "Tech-savvy graduate with strong programming skills and passion for innovative solutions.",
        entry: "IT professional with experience in system administration and technical support.",
        experienced: "Seasoned IT expert with expertise in software development and infrastructure management."
      }
    }

    return summaries[role]?.[level] || "Professional seeking opportunities to contribute skills and grow in a dynamic environment."
  }

  const getSkillsByRole = (role: string): string[] => {
    const skills: Record<string, string[]> = {
      banking: ["Customer Service", "Financial Analysis", "Risk Assessment", "Microsoft Office", "Communication"],
      ngo: ["Project Management", "Community Development", "Report Writing", "Stakeholder Engagement", "Monitoring & Evaluation"],
      teaching: ["Lesson Planning", "Classroom Management", "Curriculum Development", "Student Assessment", "Communication"],
      marketing: ["Digital Marketing", "Content Creation", "Social Media Management", "Market Research", "Analytics"],
      it: ["Programming", "Database Management", "Network Administration", "Problem Solving", "Technical Support"],
      healthcare: ["Patient Care", "Medical Records", "Communication", "Empathy", "Attention to Detail"],
      hospitality: ["Customer Service", "Multi-tasking", "Communication", "Problem Solving", "Team Work"],
      agriculture: ["Crop Management", "Agricultural Planning", "Sustainability", "Project Management", "Research"],
      administration: ["Office Management", "Microsoft Office", "Communication", "Organization", "Time Management"]
    }

    return skills[role] || ["Communication", "Team Work", "Problem Solving", "Time Management"]
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full shadow-2xl border-2">
        <CardHeader className="text-center space-y-2 pb-8">
          <CardTitle className="text-4xl font-bold">Let's Get Started!</CardTitle>
          <CardDescription className="text-lg">
            Tell us a bit about yourself so we can create the perfect CV for you
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Job Role Selection */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Briefcase className="size-5 text-primary" />
              <Label htmlFor="jobRole" className="text-lg font-semibold">
                What type of job are you looking for?
              </Label>
            </div>
            <Select value={jobRole} onValueChange={setJobRole}>
              <SelectTrigger id="jobRole" className="h-12 text-base">
                <SelectValue placeholder="Select job category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="banking">Banking & Finance</SelectItem>
                <SelectItem value="ngo">NGO & Development</SelectItem>
                <SelectItem value="teaching">Teaching & Education</SelectItem>
                <SelectItem value="marketing">Marketing & Sales</SelectItem>
                <SelectItem value="it">Information Technology</SelectItem>
                <SelectItem value="healthcare">Healthcare & Nursing</SelectItem>
                <SelectItem value="hospitality">Hospitality & Tourism</SelectItem>
                <SelectItem value="agriculture">Agriculture & Farming</SelectItem>
                <SelectItem value="administration">Administration & Office</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Experience Level */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <GraduationCap className="size-5 text-primary" />
              <Label className="text-lg font-semibold">What's your experience level?</Label>
            </div>
            <RadioGroup value={experienceLevel} onValueChange={setExperienceLevel} className="space-y-3">
              <div className="flex items-center space-x-3 p-4 border-2 rounded-lg hover:border-primary transition-all cursor-pointer">
                <RadioGroupItem value="fresh" id="fresh" />
                <Label htmlFor="fresh" className="cursor-pointer flex-1">
                  <div className="font-semibold">Fresh Graduate</div>
                  <div className="text-sm text-muted-foreground">
                    Just finished school or university, little to no work experience
                  </div>
                </Label>
              </div>
              <div className="flex items-center space-x-3 p-4 border-2 rounded-lg hover:border-primary transition-all cursor-pointer">
                <RadioGroupItem value="entry" id="entry" />
                <Label htmlFor="entry" className="cursor-pointer flex-1">
                  <div className="font-semibold">Entry Level</div>
                  <div className="text-sm text-muted-foreground">1-2 years of work experience</div>
                </Label>
              </div>
              <div className="flex items-center space-x-3 p-4 border-2 rounded-lg hover:border-primary transition-all cursor-pointer">
                <RadioGroupItem value="experienced" id="experienced" />
                <Label htmlFor="experienced" className="cursor-pointer flex-1">
                  <div className="font-semibold">Experienced Professional</div>
                  <div className="text-sm text-muted-foreground">3+ years of work experience</div>
                </Label>
              </div>
            </RadioGroup>
          </div>

          <Button
            onClick={handleStart}
            disabled={!jobRole || !experienceLevel || isLoading}
            size="lg"
            className="w-full h-14 text-lg"
          >
            {isLoading ? (
              <>
                <div className="inline-block animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Creating Your CV...
              </>
            ) : (
              <>
                Start Building My CV
                <ArrowRight className="ml-2 size-5" />
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
