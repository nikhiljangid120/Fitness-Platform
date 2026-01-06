"use client"

import type React from "react"
import { useState, useRef, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Send, Bot, User, Info, Dumbbell, Zap, Brain, Loader2, Save,
  Copy, Trash, Moon, Sun, ChevronRight, ChevronLeft, Maximize,
  Minimize, Mic, MicOff, ThumbsUp, MessageSquare, Volume2
} from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import EnhancedTextToSpeech from "@/components/enhanced-text-to-speech"
import { generateAIResponse } from "@/lib/gemini-ai"
import { initVoices } from "@/lib/speech-synthesis"
import { useToast } from "@/hooks/use-toast"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

interface Message {
  role: "user" | "assistant"
  content: string
  id: string
  timestamp: Date
  liked?: boolean
  isContinuation?: boolean
}

interface QuickReply {
  text: string
  icon: React.ReactNode
}

const generateId = () => `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

import { useTheme } from "next-themes"

// ... imports

export default function AITrainerPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hi there! I'm your AI fitness trainer. How can I help you today?",
      id: generateId(),
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const { theme, setTheme } = useTheme()
  const [sidebarVisible, setSidebarVisible] = useState(true)
  const [fullscreenMode, setFullscreenMode] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [autoScroll, setAutoScroll] = useState(true)
  const [chatHeight, setChatHeight] = useState("500px")

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()
  const [savedResponses, setSavedResponses] = useState<Message[]>([])
  const [userScrolled, setUserScrolled] = useState(false)

  // Initialize voices
  useEffect(() => {
    initVoices()
  }, [])

  // Theme toggle
  const toggleTheme = useCallback(() => {
    setTheme(theme === "light" ? "dark" : "light")
  }, [theme, setTheme])

  // Sidebar toggle
  const toggleSidebar = useCallback(() => {
    setSidebarVisible((prev) => !prev)
  }, [])

  // Fullscreen toggle
  const toggleFullscreen = useCallback(() => {
    setFullscreenMode((prev) => !prev)
    setTimeout(() => {
      if (chatContainerRef.current) {
        setChatHeight(fullscreenMode ? "500px" : "calc(100vh - 220px)")
      }
      scrollToBottom()
    }, 100)
  }, [fullscreenMode])

  // Removed manual document class toggle as next-themes handles it

  // Adjust height on resize
  useEffect(() => {
    const handleResize = () => {
      if (fullscreenMode && window.innerWidth > 768) {
        setChatHeight("calc(100vh - 220px)")
      } else if (fullscreenMode && window.innerWidth <= 768) {
        setChatHeight("calc(100vh - 180px)")
      } else if (window.innerWidth <= 640) {
        setChatHeight("400px")
      } else {
        setChatHeight("500px")
      }
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [fullscreenMode])

  // Scroll to bottom
  const scrollToBottom = useCallback(() => {
    if (messagesEndRef.current && (autoScroll || !userScrolled)) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [autoScroll, userScrolled])

  // Scroll on message change
  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])

  // Reset userScrolled on new message
  useEffect(() => {
    if (isLoading) {
      setUserScrolled(false)
    }
  }, [isLoading])

  // Debounced scroll handler
  useEffect(() => {
    const chatContainer = chatContainerRef.current
    if (!chatContainer) return

    let timeout: NodeJS.Timeout
    const handleScroll = () => {
      clearTimeout(timeout)
      timeout = setTimeout(() => {
        const { scrollTop, scrollHeight, clientHeight } = chatContainer
        const isAtBottom = scrollHeight - scrollTop - clientHeight < 50

        if (!isAtBottom && !isLoading) {
          setUserScrolled(true)
        } else {
          setUserScrolled(false)
        }
      }, 100)
    }

    chatContainer.addEventListener("scroll", handleScroll)
    return () => {
      chatContainer.removeEventListener("scroll", handleScroll)
      clearTimeout(timeout)
    }
  }, [isLoading])

  // Initialize speech synthesis
  const handleUserInteraction = useCallback(() => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      try {
        const utterance = new SpeechSynthesisUtterance("")
        utterance.volume = 0
        window.speechSynthesis.speak(utterance)
        window.speechSynthesis.cancel()
      } catch (error) {
        console.error("Error initializing speech synthesis:", error)
      }
    }
  }, [])

  // Typing effect with variable speed based on content complexity
  const simulateTypingEffect = useCallback(
    (text: string, callback: (text: string) => void) => {
      setIsTyping(true)
      let displayedText = ""
      let index = 0
      const cleanedText = text.trim()

      // Vary typing speed based on content complexity
      const getTypingSpeed = (currentChar: string, nextChar: string) => {
        if (['.', '!', '?', '\n'].includes(currentChar)) {
          return 40 // Pause at end of sentences or paragraphs
        } else if ([',', ';', ':'].includes(currentChar)) {
          return 20 // Slight pause at punctuation
        } else if (nextChar && nextChar === ' ' && Math.random() > 0.8) {
          return 15 // Occasional slight word pause
        }
        return Math.floor(Math.random() * 5) + 5 // Base typing speed with slight variation
      }

      const typeNextChar = () => {
        if (index < cleanedText.length) {
          const currentChar = cleanedText[index]
          const nextChar = cleanedText[index + 1] || ''
          displayedText += currentChar
          callback(displayedText)
          index++

          const delay = getTypingSpeed(currentChar, nextChar)
          setTimeout(typeNextChar, delay)
        } else {
          setIsTyping(false)
          setUserScrolled(false)
          scrollToBottom()
        }
      }

      typeNextChar()

      return () => {
        setIsTyping(false)
      }
    },
    [scrollToBottom],
  )

  // Save response
  const saveResponse = useCallback(
    (message: Message) => {
      setSavedResponses((prev) => {
        if (prev.some((m) => m.id === message.id)) {
          toast({ title: "Already saved", description: "This response is already in your saved items" })
          return prev
        }
        toast({
          title: "Response saved",
          description: "You can access this response from the sidebar"
        })
        return [...prev, message]
      })
    },
    [toast],
  )

  // Copy to clipboard
  const copyToClipboard = useCallback(
    (text: string) => {
      navigator.clipboard.writeText(text).then(() => {
        toast({
          title: "Copied to clipboard",
          description: "Text copied successfully"
        })
      })
    },
    [toast],
  )

  // Like message
  const toggleLikeMessage = useCallback((messageId: string) => {
    setMessages(prev =>
      prev.map(msg =>
        msg.id === messageId
          ? { ...msg, liked: !msg.liked }
          : msg
      )
    )
  }, [])

  // Group messages by same role in sequence
  const processMessages = useCallback((messages: Message[]) => {
    return messages.map((message, index, array) => {
      const prevMessage = index > 0 ? array[index - 1] : null
      const isContinuation = prevMessage &&
        prevMessage.role === message.role &&
        new Date(message.timestamp).getTime() - new Date(prevMessage.timestamp).getTime() < 60000

      return {
        ...message,
        isContinuation
      }
    })
  }, [])

  // Format time
  const formatMessageTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  // Voice recording
  const toggleRecording = useCallback(() => {
    // This is a placeholder for voice recording functionality
    // In a real implementation, you would use the Web Speech API or a similar library
    setIsRecording(prev => !prev)
    if (!isRecording) {
      toast({
        title: "Recording started",
        description: "Speak clearly into your microphone"
      })
      // Simulate recording finish after 3 seconds
      setTimeout(() => {
        setIsRecording(false)
        setInput("How can I improve my squats?")
        toast({
          title: "Recording finished",
          description: "Speech converted to text"
        })
      }, 3000)
    } else {
      toast({
        title: "Recording stopped",
      })
    }
  }, [isRecording, toast])

  // Calculate suggested quick replies based on conversation context
  const getQuickReplies = useCallback((): QuickReply[] => {
    const lastAssistantMessage = [...messages].reverse().find(m => m.role === "assistant")

    if (!lastAssistantMessage) return []

    const content = lastAssistantMessage.content.toLowerCase()

    if (content.includes("workout") || content.includes("exercise")) {
      return [
        { text: "Show me variations", icon: <Dumbbell className="h-3 w-3" /> },
        { text: "Is this good for beginners?", icon: <Info className="h-3 w-3" /> }
      ]
    } else if (content.includes("nutrition") || content.includes("diet") || content.includes("food")) {
      return [
        { text: "Meal plan example", icon: <Brain className="h-3 w-3" /> },
        { text: "Healthy alternatives?", icon: <Info className="h-3 w-3" /> }
      ]
    }

    // Default quick replies
    return [
      { text: "Tell me more", icon: <MessageSquare className="h-3 w-3" /> },
      { text: "Can you elaborate?", icon: <Info className="h-3 w-3" /> }
    ]
  }, [messages])

  // Handle form submission
  const handleSubmit = useCallback(
    async (e?: React.FormEvent) => {
      if (e) e.preventDefault()
      if (!input.trim()) return

      handleUserInteraction()
      const userMessage = {
        role: "user" as const,
        content: input,
        id: generateId(),
        timestamp: new Date()
      }
      setMessages((prev) => [...prev, userMessage])

      const currentInput = input
      setInput("")
      setIsLoading(true)
      setUserScrolled(false)

      // Focus the input after sending
      if (inputRef.current) {
        inputRef.current.focus()
      }

      try {
        const responseId = generateId()
        const tempMessage: Message = {
          role: "assistant",
          content: "",
          id: responseId,
          timestamp: new Date()
        }
        setMessages((prev) => [...prev, tempMessage])

        const response = await generateAIResponse(currentInput)

        simulateTypingEffect(response, (partialText) => {
          setMessages((prev) => {
            const newMessages = [...prev]
            const lastMessageIndex = newMessages.findIndex((m) => m.id === responseId)
            if (lastMessageIndex !== -1) {
              newMessages[lastMessageIndex].content = partialText
            }
            return newMessages
          })
        })
      } catch (error) {
        console.error("Error in AI response:", error)
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: "I'm here to help with your fitness questions. What would you like to know?",
            id: generateId(),
            timestamp: new Date(),
          },
        ])
      } finally {
        setIsLoading(false)
      }
    },
    [input, handleUserInteraction, simulateTypingEffect],
  )

  // Handle quick reply click
  const handleQuickReplyClick = useCallback((replyText: string) => {
    setInput(replyText)
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd+Enter to send message
      if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
        handleSubmit()
      }

      // Escape to exit fullscreen
      if (e.key === "Escape" && fullscreenMode) {
        toggleFullscreen()
      }

      // Alt+T to toggle theme
      if (e.key === "t" && e.altKey) {
        toggleTheme()
      }

      // Alt+S to toggle sidebar
      if (e.key === "s" && e.altKey) {
        toggleSidebar()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [handleSubmit, fullscreenMode, toggleFullscreen, toggleTheme, toggleSidebar])

  // Clear chat
  const clearChat = useCallback(() => {
    setMessages([
      {
        role: "assistant",
        content: "Chat cleared. How can I help you with your fitness goals today?",
        id: generateId(),
        timestamp: new Date(),
      },
    ])
    toast({
      title: "Chat cleared",
      description: "Starting a fresh conversation"
    })
  }, [toast])

  const suggestedQuestions = [
    "Suggest a 4-week plan for fat loss",
    "Give me a 20-minute no-equipment workout",
    "How can I improve my flexibility?",
    "What should I eat before and after workouts?",
    "Create a new Monday workout plan",
    "Best recovery techniques for sore muscles",
    "How to increase my protein intake naturally"
  ]

  // Process messages for display
  const processedMessages = processMessages(messages)

  // Determine if we should scroll to bottom button
  const showScrollToBottom = userScrolled && messages.length > 3

  // Render message content with formatting
  const renderMessageContent = (content: string) => {
    return content.split("\n").map((line, i) => {
      if (line.trim().startsWith("* ") || line.trim().startsWith("- ")) {
        return (
          <div key={i} className="flex items-start">
            <span className="mr-2">•</span>
            <span>{line.trim().substring(2)}</span>
          </div>
        )
      }

      const numberedListMatch = line.trim().match(/^(\d+)\.\s(.+)/)
      if (numberedListMatch) {
        return (
          <div key={i} className="flex items-start">
            <span className="mr-2">{numberedListMatch[1]}.</span>
            <span>{numberedListMatch[2]}</span>
          </div>
        )
      }

      let formattedLine = line
      formattedLine = formattedLine.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      formattedLine = formattedLine.replace(/\*(.*?)\*/g, "<em>$1</em>")

      if (formattedLine.includes("<strong>") || formattedLine.includes("<em>")) {
        return <div key={i} dangerouslySetInnerHTML={{ __html: formattedLine }} />
      }

      return (
        <div key={i}>
          {line}
          {i < content.split("\n").length - 1 && line.trim() !== "" && <br />}
        </div>
      )
    })
  }

  return (
    <div
      className={`min-h-screen bg-gradient-to-br ${theme === "light"
          ? "from-blue-50 via-purple-50 to-indigo-100"
          : "from-gray-900 via-indigo-950 to-purple-950"
        } transition-colors duration-500 ${theme}`}
    >
      <div
        className={`container mx-auto px-2 sm:px-4 py-4 sm:py-8 ${fullscreenMode ? "max-w-full h-screen flex flex-col" : "max-w-7xl"
          }`}
      >
        <div className={`grid grid-cols-1 ${sidebarVisible ? "lg:grid-cols-4" : "lg:grid-cols-1"} gap-4 ${fullscreenMode ? "h-full" : ""}`}>
          {/* Main Chat Area */}
          <div className={`lg:col-span-${sidebarVisible ? "3" : "1"} ${fullscreenMode ? "h-full flex flex-col" : ""}`}>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4">
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="lg:hidden"
                  onClick={toggleSidebar}
                  aria-label="Toggle sidebar"
                >
                  {sidebarVisible ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </Button>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                    AI Trainer
                  </h1>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    Your personal AI fitness coach
                  </p>
                </div>
              </div>
              <div className="flex gap-1 mt-2 sm:mt-0">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={toggleTheme}
                        className="h-8 w-8"
                        aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
                      >
                        {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Toggle theme (Alt+T)</TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={toggleFullscreen}
                        className="h-8 w-8"
                        aria-label={`${fullscreenMode ? "Exit" : "Enter"} fullscreen`}
                      >
                        {fullscreenMode ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>{fullscreenMode ? "Exit" : "Enter"} fullscreen</TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={clearChat}
                        disabled={messages.length <= 1}
                        className="h-8 w-8"
                        aria-label="Clear chat"
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Clear chat</TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 hidden lg:flex"
                        onClick={toggleSidebar}
                        aria-label={`${sidebarVisible ? "Hide" : "Show"} sidebar`}
                      >
                        {sidebarVisible ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>{sidebarVisible ? "Hide" : "Show"} sidebar (Alt+S)</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>

            <Card
              className={`
                bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg 
                shadow-xl border border-gray-200/50 dark:border-gray-700/50
                transition-all duration-300 relative
                ${fullscreenMode ? "flex-1 flex flex-col" : ""}
              `}
            >
              <CardContent className={`p-3 sm:p-4 ${fullscreenMode ? "flex-1 flex flex-col" : ""}`}>
                <Alert className="mb-4 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/40 dark:to-purple-900/40 border-blue-200 dark:border-blue-800/50 transition-all duration-300">
                  <Brain className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  <AlertTitle className="text-blue-800 dark:text-blue-200 font-medium">AI-Powered Fitness Coach</AlertTitle>
                  <AlertDescription className="text-blue-700 dark:text-blue-300 text-sm">
                    Your personal trainer provides workout plans, nutrition advice, and motivation to help you reach your fitness goals.
                  </AlertDescription>
                </Alert>

                <div
                  ref={chatContainerRef}
                  style={{ height: chatHeight }}
                  className={`
                    overflow-y-auto mb-3 space-y-4 p-3 sm:p-4 rounded-lg 
                    bg-gray-50/70 dark:bg-gray-900/70 
                    scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700
                    scrollbar-track-transparent relative
                    ${fullscreenMode ? "flex-1" : ""}
                  `}
                  aria-live="polite"
                >
                  <AnimatePresence>
                    {processedMessages.map((message, index) => {
                      const showAvatar = !message.isContinuation
                      const isLast = index === processedMessages.length - 1

                      return (
                        <motion.div
                          key={message.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.3 }}
                          className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                        >
                          <div
                            className={`flex gap-2 max-w-[90%] sm:max-w-[80%] md:max-w-[75%] ${message.role === "user" ? "flex-row-reverse" : ""
                              }`}
                          >
                            {showAvatar && (
                              <div className="mt-1">
                                <Avatar className={`h-8 w-8 sm:h-9 sm:w-9 shrink-0 ${message.isContinuation ? "opacity-0" : ""}`}>
                                  {message.role === "assistant" ? (
                                    <>
                                      <AvatarImage src="/ai-trainer-avatar.webp" alt="AI Trainer" className="object-cover" />
                                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                                        <Bot className="h-4 w-4" />
                                      </AvatarFallback>
                                    </>
                                  ) : (
                                    <AvatarFallback className="bg-gradient-to-br from-gray-500 to-gray-600 dark:from-gray-600 dark:to-gray-700">
                                      <User className="h-4 w-4" />
                                    </AvatarFallback>
                                  )}
                                </Avatar>
                              </div>
                            )}

                            {!showAvatar && <div className="w-8 sm:w-9"></div>}

                            <div className="flex flex-col">
                              {showAvatar && (
                                <div className={`flex items-center mb-1 ${message.role === "user" ? "justify-end" : ""}`}>
                                  <span className={`text-xs text-gray-500 dark:text-gray-400 ${message.role === "user" ? "order-last ml-1" : "mr-1"}`}>
                                    {message.role === "assistant" ? "AI Trainer" : "You"}
                                  </span>
                                  <span className="text-xs text-gray-400 dark:text-gray-500">
                                    {formatMessageTime(message.timestamp)}
                                  </span>
                                </div>
                              )}

                              <div
                                className={`
                                  rounded-2xl px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base 
                                  ${message.isContinuation ? (
                                    message.role === "assistant"
                                      ? "rounded-tl-md mt-1"
                                      : "rounded-tr-md mt-1"
                                  ) : ""} 
                                  ${message.role === "assistant"
                                    ? "bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700"
                                    : "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md"
                                  }
                                  relative group transition-all duration-200
                                `}
                              >
                                <div className="message-content">{renderMessageContent(message.content)}</div>

                                {message.role === "assistant" && message.content.trim().length > 0 && (
                                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                                    <TooltipProvider>
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-6 w-6 bg-gray-100/80 dark:bg-gray-700/80 hover:bg-gray-200 dark:hover:bg-gray-600"
                                            onClick={() => copyToClipboard(message.content)}
                                            aria-label="Copy message"
                                          >
                                            <Copy className="h-3 w-3" />
                                          </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>Copy</TooltipContent>
                                      </Tooltip>

                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-6 w-6 bg-gray-100/80 dark:bg-gray-700/80 hover:bg-gray-200 dark:hover:bg-gray-600"
                                            onClick={() => saveResponse(message)}
                                            aria-label="Save response"
                                          >
                                            <Save className="h-3 w-3" />
                                          </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>Save</TooltipContent>
                                      </Tooltip>

                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <Button
                                            variant="ghost"
                                            size="icon"
                                            className={`h-6 w-6 bg-gray-100/80 dark:bg-gray-700/80 hover:bg-gray-200 dark:hover:bg-gray-600 ${message.liked ? 'text-blue-500 dark:text-blue-400' : ''}`}
                                            onClick={() => toggleLikeMessage(message.id)}
                                            aria-label={message.liked ? "Unlike" : "Like"}
                                          >
                                            <ThumbsUp className="h-3 w-3" />
                                          </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>{message.liked ? "Unlike" : "Like"}</TooltipContent>
                                      </Tooltip>
                                    </TooltipProvider>
                                  </div>
                                )}
                              </div>

                              {message.role === "assistant" && isLast && !isTyping && (
                                <div className="flex flex-wrap gap-2 mt-2">
                                  {getQuickReplies().map((reply, index) => (
                                    <Button
                                      key={index}
                                      variant="outline"
                                      size="sm"
                                      className="h-7 px-2 py-1 text-xs bg-white/70 dark:bg-gray-800/70 hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors"
                                      onClick={() => handleQuickReplyClick(reply.text)}
                                    >
                                      {reply.icon}
                                      <span className="ml-1">{reply.text}</span>
                                    </Button>
                                  ))}
                                </div>
                              )}

                              {message.role === "assistant" && message.content && !message.isContinuation && (
                                <div className="mt-1 opacity-80 self-start">
                                  <EnhancedTextToSpeech text={message.content} />
                                </div>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      )
                    })}
                  </AnimatePresence>

                  {isLoading && !isTyping && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex justify-start"
                    >
                      <div className="flex gap-2 max-w-[80%]">
                        <Avatar className="h-8 w-8 sm:h-9 sm:w-9">
                          <AvatarImage src="/ai-trainer-avatar.webp" alt="AI Trainer" />
                          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                            <Bot className="h-4 w-4" />
                          </AvatarFallback>
                        </Avatar>
                        <div className="rounded-2xl p-3 text-sm bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm">
                          <div className="flex space-x-2">
                            <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
                            <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse [animation-delay:0.3s]" />
                            <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse [animation-delay:0.6s]" />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Scroll to bottom button */}
                {showScrollToBottom && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="absolute bottom-20 right-6 z-10 rounded-full px-3 py-1 bg-white/90 dark:bg-gray-800/90 shadow-md hover:bg-blue-50 dark:hover:bg-gray-700 transition-all"
                    onClick={() => {
                      setUserScrolled(false)
                      scrollToBottom()
                    }}
                  >
                    <ChevronRight className="h-4 w-4 -rotate-90 mr-1" />
                    <span className="text-xs">Scroll to bottom</span>
                  </Button>
                )}

                <form onSubmit={handleSubmit} className="flex gap-2 mt-auto">
                  <Input
                    ref={inputRef}
                    placeholder="Ask about workouts, nutrition, or fitness advice..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    disabled={isLoading}
                    className="flex-1 shadow-sm bg-white/90 dark:bg-gray-800/90 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 transition-all"
                    aria-label="Message input"
                  />
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          type="button"
                          disabled={isLoading || isRecording}
                          onClick={toggleRecording}
                          className={`
                            ${isRecording
                              ? "bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700"
                              : "bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
                            } transition-all
                          `}
                          aria-label={isRecording ? "Stop recording" : "Start voice recording"}
                        >
                          {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        {isRecording ? "Stop recording" : "Voice input"}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <Button
                    type="submit"
                    disabled={isLoading || !input.trim()}
                    className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 dark:from-blue-600 dark:to-indigo-700 dark:hover:from-blue-700 dark:hover:to-indigo-800 text-white transition-all"
                    aria-label="Send message"
                  >
                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                  </Button>
                </form>

                <div className="flex justify-center mt-2">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Press <kbd className="px-1 py-0.5 bg-gray-100 dark:bg-gray-800 rounded border border-gray-300 dark:border-gray-700 font-mono text-xs">Ctrl</kbd>+<kbd className="px-1 py-0.5 bg-gray-100 dark:bg-gray-800 rounded border border-gray-300 dark:border-gray-700 font-mono text-xs">Enter</kbd> to send
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          {sidebarVisible && (
            <div className="lg:col-span-1">
              <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg shadow-xl border border-gray-200/50 dark:border-gray-700/50 sticky top-4">
                <CardContent className="p-3 sm:p-4">
                  {/* Chat Settings */}
                  <div className="mb-4">
                    <h3 className="text-base sm:text-lg font-semibold mb-2 text-gray-900 dark:text-white flex items-center">
                      <Volume2 className="h-4 w-4 mr-2" /> Chat Settings
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="auto-scroll" className="text-gray-700 dark:text-gray-300">Auto-scroll</Label>
                        <Switch
                          id="auto-scroll"
                          checked={autoScroll}
                          onCheckedChange={setAutoScroll}
                          aria-label="Auto-scroll to new messages"
                        />
                      </div>
                    </div>
                  </div>

                  <Separator className="my-4 bg-gray-200 dark:bg-gray-700" />

                  {/* Suggested Questions */}
                  <h3 className="text-base sm:text-lg font-semibold mb-2 text-gray-900 dark:text-white flex items-center">
                    <MessageSquare className="h-4 w-4 mr-2" /> Ask Me About
                  </h3>
                  <div className="space-y-2">
                    {suggestedQuestions.map((question, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        className="w-full justify-start text-left h-auto py-2 px-3 text-xs sm:text-sm hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors border-gray-200 dark:border-gray-700"
                        onClick={() => {
                          handleUserInteraction()
                          setInput(question)
                          if (inputRef.current) {
                            inputRef.current.focus()
                          }
                        }}
                        disabled={isLoading}
                        aria-label={`Ask: ${question}`}
                      >
                        {question}
                      </Button>
                    ))}
                  </div>

                  {/* Saved Responses */}
                  {savedResponses.length > 0 && (
                    <div className="mt-6">
                      <h3 className="text-base sm:text-lg font-semibold mb-2 flex items-center gap-2 text-gray-900 dark:text-white">
                        <Save className="h-4 w-4" /> Saved Responses
                      </h3>
                      <div className="space-y-2 max-h-[200px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700 pr-1">
                        {savedResponses.map((response, index) => (
                          <Card key={index} className="p-2 text-sm bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-800 transition-colors">
                            <div className="line-clamp-2 text-gray-700 dark:text-gray-300">
                              {response.content.substring(0, 100)}...
                            </div>
                            <div className="flex justify-end mt-2 gap-1">
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-6 px-2 text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
                                      onClick={() => copyToClipboard(response.content)}
                                      aria-label="Copy saved response"
                                    >
                                      <Copy className="h-3 w-3" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>Copy</TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}

                  <Separator className="my-4 bg-gray-200 dark:bg-gray-700" />

                  {/* AI Trainer Features */}
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold mb-2 text-gray-900 dark:text-white flex items-center">
                      <Dumbbell className="h-4 w-4 mr-2" /> AI Trainer Features
                    </h3>
                    <div className="grid grid-cols-2 gap-2 mt-3">
                      <Badge variant="outline" className="justify-start gap-1 py-1 bg-white/70 dark:bg-gray-800/70">
                        <Dumbbell className="h-3 w-3 text-orange-500" />
                        <span className="text-xs">Workouts</span>
                      </Badge>
                      <Badge variant="outline" className="justify-start gap-1 py-1 bg-white/70 dark:bg-gray-800/70">
                        <Zap className="h-3 w-3 text-orange-500" />
                        <span className="text-xs">Nutrition</span>
                      </Badge>
                      <Badge variant="outline" className="justify-start gap-1 py-1 bg-white/70 dark:bg-gray-800/70">
                        <Info className="h-3 w-3 text-orange-500" />
                        <span className="text-xs">Technique</span>
                      </Badge>
                      <Badge variant="outline" className="justify-start gap-1 py-1 bg-white/70 dark:bg-gray-800/70">
                        <Brain className="h-3 w-3 text-orange-500" />
                        <span className="text-xs">Motivation</span>
                      </Badge>
                    </div>

                    <ul className="space-y-2 mt-4 text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                      <li className="flex items-start gap-2">
                        <Dumbbell className="h-4 w-4 text-orange-500 shrink-0 mt-0.5" />
                        <span>Personalized workout recommendations</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Zap className="h-4 w-4 text-orange-500 shrink-0 mt-0.5" />
                        <span>Nutrition advice and meal planning</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Info className="h-4 w-4 text-orange-500 shrink-0 mt-0.5" />
                        <span>Form correction and technique tips</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Brain className="h-4 w-4 text-orange-500 shrink-0 mt-0.5" />
                        <span>Motivation and accountability</span>
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}