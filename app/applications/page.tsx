"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Briefcase, Calendar, FileText } from "lucide-react"
import type { JobApplication } from "@/lib/types"

export default function ApplicationsPage() {
  const router = useRouter()
  const [applications, setApplications] = useState<JobApplication[]>([])

  useEffect(() => {
    const savedApplications = localStorage.getItem("job_applications")
    if (savedApplications) {
      setApplications(JSON.parse(savedApplications))
    }
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "submitted":
        return "bg-blue-500/10 text-blue-700 border-blue-500/20"
      case "under_review":
        return "bg-yellow-500/10 text-yellow-700 border-yellow-500/20"
      case "interviewed":
        return "bg-purple-500/10 text-purple-700 border-purple-500/20"
      case "accepted":
        return "bg-green-500/10 text-green-700 border-green-500/20"
      case "rejected":
        return "bg-red-500/10 text-red-700 border-red-500/20"
      default:
        return "bg-gray-500/10 text-gray-700 border-gray-500/20"
    }
  }

  const getStatusLabel = (status: string) => {
    return status
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.push("/dashboard")}>
              <ArrowLeft className="size-5" />
            </Button>
            <div className="flex items-center gap-2">
              <FileText className="size-6 text-primary" />
              <h1 className="text-2xl font-bold text-foreground">My Applications</h1>
            </div>
          </div>
          <Button onClick={() => router.push("/jobs")}>Browse Jobs</Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {applications.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Briefcase className="size-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-bold text-foreground mb-2">No Applications Yet</h3>
              <p className="text-muted-foreground mb-4">Start applying to jobs to see your applications here.</p>
              <Button onClick={() => router.push("/jobs")}>Browse Job Opportunities</Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {applications.map((app) => (
              <Card key={app.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                      <CardTitle className="text-2xl mb-2">{app.jobTitle}</CardTitle>
                      <CardDescription className="text-base">
                        <div className="flex flex-wrap items-center gap-3 text-muted-foreground">
                          <span className="flex items-center gap-1 font-medium text-foreground">{app.company}</span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Calendar className="size-4" />
                            Applied on {new Date(app.appliedAt).toLocaleDateString()}
                          </span>
                        </div>
                      </CardDescription>
                    </div>
                    <Badge className={`px-3 py-1 text-sm font-semibold border ${getStatusColor(app.status)}`}>
                      {getStatusLabel(app.status)}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Contact Email</p>
                      <p className="font-medium">{app.applicantInfo.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Phone</p>
                      <p className="font-medium">{app.applicantInfo.phone}</p>
                    </div>
                    {app.expectedSalary && (
                      <div>
                        <p className="text-sm text-muted-foreground">Expected Salary</p>
                        <p className="font-medium">{app.expectedSalary}</p>
                      </div>
                    )}
                    {app.availableStartDate && (
                      <div>
                        <p className="text-sm text-muted-foreground">Available From</p>
                        <p className="font-medium">{new Date(app.availableStartDate).toLocaleDateString()}</p>
                      </div>
                    )}
                  </div>

                  {app.cvAttached && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <FileText className="size-4" />
                      <span>CV Attached</span>
                    </div>
                  )}

                  <div className="pt-2">
                    <p className="text-sm font-semibold text-foreground mb-2">Cover Letter Excerpt:</p>
                    <p className="text-sm text-muted-foreground line-clamp-3">{app.coverLetter}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
