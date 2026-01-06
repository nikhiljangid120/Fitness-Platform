"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Send, Bot, User, Sparkles, Mic, ChevronDown, RefreshCw, Dumbbell, Apple } from "lucide-react"
import { generateAIResponse } from "@/lib/gemini-ai"
import { useToast } from "@/hooks/use-toast"
import { WorkoutAIWidget } from "@/components/ai/workout-widget"
import { NutritionAIWidget } from "@/components/ai/nutrition-widget"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

interface Message {
  role: "user" | "assistant"
  content: string
  id: string
  timestamp: Date
  widgetData?: any
  widgetType?: "workout" | "nutrition"
}

export default function AITrainerPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hello! I'm your advanced AI Fitness Coach. I can create personalized workouts, meal plans, or answer any fitness questions. What's on your mind today?",
      id: "init",
      timestamp: new Date()
    }
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMsg: Message = {
      role: "user",
      content: input,
      id: Date.now().toString(),
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMsg])
    setInput("")
    setIsLoading(true)

    try {
      // Enforce JSON structure if keywords are present to trigger widgets
      let prompt = input
      let expectJson = false

      if (input.toLowerCase().includes("workout") || input.toLowerCase().includes("routine")) {
        prompt += `\n\nIMPORTANT: Return a VALID JSON object for a workout plan with this structure: { "type": "workout", "title": "...", "duration": "...", "level": "...", "focus": "...", "exercises": [{ "name": "...", "sets": "...", "reps": "..." }] }. Do NOT write any text outside the JSON.`
        expectJson = true
      } else if (input.toLowerCase().includes("diet") || input.toLowerCase().includes("meal") || input.toLowerCase().includes("nutrition")) {
        prompt += `\n\nIMPORTANT: Return a VALID JSON object for a nutrition plan with this structure: { "type": "nutrition", "title": "...", "totalCalories": "...", "macros": [{ "label": "Protein", "value": "...", "color": "bg-blue-500" }], "meals": [{ "name": "...", "calories": "...", "protein": "..." }] }. Do NOT write any text outside the JSON.`
        expectJson = true
      }

      const response = await generateAIResponse(prompt)

      let aiMsg: Message = {
        role: "assistant",
        content: response,
        id: (Date.now() + 1).toString(),
        timestamp: new Date()
      }

      // Attempt to parse JSON for widgets
      try {
        // regex to extract JSON if it's wrapped in markdown code blocks
        const jsonMatch = response.match(/\{[\s\S]*\}/)
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0])
          if (parsed.type === "workout") {
            aiMsg.widgetType = "workout"
            aiMsg.widgetData = parsed
            aiMsg.content = "Here is a custom workout plan designed for you:"
          } else if (parsed.type === "nutrition") {
            aiMsg.widgetType = "nutrition"
            aiMsg.widgetData = parsed
            aiMsg.content = "Here is a nutritional breakdown based on your request:"
          }
        }
      } catch (jsonError) {
        console.warn("Could not parse AI JSON response, falling back to text", jsonError)
      }

      setMessages(prev => [...prev, aiMsg])

    } catch (error) {
      toast({ title: "Error", description: "Failed to get response from AI.", variant: "destructive" })
    } finally {
      setIsLoading(false)
    }
  }

  const quickActions = [
    { label: "Generate HIIT Workout", icon: Dumbbell, prompt: "Create a 20 min high intensity interval training workout" },
    { label: "Post-Workout Meal", icon: Apple, prompt: "Suggest a high protein post-workout meal" },
    { label: "Yoga for Back Pain", icon: Sparkles, prompt: "Give me a gentle yoga routine for lower back pain" },
  ]

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-background">
      {/* Header */}
      <div className="px-6 py-4 border-b bg-background/95 backdrop-blur flex justify-between items-center sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 p-2 rounded-xl">
            <Bot className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="font-bold text-lg">FlexForge AI Coach</h1>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              Online & Ready
            </p>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <ScrollArea className="flex-1 px-4 sm:px-6 py-6">
        <div className="max-w-3xl mx-auto space-y-6">
          {messages.map((msg, idx) => (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              key={msg.id}
              className={cn(
                "flex gap-4 w-full",
                msg.role === "user" ? "justify-end" : "justify-start"
              )}
            >
              {msg.role === "assistant" && (
                <Avatar className="w-8 h-8 mt-1 border">
                  <AvatarImage src="/bot-avatar.png" />
                  <AvatarFallback className="bg-primary/10 text-primary"><Bot className="w-4 h-4" /></AvatarFallback>
                </Avatar>
              )}

              <div className="flex flex-col gap-2 max-w-[85%] sm:max-w-[75%]">
                <div className={cn(
                  "p-4 rounded-2xl text-sm shadow-sm",
                  msg.role === "user"
                    ? "bg-primary text-primary-foreground rounded-tr-none"
                    : "bg-muted/50 border rounded-tl-none"
                )}>
                  <p className="leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                </div>

                {/* Render Widgets if present */}
                {msg.widgetType === "workout" && msg.widgetData && (
                  <WorkoutAIWidget data={msg.widgetData} />
                )}
                {msg.widgetType === "nutrition" && msg.widgetData && (
                  <NutritionAIWidget data={msg.widgetData} />
                )}

                <span className="text-[10px] text-muted-foreground px-1">
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>

              {msg.role === "user" && (
                <Avatar className="w-8 h-8 mt-1 border">
                  <AvatarFallback className="bg-secondary"><User className="w-4 h-4" /></AvatarFallback>
                </Avatar>
              )}
            </motion.div>
          ))}

          {isLoading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-4 w-full">
              <Avatar className="w-8 h-8 mt-1 border">
                <AvatarFallback className="bg-primary/10 text-primary"><Bot className="w-4 h-4" /></AvatarFallback>
              </Avatar>
              <div className="bg-muted/50 border rounded-2xl rounded-tl-none p-4 flex items-center gap-2">
                <div className="w-2 h-2 bg-primary/40 rounded-full animate-bounce [animation-delay:-0.3s]" />
                <div className="w-2 h-2 bg-primary/40 rounded-full animate-bounce [animation-delay:-0.15s]" />
                <div className="w-2 h-2 bg-primary/40 rounded-full animate-bounce" />
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="p-4 bg-background border-t">
        <div className="max-w-3xl mx-auto space-y-4">
          {/* Quick Actions */}
          {messages.length === 1 && (
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
              {quickActions.map((action, i) => (
                <Button
                  key={i}
                  variant="outline"
                  className="rounded-full text-xs h-8 bg-background/50 backdrop-blur whitespace-nowrap"
                  onClick={() => setInput(action.prompt)}
                >
                  <action.icon className="w-3 h-3 mr-2 text-primary" />
                  {action.label}
                </Button>
              ))}
            </div>
          )}

          <form onSubmit={handleSendMessage} className="relative flex items-center gap-2 p-2 rounded-3xl bg-muted/40 border focus-within:ring-2 ring-primary/20 transition-all">
            <Button type="button" size="icon" variant="ghost" className="rounded-full text-muted-foreground hover:text-primary">
              <Mic className="w-5 h-5" />
            </Button>
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask for a workout plan, diet tips, or check your form..."
              className="flex-1 border-none shadow-none bg-transparent focus-visible:ring-0 h-10 text-base"
            />
            <Button
              type="submit"
              size="icon"
              disabled={isLoading || !input.trim()}
              className={cn(
                "rounded-full w-10 h-10 transition-all",
                input.trim() ? "translate-x-0 opacity-100" : "translate-x-2 opacity-50"
              )}
            >
              <Send className="w-4 h-4" />
            </Button>
          </form>
          <p className="text-[10px] text-center text-muted-foreground">
            AI Coach based on Llama 3 • Can make mistakes, verify important info.
          </p>
        </div>
      </div>
    </div>
  )
}
                                )}
                              </div >

{
  message.role === "assistant" && isLast && !isTyping && (
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
  )
}

{
  message.role === "assistant" && message.content && !message.isContinuation && (
    <div className="mt-1 opacity-80 self-start">
      <EnhancedTextToSpeech text={message.content} />
    </div>
  )
}
                            </div >
                          </div >
                        </motion.div >
                      )
                    })}
                  </AnimatePresence >

  { isLoading && !isTyping && (
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
                </div >

  {/* Scroll to bottom button */ }
{
  showScrollToBottom && (
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
  )
}

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
              </CardContent >
            </Card >
          </div >

  {/* Sidebar */ }
{
  sidebarVisible && (
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
  )
}
        </div >
      </div >
    </div >
  )
}