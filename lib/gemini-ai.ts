"use server"

import Groq from "groq-sdk"
import { GoogleGenerativeAI } from "@google/generative-ai"

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || "dummy_key_for_build",
  dangerouslyAllowBrowser: true
})

export async function generateAIResponse(prompt: string): Promise<string> {
  console.log("Generating AI response (v2)...")

  // 1. Try Groq (Fastest) - Only if key is clearly present and not dummy
  if (process.env.GROQ_API_KEY && process.env.GROQ_API_KEY.length > 20) {
    try {
      console.log("Attempting Groq...")
      const completion = await groq.chat.completions.create({
        messages: [
          { role: "system", content: "You are an expert fitness trainer named FlexForge Coach. Keep your answers concise, motivating, and to the point. Avoid long lectures. Use simple formatting. Only return JSON if specifically asked for a workout or meal plan structure." },
          { role: "user", content: prompt }
        ],
        model: "llama-3.3-70b-versatile",
        temperature: 0.7,
      })
      const content = completion.choices[0]?.message?.content || ""
      if (content) return content
    } catch (error) {
      console.warn("Groq failed, trying fallback...", error)
    }
  } else {
    console.log("GROQ_API_KEY missing or invalid, skipping to Gemini...")
  }

  // 2. Try Google Gemini (Backup)
  if (process.env.NEXT_PUBLIC_GEMINI_API_KEY) {
    try {
      console.log("Attempting Gemini...")
      const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY)
      const model = genAI.getGenerativeModel({ model: "gemini-pro" })

      const result = await model.generateContent(prompt)
      const response = await result.response
      const text = response.text()
      if (text) return text
    } catch (error) {
      console.warn("Gemini failed, using hardcoded fallback...", error)
    }
  }

  // 3. Hardcoded Fallback
  return getFallbackResponse(prompt)
}

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
  }

  // Simple JSON fallback if the prompt explicitly asks for JSON
  if (prompt.includes("Return ONLY valid JSON")) {
    console.log("Detected JSON request in fallback mode")
    if (category === "nutrition") {
      return JSON.stringify({
        breakfast: "Oatmeal with berries",
        lunch: "Grilled chicken salad",
        dinner: "Salmon with quinoa",
        snack: "Greek yogurt"
      })
    } else if (category === "workout") {
      return JSON.stringify([
        {
          "day": "Monday",
          "workout": {
            "title": "Full Body Circuit",
            "description": "A comprehensive full-body workout",
            "duration": "45 min",
            "level": "Beginner",
            "equipment": ["None"],
            "exercises": []
          },
          "rest": false
        },
        { "day": "Tuesday", "workout": null, "rest": true },
        { "day": "Wednesday", "workout": null, "rest": true },
        { "day": "Thursday", "workout": null, "rest": true },
        { "day": "Friday", "workout": null, "rest": true },
        { "day": "Saturday", "workout": null, "rest": true },
        { "day": "Sunday", "workout": null, "rest": true }
      ])
    }
  }

  const responses: Record<string, string[]> = {
    workout: [
      "Here's a 20-minute HIIT workout you can do at home:\n\n1. Jumping jacks - 30 seconds\n2. Push-ups - 30 seconds\n3. Mountain climbers - 30 seconds\n4. Squats - 30 seconds\n\nRest for 15 seconds between exercises and repeat the circuit 4 times.",
    ],
    nutrition: [
      "For weight loss, focus on creating a calorie deficit by eating:\n\n• Plenty of protein (lean meats, eggs, legumes)\n• Fiber-rich vegetables\n• Complex carbs in moderation\n\nAim for 500 calories below your maintenance level for sustainable fat loss.",
    ],
    general: [
      "Consistency is key to fitness success. Start with small, achievable goals."
    ]
  }

  const responseArray = responses[category] || responses["general"]
  const randomIndex = Math.floor(Math.random() * responseArray.length)
  return responseArray[randomIndex]
}
