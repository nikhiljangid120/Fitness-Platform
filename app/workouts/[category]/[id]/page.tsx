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
    try {
      const audio = new Audio("/audio/workout-motivation.mp3")
      audio.loop = true

      // Add error listener
      audio.onerror = (e) => {
        console.warn("Audio file not found or failed to load:", e)
        setIsAudioPlaying(false)
      }

      audioRef.current = audio
    } catch (error) {
      console.warn("Failed to initialize audio:", error)
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
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
    if (!audioRef.current) return

    setIsAudioPlaying((prev) => {
      if (!prev) {
        audioRef.current?.play().catch(e => console.warn("Play failed:", e))
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



  useEffect(() => {
    if (time === 0 && !isPlaying && countDown && currentExerciseIndex < totalExercises - 1) {
      transitionToNextExercise()
    }
  }, [time, isPlaying, countDown, currentExerciseIndex, totalExercises, transitionToNextExercise])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-background pb-20"
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

      {/* Immersive Hero Section */}
      <div className="relative h-[50vh] min-h-[400px] w-full overflow-hidden">
        <Image
          src={workout.image || "/placeholder.svg?height=800&width=1200"}
          alt={workout.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-black/30" />

        <div className="container h-full flex flex-col justify-between py-6 relative z-10">
          <div className="flex justify-between items-start">
            <Button 
              variant="ghost" 
              size="sm" 
              asChild 
              className="text-white hover:bg-white/20 hover:text-white backdrop-blur-sm"
              aria-label="Back to Workouts"
            >
              <Link href="/workouts">
                <ChevronLeft className="h-4 w-4 mr-1" />
                Back
              </Link>
            </Button>
            
            <div className="flex gap-2">
               <Button
                onClick={toggleAudio}
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20 hover:text-white backdrop-blur-sm rounded-full"
                aria-label={isAudioPlaying ? "Pause Audio" : "Play Audio"}
              >
                {isAudioPlaying ? <Volume2 className="h-5 w-5" /> : <div className="relative"><Volume2 className="h-5 w-5 opacity-50" /><div className="absolute inset-0 h-[2px] w-full bg-white top-1/2 -rotate-45" /></div>}
              </Button>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-4"
          >
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <Badge className="bg-primary/90 hover:bg-primary backdrop-blur-md border-none text-white px-3 py-1 text-sm">
                <Dumbbell className="h-3 w-3 mr-1" />
                {workout.level}
              </Badge>
              <Badge variant="outline" className="border-white/40 text-white backdrop-blur-sm px-3 py-1">
                <Clock className="h-3 w-3 mr-1" />
                {workout.duration}
              </Badge>
              {workout.equipment.map((item, index) => (
                <Badge key={index} variant="secondary" className="bg-white/20 hover:bg-white/30 text-white backdrop-blur-md border-none">
                  {item}
                </Badge>
              ))}
            </div>
            
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white mb-2 shadow-sm drop-shadow-md">
              {workout.title}
            </h1>
            <p className="text-lg text-white/90 max-w-2xl font-medium drop-shadow-sm line-clamp-2">
              {workout.description}
            </p>
          </motion.div>
        </div>
      </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* LEFT COLUMN: Visuals & Timer (8 cols) */}
          <div className="lg:col-span-8">
             <AnimatePresence mode="wait">
              {isWorkoutComplete ? (
                 <motion.div
                    key="completion"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                 >
                    <WorkoutCompletion 
                      isOpen={true}
                      onClose={() => setShowCompletionModal(false)}
                      stats={{
                        duration: workout.duration,
                        caloriesBurned: caloriesBurned,
                        exercisesCompleted: totalExercises,
                      }}
                    />
                 </motion.div>
              ) : (
                <motion.div
                  key="exercise-visual"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.4 }}
                  className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl group"
                >
                   {/* Main Image/Video */}
                   <Image
                      src={currentExercise.image}
                      alt={currentExercise.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      priority
                   />
                   <div className="absolute inset-0 bg-black/20" /> {/* Slight dim */}

                   {/* Overlay Timer - Large Center */}
                   <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="relative">
                         {/* Optional: Add a subtle glow behind the timer */}
                         <div className="absolute inset-0 bg-black/40 blur-xl rounded-full transform scale-150" />
                         <svg className="progress-ring relative z-10 w-48 h-48 drop-shadow-2xl" viewBox="0 0 120 120">
                            <circle
                              className="progress-ring__circle stroke-white/20"
                              strokeWidth="4"
                              fill="transparent"
                              r={radius}
                              cx="60"
                              cy="60"
                            />
                             <circle
                              className="progress-ring__circle stroke-primary transition-all duration-300 ease-linear"
                              strokeWidth="6"
                              strokeLinecap="round"
                              fill="transparent"
                              r={radius}
                              cx="60"
                              cy="60"
                              style={{ strokeDasharray: circumference, strokeDashoffset: offset }}
                            />
                             <foreignObject x="0" y="0" width="120" height="120">
                                <div className="h-full w-full flex flex-col items-center justify-center text-white">
                                   <span className="text-4xl font-bold tracking-tighter tabular-nums drop-shadow-md">
                                     {countDown && time <= 10 ? (
                                        <span className="text-red-400 animate-pulse">{formatTime(time)}</span>
                                     ) : (
                                        formatTime(time)
                                     )}
                                   </span>
                                   <span className="text-xs uppercase tracking-widest opacity-80 mt-1 font-semibold">{countDown ? "Rest" : "Work"}</span>
                                </div>
                             </foreignObject>
                         </svg>
                      </div>
                   </div>

                   {/* Glass Control Bar */}
                   <div className="absolute bottom-6 left-6 right-6 h-20 rounded-2xl glass-effect flex items-center justify-between px-6 z-20 shadow-lg backdrop-blur-xl border border-white/20">
                      <div className="flex items-center gap-4">
                         <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={handlePrevious} 
                            disabled={currentExerciseIndex === 0}
                            className="text-primary hover:bg-primary/10 hover:text-primary rounded-full"
                         >
                            <ChevronLeft className="h-6 w-6" />
                         </Button>
                         
                         <div className="h-10 w-[1px] bg-border/50 mx-2" />
                         
                         <div className="flex flex-col">
                            <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Current</span>
                            <span className="text-sm font-bold text-foreground line-clamp-1">{currentExercise.title}</span>
                         </div>
                      </div>

                      <div className="flex items-center gap-4">
                         <Button 
                           size="lg"
                           onClick={handlePlayPause}
                           className="rounded-full h-12 w-12 p-0 bg-primary hover:bg-primary-dark shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
                         >
                            {isPlaying ? <Pause className="h-5 w-5 fill-white" /> : <Play className="h-5 w-5 fill-white ml-1" />}
                         </Button>

                         <div className="h-10 w-[1px] bg-border/50 mx-2" />

                         <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={handleNext} 
                            className="text-primary hover:bg-primary/10 hover:text-primary rounded-full"
                         >
                            <ChevronRight className="h-6 w-6" />
                         </Button>
                      </div>
                   </div>
                </motion.div>
              )}
             </AnimatePresence>
          </div>

          {/* RIGHT COLUMN: Info & Stats (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
             {/* Stats Grid */}
             <div className="grid grid-cols-2 gap-4">
                 <Card className="modern-card bg-card/50 backdrop-blur-sm border-none shadow-sm">
                    <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                       <div className="h-8 w-8 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-2">
                          <Heart className="h-4 w-4 text-red-500" />
                       </div>
                       <span className="text-2xl font-bold text-foreground">{heartRate.current}</span>
                       <span className="text-xs text-muted-foreground uppercase">BPM</span>
                    </CardContent>
                 </Card>
                 <Card className="modern-card bg-card/50 backdrop-blur-sm border-none shadow-sm">
                    <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                       <div className="h-8 w-8 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center mb-2">
                          <Flame className="h-4 w-4 text-orange-500" />
                       </div>
                       <span className="text-2xl font-bold text-foreground">{Math.round(caloriesBurned)}</span>
                       <span className="text-xs text-muted-foreground uppercase">KCAL</span>
                    </CardContent>
                 </Card>
             </div>

             {/* Instructions Card */}
             <Card className="modern-card border-none shadow-md overflow-hidden flex flex-col">
                <div className="bg-primary/5 p-4 border-b border-primary/10 flex justify-between items-center">
                   <h3 className="font-semibold flex items-center gap-2">
                     <Info className="h-4 w-4 text-primary" />
                     Instructions
                   </h3>
                   <Badge variant="secondary" className="text-xs font-normal bg-background/80">
                      Step {currentExerciseIndex + 1} / {totalExercises}
                   </Badge>
                </div>
                <CardContent className="p-5 flex-grow">
                   <p className="text-muted-foreground leading-relaxed mb-4">
                      {currentExercise.instructions}
                   </p>
                   <div className="flex items-center gap-2 mt-auto">
                     <EnhancedTextToSpeech text={currentExercise.instructions} />
                     <span className="text-xs text-muted-foreground">Hear instructions</span>
                   </div>
                </CardContent>
             </Card>

             {/* Next Up Preview */}
             {currentExerciseIndex < totalExercises - 1 && (
               <motion.div
                 initial={{ opacity: 0, x: 20 }}
                 animate={{ opacity: 1, x: 0 }}
                 key={exercises[currentExerciseIndex + 1].id}
                 className="group cursor-pointer"
                 onClick={handleNext}
               >
                 <div className="flex items-center gap-4 p-3 rounded-xl bg-card hover:bg-accent/50 transition-colors border border-border/50">
                    <div className="relative h-16 w-16 rounded-lg overflow-hidden flex-shrink-0">
                       <Image 
                         src={exercises[currentExerciseIndex + 1].image} 
                         alt="Next" 
                         fill 
                         className="object-cover"
                       />
                    </div>
                    <div>
                       <span className="text-xs text-muted-foreground uppercase font-semibold">Up Next</span>
                       <h4 className="font-bold text-foreground line-clamp-1">{exercises[currentExerciseIndex + 1].title}</h4>
                       <span className="text-xs text-muted-foreground">{exercises[currentExerciseIndex + 1].reps}</span>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground ml-auto group-hover:translate-x-1 transition-transform" />
                 </div>
               </motion.div>
             )}
          </div>
        </div>

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
                          src={currentExercise.image}
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
                  className={`exercise-card modern-card ${index === currentExerciseIndex ? "active" : index < currentExerciseIndex ? "completed" : ""
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
                        className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${index === currentExerciseIndex
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
      </div >

  <WorkoutCompletion
    isOpen={showCompletionModal}
    onClose={() => setShowCompletionModal(false)}
    stats={{
      duration: workout.duration,
      caloriesBurned: caloriesBurned,
      exercisesCompleted: totalExercises,
    }}
  />
    </motion.div >
  )
})

WorkoutDetailPage.displayName = "WorkoutDetailPage"

export default WorkoutDetailPage