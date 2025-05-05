"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Database, CheckCircle } from "lucide-react"
import { appendToSheet, isGoogleSheetsConfigured } from "@/services/google-sheets-service"

// Sample data for each sheet
const sampleData = {
  Users: [
    {
      id: "user-sample-1",
      email: "sample-user@example.com",
      name: "Sample User",
      password: "password123",
      role: "editor",
      color: "bg-sky-100 text-sky-700 border-sky-200",
    },
  ],
  Budget: [
    {
      id: "venue-license",
      category: "Venue",
      lineItem: "Rockefeller Rink private licence (4 h)",
      cost: 55000,
    },
    {
      id: "venue-services",
      category: "",
      lineItem: "Mandatory security/cleaning/utilities",
      cost: 8000,
    },
    {
      id: "court-rental",
      category: "Sport infrastructure",
      lineItem: "Portable PSA glass court (rental + install)",
      cost: 25000,
    },
  ],
  Timeline: [
    {
      id: "psa-sanction",
      name: "PSA Written Sanction",
      status: "Pending",
      statusClass: "text-amber-500 border-amber-200 bg-amber-50",
      date: "May 7, 2025",
      progress: 70,
    },
    {
      id: "wsf-alignment",
      name: "WSF Alignment",
      status: "In Review",
      statusClass: "text-amber-500 border-amber-200 bg-amber-50",
      date: "May 5, 2025",
      progress: 50,
    },
  ],
  Schedule: [
    {
      id: "arrival",
      time: "18:00",
      segment: "Guest arrival",
      duration: "30 min",
      content: "Music playlist, welcome drinks, photo wall",
    },
    {
      id: "reveal",
      time: "18:30",
      segment: "Court reveal",
      duration: "3 min",
      content: "Curtain drop, lighting hit",
    },
  ],
  Venue: [
    {
      id: "location",
      attribute: "Location",
      detail: "Sunken Plaza, Midtown Manhattan",
    },
    {
      id: "capacity",
      attribute: "Capacity",
      detail: "Sunken Plaza: 500 guests (rockefellercenter.com)",
    },
  ],
  Objectives: [
    {
      id: "obj1",
      goal: "Showcase new 40-minute match model",
      metric: "TV-ready run-of-show executed ≤ 105 min",
      threshold: "< 5 min deviation",
      status: "Planned",
      progress: 25,
    },
    {
      id: "obj2",
      goal: "Generate sponsor & media assets",
      metric: "15 editable highlight clips within 24 h",
      threshold: "100k aggregate views",
      status: "Planned",
      progress: 15,
    },
  ],
  Risks: [
    {
      id: "psa-letter",
      risk: "PSA letter delayed",
      impact: "Cannot contract venue/athletes",
      mitigation: "Keep option holds; no deposits until letter received",
      severity: "High",
      severityClass: "bg-rose-500",
      mitigationProgress: 70,
      status: "Monitoring",
    },
    {
      id: "wsf-objections",
      risk: "WSF objections",
      impact: "Sanction language changes",
      mitigation: "Include revision buffer before 13 May board vote",
      severity: "Medium",
      severityClass: "bg-amber-500",
      mitigationProgress: 50,
      status: "Mitigating",
    },
  ],
  Legal: [
    {
      id: "psa-sanction",
      milestone: "PSA written sanction",
      status: 'Verbal "go"; letter pending',
      statusClass: "bg-amber-50 text-amber-500 border-amber-200",
      nextAction: "Follow-up with PSA CEO",
      targetDate: "7 May 25",
    },
    {
      id: "wsf-alignment",
      milestone: "WSF alignment",
      status: "Proposal under review",
      statusClass: "bg-amber-50 text-amber-500 border-amber-200",
      nextAction: "PSA × WSF call",
      targetDate: "5 May 25",
    },
  ],
  EditHistory: [
    {
      id: "edit-sample-1",
      userId: "user-sample-1",
      userName: "Sample User",
      userRole: "editor",
      fieldId: "sample-field",
      timestamp: Date.now(),
      previousValue: JSON.stringify("Old Value"),
      newValue: JSON.stringify("New Value"),
      section: "Sample Section",
    },
  ],
}

export function DataInitializer() {
  const [isInitializing, setIsInitializing] = useState(false)
  const [status, setStatus] = useState<Record<string, "pending" | "success" | "error">>({})
  const [error, setError] = useState<string | null>(null)
  const [isComplete, setIsComplete] = useState(false)

  const initializeData = async () => {
    if (!isGoogleSheetsConfigured()) {
      setError("Google Sheets is not configured. Please set up your API key and spreadsheet ID first.")
      return
    }

    setIsInitializing(true)
    setError(null)
    setIsComplete(false)

    const sheets = Object.keys(sampleData)
    const newStatus: Record<string, "pending" | "success" | "error"> = {}

    for (const sheet of sheets) {
      newStatus[sheet] = "pending"
      setStatus({ ...newStatus })

      try {
        // @ts-ignore
        for (const item of sampleData[sheet]) {
          await appendToSheet(sheet, item)
        }
        newStatus[sheet] = "success"
      } catch (err) {
        console.error(`Error initializing ${sheet} data:`, err)
        newStatus[sheet] = "error"
        setError(`Failed to initialize ${sheet} data. Please try again.`)
      }

      setStatus({ ...newStatus })
    }

    setIsInitializing(false)

    // Check if all were successful
    const allSuccess = Object.values(newStatus).every((s) => s === "success")
    setIsComplete(allSuccess)
  }

  return (
    <Card className="w-full max-w-3xl mx-auto mt-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-6 w-6 text-primary" />
          Initialize Sample Data
        </CardTitle>
        <CardDescription>Populate your Google Sheet with sample data for testing</CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {isComplete && (
          <Alert className="bg-green-50 text-green-700 border-green-200 mb-4">
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>Sample data has been successfully initialized in your Google Sheet!</AlertDescription>
          </Alert>
        )}

        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            This will populate your Google Sheet with sample data for each tab. This is useful for testing the
            application with real data. You can run this once to initialize your sheets.
          </p>

          {Object.keys(status).length > 0 && (
            <div className="space-y-2 mt-4">
              <h3 className="text-sm font-medium">Initialization Status:</h3>
              <div className="space-y-2">
                {Object.entries(status).map(([sheet, state]) => (
                  <div key={sheet} className="flex items-center justify-between text-sm">
                    <span>{sheet}</span>
                    <span
                      className={
                        state === "success" ? "text-green-600" : state === "error" ? "text-red-600" : "text-amber-600"
                      }
                    >
                      {state === "success" ? (
                        <span className="flex items-center">
                          <CheckCircle className="h-4 w-4 mr-1" /> Complete
                        </span>
                      ) : state === "error" ? (
                        "Failed"
                      ) : (
                        "Pending"
                      )}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={initializeData} disabled={isInitializing} className="flex items-center gap-2">
          {isInitializing && <Loader2 className="h-4 w-4 animate-spin" />}
          {isInitializing ? "Initializing..." : "Initialize Sample Data"}
        </Button>
      </CardFooter>
    </Card>
  )
}
