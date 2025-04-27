"use client"

import { useEffect, useRef } from "react"
import { Dumbbell } from "lucide-react"

export default function WorkoutAnimation() {
  const containerRef = useRef<HTMLDivElement>(null)
  const figureRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // This is a more advanced animation since we can't use Lottie directly
    const container = containerRef.current
    const figure = figureRef.current
    if (!container || !figure) return

    let animationFrame: number
    let time = 0

    const animate = () => {
      time += 0.02

      // Animate the figure
      if (figure) {
        // Simulate a workout motion
        const yPos = Math.sin(time * 2) * 15
        const rotation = Math.sin(time * 3) * 5
        figure.style.transform = `translateY(${yPos}px) rotate(${rotation}deg)`
      }

      animationFrame = requestAnimationFrame(animate)
    }

    animationFrame = requestAnimationFrame(animate)

    // Create animated particles
    const createParticle = () => {
      if (!container) return

      const particle = document.createElement("div")
      particle.className = "absolute rounded-full bg-primary/20"

      // Random size
      const size = Math.random() * 20 + 10
      particle.style.width = `${size}px`
      particle.style.height = `${size}px`

      // Random position
      particle.style.left = `${Math.random() * 100}%`
      particle.style.top = `${Math.random() * 100}%`

      // Animation
      particle.animate(
        [
          { opacity: 0, transform: "scale(0)" },
          { opacity: 0.5, transform: "scale(1)" },
          { opacity: 0, transform: "scale(0)" },
        ],
        {
          duration: Math.random() * 2000 + 1000,
          easing: "ease-out",
        },
      )

      container.appendChild(particle)

      // Remove after animation
      setTimeout(() => {
        if (container.contains(particle)) {
          container.removeChild(particle)
        }
      }, 3000)
    }

    // Create particles periodically
    const particleInterval = setInterval(createParticle, 300)

    return () => {
      cancelAnimationFrame(animationFrame)
      clearInterval(particleInterval)
    }
  }, [])

  return (
    <div className="relative w-full max-w-md h-[400px] flex items-center justify-center overflow-hidden">
      {/* Animated background */}
      <div
        ref={containerRef}
        className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-3xl"
      ></div>

      {/* Main animated figure */}
      <div ref={figureRef} className="relative z-10 transition-transform duration-300 ease-in-out">
        <div className="relative">
          <Dumbbell className="h-32 w-32 text-primary" />

          {/* Animated energy rings */}
          <div className="absolute inset-0 rounded-full border-4 border-primary/30 animate-ping"></div>
          <div className="absolute inset-0 rounded-full border-2 border-primary/20 animate-ping animation-delay-500"></div>
        </div>
      </div>

      {/* FlexForge text */}
      <div className="absolute bottom-10 left-0 right-0 text-center">
        <div className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-600 to-red-600">
          FLEX FORGE
        </div>
        <div className="text-sm text-muted-foreground mt-2">TRANSFORM YOUR BODY</div>
      </div>
    </div>
  )
}
