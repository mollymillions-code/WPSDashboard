// Google Sheets Service
// This service handles all interactions with Google Sheets via Apps Script

// Sheet names
const USERS_SHEET = "Users"
const EDIT_HISTORY_SHEET = "EditHistory"

// Define the EditHistoryEntry type
interface EditHistoryEntry {
  id: string
  timestamp: number
  userId: string
  userName: string
  userRole: string
  fieldId: string
  section: string
  previousValue: any
  newValue: any
}

// Function to fetch data from a specific sheet
async function fetchSheetData(sheetName: string) {
  try {
    console.log(`Fetching data from sheet: ${sheetName}`)
    const response = await fetch(`/api/google-sheets`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        action: "getSheetData",
        sheetName: sheetName,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error(`Error response from API:`, errorData)
      throw new Error(errorData.error || `Failed to fetch sheet data: ${response.statusText}`)
    }

    const result = await response.json()
    console.log(`Fetch result for ${sheetName}:`, result)

    if (!result.success) {
      throw new Error(result.error || "Failed to fetch sheet data")
    }

    return result.data || []
  } catch (error) {
    console.error(`Error fetching ${sheetName} data:`, error)
    throw error
  }
}

// Function to get headers from a sheet
async function getSheetHeaders(sheetName: string) {
  try {
    const data = await fetchSheetData(sheetName)
    if (data.length > 0) {
      return Object.keys(data[0])
    }
    return []
  } catch (error) {
    console.error(`Error getting ${sheetName} headers:`, error)
    throw error
  }
}

// Function to write a row to a sheet
async function writeRow({ sheet, payload }) {
  console.log(`Writing row to sheet ${sheet}:`, payload)
  return fetch("/api/google-sheets", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      action: "append",
      sheetName: sheet,
      data: payload,
    }),
  }).then(async (r) => {
    if (!r.ok) {
      const errorData = await r.json().catch(() => ({}))
      console.error(`Error response from API:`, errorData)
      throw new Error(`Failed to write row: ${r.statusText}`)
    }
    return r.json()
  })
}

// User-specific functions
async function getUserByEmail(email: string) {
  try {
    console.log(`Getting user by email: ${email}`)
    // First fetch all users
    const users = await fetchSheetData(USERS_SHEET)
    // Then find the user with the matching email
    const user = users.find((u) => u.email?.toLowerCase() === email.toLowerCase())
    return user || null
  } catch (error) {
    console.error("Error getting user by email:", error)
    return null
  }
}

async function getUserById(id: string) {
  try {
    console.log(`Getting user by ID: ${id}`)
    // First fetch all users
    const users = await fetchSheetData(USERS_SHEET)
    // Then find the user with the matching ID
    const user = users.find((u) => u.id === id)
    return user || null
  } catch (error) {
    console.error("Error getting user by ID:", error)
    return null
  }
}

async function createUser(userData: any) {
  return writeRow({ sheet: USERS_SHEET, payload: userData })
}

// Edit history functions
async function addEditHistoryEntry(entry: EditHistoryEntry): Promise<boolean> {
  try {
    console.log(`Adding edit history entry:`, entry)
    const response = await fetch("/api/google-sheets", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        action: "append",
        sheetName: "EditHistory",
        data: {
          id: entry.id,
          timestamp: new Date(entry.timestamp).toISOString(),
          userId: entry.userId,
          userName: entry.userName,
          userRole: entry.userRole,
          fieldId: entry.fieldId,
          section: entry.section,
          previousValue:
            typeof entry.previousValue === "object" ? JSON.stringify(entry.previousValue) : entry.previousValue,
          newValue: typeof entry.newValue === "object" ? JSON.stringify(entry.newValue) : entry.newValue,
        },
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error(`Error response from API:`, errorData)
      return false
    }

    const result = await response.json()
    console.log(`Add edit history entry result:`, result)
    return result.success
  } catch (error) {
    console.error("Error adding edit history entry:", error)
    return false
  }
}

async function fetchEditHistory() {
  try {
    console.log(`Fetching edit history`)
    const data = await fetchSheetData("EditHistory")
    return data || []
  } catch (error) {
    console.error("Error getting edit history:", error)
    throw error
  }
}

// Test connection to Google Sheets
async function testConnection() {
  try {
    console.log(`Testing connection to Google Sheets`)
    const response = await fetch("/api/google-sheets", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        action: "getSheetData",
        sheetName: "TestSheet",
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error(`Error response from API:`, errorData)
      return {
        success: false,
        message: errorData.error || `Failed to connect to Google Sheets: ${response.statusText}`,
      }
    }

    const result = await response.json()
    console.log(`Test connection result:`, result)
    return { success: true, message: "Successfully connected to Google Sheets" }
  } catch (error) {
    console.error("Connection test failed:", error)
    return {
      success: false,
      message: `Failed to connect to Google Sheets: ${error instanceof Error ? error.message : String(error)}`,
    }
  }
}

// Test write operation to Google Sheets
async function testWriteOperation() {
  try {
    const testData = {
      id: `test-${Date.now()}`,
      timestamp: new Date().toISOString(),
      message: "Test write operation",
    }

    console.log(`Testing write operation with data:`, testData)
    const response = await fetch("/api/google-sheets", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        action: "append",
        sheetName: "TestSheet",
        data: testData,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error(`Error response from API:`, errorData)
      return {
        success: false,
        message: errorData.error || `Failed to write to Google Sheets: ${response.statusText}`,
      }
    }

    const result = await response.json()
    console.log(`Test write operation result:`, result)
    return result
  } catch (error) {
    console.error("Write test failed:", error)
    return {
      success: false,
      message: `Failed to write to Google Sheets: ${error instanceof Error ? error.message : String(error)}`,
    }
  }
}

const isGoogleSheetsConfigured = async () => {
  try {
    console.log(`Checking if Google Sheets is configured`)
    const response = await fetch("/api/google-sheets", {
      method: "GET",
    })

    if (!response.ok) {
      console.error(`Error checking Google Sheets configuration: ${response.statusText}`)
      return false
    }

    const result = await response.json()
    console.log(`Google Sheets configuration check result:`, result)
    return result.success
  } catch (error) {
    console.error("Error checking Google Sheets configuration:", error)
    return false
  }
}

const appendToSheet = async (sheetName: string, data: any) => {
  try {
    console.log(`Appending data to sheet: ${sheetName}`, data)
    const response = await fetch("/api/google-sheets", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        action: "append",
        sheetName: sheetName,
        data: data,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error(`Error response from API:`, errorData)
      throw new Error(errorData.error || `Failed to append data to sheet: ${response.statusText}`)
    }

    const result = await response.json()
    console.log(`Append result for ${sheetName}:`, result)

    if (!result.success) {
      throw new Error(result.error || "Failed to append data to sheet")
    }

    return result
  } catch (error) {
    console.error(`Error appending data to ${sheetName}:`, error)
    throw error
  }
}

// Budget data functions
const getBudgetData = async () => {
  try {
    return await fetchSheetData("Budget")
  } catch (error) {
    console.error("Error getting budget data:", error)
    return []
  }
}

const updateBudgetData = async (budgetData: any) => {
  try {
    // For now, we'll just append the data
    // In a real implementation, you might want to clear the sheet first
    const response = await fetch("/api/google-sheets", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        action: "append",
        sheetName: "Budget",
        data: budgetData,
      }),
    })

    if (!response.ok) {
      throw new Error(`Failed to update budget data: ${response.statusText}`)
    }

    const data = await response.json()
    return { success: true, data }
  } catch (error) {
    console.error("Error updating budget data:", error)
    return { success: false, error }
  }
}

// Timeline data functions
const getTimelineData = async () => {
  try {
    return await fetchSheetData("Timeline")
  } catch (error) {
    console.error("Error getting timeline data:", error)
    return []
  }
}

const updateTimelineData = async (timelineData: any) => {
  try {
    // For now, we'll just append the data
    const response = await fetch("/api/google-sheets", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        action: "append",
        sheetName: "Timeline",
        data: timelineData,
      }),
    })

    if (!response.ok) {
      throw new Error(`Failed to update timeline data: ${response.statusText}`)
    }

    const data = await response.json()
    return { success: true, data }
  } catch (error) {
    console.error("Error updating timeline data:", error)
    return { success: false, error }
  }
}

// Broadcast schedule data functions
const getBroadcastScheduleData = async () => {
  try {
    return await fetchSheetData("BroadcastSchedule")
  } catch (error) {
    console.error("Error getting broadcast schedule data:", error)
    return []
  }
}

const updateBroadcastScheduleData = async (broadcastScheduleData: any) => {
  try {
    const response = await fetch("/api/google-sheets", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        action: "append",
        sheetName: "BroadcastSchedule",
        data: broadcastScheduleData,
      }),
    })

    if (!response.ok) {
      throw new Error(`Failed to update broadcast schedule data: ${response.statusText}`)
    }

    const data = await response.json()
    return { success: true, data }
  } catch (error) {
    console.error("Error updating broadcast schedule data:", error)
    return { success: false, error }
  }
}

const initApiConfig = async () => {
  const spreadsheetId = process.env.NEXT_PUBLIC_SPREADSHEET_ID || null
  const isConfigured = !!process.env.NEXT_PUBLIC_SPREADSHEET_ID && !!process.env.APPS_SCRIPT_URL

  return {
    isConfigured,
    spreadsheetId,
  }
}

export {
  USERS_SHEET,
  EDIT_HISTORY_SHEET,
  type EditHistoryEntry,
  fetchSheetData,
  getSheetHeaders,
  writeRow,
  getUserByEmail,
  getUserById,
  createUser,
  addEditHistoryEntry,
  fetchEditHistory,
  testConnection,
  testWriteOperation,
  isGoogleSheetsConfigured,
  getBudgetData,
  updateBudgetData,
  getTimelineData,
  updateTimelineData,
  getBroadcastScheduleData,
  updateBroadcastScheduleData,
  initApiConfig,
  appendToSheet,
}
