"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle } from "lucide-react"

export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center gap-2">
            <AlertTriangle className="h-6 w-6 text-amber-500" />
            <CardTitle className="text-2xl">Access Denied</CardTitle>
          </div>
          <CardDescription className="text-center">You don&apos;t have permission to access this page</CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-muted-foreground">Please contact your administrator if you believe this is an error.</p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button asChild>
            <Link href="/">Return to Dashboard</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
