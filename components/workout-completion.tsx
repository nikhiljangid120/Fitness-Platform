"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Trophy, Star, Flame, Calendar, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { setUserInteracted } from "@/lib/speech-synthesis"

interface WorkoutCompletionProps {
  isOpen: boolean
  onClose: () => void
  stats: {
    duration: string
    caloriesBurned: number
    exercisesCompleted: number
  }
}

export default function WorkoutCompletion({ isOpen, onClose, stats }: WorkoutCompletionProps) {
  const [hasSpoken, setHasSpoken] = useState(false)

  // Function to create confetti effect manually
  const createConfetti = () => {
    if (typeof window === "undefined") return

    const container = document.body
    const colors = ["#ff4500", "#ff8c00", "#ff6347", "#ffa500", "#ff7f50"]

    for (let i = 0; i < 100; i++) {
      const confetti = document.createElement("div")
      confetti.className = "confetti"
      confetti.style.left = `${Math.random() * 100}vw`
      confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)]
      confetti.style.width = `${Math.random() * 10 + 5}px`
      confetti.style.height = `${Math.random() * 10 + 5}px`
      confetti.style.animationDuration = `${Math.random() * 3 + 2}s`
      confetti.style.animationDelay = `${Math.random() * 2}s`

      container.appendChild(confetti)

      // Remove after animation completes
      setTimeout(() => {
        if (container.contains(confetti)) {
          container.removeChild(confetti)
        }
      }, 5000)
    }
  }

  // Trigger confetti when opened
  useEffect(() => {
    if (isOpen) {
      // Mark that user has interacted with the page
      setUserInteracted()

      // Create manual confetti effect as a fallback
      createConfetti()

      // Try to run confetti
      try {
        if (typeof window !== "undefined") {
          import("canvas-confetti")
            .then((confettiModule) => {
              const confetti = confettiModule.default
              const duration = 3 * 1000
              const animationEnd = Date.now() + duration
              const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 }

              function randomInRange(min: number, max: number) {
                return Math.random() * (max - min) + min
              }

              const interval: any = setInterval(() => {
                const timeLeft = animationEnd - Date.now()

                if (timeLeft <= 0) {
                  return clearInterval(interval)
                }

                const particleCount = 50 * (timeLeft / duration)

                confetti({
                  ...defaults,
                  particleCount,
                  origin: { x: randomInRange(0.1, 0.3), y: randomInRange(0.1, 0.3) },
                })

                confetti({
                  ...defaults,
                  particleCount,
                  origin: { x: randomInRange(0.7, 0.9), y: randomInRange(0.1, 0.3) },
                })
              }, 250)
            })
            .catch((error) => {
              console.error("Failed to load confetti:", error)
            })
        }
      } catch (error) {
        console.error("Error running confetti:", error)
      }

      // Speak congratulations message
      if (!hasSpoken) {
        setTimeout(() => {
          try {
            if (typeof window !== "undefined" && window.speechSynthesis && window.SpeechSynthesisUtterance) {
              const utterance = new SpeechSynthesisUtterance(
                `Congratulations! You've completed your workout. You burned approximately ${Math.round(stats.caloriesBurned)} calories.`,
              )
              window.speechSynthesis.speak(utterance)
            } else {
              console.log(`Speech (fallback): Congratulations! You've completed your workout.`)
            }
          } catch (error) {
            console.error("Error with speech:", error)
          }
          setHasSpoken(true)
        }, 500)
      }
    } else {
      setHasSpoken(false)
    }
  }, [isOpen, stats, hasSpoken])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 15 }}
            className="bg-card rounded-xl shadow-2xl p-8 max-w-md w-full mx-4 text-center relative overflow-hidden modern-card gradient-border"
          >
            {/* Background glow */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute -top-10 -left-10 w-40 h-40 bg-primary/10 rounded-full blur-xl animate-pulse"></div>
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-primary/10 rounded-full blur-xl animate-pulse-delayed"></div>
            </div>

            <div className="relative z-10">
              <motion.div
                initial={{ scale: 0, rotate: -10 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", damping: 12, delay: 0.2 }}
                className="mb-6 flex justify-center"
              >
                <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center">
                  <Trophy className="h-10 w-10 text-primary" />
                </div>
              </motion.div>

              <motion.h2
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-2xl font-bold mb-2"
              >
                Workout Complete!
              </motion.h2>

              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-muted-foreground mb-6"
              >
                Great job! You've crushed your workout.
              </motion.p>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="grid grid-cols-3 gap-4 mb-6"
              >
                <div className="bg-primary/10 rounded-lg p-3 flex flex-col items-center">
                  <Flame className="h-5 w-5 text-primary mb-1" />
                  <span className="text-xs text-muted-foreground">Calories</span>
                  <span className="font-bold">{Math.round(stats.caloriesBurned)}</span>
                </div>
                <div className="bg-primary/10 rounded-lg p-3 flex flex-col items-center">
                  <Calendar className="h-5 w-5 text-primary mb-1" />
                  <span className="text-xs text-muted-foreground">Duration</span>
                  <span className="font-bold">{stats.duration}</span>
                </div>
                <div className="bg-primary/10 rounded-lg p-3 flex flex-col items-center">
                  <CheckCircle className="h-5 w-5 text-primary mb-1" />
                  <span className="text-xs text-muted-foreground">Exercises</span>
                  <span className="font-bold">{stats.exercisesCompleted}</span>
                </div>
              </motion.div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="flex justify-center mb-4"
              >
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <motion.div
                      key={star}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.7 + star * 0.1 }}
                    >
                      <Star className="h-6 w-6 text-yellow-500 fill-yellow-500" />
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 1.2 }}>
                <Button onClick={onClose} className="w-full bg-primary hover:bg-primary/90">
                  Continue
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
