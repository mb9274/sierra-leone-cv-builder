"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowRight, Briefcase, GraduationCap } from "lucide-react"

export default function OnboardingPage() {
  const router = useRouter()
  const [jobRole, setJobRole] = useState("")
  const [experienceLevel, setExperienceLevel] = useState("")

  const handleStart = () => {
    if (jobRole && experienceLevel) {
      // Save preferences for tailored suggestions
      localStorage.setItem(
        "cvbuilder_preferences",
        JSON.stringify({
          jobRole,
          experienceLevel,
        }),
      )
      router.push("/builder")
    }
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
            disabled={!jobRole || !experienceLevel}
            size="lg"
            className="w-full h-14 text-lg"
          >
            Start Building My CV
            <ArrowRight className="ml-2 size-5" />
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
