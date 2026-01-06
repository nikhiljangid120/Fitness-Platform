"use client"

import { useState, useEffect, useRef, useCallback, memo } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
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
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import WorkoutTimer from "@/components/workout-timer"
import EnhancedTextToSpeech from "@/components/enhanced-text-to-speech"
import { initVoices, preloadSpeechSynthesis } from "@/lib/speech-synthesis"
import WorkoutCompletion from "@/components/workout-completion"
import { workoutCategories } from "@/data/workouts"
import Confetti from "react-confetti"
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



  return (
    <div className="p-10 text-center">
      <h1>Debug Mode</h1>
      <p>If you see this, the logic above is fine, and the error was in the JSX.</p>
      <button onClick={handleSaveWithFeedback}>Test Save</button>
    </div>
  )
})

WorkoutDetailPage.displayName = "WorkoutDetailPage"
export default WorkoutDetailPage