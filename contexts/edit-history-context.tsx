"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { addEditHistoryEntry, fetchEditHistory, isGoogleSheetsConfigured } from "@/services/google-sheets-service"

export type EditHistoryEntry = {
  id: string
  userId: string
  userName: string
  userRole: string
  fieldId: string
  timestamp: number
  previousValue: any
  newValue: any
  section: string
}

type EditHistoryContextType = {
  editHistory: EditHistoryEntry[]
  addToHistory: (entry: Omit<EditHistoryEntry, "id" | "timestamp" | "userId" | "userName" | "userRole">) => void
  clearHistory: () => void
  isLoading: boolean
  error: string | null
  refreshHistory: () => Promise<void>
}

const EditHistoryContext = createContext<EditHistoryContextType | undefined>(undefined)

export const EditHistoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [editHistory, setEditHistory] = useState<EditHistoryEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { data: session } = useSession()

  // Modify the loadEditHistory function to add better error handling and conditional fetching
  const loadEditHistory = async () => {
    try {
      setIsLoading(true)

      // Check if we're on a page where we don't need to load edit history (like login or register)
      if (typeof window !== "undefined") {
        const pathname = window.location.pathname
        if (pathname === "/login" || pathname === "/register" || pathname === "/unauthorized") {
          setEditHistory([])
          setIsLoading(false)
          return
        }
      }

      // Try to fetch from Google Sheets
      let history: EditHistoryEntry[] = []

      try {
        const isConfigured = await isGoogleSheetsConfigured()
        if (isConfigured) {
          console.log("Fetching edit history from Google Sheets...")
          history = await fetchEditHistory()
          console.log("Fetched edit history:", history)
        } else {
          console.log("Google Sheets is not configured, using local storage")
        }
      } catch (err) {
        console.error("Failed to load edit history from Google Sheets:", err)
        // Don't rethrow, just continue with empty history or local storage
      }

      // If no data from Google Sheets or it failed, try local storage
      if (history.length === 0 && typeof window !== "undefined") {
        const localHistory = localStorage.getItem("editHistory")
        if (localHistory) {
          try {
            history = JSON.parse(localHistory)
          } catch (e) {
            console.error("Failed to parse local edit history:", e)
          }
        }
      }

      // Sort by timestamp descending (newest first)
      history.sort((a, b) => b.timestamp - a.timestamp)
      setEditHistory(history)
      setError(null)

      // Also update local storage as a backup
      if (typeof window !== "undefined") {
        localStorage.setItem("editHistory", JSON.stringify(history))
      }
    } catch (err) {
      console.error("Failed to load edit history:", err)
      setError("Failed to load edit history. Please try again later.")

      // Try to load from local storage as fallback
      if (typeof window !== "undefined") {
        const localHistory = localStorage.getItem("editHistory")
        if (localHistory) {
          try {
            const parsedHistory = JSON.parse(localHistory)
            setEditHistory(parsedHistory)
          } catch (e) {
            console.error("Failed to parse local edit history:", e)
          }
        }
      }
    } finally {
      setIsLoading(false)
    }
  }

  // Load edit history on mount
  useEffect(() => {
    if (session) {
      loadEditHistory()
    }
  }, [session])

  // Poll for edit history every 10 seconds for real-time updates
  useEffect(() => {
    if (!session) return
    const interval = setInterval(() => {
      loadEditHistory()
    }, 10000) // 10 seconds
    return () => clearInterval(interval)
  }, [session])

  // Update the addToHistory function to properly handle JSON data
  const addToHistory = async (
    entry: Omit<EditHistoryEntry, "id" | "timestamp" | "userId" | "userName" | "userRole">,
  ) => {
    if (!session?.user) {
      console.warn("Cannot add to history: No authenticated user")
      return
    }

    // Ensure values are properly serialized if they're objects
    const processValue = (val: any) => {
      if (val === undefined || val === null) return ""
      if (typeof val === "object") return JSON.stringify(val)
      return val
    }

    const user = session.user
    const newEntry: EditHistoryEntry = {
      id: `edit-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      userId: user.id || user.email || "unknown",
      userName: user.name || user.email || "Unknown User",
      userRole: user.role || "user",
      timestamp: Date.now(),
      ...entry,
      previousValue: processValue(entry.previousValue),
      newValue: processValue(entry.newValue),
    }

    console.log("Adding edit history entry:", newEntry)

    try {
      // Save to Google Sheets
      const success = await addEditHistoryEntry(newEntry)
      console.log("Added to Google Sheets:", success)

      if (!success) {
        console.warn("Failed to save edit history to Google Sheets, falling back to local storage")
      }

      // Update local state
      setEditHistory((prev) => [newEntry, ...prev])

      // Also update local storage as a backup
      if (typeof window !== "undefined") {
        const updatedHistory = [newEntry, ...editHistory]
        localStorage.setItem("editHistory", JSON.stringify(updatedHistory))
      }
    } catch (err) {
      console.error("Failed to save edit history:", err)
      // Show an error notification to the user
      setError("Failed to save edit history. Your changes may not be persisted.")

      // Still update local storage as a backup
      if (typeof window !== "undefined") {
        const updatedHistory = [newEntry, ...editHistory]
        localStorage.setItem("editHistory", JSON.stringify(updatedHistory))
      }

      // And update the state
      setEditHistory((prev) => [newEntry, ...prev])
    }
  }

  const clearHistory = () => {
    // Note: In a real implementation, you would need to clear the Google Sheet as well
    // This would require additional API permissions and implementation
    setEditHistory([])
    if (typeof window !== "undefined") {
      localStorage.removeItem("editHistory")
    }
  }

  const refreshHistory = async () => {
    await loadEditHistory()
  }

  return (
    <EditHistoryContext.Provider
      value={{
        editHistory,
        addToHistory,
        clearHistory,
        isLoading,
        error,
        refreshHistory,
      }}
    >
      {children}
    </EditHistoryContext.Provider>
  )
}

export const useEditHistory = (): EditHistoryContextType => {
  const context = useContext(EditHistoryContext)
  if (context === undefined) {
    throw new Error("useEditHistory must be used within an EditHistoryProvider")
  }
  return context
}
