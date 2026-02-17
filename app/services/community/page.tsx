"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Users, Zap, Droplets, Trash2, Heart, Info, MapPin, Phone } from "lucide-react"

export default function CommunityServicesPage() {
    const router = useRouter()

    const services = [
        {
            title: "Water Access",
            status: "Operational",
            location: "Freetown, Central",
            description: "Community water tanks and pump stations reporting status.",
            icon: <Droplets className="size-6 text-blue-500" />,
            color: "bg-blue-50 text-blue-700 border-blue-100",
        },
        {
            title: "Electricity Supply",
            status: "Maintenance",
            location: "Bo District",
            description: "Scheduled grid maintenance and restoration updates.",
            icon: <Zap className="size-6 text-yellow-600" />,
            color: "bg-yellow-50 text-yellow-700 border-yellow-100",
        },
        {
            title: "Waste Collection",
            status: "Normal",
            location: "Makeni",
            description: "Weekly sanitation and waste disposal schedule for residences.",
            icon: <Trash2 className="size-6 text-green-600" />,
            color: "bg-green-50 text-green-700 border-green-100",
        },
        {
            title: "Youth Support Center",
            status: "Open",
            location: "Western Area",
            description: "Skills training, counseling, and social support services.",
            icon: <Heart className="size-6 text-red-500" />,
            color: "bg-red-50 text-red-700 border-red-100",
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
                        <Users className="size-8 text-[#4CAF50]" />
                        <h1 className="text-2xl font-bold text-gray-800">Community Services</h1>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-12">
                <div className="max-w-4xl mx-auto mb-12">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4 tracking-tight">Essential Local Services</h2>
                    <p className="text-lg text-gray-600">
                        Real-time updates and information about vital utilities and support systems in your community.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
                    {services.map((service) => (
                        <Card key={service.title} className="hover:shadow-md transition-shadow border-[#4CAF50]/10">
                            <CardHeader className="flex flex-row items-center gap-4">
                                <div className="size-12 rounded-xl bg-white shadow-sm flex items-center justify-center flex-shrink-0">
                                    {service.icon}
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-1">
                                        <CardTitle className="text-xl font-bold text-gray-800">{service.title}</CardTitle>
                                        <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider ${service.color}`}>
                                            {service.status}
                                        </span>
                                    </div>
                                    <CardDescription className="flex items-center gap-1">
                                        <MapPin className="size-3" />
                                        {service.location}
                                    </CardDescription>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <p className="text-gray-600">{service.description}</p>
                                <div className="flex gap-2">
                                    <Button variant="outline" size="sm" className="flex-1 border-[#4CAF50]/20 hover:bg-[#4CAF50]/5">
                                        <Info className="mr-2 size-4" />
                                        Details
                                    </Button>
                                    <Button variant="outline" size="sm" className="flex-1 border-[#4CAF50]/20 hover:bg-[#4CAF50]/5">
                                        <Phone className="mr-2 size-4" />
                                        Contact
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <section className="mt-16 max-w-4xl mx-auto">
                    <Card className="bg-white border-2 border-[#4CAF50]/20 p-8">
                        <div className="text-center">
                            <h3 className="text-2xl font-bold text-gray-800 mb-4">Need Local Support?</h3>
                            <p className="text-gray-600 mb-8 max-w-xl mx-auto">
                                Our community liaisons are available to help you navigate local services and address any concerns you may have regarding utilities or youth support.
                            </p>
                            <div className="flex flex-col sm:flex-row justify-center gap-4">
                                <Button className="bg-[#4CAF50] hover:bg-[#45a049] px-8 py-6 text-lg font-bold">
                                    Contact Community Liaison
                                </Button>
                                <Button variant="outline" className="border-[#4CAF50] text-[#4CAF50] px-8 py-6 text-lg font-bold">
                                    Submit Feedback
                                </Button>
                            </div>
                        </div>
                    </Card>
                </section>
            </main>
        </div>
    )
}
