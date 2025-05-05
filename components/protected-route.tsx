"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Loader2 } from "lucide-react"

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    // Add a timeout to prevent infinite loading state
    const timeoutId = setTimeout(() => {
      setIsChecking(false)
      if (status === "unauthenticated") {
        router.push("/login")
      }
    }, 5000)

    if (status === "unauthenticated") {
      clearTimeout(timeoutId)
      setIsChecking(false)
      router.push("/login")
    } else if (status === "authenticated") {
      clearTimeout(timeoutId)
      setIsChecking(false)
      setIsAuthorized(true)
    }

    return () => clearTimeout(timeoutId)
  }, [status, session, router])

  if (isChecking || status === "loading") {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!isAuthorized) {
    return null
  }

  return <>{children}</>
}
