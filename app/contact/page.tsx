import Link from "next/link"
import { Phone, Mail, MapPin, MessageSquare, ArrowLeft, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="border-b border-border bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <FileText className="w-6 h-6 text-primary" />
              <span className="font-bold text-xl text-foreground">AI CV Builder</span>
            </Link>
            <Link href="/dashboard">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4">Get in Touch</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Have questions about CV building, job opportunities, or learning resources? We're here to help Sierra
              Leone youth succeed!
            </p>
          </div>

          {/* Contact Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {/* Phone Card */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
                  <Phone className="w-6 h-6 text-green-600" />
                </div>
                <CardTitle>Phone</CardTitle>
                <CardDescription>Call us directly for immediate assistance</CardDescription>
              </CardHeader>
              <CardContent>
                <a href="tel:+232073490048" className="text-lg font-semibold text-primary hover:underline">
                  +232 073 490 048
                </a>
                <p className="text-sm text-muted-foreground mt-2">Available Monday - Friday, 9AM - 5PM</p>
              </CardContent>
            </Card>

            {/* Email Card */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                  <Mail className="w-6 h-6 text-blue-600" />
                </div>
                <CardTitle>Email</CardTitle>
                <CardDescription>Send us a message anytime</CardDescription>
              </CardHeader>
              <CardContent>
                <a
                  href="mailto:mb9274276@gmail.com"
                  className="text-lg font-semibold text-primary hover:underline break-all"
                >
                  mb9274276@gmail.com
                </a>
                <p className="text-sm text-muted-foreground mt-2">We'll respond within 24 hours</p>
              </CardContent>
            </Card>

            {/* TikTok Card */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-purple-600" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                  </svg>
                </div>
                <CardTitle>TikTok</CardTitle>
                <CardDescription>Follow us for CV tips and job opportunities</CardDescription>
              </CardHeader>
              <CardContent>
                <a
                  href="https://www.tiktok.com/@mariama"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-lg font-semibold text-primary hover:underline"
                >
                  @mariama
                </a>
                <p className="text-sm text-muted-foreground mt-2">Daily tips, success stories & job alerts</p>
              </CardContent>
            </Card>

            {/* Location Card */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center mb-4">
                  <MapPin className="w-6 h-6 text-yellow-600" />
                </div>
                <CardTitle>Location</CardTitle>
                <CardDescription>Serving all of Sierra Leone</CardDescription>
              </CardHeader>
              <CardContent>
                <a
                  href="https://www.google.com/maps/place/Christex+Foundation/@8.4803307,-13.2222846,17z/data=!3m1!4b1!4m6!3m5!1s0xf04c395e1620bd5:0x80b0034ae8b982d8!8m2!3d8.4803307!4d-13.2222846!16s%2Fg%2F11v0mvnt_l?entry=ttu&g_ep=EgoyMDI2MDEyNS4wIKXMDSoASAFQAw%3D%3D"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block group"
                >
                  <p className="text-lg font-semibold text-foreground group-hover:underline">Sierra Leone 🇸🇱</p>
                  <p className="text-sm text-muted-foreground mt-2 group-hover:underline">
                    Freetown, Bo, Makeni & nationwide
                    <br />
                    Christex Foundation
                  </p>
                </a>
              </CardContent>
            </Card>
            {/* WhatsApp Card */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-green-600" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.008-.57-.008-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                  </svg>
                </div>
                <CardTitle>WhatsApp Group</CardTitle>
                <CardDescription>Join our community</CardDescription>
              </CardHeader>
              <CardContent>
                <a
                  href="https://chat.whatsapp.com/CRbj4asYBUQGqsjnSHK7CN"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-lg font-semibold text-primary hover:underline"
                >
                  Join WhatsApp Group
                </a>
                <p className="text-sm text-muted-foreground mt-2">Connect with other job seekers</p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Help Section */}
          <Card className="bg-gradient-to-br from-green-50 to-blue-50 border-2">
            <CardHeader>
              <div className="flex items-center gap-3">
                <MessageSquare className="w-6 h-6 text-primary" />
                <CardTitle>Need Quick Help?</CardTitle>
              </div>
              <CardDescription>Try our AI chatbot for instant answers</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">Our AI chatbot can help you with:</p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                  CV building tips and guidance
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                  Job search strategies
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-yellow-500" />
                  Platform features and tutorials
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                  ATS checker questions
                </li>
              </ul>
              <p className="text-sm font-medium text-foreground">
                Look for the chat icon in the bottom-right corner of any page!
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
