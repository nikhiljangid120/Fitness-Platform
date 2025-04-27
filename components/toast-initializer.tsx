"use client"

import type React from "react"

import { useEffect } from "react"
import { useToast, setToastFunction } from "@/components/ui/use-toast"

export function ToastInitializer({ children }: { children: React.ReactNode }) {
  const { toast } = useToast()

  // Set the toast function for the global toast function to use
  useEffect(() => {
    setToastFunction(toast)
  }, [toast])

  return <>{children}</>
}

