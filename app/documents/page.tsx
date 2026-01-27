"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Download, Printer, FileText, Mail, Phone, MapPin, Award } from "lucide-react"
import type { CVData } from "@/lib/types"

export default function DocumentsPage() {
  const router = useRouter()
  const [cvData, setCvData] = useState<CVData | null>(null)

  useEffect(() => {
    const savedCV = localStorage.getItem("cvbuilder_current")
    if (savedCV) {
      setCvData(JSON.parse(savedCV))
    } else {
      router.push("/dashboard")
    }
  }, [router])

  const handlePrint = () => {
    window.print()
  }

  const handleDownloadPDF = () => {
    window.print()
  }

  if (!cvData) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      {/* Header - Hidden when printing */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm print:hidden">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.push("/dashboard")}>
              <ArrowLeft className="size-5" />
            </Button>
            <h1 className="text-2xl font-bold text-foreground">CV Documents</h1>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handlePrint} className="border-[#4CAF50]/40 bg-transparent">
              <Printer className="mr-2 size-4" />
              Print CV
            </Button>
            <Button onClick={handleDownloadPDF} className="bg-[#4CAF50] hover:bg-[#45a049]">
              <Download className="mr-2 size-4" />
              Download PDF
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 print:p-0">
        {/* Full CV Information Document */}
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Personal Information Card */}
          <Card className="border-2 border-[#4CAF50]/40 print:border print:shadow-none">
            <CardHeader className="bg-[#4CAF50]/10">
              <CardTitle className="flex items-center gap-2 text-[#4CAF50]">
                <FileText className="size-6" />
                Personal Information
              </CardTitle>
              <CardDescription>Complete contact and personal details</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Full Name</p>
                  <p className="text-lg font-semibold text-foreground">{cvData.personalInfo.fullName}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Email Address</p>
                  <p className="text-lg font-medium text-foreground flex items-center gap-2">
                    <Mail className="size-4 text-[#4CAF50]" />
                    {cvData.personalInfo.email}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Phone Number</p>
                  <p className="text-lg font-medium text-foreground flex items-center gap-2">
                    <Phone className="size-4 text-[#4CAF50]" />
                    {cvData.personalInfo.phone}
                  </p>
                </div>
                {cvData.personalInfo.location && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Location</p>
                    <p className="text-lg font-medium text-foreground flex items-center gap-2">
                      <MapPin className="size-4 text-[#4CAF50]" />
                      {cvData.personalInfo.location}
                    </p>
                  </div>
                )}
              </div>
              {cvData.personalInfo.summary && (
                <div className="pt-4 border-t">
                  <p className="text-sm text-muted-foreground mb-2">Professional Summary</p>
                  <p className="text-foreground leading-relaxed">{cvData.personalInfo.summary}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Education Details Card */}
          {cvData.education.length > 0 && (
            <Card className="border-2 border-[#4CAF50]/40 print:border print:shadow-none">
              <CardHeader className="bg-[#4CAF50]/10">
                <CardTitle className="flex items-center gap-2 text-[#4CAF50]">
                  <Award className="size-6" />
                  Education History
                </CardTitle>
                <CardDescription>Academic qualifications and certifications</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-6">
                  {cvData.education.map((edu, index) => (
                    <div key={edu.id} className={index > 0 ? "pt-6 border-t" : ""}>
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-xl font-bold text-foreground">
                          {edu.degree} {edu.fieldOfStudy && `in ${edu.fieldOfStudy}`}
                        </h3>
                        <span className="text-sm font-medium text-[#4CAF50] bg-[#4CAF50]/10 px-3 py-1 rounded-full">
                          {edu.startDate} - {edu.current ? "Present" : edu.endDate}
                        </span>
                      </div>
                      <p className="text-lg text-muted-foreground">{edu.institution}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Experience Details Card */}
          {cvData.experience.length > 0 && (
            <Card className="border-2 border-[#4CAF50]/40 print:border print:shadow-none">
              <CardHeader className="bg-[#4CAF50]/10">
                <CardTitle className="flex items-center gap-2 text-[#4CAF50]">
                  <FileText className="size-6" />
                  Work Experience
                </CardTitle>
                <CardDescription>Professional history and achievements</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-6">
                  {cvData.experience.map((exp, index) => (
                    <div key={exp.id} className={index > 0 ? "pt-6 border-t" : ""}>
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-xl font-bold text-foreground">{exp.position}</h3>
                        <span className="text-sm font-medium text-[#4CAF50] bg-[#4CAF50]/10 px-3 py-1 rounded-full">
                          {exp.startDate} - {exp.current ? "Present" : exp.endDate}
                        </span>
                      </div>
                      <p className="text-lg text-muted-foreground mb-3">
                        {exp.company} {exp.location && `• ${exp.location}`}
                      </p>
                      {exp.description && (
                        <p className="text-foreground leading-relaxed whitespace-pre-line">{exp.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Skills & Languages Card */}
          <Card className="border-2 border-[#4CAF50]/40 print:border print:shadow-none">
            <CardHeader className="bg-[#4CAF50]/10">
              <CardTitle className="flex items-center gap-2 text-[#4CAF50]">
                <Award className="size-6" />
                Skills & Languages
              </CardTitle>
              <CardDescription>Technical and soft skills, language proficiency</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              {cvData.skills.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">Professional Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {cvData.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-4 py-2 bg-[#4CAF50]/20 text-[#4CAF50] rounded-lg text-sm font-medium border border-[#4CAF50]/30"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {cvData.languages.length > 0 && (
                <div className="pt-4 border-t">
                  <h3 className="text-lg font-semibold text-foreground mb-3">Language Proficiency</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {cvData.languages.map((lang, index) => (
                      <div key={index} className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                        <span className="font-semibold text-foreground">{lang.language}</span>
                        <span className="text-sm text-muted-foreground capitalize bg-[#4CAF50]/10 px-3 py-1 rounded-full">
                          {lang.proficiency}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Document Information Card */}
          <Card className="border-2 border-[#4CAF50]/40 print:hidden">
            <CardHeader className="bg-[#4CAF50]/10">
              <CardTitle className="flex items-center gap-2 text-[#4CAF50]">
                <FileText className="size-6" />
                Document Information
              </CardTitle>
              <CardDescription>Metadata and usage instructions</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-2">Document Created</p>
                <p className="text-lg font-medium text-foreground">
                  {new Date(cvData.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-2">How to Use This Document</p>
                <ul className="space-y-2 text-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-[#4CAF50] mt-1">•</span>
                    <span>Click "Print CV" or "Download PDF" to save a copy for job applications</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#4CAF50] mt-1">•</span>
                    <span>Use this comprehensive view to review all your information before submission</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#4CAF50] mt-1">•</span>
                    <span>Share the PDF version with employers or upload to job portals</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          body {
            background: white;
          }
          @page {
            margin: 0.75in;
          }
        }
      `}</style>
    </div>
  )
}
