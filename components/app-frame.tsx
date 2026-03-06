"use client"

import type React from "react"

import { usePathname } from "next/navigation"
import { AppSidebar } from "@/components/app-sidebar"

export function AppFrame({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  const hideSidebar =
    !pathname ||
    pathname.startsWith("/auth/") ||
    pathname.startsWith("/builder") ||
    pathname.startsWith("/preview")

  if (hideSidebar) return <>{children}</>

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      <AppSidebar />
      <div className="flex-1 min-w-0">{children}</div>
    </div>
  )
}
