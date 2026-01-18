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
        console.warn("⚠️ SQLite Load Error: Using transient session.", error)

        // Return a temporary user object so the app doesn't crash or loop
        // This allows access to pages, but data saving might still fail if DB remains down
        return {
            id: clerkUser.id,
            email: email,
            name: `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim() || "Guest",
            image: clerkUser.imageUrl,
            fitnessGoal: null,
            age: null,
            height: null,
            weight: null,
            workoutDays: [],
            dietaryPreferences: [],
            createdAt: new Date(),
            updatedAt: new Date(),
            targetWeight: null,
            activityLevel: null,
            gender: null
        } as any // Cast to any to satisfy Prisma User type if needed, or Partial<User>
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
