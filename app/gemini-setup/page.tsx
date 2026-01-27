"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Sparkles, Key, CheckCircle2, XCircle, ExternalLink, Copy, ArrowRight } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

export default function GeminiSetupPage() {
  const [apiKey, setApiKey] = useState("")
  const [testing, setTesting] = useState(false)
  const [testResult, setTestResult] = useState<"success" | "error" | null>(null)
  const { toast } = useToast()

  const testApiKey = async () => {
    if (!apiKey.trim()) {
      toast({
        title: "Error",
        description: "Please enter an API key first",
        variant: "destructive",
      })
      return
    }

    setTesting(true)
    setTestResult(null)

    try {
      // Test the API key
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: "Test" }] }],
          }),
        },
      )

      if (response.ok) {
        setTestResult("success")
        toast({
          title: "Success!",
          description: "API key is valid and working",
        })
      } else {
        setTestResult("error")
        toast({
          title: "Error",
          description: "Invalid API key. Please check and try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      setTestResult("error")
      toast({
        title: "Error",
        description: "Failed to test API key",
        variant: "destructive",
      })
    } finally {
      setTesting(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied!",
      description: "Copied to clipboard",
    })
  }

  return (
    <div className="container max-w-4xl py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-balance mb-2">Gemini AI Setup</h1>
        <p className="text-muted-foreground">Connect Google Gemini AI to power intelligent CV suggestions</p>
      </div>

      <div className="space-y-6">
        {/* Current Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="size-5 text-primary" />
              AI Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Gemini AI</p>
                <p className="text-sm text-muted-foreground">{apiKey ? "API key configured" : "Not configured"}</p>
              </div>
              <Badge variant={apiKey ? "default" : "secondary"}>{apiKey ? "Active" : "Inactive"}</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Setup Instructions */}
        <Card>
          <CardHeader>
            <CardTitle>How to Get Your Gemini API Key</CardTitle>
            <CardDescription>Follow these steps to get your free Gemini API key from Google</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                  1
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold mb-1">Visit Google AI Studio</h4>
                  <p className="text-sm text-muted-foreground mb-2">Go to Google AI Studio to create your API key</p>
                  <Button variant="outline" size="sm" asChild>
                    <a href="https://makersuite.google.com/app/apikey" target="_blank" rel="noopener noreferrer">
                      Open AI Studio <ExternalLink className="ml-2 size-4" />
                    </a>
                  </Button>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                  2
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold mb-1">Sign in with Google Account</h4>
                  <p className="text-sm text-muted-foreground">Use your Gmail account to sign in to Google AI Studio</p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                  3
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold mb-1">Create API Key</h4>
                  <p className="text-sm text-muted-foreground mb-2">Click "Get API Key" or "Create API Key" button</p>
                  <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                    <li>Choose "Create API key in new project" if you don't have one</li>
                    <li>Or select an existing Google Cloud project</li>
                  </ul>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                  4
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold mb-1">Copy Your API Key</h4>
                  <p className="text-sm text-muted-foreground">Copy the generated API key and paste it below</p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                  5
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold mb-1">Test & Save</h4>
                  <p className="text-sm text-muted-foreground">
                    Test your API key below to make sure it works, then add it to your environment variables
                  </p>
                </div>
              </div>
            </div>

            <Alert>
              <Key className="size-4" />
              <AlertDescription>
                <strong>Important:</strong> Your API key should look like this:
                <code className="block mt-2 p-2 bg-muted rounded text-xs">AIzaSyA...xyz123</code>
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        {/* API Key Input */}
        <Card>
          <CardHeader>
            <CardTitle>Enter Your API Key</CardTitle>
            <CardDescription>Test your API key to ensure it works</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="apiKey">Gemini API Key</Label>
              <div className="flex gap-2">
                <Input
                  id="apiKey"
                  type="password"
                  placeholder="AIzaSy..."
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="flex-1"
                />
                <Button onClick={testApiKey} disabled={testing}>
                  {testing ? "Testing..." : "Test Key"}
                </Button>
              </div>
            </div>

            {testResult === "success" && (
              <Alert className="border-green-500 bg-green-50 dark:bg-green-950">
                <CheckCircle2 className="size-4 text-green-600" />
                <AlertDescription className="text-green-800 dark:text-green-200">
                  API key is valid! Now add it to your environment variables.
                </AlertDescription>
              </Alert>
            )}

            {testResult === "error" && (
              <Alert variant="destructive">
                <XCircle className="size-4" />
                <AlertDescription>Invalid API key. Please check your key and try again.</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Environment Setup */}
        <Card>
          <CardHeader>
            <CardTitle>Add to Environment Variables</CardTitle>
            <CardDescription>Add your API key to the project environment variables</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                After testing your API key, add it to your project's environment variables:
              </p>

              <div className="bg-muted p-4 rounded-lg space-y-2">
                <div className="flex items-center justify-between">
                  <code className="text-sm">GEMINI_API_KEY=your_api_key_here</code>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => copyToClipboard("GEMINI_API_KEY=your_api_key_here")}
                  >
                    <Copy className="size-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium">For v0/Vercel deployment:</p>
                <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                  <li>Go to the "Vars" section in the sidebar</li>
                  <li>
                    Add a new environment variable: <code>GEMINI_API_KEY</code>
                  </li>
                  <li>Paste your API key as the value</li>
                  <li>Save and redeploy your app</li>
                </ol>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium">For local development:</p>
                <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                  <li>
                    Create a <code>.env.local</code> file in your project root
                  </li>
                  <li>
                    Add the line: <code>GEMINI_API_KEY=your_api_key_here</code>
                  </li>
                  <li>Restart your development server</li>
                </ol>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Features */}
        <Card>
          <CardHeader>
            <CardTitle>AI-Powered Features</CardTitle>
            <CardDescription>What you can do once Gemini AI is configured</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="flex gap-3">
                <ArrowRight className="size-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Smart CV Summaries</p>
                  <p className="text-sm text-muted-foreground">
                    Generate professional summaries based on your education and experience
                  </p>
                </div>
              </li>
              <li className="flex gap-3">
                <ArrowRight className="size-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Experience Descriptions</p>
                  <p className="text-sm text-muted-foreground">Get AI-powered bullet points for your work experience</p>
                </div>
              </li>
              <li className="flex gap-3">
                <ArrowRight className="size-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Skills Suggestions</p>
                  <p className="text-sm text-muted-foreground">
                    Discover relevant skills based on your field and experience
                  </p>
                </div>
              </li>
              <li className="flex gap-3">
                <ArrowRight className="size-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Contextual Chatbot</p>
                  <p className="text-sm text-muted-foreground">
                    Get personalized career advice through AI conversations
                  </p>
                </div>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Return Button */}
        <div className="flex justify-center">
          <Button asChild size="lg">
            <Link href="/builder">
              Start Building Your CV <ArrowRight className="ml-2 size-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
