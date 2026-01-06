import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
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
    console.log({ user })
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
