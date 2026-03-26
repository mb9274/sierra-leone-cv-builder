import { Suspense } from "react"
import SignInClient from "./sign-in-client"
export const dynamic = "force-dynamic"

export default function SignInPage() {
  return (
    <Suspense fallback={null}>
      <SignInClient />
    </Suspense>
  )
}
