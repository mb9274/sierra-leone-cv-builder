"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Bot, MessageCircle, Send, Sparkles, X } from "lucide-react"
import type { ChatMessage } from "@/lib/chatbot-responses"

type ChatbotProps = {
  userName?: string
  embedded?: boolean
}

const CHAT_MEMORY_VERSION = "v2"

const quickPrompts = [
  "Explain anything to me",
  "Help me write a CV summary",
  "How do I use this app?",
  "What can you help with?",
]

function buildWelcomeMessage(userName?: string) {
  const name = userName?.trim()
  if (name) {
    return `Welcome back, ${name}. I'm your AI assistant. Ask me anything.`
  }

  return "Welcome. I'm your AI assistant. Ask me anything."
}

function getStoredGeminiApiKey() {
  if (typeof window === "undefined") return ""
  return localStorage.getItem("gemini_api_key")?.trim() || ""
}

function getChatStorageKey(userName?: string) {
  const name = userName?.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-") || "guest"
  return `chatbot_history_${CHAT_MEMORY_VERSION}_${name}`
}

function getChatSummaryKey(userName?: string) {
  const name = userName?.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-") || "guest"
  return `chatbot_summary_${CHAT_MEMORY_VERSION}_${name}`
}

function serializeMessages(messages: ChatMessage[]) {
  return messages.slice(-30).map((message) => ({
    ...message,
    timestamp: message.timestamp.toISOString(),
  }))
}

function hydrateMessages(raw: unknown, welcome: string): ChatMessage[] | null {
  if (!Array.isArray(raw)) return null

  const messages = raw
    .map((message) => {
      const item = message as Partial<ChatMessage> & { timestamp?: string | Date }
      if (item.role !== "user" && item.role !== "assistant") return null
      if (typeof item.content !== "string") return null

      const timestamp =
        item.timestamp instanceof Date
          ? item.timestamp
          : typeof item.timestamp === "string"
            ? new Date(item.timestamp)
            : new Date()

      return {
        role: item.role,
        content: item.content,
        timestamp: Number.isNaN(timestamp.getTime()) ? new Date() : timestamp,
      } satisfies ChatMessage
    })
    .filter(Boolean) as ChatMessage[]

  return messages.length > 0 ? messages : [{ role: "assistant", content: welcome, timestamp: new Date() }]
}

function sanitizeSummary(value: string) {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .slice(0, 8)
    .join("\n")
}

export function Chatbot({ userName, embedded = false }: ChatbotProps) {
  const welcomeMessage = buildWelcomeMessage(userName)
  const storageKey = getChatStorageKey(userName)
  const summaryKey = getChatSummaryKey(userName)
  const [isOpen, setIsOpen] = useState(embedded)
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content: welcomeMessage,
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [hasLoadedHistory, setHasLoadedHistory] = useState(false)
  const [conversationSummary, setConversationSummary] = useState("")
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
          content: welcomeMessage,
          timestamp: new Date(),
        },
      ])
    }
  }, [userName, welcomeMessage])

  useEffect(() => {
    if (typeof window === "undefined") return

    try {
      const saved = localStorage.getItem(storageKey)
      if (saved) {
        const parsed = JSON.parse(saved)
        const hydrated = hydrateMessages(parsed, welcomeMessage)
        if (hydrated) {
          setMessages(hydrated)
        }
      }
      const savedSummary = localStorage.getItem(summaryKey)
      if (savedSummary) {
        setConversationSummary(savedSummary)
      }
    } catch {
      // Ignore malformed saved history.
    } finally {
      setHasLoadedHistory(true)
    }
  }, [storageKey, welcomeMessage])

  useEffect(() => {
    if (!hasLoadedHistory || typeof window === "undefined") return

    try {
      localStorage.setItem(storageKey, JSON.stringify(serializeMessages(messages)))
    } catch {
      // Ignore storage quota and serialization failures.
    }
  }, [hasLoadedHistory, messages, storageKey])

  useEffect(() => {
    if (typeof window === "undefined") return

    try {
      if (conversationSummary.trim()) {
        localStorage.setItem(summaryKey, conversationSummary)
      } else {
        localStorage.removeItem(summaryKey)
      }
    } catch {
      // Ignore storage failures.
    }
  }, [conversationSummary, summaryKey])

  const clearConversation = () => {
    const freshMessage = {
      role: "assistant" as const,
      content: welcomeMessage,
      timestamp: new Date(),
    }

    setMessages([freshMessage])
    setConversationSummary("")

    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem(storageKey)
        localStorage.removeItem(summaryKey)
      } catch {
        // Ignore storage failures.
      }
    }
  }

  const handleSend = async (messageText?: string) => {
    const prompt = (messageText ?? input).trim()
    if (!prompt) return

    const userMessage: ChatMessage = {
      role: "user",
      content: prompt,
      timestamp: new Date(),
    }
    const nextMessages = [...messages, userMessage]
    setMessages(nextMessages)
    setInput("")
    setIsTyping(true)

    try {
      const response = await fetch("/api/gemini", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "chat",
          prompt,
          context: {
            summary: conversationSummary,
            history: nextMessages.slice(-20),
          },
          apiKey: getStoredGeminiApiKey(),
        }),
      })

      const result = await response.json().catch(() => null)
      const assistantText = String(result?.message || result?.text || "").trim()

      if (!response.ok || !assistantText) {
        throw new Error(result?.error?.message || result?.error || "AI assistant failed to respond")
      }

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: assistantText,
          timestamp: new Date(),
        },
      ])

      const summaryResponse = await fetch("/api/gemini", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "summarize_chat",
          context: {
            summary: conversationSummary,
            history: [...nextMessages, { role: "assistant", content: assistantText, timestamp: new Date() }].slice(-20),
          },
          apiKey: getStoredGeminiApiKey(),
        }),
      })

      const summaryResult = await summaryResponse.json().catch(() => null)
      const nextSummary = String(summaryResult?.summary || "").trim()
      if (summaryResponse.ok && nextSummary) {
        setConversationSummary(sanitizeSummary(nextSummary))
      }
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            error instanceof Error
              ? error.message
              : "I couldn't reach the AI service right now. Check your Gemini API key in Settings and try again.",
          timestamp: new Date(),
        },
      ])
    } finally {
      setIsTyping(false)
    }
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
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={clearConversation}
                className="h-8 rounded-full px-3 text-white hover:bg-white/15"
              >
                Reset
              </Button>
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
