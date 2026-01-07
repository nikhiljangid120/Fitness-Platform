"use client"

import { useState, useEffect, useRef, useCallback, memo } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Clock,
  Dumbbell,
  ChevronLeft,
  ChevronRight,
  Flame,
  Zap,
  Brain,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { getImageForKeyword } from "@/lib/image-mapper"
import { Confetti } from "@/components/ui/confetti"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import WorkoutTimer from "@/components/workout-timer"
import EnhancedTextToSpeech from "@/components/enhanced-text-to-speech"
import { initVoices, preloadSpeechSynthesis } from "@/lib/speech-synthesis"
import WorkoutCompletion from "@/components/workout-completion"
import { workoutCategories } from "@/data/workouts"
import { saveWorkout } from "@/app/actions/workout"

// Custom useWindowSize hook
const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 })

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    window.addEventListener("resize", handleResize)
    handleResize()
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return windowSize
}

// FlexForge-themed CSS


const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, "0")}`
}

const WorkoutDetailPage = memo(() => {
  const params = useParams()
  const { toast } = useToast()
  const { width, height } = useWindowSize()

  const category = workoutCategories.find((c) => c.id === params.category)
  const workout = category?.workouts.find((w) => w.id === params.id)

  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [seconds, setSeconds] = useState(0)
  const [isWorkoutComplete, setIsWorkoutComplete] = useState(false)
  const [showCompletionModal, setShowCompletionModal] = useState(false)
  const [caloriesBurned, setCaloriesBurned] = useState(0)
  const [heartRate, setHeartRate] = useState({ current: 75, max: 0, avg: 0 })
  const [intensity, setIntensity] = useState(50)

  // Audio state removed
  const [time, setTime] = useState(30) // Default to 30s or exercise specific
  const [countDown, setCountDown] = useState(false) // Start directly or use true for prep
  const savedRef = useRef(false) // Prevent duplicate saves

  useEffect(() => {
    initVoices()
    preloadSpeechSynthesis()
  }, [])

  // State for feedback
  const [showFeedbackDialog, setShowFeedbackDialog] = useState(false)
  const [difficulty, setDifficulty] = useState([5]) // 1-10
  const [notes, setNotes] = useState("")

  // Auto-save happens AFTER feedback now
  useEffect(() => {
    // If workout is complete but not saved, show feedback dialog
    if (isWorkoutComplete && workout && !savedRef.current && !showFeedbackDialog) {
      setShowFeedbackDialog(true)
    }
  }, [isWorkoutComplete, workout, showFeedbackDialog])

  const handleSaveWithFeedback = () => {
    if (!workout || savedRef.current) return
    savedRef.current = true

    const durationInSeconds = parseInt(workout.duration || "0") * 60

    saveWorkout({
      workoutId: workout.id,
      title: workout.title,
      duration: durationInSeconds || 1800,
      calories: Math.round(caloriesBurned),
      difficulty: difficulty[0],
      notes: notes
    }).then((result) => {
      setShowFeedbackDialog(false)
      if (result.success) {
        toast({
          title: "Workout Saved!",
          description: "Great job! Your progress has been recorded.",
        })
      } else {
        console.error("Failed to save workout")
      }
    })
  }

  // Removed broken audio initialization

  // Removed broken audio initialization to prevent "element has no supported sources" error

  // Removed broken audio initialization for cleanup


  if (!workout) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="container"
        role="alert"
        aria-live="assertive"
      >
        <div className="flex items-center gap-2 mb-6">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/workouts">
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back to Workouts
            </Link>
          </Button>
        </div>
        <Card className="modern-card max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Workout Not Found</CardTitle>
            <CardDescription>Sorry, we couldn't find the workout you're looking for.</CardDescription>
          </CardHeader>
          <CardContent>
            <p>
              The workout "{params.id}" in category "{params.category}" doesn't exist or may have been removed.
            </p>
          </CardContent>
          <CardFooter>
            <Button asChild>
              <Link href="/workouts">Browse All Workouts</Link>
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    )
  }

  const exercises = workout.exercises.length > 0 ? workout.exercises : [
    {
      id: "placeholder",
      title: "Rest Day",
      equipment: "None",
      reps: "Take it easy",
      instructions: "This workout doesn't have any exercises defined. Consider this a rest day or choose another workout.",
      level: "All Levels",
      muscleGroup: "Recovery",
      image: "",
    },
  ]

  const currentExercise = exercises[currentExerciseIndex]
  const totalExercises = exercises.length
  const progress = ((currentExerciseIndex + 1) / totalExercises) * 100
  const radius = 50
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (progress / 100) * circumference

  const speakText = useCallback((text: string, options: any = {}) => {
    try {
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel()
        const utterance = new SpeechSynthesisUtterance(text)
        if (options.onEnd) utterance.onend = options.onEnd
        window.speechSynthesis.speak(utterance)
      }
    } catch (error) {
      console.error("Speech synthesis error:", error)
    }
  }, [])

  useEffect(() => {
    let heartRateId: NodeJS.Timeout | null = null
    let caloriesId: NodeJS.Timeout | null = null

    if (isPlaying) {
      heartRateId = setInterval(() => {
        setHeartRate((prev) => {
          const variation = Math.floor(Math.random() * 5) - 2
          const newRate = prev.current + variation * (intensity / 50)
          const constrainedRate = Math.max(70, Math.min(180, newRate))
          return {
            current: constrainedRate,
            max: Math.max(prev.max, constrainedRate),
            avg: Math.round(prev.avg * 0.95 + constrainedRate * 0.05),
          }
        })
      }, 1000)

      caloriesId = setInterval(() => {
        setCaloriesBurned((prev) => {
          const caloriesPerSecond = ((5 + (currentExerciseIndex % 5)) * (intensity / 50)) / 60
          return prev + caloriesPerSecond
        })
      }, 1000)
    }

    return () => {
      if (heartRateId) clearInterval(heartRateId)
      if (caloriesId) clearInterval(caloriesId)
    }
  }, [currentExerciseIndex, isPlaying, intensity])

  const handleNext = useCallback(() => {
    if (currentExerciseIndex < totalExercises - 1) {
      window.speechSynthesis?.cancel()
      setCurrentExerciseIndex(currentExerciseIndex + 1)
      setSeconds(0)
      setTime(45) // Reset timer
      setCountDown(false) // Force Work mode
      setIsPlaying(false) // Pause on manual skip
      setTimeout(() => {
        const nextExercise = exercises[currentExerciseIndex + 1]
        speakText(`Next exercise: ${nextExercise.title}`)
      }, 500)
    } else {
      setIsWorkoutComplete(true)
      setIsPlaying(false)
      setShowCompletionModal(true)

      // audio cleanup removed
      toast({
        title: "Workout Complete!",
        description: "Great job! Share your achievement with the FlexForge community!",
        action: <Button asChild><Link href="/community">Join Community</Link></Button>,
      })
    }
  }, [currentExerciseIndex, totalExercises, speakText, exercises, toast])

  const advanceToNextExercise = useCallback(() => {
    if (currentExerciseIndex < totalExercises - 1) {
      window.speechSynthesis?.cancel()
      setCurrentExerciseIndex((prev) => prev + 1)
      setSeconds(0)
      setTime(45) // Default Work Duration (Premium standard)
      setCountDown(false) // Ensure we are in Work mode
      setIsPlaying(true)

      setTimeout(() => {
        const nextExercise = exercises[currentExerciseIndex + 1]
        speakText(`Start ${nextExercise.title}`)
      }, 500)

    } else {
      handleNext()
    }
  }, [currentExerciseIndex, totalExercises, handleNext, exercises, speakText])

  // Timer Logic with Work/Rest Cycle
  useEffect(() => {
    let interval: NodeJS.Timeout

    if (isPlaying && time > 0) {
      interval = setInterval(() => {
        setTime((prev) => prev - 1)
      }, 1000)
    } else if (time === 0 && isPlaying) {
      if (!countDown) {
        // Work Phase Finished -> Start Rest
        setCountDown(true)
        setTime(15) // 15s Rest
        toast({
          title: "Rest",
          description: "Take a breather!",
        })
        speakText("Rest for 15 seconds")
      } else {
        // Rest Phase Finished -> Next Exercise
        advanceToNextExercise()
      }
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isPlaying, time, countDown, advanceToNextExercise, speakText, toast])

  const handlePrevious = () => {
    if (currentExerciseIndex > 0) {
      setCurrentExerciseIndex(currentExerciseIndex - 1)
      setSeconds(0)
    }
  }

  const handlePlayPause = () => {
    setIsPlaying((prev) => !prev)
  }

  const handleReset = () => {
    setCurrentExerciseIndex(0)
    setSeconds(0)
    setIsPlaying(false)
    setIsWorkoutComplete(false)
    setCaloriesBurned(0)
    setHeartRate({ current: 75, max: 0, avg: 0 })
    setIntensity(50)

  }

  // toggleAudio function removed

  const motivationalQuotes = [
    "Transform your body, transform your life with FlexForge!",
    "Every rep brings you closer to your goals.",
    "Stay consistent, stay strong.",
    "Your fitness journey starts with a single step.",
    "Push your limits, achieve greatness.",
  ]

  const randomQuote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];



  // Determine image to show
  const displayImage = currentExercise?.image && currentExercise.image.length > 5
    ? currentExercise.image
    : getImageForKeyword(currentExercise?.title || "workout")

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-background pb-20"
      role="main"
      aria-label="FlexForge Workout Detail Page"
    >
      {isWorkoutComplete && <Confetti />}

      {/* Fixed Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/workouts">
              <ChevronLeft className="mr-2 h-4 w-4" />
              Exit
            </Link>
          </Button>
          <div className="font-semibold">{workout.title}</div>
          <div className="flex items-center gap-2">
            <Badge variant={countDown ? "secondary" : "default"} className={countDown ? "animate-pulse" : ""}>
              {countDown ? "REST" : "WORK"}
            </Badge>
          </div>
        </div>
        <Progress value={progress} className="h-1" />
      </header>

      <div className="container py-6 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[calc(100vh-140px)] min-h-[600px]">

          {/* Left Column: Visuals */}
          <Card className="lg:col-span-2 overflow-hidden relative border-none shadow-2xl bg-black/5 dark:bg-black/20 flex flex-col">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentExercise.id + (countDown ? "-rest" : "-work")}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="absolute inset-0 z-0"
              >
                {/* Background Image / Video */}
                <div className="absolute inset-0 bg-black/40 z-10" />
                <img
                  src={countDown ? getImageForKeyword("rest") : displayImage}
                  alt={currentExercise.title}
                  className="w-full h-full object-cover"
                />
              </motion.div>
            </AnimatePresence>

            {/* Overlay Content */}
            <div className="relative z-20 flex-1 flex flex-col justify-between p-8 text-white">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <motion.h2
                    key={currentExercise.title}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="text-3xl md:text-5xl font-bold tracking-tight shadow-black/50 drop-shadow-lg"
                  >
                    {countDown ? "Rest" : currentExercise.title}
                  </motion.h2>
                  {!countDown && (
                    <p className="text-lg text-white/90 drop-shadow-md">{currentExercise.reps}</p>
                  )}
                </div>

                <div className="text-right">
                  <div className="text-6xl font-black tracking-tighter drop-shadow-xl" style={{ fontVariantNumeric: "tabular-nums" }}>
                    {Math.floor(time / 60)}:{String(time % 60).padStart(2, '0')}
                  </div>
                  <p className="text-sm uppercase tracking-widest opacity-80 mt-1">
                    {countDown ? "Recovery" : "Time Remaining"}
                  </p>
                </div>
              </div>

              {/* Center Motivation or Instruction */}
              <div className="flex-1 flex items-center justify-center text-center">
                <AnimatePresence mode="wait">
                  {countDown ? (
                    <motion.div
                      key="rest-msg"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="max-w-md"
                    >
                      <p className="text-2xl font-light italic">"Recovery is where the growth happens."</p>
                      <p className="mt-4 text-white/80">Next: {exercises[currentExerciseIndex + 1]?.title || "Finish"}</p>
                    </motion.div>
                  ) : (
                    <div className="hidden md:block">
                      {/* Keeps the center clear for the exercise view, or we could put tips here */}
                    </div>
                  )}
                </AnimatePresence>
              </div>

              {/* Bottom Controls Overlay */}
              <div className="flex items-center justify-between gap-4 bg-black/60 backdrop-blur-md p-4 rounded-xl border border-white/10">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handlePrevious}
                  disabled={currentExerciseIndex === 0}
                  className="text-white hover:bg-white/20"
                >
                  <ChevronLeft className="h-8 w-8" />
                </Button>

                <div className="flex items-center gap-6">
                  <Button
                    size="icon"
                    className="h-16 w-16 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg scale-100 hover:scale-105 transition-transform"
                    onClick={handlePlayPause}
                  >
                    {isPlaying ? (
                      <div className="h-6 w-6 bg-current rounded-sm" /> /* Pause Icon visual */
                    ) : (
                      <div className="h-0 w-0 border-y-[12px] border-y-transparent border-l-[20px] border-l-current ml-1" /> /* Play Icon visual */
                    )}
                  </Button>

                  <Button
                    variant="secondary"
                    size="icon"
                    onClick={handleReset}
                    className="h-12 w-12 rounded-full bg-white/10 hover:bg-white/20 text-white"
                  >
                    <div className="h-5 w-5 border-2 border-current rounded-full" /> {/* Reset visual */}
                  </Button>
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleNext}
                  disabled={currentExerciseIndex === totalExercises - 1}
                  className="text-white hover:bg-white/20"
                >
                  <ChevronRight className="h-8 w-8" />
                </Button>
              </div>
            </div>
          </Card>

          {/* Right Column: Details & Stats */}
          <div className="flex flex-col gap-6 h-full overflow-hidden">
            {/* Stats */}
            <Card className="flex-none">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium uppercase tracking-wider text-muted-foreground">Session Stats</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <span className="text-3xl font-bold">{Math.round(caloriesBurned)}</span>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Flame className="h-3 w-3 text-orange-500" />
                    Calories
                  </span>
                </div>
                <div className="flex flex-col">
                  <div className="flex items-end gap-1">
                    <span className="text-3xl font-bold">{Math.round(heartRate.current)}</span>
                    <span className="text-sm font-medium text-muted-foreground mb-1">bpm</span>
                  </div>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Zap className="h-3 w-3 text-red-500" />
                    Heart Rate
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Instructions Scroll */}
            <Card className="flex-1 overflow-hidden flex flex-col">
              <CardHeader className="pb-2 flex-none">
                <CardTitle>Instructions</CardTitle>
              </CardHeader>
              <Separator />
              <ScrollArea className="flex-1 p-6">
                <div className="prose dark:prose-invert">
                  <p className="text-lg leading-relaxed">
                    {countDown
                      ? "Get ready for the next exercise. Focus on your breathing and prepare your setup."
                      : currentExercise.instructions}
                  </p>

                  <div className="mt-8 p-4 bg-muted rounded-lg">
                    <h4 className="font-semibold flex items-center gap-2 mb-2">
                      <Brain className="h-4 w-4 text-purple-500" />
                      Trainer Tip
                    </h4>
                    <p className="text-sm text-muted-foreground italic">
                      "{randomQuote}"
                    </p>
                  </div>
                </div>
              </ScrollArea>
            </Card>

            {/* Next Up Preview */}
            <Card className="flex-none bg-muted/30">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="h-12 w-12 rounded bg-muted overflow-hidden relative">
                  <img
                    src={exercises[currentExerciseIndex + 1] ? (exercises[currentExerciseIndex + 1].image || getImageForKeyword(exercises[currentExerciseIndex + 1].title)) : getImageForKeyword("finish")}
                    className="w-full h-full object-cover"
                    alt="Next"
                  />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase">Up Next</p>
                  <p className="font-semibold truncate max-w-[150px]">
                    {exercises[currentExerciseIndex + 1]?.title || "Workout Complete"}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Feedback Dialog */}
      <Dialog open={showFeedbackDialog} onOpenChange={setShowFeedbackDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Workout Complete!</DialogTitle>
            <DialogDescription>
              Great work! How was the session?
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Difficulty Rating</Label>
              <RadioGroup
                value={difficulty}
                onValueChange={setDifficulty}
                className="flex justify-between"
              >
                {["Easy", "Medium", "Hard"].map((level) => (
                  <div key={level} className="flex items-center space-x-2">
                    <RadioGroupItem value={level} id={level} />
                    <Label htmlFor={level} className="cursor-pointer">{level}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
            <div className="grid gap-2">
              <Label>Notes</Label>
              <Textarea
                placeholder="How did you feel? Any pain or personal bests?"
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleSaveWithFeedback}>Save Workout</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  )
})

WorkoutDetailPage.displayName = "WorkoutDetailPage"
export default WorkoutDetailPage