"use client"

import type React from "react"

// Simplified toast component
import { createContext, useContext, useState, useCallback } from "react"

type ToastProps = {
  title: string
  description: string
}

type ToastContextType = {
  toast: (props: ToastProps) => void
  toasts: ToastProps[]
}

// Create a default context value to avoid the need for null checks
const defaultToastContext: ToastContextType = {
  toast: () => {},
  toasts: [],
}

const ToastContext = createContext<ToastContextType>(defaultToastContext)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastProps[]>([])

  const toast = useCallback((props: ToastProps) => {
    const newToast = { ...props }
    setToasts((prev) => [...prev, newToast])

    // Auto remove toast after 3 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t !== newToast))
    }, 3000)
  }, [])

  return (
    <ToastContext.Provider value={{ toast, toasts }}>
      {children}
      {/* Render toasts */}
      <div className="fixed bottom-0 right-0 p-4 space-y-2 z-50">
        {toasts.map((t, i) => (
          <div
            key={i}
            className="bg-background border rounded-lg shadow-lg p-4 max-w-md animate-in fade-in slide-in-from-bottom-5"
          >
            <h3 className="font-medium">{t.title}</h3>
            <p className="text-sm text-muted-foreground">{t.description}</p>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

// Custom hook to use the toast context
export const useToast = () => {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider")
  }
  return context
}

// Global toast function that doesn't use hooks directly
let toastFn: ((props: ToastProps) => void) | null = null

// Function to set the toast function from the provider
export function setToastFunction(fn: (props: ToastProps) => void) {
  toastFn = fn
}

// External toast function that doesn't use hooks
export function toast(props: ToastProps) {
  if (toastFn) {
    toastFn(props)
  } else {
    console.warn("Toast function not initialized. Make sure ToastProvider is mounted.")
  }
}

