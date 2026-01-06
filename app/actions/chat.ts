"use server"

import { getCurrentUser } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"

// Get or create the standard "main" chat session for the user
// In a complex app, we might handle multiple threads, but for now we'll keep a single continuous history logic
// or create a new session per day/context. Let's stick to a single active session for simplicity.
export async function getOrCreateChatSession() {
    const user = await getCurrentUser()
    if (!user) return null

    // Find most recent active session
    let session = await prisma.chatSession.findFirst({
        where: { userId: user.id },
        orderBy: { updatedAt: 'desc' },
        include: { messages: { orderBy: { createdAt: 'asc' } } }
    })

    if (!session) {
        session = await prisma.chatSession.create({
            data: { userId: user.id, title: "Workout Assistant" },
            include: { messages: true }
        })
    }

    return session
}

export async function saveChatMessage(content: string, role: "user" | "assistant") {
    const user = await getCurrentUser()
    if (!user) return { success: false, error: "Unauthorized" }

    let session = await prisma.chatSession.findFirst({
        where: { userId: user.id },
        orderBy: { updatedAt: 'desc' }
    })

    if (!session) {
        session = await prisma.chatSession.create({
            data: { userId: user.id, title: "General Chat" }
        })
    }

    try {
        const message = await prisma.message.create({
            data: {
                sessionId: session.id,
                role: role === "assistant" ? "model" : "user", // Map "assistant" to "model" for DB consistency if needed, or keep as is. Schema said "role" string.
                // Let's stick to "user" and "assistant" for consistency with frontend, or map if schema restricts.
                // Schema comment said "user" | "model". Let's map "assistant" -> "model".
                content,
            }
        })

        // Update session timestamp
        await prisma.chatSession.update({
            where: { id: session.id },
            data: { updatedAt: new Date() }
        })

        return { success: true, message }
    } catch (error) {
        console.error("Failed to save message:", error)
        return { success: false, error: "Database Error" }
    }
}

export async function clearChatHistory() {
    const user = await getCurrentUser()
    if (!user) return

    // Delete all sessions for user? Or just messages?
    // Let's delete all sessions
    await prisma.chatSession.deleteMany({
        where: { userId: user.id }
    })

    revalidatePath("/ai-trainer")
}
