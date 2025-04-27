"use client"

import type React from "react"
import { useState, useRef, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Send, Bot, User, Info, Dumbbell, Zap, Brain, Loader2, Save, Copy, Trash, Moon, Sun } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import EnhancedTextToSpeech from "@/components/enhanced-text-to-speech"
import { generateAIResponse } from "@/lib/gemini-ai"
import { initVoices } from "@/lib/speech-synthesis"
import { useToast } from "@/hooks/use-toast"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface Message {
  role: "user" | "assistant"
  content: string
  id: string
}

const generateId = () => `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

export default function AITrainerPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hi there! I'm your AI fitness trainer. How can I help you today?",
      id: generateId(),
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [theme, setTheme] = useState<"light" | "dark">("light")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()
  const [savedResponses, setSavedResponses] = useState<Message[]>([])
  const [userScrolled, setUserScrolled] = useState(false)

  // Initialize voices
  useEffect(() => {
    initVoices()
  }, [])

  // Theme toggle
  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"))
  }, [])

  // Apply theme to document
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark")
  }, [theme])

  // Scroll to bottom
  const scrollToBottom = useCallback(() => {
    if (messagesEndRef.current && !userScrolled) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [userScrolled])

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

  // Typing effect
  const simulateTypingEffect = useCallback(
    (text: string, callback: (text: string) => void) => {
      setIsTyping(true)
      let displayedText = ""
      let index = 0
      const cleanedText = text.trim()

      const interval = setInterval(() => {
        if (index < cleanedText.length) {
          displayedText += cleanedText[index]
          callback(displayedText)
          index++
        } else {
          clearInterval(interval)
          setIsTyping(false)
          setUserScrolled(false)
          scrollToBottom()
        }
      }, 10)

      return () => clearInterval(interval)
    },
    [scrollToBottom],
  )

  // Save response
  const saveResponse = useCallback(
    (message: Message) => {
      setSavedResponses((prev) => {
        if (prev.some((m) => m.id === message.id)) {
          toast({ title: "Already saved" })
          return prev
        }
        toast({ title: "Response saved" })
        return [...prev, message]
      })
    },
    [toast],
  )

  // Copy to clipboard
  const copyToClipboard = useCallback(
    (text: string) => {
      navigator.clipboard.writeText(text).then(() => {
        toast({ title: "Copied to clipboard" })
      })
    },
    [toast],
  )

  // Handle form submission
  const handleSubmit = useCallback(
    async (e?: React.FormEvent) => {
      if (e) e.preventDefault()
      if (!input.trim()) return

      handleUserInteraction()
      const userMessage = { role: "user" as const, content: input, id: generateId() }
      setMessages((prev) => [...prev, userMessage])

      const currentInput = input
      setInput("")
      setIsLoading(true)
      setUserScrolled(false)

      try {
        const responseId = generateId()
        const tempMessage: Message = { role: "assistant", content: "", id: responseId }
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
          },
        ])
      } finally {
        setIsLoading(false)
      }
    },
    [input, handleUserInteraction, simulateTypingEffect],
  )

  // Keyboard shortcut (Ctrl+Enter)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
        handleSubmit()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [handleSubmit])

  // Clear chat
  const clearChat = useCallback(() => {
    setMessages([
      {
        role: "assistant",
        content: "Chat cleared. How can I help you with your fitness goals today?",
        id: generateId(),
      },
    ])
    toast({ title: "Chat cleared" })
  }, [toast])

  const suggestedQuestions = [
    "Suggest a 4-week plan for fat loss",
    "Give me a 20-minute no-equipment workout",
    "How can I improve my flexibility?",
    "What should I eat before and after workouts?",
    "Create a new Monday workout plan",
  ]

  // Render message content
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
    <div className={`min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300 ${theme}`}>
      <div className="container mx-auto px-4 py-8 md:py-12 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Chat Area */}
          <div className="lg:col-span-3">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
                  AI Trainer
                </h1>
                <p className="text-gray-600 dark:text-gray-300 mt-2 text-sm sm:text-base">
                  Your personal AI fitness coach
                </p>
              </div>
              <div className="flex gap-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={toggleTheme}
                        aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
                      >
                        {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Toggle theme</TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={clearChat}
                        disabled={messages.length <= 1}
                        aria-label="Clear chat"
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Clear chat</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>

            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md shadow-xl border border-gray-200/50 dark:border-gray-700/50">
              <CardContent className="p-4 sm:p-6">
                <Alert className="mb-6 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 border-blue-200 dark:border-blue-800">
                  <Brain className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  <AlertTitle className="text-blue-800 dark:text-blue-200">AI-Powered Assistance</AlertTitle>
                  <AlertDescription className="text-blue-700 dark:text-blue-300">
                    Your AI trainer provides personalized workout plans, nutrition advice, and fitness tips.
                  </AlertDescription>
                </Alert>

                <div
                  ref={chatContainerRef}
                  className="h-[400px] sm:h-[500px] overflow-y-auto mb-4 space-y-4 p-4 rounded-lg bg-gray-50/50 dark:bg-gray-900/50"
                  aria-live="polite"
                >
                  <AnimatePresence>
                    {messages.map((message) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`flex gap-3 max-w-[85%] sm:max-w-[75%] ${
                            message.role === "user" ? "flex-row-reverse" : ""
                          }`}
                        >
                          <Avatar className="h-8 w-8 sm:h-10 sm:w-10 shrink-0">
                            {message.role === "assistant" ? (
                              <>
                                <AvatarImage src="/ai-trainer-avatar.webp" alt="AI Trainer" />
                                <AvatarFallback className="bg-blue-500 text-white">
                                  <Bot className="h-4 w-4" />
                                </AvatarFallback>
                              </>
                            ) : (
                              <AvatarFallback className="bg-gray-200 dark:bg-gray-700">
                                <User className="h-4 w-4" />
                              </AvatarFallback>
                            )}
                          </Avatar>
                          <div
                            className={`rounded-lg p-3 sm:p-4 text-sm sm:text-base ${
                              message.role === "assistant"
                                ? "bg-white dark:bg-gray-800 shadow-md"
                                : "bg-blue-500 text-white shadow-md"
                            } relative group`}
                          >
                            <div className="message-content">{renderMessageContent(message.content)}</div>

                            {message.role === "assistant" && message.content && (
                              <>
                                <div className="mt-2 opacity-80">
                                  <EnhancedTextToSpeech text={message.content} />
                                </div>
                                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Button
                                          variant="ghost"
                                          size="icon"
                                          className="h-6 w-6"
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
                                          className="h-6 w-6"
                                          onClick={() => saveResponse(message)}
                                          aria-label="Save response"
                                        >
                                          <Save className="h-3 w-3" />
                                        </Button>
                                      </TooltipTrigger>
                                      <TooltipContent>Save response</TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  {isLoading && !isTyping && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex justify-start"
                    >
                      <div className="flex gap-3 max-w-[85%] sm:max-w-[75%]">
                        <Avatar className="h-8 w-8 sm:h-10 sm:w-10">
                          <AvatarImage src="/ai-trainer-avatar.webp" alt="AI Trainer" />
                          <AvatarFallback className="bg-blue-500 text-white">
                            <Bot className="h-4 w-4" />
                          </AvatarFallback>
                        </Avatar>
                        <div className="rounded-lg p-3 sm:p-4 text-sm bg-white dark:bg-gray-800">
                          <div className="flex space-x-2">
                            <div className="h-2 w-2 rounded-full bg-blue-500 animate-bounce" />
                            <div className="h-2 w-2 rounded-full bg-blue-500 animate-bounce [animation-delay:0.2s]" />
                            <div className="h-2 w-2 rounded-full bg-blue-500 animate-bounce [animation-delay:0.4s]" />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                <form onSubmit={handleSubmit} className="flex gap-2">
                  <Input
                    placeholder="Ask about workouts, nutrition, or fitness advice..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    disabled={isLoading}
                    className="flex-1 shadow-sm bg-white/80 dark:bg-gray-800/80 border-gray-200 dark:border-gray-700"
                    aria-label="Message input"
                  />
                  <Button
                    type="submit"
                    disabled={isLoading || !input.trim()}
                    className="bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 transition-all"
                    aria-label="Send message"
                  >
                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md shadow-xl border border-gray-200/50 dark:border-gray-700/50 sticky top-20">
              <CardContent className="p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                  Suggested Questions
                </h3>
                <div className="space-y-2">
                  {suggestedQuestions.map((question, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="w-full justify-start text-left h-auto py-2 px-3 text-sm sm:text-base hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors border-gray-200 dark:border-gray-700"
                      onClick={() => {
                        handleUserInteraction()
                        setInput(question)
                      }}
                      disabled={isLoading}
                      aria-label={`Ask: ${question}`}
                    >
                      {question}
                    </Button>
                  ))}
                </div>

                {savedResponses.length > 0 && (
                  <div className="mt-8">
                    <h3 className="text-lg sm:text-xl font-semibold mb-4 flex items-center gap-2 text-gray-900 dark:text-white">
                      <Save className="h-4 w-4" /> Saved Responses
                    </h3>
                    <div className="space-y-2 max-h-[200px] overflow-y-auto">
                      {savedResponses.map((response, index) => (
                        <Card key={index} className="p-2 text-sm bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                          <div className="line-clamp-2 text-gray-700 dark:text-gray-300">
                            {response.content.substring(0, 100)}...
                          </div>
                          <div className="flex justify-end mt-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 px-2 text-blue-500 dark:text-blue-400"
                              onClick={() => copyToClipboard(response.content)}
                              aria-label="Copy saved response"
                            >
                              <Copy className="h-3 w-3 mr-1" /> Copy
                            </Button>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-8">
                  <h3 className="text-lg sm:text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                    AI Trainer Features
                  </h3>
                  <ul className="space-y-3 text-sm sm:text-base text-gray-700 dark:text-gray-300">
                    <li className="flex items-start gap-2">
                      <Dumbbell className="h-5 w-5 text-orange-500 shrink-0 mt-0.5" />
                      <span>Personalized workout recommendations</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Zap className="h-5 w-5 text-orange-500 shrink-0 mt-0.5" />
                      <span>Nutrition advice and meal planning</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Info className="h-5 w-5 text-orange-500 shrink-0 mt-0.5" />
                      <span>Form correction and technique tips</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Brain className="h-5 w-5 text-orange-500 shrink-0 mt-0.5" />
                      <span>Motivation and accountability</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}