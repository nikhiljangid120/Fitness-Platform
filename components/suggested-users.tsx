"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useStore } from "@/lib/store"
import { useState } from "react"

export function SuggestedUsers() {
  const { users } = useStore()
  const [followedUsers, setFollowedUsers] = useState<string[]>([])

  // Get a random selection of users to suggest
  const getRandomUsers = (count: number) => {
    const shuffled = [...users].sort(() => 0.5 - Math.random())
    return shuffled.slice(0, count)
  }

  const suggestedUsers = getRandomUsers(5)

  const handleFollow = (userId: string) => {
    if (followedUsers.includes(userId)) {
      setFollowedUsers(followedUsers.filter((id) => id !== userId))
    } else {
      setFollowedUsers([...followedUsers, userId])
    }
  }

  return (
    <Card className="border-none neomorphic frosted-glass">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Suggested for you</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {suggestedUsers.map((user) => (
          <div key={user.id} className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Avatar className="h-10 w-10 ring-2 ring-primary/10">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-1">
                  <span className="font-medium text-sm">{user.name}</span>
                  {user.verified && (
                    <Badge variant="default" className="h-3 px-1 py-0 bg-primary">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="8"
                        height="8"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-check"
                      >
                        <path d="M20 6 9 17l-5-5" />
                      </svg>
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground truncate max-w-[150px]">{user.bio}</p>
              </div>
            </div>
            <Button
              variant={followedUsers.includes(user.id) ? "default" : "outline"}
              size="sm"
              className={`h-8 text-xs ${followedUsers.includes(user.id) ? "bg-primary hover:bg-primary/90" : ""}`}
              onClick={() => handleFollow(user.id)}
            >
              {followedUsers.includes(user.id) ? "Following" : "Follow"}
            </Button>
          </div>
        ))}
        <Button variant="ghost" size="sm" className="w-full text-primary">
          See More
        </Button>
      </CardContent>
    </Card>
  )
}

