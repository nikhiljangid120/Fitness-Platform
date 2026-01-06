const { GoogleGenerativeAI } = require("@google/generative-ai");
const path = require("path");
// Try to load env manually since we are running a standalone script
require("dotenv").config({ path: ".env.local" });

async function main() {
    const key = process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
    console.log("Testing with Key:", key ? (key.substring(0, 5) + "...") : "MISSING");

    if (!key) {
        console.error("❌ No API Key found in .env.local");
        return;
    }

    try {
        const genAI = new GoogleGenerativeAI(key);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); // Use a fast model

        console.log("Sending prompt to Gemini...");
        const result = await model.generateContent("Say 'Hello from FlexForge!' if you can hear me.");
        const response = await result.response;
        const text = response.text();

        console.log("✅ RESPONSE RECEIVED:");
        console.log(text);
    } catch (error) {
        console.error("❌ ERROR:", error.message);
    }
}

main();
