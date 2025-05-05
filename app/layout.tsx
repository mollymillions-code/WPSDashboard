import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { SessionProvider } from "@/components/session-provider"
import { AuthProvider } from "@/contexts/auth-context"
import { EditHistoryProvider } from "@/contexts/edit-history-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "WPS Dashboard",
  description: "World Premier Squash Dashboard",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider>
          <AuthProvider>
            <EditHistoryProvider>
              <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
                {children}
              </ThemeProvider>
            </EditHistoryProvider>
          </AuthProvider>
        </SessionProvider>
      </body>
    </html>
  )
}
