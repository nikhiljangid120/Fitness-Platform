// Speech synthesis utility functions with improved reliability

// Flag to track if speech synthesis is available and ready
let isSpeechSynthesisReady = false
let isVoicesLoaded = false
let hasUserInteracted = false

// Cache for storing synthesized speech to avoid repeated processing
const voiceCache = new Map<string, SpeechSynthesisVoice | null>()

// Check if speech synthesis is available
export function isSpeechAvailable(): boolean {
  return (
    typeof window !== "undefined" &&
    window.speechSynthesis !== undefined &&
    window.SpeechSynthesisUtterance !== undefined
  )
}

// Set user interaction flag
export function setUserInteracted() {
  hasUserInteracted = true
}

// Get the best available voice for fitness coaching
export function getBestVoice(): SpeechSynthesisVoice | null {
  // Check if we've already found the best voice
  if (voiceCache.has("best-voice")) {
    return voiceCache.get("best-voice") || null
  }

  if (!isSpeechAvailable()) {
    console.warn("Speech synthesis not supported in this browser")
    voiceCache.set("best-voice", null)
    return null
  }

  try {
    // Get all available voices
    const voices = window.speechSynthesis.getVoices()

    if (!voices || voices.length === 0) {
      // Voices might not be loaded yet
      voiceCache.set("best-voice", null)
      return null
    }

    // Try to find an English voice first (preferably female)
    let bestVoice = voices.find(
      (voice) =>
        voice.lang.startsWith("en") &&
        (voice.name.toLowerCase().includes("female") ||
          voice.name.toLowerCase().includes("samantha") ||
          voice.name.toLowerCase().includes("karen")),
    )

    // If no specific voice found, just use any English voice
    if (!bestVoice) {
      bestVoice = voices.find((voice) => voice.lang.startsWith("en"))
    }

    // If no English voice, use default voice
    if (!bestVoice && voices.length > 0) {
      bestVoice = voices[0]
    }

    // Cache the result
    voiceCache.set("best-voice", bestVoice || null)
    return bestVoice
  } catch (error) {
    console.error("Error getting voices:", error)
    voiceCache.set("best-voice", null)
    return null
  }
}

// Force speech synthesis to be ready
export function forceSpeechSynthesisReady() {
  if (!isSpeechAvailable()) return false

  try {
    // Create a silent utterance to initialize the speech synthesis
    const utterance = new SpeechSynthesisUtterance("")
    utterance.volume = 0
    window.speechSynthesis.speak(utterance)
    window.speechSynthesis.cancel()

    isSpeechSynthesisReady = true
    return true
  } catch (error) {
    console.error("Error forcing speech synthesis ready:", error)
    return false
  }
}

// Replace the speakText function with this improved version
export function speakText(
  text: string,
  options: {
    rate?: number
    pitch?: number
    volume?: number
    onStart?: () => void
    onEnd?: () => void
    onError?: (error: any) => void
    fallbackToConsole?: boolean
  } = {},
): boolean {
  // Default to fallback if not specified
  const fallbackToConsole = options.fallbackToConsole !== false

  // Check if speech synthesis is available
  if (!isSpeechAvailable()) {
    console.warn("Speech synthesis not supported in this browser")
    if (fallbackToConsole) console.log(`Speech (fallback): ${text}`)
    if (options.onError) options.onError(new Error("Speech synthesis not supported"))
    if (options.onEnd) options.onEnd()
    return false
  }

  // Force speech synthesis to be ready if it's not
  if (!isSpeechSynthesisReady) {
    forceSpeechSynthesisReady()
  }

  try {
    // Cancel any ongoing speech
    window.speechSynthesis.cancel()

    const utterance = new SpeechSynthesisUtterance(text)

    // Set voice
    const voice = getBestVoice()
    if (voice) {
      utterance.voice = voice
    }

    // Set speech properties with defaults
    utterance.rate = options.rate ?? 1.0
    utterance.pitch = options.pitch ?? 1.1 // Slightly higher pitch for female voice
    utterance.volume = options.volume ?? 1.0

    // Set event handlers
    utterance.onstart = () => {
      if (options.onStart) options.onStart()
    }

    utterance.onend = () => {
      if (options.onEnd) options.onEnd()
    }

    // Handle errors
    utterance.onerror = (event) => {
      console.warn("Speech synthesis error:", event)
      if (fallbackToConsole) console.log(`Speech (fallback): ${text}`)
      if (options.onError) options.onError(event)
      if (options.onEnd) options.onEnd()
    }

    // Use a try-catch block for the speak call
    try {
      window.speechSynthesis.speak(utterance)
    } catch (error) {
      console.error("Error in speechSynthesis.speak:", error)
      if (fallbackToConsole) console.log(`Speech (fallback - speak error): ${text}`)
      if (options.onError) options.onError(error)
      if (options.onEnd) options.onEnd()
      return false
    }

    // Add a safety timeout to ensure onEnd is called even if speech synthesis fails
    // Calculate timeout based on text length and speech rate
    const timeoutDuration = Math.max(2000, (text.length * 100) / (options.rate || 1))

    const safetyTimeout = setTimeout(() => {
      // Check if the utterance is still speaking
      if (window.speechSynthesis.speaking) {
        // If it's still speaking after the timeout, it might be stuck
        window.speechSynthesis.cancel()
        if (options.onError) options.onError(new Error("Speech synthesis timeout"))
        if (options.onEnd) options.onEnd()
      }
    }, timeoutDuration)

    // Clear the timeout when speech ends normally
    const originalOnEnd = utterance.onend
    utterance.onend = (event) => {
      clearTimeout(safetyTimeout)
      if (originalOnEnd) originalOnEnd.call(utterance, event)
    }

    return true
  } catch (error) {
    console.error("Error speaking text:", error)
    if (fallbackToConsole) console.log(`Speech (fallback - error): ${text}`)
    if (options.onError) options.onError(error)
    if (options.onEnd) options.onEnd()
    return false
  }
}

// Add this new function to ensure speech is synchronized with visual elements
export function speakWithTiming(text: string, durationMs: number, options: any = {}): boolean {
  // Calculate appropriate speech rate based on text length and desired duration
  const averageCharactersPerSecond = 15 // Average reading speed
  const textLength = text.length
  const naturalDurationMs = (textLength / averageCharactersPerSecond) * 1000

  // Adjust rate to match desired duration
  const rate = naturalDurationMs / durationMs

  // Ensure rate is within reasonable bounds (0.1 to 2.0)
  const boundedRate = Math.max(0.1, Math.min(2.0, rate))

  return speakText(text, {
    ...options,
    rate: boundedRate,
  })
}

// Initialize voices as soon as possible
export function initVoices(): void {
  if (!isSpeechAvailable()) {
    console.warn("Speech synthesis not available in this browser")
    return
  }

  try {
    // Try to load voices immediately
    const voices = window.speechSynthesis.getVoices()
    if (voices && voices.length > 0) {
      isVoicesLoaded = true
      isSpeechSynthesisReady = true
      getBestVoice() // This will cache the best voice
    }

    // Set up event listener for when voices are loaded
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = () => {
        isVoicesLoaded = true
        isSpeechSynthesisReady = true
        getBestVoice() // This will cache the best voice
      }
    } else {
      // If onvoiceschanged is not supported, we'll assume it's ready after a delay
      setTimeout(() => {
        isSpeechSynthesisReady = true
      }, 1000)
    }

    // Set ready flag after a timeout as a fallback
    setTimeout(() => {
      isSpeechSynthesisReady = true
      // Force initialization
      forceSpeechSynthesisReady()
    }, 2000)
  } catch (error) {
    console.error("Error initializing voices:", error)
  }
}

// Create a beep/whistle sound
export function playWhistle(options: { volume?: number; frequency?: number; duration?: number } = {}) {
  if (typeof window === "undefined" || !window.AudioContext) {
    console.warn("AudioContext not supported in this browser")
    return false
  }

  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()

    // Configure oscillator
    oscillator.type = "sine"
    oscillator.frequency.value = options.frequency || 800 // Default whistle frequency

    // Configure gain (volume)
    gainNode.gain.value = options.volume || 0.5

    // Connect nodes
    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)

    // Start and stop the sound
    oscillator.start()

    // Apply envelope for smoother sound
    gainNode.gain.setValueAtTime(0, audioContext.currentTime)
    gainNode.gain.linearRampToValueAtTime(options.volume || 0.5, audioContext.currentTime + 0.05)
    gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + (options.duration || 0.5))

    setTimeout(
      () => {
        oscillator.stop()
        audioContext.close()
      },
      (options.duration || 0.5) * 1000,
    )

    return true
  } catch (error) {
    console.error("Error playing whistle sound:", error)
    return false
  }
}

// Function to preload and initialize speech synthesis
export function preloadSpeechSynthesis() {
  if (!isSpeechAvailable()) return false

  try {
    // Force voices to load
    initVoices()

    // Create and immediately cancel a silent utterance to "warm up" the speech engine
    const utterance = new SpeechSynthesisUtterance("")
    utterance.volume = 0
    window.speechSynthesis.speak(utterance)
    window.speechSynthesis.cancel()

    // Preload common phrases by creating (but not speaking) utterances
    const commonPhrases = ["3", "2", "1", "Go!", "Great job!", "Keep going!"]
    commonPhrases.forEach((phrase) => {
      const u = new SpeechSynthesisUtterance(phrase)
      // Just create the utterance, don't speak it
    })

    isSpeechSynthesisReady = true
    return true
  } catch (error) {
    console.error("Error preloading speech synthesis:", error)
    return false
  }
}
