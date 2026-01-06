require('dotenv').config();
const { execSync } = require('child_process');

console.log('Generating Prisma Client...');
console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'Loaded' : 'MISSING');

try {
    execSync('npx prisma generate', {
        stdio: 'inherit',
        env: { ...process.env }
    });
    console.log('✅ Client Generation Successful');
} catch (error) {
    console.error('❌ Client Generation Failed');
    process.exit(1);
}
