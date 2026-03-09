"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  Menu,
  FileText,
  LogOut,
  Home,
  LayoutDashboard,
  Briefcase,
  Map,
  BookOpen,
  Sparkles,
  User,
  Settings,
} from "lucide-react"

const signedInNavItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/builder", label: "Build CV", icon: FileText },
  { href: "/jobs", label: "Jobs", icon: Briefcase },
  { href: "/job-map", label: "Job Map", icon: Map },
  { href: "/learning-center", label: "Learning Center", icon: BookOpen },
  { href: "/gemini-setup", label: "AI Setup", icon: Sparkles },
  { href: "/profile", label: "Profile", icon: User },
  { href: "/settings", label: "Settings", icon: Settings },
]

export function MobileNav() {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleSignOut = () => {
    window.location.href = "/"
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-white/95 backdrop-blur">
      <div className="container flex h-14 max-w-screen-2xl items-center justify-end px-4">
        <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="mr-2">
              <Menu className="size-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72">
            <nav className="flex flex-col gap-1 pt-4">
              {signedInNavItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    pathname === item.href ? "bg-primary/10 text-primary" : "text-foreground hover:bg-muted"
                  }`}
                >
                  <item.icon className="size-4" />
                  {item.label}
                </Link>
              ))}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
