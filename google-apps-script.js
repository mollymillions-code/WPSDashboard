// This code should be deployed as a Google Apps Script Web App
// After deployment, use the web app URL in your application

function doGet(e) {
  return handleRequest(e)
}

function doPost(e) {
  return handleRequest(e)
}

function handleRequest(e) {
  try {
    // Parse the request parameters
    const params = e.parameter
    let data

    if (e.postData && e.postData.contents) {
      data = JSON.parse(e.postData.contents)
    } else {
      data = params
    }

    const action = data.action
    const spreadsheetId = data.spreadsheetId
    const sheetName = data.sheetName

    // Validate required parameters
    if (!action || !spreadsheetId || !sheetName) {
      return sendResponse({
        success: false,
        error: "Missing required parameters",
      })
    }

    // Open the spreadsheet
    const spreadsheet = SpreadsheetApp.openById(spreadsheetId)
    const sheet = spreadsheet.getSheetByName(sheetName)

    if (!sheet) {
      return sendResponse({
        success: false,
        error: `Sheet "${sheetName}" not found`,
      })
    }

    // Perform the requested action
    if (action === "append") {
      return appendData(sheet, data.data)
    } else if (action === "update") {
      return updateData(sheet, data.rowIndex, data.data)
    } else {
      return sendResponse({
        success: false,
        error: `Unknown action: ${action}`,
      })
    }
  } catch (error) {
    return sendResponse({
      success: false,
      error: error.toString(),
    })
  }
}

function appendData(sheet, data) {
  try {
    // Get the headers from the first row
    const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0]

    // Create a row array with values in the correct order
    const rowData = headers.map((header) => {
      const value = data[header]

      if (value === undefined || value === null) {
        return ""
      } else if (typeof value === "object") {
        return JSON.stringify(value)
      } else {
        return value.toString()
      }
    })

    // Append the row to the sheet
    sheet.appendRow(rowData)

    return sendResponse({
      success: true,
      message: "Data appended successfully",
    })
  } catch (error) {
    return sendResponse({
      success: false,
      error: error.toString(),
    })
  }
}

function updateData(sheet, rowIndex, data) {
  try {
    // Get the headers from the first row
    const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0]

    // Create a row array with values in the correct order
    const rowData = headers.map((header) => {
      const value = data[header]

      if (value === undefined || value === null) {
        return ""
      } else if (typeof value === "object") {
        return JSON.stringify(value)
      } else {
        return value.toString()
      }
    })

    // Update the row in the sheet
    sheet.getRange(rowIndex, 1, 1, rowData.length).setValues([rowData])

    return sendResponse({
      success: true,
      message: "Data updated successfully",
    })
  } catch (error) {
    return sendResponse({
      success: false,
      error: error.toString(),
    })
  }
}

function sendResponse(data) {
  // Fixed: Don't try to set headers in Apps Script web app
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON)
}
