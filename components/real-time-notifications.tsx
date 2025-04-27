"use client"

import { useState, useEffect } from "react"
import { Bell, X, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { useStore } from "@/lib/store"
import { toast } from "@/components/ui/use-toast"

interface Notification {
  id: string
  type: "like" | "comment" | "follow" | "mention" | "message"
  user: {
    id: string
    name: string
    username: string
    avatar: string
  }
  content: string
  time: string
  read: boolean
  link?: string
}

export function RealTimeNotifications() {
  const { currentUser } = useStore()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [showNotifications, setShowNotifications] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const [notificationSettings, setNotificationSettings] = useState({
    likes: true,
    comments: true,
    follows: true,
    mentions: true,
    messages: true,
    sound: true,
    browser: false,
  })

  // Simulate receiving real-time notifications
  useEffect(() => {
    if (!currentUser) return

    // Initial notifications
    const initialNotifications: Notification[] = [
      {
        id: "n1",
        type: "like",
        user: {
          id: "user2",
          name: "Priya Sharma",
          username: "priyastyles",
          avatar:
            "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80",
        },
        content: "liked your post",
        time: "2m ago",
        read: false,
        link: "/post/1",
      },
      {
        id: "n2",
        type: "follow",
        user: {
          id: "user3",
          name: "Aryan Gupta",
          username: "aryanfit",
          avatar:
            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80",
        },
        content: "started following you",
        time: "15m ago",
        read: false,
        link: "/profile/aryanfit",
      },
    ]

    setNotifications(initialNotifications)
    setUnreadCount(initialNotifications.filter((n) => !n.read).length)

    // Simulate new notifications coming in
    const notificationTypes = ["like", "comment", "follow", "mention", "message"]
    const userAvatars = [
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80",
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1061&q=80",
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80",
    ]
    const userNames = ["Priya Sharma", "Aryan Gupta", "Neha Verma", "Kabir Singh"]
    const userUsernames = ["priyastyles", "aryanfit", "nehaeats", "kabirtalks"]

    const interval = setInterval(() => {
      // Only add new notification if settings allow it
      const randomType = notificationTypes[Math.floor(Math.random() * notificationTypes.length)] as
        | "like"
        | "comment"
        | "follow"
        | "mention"
        | "message"

      if (
        (randomType === "like" && !notificationSettings.likes) ||
        (randomType === "comment" && !notificationSettings.comments) ||
        (randomType === "follow" && !notificationSettings.follows) ||
        (randomType === "mention" && !notificationSettings.mentions) ||
        (randomType === "message" && !notificationSettings.messages)
      ) {
        return
      }

      const randomUserIndex = Math.floor(Math.random() * userNames.length)

      const newNotification: Notification = {
        id: `n${Date.now()}`,
        type: randomType,
        user: {
          id: `user${randomUserIndex + 2}`,
          name: userNames[randomUserIndex],
          username: userUsernames[randomUserIndex],
          avatar: userAvatars[randomUserIndex],
        },
        content: getNotificationContent(randomType),
        time: "Just now",
        read: false,
        link: getNotificationLink(randomType),
      }

      setNotifications((prev) => [newNotification, ...prev.slice(0, 19)]) // Keep only 20 notifications
      setUnreadCount((prev) => prev + 1)

      // Show toast notification
      if (notificationSettings.sound) {
        playNotificationSound()
      }

      // Show browser notification
      if (notificationSettings.browser) {
        showBrowserNotification(newNotification)
      }

      // Show toast
      toast({
        title: `New ${randomType} notification`,
        description: `${newNotification.user.name} ${newNotification.content}`,
      })
    }, 60000) // New notification every minute

    return () => clearInterval(interval)
  }, [currentUser, notificationSettings])

  const getNotificationContent = (type: string): string => {
    switch (type) {
      case "like":
        return "liked your post"
      case "comment":
        return "commented on your post"
      case "follow":
        return "started following you"
      case "mention":
        return "mentioned you in a comment"
      case "message":
        return "sent you a message"
      default:
        return "interacted with your profile"
    }
  }

  const getNotificationLink = (type: string): string => {
    switch (type) {
      case "like":
      case "comment":
      case "mention":
        return `/post/${Math.floor(Math.random() * 10) + 1}`
      case "follow":
        return `/profile`
      case "message":
        return `/messages`
      default:
        return "/"
    }
  }

  const playNotificationSound = () => {
    // In a real app, you would play a sound here
    // For example:
    // const audio = new Audio('/notification-sound.mp3')
    // audio.play()
  }

  const showBrowserNotification = (notification: Notification) => {
    if (Notification.permission === "granted") {
      new Notification("FlexForge", {
        body: `${notification.user.name} ${notification.content}`,
        icon: notification.user.avatar,
      })
    } else if (Notification.permission !== "denied") {
      Notification.requestPermission()
    }
  }

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })))
    setUnreadCount(0)
  }

  const markAsRead = (id: string) => {
    setNotifications(notifications.map((n) => (n.id === id ? { ...n, read: true } : n)))
    setUnreadCount((prev) => Math.max(0, prev - 1))
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "like":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="#ef4444"
            stroke="#ef4444"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-heart"
          >
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
          </svg>
        )
      case "comment":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#3b82f6"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-message-circle"
          >
            <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
          </svg>
        )
      case "follow":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#22c55e"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-user-plus"
          >
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <line x1="19" x2="19" y1="8" y2="14" />
            <line x1="22" x2="16" y1="11" y2="11" />
          </svg>
        )
      case "mention":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#eab308"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-at-sign"
          >
            <circle cx="12" cy="12" r="4" />
            <path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-4 8" />
          </svg>
        )
      case "message":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#8b5cf6"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-mail"
          >
            <rect width="20" height="16" x="2" y="4" rx="2" />
            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
          </svg>
        )
      default:
        return <Bell className="h-4 w-4" />
    }
  }

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        className="relative rounded-full"
        onClick={() => setShowNotifications(!showNotifications)}
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </Button>

      {showNotifications && (
        <Card className="absolute right-0 mt-2 w-80 sm:w-96 z-50 shadow-lg animate-in fade-in slide-in-from-top-5">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Notifications</CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" className="h-8 px-2 text-xs" onClick={markAllAsRead}>
                Mark all as read
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Settings className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setShowNotifications(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="max-h-[70vh] overflow-y-auto">
            {notifications.length > 0 ? (
              <div className="space-y-2">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={cn(
                      "flex items-start p-2 rounded-lg transition-colors hover:bg-muted/50 cursor-pointer",
                      !notification.read && "bg-primary/5",
                    )}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <Avatar className="h-10 w-10 mr-3">
                      <AvatarImage src={notification.user.avatar} alt={notification.user.name} />
                      <AvatarFallback>{notification.user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1">
                        <span className="font-medium">{notification.user.name}</span>
                        <span className="text-muted-foreground text-sm">{notification.content}</span>
                      </div>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <span>{notification.time}</span>
                        {!notification.read && (
                          <Badge variant="default" className="ml-2 h-2 w-2 p-0 rounded-full bg-primary" />
                        )}
                      </div>
                    </div>
                    <div className="ml-2 flex-shrink-0">{getNotificationIcon(notification.type)}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center">
                <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No notifications yet</h3>
                <p className="text-muted-foreground text-sm">
                  When someone interacts with your posts or profile, you'll see it here.
                </p>
              </div>
            )}

            <div className="mt-4 pt-4 border-t">
              <h4 className="font-medium mb-2">Notification Settings</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="likes" className="text-sm">
                    Likes
                  </Label>
                  <Switch
                    id="likes"
                    checked={notificationSettings.likes}
                    onCheckedChange={(checked) => setNotificationSettings((prev) => ({ ...prev, likes: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="comments" className="text-sm">
                    Comments
                  </Label>
                  <Switch
                    id="comments"
                    checked={notificationSettings.comments}
                    onCheckedChange={(checked) => setNotificationSettings((prev) => ({ ...prev, comments: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="follows" className="text-sm">
                    Follows
                  </Label>
                  <Switch
                    id="follows"
                    checked={notificationSettings.follows}
                    onCheckedChange={(checked) => setNotificationSettings((prev) => ({ ...prev, follows: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="mentions" className="text-sm">
                    Mentions
                  </Label>
                  <Switch
                    id="mentions"
                    checked={notificationSettings.mentions}
                    onCheckedChange={(checked) => setNotificationSettings((prev) => ({ ...prev, mentions: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="messages" className="text-sm">
                    Messages
                  </Label>
                  <Switch
                    id="messages"
                    checked={notificationSettings.messages}
                    onCheckedChange={(checked) => setNotificationSettings((prev) => ({ ...prev, messages: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="sound" className="text-sm">
                    Sound
                  </Label>
                  <Switch
                    id="sound"
                    checked={notificationSettings.sound}
                    onCheckedChange={(checked) => setNotificationSettings((prev) => ({ ...prev, sound: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="browser" className="text-sm">
                    Browser Notifications
                  </Label>
                  <Switch
                    id="browser"
                    checked={notificationSettings.browser}
                    onCheckedChange={(checked) => {
                      if (checked && Notification.permission !== "granted") {
                        Notification.requestPermission().then((permission) => {
                          setNotificationSettings((prev) => ({
                            ...prev,
                            browser: permission === "granted",
                          }))
                        })
                      } else {
                        setNotificationSettings((prev) => ({ ...prev, browser: checked }))
                      }
                    }}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

