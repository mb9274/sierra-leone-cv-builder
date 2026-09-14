"use client"
export const dynamic = "force-dynamic"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Sparkles, MessageSquare, FileText, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import CoverLetterGenerator from "@/components/ai/cover-letter-generator"
import MockInterview from "@/components/ai/mock-interview"

export default function LearningCenterPage() {
    const router = useRouter()

    return (
        <div className="min-h-screen bg-muted/30 p-4 md:p-8">
            <div className="max-w-5xl mx-auto space-y-8">
                <div>
                    <Button variant="ghost" onClick={() => router.back()} className="mb-2">
                        <ArrowLeft className="mr-2 size-4" />
                        Back
                    </Button>
                    <div className="space-y-2">
                        <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
                        <Sparkles className="size-8 text-primary" />
                        Learning Center
                    </h1>
                    <p className="text-muted-foreground text-lg">
                        Your personal AI assistant for landing your dream job. Generate cover letters and practice for interviews in one place.
                    </p>
                </div>

                <Tabs defaultValue="cover-letter" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
                        <TabsTrigger value="cover-letter" className="flex items-center gap-2">
                            <FileText className="size-4" />
                            Cover Letter
                        </TabsTrigger>
                        <TabsTrigger value="interview" className="flex items-center gap-2">
                            <MessageSquare className="size-4" />
                            Mock Interview
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="cover-letter" className="mt-6">
                        <CoverLetterGenerator />
                    </TabsContent>

                    <TabsContent value="interview" className="mt-6">
                        <MockInterview />
                    </TabsContent>
                </Tabs>
                </div>
            </div>
        </div>
    )
}
