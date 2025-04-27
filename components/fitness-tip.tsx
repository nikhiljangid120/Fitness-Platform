import type React from "react"
import { Lightbulb } from "lucide-react"

interface FitnessTipProps {
  title: string
  children: React.ReactNode
}

export default function FitnessTip({ title, children }: FitnessTipProps) {
  return (
    <div className="fitness-tip">
      <div className="fitness-tip-title">
        <Lightbulb className="h-4 w-4" />
        {title}
      </div>
      <div className="fitness-tip-content">{children}</div>
    </div>
  )
}
