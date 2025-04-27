"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Volume2, VolumeX, Play, Pause, Loader2 } from "lucide-react"
import { initVoices, isSpeechAvailable, forceSpeechSynthesisReady, setUserInteracted } from "@/lib/speech-synthesis"
import { useToast } from "@/hooks/use-toast"

interface EnhancedTextToSpeechProps {
  text: string
  autoPlay?: boolean
  onPlayStateChange?: (isPlaying: boolean) => void
}

export default function EnhancedTextToSpeech({ text, autoPlay = false, onPlayStateChange }: EnhancedTextToSpeechProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isSpeechSupported, setIsSpeechSupported] = useState(true)
  const hasInteracted = useRef(false)
  const loadingTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)
  const { toast } = useToast()

  // Initialize voices when component mounts
  useEffect(() => {
    // Check if speech synthesis is supported
    const speechAvailable = isSpeechAvailable()
    setIsSpeechSupported(speechAvailable)

    if (speechAvailable) {
      initVoices()
      // Force speech synthesis to be ready
      setTimeout(() => {
        forceSpeechSynthesisReady()
      }, 1000)
    }

    return () => {
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current)
      }

      // Cancel any ongoing speech when component unmounts
      if (window.speechSynthesis && utteranceRef.current) {
        window.speechSynthesis.cancel()
      }
    }
  }, [])

  // Auto-play when text changes
  useEffect(() => {
    if (text && autoPlay && !isMuted && hasInteracted.current) {
      playAudio()
    }
  }, [text, autoPlay, isMuted])

  // Update parent component when play state changes
  useEffect(() => {
    if (onPlayStateChange) {
      onPlayStateChange(isPlaying)
    }
  }, [isPlaying, onPlayStateChange])

  // Memoize the playAudio function to avoid recreating it on every render
  const playAudio = useCallback(async () => {
    if (isMuted || !text || isPlaying || !isSpeechSupported) return

    try {
      setIsLoading(true)
      setIsPlaying(true)
      hasInteracted.current = true

      // Set a timeout to clear the loading state if it takes too long
      loadingTimeoutRef.current = setTimeout(() => {
        setIsLoading(false)
        setIsPlaying(false)
      }, 3000) // 3 seconds timeout

      // Try to use speech synthesis, but handle errors gracefully
      try {
        if (typeof window !== "undefined" && window.speechSynthesis) {
          // Cancel any ongoing speech first
          window.speechSynthesis.cancel()

          const utterance = new SpeechSynthesisUtterance(text)
          utteranceRef.current = utterance

          // Get available voices
          const voices = window.speechSynthesis.getVoices()

          // Try to find a female voice for the fitness coach
          if (voices && voices.length > 0) {
            const femaleVoice = voices.find(
              (voice) => voice.name.toLowerCase().includes("female") || voice.name.toLowerCase().includes("samantha"),
            )

            if (femaleVoice) {
              utterance.voice = femaleVoice
            }
          }

          utterance.rate = 1.0
          utterance.pitch = 1.1 // Slightly higher pitch for female voice

          utterance.onstart = () => {
            // Clear the timeout when speech starts
            if (loadingTimeoutRef.current) {
              clearTimeout(loadingTimeoutRef.current)
              loadingTimeoutRef.current = null
            }
            setIsLoading(false)
          }

          utterance.onend = () => {
            if (loadingTimeoutRef.current) {
              clearTimeout(loadingTimeoutRef.current)
            }
            setIsPlaying(false)
            setIsLoading(false)
            utteranceRef.current = null
          }

          utterance.onerror = () => {
            if (loadingTimeoutRef.current) {
              clearTimeout(loadingTimeoutRef.current)
            }
            setIsPlaying(false)
            setIsLoading(false)
            utteranceRef.current = null
          }

          window.speechSynthesis.speak(utterance)
        } else {
          // Fallback if speech synthesis is not available
          setTimeout(() => {
            if (loadingTimeoutRef.current) {
              clearTimeout(loadingTimeoutRef.current)
            }
            setIsPlaying(false)
            setIsLoading(false)
          }, 1000)
        }
      } catch (error) {
        console.error("Error with speech synthesis:", error)
        if (loadingTimeoutRef.current) {
          clearTimeout(loadingTimeoutRef.current)
        }
        setIsPlaying(false)
        setIsLoading(false)
      }
    } catch (error) {
      console.error("Error playing audio:", error)
      setIsPlaying(false)
      setIsLoading(false)
    }
  }, [isMuted, text, isPlaying, isSpeechSupported])

  const stopAudio = useCallback(() => {
    if (window.speechSynthesis) {
      try {
        window.speechSynthesis.cancel()
      } catch (error) {
        console.error("Error canceling speech:", error)
      }
    }

    if (loadingTimeoutRef.current) {
      clearTimeout(loadingTimeoutRef.current)
    }

    setIsPlaying(false)
    setIsLoading(false)
    utteranceRef.current = null
  }, [])

  const togglePlay = useCallback(() => {
    hasInteracted.current = true
    setUserInteracted() // Mark that user has interacted with the page

    if (isPlaying) {
      stopAudio()
    } else {
      playAudio()
    }
  }, [isPlaying, stopAudio, playAudio])

  const toggleMute = useCallback(() => {
    hasInteracted.current = true
    setUserInteracted() // Mark that user has interacted with the page

    if (isPlaying) {
      stopAudio()
    }
    setIsMuted(!isMuted)

    toast({
      title: isMuted ? "Audio unmuted" : "Audio muted",
      description: isMuted ? "Voice guidance is now turned on" : "Voice guidance is now turned off",
    })
  }, [isPlaying, isMuted, stopAudio, toast])

  // If speech synthesis is not supported, don't render the component
  if (!isSpeechSupported) {
    return null
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        onClick={togglePlay}
        variant="outline"
        size="sm"
        disabled={isMuted || isLoading}
        className="flex items-center gap-1 btn-modern hardware-accelerated"
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="sr-only md:not-sr-only md:inline-block">Loading</span>
          </>
        ) : isPlaying ? (
          <>
            <Pause className="h-4 w-4" />
            <span className="sr-only md:not-sr-only md:inline-block">Stop</span>
          </>
        ) : (
          <>
            <Play className="h-4 w-4" />
            <span className="sr-only md:not-sr-only md:inline-block">Listen</span>
          </>
        )}
      </Button>
      <Button
        onClick={toggleMute}
        variant="ghost"
        size="sm"
        className="flex items-center btn-modern hardware-accelerated"
      >
        {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
      </Button>
    </div>
  )
}
