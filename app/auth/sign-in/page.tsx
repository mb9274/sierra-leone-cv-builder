import { Suspense } from "react"
import SignInClient from "./sign-in-client"

export default function SignInPage() {
  return (
    <Suspense fallback={null}>
      <SignInClient />
    </Suspense>
  )
}
