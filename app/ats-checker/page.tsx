import type { Metadata } from "next"
import ATSCheckerClient from "./ats-checker-client"

export const metadata: Metadata = {
  title: "ATS Checker - Konek Salone",
  description: "Check if your CV is compatible with Applicant Tracking Systems used by employers",
}

export default function ATSCheckerPage() {
  return <ATSCheckerClient />
}
