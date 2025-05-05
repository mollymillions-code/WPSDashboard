// This is a simplified WebSocket service for demonstration
// In a real application, you would connect to a real WebSocket server

type MessageType =
  | "USER_CONNECTED"
  | "USER_DISCONNECTED"
  | "FIELD_EDIT_START"
  | "FIELD_EDIT_COMPLETE"
  | "FIELD_UPDATED"
  | "TAB_VIEW_START"
  | "TAB_VIEW_END"
  | "ping"

export type WebSocketMessage = {
  type: MessageType
  userId: string
  userName?: string
  userColor?: string
  data?: any
  timestamp: number
  fieldId?: string
  userRole?: string
}

type MessageHandler = (message: WebSocketMessage) => void

// WebSocket variables
const WEBSOCKET_URL = "wss://your-websocket-url.com" // Replace with your actual WebSocket URL
let socket: WebSocket | null = null
let isConnected = false
let pingInterval: NodeJS.Timeout | null = null

class WebSocketService {
  private handlers: MessageHandler[] = []
  private connected = false
  private mockInterval: NodeJS.Timeout | null = null

  // In a real app, this would connect to an actual WebSocket server
  connect() {
    if (this.connected) return

    console.log("WebSocket connected")
    this.connected = true

    // For demo purposes, we'll simulate receiving messages
    this.mockInterval = setInterval(() => {
      // This is just to simulate occasional activity from other users
      if (Math.random() > 0.95) {
        this.simulateRandomMessage()
      }
    }, 5000)
  }

  disconnect() {
    if (!this.connected) return

    console.log("WebSocket disconnected")
    this.connected = false

    if (this.mockInterval) {
      clearInterval(this.mockInterval)
      this.mockInterval = null
    }
  }

  // Send a message (in a real app, this would send to the WebSocket server)
  sendMessage(message: Omit<WebSocketMessage, "timestamp">) {
    const fullMessage: WebSocketMessage = {
      ...message,
      timestamp: Date.now(),
    }

    console.log("Sending message:", fullMessage)

    // Simulate the message being echoed back after a short delay
    setTimeout(() => {
      this.notifyHandlers(fullMessage)
    }, 100)
  }

  // Register a handler to receive messages
  onMessage(handler: MessageHandler) {
    this.handlers.push(handler)
    return () => {
      this.handlers = this.handlers.filter((h) => h !== handler)
    }
  }

  // Notify all handlers of a new message
  private notifyHandlers(message: WebSocketMessage) {
    this.handlers.forEach((handler) => handler(message))
  }

  // For demo purposes only - simulate random messages
  private simulateRandomMessage() {
    const types: MessageType[] = ["FIELD_EDIT_START", "FIELD_EDIT_COMPLETE", "FIELD_UPDATED"]
    const randomType = types[Math.floor(Math.random() * types.length)]

    const mockUsers = [
      { id: "mock-user-1", name: "Jamie Lee", color: "bg-emerald-100 text-emerald-700 border-emerald-200" },
      { id: "mock-user-2", name: "Taylor Kim", color: "bg-violet-100 text-violet-700 border-violet-200" },
    ]

    const randomUser = mockUsers[Math.floor(Math.random() * mockUsers.length)]

    const mockFieldIds = ["budget-venue-license", "timeline-psa-sanction", "metric-total-budget"]
    const randomFieldId = mockFieldIds[Math.floor(Math.random() * mockFieldIds.length)]

    const message: WebSocketMessage = {
      type: randomType,
      userId: randomUser.id,
      userName: randomUser.name,
      userColor: randomUser.color,
      fieldId: randomFieldId,
      data: randomType === "FIELD_UPDATED" ? { value: "Updated value" } : undefined,
      timestamp: Date.now(),
    }

    this.notifyHandlers(message)
  }
}

// Create a singleton instance
export const websocketService = new WebSocketService()

// Function to handle incoming messages
const handleMessage = (message: WebSocketMessage) => {
  console.log("Received message:", message)
  websocketService.notifyHandlers(message)
}

// Function to send messages through the WebSocket
const sendMessage = (message: any) => {
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify(message))
  } else {
    console.error("WebSocket is not connected.")
  }
}

// Add error handling and reconnection logic to the websocket service
export const connectWebSocket = (userId: string, userName: string, userRole: string, userColor: string) => {
  try {
    // Close any existing connection
    if (socket && socket.readyState !== WebSocket.CLOSED) {
      socket.close()
    }

    // Create a new WebSocket connection
    socket = new WebSocket(WEBSOCKET_URL)

    socket.onopen = () => {
      console.log("WebSocket connection established")
      // Send user info when connection is established
      sendMessage({
        type: "USER_CONNECTED",
        userId,
        userName,
        userRole,
        userColor,
      })

      // Set up ping interval to keep connection alive
      pingInterval = setInterval(() => {
        if (socket && socket.readyState === WebSocket.OPEN) {
          socket.send(JSON.stringify({ type: "ping" }))
        }
      }, 30000) // Send ping every 30 seconds

      // Set connection status
      isConnected = true
    }

    socket.onclose = (event) => {
      console.log("WebSocket connection closed", event)
      isConnected = false
      clearInterval(pingInterval)

      // Attempt to reconnect after a delay
      setTimeout(() => {
        if (!isConnected) {
          connectWebSocket(userId, userName, userRole, userColor)
        }
      }, 5000)
    }

    socket.onerror = (error) => {
      console.error("WebSocket error:", error)
      // Don't set isConnected to false here, let onclose handle it
    }

    socket.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data)
        handleMessage(message)
      } catch (error) {
        console.error("Error parsing WebSocket message:", error)
      }
    }
  } catch (error) {
    console.error("Error connecting to WebSocket:", error)
  }
}
