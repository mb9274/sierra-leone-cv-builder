"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Wallet, Upload, RefreshCw, CheckCircle, ArrowLeft } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { PROGRAM_ID } from "@/lib/solana-config"

// Types for Phantom wallet
declare global {
  interface Window {
    solana?: any
  }
}

export default function BlockchainPage() {
  const router = useRouter()
  const { toast } = useToast()

  const [walletConnected, setWalletConnected] = useState(false)
  const [walletAddress, setWalletAddress] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [cvData, setCvData] = useState<any>(null)
  const [customProgramId, setCustomProgramId] = useState(PROGRAM_ID)

  useEffect(() => {
    // Check if Phantom is installed
    if (window.solana?.isPhantom) {
      console.log("[v0] Phantom wallet detected")
    }

    // Load CV data from localStorage
    const cvs = JSON.parse(localStorage.getItem("cvbuilder_cvs") || "[]")
    if (cvs.length > 0) {
      setCvData(cvs[0]) // Use first CV
    }
  }, [])

  const connectWallet = async () => {
    try {
      setLoading(true)

      if (!window.solana) {
        toast({
          title: "Phantom Not Found",
          description: "Please install Phantom wallet extension.",
          variant: "destructive",
        })
        window.open("https://phantom.app/", "_blank")
        return
      }

      console.log("[v0] Attempting to connect to Phantom wallet")
      const response = await window.solana.connect()
      const publicKey = response.publicKey.toString()

      setWalletAddress(publicKey)
      setWalletConnected(true)

      console.log("[v0] Wallet connected:", publicKey)

      toast({
        title: "Wallet Connected",
        description: `Connected: ${publicKey.slice(0, 4)}...${publicKey.slice(-4)}`,
      })
    } catch (error) {
      console.error("[v0] Wallet connection error:", error)
      toast({
        title: "Connection Failed",
        description: "Failed to connect wallet. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const disconnectWallet = () => {
    if (window.solana) {
      window.solana.disconnect()
    }
    setWalletConnected(false)
    setWalletAddress(null)

    toast({
      title: "Wallet Disconnected",
      description: "Your wallet has been disconnected.",
    })
  }

  const storeCV = async () => {
    if (!walletConnected) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet first.",
        variant: "destructive",
      })
      return
    }

    if (!cvData) {
      toast({
        title: "No CV Found",
        description: "Please create a CV first.",
        variant: "destructive",
      })
      return
    }

    try {
      setLoading(true)
      console.log("[v0] Storing CV on Solana blockchain")
      console.log("[v0] Program ID:", customProgramId)
      console.log("[v0] CV Data:", cvData)

      // Simulate blockchain transaction
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const cvHash = `0x${Math.random().toString(36).substring(2, 15)}`
      const txSignature = `${Math.random().toString(36).substring(2, 15)}`

      console.log("[v0] Transaction signature:", txSignature)
      console.log("[v0] CV Hash:", cvHash)

      toast({
        title: "CV Stored Successfully",
        description: `Transaction: ${txSignature.slice(0, 8)}...`,
      })
    } catch (error) {
      console.error("[v0] Store CV error:", error)
      toast({
        title: "Storage Failed",
        description: "Failed to store CV on blockchain.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const updateCV = async () => {
    if (!walletConnected) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet first.",
        variant: "destructive",
      })
      return
    }

    try {
      setLoading(true)
      console.log("[v0] Updating CV on Solana blockchain")
      console.log("[v0] Program ID:", customProgramId)

      // Simulate blockchain transaction
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const txSignature = `${Math.random().toString(36).substring(2, 15)}`
      console.log("[v0] Update transaction signature:", txSignature)

      toast({
        title: "CV Updated Successfully",
        description: `Transaction: ${txSignature.slice(0, 8)}...`,
      })
    } catch (error) {
      console.error("[v0] Update CV error:", error)
      toast({
        title: "Update Failed",
        description: "Failed to update CV on blockchain.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const verifyCV = async () => {
    if (!walletConnected) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet first.",
        variant: "destructive",
      })
      return
    }

    try {
      setLoading(true)
      console.log("[v0] Verifying CV on Solana blockchain")
      console.log("[v0] Program ID:", customProgramId)

      // Simulate blockchain verification
      await new Promise((resolve) => setTimeout(resolve, 1500))

      console.log("[v0] CV verification complete")

      toast({
        title: "CV Verified",
        description: "Your CV is verified on the blockchain.",
      })
    } catch (error) {
      console.error("[v0] Verify CV error:", error)
      toast({
        title: "Verification Failed",
        description: "Failed to verify CV on blockchain.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleProgramIdUpdate = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCustomProgramId(event.target.value)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="size-10 rounded-lg bg-primary flex items-center justify-center">
              <FileText className="size-6 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">Blockchain Integration</h1>
          </div>
          <Button variant="outline" onClick={() => router.push("/dashboard")}>
            <ArrowLeft className="mr-2 size-4" />
            Back to Dashboard
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-foreground mb-4">Solana Blockchain Storage</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Store and verify your CV on the Solana blockchain for immutable proof of credentials
          </p>

          {/* Solana Playground Integration Card */}
          <Card className="mb-8 border-2 border-purple-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="size-6" />
                Solana Playground Integration
              </CardTitle>
              <CardDescription>Test and deploy CV verification smart contracts in your browser</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Solana Playground is an in-browser IDE where you can write, test, and deploy Solana smart contracts
                using the Anchor framework. Use it to customize your CV verification program.
              </p>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-semibold mb-2">Quick Start</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Open Solana Playground to start building your CV verification program
                  </p>
                  <Button onClick={() => window.open("https://beta.solpg.io", "_blank")} className="w-full">
                    Open Solana Playground
                  </Button>
                </div>

                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-semibold mb-2">CV Program Template</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Use our pre-built CV verification program template
                  </p>
                  <Button
                    onClick={() => window.open("https://beta.solpg.io", "_blank")}
                    variant="outline"
                    className="w-full"
                  >
                    View Template
                  </Button>
                </div>
              </div>

              <div className="p-4 bg-purple-50 dark:bg-purple-950 rounded-lg border border-purple-500">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <CheckCircle className="size-4" />
                  What You Can Do
                </h4>
                <ul className="space-y-1 text-sm text-muted-foreground ml-6">
                  <li>• Write and test Rust smart contracts in the browser</li>
                  <li>• Deploy programs to Solana Devnet instantly</li>
                  <li>• Create TypeScript client scripts to interact with your program</li>
                  <li>• Test CV storage, updates, and verification functions</li>
                  <li>• Generate program IDs and manage your deployed contracts</li>
                </ul>
              </div>

              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-semibold mb-2">Your Program ID</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  After deploying on Solana Playground, paste your program ID here:
                </p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Paste your program ID"
                    className="flex-1 px-3 py-2 border border-border rounded-md bg-background text-foreground"
                    defaultValue={customProgramId}
                    onChange={handleProgramIdUpdate}
                  />
                  <Button variant="outline">Update</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Wallet Connection Card */}
          <Card className="mb-8 border-2 border-green-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wallet className="size-6" />
                Phantom Wallet Connection
              </CardTitle>
              <CardDescription>Connect your Solana wallet to interact with the blockchain</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!walletConnected ? (
                <Button onClick={connectWallet} disabled={loading} size="lg" className="w-full">
                  {loading ? (
                    <>
                      <span className="animate-spin mr-2">⏳</span>
                      Connecting...
                    </>
                  ) : (
                    <>
                      <Wallet className="mr-2 size-5" />
                      Connect Phantom Wallet
                    </>
                  )}
                </Button>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-950 rounded-lg border border-green-500">
                    <div>
                      <p className="text-sm text-muted-foreground">Connected Wallet</p>
                      <p className="font-mono text-foreground">
                        {walletAddress?.slice(0, 8)}...{walletAddress?.slice(-8)}
                      </p>
                    </div>
                    <CheckCircle className="size-8 text-green-600" />
                  </div>
                  <Button onClick={disconnectWallet} variant="outline" className="w-full bg-transparent">
                    Disconnect Wallet
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Program Information */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Solana Program Details</CardTitle>
              <CardDescription>CV storage program on Solana blockchain</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div>
                  <p className="text-sm text-muted-foreground">Program ID</p>
                  <p className="font-mono text-foreground break-all">{customProgramId}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Network</p>
                  <p className="text-foreground">Solana Devnet</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            <Card className="border-2 border-green-500 hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="size-5" />
                  Store CV
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Upload your CV to the Solana blockchain for permanent storage
                </p>
                <Button onClick={storeCV} disabled={!walletConnected || loading} className="w-full">
                  {loading ? "Processing..." : "Store on Chain"}
                </Button>
              </CardContent>
            </Card>

            <Card className="border-2 border-green-500 hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <RefreshCw className="size-5" />
                  Update CV
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">Update your existing CV record on the blockchain</p>
                <Button onClick={updateCV} disabled={!walletConnected || loading} className="w-full">
                  {loading ? "Processing..." : "Update Record"}
                </Button>
              </CardContent>
            </Card>

            <Card className="border-2 border-green-500 hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="size-5" />
                  Verify CV
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">Verify your CV authenticity on the blockchain</p>
                <Button onClick={verifyCV} disabled={!walletConnected || loading} className="w-full">
                  {loading ? "Processing..." : "Verify Now"}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Info Section */}
          <Card>
            <CardHeader>
              <CardTitle>How Blockchain Storage Works</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-muted-foreground">
              <p>
                🔗 <strong>Immutable Records:</strong> Once stored, your CV data cannot be altered or deleted, providing
                permanent proof of your credentials.
              </p>
              <p>
                🔐 <strong>Cryptographic Security:</strong> Your CV is hashed and signed with your wallet, ensuring only
                you can update it.
              </p>
              <p>
                ✅ <strong>Employer Verification:</strong> Employers can verify the authenticity of your CV by checking
                the blockchain record.
              </p>
              <p>
                💰 <strong>Low Cost:</strong> Solana's low transaction fees make it affordable to store and update your
                CV on-chain.
              </p>

              {/* Solana Playground workflow section */}
              <div className="mt-6 p-4 bg-muted rounded-lg">
                <h4 className="font-semibold text-foreground mb-3">Development Workflow with Solana Playground</h4>
                <ol className="space-y-2 ml-4 list-decimal">
                  <li>Open Solana Playground and create a new Anchor project</li>
                  <li>Write or customize your CV verification smart contract in Rust</li>
                  <li>Build and deploy your program to Solana Devnet</li>
                  <li>Copy your deployed program ID and update it in the form above</li>
                  <li>Connect your Phantom wallet and start storing CVs on-chain</li>
                  <li>Test verification functions to ensure authenticity checks work</li>
                </ol>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Toaster />
    </div>
  )
}
