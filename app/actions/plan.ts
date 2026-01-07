"use server"

import { getCurrentUser } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { generateAIResponse } from "@/lib/gemini-ai"
import { revalidatePath } from "next/cache"

export async function generateWeeklyPlan() {
    const user = await getCurrentUser()

    if (!user) {
        return { success: false, error: "Authentication required" }
    }

    try {
        // 1. Fetch User History for Adaptation
        const recentWorkouts = await prisma.completedWorkout.findMany({
            where: { userId: user.id },
            orderBy: { completedAt: 'desc' },
            take: 5
        })

        const historySummary = recentWorkouts.map((w: any) =>
            `- ${w.title}: Rated ${w.difficulty || "N/A"}/10 (${w.notes || "No notes"})`
        ).join("\n")

        // 2. Construct prompt based on user profile and history
        const prompt = `
      Act as an expert fitness trainer. Create a 7-day workout plan for a user with the following profile:
      - Goal: ${user.fitnessGoal || "General Fitness"}
      - Age: ${user.age || "Unknown"}
      - Gender: ${user.gender || "Unknown"}
      - Current Weight: ${user.weight || "Unknown"}kg
      - Height: ${user.height || "Unknown"}cm
      - Workout Days: ${user.workoutDays?.join(", ") || "Any"}
      - Dietary Preferences: ${user.dietaryPreferences?.join(", ") || "None"}
      
      RECENT FEEDBACK FROM USER (Adapt the plan based on this):
      ${historySummary || "No recent workout history."}
      
      Return ONLY valid JSON with this structure:
      {
        "weeklySummary": "A 2-sentence summary of the focus for this week (e.g., 'This week focuses on building upper body strength...').",
        "schedule": [
          {
            "day": "Monday",
            "workout": {
              "title": "Upper Body Power",
              "description": "Focus on chest and back compound movements",
              "duration": "45 min",
              "level": "Intermediate",
              "equipment": ["Dumbbells", "Bench"]
            },
            "rest": false
          },
          ...
        ]
      }
      
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

            // Normalize old array format to new object format if needed
            if (Array.isArray(planData)) {
                planData = {
                    weeklySummary: "Your personalized weekly workout plan.",
                    schedule: planData
                }
            }
        } catch (e) {
            console.warn("Failed to parse AI JSON, falling back to text save", e)
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
