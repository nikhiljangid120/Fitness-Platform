"use server"

import { getCurrentUser } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"

interface SaveWorkoutParams {
    workoutId: string
    title: string
    duration: number
    calories: number
    difficulty?: number
    notes?: string
}

export async function saveWorkout(params: SaveWorkoutParams) {
    const user = await getCurrentUser()

    if (!user) {
        return { success: false, error: "User not authenticated" }
    }

    try {
        await prisma.completedWorkout.create({
            data: {
                userId: user.id,
                workoutId: params.workoutId,
                title: params.title,
                duration: params.duration,
                calories: params.calories,
                difficulty: params.difficulty,
                notes: params.notes,
            },
        })

        // Optional: Update user stats or progress if needed?
        // calories are stored in CompletedWorkout, so we can aggregate them later.

        revalidatePath("/my-plan") // Update dashboard
        revalidatePath("/workouts")

        return { success: true }
    } catch (error) {
        console.error("Error saving workout:", error)
        return { success: false, error: "Failed to save workout" }
    }
}
