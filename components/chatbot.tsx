"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Bot, MessageCircle, Send, Sparkles, X } from "lucide-react"
import { generateChatbotResponse, type ChatMessage } from "@/lib/chatbot-responses"

type ChatbotProps = {
  userName?: string
  embedded?: boolean
}

const quickPrompts = [
  "How do I generate a CV?",
  "Where do I edit my location?",
  "How do I open my saved CVs?",
  "What does ATS Checker do?",
]

function buildWelcomeMessage(userName?: string) {
  const name = userName?.trim()
  if (name) {
    return `Welcome back, ${name}. I’m your AI assistant. Ask me about generating a CV, editing your location, finding saved CVs, the ATS checker, jobs, applications, or anything else in the app.`
  }

  return "Welcome. I’m your AI assistant. Ask me about generating a CV, editing your location, finding saved CVs, the ATS checker, jobs, applications, or anything else in the app."
}

export function Chatbot({ userName, embedded = false }: ChatbotProps) {
  const [isOpen, setIsOpen] = useState(embedded)
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content: buildWelcomeMessage(userName),
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (messages.length === 1 && messages[0]?.role === "assistant") {
      setMessages([
        {
          role: "assistant",
          content: buildWelcomeMessage(userName),
          timestamp: new Date(),
        },
      ])
    }
  }, [userName])

  const handleSend = (messageText?: string) => {
    const prompt = (messageText ?? input).trim()
    if (!prompt) return

    const userMessage: ChatMessage = {
      role: "user",
      content: prompt,
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsTyping(true)

    setTimeout(() => {
      const response = generateChatbotResponse(prompt, messages)
      const assistantMessage: ChatMessage = {
        role: "assistant",
        content: response,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, assistantMessage])
      setIsTyping(false)
    }, 500)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <>
      {!embedded && !isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-gradient-to-r from-emerald-500 to-green-600 shadow-lg hover:from-emerald-600 hover:to-green-700"
          aria-label="Open chat"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      )}

      {isOpen && (
        <Card
          className={
            embedded
              ? "w-full overflow-hidden border-0 bg-white/90 shadow-2xl backdrop-blur"
              : "fixed bottom-6 right-6 z-50 flex h-[32rem] w-96 flex-col overflow-hidden border-emerald-500 bg-white shadow-2xl"
          }
        >
          <div className="flex items-center justify-between bg-gradient-to-r from-emerald-500 to-green-600 p-4 text-white">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
                <Bot className="h-4 w-4" />
              </div>
              <div>
                <h3 className="font-semibold">AI CV Assistant</h3>
                <p className="text-xs text-white/80">Answers app questions and guides users</p>
              </div>
            </div>
            {!embedded && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="h-8 w-8 p-0 text-white hover:bg-white/15"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          {embedded && (
            <div className="border-b bg-emerald-50/80 px-4 py-3">
              <div className="flex flex-wrap items-center gap-2">
                <Badge className="bg-emerald-600 text-white hover:bg-emerald-600">
                  <Sparkles className="mr-1 h-3.5 w-3.5" />
                  Live dashboard help
                </Badge>
                <span className="text-sm text-emerald-900">
                  Ask me about the app, your CVs, jobs, or how to use any feature.
                </span>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {quickPrompts.map((prompt) => (
                  <Button
                    key={prompt}
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleSend(prompt)}
                    className="border-emerald-200 bg-white text-emerald-800 hover:bg-emerald-50"
                  >
                    {prompt}
                  </Button>
                ))}
              </div>
            </div>
          )}

          <div className="flex-1 space-y-4 overflow-y-auto bg-gradient-to-b from-white to-slate-50 p-4">
            {messages.map((message, index) => (
              <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[80%] rounded-lg px-4 py-2 ${
                    message.role === "user"
                      ? "bg-emerald-600 text-white shadow"
                      : "border border-slate-200 bg-white text-slate-900 shadow-sm"
                  }`}
                >
                  <p className="whitespace-pre-line text-sm">{message.content}</p>
                  <span className="mt-1 block text-xs opacity-70">
                    {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="rounded-lg bg-white px-4 py-2 shadow-sm border border-slate-200">
                  <div className="flex gap-1">
                    <span
                      className="h-2 w-2 rounded-full bg-slate-400 animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    />
                    <span
                      className="h-2 w-2 rounded-full bg-slate-400 animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    />
                    <span
                      className="h-2 w-2 rounded-full bg-slate-400 animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="border-t bg-white p-4">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about the app, CVs, jobs, or the chatbot..."
                className="flex-1"
                disabled={isTyping}
              />
              <Button
                onClick={() => handleSend()}
                disabled={!input.trim() || isTyping}
                className="bg-emerald-600 hover:bg-emerald-700"
                size="icon"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      )}
    </>
  )
}
