"use client"

import { useEffect } from "react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useUser } from "@/contexts/user-context"
import { websocketService } from "@/services/websocket-service"
import { useState } from "react"

interface TabViewersProps {
  activeTab: string
}

export function TabViewers({ activeTab }: TabViewersProps) {
  const { currentUser } = useUser()
  const [tabViewers, setTabViewers] = useState<Record<string, any[]>>({})

  useEffect(() => {
    // Announce that this user is viewing this tab
    websocketService.sendMessage({
      type: "TAB_VIEW_START",
      userId: currentUser.id,
      userName: currentUser.name,
      userColor: currentUser.color,
      data: { tab: activeTab },
    })

    // Set up handler for tab viewing messages
    const unsubscribe = websocketService.onMessage((message) => {
      if (message.type === "TAB_VIEW_START" && message.data?.tab) {
        setTabViewers((prev) => {
          const tab = message.data.tab
          const newViewers = { ...prev }

          // Add user to viewers of this tab
          if (!newViewers[tab]) {
            newViewers[tab] = []
          }

          // Don't add duplicates
          if (!newViewers[tab].some((user) => user.id === message.userId)) {
            newViewers[tab] = [
              ...newViewers[tab],
              {
                id: message.userId,
                name: message.userName || "Unknown User",
                color: message.userColor || "bg-gray-100 text-gray-700",
              },
            ]
          }

          return newViewers
        })
      } else if (message.type === "TAB_VIEW_END" && message.data?.tab) {
        setTabViewers((prev) => {
          const tab = message.data.tab
          const newViewers = { ...prev }

          // Remove user from viewers of this tab
          if (newViewers[tab]) {
            newViewers[tab] = newViewers[tab].filter((user) => user.id !== message.userId)
          }

          return newViewers
        })
      }
    })

    // Clean up when component unmounts or tab changes
    return () => {
      unsubscribe()
      websocketService.sendMessage({
        type: "TAB_VIEW_END",
        userId: currentUser.id,
        data: { tab: activeTab },
      })
    }
  }, [activeTab, currentUser])

  // Get viewers for the current tab
  const currentTabViewers = tabViewers[activeTab] || []

  // Filter out the current user
  const otherViewers = currentTabViewers.filter((user) => user.id !== currentUser.id)

  if (otherViewers.length === 0) {
    return null
  }

  return (
    <TooltipProvider>
      <div className="flex -space-x-2">
        {otherViewers.slice(0, 3).map((user) => (
          <Tooltip key={user.id}>
            <TooltipTrigger asChild>
              <Avatar className="h-6 w-6 border-2 border-background">
                <AvatarFallback className={user.color}>{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
            </TooltipTrigger>
            <TooltipContent>
              <p>{user.name} is viewing this tab</p>
            </TooltipContent>
          </Tooltip>
        ))}
        {otherViewers.length > 3 && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Avatar className="h-6 w-6 border-2 border-background">
                <AvatarFallback className="bg-sky-100 text-sky-700">+{otherViewers.length - 3}</AvatarFallback>
              </Avatar>
            </TooltipTrigger>
            <TooltipContent>
              <p>{otherViewers.length - 3} more users viewing this tab</p>
            </TooltipContent>
          </Tooltip>
        )}
      </div>
    </TooltipProvider>
  )
}
