"use client"
export const dynamic = "force-dynamic"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Landmark, BadgeCheck, ChartColumnBig, HandCoins, NotebookPen, Phone } from "lucide-react"

export default function BusinessServicesPage() {
  const router = useRouter()

  const programs = [
    {
      title: "Business Registration",
      description: "Start and register a new business with basic guidance and document checklists.",
      icon: <BadgeCheck className="size-6 text-[#4CAF50]" />,
    },
    {
      title: "Micro-Loan Access",
      description: "Explore small-business financing options for youth-led and community enterprises.",
      icon: <HandCoins className="size-6 text-[#4CAF50]" />,
    },
    {
      title: "Market Access",
      description: "Find local market opportunities, vendor support, and product placement advice.",
      icon: <ChartColumnBig className="size-6 text-[#4CAF50]" />,
    },
    {
      title: "Business Training",
      description: "Learn bookkeeping, customer service, pricing, and digital sales skills.",
      icon: <NotebookPen className="size-6 text-[#4CAF50]" />,
    },
  ]

  return (
    <div className="min-h-screen bg-[#F5F9F5] font-sans">
      <header className="border-b border-[#4CAF50]/20 bg-white/80 backdrop-blur-md sticky top-0 z-10">
        <div className="container mx-auto flex items-center gap-4 px-4 py-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/services")}
            className="text-[#4CAF50] hover:bg-[#4CAF50]/10"
          >
            <ArrowLeft className="size-6" />
          </Button>
          <div className="flex items-center gap-2">
            <Landmark className="size-8 text-[#4CAF50]" />
            <h1 className="text-2xl font-bold text-gray-800">Business Support</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="mx-auto mb-12 max-w-4xl">
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-gray-900">Grow Your Business</h2>
          <p className="text-lg text-gray-600">
            Access tools and guidance for registration, funding, and practical business development.
          </p>
        </div>

        <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-2">
          {programs.map((program) => (
            <Card key={program.title} className="border-[#4CAF50]/10 bg-white transition-shadow hover:shadow-md">
              <CardHeader className="flex flex-row items-center gap-4">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-gray-50 shadow-sm">
                  {program.icon}
                </div>
                <div>
                  <CardTitle className="text-xl font-bold text-gray-800">{program.title}</CardTitle>
                  <CardDescription>Practical support for new and growing businesses</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600">{program.description}</p>
                <Button className="w-full bg-[#4CAF50] font-bold text-white hover:bg-[#45a049]">
                  Learn More
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <section className="mx-auto mt-16 max-w-4xl rounded-3xl border border-[#4CAF50]/10 bg-white p-8 text-center shadow-sm">
          <h3 className="mb-4 text-2xl font-bold text-gray-800">Need Business Help?</h3>
          <p className="mb-8 text-gray-600">
            Reach out for support with registration, grants, or training opportunities.
          </p>
          <Button className="bg-[#4CAF50] px-8 py-6 text-lg font-bold hover:bg-[#45a049]">
            <Phone className="mr-2 size-4" />
            Contact Support
          </Button>
        </section>
      </main>
    </div>
  )
}
