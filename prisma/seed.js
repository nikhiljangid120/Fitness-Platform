const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
    console.log('Seeding database...')
    try {
        const user = await prisma.user.upsert({
            where: { email: 'alex@example.com' },
            update: {},
            create: {
                email: 'alex@example.com',
                name: 'Alex',
                fitnessGoal: 'WEIGHT_LOSS',
                weight: 75,
                height: 180,
                activityLevel: 'MODERATE',
            },
        })
        console.log('Created user:', user)

        // Create some completed workouts
        await prisma.completedWorkout.createMany({
            data: [
                { userId: user.id, workoutId: 'hiit-cardio-blast', title: 'HIIT Cardio Blast', duration: 1200, calories: 300, completedAt: new Date(Date.now() - 86400000 * 1) }, // Yesterday
                { userId: user.id, workoutId: 'strength-training', title: 'Full Body Strength', duration: 2700, calories: 450, completedAt: new Date(Date.now() - 86400000 * 3) }, // 3 days ago
                { userId: user.id, workoutId: 'yoga-flow', title: 'Morning Yoga', duration: 1800, calories: 150, completedAt: new Date(Date.now() - 86400000 * 5) }, // 5 days ago
            ]
        })
        console.log('Created workouts')

        // Create progress entries
        await prisma.progress.createMany({
            data: [
                { userId: user.id, weight: 80, date: new Date(Date.now() - 86400000 * 30) },
                { userId: user.id, weight: 79, date: new Date(Date.now() - 86400000 * 21) },
                { userId: user.id, weight: 77.5, date: new Date(Date.now() - 86400000 * 14) },
                { userId: user.id, weight: 76, date: new Date(Date.now() - 86400000 * 7) },
                { userId: user.id, weight: 75, date: new Date() },
            ]
        })
        console.log('Created progress')
    } catch (error) {
        console.error('Error seeding:', error)
        throw error
    }
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
