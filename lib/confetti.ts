// Simple wrapper for canvas-confetti to handle cases where it might not be available
// This helps prevent errors in environments where the library isn't loaded

type ConfettiOptions = {
  particleCount?: number
  angle?: number
  spread?: number
  startVelocity?: number
  decay?: number
  gravity?: number
  drift?: number
  ticks?: number
  origin?: {
    x?: number
    y?: number
  }
  colors?: string[]
  shapes?: string[]
  scalar?: number
  zIndex?: number
  disableForReducedMotion?: boolean
}

// Function to safely run confetti
export function runConfetti(options: ConfettiOptions = {}): void {
  // Check if we're in a browser environment
  if (typeof window === "undefined") return

  try {
    // Try to dynamically import confetti
    import("canvas-confetti")
      .then((confettiModule) => {
        const confetti = confettiModule.default
        confetti(options)
      })
      .catch((error) => {
        console.error("Failed to load confetti:", error)
      })
  } catch (error) {
    console.error("Error running confetti:", error)
  }
}

// Function to run a confetti cannon
export function runConfettiCannon(): void {
  const duration = 3 * 1000
  const animationEnd = Date.now() + duration
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 }

  function randomInRange(min: number, max: number) {
    return Math.random() * (max - min) + min
  }

  // Set an interval to launch confetti
  const interval: any = setInterval(() => {
    const timeLeft = animationEnd - Date.now()

    if (timeLeft <= 0) {
      return clearInterval(interval)
    }

    const particleCount = 50 * (timeLeft / duration)

    // Since particles fall down, start a bit higher than random
    runConfetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.1, 0.3), y: randomInRange(0.1, 0.3) },
    })

    runConfetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.7, 0.9), y: randomInRange(0.1, 0.3) },
    })
  }, 250)
}
