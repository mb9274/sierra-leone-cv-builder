"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, MessageSquare, Mic, Send, User, Bot, ArrowLeft, Volume2, VolumeX } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import type { CVData } from "@/lib/types"

interface Message {
  role: "user" | "assistant"
  content: string
}

export default function MockInterviewPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [cvs, setCvs] = useState<CVData[]>([])
  const [selectedCvId, setSelectedCvId] = useState<string>("")
  const [isStarted, setIsStarted] = useState(false)
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const savedCVs = JSON.parse(localStorage.getItem("cvbuilder_cvs") || "[]")
    setCvs(savedCVs)
    if (savedCVs.length > 0) {
      setSelectedCvId(savedCVs[0].id)
    }
  }, [])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  // Stop speech when component unmounts
  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel()
    }
  }, [])

  const speak = (text: string) => {
    if (!isVoiceEnabled) return

    window.speechSynthesis.cancel() // Stop any current speech
    const utterance = new SpeechSynthesisUtterance(text)

    // Try to find a good voice
    const voices = window.speechSynthesis.getVoices()
    // Prefer English/Google voices
    const preferredVoice = voices.find(v => v.name.includes("Google") && v.name.includes("English")) ||
      voices.find(v => v.name.includes("English")) ||
      voices[0]

    if (preferredVoice) utterance.voice = preferredVoice

    utterance.rate = 1.0
    utterance.pitch = 1.0
    window.speechSynthesis.speak(utterance)
  }

  const handleStart = async () => {
    if (!selectedCvId) return
    setIsStarted(true)
    setIsLoading(true)

    // Initial call to get questions
    await sendMessage("start")
  }

  const sendMessage = async (text: string) => {
    const selectedCv = cvs.find((cv) => cv.id === selectedCvId)
    if (!selectedCv) return

    if (text !== "start") {
      setMessages((prev) => [...prev, { role: "user", content: text }])
    }

    setIsLoading(true)
    try {
      const response = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "mock_interview",
          prompt: text,
          cvData: selectedCv,
        }),
      })

      const data = await response.json()

      let aiResponse = ""
      if (data.questions && data.questions.length > 0) {
        aiResponse = "Welcome! I've reviewed your CV. Here are 5 potential questions we could discuss. Which one would you like to start with?\n\n" +
          data.questions.map((q: string, i: number) => `${i + 1}. ${q}`).join("\n")
      } else {
        aiResponse = data.message || "I didn't catch that. Could you say it again?"
      }

      setMessages((prev) => [...prev, { role: "assistant", content: aiResponse }])
      speak(aiResponse)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to connect to AI interviewer.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return
    sendMessage(input)
    setInput("")
  }

  if (!isStarted) {
    return (
      <div className="min-h-screen bg-muted/30 p-4 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>AI Mock Interview</CardTitle>
            <CardDescription>Practice your interview skills with an AI recruiter.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Select CV for Context</label>
              <Select value={selectedCvId} onValueChange={setSelectedCvId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a CV" />
                </SelectTrigger>
                <SelectContent>
                  {cvs.map((cv) => (
                    <SelectItem key={cv.id} value={cv.id}>
                      {cv.personalInfo.fullName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="bg-blue-50 text-blue-800 p-4 rounded-lg text-sm">
              <div className="flex items-start gap-3 mb-2">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Bot className="size-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-semibold">AI Recruiter</p>
                  <p className="text-xs opacity-70">Powered by Gemini</p>
                </div>
              </div>
              <p>The AI will analyze your CV and:</p>
              <ul className="list-disc ml-4 mt-2 space-y-1">
                <li>Generate relevant questions</li>
                <li>Simulate a real conversation</li>
                <li>Provide feedback on your answers</li>
              </ul>
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant={isVoiceEnabled ? "default" : "outline"}
                onClick={() => setIsVoiceEnabled(!isVoiceEnabled)}
                className="w-full"
              >
                {isVoiceEnabled ? <Volume2 className="mr-2 size-4" /> : <VolumeX className="mr-2 size-4" />}
                {isVoiceEnabled ? "Voice Enabled" : "Enable Voice"}
              </Button>
            </div>

          </CardContent>
          <CardFooter>
            <Button onClick={handleStart} className="w-full" size="lg">
              Start Interview
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-muted/30 flex flex-col">
      <header className="bg-background border-b p-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="size-5" />
          </Button>
          <div>
            <h1 className="font-bold">Mock Interview</h1>
            <p className="text-xs text-muted-foreground">AI Recruiter</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsVoiceEnabled(!isVoiceEnabled)}
          className={isVoiceEnabled ? "text-primary bg-primary/10" : "text-muted-foreground"}
        >
          {isVoiceEnabled ? <Volume2 className="size-5" /> : <VolumeX className="size-5" />}
        </Button>
      </header>

      <div className="flex-1 overflow-hidden p-4 max-w-3xl mx-auto w-full flex flex-col">
        <ScrollArea className="flex-1 pr-4" ref={scrollRef}>
          <div className="space-y-4 pb-4">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
              >
                <div
                  className={`size-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                    }`}
                >
                  {msg.role === "user" ? <User className="size-4" /> : <Bot className="size-4" />}
                </div>
                <div
                  className={`rounded-lg p-3 max-w-[80%] text-sm whitespace-pre-wrap ${msg.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-white border shadow-sm"
                    }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-3">
                <div className="size-8 rounded-full bg-muted flex items-center justify-center">
                  <Bot className="size-4" />
                </div>
                <div className="bg-white border shadow-sm rounded-lg p-3">
                  <Loader2 className="size-4 animate-spin" />
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your answer..."
            className="flex-1"
            disabled={isLoading}
          />
          <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
            <Send className="size-4" />
          </Button>
        </form>
      </div>
    </div>
  )
}
