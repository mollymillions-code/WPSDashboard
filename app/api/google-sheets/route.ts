import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "../auth/[...nextauth]/route"

export async function POST(request: NextRequest) {
  try {
    // Get the Apps Script URL from environment variables
    const appsScriptUrl = process.env.APPS_SCRIPT_URL

    if (!appsScriptUrl) {
      console.error("APPS_SCRIPT_URL environment variable is not set")
      return NextResponse.json({ success: false, error: "Apps Script URL is not configured" }, { status: 500 })
    }

    // Get the session (for authentication purposes only)
    const session = await getServerSession(authOptions)

    // Check if user is authenticated for protected operations
    if (!session) {
      console.error("Authentication required - No session")
      return NextResponse.json({ success: false, error: "Authentication required" }, { status: 401 })
    }

    // Parse the request body
    let body
    try {
      body = await request.json()
    } catch (error) {
      console.error("Error parsing request body:", error)
      return NextResponse.json({ success: false, error: "Invalid request body" }, { status: 400 })
    }

    // Normalize the request body to match Apps Script expectations
    const normalizedBody = normalizeRequestBody(body)

    console.log(`Forwarding request to Apps Script:`, {
      action: normalizedBody.action,
      sheetName: normalizedBody.sheetName || "N/A",
    })

    // Forward the request to the Apps Script
    let response
    try {
      response = await fetch(appsScriptUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Add CORS headers if needed
          Origin: process.env.ALLOWED_ORIGINS || "*",
        },
        body: JSON.stringify(normalizedBody),
      })
    } catch (error) {
      console.error("Error forwarding request to Apps Script:", error)
      return NextResponse.json({ success: false, error: "Failed to connect to Apps Script" }, { status: 500 })
    }

    if (!response.ok) {
      console.error(`Apps Script returned error: ${response.status} ${response.statusText}`)

      // Try to get error details if available
      let errorDetails = "Unknown error from Apps Script"
      try {
        const errorData = await response.json()
        errorDetails = errorData.error || errorData.message || errorDetails
      } catch (e) {
        // Ignore JSON parsing errors
      }

      return NextResponse.json({ success: false, error: errorDetails }, { status: response.status })
    }

    // Return the Apps Script response
    let result
    try {
      result = await response.json()
    } catch (error) {
      console.error("Error parsing Apps Script response:", error)
      return NextResponse.json({ success: false, error: "Invalid response from Apps Script" }, { status: 500 })
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

// Helper function to normalize request body to match Apps Script expectations
function normalizeRequestBody(body: any) {
  const normalized = { ...body }

  // Convert 'sheet' to 'sheetName' if it exists
  if (normalized.sheet && !normalized.sheetName) {
    normalized.sheetName = normalized.sheet
    delete normalized.sheet
  }

  // Convert 'payload' to 'data' if it exists
  if (normalized.payload && !normalized.data) {
    normalized.data = normalized.payload
    delete normalized.payload
  }

  // Map action names if needed
  if (normalized.action === "getSheet") {
    normalized.action = "getSheetData"
  }

  return normalized
}

export async function GET(request: NextRequest) {
  // For health check and configuration check
  try {
    // If this is just a health check, return success
    return NextResponse.json({
      success: true,
      message: "Google Sheets API route is running",
      isConfigured: !!process.env.APPS_SCRIPT_URL && !!process.env.GOOGLE_SPREADSHEET_ID,
    })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
