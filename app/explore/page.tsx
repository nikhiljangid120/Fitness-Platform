import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Search, Compass, Hash, Music, Video, ImageIcon, TrendingUp } from "lucide-react"
import { PostCard } from "@/components/post-card"

export default function ExplorePage() {
  // Sample trending posts data
  const trendingPosts = [
    {
      id: "1",
      user: {
        id: "user1",
        name: "Rohan Mehta",
        username: "rohanmehta",
        verified: true,
        avatar: "/placeholder.svg?height=40&width=40",
      },
      content: "AI is the future, but are we ready for it? 🤖 #AI #Tech",
      images: ["/placeholder.svg?height=400&width=600"],
      likes: 1245,
      comments: 132,
      shares: 87,
      timestamp: "2h ago",
      location: "Mumbai, India",
    },
    {
      id: "2",
      user: {
        id: "user2",
        name: "Priya Sharma",
        username: "priyastyles",
        verified: true,
        avatar: "/placeholder.svg?height=40&width=40",
      },
      content: "New ethnic collection launch! ✨ Who's excited? #IndianFashion",
      images: ["/placeholder.svg?height=400&width=600", "/placeholder.svg?height=400&width=600"],
      likes: 2532,
      comments: 378,
      shares: 245,
      timestamp: "4h ago",
      location: "Delhi, India",
    },
  ]

  // Sample trending hashtags
  const trendingHashtags = [
    { tag: "#AI", posts: "24.5K posts" },
    { tag: "#IndianFashion", posts: "12.8K posts" },
    { tag: "#Cricket", posts: "32.1K posts" },
    { tag: "#Bollywood", posts: "18.2K posts" },
    { tag: "#StreetFood", posts: "9.7K posts" },
    { tag: "#Travel", posts: "15.3K posts" },
    { tag: "#Fitness", posts: "20.9K posts" },
    { tag: "#Technology", posts: "22.4K posts" },
  ]

  return (
    <div className="container py-8">
      <div className="flex flex-col space-y-6">
        <div className="flex items-center space-x-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search for people, topics, or keywords" className="pl-9 py-6" />
          </div>
        </div>

        <Tabs defaultValue="trending" className="w-full">
          <TabsList className="grid grid-cols-6 w-full mb-8">
            <TabsTrigger value="trending" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              <span className="hidden sm:inline">Trending</span>
            </TabsTrigger>
            <TabsTrigger value="discover" className="flex items-center gap-2">
              <Compass className="h-4 w-4" />
              <span className="hidden sm:inline">Discover</span>
            </TabsTrigger>
            <TabsTrigger value="hashtags" className="flex items-center gap-2">
              <Hash className="h-4 w-4" />
              <span className="hidden sm:inline">Hashtags</span>
            </TabsTrigger>
            <TabsTrigger value="music" className="flex items-center gap-2">
              <Music className="h-4 w-4" />
              <span className="hidden sm:inline">Music</span>
            </TabsTrigger>
            <TabsTrigger value="videos" className="flex items-center gap-2">
              <Video className="h-4 w-4" />
              <span className="hidden sm:inline">Videos</span>
            </TabsTrigger>
            <TabsTrigger value="photos" className="flex items-center gap-2">
              <ImageIcon className="h-4 w-4" />
              <span className="hidden sm:inline">Photos</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="trending" className="space-y-6">
            <h2 className="text-2xl font-bold mb-4">Trending Now</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {trendingPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="hashtags" className="space-y-6">
            <h2 className="text-2xl font-bold mb-4">Trending Hashtags</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {trendingHashtags.map((hashtag, index) => (
                <Card key={index} className="border-none neomorphic card-hover">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center">
                      <Hash className="h-5 w-5 mr-2 text-primary" />
                      {hashtag.tag.substring(1)}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{hashtag.posts}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="discover" className="space-y-6">
            <h2 className="text-2xl font-bold mb-4">Discover</h2>
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Compass className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Personalized Discover Feed</h3>
              <p className="text-muted-foreground max-w-md mb-4">
                We're building your personalized discover feed based on your interests and activity.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="music" className="space-y-6">
            <h2 className="text-2xl font-bold mb-4">Trending Music</h2>
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Music className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Music Feature Coming Soon</h3>
              <p className="text-muted-foreground max-w-md mb-4">
                We're working on bringing you the best music experience. Stay tuned!
              </p>
            </div>
          </TabsContent>

          <TabsContent value="videos" className="space-y-6">
            <h2 className="text-2xl font-bold mb-4">Trending Videos</h2>
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Video className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Video Feature Coming Soon</h3>
              <p className="text-muted-foreground max-w-md mb-4">
                We're working on bringing you the best video experience. Stay tuned!
              </p>
            </div>
          </TabsContent>

          <TabsContent value="photos" className="space-y-6">
            <h2 className="text-2xl font-bold mb-4">Trending Photos</h2>
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <ImageIcon className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Photo Feature Coming Soon</h3>
              <p className="text-muted-foreground max-w-md mb-4">
                We're working on bringing you the best photo experience. Stay tuned!
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

