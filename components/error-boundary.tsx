"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"

interface ErrorBoundaryProps {
  children: React.ReactNode
}

export function ErrorBoundary({ children }: ErrorBoundaryProps) {
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      console.error("Caught error:", event.error)
      setError(event.error)
      event.preventDefault()
    }

    window.addEventListener("error", handleError)
    return () => window.removeEventListener("error", handleError)
  }, [])

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <Alert variant="destructive" className="max-w-md">
          <AlertTitle>Something went wrong</AlertTitle>
          <AlertDescription className="mt-2">
            <p className="mb-4">{error.message || "An unexpected error occurred"}</p>
            <Button onClick={() => window.location.reload()}>Reload page</Button>
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return <>{children}</>
}
