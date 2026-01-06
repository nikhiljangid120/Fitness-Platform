"use server"

import { getCurrentUser } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { generateAIResponse } from "@/lib/gemini-ai"
import { revalidatePath } from "next/cache"

export async function generateWeeklyPlan() {
    const user = await getCurrentUser()

    if (!user) {
        return { success: false, error: "Authentication required" }
    }

    try {
        // 1. Construct prompt based on user profile
        const prompt = `
      Act as an expert fitness trainer. Create a 7-day workout plan for a user with the following profile:
      - Goal: ${user.fitnessGoal || "General Fitness"}
      - Current Weight: ${user.weight || "Unknown"}kg
      - Height: ${user.height || "Unknown"}cm
      
      Return ONLY valid JSON. The format must be an array of 7 objects, where each object represents a day:
      [
        {
          "day": "Monday",
          "workout": {
            "title": "Upper Body Power",
            "description": "Focus on chest and back compund movements",
            "duration": "45 min",
            "level": "Intermediate",
            "equipment": ["Dumbbells", "Bench"]
          },
          "rest": false
        },
        ...
      ]
      
      If it's a rest day, set "rest": true and "workout": null.
      Do not include markdown formatting like \`\`\`json. Just the raw JSON string.
    `

        console.log("Generating plan for user:", user.email)

        // 2. Call Gemini
        const aiResponse = await generateAIResponse(prompt)

        // 3. Parse JSON safely
        let planData
        try {
            // Clean up potential markdown code blocks if Gemini ignores instruction
            const cleanedJson = aiResponse.replace(/```json/g, "").replace(/```/g, "").trim()
            planData = JSON.parse(cleanedJson)
        } catch (e) {
            console.warn("Failed to parse AI JSON, falling back to text save", e)
            // In a real app, we'd retry or have a robust fallback.
            // For now, let's error out to trigger a retry or manual check
            return { success: false, error: "Failed to generate valid plan format" }
        }

        // 4. Save to DB
        const plan = await prisma.workoutPlan.create({
            data: {
                userId: user.id,
                planData: planData
            }
        })

        revalidatePath("/my-plan")
        return { success: true, plan }

    } catch (error) {
        console.error("Error generating plan:", error)
        return { success: false, error: "Failed to generate plan" }
    }
}

export async function getLatestPlan() {
    const user = await getCurrentUser()
    if (!user) return null

    const plan = await prisma.workoutPlan.findFirst({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' }
    })

    return plan
}
