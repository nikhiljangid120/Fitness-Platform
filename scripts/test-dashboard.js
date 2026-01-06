const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    console.log('Testing Dashboard Data Fetching...')

    // 1. Fetch User (Alex)
    const user = await prisma.user.findUnique({
        where: { email: 'alex@example.com' }
    })

    if (!user) {
        console.error('❌ User not found')
        return
    }
    console.log('✅ User found:', user.name, user.email)
    console.log('Target Weight:', user.targetWeight) // Check if this field exists/works

    // 2. Fetch Workouts
    const workouts = await prisma.completedWorkout.findMany({
        where: { userId: user.id },
        orderBy: { completedAt: "desc" },
    })
    console.log('✅ Workouts found:', workouts.length)
    if (workouts.length > 0) {
        console.log('Latest workout:', workouts[0].title)
    }

    // 3. Fetch Progress
    const progress = await prisma.progress.findMany({
        where: { userId: user.id },
        orderBy: { date: "asc" },
    })
    console.log('✅ Progress entries:', progress.length)
    if (progress.length > 0) {
        console.log('First weight:', progress[0].weight)
        console.log('Last weight:', progress[progress.length - 1].weight)
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
