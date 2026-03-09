"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function LoginPage() {
  const router = useRouter()

  useEffect(() => {
    router.replace("/dashboard")
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <p>Redirecting to dashboard...</p>
      </div>
    </div>
  )
}
