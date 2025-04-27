"use client"

import { useState, useEffect, useRef, useCallback, memo } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import {
  Clock,
  Dumbbell,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  RotateCcw,
  CheckCircle,
  Flame,
  Heart,
  Zap,
  Info,
  Volume2,
  Users,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import WorkoutTimer from "@/components/workout-timer"
import EnhancedTextToSpeech from "@/components/enhanced-text-to-speech"
import { initVoices, preloadSpeechSynthesis } from "@/lib/speech-synthesis"
import WorkoutCompletion from "@/components/workout-completion"
import { workoutCategories } from "@/data/workouts"
import Confetti from "react-confetti"

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
const styles = `
  :root {
    --primary: #ff4d4f;
    --primary-dark: #d9363e;
    --secondary: #1890ff;
    --background: #f7fafc;
    --card-bg: #ffffff;
    --text: #1a202c;
    --text-muted: #718096;
    --flexforge-accent: #ff6b6b;
  }

  .dark {
    --primary: #ff7875;
    --primary-dark: #f56565;
    --secondary: #40c4ff;
    --background: #1a202c;
    --card-bg: #2d3748;
    --text: #e2e8f0;
    --text-muted: #a0aec0;
    --flexforge-accent: #ff8787;
  }

  .container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 2rem 1rem;
  }

  .modern-card {
    background: var(--card-bg);
    border-radius: 1rem;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }

  .modern-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 25px rgba(0, 0, 0, 0.15);
  }

  .gradient-border {
    position: relative;
    border: none;
  }

  .gradient-border::before {
    content: '';
    position: absolute;
    inset: -2px;
    border-radius: 1rem;
    background: linear-gradient(45deg, var(--primary), var(--flexforge-accent));
    z-index: -1;
  }

  .btn-modern {
    border-radius: 0.5rem;
    font-weight: 600;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
    background: var(--primary);
    color: white;
  }

  .btn-modern:hover {
    transform: scale(1.05);
    background: var(--primary-dark);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  }

  .progress-ring {
    position: relative;
    width: 120px;
    height: 120px;
  }

  .progress-ring__circle {
    transition: stroke-dashoffset 0.35s;
    transform: rotate(-90deg);
    transform-origin: 50% 50%;
  }

  .exercise-card {
    transition: all 0.3s ease;
  }

  .exercise-card.active {
    background: linear-gradient(45deg, var(--primary), var(--flexforge-accent));
    color: white;
  }

  .exercise-card.completed {
    opacity: 0.7;
    background: var(--background);
  }

  .workout-card {
    transition: transform 0.3s ease;
  }

  .workout-card:hover {
    transform: scale(1.02);
  }

  .flexforge-branding {
    font-family: 'Inter', sans-serif;
    font-weight: 700;
    color: var(--flexforge-accent);
  }

  @media (max-width: 768px) {
    .container {
      padding: 1rem;
    }

    .modern-card {
      border-radius: 0.75rem;
    }

    .btn-modern {
      padding: 0.5rem 1rem;
    }

    h1 {
      font-size: 1.75rem;
    }

    h2 {
      font-size: 1.25rem;
    }

    .progress-ring {
      width: 80px;
      height: 80px;
    }
  }

  @media (max-width: 480px) {
    .grid-cols-2 {
      grid-template-columns: 1fr;
    }

    .btn-modern {
      font-size: 0.875rem;
    }
  }
`

if (typeof document !== "undefined") {
  const styleSheet = document.createElement("style")
  styleSheet.innerText = styles
  document.head.appendChild(styleSheet)
}

const WorkoutDetailPage = memo(() => {
  const params = useParams()
  const { toast } = useToast()
  const { width, height } = useWindowSize()
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [seconds, setSeconds] = useState(0)
  const [isWorkoutComplete, setIsWorkoutComplete] = useState(false)
  const [showCompletionModal, setShowCompletionModal] = useState(false)
  const [caloriesBurned, setCaloriesBurned] = useState(0)
  const [heartRate, setHeartRate] = useState({ current: 75, max: 0, avg: 0 })
  const [intensity, setIntensity] = useState(50)
  const [isAudioPlaying, setIsAudioPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [time, setTime] = useState(60)
  const [countDown, setCountDown] = useState(true)

  useEffect(() => {
    initVoices()
    preloadSpeechSynthesis()
  }, [])

  useEffect(() => {
    audioRef.current = new Audio("/audio/workout-motivation.mp3")
    audioRef.current.loop = true
    return () => {
      audioRef.current?.pause()
      audioRef.current = null
    }
  }, [])

  const category = workoutCategories.find((c) => c.id === params.category)
  const workout = category?.workouts.find((w) => w.id === params.id)

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
      setTimeout(() => {
        const nextExercise = exercises[currentExerciseIndex + 1]
        speakText(`Next exercise: ${nextExercise.title}`)
      }, 500)
    } else {
      setIsWorkoutComplete(true)
      setIsPlaying(false)
      setShowCompletionModal(true)
      setIsAudioPlaying(false)
      audioRef.current?.pause()
      toast({
        title: "Workout Complete!",
        description: "Great job! Share your achievement with the FlexForge community!",
        action: <Button asChild><Link href="/community">Join Community</Link></Button>,
      })
    }
  }, [currentExerciseIndex, totalExercises, speakText, exercises, toast])

  const transitionToNextExercise = useCallback(() => {
    if (currentExerciseIndex < totalExercises - 1) {
      window.speechSynthesis?.cancel()
      toast({
        title: "Exercise Complete!",
        description: "Moving to the next exercise...",
      })
      setCurrentExerciseIndex((prev) => prev + 1)
      setSeconds(0)
      setIsPlaying(true)
    } else {
      handleNext()
    }
  }, [currentExerciseIndex, totalExercises, toast, handleNext])

  const handlePrevious = () => {
    if (currentExerciseIndex > 0) {
      setCurrentExerciseIndex(currentExerciseIndex - 1)
      setSeconds(0)
    }
  }

  const handlePlayPause = () => {
    setIsPlaying((prev) => !prev)
    if (!isPlaying && isAudioPlaying) {
      audioRef.current?.play()
    } else {
      audioRef.current?.pause()
    }
  }

  const handleReset = () => {
    setCurrentExerciseIndex(0)
    setSeconds(0)
    setIsPlaying(false)
    setIsWorkoutComplete(false)
    setCaloriesBurned(0)
    setHeartRate({ current: 75, max: 0, avg: 0 })
    setIntensity(50)
    setIsAudioPlaying(false)
    audioRef.current?.pause()
  }

  const toggleAudio = () => {
    setIsAudioPlaying((prev) => {
      if (!prev) {
        audioRef.current?.play()
      } else {
        audioRef.current?.pause()
      }
      return !prev
    })
  }

  const motivationalQuotes = [
    "Transform your body, transform your life with FlexForge!",
    "Every rep brings you closer to your goals.",
    "Stay consistent, stay strong.",
    "Your fitness journey starts with a single step.",
    "Push your limits, achieve greatness.",
  ]

  const randomQuote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]

  const getExerciseTips = useCallback(() => {
    const tips = [
      "Breathe steadily to maintain energy.",
      "Engage your core for better stability.",
      "Focus on form to maximize results.",
      "Stay hydrated to perform at your best.",
      "Adjust intensity with FlexForge’s AI trainer for optimal gains.",
    ]
    if (currentExercise.title.toLowerCase().includes("squat")) {
      tips.push("Keep knees aligned with toes for safety.")
    } else if (currentExercise.title.toLowerCase().includes("push")) {
      tips.push("Maintain a 45-degree elbow angle.")
    } else if (currentExercise.title.toLowerCase().includes("plank")) {
      tips.push("Keep hips level with shoulders.")
    }
    return tips[Math.floor(Math.random() * tips.length)]
  }, [currentExercise.title])

  const getExerciseImageUrl = useCallback((exercise: any) => {
    const exerciseImages: { [key: string]: string } = {
      push: "/exercises/pushups.gif",
      squat: "/exercises/squats.gif",
      plank: "/exercises/plank.gif",
      burpee: "/exercises/burpees.gif",
      lunge: "/exercises/lunges.gif",
      mountain: "/exercises/mountain-climbers.gif",
      row: "/exercises/dumbbell-rows.gif",
      deadlift: "https://images.unsplash.com/photo-1517344884509-a0c97ec11bcc?q=80&w=2070&auto=format&fit=crop",
      bench: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop",
      pull: "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?q=80&w=2074&auto=format&fit=crop",
      yoga: "https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?q=80&w=2070&auto=format&fit=crop",
      stretch: "https://images.unsplash.com/photo-1552196563-55cd4e45efb3?q=80&w=2026&auto=format&fit=crop",
      pose: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=2020&auto=format&fit=crop",
    }

    const key = Object.keys(exerciseImages).find((k) => exercise.title.toLowerCase().includes(k))
    return key ? exerciseImages[key] : "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=2070&auto=format&fit=crop"
  }, [])

  useEffect(() => {
    if (time === 0 && !isPlaying && countDown && currentExerciseIndex < totalExercises - 1) {
      transitionToNextExercise()
    }
  }, [time, isPlaying, countDown, currentExerciseIndex, totalExercises, transitionToNextExercise])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container relative"
      role="main"
      aria-label="FlexForge Workout Detail Page"
    >
      {isWorkoutComplete && (
        <Confetti
          width={width}
          height={height}
          recycle={false}
          numberOfPieces={200}
          tweenDuration={10000}
        />
      )}

      <div className="flex items-center gap-2 mb-6">
        <Button variant="ghost" size="sm" asChild aria-label="Back to Workouts">
          <Link href="/workouts">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Workouts
          </Link>
        </Button>
        <span className="flexforge-branding text-lg">FlexForge</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-8">
        <div className="lg:col-span-2">
          <motion.div
            className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight">{workout.title}</h1>
              <div className="flex flex-wrap items-center gap-2 mt-2">
                <Badge variant="outline" className="flex items-center gap-1">
                  <Dumbbell className="h-3 w-3" />
                  {workout.level}
                </Badge>
                <Badge variant="outline" className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {workout.duration}
                </Badge>
                {workout.equipment.map((item, index) => (
                  <Badge key={index} variant="secondary">
                    {item}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={toggleAudio}
                variant="outline"
                size="icon"
                aria-label={isAudioPlaying ? "Pause Audio" : "Play Audio"}
              >
                <Volume2 className="h-4 w-4" />
              </Button>
              {!isWorkoutComplete ? (
                <Button
                  onClick={handlePlayPause}
                  className="btn-modern"
                  aria-label={isPlaying ? "Pause Workout" : "Start Workout"}
                >
                  {isPlaying ? (
                    <>
                      <Pause className="mr-2 h-4 w-4" /> Pause
                    </>
                  ) : (
                    <>
                      <Play className="mr-2 h-4 w-4" /> Start
                    </>
                  )}
                </Button>
              ) : (
                <Button
                  onClick={handleReset}
                  className="btn-modern"
                  aria-label="Restart Workout"
                >
                  <RotateCcw className="mr-2 h-4 w-4" /> Restart
                </Button>
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="modern-card mb-8">
              <CardHeader className="pb-2">
                <CardTitle>About This Workout</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{workout.description}</p>
                <Button variant="link" asChild className="mt-2 p-0">
                  <Link href="/ai-trainer" className="flex items-center gap-1">
                    <Users className="h-4 w-4" /> Ask FlexForge AI Trainer
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="bg-gradient-to-r from-orange-600 to-red-600 text-white modern-card">
              <CardContent className="p-6 text-center">
                <p className="text-lg font-semibold italic">"{randomQuote}"</p>
              </CardContent>
            </Card>
          </motion.div>

          <AnimatePresence>
            {isWorkoutComplete ? (
              <motion.div
                key="completion"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 modern-card">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                      <CardTitle>Workout Complete!</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p>Congratulations on crushing it with FlexForge! Here's your summary:</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm text-center">
                        <Dumbbell className="h-6 w-6 mx-auto mb-2 text-primary" />
                        <div className="text-sm text-muted-foreground">Exercises</div>
                        <div className="text-2xl font-bold">{totalExercises}</div>
                      </div>
                      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm text-center">
                        <Clock className="h-6 w-6 mx-auto mb-2 text-primary" />
                        <div className="text-sm text-muted-foreground">Duration</div>
                        <div className="text-2xl font-bold">{workout.duration}</div>
                      </div>
                      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm text-center">
                        <Flame className="h-6 w-6 mx-auto mb-2 text-primary" />
                        <div className="text-sm text-muted-foreground">Calories</div>
                        <div className="text-2xl font-bold">{Math.round(caloriesBurned)}</div>
                      </div>
                      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm text-center">
                        <Heart className="h-6 w-6 mx-auto mb-2 text-primary" />
                        <div className="text-sm text-muted-foreground">Max HR</div>
                        <div className="text-2xl font-bold">{heartRate.max || "--"}</div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-col sm:flex-row gap-4">
                    <Button
                      onClick={handleReset}
                      className="btn-modern w-full sm:w-auto"
                      aria-label="Restart Workout"
                    >
                      <RotateCcw className="mr-2 h-4 w-4" /> Do it Again
                    </Button>
                    <Button asChild variant="outline" className="w-full sm:w-auto">
                      <Link href="/my-plan">View My Plan</Link>
                    </Button>
                    <Button asChild variant="outline" className="w-full sm:w-auto">
                      <Link href="/community">Share with Community</Link>
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ) : (
              <motion.div
                key="exercise"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="modern-card gradient-border">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <CardTitle>Current Exercise</CardTitle>
                      <div className="text-sm text-muted-foreground">
                        {currentExerciseIndex + 1} of {totalExercises}
                      </div>
                    </div>
                    <div className="flex justify-center my-4">
                      <svg className="progress-ring" viewBox="0 0 120 120">
                        <circle
                          className="progress-ring__circle"
                          stroke="var(--flexforge-accent)"
                          strokeWidth="10"
                          fill="transparent"
                          r={radius}
                          cx="60"
                          cy="60"
                          style={{ strokeDasharray: circumference, strokeDashoffset: offset }}
                        />
                        <text x="60" y="65" textAnchor="middle" fill="var(--text)" fontSize="20">
                          {Math.round(progress)}%
                        </text>
                      </svg>
                    </div>
                    <div className="mt-4">
                      <WorkoutTimer
                        initialTime={60}
                        countDown={true}
                        exerciseName={currentExercise.title}
                        exerciseLevel={currentExercise.level}
                        exerciseDuration={currentExercise.reps}
                        onStart={() => setIsPlaying(true)}
                        onComplete={handleNext}
                      />
                    </div>
                    <div className="mt-4">
                      <h3 className="text-sm font-medium">FlexForge Intensity</h3>
                      <Slider
                        value={[intensity]}
                        onValueChange={([val]) => setIntensity(val)}
                        max={100}
                        step={10}
                        className="mt-2"
                        aria-label="Adjust Workout Intensity"
                      />
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                      <div className="aspect-square md:aspect-auto bg-muted rounded-md overflow-hidden relative">
                        <Image
                          src={getExerciseImageUrl(currentExercise)}
                          alt={currentExercise.title}
                          fill
                          className="object-cover"
                          priority={currentExerciseIndex === 0}
                          sizes="(max-width: 768px) 100vw, 50vw"
                        />
                        {isPlaying && (
                          <motion.div
                            className="absolute inset-0 flex items-center justify-center"
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ repeat: Infinity, duration: 1.5 }}
                          >
                            <div className="h-24 w-24 rounded-full bg-primary/20 flex items-center justify-center">
                              <Zap className="h-12 w-12 text-primary" />
                            </div>
                          </motion.div>
                        )}
                      </div>
                      <div className="flex flex-col">
                        <h2 className="text-2xl font-bold mb-2">{currentExercise.title}</h2>
                        <div className="flex flex-wrap gap-2 mb-4">
                          <Badge>{currentExercise.level}</Badge>
                          <Badge variant="outline">{currentExercise.equipment}</Badge>
                          <Badge variant="secondary">{currentExercise.muscleGroup}</Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div className="bg-muted/50 p-3 rounded-lg flex items-center gap-2">
                            <Heart className="h-5 w-5 text-red-500" />
                            <div>
                              <div className="text-xs text-muted-foreground">Heart Rate</div>
                              <div className="font-semibold">{heartRate.current} BPM</div>
                            </div>
                          </div>
                          <div className="bg-muted/50 p-3 rounded-lg flex items-center gap-2">
                            <Flame className="h-5 w-5 text-orange-500" />
                            <div>
                              <div className="text-xs text-muted-foreground">Calories</div>
                              <div className="font-semibold">{Math.round(caloriesBurned)}</div>
                            </div>
                          </div>
                        </div>
                        <div className="mb-4">
                          <h3 className="font-semibold mb-1">Reps / Duration</h3>
                          <p>{currentExercise.reps}</p>
                        </div>
                        <div className="mb-4">
                          <h3 className="font-semibold mb-1">Instructions</h3>
                          <p className="text-muted-foreground">{currentExercise.instructions}</p>
                          <div className="mt-4">
                            <EnhancedTextToSpeech text={currentExercise.instructions} />
                          </div>
                        </div>
                        <div className="mt-4 bg-primary/10 p-3 rounded-lg">
                          <h4 className="font-medium text-primary flex items-center gap-2">
                            <Info className="h-4 w-4" /> FlexForge Guidance
                          </h4>
                          <p className="text-sm mt-1">Focus on form and control to maximize your results.</p>
                        </div>
                        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3 mt-4">
                          <div className="flex items-start gap-2">
                            <Info className="h-5 w-5 text-amber-500 mt-0.5" />
                            <div>
                              <h4 className="font-medium text-amber-800 dark:text-amber-300">Pro Tip</h4>
                              <p className="text-sm text-amber-700 dark:text-amber-400">{getExerciseTips()}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-col sm:flex-row justify-between gap-2">
                    <Button
                      variant="outline"
                      onClick={handlePrevious}
                      className="btn-modern w-full sm:w-auto"
                      disabled={currentExerciseIndex === 0}
                      aria-label="Previous Exercise"
                    >
                      <ChevronLeft className="mr-2 h-4 w-4" /> Previous
                    </Button>
                    <div className="flex gap-2 w-full sm:w-auto">
                      <Button
                        onClick={handlePlayPause}
                        className="btn-modern flex-1 sm:flex-none"
                        aria-label={isPlaying ? "Pause Exercise" : "Play Exercise"}
                      >
                        {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                      </Button>
                    </div>
                    <Button
                      onClick={handleNext}
                      className="btn-modern w-full sm:w-auto"
                      aria-label={currentExerciseIndex < totalExercises - 1 ? "Next Exercise" : "Complete Workout"}
                    >
                      {currentExerciseIndex < totalExercises - 1 ? (
                        <>
                          Next <ChevronRight className="ml-2 h-4 w-4" />
                        </>
                      ) : (
                        "Complete Workout"
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <motion.div
          className="mt-6 lg:mt-0"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h2 className="text-xl font-bold mb-4">Workout Plan</h2>
          <div className="space-y-4">
            {exercises.map((exercise, index) => (
              <motion.div
                key={exercise.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card
                  className={`exercise-card modern-card ${
                    index === currentExerciseIndex ? "active" : index < currentExerciseIndex ? "completed" : ""
                  }`}
                  onClick={() => {
                    setCurrentExerciseIndex(index)
                    setSeconds(0)
                  }}
                  role="button"
                  tabIndex={0}
                  aria-label={`Select exercise ${exercise.title}`}
                  onKeyDown={(e) => e.key === "Enter" && setCurrentExerciseIndex(index)}
                >
                  <CardHeader className="p-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                          index === currentExerciseIndex
                            ? "bg-primary text-primary-foreground"
                            : index < currentExerciseIndex
                              ? "bg-muted-foreground/20 text-muted-foreground"
                              : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {index < currentExerciseIndex ? <CheckCircle className="h-4 w-4" /> : index + 1}
                      </div>
                      <div>
                        <CardTitle className="text-base">{exercise.title}</CardTitle>
                        <CardDescription>{exercise.reps}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="mt-8">
            <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20 modern-card">
              <CardHeader>
                <CardTitle className="text-lg">FlexForge Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Flame className="h-5 w-5 text-primary" />
                      <span>Est. Calories</span>
                    </div>
                    <span className="font-bold">{Math.round(caloriesBurned)} kcal</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Heart className="h-5 w-5 text-primary" />
                      <span>Avg Heart Rate</span>
                    </div>
                    <span className="font-bold">{heartRate.avg || "--"} BPM</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-primary" />
                      <span>Duration</span>
                    </div>
                    <span className="font-bold">{workout.duration}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Dumbbell className="h-5 w-5 text-primary" />
                      <span>Difficulty</span>
                    </div>
                    <span className="font-bold">{workout.level}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8">
            <h2 className="text-xl font-bold mb-4">Join a FlexForge Challenge</h2>
            <div className="space-y-4">
              {[
                { name: "30-Day Push-Up Challenge", level: "All Levels", joined: 2547, progress: 72 },
                { name: "Summer Shred Challenge", level: "Intermediate", joined: 1823, progress: 45 },
                { name: "Flexibility Journey", level: "Beginner", joined: 986, progress: 25 },
              ].map((challenge) => (
                <Card key={challenge.name} className="modern-card workout-card">
                  <CardContent className="p-4">
                    <h3 className="font-medium">{challenge.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {challenge.level} • {challenge.joined} joined
                    </p>
                    <div className="w-full bg-muted h-2 rounded-full mt-2">
                      <div
                        className="bg-primary h-2 rounded-full"
                        style={{ width: `${challenge.progress}%` }}
                      ></div>
                    </div>
                    <Button asChild variant="outline" className="mt-2 w-full">
                      <Link href="/community">Join Challenge</Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      <WorkoutCompletion
        isOpen={showCompletionModal}
        onClose={() => setShowCompletionModal(false)}
        stats={{
          duration: workout.duration,
          caloriesBurned: caloriesBurned,
          exercisesCompleted: totalExercises,
        }}
      />
    </motion.div>
  )
})

WorkoutDetailPage.displayName = "WorkoutDetailPage"

export default WorkoutDetailPage