"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle2, AlertCircle, ExternalLink } from "lucide-react"
import * as googleSheetsService from "@/services/google-sheets-service"

export function GoogleSheetsSetup() {
  const [testingConnection, setTestingConnection] = useState(false)
  const [connectionResult, setConnectionResult] = useState<{ success: boolean; message: string } | null>(null)
  const [testingWrite, setTestingWrite] = useState(false)
  const [writeResult, setWriteResult] = useState<{ success: boolean; message: string } | null>(null)
  const [apiConfig, setApiConfig] = useState<{ isConfigured: boolean; spreadsheetId: string | null }>({
    isConfigured: false,
    spreadsheetId: null,
  })

  useEffect(() => {
    // Initialize API configuration
    const initConfig = async () => {
      const config = await googleSheetsService.initApiConfig()
      setApiConfig(config)
    }

    initConfig()
  }, [])

  const handleTestConnection = async () => {
    setTestingConnection(true)
    setConnectionResult(null)

    try {
      const result = await googleSheetsService.testConnection()
      setConnectionResult(result)
    } catch (error) {
      setConnectionResult({
        success: false,
        message: `Error testing connection: ${error instanceof Error ? error.message : String(error)}`,
      })
    } finally {
      setTestingConnection(false)
    }
  }

  const handleTestWrite = async () => {
    setTestingWrite(true)
    setWriteResult(null)

    try {
      const result = await googleSheetsService.testWriteOperation()
      setWriteResult(result)
    } catch (error) {
      setWriteResult({
        success: false,
        message: `Error testing write operation: ${error instanceof Error ? error.message : String(error)}`,
      })
    } finally {
      setTestingWrite(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Google Sheets Integration</CardTitle>
        <CardDescription>Configure and test your Google Sheets integration</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Environment Variables</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-md border p-3">
              <div className="text-xs font-medium text-muted-foreground">Google Sheets API Key</div>
              <div className="mt-1 font-mono text-sm">
                {apiConfig.isConfigured ? "✅ Configured" : "❌ Not configured"}
              </div>
            </div>
            <div className="rounded-md border p-3">
              <div className="text-xs font-medium text-muted-foreground">Google Spreadsheet ID</div>
              <div className="mt-1 font-mono text-sm">
                {apiConfig.spreadsheetId ? "✅ Configured" : "❌ Not configured"}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-medium">Test Connection</h3>
          <div className="flex items-center gap-2">
            <Button onClick={handleTestConnection} disabled={testingConnection}>
              {testingConnection ? "Testing..." : "Test Connection"}
            </Button>
            <Button onClick={handleTestWrite} disabled={testingWrite}>
              {testingWrite ? "Testing..." : "Test Write Operation"}
            </Button>
          </div>

          {connectionResult && (
            <Alert variant={connectionResult.success ? "default" : "destructive"}>
              {connectionResult.success ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
              <AlertTitle>{connectionResult.success ? "Success" : "Error"}</AlertTitle>
              <AlertDescription>{connectionResult.message}</AlertDescription>
            </Alert>
          )}

          {writeResult && (
            <Alert variant={writeResult.success ? "default" : "destructive"}>
              {writeResult.success ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
              <AlertTitle>{writeResult.success ? "Success" : "Error"}</AlertTitle>
              <AlertDescription>{writeResult.message}</AlertDescription>
            </Alert>
          )}
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-medium">Google Sheet Structure</h3>
          <p className="text-sm text-muted-foreground">
            Your Google Sheet should have the following sheets with these headers:
          </p>
          <div className="space-y-4">
            <div className="rounded-md border p-3">
              <div className="font-medium">Users</div>
              <div className="mt-1 text-sm text-muted-foreground">
                id, email, name, password, role, color, createdAt
              </div>
            </div>
            <div className="rounded-md border p-3">
              <div className="font-medium">EditHistory</div>
              <div className="mt-1 text-sm text-muted-foreground">
                id, timestamp, userId, userName, userRole, fieldId, section, previousValue, newValue
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        {apiConfig.spreadsheetId ? (
          <a
            href={`https://docs.google.com/spreadsheets/d/${apiConfig.spreadsheetId}/edit`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
          >
            <ExternalLink className="h-4 w-4" />
            Open Google Sheet
          </a>
        ) : (
          <span className="text-sm text-muted-foreground">Configure Spreadsheet ID to open Google Sheet</span>
        )}
      </CardFooter>
    </Card>
  )
}
