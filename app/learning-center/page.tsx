"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Sparkles, MessageSquare, FileText, MapPin } from "lucide-react"
import CoverLetterGenerator from "@/components/ai/cover-letter-generator" // We will create this
import MockInterview from "@/components/ai/mock-interview" // We will create this

export default function LearningCenterPage() {
    return (
        <div className="min-h-screen bg-muted/30 p-4 md:p-8">
            <div className="max-w-5xl mx-auto space-y-8">
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold flex items-center gap-2">
                        <Sparkles className="size-8 text-primary" />
                        Learning Center
                    </h1>
                    <p className="text-muted-foreground text-lg">
                        Your personal AI assistant for landing your dream job. Generate cover letters and practice for interviews in one place.
                    </p>
                </div>

                {/* Learning Center Registration Card */}
                <Card className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-0 overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
                    <CardContent className="p-8 relative z-10">
                        <div className="space-y-6">
                            <div>
                                <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
                                    <Sparkles className="size-6 text-yellow-300" />
                                    Christex Foundation Learning Center
                                </h2>
                                <p className="text-blue-100 text-lg">
                                    Ready to upgrade your skills? Register for certified classes at the Christex Foundation Learning Center.
                                </p>
                            </div>

                            {/* Location Information */}
                            <div className="flex items-start gap-2 bg-white/10 p-4 rounded-lg backdrop-blur-sm">
                                <MapPin className="size-5 text-yellow-300 mt-0.5 flex-shrink-0" />
                                <div className="flex-1">
                                    <p className="font-semibold text-white mb-1">Our Location</p>
                                    <p className="text-blue-100 text-sm">
                                        Christex Foundation, Freetown, Sierra Leone
                                    </p>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col sm:flex-row gap-3">
                                <a
                                    href="https://airtable.com/apptvIfjIHaMyTkYV/pag0vAEiN51dM8KBt/form"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="bg-white text-blue-600 hover:bg-blue-50 font-bold py-3 px-6 rounded-lg transition-all transform hover:scale-105 shadow-lg text-center"
                                >
                                    Register for Classes
                                </a>
                                <a
                                    href="https://www.google.com/maps/place/Christex+Foundation/@8.4803307,-13.2222846,17z/data=!3m1!4b1!4m6!3m5!1s0xf04c395e1620bd5:0x80b0034ae8b982d8!8m2!3d8.4803307!4d-13.2222846!16s%2Fg%2F11v0mvnt_l?entry=ttu&g_ep=EgoyMDI2MDEyNS4wIKXMDSoASAFQAw%3D%3D"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="bg-blue-500 text-white hover:bg-blue-400 font-bold py-3 px-6 rounded-lg transition-all transform hover:scale-105 shadow-lg text-center flex items-center justify-center gap-2"
                                >
                                    <MapPin className="size-5" />
                                    View Location on Map
                                </a>
                            </div>
                        </div>
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
