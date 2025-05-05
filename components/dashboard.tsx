"use client"

import { UserProvider, type User } from "@/contexts/user-context"
import { DashboardContent } from "@/components/dashboard-content"
import { useAuth } from "@/contexts/auth-context"
import { useEffect, useState } from "react"

export default function Dashboard() {
  const { user, isLoading: isAuthLoading } = useAuth()
  const [dashboardUser, setDashboardUser] = useState<Partial<User> | null>(null)

  // Convert auth user to user context format
  useEffect(() => {
    if (user) {
      setDashboardUser({
        id: user.id,
        name: user.name || 'Guest',
        email: user.email,
        role: (user.role || 'viewer') as User['role'],
        color: user.color,
        avatar: user.avatar,
      })
    } else if (!isAuthLoading) {
      // If auth is done loading but no user, set default values
      setDashboardUser({
        name: 'Guest',
        role: 'viewer',
      })
    }
  }, [user, isAuthLoading])

  if (isAuthLoading || !dashboardUser) {
    return <div>Loading...</div> // Show loading state
  }

  return (
    <UserProvider initialUser={dashboardUser}>
      <DashboardContent />
    </UserProvider>
  )
}
