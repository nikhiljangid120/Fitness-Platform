"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Phone, Video, Info, Paperclip, Smile, Send, ImageIcon, Mic, Check, CheckCheck } from "lucide-react"
import { cn } from "@/lib/utils"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useStore } from "@/lib/store"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Progress } from "@/components/ui/progress"
import { toast } from "@/components/ui/use-toast"

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

interface ChatInterfaceProps {
  chat: {
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
  onSendMessage: (chatId: string, message: string) => void
}

export function ChatInterface({ chat, onSendMessage }: ChatInterfaceProps) {
  const [newMessage, setNewMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { currentUser } = useStore()

  // Emoji data for the simple emoji picker
  const emojis = [
    "😀",
    "😂",
    "😍",
    "🥰",
    "😎",
    "🤔",
    "😊",
    "👍",
    "🎉",
    "❤️",
    "🔥",
    "✨",
    "🌟",
    "💯",
    "🙌",
    "👏",
    "🤩",
    "😇",
    "🥳",
    "😋",
  ]

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [chat.messages])

  // Simulate typing indicator for the contact
  useEffect(() => {
    if (chat.contact.typing) {
      const typingTimeout = setTimeout(() => {
        // Simulate the contact sending a message after typing
        const randomResponses = [
          "That sounds great!",
          "I'll get back to you on that.",
          "Let's meet up soon!",
          "Thanks for letting me know.",
          "I was just thinking about that!",
          "What are your plans for the weekend?",
          "Have you seen the latest movie?",
          "How's your day going?",
        ]

        const randomResponse = randomResponses[Math.floor(Math.random() * randomResponses.length)]
        onSendMessage(chat.id, randomResponse)
      }, 3000)

      return () => clearTimeout(typingTimeout)
    }
  }, [chat.contact.typing, chat.id, onSendMessage])

  // Simulate real-time typing indicator
  useEffect(() => {
    if (isTyping) {
      const typingTimeout = setTimeout(() => {
        setIsTyping(false)
      }, 2000)

      return () => clearTimeout(typingTimeout)
    }
  }, [isTyping])

  // Simulate recording timer
  useEffect(() => {
    let interval: NodeJS.Timeout

    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime((prev) => prev + 1)
      }, 1000)
    } else {
      setRecordingTime(0)
    }

    return () => clearInterval(interval)
  }, [isRecording])

  const handleSendMessage = () => {
    if (!newMessage.trim()) return
    onSendMessage(chat.id, newMessage)
    setNewMessage("")

    // Simulate typing indicator for the contact after sending a message
    setTimeout(() => {
      const updatedChat = {
        ...chat,
        contact: {
          ...chat.contact,
          typing: true,
        },
      }
      // In a real app, you would update the chat in your state management
    }, 1000)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSendMessage()
    } else {
      // Simulate typing indicator
      setIsTyping(true)
    }
  }

  const handleFileUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const simulateUpload = (file: File) => {
    setIsUploading(true)
    setUploadProgress(0)

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsUploading(false)
          return 100
        }
        return prev + 5
      })
    }, 100)

    // Create a timeout to simulate the upload completing
    setTimeout(() => {
      clearInterval(interval)
      setIsUploading(false)
      setUploadProgress(100)

      // Create object URL for preview
      const url = URL.createObjectURL(file)

      // Send message with media
      const isVideo = file.type.startsWith("video/")
      const mediaType = isVideo ? "video" : "image"

      // In a real app, you would upload the file to a server and get a URL
      const mediaMessage = `[${mediaType.toUpperCase()}]`
      onSendMessage(chat.id, mediaMessage)

      toast({
        title: "Media sent",
        description: `Your ${mediaType} has been sent successfully.`,
      })
    }, 2000)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]
      simulateUpload(file)
    }

    // Reset the input value so the same file can be selected again
    if (e.target) {
      e.target.value = ""
    }
  }

  const handleStartRecording = () => {
    setIsRecording(true)

    // In a real app, you would use the MediaRecorder API to record audio
    toast({
      title: "Recording started",
      description: "Recording your voice message...",
    })
  }

  const handleStopRecording = () => {
    setIsRecording(false)

    // Simulate sending a voice message
    if (recordingTime > 1) {
      onSendMessage(chat.id, "[VOICE MESSAGE]")

      toast({
        title: "Voice message sent",
        description: `Voice message (${recordingTime}s) has been sent.`,
      })
    } else {
      toast({
        title: "Recording canceled",
        description: "Recording was too short and has been canceled.",
      })
    }
  }

  const handleAddEmoji = (emoji: string) => {
    setNewMessage((prev) => prev + emoji)
    setShowEmojiPicker(false)
  }

  const getMessageStatus = (status?: string) => {
    if (!status) return null

    switch (status) {
      case "sent":
        return <Check className="h-3 w-3 text-muted-foreground" />
      case "delivered":
        return <CheckCheck className="h-3 w-3 text-muted-foreground" />
      case "read":
        return <CheckCheck className="h-3 w-3 text-primary" />
      default:
        return null
    }
  }

  const formatTime = (timestamp: string) => {
    // In a real app, you would format the timestamp properly
    return timestamp
  }

  const formatRecordingTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div className="flex flex-col h-full">
      {/* Chat Header */}
      <div className="p-4 border-b flex justify-between items-center bg-background/90 backdrop-blur-sm sticky top-0 z-10">
        <div className="flex items-center">
          <div className="relative mr-3">
            <Avatar>
              <AvatarImage src={chat.contact.avatar} alt={chat.contact.name} />
              <AvatarFallback>{chat.contact.name.charAt(0)}</AvatarFallback>
            </Avatar>
            {chat.contact.online && (
              <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-background"></span>
            )}
          </div>
          <div>
            <h3 className="font-medium">{chat.contact.name}</h3>
            <p className="text-xs text-muted-foreground">
              {chat.contact.typing ? (
                <span className="typing-indicator">
                  <span>Typing</span>
                  <span></span>
                  <span></span>
                  <span></span>
                </span>
              ) : chat.contact.online ? (
                "Online"
              ) : (
                `Last seen ${chat.contact.lastSeen}`
              )}
            </p>
          </div>
        </div>
        <div className="flex space-x-1">
          <Button variant="ghost" size="icon" className="rounded-full">
            <Phone className="h-5 w-5" />
            <span className="sr-only">Call</span>
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full">
            <Video className="h-5 w-5" />
            <span className="sr-only">Video call</span>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Info className="h-5 w-5" />
                <span className="sr-only">Info</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>View profile</DropdownMenuItem>
              <DropdownMenuItem>Mute notifications</DropdownMenuItem>
              <DropdownMenuItem>Block user</DropdownMenuItem>
              <DropdownMenuItem>Clear chat</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {chat.messages.map((message) => (
            <div key={message.id} className={cn("flex", message.sender === "user" ? "justify-end" : "justify-start")}>
              <div
                className={cn(
                  "max-w-[70%] rounded-lg p-3",
                  message.sender === "user" ? "bg-gradient-to-r from-violet-500 to-purple-500 text-white" : "bg-muted",
                )}
              >
                {message.content.startsWith("[IMAGE]") ? (
                  <div className="rounded-md overflow-hidden mb-2">
                    <img
                      src="/placeholder.svg?height=200&width=300"
                      alt="Image"
                      className="w-full h-auto object-cover"
                    />
                  </div>
                ) : message.content.startsWith("[VIDEO]") ? (
                  <div className="rounded-md overflow-hidden mb-2">
                    <video
                      src="https://samplelib.com/lib/preview/mp4/sample-5s.mp4"
                      controls
                      className="w-full h-auto"
                    />
                  </div>
                ) : message.content.startsWith("[VOICE MESSAGE]") ? (
                  <div className="flex items-center space-x-2 my-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full bg-primary/20">
                      <Play className="h-4 w-4" />
                    </Button>
                    <div className="w-32 h-4 bg-primary/20 rounded-full overflow-hidden">
                      <div className="h-full w-0 bg-primary"></div>
                    </div>
                    <span className="text-xs">0:15</span>
                  </div>
                ) : (
                  message.content
                )}

                {message.media && message.media.length > 0 && (
                  <div className={cn("mt-2 grid gap-2", message.media.length === 1 ? "grid-cols-1" : "grid-cols-2")}>
                    {message.media.map((item, index) => (
                      <div key={index} className="rounded-md overflow-hidden">
                        {item.type === "image" && (
                          <img
                            src={item.url || "/placeholder.svg"}
                            alt="Media content"
                            className="w-full h-auto object-cover"
                          />
                        )}
                        {item.type === "video" && <video src={item.url} controls className="w-full h-auto" />}
                      </div>
                    ))}
                  </div>
                )}

                <div
                  className={cn(
                    "flex items-center justify-end mt-1 text-xs",
                    message.sender === "user" ? "text-white/70" : "text-muted-foreground",
                  )}
                >
                  <span>{formatTime(message.timestamp)}</span>
                  {message.status && message.sender === "user" && (
                    <span className="ml-1">{getMessageStatus(message.status)}</span>
                  )}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Upload Progress */}
      {isUploading && (
        <div className="px-4 py-2 bg-background border-t">
          <div className="flex items-center justify-between text-xs mb-1">
            <span>Uploading media...</span>
            <span>{uploadProgress}%</span>
          </div>
          <Progress value={uploadProgress} className="h-2" />
        </div>
      )}

      {/* Recording Indicator */}
      {isRecording && (
        <div className="px-4 py-2 bg-background border-t flex items-center justify-between">
          <div className="flex items-center">
            <div className="h-3 w-3 rounded-full bg-red-500 animate-pulse mr-2"></div>
            <span className="text-sm">Recording... {formatRecordingTime(recordingTime)}</span>
          </div>
          <Button variant="ghost" size="sm" onClick={handleStopRecording}>
            Stop
          </Button>
        </div>
      )}

      {/* Message Input */}
      <div className="p-4 border-t bg-background/90 backdrop-blur-sm">
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" className="rounded-full" onClick={handleFileUpload}>
            <Paperclip className="h-5 w-5" />
            <span className="sr-only">Attach</span>
          </Button>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*,video/*"
            onChange={handleFileChange}
          />
          <Button variant="ghost" size="icon" className="rounded-full" onClick={handleFileUpload}>
            <ImageIcon className="h-5 w-5" />
            <span className="sr-only">Image</span>
          </Button>

          <Popover open={showEmojiPicker} onOpenChange={setShowEmojiPicker}>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Smile className="h-5 w-5" />
                <span className="sr-only">Emoji</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-0" align="end">
              <div className="p-2">
                <div className="grid grid-cols-5 gap-2">
                  {emojis.map((emoji) => (
                    <Button
                      key={emoji}
                      variant="ghost"
                      className="h-10 w-10 p-0 text-lg"
                      onClick={() => handleAddEmoji(emoji)}
                    >
                      {emoji}
                    </Button>
                  ))}
                </div>
              </div>
            </PopoverContent>
          </Popover>

          <div className="flex-1 relative">
            <Input
              placeholder="Type a message..."
              className="pr-10 rounded-full"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isRecording}
            />
          </div>

          {newMessage.trim() ? (
            <Button
              variant="default"
              size="icon"
              className="rounded-full bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600"
              onClick={handleSendMessage}
            >
              <Send className="h-5 w-5" />
              <span className="sr-only">Send</span>
            </Button>
          ) : (
            <Button
              variant="default"
              size="icon"
              className="rounded-full bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600"
              onMouseDown={handleStartRecording}
              onMouseUp={handleStopRecording}
              onTouchStart={handleStartRecording}
              onTouchEnd={handleStopRecording}
            >
              <Mic className="h-5 w-5" />
              <span className="sr-only">Voice</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

// Add this component for the Play icon
function Play(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <polygon points="5 3 19 12 5 21 5 3" />
    </svg>
  )
}

