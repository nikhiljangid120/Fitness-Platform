import { type NextRequest, NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json()

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 })
    }

    const API_KEY = process.env.GEMINI_API_KEY

    if (!API_KEY) {
      console.error("API key is not configured")
      return NextResponse.json({ error: "API key is not configured", fallback: true }, { status: 200 })
    }

    try {
      // Initialize the API client
      console.log("Initializing Google Generative AI client...")
      const genAI = new GoogleGenerativeAI(API_KEY)

      // Use the correct model name format for Gemini API
      console.log("Using model: gemini-1.5-pro-latest")
      const model = genAI.getGenerativeModel({
        model: "gemini-1.5-pro-latest",
        generationConfig: {
          temperature: 0.7,
          topP: 0.8,
          topK: 40,
          maxOutputTokens: 1024,
        },
      })

      // Create a prompt with specific formatting instructions
      const prompt_text = `
You are a professional fitness trainer. Answer this question briefly and with expertise: ${prompt}

Important formatting instructions:
1. Use simple formatting - avoid excessive markdown symbols
2. Use bullet points with • symbol for lists
3. Use numbered lists (1., 2., etc.) for step-by-step instructions
4. Keep paragraphs short and concise
5. Use at most one level of emphasis (single * for emphasis)
6. Avoid using ** for bold text
7. Keep your response under 300 words
`

      // Generate content
      console.log("Generating content...")
      const result = await model.generateContent(prompt_text)
      const response = result.response
      const text = response.text()
      console.log("Content generated successfully")

      return NextResponse.json({ response: text })
    } catch (apiError: any) {
      console.error("Gemini API error:", apiError)

      // Try to extract more specific error information
      let errorDetails = String(apiError)
      if (apiError.message) {
        errorDetails = apiError.message
      }

      console.log("Error details:", errorDetails)

      // Return success status with fallback flag
      return NextResponse.json(
        {
          error: "AI model error",
          details: errorDetails,
          fallback: true,
        },
        { status: 200 },
      )
    }
  } catch (error) {
    console.error("Server error:", error)
    return NextResponse.json(
      {
        error: "Failed to process request",
        details: String(error),
        fallback: true,
      },
      { status: 200 },
    )
  }
}
