"use client"

import { GoogleSheetsSetup } from "@/components/google-sheets-setup"
import { DataInitializer } from "@/components/data-initializer"
import { AppsScriptSetup } from "@/components/apps-script-setup"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function SetupPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold">Dashboard Setup</h1>
          <Button variant="outline" asChild>
            <Link href="/" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>
        </div>

        <div className="space-y-8">
          <GoogleSheetsSetup />
          <AppsScriptSetup />
          <DataInitializer />
        </div>
      </div>
    </div>
  )
}
