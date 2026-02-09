"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"

const successStories = [
  {
    id: 1,
    title: "Creating First CV",
    description: "A final-year student created her first CV with our easy builder",
    image: "/success-story-creating-cv.jpg",
    query: "African female student happily creating CV on laptop smiling",
  },
  {
    id: 2,
    title: "Passed ATS Screening",
    description: "She passed ATS screening with flying colors",
    image: "/success-story-ats-pass.jpg",
    query: "African woman celebrating CV passing ATS scan on computer screen",
  },
  {
    id: 3,
    title: "Got Interview Call",
    description: "She got an interview call within days",
    image: "/success-story-interview-call.jpg",
    query: "Happy African woman on phone call getting job interview news",
  },
  {
    id: 4,
    title: "CV Improved with AI",
    description: "A graduate improved his CV with AI suggestions",
    image: "/success-story-ai-improvement.jpg",
    query: "African male graduate using AI to improve CV on laptop",
  },
  {
    id: 5,
    title: "Added Right Skills",
    description: "He added the right skills that employers look for",
    image: "/success-story-adding-skills.jpg",
    query: "African man typing skills into CV builder looking confident",
  },
  {
    id: 6,
    title: "Got Shortlisted",
    description: "He got shortlisted for multiple positions",
    image: "/success-story-shortlisted.jpg",
    query: "Happy African man reading job shortlist email on phone",
  },
  {
    id: 7,
    title: "Applied with Confidence",
    description: "A job seeker applied with confidence",
    image: "/success-story-confident-apply.jpg",
    query: "Confident African professional submitting job application",
  },
  {
    id: 8,
    title: "Professional CV",
    description: "His CV looked professional and impressive",
    image: "/success-story-professional-cv.jpg",
    query: "African man holding professional looking CV document proudly",
  },
  {
    id: 9,
    title: "Found Work Faster",
    description: "He found work faster than expected",
    image: "/success-story-got-job.jpg",
    query: "Celebrating African professional shaking hands at new job",
  },
]

export function SuccessStoriesCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)

  // Auto-advance carousel every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % successStories.length)
    }, 4000)

    return () => clearInterval(interval)
  }, [])

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + successStories.length) % successStories.length)
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % successStories.length)
  }

  return (
    <div className="relative w-full max-w-5xl mx-auto">
      <div className="relative h-[400px] overflow-hidden rounded-2xl shadow-2xl">
        {/* Images with fade transition */}
        {successStories.map((story, index) => (
          <div
            key={story.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${index === currentIndex ? "opacity-100" : "opacity-0"
              }`}
          >
            <Image
              src={story.image || "/placeholder.svg"}
              alt={story.title}
              fill
              className="object-cover"
            />
            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

            {/* Story text overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
              <div className="space-y-2">
                <div className="text-sm font-semibold text-green-300 tracking-wide">Step {story.id} of 9</div>
                <h3 className="text-3xl font-bold">{story.title}</h3>
                <p className="text-lg text-white/90">{story.description}</p>
              </div>
            </div>
          </div>
        ))}

        {/* Navigation arrows */}
        <button
          onClick={goToPrevious}
          className="absolute left-4 top-1/2 -translate-y-1/2 size-12 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all flex items-center justify-center group"
          aria-label="Previous story"
        >
          <ChevronLeft className="size-6 text-white group-hover:scale-110 transition-transform" />
        </button>
        <button
          onClick={goToNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 size-12 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all flex items-center justify-center group"
          aria-label="Next story"
        >
          <ChevronRight className="size-6 text-white group-hover:scale-110 transition-transform" />
        </button>

        {/* Progress dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {successStories.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-2 rounded-full transition-all ${index === currentIndex ? "w-8 bg-white" : "w-2 bg-white/50"
                }`}
              aria-label={`Go to story ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Story counter */}
      <div className="mt-4 text-center">
        <p className="text-sm text-muted-foreground">
          Success Story {currentIndex + 1} of {successStories.length}
        </p>
      </div>
    </div>
  )
}
