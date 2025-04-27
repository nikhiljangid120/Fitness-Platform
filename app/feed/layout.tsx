import type React from "react"
import { MainNav } from "@/components/main-nav"

export default function FeedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <MainNav />
      <main className="flex-1">{children}</main>
    </div>
  )
}

