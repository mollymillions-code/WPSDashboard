import { NextResponse } from "next/server"

// Function to mask sensitive data (show only first and last 4 chars)
function maskSecret(secret: string | undefined): string {
  if (!secret) return "Not defined"
  if (secret.length <= 8) return "***" // Too short to mask properly
  return `${secret.substring(0, 4)}...${secret.substring(secret.length - 4)}`
}

export async function GET() {
  // Check for environment variables
  const envVars = {
    // Auth related
    NEXTAUTH_URL: process.env.NEXTAUTH_URL || "Not defined",
    NEXTAUTH_SECRET: maskSecret(process.env.NEXTAUTH_SECRET),
    
    // Google Auth related (masked for security)
    GOOGLE_CLIENT_ID: maskSecret(process.env.GOOGLE_CLIENT_ID),
    GOOGLE_CLIENT_SECRET: maskSecret(process.env.GOOGLE_CLIENT_SECRET),
    
    // Google Sheets related
    GOOGLE_SPREADSHEET_ID: maskSecret(process.env.GOOGLE_SPREADSHEET_ID),
    GOOGLE_SHEETS_API_KEY: maskSecret(process.env.GOOGLE_SHEETS_API_KEY),
    APPS_SCRIPT_URL: process.env.APPS_SCRIPT_URL ? "Defined" : "Not defined",
    
    // Public variables
    NEXT_PUBLIC_GOOGLE_SPREADSHEET_ID: maskSecret(process.env.NEXT_PUBLIC_GOOGLE_SPREADSHEET_ID),
    NEXT_PUBLIC_GOOGLE_SHEETS_API_KEY: maskSecret(process.env.NEXT_PUBLIC_GOOGLE_SHEETS_API_KEY),
    NEXT_PUBLIC_SPREADSHEET_ID: maskSecret(process.env.NEXT_PUBLIC_SPREADSHEET_ID),
    
    // Other
    ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS || "Not defined",
    
    // Node environment
    NODE_ENV: process.env.NODE_ENV || "Not defined",
  }

  return NextResponse.json({ 
    status: "success", 
    message: "Environment Variables Check",
    envVars 
  })
} 