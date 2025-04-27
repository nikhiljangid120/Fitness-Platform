import { Loader2 } from "lucide-react"

export default function Loading() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-50">
      <div className="flex flex-col items-center">
        <div className="relative h-16 w-16 mb-4">
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary to-secondary opacity-70 animate-pulse"></div>
          <div className="absolute inset-1 rounded-full bg-background flex items-center justify-center">
            <span className="text-2xl font-bold gradient-text">N</span>
          </div>
        </div>
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="mt-4 text-lg font-medium">Loading your feed...</p>
      </div>
    </div>
  )
}

