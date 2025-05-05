"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { useSession } from "next-auth/react"

// Define user types
export type UserRole = "admin" | "editor" | "viewer"

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  color?: string
  avatar?: string
}

// Define context type
interface UserContextType {
  currentUser: User
  isLoading: boolean
  error: string | null
}

// Create context
const UserContext = createContext<UserContextType | undefined>(undefined)

// Provider component
export const UserProvider = ({ children, initialUser }: { children: React.ReactNode; initialUser?: Partial<User> }) => {
  const { data: session, status } = useSession()
  const [currentUser, setCurrentUser] = useState<User>(() => ({
    id: initialUser?.id || "",
    name: initialUser?.name || "Guest",
    email: initialUser?.email || "",
    role: (initialUser?.role as UserRole) || "viewer",
    color: initialUser?.color,
    avatar: initialUser?.avatar
  }))
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadUser = async () => {
      try {
        if (status === "loading") {
          return
        }

        if (status === "unauthenticated" || !session) {
          setCurrentUser({
            id: "",
            name: "Guest",
            email: "",
            role: "viewer",
          })
          setIsLoading(false)
          return
        }

        // Use session data to set the current user
        setCurrentUser({
          id: session.user?.id || session.user?.email || "",
          name: session.user?.name || "User",
          email: session.user?.email || "",
          role: (session.user?.role as UserRole) || "viewer",
          avatar: session.user?.image || undefined,
        })

        console.log("User context updated with session data:", session.user)
      } catch (err) {
        console.error("Error loading user:", err)
        setError("Failed to load user data")
      } finally {
        setIsLoading(false)
      }
    }

    loadUser()
  }, [session, status])

  return (
    <UserContext.Provider
      value={{
        currentUser,
        isLoading,
        error,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

// Hook for using the context
export const useUser = () => {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider")
  }
  return context
}
