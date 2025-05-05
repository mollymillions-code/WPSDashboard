"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle, Copy, FileCode } from "lucide-react"
import { useState } from "react"

const APPS_SCRIPT_CODE = `// This code should be deployed as a Google Apps Script Web App
// After deployment, use the web app URL in your application

function doGet(e) {
  return handleRequest(e);
}

function doPost(e) {
  return handleRequest(e);
}

function handleRequest(e) {
  try {
    // Parse the request parameters
    const params = e.parameter;
    let data;
    
    if (e.postData && e.postData.contents) {
      data = JSON.parse(e.postData.contents);
    } else {
      data = params;
    }
    
    const action = data.action;
    const spreadsheetId = data.spreadsheetId;
    const sheetName = data.sheetName;
    
    // Validate required parameters
    if (!action || !spreadsheetId || !sheetName) {
      return sendResponse({
        success: false,
        error: "Missing required parameters"
      });
    }
    
    // Open the spreadsheet
    const spreadsheet = SpreadsheetApp.openById(spreadsheetId);
    const sheet = spreadsheet.getSheetByName(sheetName);
    
    if (!sheet) {
      return sendResponse({
        success: false,
        error: \`Sheet "\${sheetName}" not found\`
      });
    }
    
    // Perform the requested action
    if (action === "append") {
      return appendData(sheet, data.data);
    } else if (action === "update") {
      return updateData(sheet, data.rowIndex, data.data);
    } else {
      return sendResponse({
        success: false,
        error: \`Unknown action: \${action}\`
      });
    }
  } catch (error) {
    return sendResponse({
      success: false,
      error: error.toString()
    });
  }
}

function appendData(sheet, data) {
  try {
    // Get the headers from the first row
    const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    
    // Create a row array with values in the correct order
    const rowData = headers.map(header => {
      const value = data[header];
      
      if (value === undefined || value === null) {
        return "";
      } else if (typeof value === "object") {
        return JSON.stringify(value);
      } else {
        return value.toString();
      }
    });
    
    // Append the row to the sheet
    sheet.appendRow(rowData);
    
    return sendResponse({
      success: true,
      message: "Data appended successfully"
    });
  } catch (error) {
    return sendResponse({
      success: false,
      error: error.toString()
    });
  }
}

function updateData(sheet, rowIndex, data) {
  try {
    // Get the headers from the first row
    const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    
    // Create a row array with values in the correct order
    const rowData = headers.map(header => {
      const value = data[header];
      
      if (value === undefined || value === null) {
        return "";
      } else if (typeof value === "object") {
        return JSON.stringify(value);
      } else {
        return value.toString();
      }
    });
    
    // Update the row in the sheet
    sheet.getRange(rowIndex, 1, 1, rowData.length).setValues([rowData]);
    
    return sendResponse({
      success: true,
      message: "Data updated successfully"
    });
  } catch (error) {
    return sendResponse({
      success: false,
      error: error.toString()
    });
  }
}

function sendResponse(data) {
  // Don't try to set headers in Apps Script web app
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}`

export function AppsScriptSetup() {
  const [copied, setCopied] = useState(false)

  const copyCode = () => {
    navigator.clipboard.writeText(APPS_SCRIPT_CODE)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Card className="w-full max-w-3xl mx-auto mt-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileCode className="h-6 w-6 text-blue-600" />
          Google Apps Script Setup
        </CardTitle>
        <CardDescription>Set up a Google Apps Script to enable write operations to your Google Sheet</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="instructions">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="instructions">Instructions</TabsTrigger>
            <TabsTrigger value="code">Script Code</TabsTrigger>
          </TabsList>
          <TabsContent value="instructions" className="space-y-4 py-4">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Setting up Google Apps Script</h3>
              <ol className="list-decimal pl-5 space-y-3">
                <li>
                  <span className="font-medium">Create a new Google Apps Script</span>
                  <p className="text-sm text-muted-foreground">
                    Go to{" "}
                    <a
                      href="https://script.google.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      script.google.com
                    </a>{" "}
                    and create a new project
                  </p>
                </li>
                <li>
                  <span className="font-medium">Copy the Apps Script code</span>
                  <p className="text-sm text-muted-foreground">
                    Copy the Google Apps Script code from the "Script Code" tab and paste it into your script editor
                  </p>
                </li>
                <li>
                  <span className="font-medium">Deploy as Web App</span>
                  <p className="text-sm text-muted-foreground">
                    Click on "Deploy" &gt; "New deployment" &gt; Select "Web app" as the type &gt; Set "Who has access"
                    to "Anyone" &gt; Click "Deploy"
                  </p>
                </li>
                <li>
                  <span className="font-medium">Copy the Web App URL</span>
                  <p className="text-sm text-muted-foreground">
                    After deployment, copy the Web App URL. You'll use this as your API key in the Google Sheets setup
                  </p>
                </li>
                <li>
                  <span className="font-medium">Authorize the script</span>
                  <p className="text-sm text-muted-foreground">
                    When prompted, authorize the script to access your Google Sheets
                  </p>
                </li>
              </ol>
            </div>
          </TabsContent>
          <TabsContent value="code" className="space-y-4 py-4">
            <div className="relative">
              <Button size="sm" variant="outline" className="absolute top-2 right-2 h-8 gap-1" onClick={copyCode}>
                {copied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copied ? "Copied!" : "Copy"}
              </Button>
              <pre className="bg-slate-950 text-slate-50 p-4 rounded-md overflow-auto max-h-[500px]">
                <code className="text-sm">{APPS_SCRIPT_CODE}</code>
              </pre>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter>
        <p className="text-sm text-muted-foreground">
          This script acts as a proxy to enable write operations to your Google Sheet without requiring OAuth2
          authentication in your application.
        </p>
      </CardFooter>
    </Card>
  )
}
