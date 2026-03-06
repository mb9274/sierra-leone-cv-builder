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
  BookOpen,
  User,
  Settings,
} from "lucide-react"

const signedInNavItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/builder", label: "Build CV", icon: FileText },
  { href: "/jobs", label: "Jobs", icon: Briefcase },
  { href: "/learning-center", label: "Learning Center", icon: BookOpen },
  { href: "/profile", label: "Profile", icon: User },
  { href: "/settings", label: "Settings", icon: Settings },
]

export function MobileNav() {
  const pathname = usePathname()
  const isAuthPage = pathname?.startsWith("/auth/")
  const [isSignedIn, setIsSignedIn] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const userStr = localStorage.getItem("user")
        const user = userStr ? JSON.parse(userStr) : null
        setIsSignedIn(!!user?.loggedIn)
      } catch {
        setIsSignedIn(false)
      }
    }
  }, [pathname])

  const handleSignOut = () => {
    localStorage.removeItem("user")
    setIsSignedIn(false)
    window.location.href = "/"
  }

  if (isAuthPage) return null

  if (pathname === "/dashboard") return null

  // When signed out, only show the auth buttons on the homepage.
  // This prevents showing Sign In / Sign Up in the in-app dashboard UI.
  if (!isSignedIn && pathname !== "/") return null

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-white/95 backdrop-blur">
      <div className="container flex h-14 max-w-screen-2xl items-center justify-end px-4">
        {isSignedIn && pathname !== "/" ? (
          <>
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
                      className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${pathname === item.href ? "bg-primary/10 text-primary" : "text-foreground hover:bg-muted"
                        }`}
                    >
                      <item.icon className="size-4" />
                      {item.label}
                    </Link>
                  ))}
                  <div className="mt-4 pt-4 border-t border-border">
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-muted-foreground hover:text-destructive"
                      onClick={handleSignOut}
                    >
                      <LogOut className="size-4 mr-2" />
                      Sign Out
                    </Button>
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </>
        ) : null}
        {!isSignedIn ? (
          <div className="flex items-center gap-2">
            <Link href="/auth/sign-in">
              <Button variant="ghost" size="sm" className="hidden sm:inline-flex">
                Sign In
              </Button>
            </Link>
            <Link href="/auth/sign-up">
              <Button size="sm" className="bg-primary text-white hover:bg-primary/90">
                Sign Up
              </Button>
            </Link>
          </div>
        ) : null}
      </div>
    </header>
  )
}
