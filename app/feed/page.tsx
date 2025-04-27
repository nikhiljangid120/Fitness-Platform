"use client"

import { useEffect, useState } from "react"
import { StoryBar } from "@/components/story-bar"
import { FeedTabs } from "@/components/feed-tabs"
import { PostCard } from "@/components/post-card"
import { SuggestedUsers } from "@/components/suggested-users"
import { TrendingTopics } from "@/components/trending-topics"
import { CreatePostButton } from "@/components/create-post-button"
import { useStore } from "@/lib/store"
import { useRouter } from "next/navigation"
import { Loader2, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"

export default function FeedPage() {
  const { currentUser, posts } = useStore()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [visiblePosts, setVisiblePosts] = useState(5)
  const [loadingMore, setLoadingMore] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [activeTab, setActiveTab] = useState("for-you")

  // Check if user is logged in
  useEffect(() => {
    if (!currentUser) {
      const storedUser = localStorage.getItem("FlexForge-current-user")
      if (storedUser) {
        // User is already logged in
      } else {
        router.push("/")
      }
    }

    // Simulate loading time
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [currentUser, router])

  const loadMorePosts = () => {
    setLoadingMore(true)
    // Simulate loading time
    setTimeout(() => {
      setVisiblePosts((prev) => prev + 5)
      setLoadingMore(false)
    }, 1000)
  }

  const refreshFeed = () => {
    setRefreshing(true)
    // Simulate refresh
    setTimeout(() => {
      setRefreshing(false)
      toast({
        title: "Feed refreshed",
        description: "Your feed has been updated with the latest posts",
        className: "bg-gradient-to-r from-green-500 to-emerald-500 text-white border-none",
      })
    }, 1500)
  }

  if (loading) {
    return (
      <div className="container py-8 flex items-center justify-center min-h-[50vh]">
        <div className="flex flex-col items-center">
          <div className="relative h-16 w-16 mb-4">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500 opacity-70 animate-pulse"></div>
            <div className="absolute inset-1 rounded-full bg-background flex items-center justify-center">
              <span className="text-2xl font-bold gradient-text">N</span>
            </div>
          </div>
          <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
          <p className="text-lg font-medium">Loading your feed...</p>
        </div>
      </div>
    )
  }

  const handleTabChange = (value: string) => {
    setActiveTab(value)
    // Reset visible posts when changing tabs
    setVisiblePosts(5)
  }

  // Get posts based on active tab
  const getFilteredPosts = () => {
    switch (activeTab) {
      case "following":
        return posts.slice(0, Math.floor(posts.length / 2)) // Simulate following posts
      case "trending":
        return [...posts].sort((a, b) => b.likes - a.likes) // Sort by most likes
      default:
        return posts // For You tab
    }
  }

  const filteredPosts = getFilteredPosts()

  return (
    <div className="container py-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content - Stories and Feed */}
        <div className="lg:col-span-2 space-y-6">
          <StoryBar />
          <div className="flex justify-between items-center">
            <FeedTabs activeTab={activeTab} onTabChange={handleTabChange} />
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                className="rounded-full"
                onClick={refreshFeed}
                disabled={refreshing}
              >
                <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
              </Button>
              <CreatePostButton />
            </div>
          </div>

          {refreshing && (
            <div className="w-full py-4 flex justify-center">
              <div className="flex items-center space-x-2 bg-muted/30 px-4 py-2 rounded-full">
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
                <span className="text-sm">Refreshing your feed...</span>
              </div>
            </div>
          )}

          <div className="space-y-6">
            {filteredPosts.slice(0, visiblePosts).map((post) => (
              <PostCard key={post.id} post={post} />
            ))}

            {visiblePosts < filteredPosts.length && (
              <div className="flex justify-center py-4">
                <Button
                  onClick={loadMorePosts}
                  variant="outline"
                  className="w-full max-w-md rounded-full bg-gradient-to-r from-background to-background hover:from-muted/50 hover:to-muted/50 border border-muted/50"
                  disabled={loadingMore}
                >
                  {loadingMore ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Loading more posts...
                    </>
                  ) : (
                    "Load more posts"
                  )}
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar - Suggestions and Trending */}
        <div className="hidden lg:block space-y-6">
          <SuggestedUsers />
          <TrendingTopics />
        </div>
      </div>
    </div>
  )
}

