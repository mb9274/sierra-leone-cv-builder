"use client"

import { useState, useCallback } from "react"
import { toast } from "@/hooks/use-toast"

interface ApiError {
  error: {
    message: string
    code?: string
    details?: any
  }
}

interface UseApiOptions {
  showToastOnError?: boolean
  retryCount?: number
  retryDelay?: number
}

export function useApi<T = any>(options: UseApiOptions = {}) {
  const { showToastOnError = true, retryCount = 0, retryDelay = 1000 } = options
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const execute = useCallback(async (
    apiCall: () => Promise<Response>,
    onSuccess?: (data: T) => void,
    onError?: (error: string) => void
  ): Promise<T | null> => {
    setLoading(true)
    setError(null)

    let lastError: string = ""

    for (let attempt = 0; attempt <= retryCount; attempt++) {
      try {
        const response = await apiCall()

        if (!response.ok) {
          const errorData: ApiError = await response.json().catch(() => ({ error: { message: "Unknown error" } }))
          lastError = errorData.error?.message || `HTTP ${response.status}: ${response.statusText}`
          throw new Error(lastError)
        }

        const data: T = await response.json()
        setLoading(false)

        if (onSuccess) {
          onSuccess(data)
        }

        return data
      } catch (err) {
        lastError = err instanceof Error ? err.message : "An unexpected error occurred"

        if (attempt < retryCount) {
          // Wait before retrying
          await new Promise(resolve => setTimeout(resolve, retryDelay * (attempt + 1)))
          continue
        }

        setError(lastError)
        setLoading(false)

        if (showToastOnError) {
          toast({
            title: "Error",
            description: lastError,
            variant: "destructive",
          })
        }

        if (onError) {
          onError(lastError)
        }

        return null
      }
    }

    return null
  }, [retryCount, retryDelay, showToastOnError])

  const reset = useCallback(() => {
    setLoading(false)
    setError(null)
  }, [])

  return { execute, loading, error, reset }
}

// Specific hooks for common API operations
export function useCVApi() {
  const { execute, loading, error, reset } = useApi({ retryCount: 1 })

  const getCVs = useCallback(() => {
    return execute(
      () => fetch("/api/cvs"),
      (data) => {
        toast({
          title: "Success",
          description: "CVs loaded successfully",
        })
      }
    )
  }, [execute])

  const createCV = useCallback((cvData: any) => {
    return execute(
      () => fetch("/api/cvs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cvData),
      }),
      (data) => {
        toast({
          title: "Success",
          description: "CV created successfully",
        })
      }
    )
  }, [execute])

  const updateCV = useCallback((id: string, cvData: any) => {
    return execute(
      () => fetch(`/api/cvs/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cvData),
      }),
      (data) => {
        toast({
          title: "Success",
          description: "CV updated successfully",
        })
      }
    )
  }, [execute])

  const deleteCV = useCallback((id: string) => {
    return execute(
      () => fetch(`/api/cvs/${id}`, {
        method: "DELETE",
      }),
      (data) => {
        toast({
          title: "Success",
          description: "CV deleted successfully",
        })
      }
    )
  }, [execute])

  return { getCVs, createCV, updateCV, deleteCV, loading, error, reset }
}

export function useGeminiApi() {
  const { execute, loading, error, reset } = useApi({ retryCount: 2, retryDelay: 2000 })

  const enhanceCV = useCallback((cvData: any) => {
    return execute(
      () => fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "enhance_cv", cvData }),
      })
    )
  }, [execute])

  const generateCoverLetter = useCallback((prompt: string, cvData: any) => {
    return execute(
      () => fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "generate_cover_letter", prompt, cvData }),
      })
    )
  }, [execute])

  const mockInterview = useCallback((prompt: string, cvData: any) => {
    return execute(
      () => fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "mock_interview", prompt, cvData }),
      })
    )
  }, [execute])

  return { enhanceCV, generateCoverLetter, mockInterview, loading, error, reset }
}