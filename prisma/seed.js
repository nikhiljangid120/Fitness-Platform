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
