"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Volume2, VolumeX, Play, Pause } from "lucide-react"

interface TextToSpeechProps {
  text: string
  autoPlay?: boolean
}

export default function TextToSpeech({ text, autoPlay = false }: TextToSpeechProps) {
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [utterance, setUtterance] = useState<SpeechSynthesisUtterance | null>(null)

  useEffect(() => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      const newUtterance = new SpeechSynthesisUtterance(text)

      // Set voice (optional)
      const voices = window.speechSynthesis.getVoices()
      if (voices.length > 0) {
        // Try to find a female voice for the fitness coach
        const femaleVoice = voices.find((voice) => voice.name.includes("female") || voice.name.includes("Female"))
        if (femaleVoice) {
          newUtterance.voice = femaleVoice
        }
      }

      // Set other properties
      newUtterance.rate = 1.0
      newUtterance.pitch = 1.0

      // Event handlers
      newUtterance.onend = () => {
        setIsSpeaking(false)
      }

      setUtterance(newUtterance)

      // Auto-play if enabled
      if (autoPlay && !isMuted) {
        window.speechSynthesis.speak(newUtterance)
        setIsSpeaking(true)
      }
    }

    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel()
      }
    }
  }, [text, autoPlay, isMuted])

  // Handle voice list change
  useEffect(() => {
    const handleVoicesChanged = () => {
      if (utterance) {
        const voices = window.speechSynthesis.getVoices()
        const femaleVoice = voices.find((voice) => voice.name.includes("female") || voice.name.includes("Female"))
        if (femaleVoice) {
          utterance.voice = femaleVoice
        }
      }
    }

    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.addEventListener("voiceschanged", handleVoicesChanged)
      return () => {
        window.speechSynthesis.removeEventListener("voiceschanged", handleVoicesChanged)
      }
    }
  }, [utterance])

  const toggleSpeech = () => {
    if (!utterance || isMuted) return

    if (isSpeaking) {
      window.speechSynthesis.cancel()
      setIsSpeaking(false)
    } else {
      window.speechSynthesis.speak(utterance)
      setIsSpeaking(true)
    }
  }

  const toggleMute = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel()
      setIsSpeaking(false)
    }
    setIsMuted(!isMuted)
  }

  if (!utterance) return null

  return (
    <div className="flex items-center gap-2">
      <Button onClick={toggleSpeech} variant="outline" size="sm" disabled={isMuted} className="flex items-center gap-1">
        {isSpeaking ? (
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
      <Button onClick={toggleMute} variant="ghost" size="sm" className="flex items-center">
        {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
      </Button>
    </div>
  )
}
