"use client"

import type React from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { LogIn, FileText, ArrowRight } from "lucide-react"

const supabase = createClient()

export default function SignInPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  // const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        setError(error.message)
        return
      }

      router.push("/dashboard")
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign in failed")
    } finally {
      setIsLoading(false)
    }
  }

  // const handleGoogleLogin = async () => {
  //   setIsGoogleLoading(true)
  //   setError(null)

  //   try {
  //     const redirectTo = `${window.location.origin}/auth/callback?next=${encodeURIComponent("/dashboard")}`
  //     const { error } = await supabase.auth.signInWithOAuth({
  //       provider: "google",
  //       options: { redirectTo },
  //     })

  //     if (error) {
  //       setError(error.message)
  //     }
  //   } catch (err) {
  //     setError(err instanceof Error ? err.message : "Google sign in failed")
  //   } finally {
  //     setIsGoogleLoading(false)
  //   }
  // }

  return (
    <div className="min-h-screen bg-background flex">
      <div className="hidden lg:flex lg:w-1/2 bg-muted/30 border-r border-border p-16 flex-col justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="size-10 rounded-lg bg-primary/20 flex items-center justify-center border border-primary/30">
            <FileText className="size-6 text-primary" />
          </div>
          <span className="text-xl font-semibold text-foreground">AI CV Builder</span>
        </Link>
        <div>
          <h2 className="text-4xl font-bold text-foreground leading-tight mb-4">Build Your Future</h2>
          <p className="text-muted-foreground text-lg max-w-md">
            Sign in to access your CV, job matches, and career resources. Your path to professional success starts here.
          </p>
        </div>
        <div className="text-sm text-muted-foreground">© {new Date().getFullYear()} AI CV Builder</div>
      </div>

      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8">
            <Link href="/" className="flex items-center gap-2">
              <div className="size-10 rounded-lg bg-primary/20 flex items-center justify-center border border-primary/30">
                <FileText className="size-6 text-primary" />
              </div>
              <span className="text-xl font-semibold text-foreground">AI CV Builder</span>
            </Link>
          </div>

          <h1 className="text-2xl font-bold text-foreground mb-2">Sign In</h1>
          <p className="text-muted-foreground mb-8">Welcome back. Sign in to continue.</p>

          {/* <Button
            type="button"
            variant="outline"
            className="w-full h-12 mb-6 bg-transparent border-border hover:bg-muted/50"
            onClick={handleGoogleLogin}
            disabled={isGoogleLoading}
          >
            <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            {isGoogleLoading ? "Signing in with Google..." : "Continue with Google"}
          </Button> */}

          {/* <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-3 text-muted-foreground">Or continue with email</span>
            </div>
          </div> */}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-muted/30 border-border h-12"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground">Password</Label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-muted/30 border-border h-12"
              />
            </div>
            {error && (
              <div className="bg-destructive/10 border border-destructive/30 text-destructive px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}
            <Button
              type="submit"
              className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90"
              disabled={isLoading}
            >
              <LogIn className="mr-2 h-4 w-4" />
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link href="/auth/sign-up" className="text-primary hover:underline font-medium">
              Sign up
            </Link>
          </p>

          <Link
            href="/"
            className="mt-6 flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowRight className="size-4 rotate-180" />
            Back to home
          </Link>
        </div>
      </div>
    </div>
  )
}
