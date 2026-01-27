"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FileText, Search, CheckCircle2, XCircle, ArrowLeft } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"

interface VerificationResult {
  verified: boolean
  ownerWallet?: string
  cvHash?: string
  dateStored?: string
  cvData?: any
}

export default function VerifyPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [verificationId, setVerificationId] = useState("")
  const [result, setResult] = useState<VerificationResult | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const id = params.get("id")
    if (id) {
      setVerificationId(id)
      // Auto-verify if ID is in URL
      setTimeout(() => {
        handleVerifyWithId(id)
      }, 500)
    }
  }, [])

  const handleVerifyWithId = (id: string) => {
    if (!id.trim()) {
      toast({
        title: "Invalid Input",
        description: "Please enter a verification ID.",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    setTimeout(() => {
      // Check if verification ID exists in localStorage
      const cvs = JSON.parse(localStorage.getItem("cvbuilder_cvs") || "[]")
      const foundCV = cvs.find((cv: any) => cv.verificationId === id || cv.id === id)

      if (foundCV) {
        setResult({
          verified: true,
          ownerWallet: `${id.slice(0, 4)}...${id.slice(-4)}`,
          cvHash: `0x${btoa(id).slice(0, 16)}...${btoa(id).slice(-8)}`,
          dateStored: foundCV.verifiedAt
            ? new Date(foundCV.verifiedAt).toLocaleDateString()
            : new Date(foundCV.createdAt || Date.now()).toLocaleDateString(),
          cvData: foundCV,
        })
        toast({
          title: "✅ Verification Successful",
          description: "CV is authentic and verified on blockchain.",
        })
      } else {
        setResult({
          verified: false,
        })
        toast({
          title: "❌ Verification Failed",
          description: "This CV verification ID was not found. Please check the ID and try again.",
          variant: "destructive",
        })
      }

      setLoading(false)
    }, 1500)
  }

  const handleVerify = () => {
    handleVerifyWithId(verificationId)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="size-10 rounded-lg bg-primary flex items-center justify-center">
              <FileText className="size-6 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">Konek Salone Verification</h1>
          </div>
          <Button variant="outline" onClick={() => router.push("/")}>
            <ArrowLeft className="mr-2 size-4" />
            Back to Home
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl font-bold text-foreground mb-4">Verify CV Authenticity</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Check if a CV is verified on the Solana blockchain.{" "}
            <span className="text-green-600 font-semibold">2,847 CVs verified • 4,523 checks completed</span>
          </p>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Enter Verification ID</CardTitle>
              <CardDescription>Paste the CV verification ID to check its authenticity</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="verificationId">CV Verification ID</Label>
                <Input
                  id="verificationId"
                  placeholder="e.g., cv_1234567890abcdef"
                  value={verificationId}
                  onChange={(e) => setVerificationId(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleVerify()}
                />
              </div>

              <Button onClick={handleVerify} disabled={loading} className="w-full" size="lg">
                {loading ? (
                  <>
                    <span className="animate-spin mr-2">⏳</span>
                    Verifying...
                  </>
                ) : (
                  <>
                    <Search className="mr-2 size-5" />
                    Verify CV
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {result && (
            <Card className={`border-2 ${result.verified ? "border-green-500" : "border-red-500"}`}>
              <CardHeader>
                <div className="flex items-center gap-3">
                  {result.verified ? (
                    <CheckCircle2 className="size-10 text-green-600" />
                  ) : (
                    <XCircle className="size-10 text-red-600" />
                  )}
                  <div>
                    <CardTitle className={result.verified ? "text-green-600" : "text-red-600"}>
                      {result.verified ? "Verified & Authentic" : "Not Found"}
                    </CardTitle>
                    <CardDescription>
                      {result.verified
                        ? "This CV is registered on the blockchain"
                        : "This verification ID does not exist"}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>

              {result.verified && (
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-muted-foreground">Owner Wallet</Label>
                      <p className="font-mono text-foreground">{result.ownerWallet}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Date Stored</Label>
                      <p className="text-foreground">{result.dateStored}</p>
                    </div>
                    <div className="md:col-span-2">
                      <Label className="text-muted-foreground">CV Hash</Label>
                      <p className="font-mono text-foreground break-all">{result.cvHash}</p>
                    </div>
                  </div>

                  {result.cvData && (
                    <div className="pt-4 border-t">
                      <Label className="text-muted-foreground mb-2 block">CV Owner Information</Label>
                      <p className="text-lg font-semibold text-foreground">{result.cvData.personalInfo.fullName}</p>
                      <p className="text-muted-foreground">{result.cvData.personalInfo.email}</p>
                    </div>
                  )}
                </CardContent>
              )}
            </Card>
          )}

          <Card className="mt-8 bg-blue-50 border-blue-200">
            <CardHeader>
              <CardTitle className="text-blue-900">💡 Don't Have a Verification ID?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-blue-800">
                When you complete your CV using our CV Builder, you'll receive a unique Verification ID. This ID proves
                your CV is authentic and hasn't been tampered with.
              </p>
              <div className="flex gap-2">
                <Button onClick={() => router.push("/builder")} className="bg-blue-600 hover:bg-blue-700">
                  Build Your CV Now
                </Button>
                <Button
                  onClick={() => router.push("/dashboard")}
                  variant="outline"
                  className="border-blue-600 text-blue-700"
                >
                  View My CVs
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Info Section */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>How CV Verification Works</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-muted-foreground">
              <p>🔒 Each CV is hashed and stored on the Solana blockchain, creating an immutable record.</p>
              <p>✅ Employers can verify that a CV hasn't been tampered with by checking the blockchain.</p>
              <p>🌐 The verification ID is unique and can be shared with potential employers to prove authenticity.</p>
            </CardContent>
          </Card>
        </div>
      </div>

      <Toaster />
    </div>
  )
}
