"use client"

import { useState } from "react"
import { useCollaboration } from "@/hooks/use-collaboration"
import { useUser } from "@/contexts/user-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Bell, Users, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function CollaborationPanel() {
  const { onlineUsers, recentUpdates } = useCollaboration()
  const { currentUser } = useUser()
  const [isOpen, setIsOpen] = useState(true)

  // Format timestamp to readable time
  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  if (!isOpen) {
    return (
      <Button
        variant="outline"
        size="sm"
        className="fixed bottom-4 right-4 flex items-center gap-2 bg-white shadow-md"
        onClick={() => setIsOpen(true)}
      >
        <Users className="h-4 w-4" />
        <span>{onlineUsers.length} Online</span>
      </Button>
    )
  }

  return (
    <Card className="fixed bottom-4 right-4 w-80 shadow-lg">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">Collaboration</CardTitle>
          <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => setIsOpen(false)}>
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
        </div>
        <CardDescription className="text-xs">
          {onlineUsers.length} user{onlineUsers.length !== 1 ? "s" : ""} online
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="mb-2 text-xs font-medium">Online Users</h3>
          <div className="flex flex-wrap gap-2">
            {onlineUsers.map((user) => (
              <div key={user.id} className="flex items-center gap-1.5">
                <Avatar className="h-6 w-6">
                  <AvatarFallback className={user.color}>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <span className={cn("text-xs", user.id === currentUser.id ? "font-medium" : "")}>
                  {user.name}
                  {user.id === currentUser.id && " (you)"}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="mb-2 text-xs font-medium flex items-center gap-1">
            <Bell className="h-3 w-3" /> Recent Activity
          </h3>
          <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
            {recentUpdates.length > 0 ? (
              recentUpdates.map((update, index) => (
                <div key={index} className="flex items-start gap-2 text-xs">
                  <Avatar className="h-5 w-5 mt-0.5">
                    <AvatarFallback className={update.userColor || "bg-gray-100"}>
                      {update.userName?.charAt(0) || "?"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{update.userName}</span>
                      <span className="text-muted-foreground text-[10px]">{formatTime(update.timestamp)}</span>
                    </div>
                    <p className="text-muted-foreground">
                      {update.type === "FIELD_UPDATED" ? (
                        <>
                          Updated{" "}
                          <Badge variant="outline" className="text-[10px] h-4 px-1">
                            {update.fieldId?.replace(/-/g, " ")}
                          </Badge>
                        </>
                      ) : update.type === "USER_CONNECTED" ? (
                        <>Joined the dashboard</>
                      ) : update.type === "USER_DISCONNECTED" ? (
                        <>Left the dashboard</>
                      ) : (
                        <>Unknown activity</>
                      )}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-muted-foreground">No recent activity</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
