import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, Hash } from "lucide-react"

export function TrendingTopics() {
  // Sample trending topics data
  const trendingTopics = [
    {
      id: "trend1",
      category: "Technology",
      topic: "#AI",
      posts: "24.5K posts",
    },
    {
      id: "trend2",
      category: "Entertainment",
      topic: "#Bollywood",
      posts: "18.2K posts",
    },
    {
      id: "trend3",
      category: "Sports",
      topic: "#Cricket",
      posts: "32.1K posts",
    },
    {
      id: "trend4",
      category: "Fashion",
      topic: "#IndianFashion",
      posts: "12.8K posts",
    },
    {
      id: "trend5",
      category: "Food",
      topic: "#StreetFood",
      posts: "9.7K posts",
    },
  ]

  return (
    <Card className="border-none neomorphic frosted-glass">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <TrendingUp className="h-5 w-5 mr-2 text-primary" />
          Trending Topics
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {trendingTopics.map((topic) => (
          <div key={topic.id} className="space-y-1 hover:bg-primary/5 p-2 rounded-lg transition-colors cursor-pointer">
            <p className="text-xs text-muted-foreground">{topic.category}</p>
            <p className="font-medium flex items-center">
              <Hash className="h-4 w-4 mr-1 text-primary" />
              {topic.topic.substring(1)}
            </p>
            <p className="text-xs text-muted-foreground">{topic.posts}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

