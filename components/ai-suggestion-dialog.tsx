"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Sparkles, Loader2, AlertCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { generateSummary, generateExperienceSuggestions, generateSkills } from "@/lib/ai-helpers"

interface AISuggestionDialogProps {
  type: "summary" | "experience" | "skills"
  context: Record<string, any>
  onSelect: (value: string | string[]) => void
  children?: React.ReactNode
  disabled?: boolean
  disabledMessage?: string
}

export function AISuggestionDialog({
  type,
  context,
  onSelect,
  children,
  disabled = false,
  disabledMessage,
}: AISuggestionDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [usingFallback, setUsingFallback] = useState(false)
  const { toast } = useToast()

  const generateSuggestions = async () => {
    setLoading(true)
    setSuggestions([])
    setUsingFallback(false)

    try {
      const response = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, context }),
      })

      const data = await response.json()

      if (data.success && data.text) {
        // Parse Gemini response
        if (type === "skills") {
          const skills = data.text.split("\n").filter((s: string) => s.trim())
          setSuggestions(skills)
        } else if (type === "experience") {
          const bullets = data.text
            .split("\n")
            .filter((s: string) => s.trim().startsWith("•") || s.trim().startsWith("-"))
          setSuggestions(bullets.length > 0 ? bullets : [data.text])
        } else {
          setSuggestions([data.text])
        }
      } else {
        // Use local fallback
        setUsingFallback(true)
        if (type === "summary") {
          const suggestion = generateSummary(context)
          setSuggestions([suggestion])
        } else if (type === "skills") {
          const skills = generateSkills(context)
          setSuggestions(skills)
        } else if (type === "experience") {
          const suggestions = generateExperienceSuggestions(context)
          setSuggestions(suggestions)
        }
      }
    } catch (error) {
      console.error("[v0] AI suggestion error:", error)
      // Use local fallback on error
      setUsingFallback(true)
      if (type === "summary") {
        const suggestion = generateSummary(context)
        setSuggestions([suggestion])
      } else if (type === "skills") {
        const skills = generateSkills(context)
        setSuggestions(skills)
      } else if (type === "experience") {
        const suggestions = generateExperienceSuggestions(context)
        setSuggestions(suggestions)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleOpen = (isOpen: boolean) => {
    if (disabled) {
      toast({
        title: "More Information Needed",
        description: disabledMessage || "Please fill in the required fields first",
        variant: "destructive",
      })
      return
    }

    setOpen(isOpen)
    if (isOpen) {
      generateSuggestions()
    }
  }

  const handleSelect = (value: string | string[]) => {
    onSelect(value)
    setOpen(false)
    toast({
      title: "Applied!",
      description: "Suggestion has been added to your CV.",
    })
  }

  return (
    <Dialog open={open} onOpenChange={handleOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button type="button" variant="outline" size="sm" disabled={disabled}>
            <Sparkles className="size-4 mr-2" />
            Get AI Suggestions
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="size-5 text-primary" />
            {usingFallback ? "Template Suggestions" : "AI-Powered Suggestions"}
          </DialogTitle>
          <DialogDescription>
            {usingFallback
              ? "Smart template suggestions based on your information"
              : "Personalized suggestions powered by Google Gemini AI"}
          </DialogDescription>
        </DialogHeader>

        {usingFallback && (
          <Alert>
            <AlertCircle className="size-4" />
            <AlertDescription>
              Gemini AI is not configured. Using smart templates instead.
              <a href="/gemini-setup" className="underline ml-1">
                Set up Gemini AI
              </a>{" "}
              for personalized suggestions.
            </AlertDescription>
          </Alert>
        )}

        {loading && (
          <div className="flex flex-col items-center justify-center py-12 gap-3">
            <Loader2 className="size-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Generating suggestions...</p>
          </div>
        )}

        {!loading && suggestions.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <p>No suggestions generated yet</p>
          </div>
        )}

        {!loading && suggestions.length > 0 && (
          <div className="space-y-3">
            {type === "skills" ? (
              <div className="space-y-3">
                <p className="text-sm font-medium">Click to add these skills to your CV:</p>
                <Button
                  variant="outline"
                  className="w-full h-auto p-4 justify-start text-left bg-transparent"
                  onClick={() => handleSelect(suggestions)}
                >
                  <div className="flex flex-wrap gap-2">
                    {suggestions.map((skill, idx) => (
                      <span key={idx} className="px-2 py-1 bg-primary/10 rounded text-sm">
                        {skill}
                      </span>
                    ))}
                  </div>
                </Button>
              </div>
            ) : (
              <>
                <p className="text-sm font-medium">Click a suggestion to use it:</p>
                {suggestions.map((suggestion, idx) => (
                  <Button
                    key={idx}
                    variant="outline"
                    className="w-full h-auto p-4 justify-start text-left hover:bg-primary/5 bg-transparent"
                    onClick={() => handleSelect(suggestion)}
                  >
                    <span className="text-sm whitespace-pre-wrap">{suggestion}</span>
                  </Button>
                ))}
              </>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
