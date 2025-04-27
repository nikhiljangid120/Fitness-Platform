"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Dumbbell, Flame } from "lucide-react"

interface WorkoutStartPopupProps {
  isOpen: boolean
  onClose: () => void
  workoutTitle: string
  workoutLevel: string
  workoutDuration: string
}

export default function WorkoutStartPopup({
  isOpen,
  onClose,
  workoutTitle,
  workoutLevel,
  workoutDuration,
}: WorkoutStartPopupProps) {
  const [countdown, setCountdown] = useState(3)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  // Handle countdown when popup opens
  useEffect(() => {
    if (isOpen) {
      // Reset countdown
      setCountdown(3)

      // Start countdown with timers only - no speech dependency
      startCountdown()
    }

    return () => {
      // Clean up timers when component unmounts or popup closes
      if (timerRef.current) {
        clearTimeout(timerRef.current)
        timerRef.current = null
      }

      // Cancel any ongoing speech when component unmounts
      if (typeof window !== "undefined" && window.speechSynthesis) {
        try {
          window.speechSynthesis.cancel()
        } catch (error) {
          console.error("Error canceling speech:", error)
        }
      }
    }
  }, [isOpen])

  // Function to handle the countdown with timers only
  const startCountdown = () => {
    // Wait 1 second for the intro
    timerRef.current = setTimeout(() => {
      // Try to speak the intro text with proper timing
      const introText = `Get ready for ${workoutTitle}. ${workoutLevel} level, ${workoutDuration}.`
      try {
        if (typeof window !== "undefined" && window.speechSynthesis && window.SpeechSynthesisUtterance) {
          const utterance = new SpeechSynthesisUtterance(introText)
          utterance.rate = 1.1 // Slightly faster to fit in the intro time
          window.speechSynthesis.speak(utterance)
        }
      } catch (error) {
        console.error("Error with intro speech:", error)
      }

      // Start at 3 after 1.5 seconds (giving time for intro)
      timerRef.current = setTimeout(() => {
        setCountdown(3)

        // Speak "3"
        try {
          if (typeof window !== "undefined" && window.speechSynthesis) {
            const utterance = new SpeechSynthesisUtterance("3")
            window.speechSynthesis.speak(utterance)
          }
        } catch (error) {
          console.error("Error with countdown speech:", error)
        }

        // Count down to 2 after 1 second
        timerRef.current = setTimeout(() => {
          setCountdown(2)

          // Speak "2"
          try {
            if (typeof window !== "undefined" && window.speechSynthesis) {
              const utterance = new SpeechSynthesisUtterance("2")
              window.speechSynthesis.speak(utterance)
            }
          } catch (error) {
            console.error("Error with countdown speech:", error)
          }

          // Count down to 1 after 1 second
          timerRef.current = setTimeout(() => {
            setCountdown(1)

            // Speak "1"
            try {
              if (typeof window !== "undefined" && window.speechSynthesis) {
                const utterance = new SpeechSynthesisUtterance("1")
                window.speechSynthesis.speak(utterance)
              }
            } catch (error) {
              console.error("Error with countdown speech:", error)
            }

            // Count down to GO after 1 second
            timerRef.current = setTimeout(() => {
              setCountdown(0)

              // Speak "Go" and play beep
              try {
                playBeep(800, 0.6)
                if (typeof window !== "undefined" && window.speechSynthesis) {
                  const utterance = new SpeechSynthesisUtterance("Go!")
                  window.speechSynthesis.speak(utterance)
                }
              } catch (error) {
                console.error("Error with Go speech:", error)
              }

              // Close popup after showing GO for 1.5 seconds
              timerRef.current = setTimeout(() => {
                onClose()
              }, 1500)
            }, 1000)
          }, 1000)
        }, 1000)
      }, 1500)
    }, 500)
  }

  // Attempt to use speech synthesis, but don't rely on it
  const tryToSpeak = () => {
    if (typeof window === "undefined" || !window.speechSynthesis || !window.SpeechSynthesisUtterance) {
      return
    }

    try {
      // Try to speak the intro
      const introText = `Get ready for ${workoutTitle}. ${workoutLevel} level, ${workoutDuration}.`
      console.log("Attempting to speak intro:", introText)

      // Create a new utterance
      const utterance = new SpeechSynthesisUtterance(introText)

      // Set up error handling
      utterance.onerror = (event) => {
        console.error("Speech synthesis error:", event)
      }

      // Speak the intro
      window.speechSynthesis.speak(utterance)

      // Try to play a beep sound when countdown reaches 0
      setTimeout(() => {
        try {
          playBeep(800, 0.6)
        } catch (error) {
          console.error("Error playing beep:", error)
        }
      }, 4000) // Approximately when countdown reaches 0
    } catch (error) {
      console.error("Error with speech synthesis:", error)
    }
  }

  // Simple beep sound function that doesn't rely on external libraries
  const playBeep = (frequency: number, duration: number) => {
    if (typeof window === "undefined" || !window.AudioContext) {
      return
    }

    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()

      oscillator.type = "sine"
      oscillator.frequency.value = frequency
      gainNode.gain.value = 0.5

      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)

      oscillator.start()

      setTimeout(() => {
        oscillator.stop()
        audioContext.close()
      }, duration * 1000)
    } catch (error) {
      console.error("Error playing beep:", error)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", damping: 15 }}
            className="bg-card rounded-xl shadow-2xl p-8 max-w-md w-full mx-4 text-center relative overflow-hidden perspective-popup modern-card gradient-border"
          >
            {/* Background animation */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute -top-10 -left-10 w-40 h-40 bg-primary/10 rounded-full blur-xl animate-pulse"></div>
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-primary/10 rounded-full blur-xl animate-pulse-delayed"></div>
            </div>

            <div className="relative z-10 popup-content">
              <div className="mb-4 flex justify-center">
                <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                  <Dumbbell className="h-8 w-8 text-primary" />
                </div>
              </div>

              <h2 className="text-2xl font-bold mb-2">{workoutTitle}</h2>
              <p className="text-muted-foreground mb-6">
                {workoutLevel} • {workoutDuration}
              </p>

              <div className="flex justify-center items-center mb-6">
                <motion.div
                  key={countdown}
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 1.5, opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className={`w-32 h-32 rounded-full flex items-center justify-center ${
                    countdown > 0 ? "bg-primary" : "bg-gradient-to-r from-orange-500 to-red-500"
                  }`}
                >
                  <span
                    className={`text-5xl font-bold text-white countdown-number ${countdown === 0 ? "go-text" : ""}`}
                  >
                    {countdown > 0 ? countdown : "GO!"}
                  </span>
                </motion.div>
              </div>

              <p className="text-sm text-muted-foreground">{countdown > 0 ? "Get ready..." : "Let's go!"}</p>

              {/* Animated flames at the bottom */}
              <div className="absolute bottom-0 left-0 right-0 flex justify-center">
                <motion.div
                  animate={{ y: [0, -10, 0], opacity: [0.5, 1, 0.5] }}
                  transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5 }}
                >
                  <Flame className="h-8 w-8 text-primary/60" />
                </motion.div>
                <motion.div
                  animate={{ y: [0, -15, 0], opacity: [0.5, 1, 0.5] }}
                  transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2, delay: 0.3 }}
                >
                  <Flame className="h-10 w-10 text-primary/80" />
                </motion.div>
                <motion.div
                  animate={{ y: [0, -10, 0], opacity: [0.5, 1, 0.5] }}
                  transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.8, delay: 0.6 }}
                >
                  <Flame className="h-8 w-8 text-primary/60" />
                </motion.div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
