"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Briefcase, MapPin, DollarSign, Clock, TrendingUp, ExternalLink, Map, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import type { CVData, Job } from "@/lib/types"
import { mockJobs } from "@/lib/mock-jobs"
import { scanCVForJobs } from "@/lib/ai-suggestions"
import { JobApplicationModal } from "@/components/job-application-modal"

export default function JobsPage() {
  const router = useRouter()
  const [jobs, setJobs] = useState<Job[]>([])
  const [hasCV, setHasCV] = useState(false)
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)
  const [viewMode, setViewMode] = useState<"list" | "map">("list")
  const [selectedMapJob, setSelectedMapJob] = useState<string | null>(null)
  const [locationQuery, setLocationQuery] = useState("")

  const filteredJobs = jobs.filter(job =>
    locationQuery === "" ||
    job.location.toLowerCase().includes(locationQuery.toLowerCase()) ||
    job.title.toLowerCase().includes(locationQuery.toLowerCase()) ||
    job.company.toLowerCase().includes(locationQuery.toLowerCase())
  )

  useEffect(() => {
    const savedCV = localStorage.getItem("cvbuilder_current")

    if (savedCV) {
      const cvData: CVData = JSON.parse(savedCV)
      setHasCV(true)
      const matchedJobs = scanCVForJobs(cvData, mockJobs)
      setJobs(matchedJobs)
    } else {
      setJobs(mockJobs)
      setHasCV(false)
    }
  }, [])

  const getMatchColor = (score: number) => {
    if (score >= 70) return "bg-green-500/10 text-green-700 border-green-500/20"
    if (score >= 40) return "bg-yellow-500/10 text-yellow-700 border-yellow-500/20"
    return "bg-gray-500/10 text-gray-700 border-gray-500/20"
  }

  const getMatchLabel = (score: number) => {
    if (score >= 70) return "Excellent Match"
    if (score >= 40) return "Good Match"
    return "Potential Match"
  }

  const openDirections = (job: Job) => {
    if (job.coordinates) {
      const url = `https://www.google.com/maps/dir/?api=1&destination=${job.coordinates.lat},${job.coordinates.lng}`
      window.open(url, "_blank")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.push("/dashboard")}>
              <ArrowLeft className="size-5" />
            </Button>
            <div className="flex items-center gap-2">
              <Briefcase className="size-6 text-primary" />
              <h1 className="text-2xl font-bold text-foreground">Job Opportunities</h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant={viewMode === "list" ? "default" : "outline"} size="sm" onClick={() => setViewMode("list")}>
              <Briefcase className="size-4 mr-2" />
              List View
            </Button>
            <Button variant={viewMode === "map" ? "default" : "outline"} size="sm" onClick={() => setViewMode("map")}>
              <Map className="size-4 mr-2" />
              Map View
            </Button>
            {!hasCV && <Button onClick={() => router.push("/builder")}>Create CV</Button>}
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Info Banner */}
        {hasCV && (
          <Card className="mb-8 border-2 border-primary/20 bg-primary/5">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="size-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="size-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-foreground mb-1">AI-Powered Job Matching</h3>
                  <p className="text-muted-foreground">
                    We've analyzed your CV and ranked these jobs based on how well your skills and experience match the
                    requirements. Jobs with higher match scores are better suited to your profile.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {!hasCV && (
          <Card className="mb-8 border-2 border-yellow-500/20 bg-yellow-500/5">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="size-12 rounded-lg bg-yellow-500/10 flex items-center justify-center flex-shrink-0">
                  <Briefcase className="size-6 text-yellow-700" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-foreground mb-1">Create Your CV for Better Matches</h3>
                  <p className="text-muted-foreground mb-4">
                    Build a professional CV to get personalized job recommendations based on your skills and experience.
                  </p>
                  <Button onClick={() => router.push("/builder")}>Create CV Now</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {viewMode === "list" ? (
          // List View
          <div className="grid gap-6">
            <div className="relative mb-6">
              <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search by location (e.g., Bo, Freetown)..."
                className="pl-10 h-12 text-lg"
                value={locationQuery}
                onChange={(e) => setLocationQuery(e.target.value)}
              />
            </div>

            {filteredJobs.length === 0 && (
              <div className="text-center py-12 bg-muted/30 rounded-lg">
                <MapPin className="size-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No jobs found in "{locationQuery}"</h3>
                <p className="text-muted-foreground">Try searching for a different location.</p>
              </div>
            )}

            {filteredJobs.map((job) => (
              <Card key={job.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                      <CardTitle className="text-2xl mb-2">{job.title}</CardTitle>
                      <CardDescription className="text-base">
                        <div className="flex flex-wrap items-center gap-3 text-muted-foreground">
                          <span className="flex items-center gap-1 font-medium text-foreground">{job.company}</span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <MapPin className="size-4" />
                            {job.location}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Clock className="size-4" />
                            {job.postedDate}
                          </span>
                        </div>
                      </CardDescription>
                    </div>
                    {hasCV && job.matchScore > 0 && (
                      <Badge className={`px-3 py-1 text-sm font-semibold border ${getMatchColor(job.matchScore)}`}>
                        {job.matchScore}% {getMatchLabel(job.matchScore)}
                      </Badge>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="flex flex-wrap gap-4">
                    <Badge variant="secondary" className="px-3 py-1">
                      {job.type}
                    </Badge>
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <DollarSign className="size-4" />
                      {job.salary}
                    </span>
                  </div>

                  <p className="text-foreground leading-relaxed">{job.description}</p>

                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Requirements:</h4>
                    <div className="flex flex-wrap gap-2">
                      {job.requirements.map((req, index) => (
                        <Badge key={index} variant="outline" className="px-3 py-1">
                          {req}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 flex gap-2">
                    <Button className="flex-1 sm:flex-initial" onClick={() => setSelectedJob(job)}>
                      Apply Now
                      <ExternalLink className="ml-2 size-4" />
                    </Button>
                    {job.coordinates && (
                      <Button variant="outline" onClick={() => openDirections(job)}>
                        <MapPin className="mr-2 size-4" />
                        Get Directions
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Map Container */}
            <Card className="lg:col-span-1 h-[600px] sticky top-4">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="size-5" />
                  Job Locations in Sierra Leone
                </CardTitle>
                <CardDescription>Click on a job marker to see details</CardDescription>
              </CardHeader>
              <CardContent className="h-[500px]">
                <div className="relative w-full h-full bg-gradient-to-br from-blue-50 to-green-50 rounded-lg overflow-hidden border-2 border-border">
                  {/* SVG Map of Sierra Leone with job markers */}
                  <svg viewBox="0 0 500 400" className="w-full h-full">
                    <path
                      d="M 100 80 L 150 60 L 200 55 L 250 60 L 300 75 L 350 95 L 380 120 L 400 150 L 410 190 L 400 230 L 380 270 L 350 300 L 300 320 L 250 330 L 200 325 L 150 310 L 110 280 L 85 240 L 75 200 L 80 150 L 90 110 Z"
                      fill="#e8f5e9"
                      stroke="#4CAF50"
                      strokeWidth="3"
                      opacity="0.8"
                    />

                    <text x="150" y="150" fontSize="12" fill="#666" fontWeight="bold">
                      Western Area
                    </text>
                    <text x="250" y="270" fontSize="12" fill="#666" fontWeight="bold">
                      Southern
                    </text>
                    <text x="300" y="120" fontSize="12" fill="#666" fontWeight="bold">
                      Northern
                    </text>

                    {jobs.map((job, index) => {
                      // Map real Sierra Leone coordinates to SVG space
                      // Sierra Leone bounds: lat 6.9-10°N, lng -13.3 to -10.3°E
                      // Freetown: ~8.47°N, -13.23°E (western coast)
                      // Bo: ~7.96°N, -11.74°E (central-south)
                      // Makeni: ~8.88°N, -12.04°E (central-north)

                      let x = 200,
                        y = 200 // default center

                      if (job.location.includes("Freetown")) {
                        // Western coastal city
                        x = 120 + Math.random() * 40
                        y = 180 + Math.random() * 40
                      } else if (job.location.includes("Bo")) {
                        // Southern central region
                        x = 240
                        y = 270
                      } else if (job.location.includes("Makeni")) {
                        // Northern central region
                        x = 280
                        y = 130
                      }

                      return (
                        <g
                          key={job.id}
                          onClick={() => setSelectedMapJob(job.id)}
                          className="cursor-pointer hover:opacity-80 transition-opacity"
                        >
                          <circle
                            cx={x}
                            cy={y}
                            r={selectedMapJob === job.id ? "12" : "8"}
                            fill={selectedMapJob === job.id ? "#4CAF50" : "#2196F3"}
                            stroke="white"
                            strokeWidth="2"
                          />
                          <text x={x} y={y + 25} textAnchor="middle" fontSize="10" fill="#333" fontWeight="bold">
                            {index + 1}
                          </text>
                        </g>
                      )
                    })}
                  </svg>

                  {/* Legend */}
                  <div className="absolute bottom-4 left-4 bg-white p-3 rounded-lg shadow-lg border">
                    <p className="text-xs font-semibold mb-2 flex items-center gap-2">
                      <MapPin className="size-3" />
                      Sierra Leone Job Locations:
                    </p>
                    <div className="space-y-1 text-xs">
                      <div className="flex items-center gap-2">
                        <div className="size-3 rounded-full bg-blue-500"></div>
                        <span className="font-medium">Freetown</span>
                        <span className="text-muted-foreground">(Western - 6 jobs)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="size-3 rounded-full bg-blue-500"></div>
                        <span className="font-medium">Bo</span>
                        <span className="text-muted-foreground">(Southern - 1 job)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="size-3 rounded-full bg-blue-500"></div>
                        <span className="font-medium">Makeni</span>
                        <span className="text-muted-foreground">(Northern - 1 job)</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Job List for Map View */}
            <div className="lg:col-span-1 space-y-4">
              {jobs.map((job, index) => (
                <Card
                  key={job.id}
                  className={`cursor-pointer transition-all ${selectedMapJob === job.id ? "border-2 border-[#4CAF50] shadow-lg" : "hover:shadow-md"
                    }`}
                  onClick={() => setSelectedMapJob(job.id)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start gap-3">
                      <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 font-bold text-primary">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-lg line-clamp-1">{job.title}</CardTitle>
                        <CardDescription className="text-sm">
                          {job.company} • {job.location}
                        </CardDescription>
                      </div>
                      {hasCV && job.matchScore > 0 && (
                        <Badge className={`text-xs ${getMatchColor(job.matchScore)}`}>{job.matchScore}%</Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-muted-foreground line-clamp-2">{job.description}</p>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary" className="text-xs">
                        {job.type}
                      </Badge>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <DollarSign className="size-3" />
                        {job.salary}
                      </span>
                    </div>
                    <div className="flex gap-2 pt-2">
                      <Button
                        size="sm"
                        className="flex-1"
                        onClick={(e) => {
                          e.stopPropagation()
                          setSelectedJob(job)
                        }}
                      >
                        Apply Now
                      </Button>
                      {job.coordinates && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation()
                            openDirections(job)
                          }}
                        >
                          <MapPin className="size-4" />
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {jobs.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <Briefcase className="size-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-bold text-foreground mb-2">No Jobs Available</h3>
              <p className="text-muted-foreground">Check back later for new opportunities.</p>
            </CardContent>
          </Card>
        )}
      </div>

      {selectedJob && <JobApplicationModal job={selectedJob} onClose={() => setSelectedJob(null)} />}
    </div>
  )
}
