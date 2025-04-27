"use client"

import { useState, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Search, Edit, MessageCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { ChatInterface } from "@/components/messages/chat-interface"

interface Message {
  id: string
  content: string
  sender: "user" | "contact"
  timestamp: string
  status?: "sent" | "delivered" | "read"
  media?: {
    type: "image" | "video"
    url: string
  }[]
}

interface Chat {
  id: string
  contact: {
    id: string
    name: string
    username: string
    avatar: string
    online: boolean
    lastSeen?: string
    typing?: boolean
  }
  messages: Message[]
  unread: number
}

export default function MessagesPage() {
  // Sample chats data
  const [chats, setChats] = useState<Chat[]>([
    {
      id: "chat1",
      contact: {
        id: "user2",
        name: "Priya Sharma",
        username: "priyastyles",
        avatar:
          "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80",
        online: true,
        typing: false,
      },
      messages: [
        {
          id: "msg1",
          content: "Hey, did you see my new fashion collection?",
          sender: "contact",
          timestamp: "10:30 AM",
        },
        {
          id: "msg2",
          content: "Yes, it looks amazing! I love the ethnic designs.",
          sender: "user",
          timestamp: "10:32 AM",
          status: "read",
        },
        {
          id: "msg3",
          content: "Thanks! I'm launching it next week. Would love to have you at the event!",
          sender: "contact",
          timestamp: "10:33 AM",
        },
        {
          id: "msg4",
          content: "I'll definitely be there! What time is it?",
          sender: "user",
          timestamp: "10:35 AM",
          status: "read",
        },
        {
          id: "msg5",
          content: "It's at 7 PM at Fashion Hub, Delhi. I'll send you the invite!",
          sender: "contact",
          timestamp: "10:36 AM",
        },
        {
          id: "msg6",
          content: "Here's a preview of the collection",
          sender: "contact",
          timestamp: "10:38 AM",
          media: [
            {
              type: "image",
              url: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80",
            },
          ],
        },
      ],
      unread: 2,
    },
    {
      id: "chat2",
      contact: {
        id: "user3",
        name: "Aryan Gupta",
        username: "aryanfit",
        avatar:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80",
        online: false,
        lastSeen: "2h ago",
      },
      messages: [
        {
          id: "msg1",
          content: "How's your fitness journey going?",
          sender: "contact",
          timestamp: "Yesterday",
        },
        {
          id: "msg2",
          content: "It's going well! I've been following your workout plan.",
          sender: "user",
          timestamp: "Yesterday",
          status: "read",
        },
        {
          id: "msg3",
          content: "That's great to hear! Keep it up 💪",
          sender: "contact",
          timestamp: "Yesterday",
        },
      ],
      unread: 0,
    },
    {
      id: "chat3",
      contact: {
        id: "user4",
        name: "Neha Verma",
        username: "nehaeats",
        avatar:
          "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1061&q=80",
        online: true,
      },
      messages: [
        {
          id: "msg1",
          content: "Have you tried the new restaurant in Kolkata?",
          sender: "contact",
          timestamp: "2d ago",
        },
        {
          id: "msg2",
          content: "Not yet, but I've heard great things about it!",
          sender: "user",
          timestamp: "2d ago",
          status: "read",
        },
        {
          id: "msg3",
          content: "We should go there sometime. Their pani puri is amazing!",
          sender: "contact",
          timestamp: "2d ago",
        },
      ],
      unread: 0,
    },
    {
      id: "chat4",
      contact: {
        id: "user5",
        name: "Kabir Singh",
        username: "kabirtalks",
        avatar:
          "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80",
        online: false,
        lastSeen: "5h ago",
      },
      messages: [
        {
          id: "msg1",
          content: "What did you think of the latest Shah Rukh Khan movie?",
          sender: "contact",
          timestamp: "3d ago",
        },
        {
          id: "msg2",
          content: "I loved it! One of his best performances in recent years.",
          sender: "user",
          timestamp: "3d ago",
          status: "read",
        },
        {
          id: "msg3",
          content: "I agree! I'm writing a review for it. Will share once it's published.",
          sender: "contact",
          timestamp: "3d ago",
        },
      ],
      unread: 0,
    },
  ])

  const [selectedChat, setSelectedChat] = useState<Chat | null>(chats[0])
  const [searchQuery, setSearchQuery] = useState("")

  // Simulate real-time chat behavior
  useEffect(() => {
    // Simulate typing indicator for the first chat
    if (selectedChat && selectedChat.id === "chat1") {
      const typingTimeout = setTimeout(() => {
        setChats((prevChats) =>
          prevChats.map((chat) =>
            chat.id === "chat1" ? { ...chat, contact: { ...chat.contact, typing: true } } : chat,
          ),
        )

        // After "typing", send a new message
        setTimeout(() => {
          const updatedChats = chats.map((chat) => {
            if (chat.id === "chat1") {
              const newMessage: Message = {
                id: `msg${chat.messages.length + 1}`,
                content: "By the way, I also have some new accessories that would go perfectly with your style!",
                sender: "contact",
                timestamp: "Just now",
              }

              return {
                ...chat,
                messages: [...chat.messages, newMessage],
                contact: { ...chat.contact, typing: false },
                unread: selectedChat?.id === "chat1" ? chat.unread : chat.unread + 1,
              }
            }
            return chat
          })

          setChats(updatedChats)

          // Update selected chat if it's the one receiving the message
          if (selectedChat?.id === "chat1") {
            const updatedChat = updatedChats.find((c) => c.id === "chat1")
            if (updatedChat) setSelectedChat(updatedChat)
          }
        }, 3000)
      }, 10000)

      return () => clearTimeout(typingTimeout)
    }
  }, [selectedChat, chats])

  const handleChatSelect = (chat: Chat) => {
    // Mark as read when selecting
    const updatedChats = chats.map((c) => {
      if (c.id === chat.id) {
        return { ...c, unread: 0 }
      }
      return c
    })

    setChats(updatedChats)
    setSelectedChat(chat)
  }

  const handleSendMessage = (chatId: string, message: string) => {
    // Add new message
    const updatedChats = chats.map((chat) => {
      if (chat.id === chatId) {
        const newMessage: Message = {
          id: `msg${chat.messages.length + 1}`,
          content: message,
          sender: "user",
          timestamp: "Just now",
          status: "sent",
        }

        return {
          ...chat,
          messages: [...chat.messages, newMessage],
        }
      }
      return chat
    })

    setChats(updatedChats)

    // Update selected chat
    const updatedChat = updatedChats.find((c) => c.id === chatId)
    if (updatedChat) setSelectedChat(updatedChat)

    // Simulate message status updates
    setTimeout(() => {
      // Update to delivered
      setChats((prevChats) =>
        prevChats.map((chat) => {
          if (chat.id === chatId) {
            return {
              ...chat,
              messages: chat.messages.map((msg, index) =>
                index === chat.messages.length - 1 ? { ...msg, status: "delivered" } : msg,
              ),
            }
          }
          return chat
        }),
      )

      // Update selected chat
      if (selectedChat?.id === chatId) {
        const updatedChat = chats.find((c) => c.id === chatId)
        if (updatedChat) {
          const updatedMessages = updatedChat.messages.map((msg, index) =>
            index === updatedChat.messages.length - 1 ? { ...msg, status: "delivered" } : msg,
          )
          setSelectedChat({ ...updatedChat, messages: updatedMessages })
        }
      }

      // After 2 seconds, update to read
      setTimeout(() => {
        setChats((prevChats) =>
          prevChats.map((chat) => {
            if (chat.id === chatId) {
              return {
                ...chat,
                messages: chat.messages.map((msg, index) =>
                  index === chat.messages.length - 1 ? { ...msg, status: "read" } : msg,
                ),
              }
            }
            return chat
          }),
        )

        // Update selected chat
        if (selectedChat?.id === chatId) {
          const updatedChat = chats.find((c) => c.id === chatId)
          if (updatedChat) {
            const updatedMessages = updatedChat.messages.map((msg, index) =>
              index === updatedChat.messages.length - 1 ? { ...msg, status: "read" } : msg,
            )
            setSelectedChat({ ...updatedChat, messages: updatedMessages })
          }
        }

        // Simulate reply for some chats
        if (chatId === "chat1" || chatId === "chat3") {
          // Show typing indicator
          setTimeout(() => {
            setChats((prevChats) =>
              prevChats.map((chat) =>
                chat.id === chatId ? { ...chat, contact: { ...chat.contact, typing: true } } : chat,
              ),
            )

            // After "typing", send a reply
            setTimeout(() => {
              const replyMessages = {
                chat1: "That sounds great! Can't wait to see you at the event!",
                chat3: "Perfect! Let's plan for this weekend. I'll make a reservation.",
              }

              const replyContent = chatId === "chat1" ? replyMessages.chat1 : replyMessages.chat3

              setChats((prevChats) =>
                prevChats.map((chat) => {
                  if (chat.id === chatId) {
                    const newMessage: Message = {
                      id: `msg${chat.messages.length + 1}`,
                      content: replyContent,
                      sender: "contact",
                      timestamp: "Just now",
                    }

                    return {
                      ...chat,
                      messages: [...chat.messages, newMessage],
                      contact: { ...chat.contact, typing: false },
                      unread: selectedChat?.id === chatId ? 0 : chat.unread + 1,
                    }
                  }
                  return chat
                }),
              )

              // Update selected chat if it's the one receiving the message
              if (selectedChat?.id === chatId) {
                const updatedChat = chats.find((c) => c.id === chatId)
                if (updatedChat) {
                  const newMessage: Message = {
                    id: `msg${updatedChat.messages.length + 1}`,
                    content: replyContent,
                    sender: "contact",
                    timestamp: "Just now",
                  }
                  setSelectedChat({
                    ...updatedChat,
                    messages: [...updatedChat.messages, newMessage],
                    contact: { ...updatedChat.contact, typing: false },
                  })
                }
              }
            }, 3000)
          }, 5000)
        }
      }, 2000)
    }, 1000)
  }

  const filteredChats = chats.filter(
    (chat) =>
      chat.contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chat.contact.username.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="container py-4">
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 h-[calc(100vh-8rem)]">
        {/* Chat List */}
        <div className="md:col-span-1 border rounded-xl overflow-hidden neomorphic">
          <div className="p-4 flex justify-between items-center">
            <h2 className="text-xl font-bold">Messages</h2>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Edit className="h-5 w-5" />
              <span className="sr-only">New message</span>
            </Button>
          </div>

          <div className="px-4 pb-2">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search messages"
                className="pl-9 rounded-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <ScrollArea className="h-[calc(100vh-12rem)]">
            <div className="p-2">
              {filteredChats.map((chat) => (
                <Button
                  key={chat.id}
                  variant="ghost"
                  className={cn("w-full justify-start px-2 py-3 h-auto", selectedChat?.id === chat.id && "bg-accent")}
                  onClick={() => handleChatSelect(chat)}
                >
                  <div className="flex items-start w-full">
                    <div className="relative mr-3">
                      <Avatar>
                        <AvatarImage src={chat.contact.avatar} alt={chat.contact.name} />
                        <AvatarFallback>{chat.contact.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      {chat.contact.online && (
                        <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-background"></span>
                      )}
                    </div>
                    <div className="flex-1 text-left">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{chat.contact.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {chat.messages[chat.messages.length - 1]?.timestamp}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <p className="text-sm text-muted-foreground truncate max-w-[120px]">
                          {chat.contact.typing ? (
                            <span className="text-primary">Typing...</span>
                          ) : (
                            chat.messages[chat.messages.length - 1]?.content
                          )}
                        </p>
                        {chat.unread > 0 && (
                          <Badge variant="default" className="ml-2 h-5 w-5 p-0 flex items-center justify-center">
                            {chat.unread}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Chat Area */}
        <div className="md:col-span-2 lg:col-span-3 border rounded-xl overflow-hidden neomorphic flex flex-col">
          {selectedChat ? (
            <ChatInterface chat={selectedChat} onSendMessage={handleSendMessage} />
          ) : (
            <div className="flex flex-col items-center justify-center h-full">
              <div className="p-8 text-center">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium mb-2">Your Messages</h3>
                <p className="text-muted-foreground max-w-md mb-4">Send private messages to friends and connections.</p>
                <Button>
                  <Edit className="h-4 w-4 mr-2" />
                  New Message
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

