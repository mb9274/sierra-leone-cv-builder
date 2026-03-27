"use client"
export const dynamic = "force-dynamic"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, ShieldCheck, Siren, MapPin, Phone, FileWarning, NotebookPen } from "lucide-react"

export default function SafetyServicesPage() {
  const router = useRouter()

  const safetyItems = [
    {
      title: "Emergency Hotlines",
      description: "Quick access to police, ambulance, and child protection lines.",
      icon: <Siren className="size-6 text-red-600" />,
    },
    {
      title: "Incident Reporting",
      description: "Submit reports for local incidents and get routed to the right office.",
      icon: <FileWarning className="size-6 text-red-600" />,
    },
    {
      title: "Safe Locations",
      description: "Find safe places and community support centers nearby.",
      icon: <MapPin className="size-6 text-red-600" />,
    },
    {
      title: "Safety Guidance",
      description: "Practical tips for staying safe in public spaces and emergencies.",
      icon: <NotebookPen className="size-6 text-red-600" />,
    },
  ]

  return (
    <div className="min-h-screen bg-[#F5F9F5] font-sans">
      <header className="sticky top-0 z-10 border-b border-[#4CAF50]/20 bg-white/80 backdrop-blur-md">
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
            <ShieldCheck className="size-8 text-[#4CAF50]" />
            <h1 className="text-2xl font-bold text-gray-800">Safety & Security</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="mx-auto mb-12 max-w-4xl">
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-gray-900">Keep Yourself and Others Safe</h2>
          <p className="text-lg text-gray-600">
            Find emergency contacts, reporting tools, and nearby support services quickly.
          </p>
        </div>

        <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-2">
          {safetyItems.map((item) => (
            <Card key={item.title} className="border-red-100 bg-white transition-shadow hover:shadow-md">
              <CardHeader className="flex flex-row items-center gap-4">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-red-50 shadow-sm">
                  {item.icon}
                </div>
                <div>
                  <CardTitle className="text-xl font-bold text-gray-800">{item.title}</CardTitle>
                  <CardDescription>Trusted support and guidance</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{item.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <section className="mx-auto mt-16 max-w-4xl rounded-3xl border-2 border-red-200 bg-red-50 p-8 text-center">
          <h3 className="mb-4 text-2xl font-bold text-red-900">Emergency Assistance</h3>
          <p className="mb-8 text-red-700">If you are in immediate danger, contact emergency services now.</p>
          <Button
            size="lg"
            variant="destructive"
            className="bg-red-600 px-8 py-6 text-lg font-bold hover:bg-red-700"
            onClick={() => {
              if (typeof window !== "undefined") {
                window.location.href = "tel:999"
              }
            }}
          >
            <Phone className="mr-2 size-4" />
            Call 999
          </Button>
        </section>
      </main>
    </div>
  )
}
