"use client"

import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { ToastProvider, setToastFunction, useToast } from "@/components/ui/use-toast"
import type React from "react"
import { useEffect } from "react"

const inter = Inter({ subsets: ["latin"] })

// Wrapper component to initialize the toast function
function ToastInitializer({ children }: { children: React.ReactNode }) {
  const { toast } = useToast()

  // Set the toast function for the global toast function to use
  useEffect(() => {
    setToastFunction(toast)
  }, [toast])

  return <>{children}</>
}

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <ToastProvider>
            <ToastInitializer>{children}</ToastInitializer>
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

