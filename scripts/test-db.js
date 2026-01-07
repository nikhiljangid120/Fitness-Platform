const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const prisma = new PrismaClient();

async function main() {
    console.log("Testing database connection...");
    console.log("URL:", process.env.DATABASE_URL ? "Found (Hidden)" : "Missing");

    try {
        await prisma.$connect();
        console.log("✅ Successfully connected to the database!");

        const userCount = await prisma.user.count();
        console.log(`Current user count: ${userCount}`);
    } catch (error) {
        console.error("❌ Connection failed!");
        console.error(error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
