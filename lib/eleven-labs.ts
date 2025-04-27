// Eleven Labs Voice API integration with robust fallback
export async function generateSpeech(text: string): Promise<ArrayBuffer | null> {
  try {
    const API_KEY = "sk_f4648109bf69178e7f2eeced6a4515c2fd0ca337d6138adf"
    const VOICE_ID = "21m00Tcm4TlvDq8ikWAM" // Default voice - Rachel (natural female voice)

    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`, {
      method: "POST",
      headers: {
        Accept: "audio/mpeg",
        "Content-Type": "application/json",
        "xi-api-key": API_KEY,
      },
      body: JSON.stringify({
        text: text,
        model_id: "eleven_monolingual_v1",
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
        },
      }),
    })

    if (!response.ok) {
      console.error("Eleven Labs API error:", await response.text())
      return null
    }

    return await response.arrayBuffer()
  } catch (error) {
    console.error("Error generating speech:", error)
    return null
  }
}

// Cache for storing audio to avoid repeated API calls
const audioCache = new Map<string, ArrayBuffer>()

export async function getCachedSpeech(text: string): Promise<ArrayBuffer | null> {
  // Check if we already have this text in cache
  if (audioCache.has(text)) {
    return audioCache.get(text) || null
  }

  // Generate new speech
  const audioData = await generateSpeech(text)

  // Cache the result if successful
  if (audioData) {
    audioCache.set(text, audioData)
  }

  return audioData
}

// Function to check if Eleven Labs is available
let isElevenLabsAvailable = true

export function setElevenLabsAvailability(available: boolean) {
  isElevenLabsAvailable = available
}

export function getElevenLabsAvailability(): boolean {
  return isElevenLabsAvailable
}
