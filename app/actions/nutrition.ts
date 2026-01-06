"use server"

import { getCurrentUser } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { generateAIResponse } from "@/lib/gemini-ai"
import { revalidatePath } from "next/cache"

export async function generateMealPlan() {
    const user = await getCurrentUser()

    if (!user) {
        return { success: false, error: "Authentication required" }
    }

    try {
        // 1. Construct prompt
        const prompt = `
      Act as an expert nutritionist. Create a 1-day sample meal plan for a user with:
      - Goal: ${user.fitnessGoal || "General Health"}
      - Current Weight: ${user.weight || "Unknown"}kg
      - Target Weight: ${user.targetWeight || "Unknown"}kg
      
      Return ONLY valid JSON. The structure must be exactly:
      {
        "title": "High Protein Balanced Day",
        "calories": 2200,
        "diet": "Balanced",
        "description": "A mix of complex carbs and lean proteins.",
        "meals": {
          "breakfast": [
             { "title": "Oatmeal with Whey", "calories": 450, "ingredients": ["Oats", "Whey Protein", "Berries"] }
          ],
          "lunch": [
             { "title": "Chicken Quinoa Bowl", "calories": 600, "ingredients": ["Chicken Breast", "Quinoa", "Veggies"] }
          ],
          "dinner": [
             { "title": "Salmon and Asparagus", "calories": 550, "ingredients": ["Salmon", "Asparagus", "Sweet Potato"] }
          ],
          "snacks": [
             { "title": "Greek Yogurt", "calories": 200, "ingredients": ["Greek Yogurt", "Honey"] }
          ]
        }
      }
      
      Do not include markdown. Just key-values.
    `

        console.log("Generating meal plan for:", user.email)

        // 2. Call Gemini
        const aiResponse = await generateAIResponse(prompt)

        // 3. Parse JSON
        let planData
        try {
            const cleanedJson = aiResponse.replace(/```json/g, "").replace(/```/g, "").trim()
            planData = JSON.parse(cleanedJson)
        } catch (e) {
            console.warn("JSON Parse Error", e)
            return { success: false, error: "Failed to parse AI response" }
        }

        // 4. Save to DB
        const plan = await prisma.mealPlan.create({
            data: {
                userId: user.id,
                planData: planData
            }
        })

        revalidatePath("/my-plan")
        return { success: true, plan }

    } catch (error) {
        console.error("Error generating meal plan:", error)
        return { success: false, error: "System Error" }
    }
}

export async function getLatestMealPlan() {
    const user = await getCurrentUser()
    if (!user) return null

    return await prisma.mealPlan.findFirst({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' }
    })
}
