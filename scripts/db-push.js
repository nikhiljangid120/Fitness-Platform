require('dotenv').config();
const { execSync } = require('child_process');

console.log('Pushing schema to DB...');
console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'Loaded (starts with postgresql://)' : 'MISSING');

try {
    execSync('npx prisma db push', {
        stdio: 'inherit',
        env: { ...process.env }
    });
    console.log('✅ DB Push Successful');
} catch (error) {
    console.error('❌ DB Push Failed');
    process.exit(1);
}
