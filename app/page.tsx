"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { SuccessStoriesCarousel } from "@/components/success-stories-carousel"
import { PhoneMockup } from "@/components/phone-mockup"
import {
  Briefcase,
  ArrowRight,
  CheckCircle,
  Star,
  Play,
  Ruler,
  Layers,
  Palette,
  Layout,
  Settings,
  FolderOpen,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function HomePage() {
  const router = useRouter()
  const [stats, setStats] = useState({ cvsCreated: 0, usersHelped: 0, jobsMatched: 0 })

  useEffect(() => {
    const targetStats = { cvsCreated: 2847, usersHelped: 1523, jobsMatched: 892 }
    const savedCVs = JSON.parse(localStorage.getItem("cvbuilder_cvs") || "[]")
    targetStats.cvsCreated += savedCVs.length
    targetStats.usersHelped += savedCVs.length

    let currentStep = 0
    const interval = setInterval(() => {
      currentStep++
      const progress = Math.min(currentStep / 60, 1)
      setStats({
        cvsCreated: Math.floor(targetStats.cvsCreated * progress),
        usersHelped: Math.floor(targetStats.usersHelped * progress),
        jobsMatched: Math.floor(targetStats.jobsMatched * progress),
      })
      if (currentStep >= 60) clearInterval(interval)
    }, 33)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-background">
      {/* Hero - Resumate style */}
      <section className="container mx-auto px-4 py-16 md:py-24 max-w-6xl" id="hero">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="space-y-8 order-2 lg:order-1">
            <div className="flex flex-wrap gap-3">
              {["Beginner Friendly", "Fully Customizable", "Interactive components", "Style Guide", "Fully Responsive"].map(
                (feature) => (
                  <div key={feature} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle className="size-4 text-primary flex-shrink-0" />
                    <span>{feature}</span>
                  </div>
                )
              )}
            </div>
            <p className="text-sm text-muted-foreground">10k+ people using AI CV Builder</p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
              Your dream job starts with the perfect resume
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl">
              Create impressive resumes tailored to your dream job, your unique skills & experiences.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button
                onClick={() => router.push("/auth/sign-in")}
                size="lg"
                className="h-12 px-8 bg-primary text-white hover:bg-primary/90"
              >
                Get started for free
                <ArrowRight className="ml-2 size-4" />
              </Button>
              <Button
                onClick={() => router.push("/jobs")}
                variant="outline"
                size="lg"
                className="h-12 px-8"
              >
                <Play className="mr-2 size-4" />
                Watch demo
              </Button>
            </div>
          </div>

          {/* Desktop: browser + phone mockup layout */}
          <div className="order-1 lg:order-2 flex justify-center lg:justify-end">
            <div className="relative">
              <PhoneMockup />
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-border bg-muted py-12">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-2xl md:text-3xl font-bold text-primary">{stats.cvsCreated.toLocaleString()}+</div>
              <div className="text-sm text-muted-foreground">CVs Created</div>
            </div>
            <div>
              <div className="text-2xl md:text-3xl font-bold text-foreground">{stats.usersHelped.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Users Helped</div>
            </div>
            <div>
              <div className="text-2xl md:text-3xl font-bold text-foreground">{stats.jobsMatched.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Job Matches</div>
            </div>
            <div>
              <div className="text-2xl md:text-3xl font-bold text-primary">Free</div>
              <div className="text-sm text-muted-foreground">To Use</div>
            </div>
          </div>
        </div>
      </section>

      {/* What You Will Get - green section */}
      <section className="py-20 bg-primary" id="features">
        <div className="container mx-auto px-4 max-w-6xl">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-4">What You Will Get</h2>
          <p className="text-white/90 text-center max-w-2xl mx-auto mb-16">
            We provide simple, clean and beginner friendly (anyone can edit or manage the elements or contents easily) as
            all contents are made with components.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Ruler, title: "Pixel Perfect", desc: "Distance & measure using an even multiple of measure." },
              { icon: Layers, title: "Component Based", desc: "Well organized layers, so it's easy to change and use." },
              { icon: Palette, title: "Global Style Guide", desc: "Consistent design with the text and color styles." },
              { icon: Layout, title: "Fully Auto-layout", desc: "Whole design is made using auto-layout and constraints." },
              { icon: Settings, title: "Easily Customizable", desc: "100% easy to change and design is fully customizable." },
              { icon: FolderOpen, title: "Well Organized", desc: "The file is well named, grouped and well organized." },
            ].map((item) => (
              <div
                key={item.title}
                className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="size-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <item.icon className="size-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section className="py-24 bg-background" id="about">
        <div className="container mx-auto px-4 max-w-6xl">
          <h2 className="text-3xl font-bold text-foreground mb-4">Stories of Change</h2>
          <p className="text-muted-foreground mb-12 max-w-2xl">
            See how Sierra Leone youth transformed their careers with professional CVs
          </p>
          <SuccessStoriesCarousel />
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-muted border-y border-border">
        <div className="container mx-auto px-4 max-w-6xl">
          <h2 className="text-3xl font-bold text-foreground mb-12">Success Stories</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: "Clare K.", location: "Freetown", img: "/happy-african-young-woman-professional.jpg", quote: "Got my first job at Orange SL thanks to this CV builder! The AI suggestions made my experience sound so professional." },
              { name: "Mohamed S.", location: "Bo", img: "/happy-african-young-man-professional-smile.jpg", quote: "Built my CV in 15 minutes and applied to 5 jobs the same day. Now I'm working at Rokel Bank!" },
              { name: "Fatima B.", location: "Makeni", img: "/happy-african-young-woman-celebrating-success.jpg", quote: "The templates made my CV look so professional. I got interview calls within a week!" },
            ].map((t) => (
              <div key={t.name} className="bg-background rounded-xl p-6 border border-border">
                <div className="flex items-center gap-3 mb-4">
                  <div className="relative size-12 rounded-full overflow-hidden border border-border">
                    <Image src={t.img} alt={t.name} fill className="object-cover" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{t.name}</p>
                    <p className="text-sm text-muted-foreground">{t.location}</p>
                  </div>
                </div>
                <div className="flex gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="size-4 text-primary fill-primary" />
                  ))}
                </div>
                <p className="text-muted-foreground text-sm italic">"{t.quote}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-24 bg-background" id="pricing">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">Simple Pricing</h2>
          <p className="text-muted-foreground mb-12">Free to use for all Sierra Leone youth</p>
          <div className="inline-flex flex-col items-center gap-4 p-8 rounded-2xl border-2 border-primary bg-white">
            <div className="text-4xl font-bold text-primary">Free</div>
            <p className="text-muted-foreground">Build unlimited CVs, get job matches, and access all features</p>
            <Button onClick={() => router.push("/auth/sign-in")} size="lg" className="bg-primary text-white hover:bg-primary/90">
              Get started for free
            </Button>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-muted/50">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center space-y-6 bg-primary rounded-2xl p-12 text-white">
            <h3 className="text-3xl font-bold">Ready to Land Your Dream Job?</h3>
            <p className="text-white/90 text-lg max-w-2xl mx-auto">
              Join thousands of Sierra Leone youth who have successfully created professional CVs and found employment.
            </p>
            <Button
              onClick={() => router.push("/auth/sign-in")}
              size="lg"
              className="h-12 px-8 bg-white text-primary hover:bg-white/90"
            >
              Get started for free
              <ArrowRight className="ml-2 size-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-white py-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
            <div>
              <h3 className="font-semibold text-foreground mb-4">AI CV Builder</h3>
              <p className="text-sm text-muted-foreground">
                Empowering Sierra Leone Youth. Build professional CVs, find jobs, and connect with opportunities.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-4">Quick Links</h3>
              <ul className="space-y-3 text-sm">
                <li><Link href="/builder" className="text-muted-foreground hover:text-primary transition-colors">Build CV</Link></li>
                <li><Link href="/jobs" className="text-muted-foreground hover:text-primary transition-colors">Find Jobs</Link></li>
                <li><Link href="/ats-checker" className="text-muted-foreground hover:text-primary transition-colors">ATS Checker</Link></li>
                <li><Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors">Contact</Link></li>
                <li><Link href="/job-map" className="text-muted-foreground hover:text-primary transition-colors">Job Map</Link></li>
                <li><Link href="/auth/sign-in" className="text-muted-foreground hover:text-primary transition-colors">Sign In</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-4">Contact</h3>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li><a href="tel:+232073490048" className="hover:text-primary">+232 073 490 048</a></li>
                <li><a href="mailto:mb9274276@gmail.com" className="hover:text-primary">mb9274276@gmail.com</a></li>
                <li><a href="https://maps.google.com/?q=Freetown+Sierra+Leone" target="_blank" rel="noopener noreferrer" className="hover:text-primary">Freetown, Sierra Leone</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border pt-8 text-center">
            <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} AI CV Builder. Made for Sierra Leone</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
