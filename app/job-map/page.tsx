"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { MapPin, Navigation, Search, Briefcase, DollarSign, MapPinned, ArrowLeft, ExternalLink } from "lucide-react"
import type { Job } from "@/lib/types"
import { mockJobs } from "@/lib/mock-jobs"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"

// Mock locations for Sierra Leone districts
const jobLocations = [
  { jobId: "1", lat: 8.4657, lng: -13.2317, district: "Western Area", address: "Tower Hill, Freetown" },
  { jobId: "2", lat: 8.4845, lng: -13.2344, district: "Western Area", address: "Wilkinson Road, Freetown" },
  { jobId: "3", lat: 7.9465, lng: -12.5211, district: "Bo", address: "City Center, Bo" },
  { jobId: "4", lat: 8.8899, lng: -12.0499, district: "Makeni", address: "Main Street, Makeni" },
  { jobId: "5", lat: 8.4871, lng: -13.2372, district: "Western Area", address: "Siaka Stevens Street, Freetown" },
  { jobId: "6", lat: 8.4234, lng: -13.1794, district: "Western Area", address: "Wilberforce, Freetown" },
  { jobId: "7", lat: 7.9465, lng: -12.5211, district: "Bo", address: "Government Road, Bo" },
  { jobId: "8", lat: 8.8899, lng: -12.0499, district: "Makeni", address: "Agricultural Center, Makeni" },
  {
    jobId: "9",
    lat: 8.4657,
    lng: -13.2317,
    district: "Western Area",
    address: "Lightfoot Boston Street, Freetown",
  },
]

export default function JobMapPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [jobs, setJobs] = useState<Job[]>([])
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedDistrict, setSelectedDistrict] = useState<string>("All")
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)

  useEffect(() => {
    loadJobs()
    getUserLocation()
  }, [])

  const loadJobs = () => {
    setJobs(mockJobs)
  }

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          })
          toast({
            title: "Location Found",
            description: "Showing jobs near you",
          })
        },
        () => {
          // Default to Freetown if location access denied
          setUserLocation({ lat: 8.4657, lng: -13.2317 })
        },
      )
    } else {
      setUserLocation({ lat: 8.4657, lng: -13.2317 })
    }
  }

  const calculateDistance = (jobId: string) => {
    const jobLoc = jobLocations.find((loc) => loc.jobId === jobId)
    if (!jobLoc || !userLocation) return "N/A"

    const R = 6371 // Earth's radius in km
    const dLat = ((jobLoc.lat - userLocation.lat) * Math.PI) / 180
    const dLng = ((jobLoc.lng - userLocation.lng) * Math.PI) / 180
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((userLocation.lat * Math.PI) / 180) *
      Math.cos((jobLoc.lat * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    const distance = R * c

    if (distance < 1) return `${Math.round(distance * 1000)} m`
    return `${distance.toFixed(1)} km`
  }

  const getJobLocation = (jobId: string) => {
    return jobLocations.find((loc) => loc.jobId === jobId)
  }

  const openInMaps = (jobId: string) => {
    const location = getJobLocation(jobId)
    if (location) {
      const url = `https://www.google.com/maps/search/?api=1&query=${location.lat},${location.lng}`
      window.open(url, "_blank")
    }
  }

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.toLowerCase().includes(searchQuery.toLowerCase())
    const location = getJobLocation(job.id)
    const matchesDistrict = selectedDistrict === "All" || location?.district === selectedDistrict
    return matchesSearch && matchesDistrict
  })

  const districts = ["All", ...new Set(jobLocations.map((loc) => loc.district))]

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => router.push("/dashboard")}>
                <ArrowLeft className="size-5" />
              </Button>
              <div className="flex items-center gap-2">
                <MapPinned className="size-8 text-[#4CAF50]" />
                <h1 className="text-2xl font-bold text-foreground">Job Map</h1>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Search and Filter Bar */}
        <Card className="mb-6 border-[#4CAF50]/30">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  placeholder="Search jobs or companies..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <select
                  value={selectedDistrict}
                  onChange={(e) => setSelectedDistrict(e.target.value)}
                  className="px-4 py-2 rounded-md border border-input bg-background"
                >
                  {districts.map((district) => (
                    <option key={district} value={district}>
                      {district}
                    </option>
                  ))}
                </select>
                <Button variant="outline" onClick={getUserLocation}>
                  <Navigation className="mr-2 size-4" />
                  My Location
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Map Placeholder + Job List */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Map View */}
          <Card className="lg:sticky lg:top-4 h-fit border-[#4CAF50]/30">
            <CardHeader>
              <CardTitle>Job Locations</CardTitle>
              <CardDescription>Click a job pin to see details</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Simple map representation */}
              <div className="relative aspect-square bg-muted rounded-lg border-2 border-border overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-green-100 opacity-20" />
                {filteredJobs.map((job) => {
                  const location = getJobLocation(job.id)
                  if (!location) return null
                  // Simple positioning based on lat/lng
                  const x = ((location.lng + 13.5) / 1.5) * 100
                  const y = ((9 - location.lat) / 1.5) * 100
                  return (
                    <button
                      key={job.id}
                      onClick={() => setSelectedJob(job)}
                      className={`absolute size-8 -translate-x-1/2 -translate-y-1/2 transition-transform hover:scale-125 ${selectedJob?.id === job.id ? "scale-150" : ""
                        }`}
                      style={{ left: `${x}%`, top: `${y}%` }}
                    >
                      <MapPin
                        className={`size-8 ${selectedJob?.id === job.id ? "text-[#4CAF50]" : "text-primary"
                          } drop-shadow-lg`}
                        fill="currentColor"
                      />
                    </button>
                  )
                })}
              </div>
              <div className="mt-4 p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground text-center">
                  {filteredJobs.length} jobs found {selectedDistrict !== "All" && `in ${selectedDistrict}`}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Job List */}
          <div className="space-y-4">
            {filteredJobs.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <MapPin className="size-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2">No Jobs Found</h3>
                  <p className="text-muted-foreground">Try adjusting your search or filters</p>
                </CardContent>
              </Card>
            ) : (
              filteredJobs.map((job) => {
                const location = getJobLocation(job.id)
                const distance = calculateDistance(job.id)
                return (
                  <Card
                    key={job.id}
                    className={`cursor-pointer transition-all border-2 ${selectedJob?.id === job.id
                        ? "border-[#4CAF50] shadow-lg"
                        : "border-[#4CAF50]/20 hover:border-[#4CAF50]/50"
                      }`}
                    onClick={() => setSelectedJob(job)}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-xl">{job.title}</CardTitle>
                          <CardDescription className="text-base">{job.company}</CardDescription>
                        </div>
                        <MapPin className="size-5 text-[#4CAF50] flex-shrink-0" />
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex flex-wrap gap-4 text-sm">
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <MapPin className="size-4" />
                          <span>{location?.district || job.location}</span>
                        </div>
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Navigation className="size-4" />
                          <span>{distance} away</span>
                        </div>
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <DollarSign className="size-4" />
                          <span>{job.salary}</span>
                        </div>
                      </div>

                      {location && <p className="text-sm text-muted-foreground">{location.address}</p>}

                      {selectedJob?.id === job.id && (
                        <div className="pt-4 border-t space-y-3">
                          <p className="text-sm">{job.description}</p>
                          <div className="flex gap-2">
                            <Button
                              className="flex-1 bg-[#4CAF50] hover:bg-[#45a049]"
                              onClick={(e) => {
                                e.stopPropagation()
                                localStorage.setItem("selected_job", JSON.stringify(job))
                                router.push(`/jobs`)
                              }}
                            >
                              <Briefcase className="mr-2 size-4" />
                              Apply Now
                            </Button>
                            <Button
                              variant="outline"
                              onClick={(e) => {
                                e.stopPropagation()
                                openInMaps(job.id)
                              }}
                            >
                              <ExternalLink className="mr-2 size-4" />
                              Directions
                            </Button>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )
              })
            )}
          </div>
        </div>
      </div>

      <Toaster />
    </div>
  )
}
