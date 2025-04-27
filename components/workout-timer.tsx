"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Play, Pause, RotateCcw, Volume2, VolumeX } from "lucide-react"
import { preloadSpeechSynthesis, setUserInteracted } from "@/lib/speech-synthesis"
import { useToast } from "@/hooks/use-toast"
import WorkoutStartPopup from "@/components/workout-start-popup"

interface WorkoutTimerProps {
  initialTime?: number // in seconds
  countDown?: boolean
  onComplete?: () => void
  onStart?: () => void
  exerciseName?: string
  exerciseLevel?: string
  exerciseDuration?: string
}

export default function WorkoutTimer({
  initialTime = 60,
  countDown = true,
  onComplete,
  onStart,
  exerciseName = "",
  exerciseLevel = "",
  exerciseDuration = "",
}: WorkoutTimerProps) {
  const [time, setTime] = useState(initialTime)
  const [isRunning, setIsRunning] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [showStartPopup, setShowStartPopup] = useState(false)
  const hasUserInteracted = useRef(false)
  const onStartRef = useRef(onStart)
  const isSpeakingRef = useRef(false)
  const { toast } = useToast()
  const lastAnnouncedTimeRef = useRef<number | null>(null)
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // Preload speech synthesis when component mounts
  useEffect(() => {
    preloadSpeechSynthesis()
  }, [])

  // Update ref when prop changes
  useEffect(() => {
    onStartRef.current = onStart
  }, [onStart])

  // Format time as MM:SS
  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60)
    const seconds = timeInSeconds % 60
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
  }

  // Text-to-speech function with debounce
  const speak = useCallback(
    (text: string) => {
      if (isMuted) return

      // Only try to speak if there has been user interaction
      if (hasUserInteracted.current) {
        try {
          if (typeof window !== "undefined" && window.speechSynthesis) {
            // Cancel any ongoing speech first
            window.speechSynthesis.cancel()

            const utterance = new SpeechSynthesisUtterance(text)
            window.speechSynthesis.speak(utterance)
          }
        } catch (error) {
          console.error("Error with speech:", error)
        }
      }
    },
    [isMuted],
  )

  // Cleanup function for timer
  const cleanupTimer = useCallback(() => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current)
      timerIntervalRef.current = null
    }
  }, [])

  // Timer logic
  useEffect(() => {
    cleanupTimer()

    if (isRunning) {
      timerIntervalRef.current = setInterval(() => {
        setTime((prevTime) => {
          // For countdown timer
          if (countDown) {
            // Announce time milestones with better timing
            if (prevTime === 30 && lastAnnouncedTimeRef.current !== 30) {
              lastAnnouncedTimeRef.current = 30
              speak("30 seconds remaining")
            } else if (prevTime === 20 && lastAnnouncedTimeRef.current !== 20) {
              lastAnnouncedTimeRef.current = 20
              speak("20 seconds remaining")
            } else if (prevTime === 10 && lastAnnouncedTimeRef.current !== 10) {
              lastAnnouncedTimeRef.current = 10
              speak("10 seconds remaining")
            } else if (prevTime <= 5 && prevTime > 0 && lastAnnouncedTimeRef.current !== prevTime) {
              lastAnnouncedTimeRef.current = prevTime
              speak(prevTime.toString())
            }

            // Check if timer has reached zero
            if (prevTime <= 1) {
              cleanupTimer() // Ensure timer is stopped
              setIsRunning(false)
              speak("Time's up!")

              // Schedule onComplete callback after speech finishes
              setTimeout(() => {
                if (onComplete) onComplete()
              }, 1000)

              return 0
            }
            return prevTime - 1
          }
          // For count-up timer
          else {
            // Announce every minute
            if (prevTime % 60 === 0 && prevTime > 0 && lastAnnouncedTimeRef.current !== prevTime) {
              lastAnnouncedTimeRef.current = prevTime
              speak(`${Math.floor(prevTime / 60)} minute${prevTime > 60 ? "s" : ""} completed`)
            }
            return prevTime + 1
          }
        })
      }, 1000)
    }

    return cleanupTimer
  }, [isRunning, countDown, speak, cleanupTimer, onComplete])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanupTimer()
      // Cancel any ongoing speech when component unmounts
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel()
      }
    }
  }, [cleanupTimer])

  // Start/pause timer
  const toggleTimer = () => {
    // Set the user interaction flag
    hasUserInteracted.current = true
    setUserInteracted()

    if (!isRunning && time === 0 && countDown) {
      // Reset if countdown timer has reached zero
      setTime(initialTime)
    }

    if (!isRunning) {
      // Show the start popup
      setShowStartPopup(true)
    } else {
      setIsRunning(false)
      speak("Paused")
    }
  }

  // Handle popup close
  const handleStartPopupClose = () => {
    setShowStartPopup(false)
    setIsRunning(true)

    // Reset the last announced time
    lastAnnouncedTimeRef.current = null

    // Call onStart callback
    if (onStartRef.current) {
      setTimeout(() => {
        if (onStartRef.current) onStartRef.current()
      }, 0)
    }
  }

  // Reset timer
  const resetTimer = () => {
    hasUserInteracted.current = true
    setUserInteracted()
    setIsRunning(false)
    setTime(initialTime)
    speak("Timer reset")
  }

  // Toggle mute
  const toggleMute = () => {
    hasUserInteracted.current = true
    setUserInteracted()
    setIsMuted(!isMuted)

    if (!isMuted) {
      // Canceling any ongoing speech when muting
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel()
      }
      toast({
        title: "Audio muted",
        description: "Voice guidance is now turned off",
      })
    } else {
      toast({
        title: "Audio unmuted",
        description: "Voice guidance is now turned on",
      })
    }
  }

  return (
    <>
      <Card className="workout-timer-card">
        <CardContent className="p-4">
          <div className="flex flex-col items-center">
            <div className="text-4xl font-bold mb-4 timer-display">{formatTime(time)}</div>
            <div className="flex gap-2">
              <Button onClick={toggleTimer} size="sm" className="bg-primary hover:bg-primary/90">
                {isRunning ? <Pause className="h-4 w-4 mr-1" /> : <Play className="h-4 w-4 mr-1" />}
                {isRunning ? "Pause" : "Start"}
              </Button>
              <Button onClick={resetTimer} variant="outline" size="sm">
                <RotateCcw className="h-4 w-4 mr-1" />
                Reset
              </Button>
              <Button onClick={toggleMute} variant="ghost" size="sm">
                {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Workout Start Popup */}
      <WorkoutStartPopup
        isOpen={showStartPopup}
        onClose={handleStartPopupClose}
        workoutTitle={exerciseName}
        workoutLevel={exerciseLevel}
        workoutDuration={exerciseDuration}
      />
    </>
  )
}
