import Groq from "groq-sdk"

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || "dummy_key_for_build",
  dangerouslyAllowBrowser: true // Only if needed client-side, but this is server-side
})

export async function generateAIResponse(prompt: string): Promise<string> {
  console.log("Generating AI response with Groq...")

  if (!process.env.GROQ_API_KEY) {
    console.warn("GROQ_API_KEY is missing. Using fallback.")
    return getFallbackResponse(prompt)
  }

  try {
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are an expert fitness trainer and nutritionist. Always return valid JSON when requested. Avoid markdown formatting in JSON responses."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      model: "llama3-70b-8192", // Fast and capable
      temperature: 0.7,
      max_tokens: 4096,
    })

    const responseContent = completion.choices[0]?.message?.content || ""
    console.log("✅ Groq Response Received")
    return responseContent

  } catch (error) {
    console.error("❌ Groq API Error:", error)
    return getFallbackResponse(prompt)
  }
}

// Keep existing fallback logic for safety
function getFallbackResponse(prompt: string): string {
  console.log("Using fallback response system for prompt:", prompt)

  const promptLower = prompt.toLowerCase()
  let category = "general"

  if (promptLower.includes("workout") || promptLower.includes("exercise") || promptLower.includes("training")) {
    category = "workout"
  } else if (
    promptLower.includes("eat") ||
    promptLower.includes("food") ||
    promptLower.includes("nutrition") ||
    promptLower.includes("diet") ||
    promptLower.includes("meal")
  ) {
    category = "nutrition"
  } else if (promptLower.includes("stretch") || promptLower.includes("flexible") || promptLower.includes("mobility")) {
    category = "flexibility"
  } else if (
    promptLower.includes("weight loss") ||
    promptLower.includes("lose weight") ||
    promptLower.includes("fat") ||
    promptLower.includes("slim")
  ) {
    category = "weight_loss"
  } else if (
    promptLower.includes("muscle") ||
    promptLower.includes("strength") ||
    promptLower.includes("gain") ||
    promptLower.includes("bulk")
  ) {
    category = "muscle_gain"
  }

  // Simple JSON fallback if the prompt explicitly asks for JSON (detected by structure)
  if (prompt.includes("Return ONLY valid JSON")) {
    console.log("Detected JSON request in fallback mode")
    if (category === "nutrition") {
      return JSON.stringify({
        breakfast: "Oatmeal with berries",
        lunch: "Grilled chicken salad",
        dinner: "Salmon with quinoa",
        snack: "Greek yogurt"
      })
    }
    // ... extend for workouts if needed, or return error JSON
  }

  const responses: Record<string, string[]> = {
    workout: [
      "Here's a 20-minute HIIT workout you can do at home:\n\n1. Jumping jacks - 30 seconds\n2. Push-ups - 30 seconds\n3. Mountain climbers - 30 seconds\n4. Squats - 30 seconds\n\nRest for 15 seconds between exercises and repeat the circuit 4 times.",
    ],
    nutrition: [
      "For weight loss, focus on creating a calorie deficit by eating:\n\n• Plenty of protein (lean meats, eggs, legumes)\n• Fiber-rich vegetables\n• Complex carbs in moderation\n\nAim for 500 calories below your maintenance level for sustainable fat loss.",
    ],
    // ... keep it brief for now
    general: [
      "Consistency is key to fitness success. Start with small, achievable goals."
    ]
  }

  // Safety check
  const responseArray = responses[category] || responses["general"]
  const randomIndex = Math.floor(Math.random() * responseArray.length)
  return responseArray[randomIndex]
}
