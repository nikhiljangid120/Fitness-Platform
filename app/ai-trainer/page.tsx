"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Send, Bot, User, Sparkles, Mic, ChevronDown, RefreshCw, Dumbbell, Apple, Volume2, StopCircle } from "lucide-react"

// ... imports

const [speakingId, setSpeakingId] = useState<string | null>(null)

const speakMessage = (text: string, id: string) => {
  if (speakingId === id) {
    window.speechSynthesis.cancel()
    setSpeakingId(null)
    return
  }

  window.speechSynthesis.cancel()
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.onend = () => setSpeakingId(null)
  setSpeakingId(id)
  window.speechSynthesis.speak(utterance)
}

// ... inside render loop for assistant message
{
  msg.role === "assistant" && (
    <div className="flex flex-col items-center gap-1 mt-1">
      <Avatar className="w-8 h-8 border">
        <AvatarImage src="/bot-avatar.png" />
        <AvatarFallback className="bg-primary/10 text-primary"><Bot className="w-4 h-4" /></AvatarFallback>
      </Avatar>
      <Button
        variant="ghost"
        size="icon"
        className="h-6 w-6 rounded-full hover:bg-muted"
        onClick={() => speakMessage(msg.content, msg.id)}
      >
        {speakingId === msg.id ? <StopCircle className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
      </Button>
    </div>
  )
}
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
                <div className="flex flex-col items-center gap-1 mt-1">
                  <Avatar className="w-8 h-8 border">
                    <AvatarImage src="/bot-avatar.png" />
                    <AvatarFallback className="bg-primary/10 text-primary"><Bot className="w-4 h-4" /></AvatarFallback>
                  </Avatar>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 rounded-full hover:bg-muted"
                    onClick={() => speakMessage(msg.content, msg.id)}
                  >
                    {speakingId === msg.id ? <StopCircle className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
                  </Button>
                </div>
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