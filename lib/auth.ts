import { currentUser } from "@clerk/nextjs/server"
import prisma from "@/lib/prisma"

export async function getCurrentUser() {
    const clerkUser = await currentUser()

    if (!clerkUser) {
        return null
    }

    const email = clerkUser.emailAddresses[0]?.emailAddress

    if (!email) {
        return null
    }

    // Try to find existing user
    let user = null; // Declare user outside the try block if it needs to be accessed later
    try {
        user = await prisma.user.findUnique({
            where: { email },
        })

        if (user) {
            return user
        }
    } catch (error) {
        console.error("Error fetching user from DB:", error)
        // Fallback: If DB is unreachable, we treat it as no user found (or handled by caller)
        // This prevents the entire app from 500ing on flaky connections
        return null
    }

    // If not, create new user
    try {
        const newUser = await prisma.user.create({
            data: {
                id: clerkUser.id, // Use Clerk ID as Prisma ID for easy linking
                email,
                name: `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim() || undefined,
                image: clerkUser.imageUrl,
            },
        })
        return newUser
    } catch (error) {
        console.error("Error creating user:", error)
        return null
    }
}
