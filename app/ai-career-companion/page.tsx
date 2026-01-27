"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Sparkles, MessageSquare, FileText } from "lucide-react"
import CoverLetterGenerator from "@/components/ai/cover-letter-generator" // We will create this
import MockInterview from "@/components/ai/mock-interview" // We will create this

export default function AICareerCompanionPage() {
    return (
        <div className="min-h-screen bg-muted/30 p-4 md:p-8">
            <div className="max-w-5xl mx-auto space-y-8">
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold flex items-center gap-2">
                        <Sparkles className="size-8 text-primary" />
                        AI Career Companion
                    </h1>
                    <p className="text-muted-foreground text-lg">
                        Your personal AI assistant for landing your dream job. Generate cover letters and practice for interviews in one place.
                    </p>
                </div>

                {/* Learning Center Registration Card */}
                <Card className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-0 overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
                    <CardContent className="p-8 relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                        <div>
                            <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
                                <Sparkles className="size-6 text-yellow-300" />
                                Validated Learning Center
                            </h2>
                            <p className="text-blue-100 max-w-xl text-lg">
                                Ready to upgrade your skills? Register for certified classes at the Christex Foundation Learning Center.
                            </p>
                        </div>
                        <a
                            href="https://www.christex.foundation/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-white text-blue-600 hover:bg-blue-50 font-bold py-3 px-8 rounded-lg transition-all transform hover:scale-105 shadow-lg whitespace-nowrap"
                        >
                            Register for Classes
                        </a>
                    </CardContent>
                </Card>

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
    )
}
