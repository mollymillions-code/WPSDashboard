"use client"

import React, { useState } from 'react'
import { useEditHistory } from '@/contexts/edit-history-context'

export default function SafeEditHistory() {
  const [mounted, setMounted] = useState(false)
  const contextValue = { editHistory: [], isLoading: true, error: null }
  
  // Try-catch everything to prevent crashes
  try {
    // Only use context after component is mounted
    React.useEffect(() => {
      setMounted(true)
    }, [])

    // Only try to use the hook if the component is mounted
    if (mounted) {
      try {
        // Attempt to use the hook
        const result = useEditHistory()
        if (result && typeof result === 'object') {
          Object.assign(contextValue, result)
        }
      } catch (err) {
        console.error("Failed to get edit history context:", err)
      }
    }
  } catch (err) {
    console.error("Error in SafeEditHistory setup:", err)
  }

  // Extract values with ultimate safety
  const { editHistory = [], isLoading = false, error = null } = contextValue
  
  // Safety check history data
  const safeHistory = Array.isArray(editHistory) ? editHistory : []
  
  // Simple rendering
  return (
    <div className="p-4 border rounded">
      <h2 className="text-lg font-semibold mb-4">Edit History (Safe Component)</h2>
      
      {isLoading && (
        <div className="text-center py-4">Loading history...</div>
      )}

      {error && (
        <div className="text-red-500 py-4">{String(error)}</div>
      )}

      {!isLoading && !error && (
        <div>
          {safeHistory.length === 0 ? (
            <div className="text-gray-500 py-4">No edit history available.</div>
          ) : (
            <ul className="space-y-3">
              {safeHistory.map((entry) => {
                // Safely extract entry fields
                const id = entry?.id || `fallback-${Math.random()}`
                const userName = entry?.userName || 'Unknown User'
                const timestamp = entry?.timestamp ? new Date(entry.timestamp).toLocaleString() : 'Unknown time'
                const fieldId = entry?.fieldId || 'Unknown field'
                
                return (
                  <li key={id} className="border p-3 rounded">
                    <div className="flex justify-between">
                      <div className="font-medium">{userName}</div>
                      <div className="text-sm text-gray-500">{timestamp}</div>
                    </div>
                    <div className="mt-1 text-sm">Field: {fieldId}</div>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  )
} 