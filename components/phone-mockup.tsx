"use client"

import { useState, useEffect } from "react"
import Image from "next/image"

const cvImages = [
  "/cv_new_1.png",
  "/cv_new_2.png",
  "/cv_new_3.png",
]

export function PhoneMockup() {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % cvImages.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative flex justify-center lg:justify-end">
      {/* Android phone frame - fixed on right side */}
      <div className="relative w-[260px] lg:w-[280px] rounded-[2.5rem] border-[10px] border-slate-800 bg-slate-800 p-1.5 shadow-2xl">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-4 bg-slate-800 rounded-b-lg z-10" />
        <div className="relative w-full aspect-[9/19] max-h-[520px] rounded-[1.75rem] overflow-hidden bg-white">
          {/* CV images carousel */}
          <div className="absolute inset-0">
            {cvImages.map((src, index) => (
              <div
                key={src}
                className={`absolute inset-0 transition-opacity duration-700 ${index === currentIndex ? "opacity-100 z-10" : "opacity-0"
                  }`}
              >
                <Image
                  src={src}
                  alt={`CV template ${index + 1}`}
                  fill
                  className="object-cover object-top"
                  sizes="280px"
                />
              </div>
            ))}
          </div>
          {/* Gradient overlay at bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/20 to-transparent z-20 pointer-events-none" />
          {/* Dots indicator */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-30">
            {cvImages.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all ${i === currentIndex ? "w-4 bg-white" : "w-1.5 bg-white/50"
                  }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
