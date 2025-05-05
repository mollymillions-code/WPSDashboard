"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession, signIn, signOut } from "next-auth/react"

// Helper function to extract error message from various error formats
const getErrorMessage = (err: unknown): string => {
  if (typeof err === "string") return err
  if (err && typeof err === "object") {
    // Handle error object with message property
    if ("message" in err && typeof err.message === "string") return err.message

    // Handle Google API error format
    if ("error" in err) {
      if (typeof err.error === "string") return err.error
      if (typeof err.error === "object" && err.error && "message" in err.error) return String(err.error.message)
    }

    // Last resort - stringify the object
    try {
      return JSON.stringify(err)
    } catch {
      return "Unknown error occurred"
    }
  }
  return "Unknown error occurred"
}

interface User {
  id: string
  email: string
  name: string
  role: string
  color: string
  avatar?: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  error: string | null
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>
  register: (email: string, name: string, password: string) => Promise<{ success: boolean; message?: string }>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const { data: session, status } = useSession()

  // Check for existing session on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        if (status === "authenticated" && session?.user) {
          // Create user from session
          const sessionUser: User = {
            id: session.user.id || session.user.email || "",
            email: session.user.email || "",
            name: session.user.name || "",
            role: "editor", // Default role
            color: "bg-sky-100 text-sky-700",
            avatar: session.user.image || undefined,
          }
          setUser(sessionUser)
        } else if (status === "unauthenticated") {
          setUser(null)
        }
      } catch (error) {
        console.error("Error checking session:", error)
        setError("Failed to restore session")
      } finally {
        setIsLoading(status === "loading")
      }
    }

    checkSession()
  }, [session, status])

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    setError(null)

    try {
      // Use NextAuth for authentication
      const result = await signIn("google", { redirect: false })

      if (result?.error) {
        throw new Error(result.error)
      }

      return { success: true }
    } catch (error) {
      console.error("Login error:", error)
      const errorMessage = getErrorMessage(error)
      setError(errorMessage)
      return { success: false, message: errorMessage }
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (email: string, name: string, password: string) => {
    setIsLoading(true)
    setError(null)

    try {
      // Use NextAuth for authentication
      const result = await signIn("google", { redirect: false })

      if (result?.error) {
        throw new Error(result.error)
      }

      return { success: true }
    } catch (error) {
      console.error("Registration error:", error)
      const errorMessage = getErrorMessage(error)
      setError(errorMessage)
      return { success: false, message: errorMessage }
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    signOut({ callbackUrl: "/login" })
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, error, login, register, logout }}>{children}</AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
