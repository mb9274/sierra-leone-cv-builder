"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Sparkles, Copy } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import type { CVData } from "@/lib/types"
import { mockJobs } from "@/lib/mock-jobs"

export default function CoverLetterGenerator() {
    const { toast } = useToast()
    const [jobDescription, setJobDescription] = useState("")
    const [isGenerating, setIsGenerating] = useState(false)
    const [generatedLetter, setGeneratedLetter] = useState("")
    const [cvs, setCvs] = useState<CVData[]>([])
    const [selectedCvId, setSelectedCvId] = useState<string>("")
    const [selectedJobId, setSelectedJobId] = useState<string>("")

    useEffect(() => {
        const savedCVs = JSON.parse(localStorage.getItem("cvbuilder_cvs") || "[]")
        setCvs(savedCVs)
        if (savedCVs.length > 0) {
            setSelectedCvId(savedCVs[0].id)
        }
    }, [])

    const handleJobSelect = (jobId: string) => {
        setSelectedJobId(jobId)
        const job = mockJobs.find(j => j.id === jobId)
        if (job) {
            setJobDescription(
                `Position: ${job.title}\nCompany: ${job.company}\n\nDescription:\n${job.description}\n\nRequirements:\n${job.requirements.join(", ")}`
            )
            toast({
                title: "Job Selected",
                description: `${job.title} at ${job.company} added to description.`,
            })
        }
    }

    const handleGenerate = async () => {
        if (!jobDescription.trim()) {
            toast({
                title: "Job Description Required",
                description: "Please select a job or paste a description.",
                variant: "destructive",
            })
            return
        }

        if (!selectedCvId) {
            toast({
                title: "No CV Selected",
                description: "Please create a CV first.",
                variant: "destructive",
            })
            return
        }

        const selectedCv = cvs.find((cv) => cv.id === selectedCvId)
        if (!selectedCv) return

        setIsGenerating(true)
        try {
            const response = await fetch("/api/gemini", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    action: "generate_cover_letter",
                    prompt: jobDescription,
                    cvData: selectedCv,
                }),
            })

            const data = await response.json()
            if (data.coverLetter) {
                setGeneratedLetter(data.coverLetter)
                toast({
                    title: "Cover Letter Generated",
                    description: "Your cover letter is ready!",
                })
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to generate cover letter. Please try again.",
                variant: "destructive",
            })
        } finally {
            setIsGenerating(false)
        }
    }

    const handleCopy = () => {
        navigator.clipboard.writeText(generatedLetter)
        toast({
            title: "Copied",
            description: "Cover letter copied to clipboard.",
        })
    }

    return (
        <div className="grid md:grid-cols-2 gap-6">
            <Card>
                <CardHeader>
                    <CardTitle>Job Details</CardTitle>
                    <CardDescription>Select a job or paste the description.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Select CV</label>
                        <Select value={selectedCvId} onValueChange={setSelectedCvId}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a CV" />
                            </SelectTrigger>
                            <SelectContent>
                                {cvs.map((cv) => (
                                    <SelectItem key={cv.id} value={cv.id}>
                                        {cv.personalInfo.fullName} - {cv.personalInfo.summary.substring(0, 30)}...
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Select Job (Optional)</label>
                        <Select value={selectedJobId} onValueChange={handleJobSelect}>
                            <SelectTrigger>
                                <SelectValue placeholder="Pick a job to auto-fill" />
                            </SelectTrigger>
                            <SelectContent>
                                {mockJobs.map((job) => (
                                    <SelectItem key={job.id} value={job.id}>
                                        {job.title} at {job.company}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-background px-2 text-muted-foreground">Or paste description</span>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Job Description</label>
                        <Textarea
                            placeholder="Paste the job posting here..."
                            className="min-h-[200px]"
                            value={jobDescription}
                            onChange={(e) => {
                                setJobDescription(e.target.value)
                                setSelectedJobId("")
                            }}
                        />
                    </div>

                    <Button onClick={handleGenerate} disabled={isGenerating} className="w-full">
                        {isGenerating ? (
                            <>
                                <Loader2 className="mr-2 size-4 animate-spin" />
                                Generating...
                            </>
                        ) : (
                            <>
                                <Sparkles className="mr-2 size-4" />
                                Generate Cover Letter
                            </>
                        )}
                    </Button>
                </CardContent>
            </Card>

            <Card className="h-full flex flex-col">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <div className="space-y-1">
                        <CardTitle>Generated Letter</CardTitle>
                        <CardDescription>Your tailored cover letter will appear here.</CardDescription>
                    </div>
                    {generatedLetter && (
                        <Button variant="outline" size="icon" onClick={handleCopy}>
                            <Copy className="size-4" />
                        </Button>
                    )}
                </CardHeader>
                <CardContent className="flex-1">
                    {generatedLetter ? (
                        <div className="prose dark:prose-invert max-w-none whitespace-pre-wrap p-4 bg-muted/50 rounded-lg h-full overflow-auto text-sm leading-relaxed">
                            {generatedLetter}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-[400px] text-muted-foreground border-2 border-dashed rounded-lg">
                            <Sparkles className="size-12 mb-4 opacity-20" />
                            <p>Ready to generate</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
