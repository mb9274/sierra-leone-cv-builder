"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("App error boundary caught:", error)
  }, [error])

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-6">
      <div className="max-w-xl rounded-2xl border bg-card p-6 shadow-lg">
        <h1 className="text-2xl font-bold">Something went wrong</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          The page crashed while loading. The message below should help pinpoint the broken component.
        </p>
        <pre className="mt-4 overflow-auto rounded-lg bg-muted p-4 text-xs whitespace-pre-wrap">
          {error.message}
        </pre>
        <div className="mt-4 flex gap-3">
          <Button onClick={reset}>Try again</Button>
          <Button variant="outline" onClick={() => window.location.reload()}>
            Reload
          </Button>
        </div>
      </div>
    </div>
  )
}
