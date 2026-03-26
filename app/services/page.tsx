"use client"
export const dynamic = "force-dynamic"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Users, HeartPulse, Zap, Droplets, Trash2, ShieldCheck, BadgeHelp, Landmark, Phone } from "lucide-react"

export default function ServicesPage() {
    const router = useRouter()

    const serviceCategories = [
        {
            title: "Community Services",
            description: "Access essential utilities and youth support systems in your area.",
            icon: <Users className="size-8 text-[#4CAF50]" />,
            link: "/services/community",
            color: "border-[#4CAF50]/30 hover:border-[#4CAF50]",
            details: ["Water access", "Electricity status", "Waste disposal", "Youth support"],
        },
        {
            title: "Health Services",
            description: "Find local clinics, hospitals, and vaccination centers across Sierra Leone.",
            icon: <HeartPulse className="size-8 text-[#4CAF50]" />,
            link: "/services/health",
            color: "border-[#4CAF50]/30 hover:border-[#4CAF50]",
            details: ["Clinics & Hospitals", "Vaccination centers", "Maternal health", "Emergency care"],
        },
        {
            title: "Business Support",
            description: "Registration, micro-loans, and training for young entrepreneurs.",
            icon: <Landmark className="size-8 text-[#4CAF50]" />,
            link: "/services/business",
            color: "border-[#4CAF50]/30 hover:border-[#4CAF50]",
            details: ["Business registration", "Micro-loans", "Market access", "Training"],
        },
        {
            title: "Safety & Security",
            description: "Emergency hotlines and safe locations for citizens.",
            icon: <ShieldCheck className="size-8 text-[#4CAF50]" />,
            link: "/services/safety",
            color: "border-[#4CAF50]/30 hover:border-[#4CAF50]",
            details: ["Emergency hotlines", "Incident reporting", "Safe locations", "Security tips"],
        },
    ]

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#F5F9F5] via-white to-[#F5F9F5] font-sans">
            {/* Header */}
            <header className="border-b border-[#4CAF50]/20 bg-white/80 backdrop-blur-md sticky top-0 z-10 transition-all">
                <div className="container mx-auto px-4 py-4 flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => router.push("/dashboard")}
                        className="hover:bg-[#4CAF50]/10 text-[#4CAF50]"
                    >
                        <ArrowLeft className="size-6" />
                    </Button>
                    <div className="flex items-center gap-2">
                        <Landmark className="size-8 text-[#4CAF50]" />
                        <h1 className="text-2xl font-bold text-gray-800">Citizens Services</h1>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-12">
                <div className="max-w-4xl mx-auto mb-16 text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 tracking-tight">
                        How Can We <span className="text-[#4CAF50]">Help You</span> Today?
                    </h2>
                    <p className="text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto">
                        Access essential services provided by the government and community partners to support your growth and well-being in Sierra Leone.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                    {serviceCategories.map((category, index) => (
                        <Card
                            key={category.title}
                            className={`group cursor-pointer transition-all duration-300 border-2 ${category.color} hover:shadow-2xl hover:-translate-y-2 overflow-hidden bg-white animate-in fade-in slide-in-from-bottom-8 duration-700 delay-${index * 100}`}
                            onClick={() => router.push(category.link)}
                        >
                            <CardHeader className="relative pb-4">
                                <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-150 transition-transform duration-500">
                                    {category.icon}
                                </div>
                                <div className="size-16 rounded-2xl bg-[#4CAF50]/10 flex items-center justify-center mb-4 group-hover:bg-[#4CAF50]/20 transition-colors">
                                    {category.icon}
                                </div>
                                <CardTitle className="text-2xl font-bold text-gray-800 group-hover:text-[#4CAF50] transition-colors">
                                    {category.title}
                                </CardTitle>
                                <CardDescription className="text-base text-gray-600">
                                    {category.description}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-wrap gap-2">
                                    {category.details.map((detail) => (
                                        <span
                                            key={detail}
                                            className="px-3 py-1 bg-[#F5F9F5] border border-[#4CAF50]/10 rounded-full text-sm font-medium text-[#4CAF50]"
                                        >
                                            {detail}
                                        </span>
                                    ))}
                                </div>
                                <Button
                                    className="w-full mt-8 bg-[#4CAF50] hover:bg-[#45a049] text-white font-bold py-6 text-lg transition-all group-hover:gap-4"
                                >
                                    Explore Services
                                    <ArrowLeft className="size-5 rotate-180" />
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Emergency Section */}
                <section className="mt-20 max-w-5xl mx-auto bg-red-50 border-2 border-red-200 rounded-3xl p-8 md:p-12 animate-in zoom-in duration-700">
                    <div className="flex flex-col md:flex-row items-center gap-8">
                        <div className="size-24 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 animate-pulse">
                            <Phone className="size-12 text-red-600" />
                        </div>
                        <div className="text-center md:text-left flex-1">
                            <h3 className="text-2xl font-bold text-red-900 mb-2">Emergency Assistance</h3>
                            <p className="text-red-700 mb-6 text-lg">
                                If you are in immediate danger or need urgent medical attention, call the national emergency line.
                            </p>
                            <div className="flex flex-wrap justify-center md:justify-start gap-4">
                                <Button
                                    size="lg"
                                    variant="destructive"
                                    className="bg-red-600 hover:bg-red-700 font-bold px-8 py-6 text-xl"
                                    onClick={() => {
                                        if (typeof window !== "undefined") {
                                            window.location.href = "tel:999"
                                        }
                                    }}
                                >
                                    Call 999
                                </Button>
                                <Button
                                    size="lg"
                                    variant="outline"
                                    className="border-red-600 text-red-600 hover:bg-red-50 font-bold px-8 py-6 text-xl"
                                    onClick={() => router.push("/contact")}
                                >
                                    Report Incident
                                </Button>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <footer className="mt-24 py-12 border-t border-gray-100 bg-white">
                <div className="container mx-auto px-4 text-center">
                    <p className="text-gray-500 font-medium">© 2026 AI CV Builder Sierra Leone. Supporting our youth.</p>
                </div>
            </footer>
        </div>
    )
}
