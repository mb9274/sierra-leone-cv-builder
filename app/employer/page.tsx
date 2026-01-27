"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Briefcase,
  Plus,
  Edit,
  Trash2,
  Eye,
  Users,
  Building2,
  ArrowLeft,
  CheckCircle,
  Clock,
  X,
  FileSearch,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import type { Job, JobApplication } from "@/lib/types"

export default function EmployerPortal() {
  const router = useRouter()
  const { toast } = useToast()
  const [isEmployer, setIsEmployer] = useState(false)
  const [myJobs, setMyJobs] = useState<Job[]>([])
  const [applications, setApplications] = useState<JobApplication[]>([])
  const [isPosting, setIsPosting] = useState(false)
  const [editingJob, setEditingJob] = useState<Job | null>(null)

  // Form state
  const [jobForm, setJobForm] = useState({
    title: "",
    company: "",
    location: "",
    type: "Full-time",
    description: "",
    requirements: "",
  })

  useEffect(() => {
    // Check if user is logged in as employer
    const employerData = localStorage.getItem("employer_session")
    if (employerData) {
      setIsEmployer(true)
      loadEmployerJobs()
      loadApplications()
    }
  }, [])

  const loadEmployerJobs = () => {
    const jobs = localStorage.getItem("employer_jobs")
    if (jobs) {
      setMyJobs(JSON.parse(jobs))
    }
  }

  const loadApplications = () => {
    const apps = localStorage.getItem("job_applications")
    if (apps) {
      setApplications(JSON.parse(apps))
    }
  }

  const handleEmployerLogin = () => {
    // Simple employer authentication (in real app, use proper auth)
    const employerEmail = prompt("Enter employer email:")
    const employerPassword = prompt("Enter password:")

    if (employerEmail && employerPassword) {
      localStorage.setItem(
        "employer_session",
        JSON.stringify({
          email: employerEmail,
          loginTime: new Date().toISOString(),
        }),
      )
      setIsEmployer(true)
      toast({
        title: "Login Successful",
        description: "Welcome to the Employer Portal",
      })
    }
  }

  const handlePostJob = () => {
    if (!jobForm.title || !jobForm.company || !jobForm.description) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    const newJob: Job = {
      id: `job_${Date.now()}`,
      title: jobForm.title,
      company: jobForm.company,
      location: jobForm.location,
      type: jobForm.type,
      salary: "500 Leones/month",
      description: jobForm.description,
      requirements: jobForm.requirements.split(",").map((r) => r.trim()),
      matchScore: 0,
      postedDate: new Date().toLocaleDateString(),
      coordinates: jobForm.location.includes("Freetown") ? { lat: 8.47, lng: -13.23 } : { lat: 7.96, lng: -11.74 },
    }

    const updatedJobs = editingJob
      ? myJobs.map((j) => (j.id === editingJob.id ? { ...newJob, id: editingJob.id } : j))
      : [...myJobs, newJob]

    setMyJobs(updatedJobs)
    localStorage.setItem("employer_jobs", JSON.stringify(updatedJobs))

    // Also update main jobs list
    const allJobs = localStorage.getItem("all_jobs")
    const jobsList = allJobs ? JSON.parse(allJobs) : []
    const updatedAllJobs = editingJob
      ? jobsList.map((j: Job) => (j.id === editingJob.id ? { ...newJob, id: editingJob.id } : j))
      : [...jobsList, newJob]
    localStorage.setItem("all_jobs", JSON.stringify(updatedAllJobs))

    toast({
      title: editingJob ? "Job Updated" : "Job Posted",
      description: `${newJob.title} has been ${editingJob ? "updated" : "posted"} successfully`,
    })

    // Reset form
    setJobForm({
      title: "",
      company: "",
      location: "",
      type: "Full-time",
      description: "",
      requirements: "",
    })
    setIsPosting(false)
    setEditingJob(null)
  }

  const handleDeleteJob = (jobId: string) => {
    if (confirm("Are you sure you want to delete this job?")) {
      const updatedJobs = myJobs.filter((j) => j.id !== jobId)
      setMyJobs(updatedJobs)
      localStorage.setItem("employer_jobs", JSON.stringify(updatedJobs))

      // Also remove from main jobs list
      const allJobs = localStorage.getItem("all_jobs")
      if (allJobs) {
        const jobsList = JSON.parse(allJobs)
        const updatedAllJobs = jobsList.filter((j: Job) => j.id !== jobId)
        localStorage.setItem("all_jobs", JSON.stringify(updatedAllJobs))
      }

      toast({
        title: "Job Deleted",
        description: "The job posting has been removed",
      })
    }
  }

  const handleEditJob = (job: Job) => {
    setEditingJob(job)
    setJobForm({
      title: job.title,
      company: job.company,
      location: job.location,
      type: job.type,
      description: job.description,
      requirements: job.requirements.join(", "),
    })
    setIsPosting(true)
  }

  const getApplicationsForJob = (jobId: string) => {
    return applications.filter((app) => app.jobId === jobId)
  }

  const updateApplicationStatus = (appId: string, status: JobApplication["status"]) => {
    const updatedApps = applications.map((app) => (app.id === appId ? { ...app, status } : app))
    setApplications(updatedApps)
    localStorage.setItem("job_applications", JSON.stringify(updatedApps))

    toast({
      title: "Application Updated",
      description: `Application status changed to ${status}`,
    })
  }

  if (!isEmployer) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <div className="size-16 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Building2 className="size-8 text-primary" />
            </div>
            <CardTitle className="text-center text-2xl">Employer Portal</CardTitle>
            <CardDescription className="text-center">Post jobs and manage applications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={handleEmployerLogin} className="w-full" size="lg">
              <Building2 className="mr-2 size-5" />
              Login as Employer
            </Button>
            <Button variant="outline" onClick={() => router.push("/dashboard")} className="w-full">
              <ArrowLeft className="mr-2 size-4" />
              Back to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.push("/dashboard")}>
              <ArrowLeft className="size-5" />
            </Button>
            <div className="flex items-center gap-2">
              <Building2 className="size-6 text-primary" />
              <div>
                <h1 className="text-2xl font-bold text-foreground">Employer Portal</h1>
                <p className="text-sm text-muted-foreground">Manage your job postings</p>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => router.push("/ats-checker")}
              className="border-blue-500/40 bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100"
            >
              <FileSearch className="mr-2 size-4" />
              ATS Checker
            </Button>
            <Button onClick={() => setIsPosting(!isPosting)}>
              <Plus className="mr-2 size-4" />
              Post New Job
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="size-12 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <Briefcase className="size-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Active Jobs</p>
                  <p className="text-2xl font-bold">{myJobs.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="size-12 rounded-lg bg-green-500/10 flex items-center justify-center">
                  <Users className="size-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Applications</p>
                  <p className="text-2xl font-bold">{applications.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="size-12 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                  <Clock className="size-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Pending Review</p>
                  <p className="text-2xl font-bold">{applications.filter((a) => a.status === "submitted").length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Post Job Form */}
        {isPosting && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>{editingJob ? "Edit Job" : "Post New Job"}</CardTitle>
              <CardDescription>Fill in the details for your job posting</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Job Title *</Label>
                  <Input
                    id="title"
                    value={jobForm.title}
                    onChange={(e) => setJobForm({ ...jobForm, title: e.target.value })}
                    placeholder="e.g., Sales Manager"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company">Company Name *</Label>
                  <Input
                    id="company"
                    value={jobForm.company}
                    onChange={(e) => setJobForm({ ...jobForm, company: e.target.value })}
                    placeholder="e.g., Orange SL"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={jobForm.location}
                    onChange={(e) => setJobForm({ ...jobForm, location: e.target.value })}
                    placeholder="e.g., Freetown, Western Area"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Job Type</Label>
                  <select
                    id="type"
                    value={jobForm.type}
                    onChange={(e) => setJobForm({ ...jobForm, type: e.target.value })}
                    className="w-full h-10 px-3 rounded-md border border-input bg-background"
                  >
                    <option>Full-time</option>
                    <option>Part-time</option>
                    <option>Contract</option>
                    <option>Internship</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Job Description *</Label>
                <Textarea
                  id="description"
                  value={jobForm.description}
                  onChange={(e) => setJobForm({ ...jobForm, description: e.target.value })}
                  placeholder="Describe the role, responsibilities, and what makes this opportunity great..."
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="requirements">Requirements (comma-separated)</Label>
                <Textarea
                  id="requirements"
                  value={jobForm.requirements}
                  onChange={(e) => setJobForm({ ...jobForm, requirements: e.target.value })}
                  placeholder="e.g., Bachelor's degree, 2+ years experience, Strong communication"
                  rows={3}
                />
              </div>

              <div className="flex gap-2">
                <Button onClick={handlePostJob}>{editingJob ? "Update Job" : "Post Job"}</Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsPosting(false)
                    setEditingJob(null)
                    setJobForm({
                      title: "",
                      company: "",
                      location: "",
                      type: "Full-time",
                      description: "",
                      requirements: "",
                    })
                  }}
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Jobs and Applications Tabs */}
        <Tabs defaultValue="jobs">
          <TabsList className="mb-6">
            <TabsTrigger value="jobs">My Jobs ({myJobs.length})</TabsTrigger>
            <TabsTrigger value="applications">Applications ({applications.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="jobs" className="space-y-4">
            {myJobs.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Briefcase className="size-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2">No Jobs Posted Yet</h3>
                  <p className="text-muted-foreground mb-4">Start posting jobs to attract talented candidates</p>
                  <Button onClick={() => setIsPosting(true)}>
                    <Plus className="mr-2 size-4" />
                    Post Your First Job
                  </Button>
                </CardContent>
              </Card>
            ) : (
              myJobs.map((job) => (
                <Card key={job.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{job.title}</CardTitle>
                        <CardDescription>
                          {job.company} • {job.location} • {job.postedDate}
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => handleEditJob(job)}>
                          <Edit className="size-4" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleDeleteJob(job.id)}>
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">{job.description}</p>
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary">{job.type}</Badge>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Users className="size-4" />
                        {getApplicationsForJob(job.id).length} applications
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="applications" className="space-y-4">
            {applications.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Users className="size-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2">No Applications Yet</h3>
                  <p className="text-muted-foreground">Applications will appear here once candidates apply</p>
                </CardContent>
              </Card>
            ) : (
              applications.map((app) => (
                <Card key={app.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{app.applicantInfo.fullName}</CardTitle>
                        <CardDescription>
                          Applied for: {app.jobTitle} • {new Date(app.appliedAt).toLocaleDateString()}
                        </CardDescription>
                      </div>
                      <Badge
                        className={
                          app.status === "accepted"
                            ? "bg-green-500/10 text-green-700"
                            : app.status === "rejected"
                              ? "bg-red-500/10 text-red-700"
                              : app.status === "interviewed"
                                ? "bg-blue-500/10 text-blue-700"
                                : app.status === "under_review"
                                  ? "bg-yellow-500/10 text-yellow-700"
                                  : "bg-gray-500/10 text-gray-700"
                        }
                      >
                        {app.status.replace("_", " ")}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Email</p>
                        <p className="font-medium">{app.applicantInfo.email}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Phone</p>
                        <p className="font-medium">{app.applicantInfo.phone}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Expected Salary</p>
                        <p className="font-medium">{app.expectedSalary}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Available Start</p>
                        <p className="font-medium">{app.availableStartDate}</p>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Cover Letter:</p>
                      <p className="text-sm">{app.coverLetter}</p>
                    </div>

                    {app.references.length > 0 && (
                      <div>
                        <p className="text-sm text-muted-foreground mb-2">References:</p>
                        {app.references.map((ref, idx) => (
                          <div key={idx} className="text-sm mb-1">
                            {ref.name} - {ref.position} at {ref.company}
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="flex gap-2 pt-2">
                      {app.status === "submitted" && (
                        <>
                          <Button size="sm" onClick={() => updateApplicationStatus(app.id, "under_review")}>
                            <Eye className="mr-2 size-4" />
                            Review
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateApplicationStatus(app.id, "interviewed")}
                          >
                            Schedule Interview
                          </Button>
                        </>
                      )}
                      {app.status === "under_review" && (
                        <>
                          <Button size="sm" onClick={() => updateApplicationStatus(app.id, "interviewed")}>
                            Schedule Interview
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateApplicationStatus(app.id, "rejected")}
                          >
                            <X className="mr-2 size-4" />
                            Reject
                          </Button>
                        </>
                      )}
                      {app.status === "interviewed" && (
                        <>
                          <Button size="sm" onClick={() => updateApplicationStatus(app.id, "accepted")}>
                            <CheckCircle className="mr-2 size-4" />
                            Accept
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateApplicationStatus(app.id, "rejected")}
                          >
                            <X className="mr-2 size-4" />
                            Reject
                          </Button>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
