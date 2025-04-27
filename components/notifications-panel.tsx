"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Bell, Heart, MessageCircle, UserPlus, Star, Repeat } from "lucide-react"
import { cn } from "@/lib/utils"

interface Notification {
  id: string
  type: "like" | "comment" | "follow" | "mention" | "repost"
  user: {
    name: string
    username: string
    avatar: string
  }
  content: string
  time: string
  read: boolean
  postImage?: string
}

export function NotificationsPanel() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "n1",
      type: "like",
      user: {
        name: "Priya Sharma",
        username: "priyastyles",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      content: "liked your post",
      time: "2m ago",
      read: false,
      postImage: "/placeholder.svg?height=60&width=60",
    },
    {
      id: "n2",
      type: "follow",
      user: {
        name: "Aryan Gupta",
        username: "aryanfit",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      content: "started following you",
      time: "1h ago",
      read: false,
    },
    {
      id: "n3",
      type: "comment",
      user: {
        name: "Neha Verma",
        username: "nehaeats",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      content: 'commented on your post: "This looks delicious!"',
      time: "3h ago",
      read: true,
      postImage: "/placeholder.svg?height=60&width=60",
    },
    {
      id: "n4",
      type: "mention",
      user: {
        name: "Kabir Singh",
        username: "kabirtalks",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      content: 'mentioned you in a comment: "@rohanmehta what do you think?"',
      time: "5h ago",
      read: true,
    },
    {
      id: "n5",
      type: "repost",
      user: {
        name: "Simran Kaur",
        username: "simrankaurs",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      content: "reposted your post",
      time: "1d ago",
      read: true,
      postImage: "/placeholder.svg?height=60&width=60",
    },
  ])

  const markAllAsRead = () => {
    setNotifications(
      notifications.map((notification) => ({
        ...notification,
        read: true,
      })),
    )
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "like":
        return <Heart className="h-4 w-4 text-red-500" />
      case "comment":
        return <MessageCircle className="h-4 w-4 text-blue-500" />
      case "follow":
        return <UserPlus className="h-4 w-4 text-green-500" />
      case "mention":
        return <Star className="h-4 w-4 text-yellow-500" />
      case "repost":
        return <Repeat className="h-4 w-4 text-purple-500" />
      default:
        return <Bell className="h-4 w-4" />
    }
  }

  return (
    <Card className="w-full max-w-md border-none neomorphic">
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Notifications</CardTitle>
        <Button variant="ghost" size="sm" onClick={markAllAsRead}>
          Mark all as read
        </Button>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid grid-cols-3 w-full mb-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="mentions">Mentions</TabsTrigger>
            <TabsTrigger value="follows">Follows</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={cn(
                  "flex items-start p-3 rounded-lg transition-colors hover:bg-muted/50",
                  !notification.read && "bg-primary/5",
                )}
              >
                <div className="flex-shrink-0 mr-3">
                  <Avatar>
                    <AvatarImage src={notification.user.avatar} alt={notification.user.name} />
                    <AvatarFallback>{notification.user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center mb-1">
                    <span className="font-medium mr-1">{notification.user.name}</span>
                    <span className="text-muted-foreground text-sm">{notification.content}</span>
                  </div>
                  <div className="flex items-center">
                    <div className="flex items-center mr-2">
                      {getNotificationIcon(notification.type)}
                      <span className="text-xs text-muted-foreground ml-1">{notification.time}</span>
                    </div>
                    {!notification.read && <div className="h-2 w-2 rounded-full bg-primary"></div>}
                  </div>
                </div>
                {notification.postImage && (
                  <div className="ml-2 flex-shrink-0">
                    <img
                      src={notification.postImage || "/placeholder.svg"}
                      alt="Post"
                      className="h-12 w-12 rounded-md object-cover"
                    />
                  </div>
                )}
              </div>
            ))}
          </TabsContent>

          <TabsContent value="mentions" className="space-y-4">
            {notifications
              .filter((notification) => notification.type === "mention")
              .map((notification) => (
                <div
                  key={notification.id}
                  className={cn(
                    "flex items-start p-3 rounded-lg transition-colors hover:bg-muted/50",
                    !notification.read && "bg-primary/5",
                  )}
                >
                  <div className="flex-shrink-0 mr-3">
                    <Avatar>
                      <AvatarImage src={notification.user.avatar} alt={notification.user.name} />
                      <AvatarFallback>{notification.user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center mb-1">
                      <span className="font-medium mr-1">{notification.user.name}</span>
                      <span className="text-muted-foreground text-sm">{notification.content}</span>
                    </div>
                    <div className="flex items-center">
                      <div className="flex items-center mr-2">
                        {getNotificationIcon(notification.type)}
                        <span className="text-xs text-muted-foreground ml-1">{notification.time}</span>
                      </div>
                      {!notification.read && <div className="h-2 w-2 rounded-full bg-primary"></div>}
                    </div>
                  </div>
                </div>
              ))}
            {notifications.filter((notification) => notification.type === "mention").length === 0 && (
              <div className="text-center py-8">
                <Star className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No mentions yet</h3>
                <p className="text-muted-foreground max-w-xs mx-auto">
                  When someone mentions you in a post or comment, you'll see it here.
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="follows" className="space-y-4">
            {notifications
              .filter((notification) => notification.type === "follow")
              .map((notification) => (
                <div
                  key={notification.id}
                  className={cn(
                    "flex items-start p-3 rounded-lg transition-colors hover:bg-muted/50",
                    !notification.read && "bg-primary/5",
                  )}
                >
                  <div className="flex-shrink-0 mr-3">
                    <Avatar>
                      <AvatarImage src={notification.user.avatar} alt={notification.user.name} />
                      <AvatarFallback>{notification.user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center mb-1">
                      <span className="font-medium mr-1">{notification.user.name}</span>
                      <span className="text-muted-foreground text-sm">{notification.content}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        {getNotificationIcon(notification.type)}
                        <span className="text-xs text-muted-foreground ml-1">{notification.time}</span>
                      </div>
                      <Button variant="outline" size="sm" className="h-8 text-xs">
                        Follow Back
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            {notifications.filter((notification) => notification.type === "follow").length === 0 && (
              <div className="text-center py-8">
                <UserPlus className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No new followers</h3>
                <p className="text-muted-foreground max-w-xs mx-auto">When someone follows you, you'll see it here.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

