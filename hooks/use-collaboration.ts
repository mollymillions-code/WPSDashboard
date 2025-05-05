"use client"

import { useState, useEffect, useCallback } from "react"
import { useSession } from "next-auth/react"

// Define types
type EditingUser = {
  id: string
  name: string
  color: string
}

type FieldUpdate = {
  fieldId: string
  value: any
  timestamp: number
  userId: string
}

type RecentUpdate = {
  id: string
  userName: string
  fieldId: string
  section: string
  timestamp: number
  value: any
}

// Define colors for different users
const userColors = [
  "bg-blue-500",
  "bg-green-500",
  "bg-yellow-500",
  "bg-purple-500",
  "bg-pink-500",
  "bg-indigo-500",
  "bg-red-500",
  "bg-orange-500",
]

// Create a hook for collaboration features
export function useCollaboration() {
  const { data: session } = useSession()
  const [editingFields, setEditingFields] = useState<Record<string, EditingUser>>({})
  const [fieldUpdates, setFieldUpdates] = useState<FieldUpdate[]>([])
  const [recentUpdates, setRecentUpdates] = useState<RecentUpdate[]>([])

  // Get a color for a user based on their ID
  const getUserColor = useCallback((userId: string) => {
    // Use a hash function to consistently assign colors
    const hash = userId.split("").reduce((acc, char) => {
      return acc + char.charCodeAt(0)
    }, 0)
    return userColors[hash % userColors.length]
  }, [])

  // Start editing a field
  const startEditing = useCallback(
    (fieldId: string) => {
      if (!session?.user) return

      const userId = session.user.id || session.user.email || "unknown"
      const userName = session.user.name || "Unknown User"

      console.log(`User ${userName} (${userId}) started editing field ${fieldId}`)

      setEditingFields((prev) => ({
        ...prev,
        [fieldId]: {
          id: userId,
          name: userName,
          color: getUserColor(userId),
        },
      }))

      // In a real app, you would broadcast this to other users
      // For example, using a WebSocket connection
    },
    [session, getUserColor],
  )

  // Stop editing a field
  const stopEditing = useCallback(
    (fieldId: string) => {
      if (!session?.user) return

      const userId = session.user.id || session.user.email || "unknown"
      const userName = session.user.name || "Unknown User"

      console.log(`User ${userName} (${userId}) stopped editing field ${fieldId}`)

      setEditingFields((prev) => {
        const newState = { ...prev }
        // Only remove if this user is the one editing
        if (newState[fieldId]?.id === userId) {
          delete newState[fieldId]
        }
        return newState
      })

      // In a real app, you would broadcast this to other users
    },
    [session],
  )

  // Update a field value
  const updateField = useCallback(
    (fieldId: string, value: any) => {
      if (!session?.user) return

      const userId = session.user.id || session.user.email || "unknown"
      const userName = session.user.name || "Unknown User"

      console.log(`User ${userName} (${userId}) updated field ${fieldId} with value:`, value)

      const update: FieldUpdate = {
        fieldId,
        value,
        timestamp: Date.now(),
        userId,
      }

      setFieldUpdates((prev) => [...prev, update])

      // Add to recent updates
      const recentUpdate: RecentUpdate = {
        id: `update-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        userName: userName,
        fieldId,
        section: "Dashboard", // This would be more specific in a real app
        timestamp: Date.now(),
        value,
      }

      setRecentUpdates((prev) => {
        const newUpdates = [recentUpdate, ...prev]
        // Keep only the 10 most recent updates
        return newUpdates.slice(0, 10)
      })

      // In a real app, you would broadcast this to other users
    },
    [session],
  )

  // Get the user who is editing a field
  const getEditingUser = useCallback(
    (fieldId: string): EditingUser | null => {
      return editingFields[fieldId] || null
    },
    [editingFields],
  )

  // Clean up old updates
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now()
      // Remove updates older than 5 minutes
      setFieldUpdates((prev) => prev.filter((update) => now - update.timestamp < 5 * 60 * 1000))
    }, 60000) // Check every minute

    return () => clearInterval(interval)
  }, [])

  return {
    startEditing,
    stopEditing,
    updateField,
    getEditingUser,
    fieldUpdates,
    recentUpdates,
  }
}
