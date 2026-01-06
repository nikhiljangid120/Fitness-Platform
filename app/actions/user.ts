"use server"

import { getCurrentUser } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function saveOnboardingData(data: {
    name: string
    age: string
    gender: string
    height: string
    weight: string
    goal: string
    fitnessLevel: string
    workoutDays: string[]
    dietaryPreferences: string[]
}) {
    const user = await getCurrentUser()

    if (!user) {
        throw new Error("User not authenticated")
    }

    try {
        await prisma.user.update({
            where: { id: user.id },
            data: {
                name: data.name,
                age: parseInt(data.age) || null,
                gender: data.gender,
                height: parseFloat(data.height),
                weight: parseFloat(data.weight),
                fitnessGoal: data.goal,
                activityLevel: data.fitnessLevel,
                workoutDays: data.workoutDays,
                dietaryPreferences: data.dietaryPreferences,
            }
        })

        // Create an initial empty plan or trigger generation? 
        // For now just save profile so generating plan later works.

        revalidatePath("/dashboard")
        return { success: true }
    } catch (error) {
        console.error("Failed to save onboarding data:", error)
        return { success: false, error: "Failed to save profile" }
    }
}
