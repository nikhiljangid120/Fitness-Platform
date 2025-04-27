"use client"

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Sparkles, Users, TrendingUp } from "lucide-react"

interface FeedTabsProps {
  activeTab: string
  onTabChange: (value: string) => void
}

export function FeedTabs({ activeTab, onTabChange }: FeedTabsProps) {
  return (
    <Tabs defaultValue={activeTab} value={activeTab} onValueChange={onTabChange} className="w-full">
      <TabsList className="grid grid-cols-3 w-full">
        <TabsTrigger value="for-you" className="flex items-center gap-2">
          <Sparkles className={`h-4 w-4 ${activeTab === "for-you" ? "text-primary" : ""}`} />
          <span className="hidden sm:inline">For You</span>
        </TabsTrigger>
        <TabsTrigger value="following" className="flex items-center gap-2">
          <Users className={`h-4 w-4 ${activeTab === "following" ? "text-primary" : ""}`} />
          <span className="hidden sm:inline">Following</span>
        </TabsTrigger>
        <TabsTrigger value="trending" className="flex items-center gap-2">
          <TrendingUp className={`h-4 w-4 ${activeTab === "trending" ? "text-primary" : ""}`} />
          <span className="hidden sm:inline">Trending</span>
        </TabsTrigger>
      </TabsList>

      {/* These TabsContent components are required by the Tabs component */}
      <TabsContent value="for-you">
        <div className="sr-only">For You Content</div>
      </TabsContent>
      <TabsContent value="following">
        <div className="sr-only">Following Content</div>
      </TabsContent>
      <TabsContent value="trending">
        <div className="sr-only">Trending Content</div>
      </TabsContent>
    </Tabs>
  )
}

