"use client"

import { useEffect, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import type { WebSocketMessage } from "@/services/websocket-service"
import { useUser } from "@/contexts/user-context"
import { X } from "lucide-react"

interface UpdateNotificationProps {
  updates: WebSocketMessage[]
}

export function UpdateNotification({ updates }: UpdateNotificationProps) {
  const { currentUser } = useUser()
  const [visibleUpdate, setVisibleUpdate] = useState<WebSocketMessage | null>(null)

  // Show notifications for updates from other users
  useEffect(() => {
    const otherUserUpdates = updates.filter(
      (update) => update.userId !== currentUser.id && update.type === "FIELD_UPDATED",
    )

    if (otherUserUpdates.length > 0 && !visibleUpdate) {
      setVisibleUpdate(otherUserUpdates[0])

      // Auto-dismiss after 5 seconds
      const timer = setTimeout(() => {
        setVisibleUpdate(null)
      }, 5000)

      return () => clearTimeout(timer)
    }
  }, [updates, visibleUpdate, currentUser.id])

  if (!visibleUpdate) return null

  return (
    <AnimatePresence>
      {visibleUpdate && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed top-16 right-4 z-50 max-w-sm"
        >
          <div className="bg-white rounded-lg shadow-lg border p-4 flex items-start gap-3">
            <Avatar className="h-8 w-8">
              <AvatarFallback className={visibleUpdate.userColor || "bg-gray-100"}>
                {visibleUpdate.userName?.charAt(0) || "?"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-sm">{visibleUpdate.userName} made a change</h3>
                <button onClick={() => setVisibleUpdate(null)} className="text-gray-400 hover:text-gray-500">
                  <X className="h-4 w-4" />
                </button>
              </div>
              <p className="text-sm text-muted-foreground">Updated {visibleUpdate.fieldId?.replace(/-/g, " ")}</p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
