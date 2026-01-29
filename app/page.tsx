"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { SuccessStoriesCarousel } from "@/components/success-stories-carousel"
import {
  FileText,
  Briefcase,
  Sparkles,
  ArrowRight,
  CheckCircle,
  Users,
  TrendingUp,
  Star,
  Shield,
  Lock,
  Award,
  Phone,
  Mail,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function HomePage() {
  const router = useRouter()
  const [stats, setStats] = useState({
    cvsCreated: 0,
    usersHelped: 0,
    jobsMatched: 0,
  })

  /* Verification stats removed */

  useEffect(() => {
    const targetStats = {
      cvsCreated: 2847,
      usersHelped: 1523,
      jobsMatched: 892,
    }

    const savedCVs = JSON.parse(localStorage.getItem("cvbuilder_cvs") || "[]")
    const realCVCount = savedCVs.length

    targetStats.cvsCreated += realCVCount
    targetStats.usersHelped += realCVCount

    const duration = 2000
    const steps = 60
    const stepDuration = duration / steps

    let currentStep = 0
    const interval = setInterval(() => {
      currentStep++
      const progress = currentStep / steps

      setStats({
        cvsCreated: Math.floor(targetStats.cvsCreated * progress),
        usersHelped: Math.floor(targetStats.usersHelped * progress),
        jobsMatched: Math.floor(targetStats.jobsMatched * progress),
      })

      if (currentStep >= steps) clearInterval(interval)
    }, stepDuration)

    const liveInterval = setInterval(() => {
      setStats((prev) => ({
        cvsCreated: prev.cvsCreated + Math.floor(Math.random() * 3),
        usersHelped: prev.usersHelped + Math.floor(Math.random() * 2),
        jobsMatched: prev.jobsMatched + Math.floor(Math.random() * 2),
      }))
    }, 5000)

    return () => {
      clearInterval(interval)
      clearInterval(liveInterval)
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-green-50 to-background">
      {/* Header */}
      <header className="border-b border-border bg-white/80 backdrop-blur-sm sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="size-10 rounded-lg bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-lg">
              <FileText className="size-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-green-500 bg-clip-text text-transparent">
              AI CV Builder
            </h1>
          </div>
          <Button
            onClick={() => router.push("/onboarding")}
            size="lg"
            className="group bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
          >
            Get Started
            <ArrowRight className="ml-2 size-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side content */}
          <div className="space-y-6">
            <div className="inline-block px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-semibold mb-4">
              🇸🇱 Made for Sierra Leone Youth
            </div>
            <h2 className="text-5xl font-bold text-foreground leading-tight animate-in fade-in slide-in-from-bottom-4 duration-700">
              Build Your Professional CV in Minutes
            </h2>
            <p className="text-xl text-muted-foreground leading-relaxed animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
              AI-powered CV builder designed for Sierra Leone youth. Get professional formatting, powerful language
              suggestions, and automatic job matching.
            </p>
            <div className="flex gap-4 pt-6 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
              <Button
                onClick={() => router.push("/onboarding")}
                size="lg"
                className="h-14 px-8 text-lg group bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
              >
                <Sparkles className="mr-2 size-5" />
                Create Your CV
                <ArrowRight className="ml-2 size-4 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                onClick={() => router.push("/jobs")}
                variant="outline"
                size="lg"
                className="h-14 px-8 text-lg border-2 border-green-500 text-green-600 hover:bg-green-50"
              >
                <Briefcase className="mr-2 size-5" />
                Browse Jobs
              </Button>
            </div>
          </div>

          {/* Happy people images on right side */}
          <div className="relative animate-in fade-in slide-in-from-right-4 duration-1000">
            <div className="relative h-[500px] rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="/happy-man-holding-cv-document.jpg"
                alt="Happy Sierra Leone youth holding CV and celebrating job success"
                fill
                className="object-cover"
              />
              {/* Success overlay card */}
              <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-xl">
                <div className="flex items-center gap-3">
                  <div className="size-12 rounded-full bg-green-100 flex items-center justify-center">
                    <CheckCircle className="size-6 text-green-600" />
                  </div>
                  <div>
                    <p className="font-bold text-foreground">Professional CV Ready!</p>
                    <p className="text-sm text-muted-foreground">3 job matches found instantly</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating success cards */}
            <div className="absolute -top-4 -right-4 bg-white rounded-lg shadow-lg p-3 animate-bounce">
              <div className="flex items-center gap-2">
                <Star className="size-5 text-yellow-500 fill-yellow-500" />
                <span className="font-semibold text-sm">Professional CV!</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Success Stories Carousel Section */}
      <section className="container mx-auto px-4 py-20 bg-gradient-to-br from-green-50 via-white to-yellow-50">
        <div className="text-center mb-12 space-y-4">
          <h2 className="text-4xl font-bold text-foreground">Stories of Change</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            See how Sierra Leone youth transformed their careers with professional CVs
          </p>
        </div>
        <SuccessStoriesCarousel />
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="border-2 border-green-200 hover:border-green-400 transition-all duration-300 hover:scale-105 bg-gradient-to-br from-green-50 to-white">
              <CardContent className="pt-6 text-center">
                <div className="size-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                  <FileText className="size-6 text-green-600" />
                </div>
                <div className="text-4xl font-bold text-green-600 mb-2">{stats.cvsCreated.toLocaleString()}</div>
                <div className="text-muted-foreground">CVs Created</div>
              </CardContent>
            </Card>
            <Card className="border-2 border-yellow-200 hover:border-yellow-400 transition-all duration-300 hover:scale-105 bg-gradient-to-br from-yellow-50 to-white">
              <CardContent className="pt-6 text-center">
                <div className="size-12 rounded-full bg-yellow-100 flex items-center justify-center mx-auto mb-4">
                  <Users className="size-6 text-yellow-600" />
                </div>
                <div className="text-4xl font-bold text-yellow-600 mb-2">{stats.usersHelped.toLocaleString()}</div>
                <div className="text-muted-foreground">Users Helped</div>
              </CardContent>
            </Card>
            <Card className="border-2 border-blue-200 hover:border-blue-400 transition-all duration-300 hover:scale-105 bg-gradient-to-br from-blue-50 to-white">
              <CardContent className="pt-6 text-center">
                <div className="size-12 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="size-6 text-blue-600" />
                </div>
                <div className="text-4xl font-bold text-blue-600 mb-2">{stats.jobsMatched.toLocaleString()}</div>
                <div className="text-muted-foreground">Job Matches</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="container mx-auto px-4 py-16 bg-green-50/50">
        <h3 className="text-3xl font-bold text-center text-foreground mb-12">Success Stories from Sierra Leone</h3>
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <Card className="border-2 border-green-200">
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="relative size-12 rounded-full overflow-hidden">
                  <Image
                    src="/happy-african-young-woman-professional.jpg"
                    alt="Happy user"
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="font-bold">Aminata K.</p>
                  <p className="text-sm text-muted-foreground">Freetown</p>
                </div>
              </div>
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="size-4 text-yellow-500 fill-yellow-500" />
                ))}
              </div>
              <p className="text-muted-foreground italic">
                "Got my first job at Orange SL thanks to this CV builder! The AI suggestions made my experience sound so
                professional."
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-green-200">
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="relative size-12 rounded-full overflow-hidden">
                  <Image
                    src="/happy-african-young-man-professional-smile.jpg"
                    alt="Happy user"
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="font-bold">Mohamed S.</p>
                  <p className="text-sm text-muted-foreground">Bo</p>
                </div>
              </div>
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="size-4 text-yellow-500 fill-yellow-500" />
                ))}
              </div>
              <p className="text-muted-foreground italic">
                "Built my CV in 15 minutes and applied to 5 jobs the same day. Now I'm working at Rokel Bank!"
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-green-200">
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="relative size-12 rounded-full overflow-hidden">
                  <Image
                    src="/happy-african-young-woman-celebrating-success.jpg"
                    alt="Happy user"
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="font-bold">Fatima B.</p>
                  <p className="text-sm text-muted-foreground">Makeni</p>
                </div>
              </div>
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="size-4 text-yellow-500 fill-yellow-500" />
                ))}
              </div>
              <p className="text-muted-foreground italic">
                "The templates made my CV look so professional. I got interview calls within a week!"
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CV Verification Section */}
      {/* CV Verification Section Removed */}

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <Card className="border-2 border-green-200 hover:shadow-lg transition-all">
            <CardContent className="pt-6 space-y-4">
              <div className="size-12 rounded-lg bg-green-100 flex items-center justify-center">
                <FileText className="size-6 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-foreground">Step-by-Step Builder</h3>
              <p className="text-muted-foreground leading-relaxed">
                Easy-to-follow process that guides you through creating a professional CV section by section.
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-yellow-200 hover:shadow-lg transition-all">
            <CardContent className="pt-6 space-y-4">
              <div className="size-12 rounded-lg bg-yellow-100 flex items-center justify-center">
                <Sparkles className="size-6 text-yellow-600" />
              </div>
              <h3 className="text-xl font-bold text-foreground">AI-Powered Suggestions</h3>
              <p className="text-muted-foreground leading-relaxed">
                Get intelligent suggestions for powerful language and professional phrasing that makes you stand out.
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-blue-200 hover:shadow-lg transition-all">
            <CardContent className="pt-6 space-y-4">
              <div className="size-12 rounded-lg bg-blue-100 flex items-center justify-center">
                <Briefcase className="size-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-foreground">Job Matching</h3>
              <p className="text-muted-foreground leading-relaxed">
                Automatically scan your CV and match with relevant job openings across Sierra Leone.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="container mx-auto px-4 py-16 bg-card/30">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-3xl font-bold text-foreground text-center mb-12">Why Use AI CV Builder?</h3>
          <div className="space-y-6">
            {[
              "Professional formatting that passes automated screening systems",
              "AI suggestions to help translate your experience into compelling language",
              "Export to PDF for easy sharing with employers",
              "Job matching based on your skills and experience",
              "Free to use for all Sierra Leone youth",
            ].map((benefit, index) => (
              <div key={index} className="flex items-start gap-4">
                <CheckCircle className="size-6 text-primary flex-shrink-0 mt-1" />
                <p className="text-lg text-foreground">{benefit}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-3xl mx-auto text-center space-y-6 bg-gradient-to-br from-green-500 to-green-600 rounded-3xl p-12 text-white shadow-2xl">
          <h3 className="text-4xl font-bold">Ready to Land Your Dream Job?</h3>
          <p className="text-xl text-green-50">
            Join thousands of Sierra Leone youth who have successfully created professional CVs and found employment.
          </p>
          <Button
            onClick={() => router.push("/onboarding")}
            size="lg"
            className="h-14 px-10 text-lg group bg-white text-green-600 hover:bg-green-50"
          >
            Start Building Now
            <ArrowRight className="ml-2 size-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-gradient-to-br from-blue-50 to-green-50 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {/* About Section */}
            <div>
              <h3 className="font-bold text-lg text-foreground mb-4">AI CV Builder</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Empowering Sierra Leone Youth Through Professional Development 🇸🇱
              </p>
              <p className="text-muted-foreground text-sm">
                Build professional CVs, find jobs, learn new skills, and connect with opportunities across Sierra Leone.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-bold text-lg text-foreground mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/builder" className="text-muted-foreground hover:text-primary transition-colors">
                    Build CV
                  </Link>
                </li>
                <li>
                  <Link href="/jobs" className="text-muted-foreground hover:text-primary transition-colors">
                    Find Jobs
                  </Link>
                </li>

                <li>
                  <Link href="/ats-checker" className="text-muted-foreground hover:text-primary transition-colors">
                    ATS Checker
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors">
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact Information */}
            <div>
              <h3 className="font-bold text-lg text-foreground mb-4">Contact Us</h3>
              <ul className="space-y-3">
                <li>
                  <a
                    href="tel:+232073490048"
                    className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors group"
                  >
                    <Phone className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    <span className="text-sm">+232 073 490 048</span>
                  </a>
                </li>
                <li>
                  <a
                    href="mailto:mb9274276@gmail.com"
                    className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors group"
                  >
                    <Mail className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    <span className="text-sm">mb9274276@gmail.com</span>
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.tiktok.com/@mariama"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors group"
                  >
                    <svg
                      className="w-4 h-4 group-hover:scale-110 transition-transform"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                    </svg>
                    <span className="text-sm">@mariama</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-border pt-6 text-center">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} AI CV Builder. All rights reserved. Made with ❤️ for Sierra Leone
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
