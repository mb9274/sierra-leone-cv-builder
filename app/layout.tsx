import type React from "react"
import type { Metadata } from "next"
import { Analytics } from "@vercel/analytics/next"
import { Chatbot } from "@/components/chatbot"
import { MobileNav } from "@/components/mobile-nav"
import "./globals.css"

export const metadata: Metadata = {
  title: "AI CV Builder - Build Your Future",
  description: "Create professional CVs, find jobs, and learn new skills with AI CV Builder.",
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <MobileNav />
        {children}
        <Chatbot />
        <Analytics />
      </body>
    </html>
  )
}
