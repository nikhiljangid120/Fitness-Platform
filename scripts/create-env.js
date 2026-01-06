const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '..', '.env');
const content = `DATABASE_URL="postgresql://neondb_owner:npg_WnTA0OcZ2FuP@ep-green-dust-adyyefy5-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require"`;

try {
    fs.writeFileSync(envPath, content);
    console.log('✅ .env file created successfully');
} catch (error) {
    console.error('❌ Failed to create .env file:', error);
    process.exit(1);
}
