// Gemini AI integration with guaranteed fallback system
export async function generateAIResponse(prompt: string): Promise<string> {
  // First, try to get a response from the API
  try {
    console.log("Attempting to call Gemini API...")

    // Call our API route with a timeout
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout

    try {
      const response = await fetch("/api/gemini", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      // Parse the JSON response
      const data = await response.json()

      // Check if we need to use fallback
      if (data.fallback || !data.response) {
        console.log("API indicated fallback needed:", data.details || "No details provided")
        return getFallbackResponse(prompt)
      }

      // Clean up the response to fix formatting issues
      const cleanedResponse = cleanResponse(data.response)

      // We have a valid response
      console.log("✅ GEMINI API SUCCESS: Response received")
      return cleanedResponse
    } catch (fetchError) {
      clearTimeout(timeoutId)
      console.error("❌ GEMINI API FETCH ERROR:", fetchError)

      // Only fallback if absolutely necessary
      return getFallbackResponse(prompt)
    }
  } catch (error) {
    // Log the error and use fallback
    console.error("Error generating AI response, using fallback:", error)
    return getFallbackResponse(prompt)
  }
}

// Function to clean up response text and fix formatting issues
function cleanResponse(text: string): string {
  return (
    text
      // Fix markdown formatting issues
      .replace(/\*\s/g, "* ") // Fix spacing after asterisks
      .replace(/\s\*/g, " *") // Fix spacing before asterisks
      .replace(/\*\*\*/g, "**") // Fix triple asterisks
      .replace(/\n\s*\n\s*\n/g, "\n\n") // Remove excessive line breaks
      .replace(/^\s+|\s+$/gm, "") // Trim whitespace from start/end of lines
      .trim()
  ) // Trim the entire text
}

// Improved fallback function with more relevant responses
function getFallbackResponse(prompt: string): string {
  console.log("Using fallback response system for prompt:", prompt)

  const promptLower = prompt.toLowerCase()

  // Determine which category the prompt falls into
  let category = "general"

  if (promptLower.includes("workout") || promptLower.includes("exercise") || promptLower.includes("training")) {
    category = "workout"
  } else if (
    promptLower.includes("eat") ||
    promptLower.includes("food") ||
    promptLower.includes("nutrition") ||
    promptLower.includes("diet") ||
    promptLower.includes("meal")
  ) {
    category = "nutrition"
  } else if (promptLower.includes("stretch") || promptLower.includes("flexible") || promptLower.includes("mobility")) {
    category = "flexibility"
  } else if (
    promptLower.includes("weight loss") ||
    promptLower.includes("lose weight") ||
    promptLower.includes("fat") ||
    promptLower.includes("slim")
  ) {
    category = "weight_loss"
  } else if (
    promptLower.includes("muscle") ||
    promptLower.includes("strength") ||
    promptLower.includes("gain") ||
    promptLower.includes("bulk")
  ) {
    category = "muscle_gain"
  }

  console.log("Selected fallback category:", category)

  // Select a response from the appropriate category
  const responses: Record<string, string[]> = {
    workout: [
      "Here's a 20-minute HIIT workout you can do at home:\n\n1. Jumping jacks - 30 seconds\n2. Push-ups - 30 seconds\n3. Mountain climbers - 30 seconds\n4. Squats - 30 seconds\n\nRest for 15 seconds between exercises and repeat the circuit 4 times.",

      "For a beginner-friendly workout, try this routine:\n\n• 3 sets of 10 squats\n• 3 sets of 5-10 push-ups (on knees if needed)\n• 3 sets of 10 lunges per leg\n• 30-second plank\n\nRest 60 seconds between exercises.",

      "To build muscle, focus on compound movements:\n\n• 4 sets of 8-12 squats\n• 4 sets of 8-12 bench press or push-ups\n• 4 sets of 8-12 rows\n• 3 sets of 10-15 lunges\n\nRest 90 seconds between sets for optimal muscle growth.",
    ],
    nutrition: [
      "For weight loss, focus on creating a calorie deficit by eating:\n\n• Plenty of protein (lean meats, eggs, legumes)\n• Fiber-rich vegetables\n• Complex carbs in moderation\n\nAim for 500 calories below your maintenance level for sustainable fat loss.",

      "To support muscle growth, consume 1.6-2.2g of protein per kg of bodyweight daily. Good sources include:\n\n• Chicken breast\n• Lean beef\n• Fish\n• Eggs\n• Greek yogurt\n• Plant-based options like tofu and legumes",

      "Pre-workout nutrition should include carbs for energy (banana, oatmeal) and some protein. Post-workout, aim for a 3:1 carb to protein ratio within 30-60 minutes to optimize recovery.",
    ],
    flexibility: [
      "To improve flexibility, try this routine daily:\n\n• Hamstring stretch - 30 seconds per leg\n• Hip flexor stretch - 30 seconds per side\n• Chest stretch - 30 seconds\n• Child's pose - 30 seconds\n\nHold each stretch at the point of tension but not pain.",

      "Yoga is excellent for flexibility. Try these poses:\n\n• Downward dog (stretches hamstrings and calves)\n• Warrior II (opens hips)\n• Cobra (extends spine)\n• Pigeon pose (releases hip tension)\n\nHold each for 5-10 breaths.",

      "Dynamic stretching before workouts and static stretching after is the optimal approach. Before exercise, try leg swings, arm circles, and torso twists. After, hold stretches for 30+ seconds to improve flexibility.",
    ],
    weight_loss: [
      "For effective weight loss, combine:\n\n• Strength training (2-3 times/week)\n• Cardio (2-3 times/week)\n• Calorie deficit of 500 calories per day\n\nThis approach leads to sustainable fat loss of about 1 pound per week.",

      "High-intensity interval training (HIIT) is excellent for weight loss. Try:\n\n• 30 seconds of all-out effort\n• 30-60 seconds of rest\n• Repeat for 15-20 minutes\n• Do this 2-3 times per week",

      "To lose weight, focus on whole foods, lean proteins, and plenty of vegetables. Track your calories for at least a few weeks to understand your intake, and aim for a moderate deficit of 15-20% below maintenance.",
    ],
    muscle_gain: [
      "For muscle gain, focus on:\n\n• Progressive overload - gradually increasing weight, reps, or sets\n• Training each muscle group 2-3 times per week\n• Eating in a slight calorie surplus (200-300 calories above maintenance)\n• Consuming 1.6-2.2g of protein per kg of bodyweight",

      "A simple but effective muscle-building split:\n\n• Push (chest, shoulders, triceps)\n• Pull (back, biceps)\n• Legs\n\nDo 4-5 exercises per workout, 3-4 sets per exercise, and 8-12 reps per set.",

      "For natural muscle growth, prioritize:\n\n• Compound movements (squats, deadlifts, bench press, rows)\n• Adequate recovery (48 hours between training the same muscle group)\n• Progressive overload rather than training to failure every session",
    ],
    general: [
      "Consistency is key to fitness success. Start with small, achievable goals and gradually increase intensity. Remember that even a 10-minute workout is better than no workout at all.",

      "To stay motivated:\n\n• Track your progress\n• Find a workout buddy for accountability\n• Mix up your routine to prevent boredom\n• Celebrate small victories along the way",

      "When motivation is low, remember your 'why' - the deeper reason you started this fitness journey. Visualize how you'll feel after the workout, not just how you feel before it.",
    ],
  }

  const responseArray = responses[category]
  const randomIndex = Math.floor(Math.random() * responseArray.length)

  // Add a note that this is a fallback response
  return responseArray[randomIndex] + "\n\n(I'm using my built-in knowledge to answer your question.)"
}
