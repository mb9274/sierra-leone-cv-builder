"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Eye, Edit, User } from "lucide-react"
import type { CVData } from "@/lib/types"

export default function ProfilePage() {
  const router = useRouter()
  const [cvs, setCvs] = useState<CVData[]>([])
  const [userInfo, setUserInfo] = useState({ name: "", email: "" })

  useEffect(() => {
    const savedCvs = JSON.parse(localStorage.getItem("cvbuilder_cvs") || "[]")
    setCvs(savedCvs)

    if (savedCvs.length > 0) {
      setUserInfo({
        name: savedCvs[0].personalInfo.fullName,
        email: savedCvs[0].personalInfo.email,
      })
    }
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="size-16 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="size-8 text-primary" />
              </div>
              <div>
                <CardTitle className="text-2xl">{userInfo.name || "User Profile"}</CardTitle>
                <CardDescription>{userInfo.email || "No email provided"}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-muted rounded-lg">
                <p className="text-2xl font-bold text-foreground">{cvs.length}</p>
                <p className="text-sm text-muted-foreground">CVs Created</p>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <p className="text-2xl font-bold text-foreground">0</p>
                <p className="text-sm text-muted-foreground">Applications</p>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <p className="text-2xl font-bold text-foreground">Member</p>
                <p className="text-sm text-muted-foreground">Status</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Your CVs</CardTitle>
            <CardDescription>View and manage your saved CVs</CardDescription>
          </CardHeader>
          <CardContent>
            {cvs.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="size-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground mb-4">No CVs created yet</p>
                <Button onClick={() => router.push("/templates")}>Create Your First CV</Button>
              </div>
            ) : (
              <div className="space-y-4">
                {cvs.map((cv) => (
                  <div
                    key={cv.id}
                    className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="size-8 text-primary" />
                      <div>
                        <p className="font-semibold">{cv.personalInfo.fullName}</p>
                        <p className="text-sm text-muted-foreground">
                          Last edited: {new Date(cv.updatedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => router.push("/preview")}>
                        <Eye className="size-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => router.push("/builder")}>
                        <Edit className="size-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
