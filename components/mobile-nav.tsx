"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  Menu,
  Home,
  FileText,
  Briefcase,
  Map,
  BookOpen,
  LayoutDashboard,
  User,
  Settings,
  Bell,
  FileImage,
  Sparkles,
  HeartHandshake,
  MessageSquare,
  FileCheck,
} from "lucide-react"

export function MobileNav() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  const navItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/builder", label: "Build CV", icon: FileText },
    { href: "/jobs", label: "Jobs", icon: Briefcase },
    { href: "/job-map", label: "Map", icon: Map },
    { href: "/learning-center", label: "Learning Center", icon: BookOpen },
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/gemini-setup", label: "AI Setup", icon: Sparkles },
    { href: "/profile", label: "Profile", icon: User },
    { href: "/settings", label: "Settings", icon: Settings },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="container flex h-14 max-w-screen-2xl items-center px-4">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="mr-2 md:hidden">
              <Menu className="size-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <div className="flex flex-col h-full">
              <div className="p-4 border-b border-border">
                <h2 className="text-lg font-bold text-foreground">AI CV Builder</h2>
                <p className="text-xs text-muted-foreground">Build your future</p>
              </div>
              <nav className="flex-1 overflow-y-auto p-4">
                <ul className="space-y-2">
                  {navItems.map((item) => {
                    const Icon = item.icon
                    const isActive = pathname === item.href
                    return (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          onClick={() => setOpen(false)}
                          className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${isActive
                            ? "bg-primary text-primary-foreground"
                            : "text-foreground hover:bg-accent hover:text-accent-foreground"
                            }`}
                        >
                          <Icon className="size-5" />
                          {item.label}
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              </nav>
            </div>
          </SheetContent>
        </Sheet>

        <Link href="/" className="flex items-center gap-2 flex-1 md:flex-none">
          <FileText className="size-6 text-primary" />
          <span className="font-bold text-lg">AI CV Builder</span>
        </Link>

        <nav className="hidden md:flex flex-1 items-center gap-6 ml-8">
          {navItems.slice(0, 6).map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 text-sm font-medium transition-colors ${isActive ? "text-primary" : "text-foreground/60 hover:text-foreground"
                  }`}
              >
                <Icon className="size-4" />
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="flex items-center gap-2 ml-auto">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="size-5" />
            <span className="absolute top-1 right-1 size-2 bg-primary rounded-full" />
          </Button>
          <Link href="/profile">
            <Button variant="ghost" size="icon" className="md:hidden">
              <User className="size-5" />
            </Button>
          </Link>
        </div>
      </div>
    </header>
  )
}
