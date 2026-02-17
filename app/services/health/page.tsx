"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, HeartPulse, Hospital, Syringe, Baby, Activity, Info, MapPin, Phone, Search } from "lucide-react"
import { Input } from "@/components/ui/input"

export default function HealthServicesPage() {
    const router = useRouter()

    const healthFacilities = [
        {
            name: "Connaught Government Hospital",
            type: "Tertiary Hospital",
            location: "Lightfoot Boston Street, Freetown",
            status: "Emergency Open 24/7",
            services: ["General Medicine", "Surgery", "Emergency"],
            icon: <Hospital className="size-6 text-red-600" />,
        },
        {
            name: "Ola During Children's Hospital",
            type: "Specialist Hospital",
            location: "Fourah Bay Road, Freetown",
            status: "Open 24/7",
            services: ["Pediatrics", "Neonatal Care", "Immunization"],
            icon: <Baby className="size-6 text-blue-600" />,
        },
        {
            name: "PCMH (Princess Christian Maternity Hospital)",
            type: "Specialist Hospital",
            location: "Fourah Bay Road, Freetown",
            status: "Open 24/7",
            services: ["Maternal Health", "Obstetrics", "Family Planning"],
            icon: <HeartPulse className="size-6 text-[#4CAF50]" />,
        },
        {
            name: "Community Vaccination Center",
            type: "Clinic",
            location: "Bo City Center",
            status: "Open 8:00 - 17:00",
            services: ["COVID-19", "Malaria", "Childhood Vaccines"],
            icon: <Syringe className="size-6 text-purple-600" />,
        },
    ]

    return (
        <div className="min-h-screen bg-[#F5F9F5] font-sans">
            <header className="border-b border-[#4CAF50]/20 bg-white/80 backdrop-blur-md sticky top-0 z-10">
                <div className="container mx-auto px-4 py-4 flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => router.push("/services")}
                        className="hover:bg-[#4CAF50]/10 text-[#4CAF50]"
                    >
                        <ArrowLeft className="size-6" />
                    </Button>
                    <div className="flex items-center gap-2">
                        <HeartPulse className="size-8 text-[#4CAF50]" />
                        <h1 className="text-2xl font-bold text-gray-800">Health Services</h1>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-12">
                <div className="max-w-4xl mx-auto mb-12">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4 tracking-tight">Public Health Resources</h2>
                    <p className="text-lg text-gray-600 mb-8">
                        Access mapping and status of healthcare facilities and vaccination centers across Sierra Leone.
                    </p>

                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
                        <Input
                            placeholder="Search by facility name or location (e.g. Freetown, Bo)..."
                            className="pl-12 py-6 text-lg border-2 border-[#4CAF50]/20 focus:border-[#4CAF50] transition-all"
                        />
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
                    {healthFacilities.map((facility) => (
                        <Card key={facility.name} className="hover:shadow-md transition-shadow border-[#4CAF50]/10 overflow-hidden">
                            <div className="h-2 bg-gradient-to-r from-[#4CAF50] to-[#8BC34A]" />
                            <CardHeader className="flex flex-row items-center gap-4">
                                <div className="size-12 rounded-xl bg-gray-50 flex items-center justify-center flex-shrink-0">
                                    {facility.icon}
                                </div>
                                <div className="flex-1">
                                    <CardTitle className="text-xl font-bold text-gray-800">{facility.name}</CardTitle>
                                    <CardDescription>{facility.type}</CardDescription>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2 text-sm">
                                    <p className="flex items-center gap-2 text-gray-600">
                                        <MapPin className="size-4 text-[#4CAF50]" />
                                        {facility.location}
                                    </p>
                                    <p className="flex items-center gap-2 text-[#4CAF50] font-bold">
                                        <Activity className="size-4" />
                                        {facility.status}
                                    </p>
                                </div>

                                <div className="flex flex-wrap gap-2 pt-2">
                                    {facility.services.map(s => (
                                        <span key={s} className="px-2 py-1 bg-gray-100 rounded text-xs text-gray-600 font-medium">
                                            {s}
                                        </span>
                                    ))}
                                </div>

                                <div className="flex gap-2 pt-2">
                                    <Button className="flex-1 bg-[#4CAF50] hover:bg-[#45a049]">
                                        <MapPin className="mr-2 size-4" />
                                        Get Directions
                                    </Button>
                                    <Button variant="outline" size="icon" className="border-gray-200">
                                        <Phone className="size-4" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <section className="mt-16 max-w-4xl mx-auto text-center py-12 bg-white rounded-3xl border border-[#4CAF50]/10 shadow-sm">
                    <h3 className="text-2xl font-bold text-gray-800 mb-4">Emergency Hotlines</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 px-8">
                        <div className="p-4 rounded-xl bg-red-50">
                            <p className="text-xs text-red-700 font-bold uppercase mb-1">Police</p>
                            <p className="text-xl font-extrabold text-red-900">999</p>
                        </div>
                        <div className="p-4 rounded-xl bg-blue-50">
                            <p className="text-xs text-blue-700 font-bold uppercase mb-1">Ambulance</p>
                            <p className="text-xl font-extrabold text-blue-900">117</p>
                        </div>
                        <div className="p-4 rounded-xl bg-green-50">
                            <p className="text-xs text-green-700 font-bold uppercase mb-1">Child Helpline</p>
                            <p className="text-xl font-extrabold text-green-900">116</p>
                        </div>
                        <div className="p-4 rounded-xl bg-purple-50">
                            <p className="text-xs text-purple-700 font-bold uppercase mb-1">Gender Base</p>
                            <p className="text-xl font-extrabold text-purple-900">122</p>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    )
}
