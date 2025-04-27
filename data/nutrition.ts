export interface Meal {
  id: string
  title: string
  type: "Breakfast" | "Lunch" | "Dinner" | "Snack"
  diet: string
  calories: number
  ingredients: string[]
  instructions?: string
  image?: string
}

export interface MealPlan {
  id: string
  title: string
  description: string
  diet: string
  category: string
  calories: string
  image: string
  meals: {
    breakfast: Meal[]
    lunch: Meal[]
    dinner: Meal[]
    snacks: Meal[]
  }
}

// Sample meals
const meals: Meal[] = [
  {
    id: "oatmeal-banana",
    title: "Oats with Banana & Peanut Butter",
    type: "Breakfast",
    diet: "Vegetarian",
    calories: 350,
    ingredients: ["Oats", "Milk", "Banana", "Peanut Butter"],
    instructions: "Cook oats with milk, top with sliced banana and a tablespoon of peanut butter.",
    image: "/meals/oatmeal-banana.jpg",
  },
  {
    id: "greek-yogurt-berries",
    title: "Greek Yogurt with Berries",
    type: "Breakfast",
    diet: "Vegetarian",
    calories: 250,
    ingredients: ["Greek Yogurt", "Mixed Berries", "Honey", "Granola"],
    instructions: "Mix Greek yogurt with berries, drizzle with honey, and top with granola.",
    image: "/meals/greek-yogurt-berries.jpg",
  },
  {
    id: "avocado-toast",
    title: "Avocado Toast with Egg",
    type: "Breakfast",
    diet: "Vegetarian",
    calories: 300,
    ingredients: ["Whole Grain Bread", "Avocado", "Egg", "Salt", "Pepper", "Red Pepper Flakes"],
    instructions: "Toast bread, spread mashed avocado, top with a fried egg, and season.",
    image: "/meals/avocado-toast.jpg",
  },
  {
    id: "vegan-smoothie-bowl",
    title: "Vegan Smoothie Bowl",
    type: "Breakfast",
    diet: "Vegan",
    calories: 320,
    ingredients: ["Frozen Banana", "Frozen Berries", "Plant Milk", "Chia Seeds", "Granola", "Coconut Flakes"],
    instructions: "Blend frozen fruits with plant milk, pour into a bowl, and top with seeds, granola, and coconut.",
    image: "/meals/vegan-smoothie-bowl.jpg",
  },
  {
    id: "keto-breakfast",
    title: "Keto Breakfast Bowl",
    type: "Breakfast",
    diet: "Keto",
    calories: 450,
    ingredients: ["Eggs", "Avocado", "Bacon", "Spinach", "Cheese"],
    instructions: "Cook eggs and bacon, serve with sliced avocado, sautéed spinach, and cheese.",
    image: "/meals/keto-breakfast.jpg",
  },
  {
    id: "chicken-salad",
    title: "Grilled Chicken Salad",
    type: "Lunch",
    diet: "High Protein",
    calories: 400,
    ingredients: ["Chicken Breast", "Mixed Greens", "Cherry Tomatoes", "Cucumber", "Olive Oil", "Lemon Juice"],
    instructions: "Grill chicken, slice, and serve over mixed greens with vegetables and dressing.",
    image: "/meals/chicken-salad.jpg",
  },
  {
    id: "quinoa-bowl",
    title: "Quinoa Vegetable Bowl",
    type: "Lunch",
    diet: "Vegetarian",
    calories: 380,
    ingredients: ["Quinoa", "Roasted Vegetables", "Chickpeas", "Feta Cheese", "Olive Oil", "Lemon"],
    instructions: "Combine cooked quinoa with roasted vegetables and chickpeas, top with feta and dressing.",
    image: "/meals/quinoa-bowl.jpg",
  },
  {
    id: "vegan-wrap",
    title: "Vegan Hummus Wrap",
    type: "Lunch",
    diet: "Vegan",
    calories: 350,
    ingredients: ["Whole Wheat Wrap", "Hummus", "Cucumber", "Bell Pepper", "Spinach", "Avocado"],
    instructions: "Spread hummus on wrap, add vegetables and avocado, roll up and serve.",
    image: "/meals/vegan-wrap.jpg",
  },
  {
    id: "keto-lunch",
    title: "Keto Tuna Salad",
    type: "Lunch",
    diet: "Keto",
    calories: 420,
    ingredients: ["Tuna", "Mayonnaise", "Celery", "Red Onion", "Lettuce Leaves"],
    instructions: "Mix tuna with mayo, celery, and onion, serve in lettuce cups.",
    image: "/meals/keto-lunch.jpg",
  },
  {
    id: "salmon-dinner",
    title: "Baked Salmon with Vegetables",
    type: "Dinner",
    diet: "High Protein",
    calories: 450,
    ingredients: ["Salmon Fillet", "Broccoli", "Carrots", "Olive Oil", "Lemon", "Garlic", "Herbs"],
    instructions: "Bake salmon with herbs and garlic, serve with roasted vegetables.",
    image: "/meals/salmon-dinner.jpg",
  },
  {
    id: "vegetarian-curry",
    title: "Vegetable Curry with Rice",
    type: "Dinner",
    diet: "Vegetarian",
    calories: 420,
    ingredients: ["Mixed Vegetables", "Coconut Milk", "Curry Paste", "Brown Rice", "Cilantro"],
    instructions: "Simmer vegetables in coconut milk and curry paste, serve over rice.",
    image: "/meals/vegetarian-curry.jpg",
  },
  {
    id: "vegan-pasta",
    title: "Vegan Pasta Primavera",
    type: "Dinner",
    diet: "Vegan",
    calories: 380,
    ingredients: ["Whole Wheat Pasta", "Zucchini", "Bell Peppers", "Cherry Tomatoes", "Olive Oil", "Garlic", "Basil"],
    instructions: "Cook pasta, sauté vegetables with garlic, combine and top with fresh basil.",
    image: "/meals/vegan-pasta.jpg",
  },
  {
    id: "keto-dinner",
    title: "Keto Steak with Cauliflower Mash",
    type: "Dinner",
    diet: "Keto",
    calories: 520,
    ingredients: ["Steak", "Cauliflower", "Butter", "Cream", "Garlic", "Herbs"],
    instructions: "Grill steak to desired doneness, serve with cauliflower mashed with butter and cream.",
    image: "/meals/keto-dinner.jpg",
  },
  {
    id: "protein-smoothie",
    title: "Protein Smoothie",
    type: "Snack",
    diet: "High Protein",
    calories: 200,
    ingredients: ["Protein Powder", "Banana", "Milk", "Ice"],
    instructions: "Blend all ingredients until smooth.",
    image: "/meals/protein-smoothie.jpg",
  },
  {
    id: "greek-yogurt-snack",
    title: "Greek Yogurt with Honey",
    type: "Snack",
    diet: "Vegetarian",
    calories: 150,
    ingredients: ["Greek Yogurt", "Honey", "Almonds"],
    instructions: "Top Greek yogurt with honey and chopped almonds.",
    image: "/meals/greek-yogurt-snack.jpg",
  },
  {
    id: "fruit-salad",
    title: "Fresh Fruit Salad",
    type: "Snack",
    diet: "Vegan",
    calories: 120,
    ingredients: ["Mixed Fruits", "Lime Juice", "Mint"],
    instructions: "Combine chopped fruits, drizzle with lime juice, and garnish with mint.",
    image: "/meals/fruit-salad.jpg",
  },
  {
    id: "keto-snack",
    title: "Keto Cheese and Nuts",
    type: "Snack",
    diet: "Keto",
    calories: 250,
    ingredients: ["Cheese Cubes", "Mixed Nuts"],
    instructions: "Serve cheese cubes with a handful of mixed nuts.",
    image: "/meals/keto-snack.jpg",
  },
]

// Sample meal plans
export const mealPlans: MealPlan[] = [
  {
    id: "vegetarian-weight-loss",
    title: "Vegetarian Weight Loss Plan",
    description:
      "A balanced vegetarian meal plan designed to support weight loss while providing all essential nutrients.",
    diet: "Vegetarian",
    category: "weight-loss",
    calories: "1500-1800",
    image: "/meal-plans/vegetarian-weight-loss.jpg",
    meals: {
      breakfast: [meals[0], meals[1], meals[2]],
      lunch: [meals[6]],
      dinner: [meals[10]],
      snacks: [meals[14], meals[15]],
    },
  },
  {
    id: "vegan-balanced",
    title: "Balanced Vegan Plan",
    description:
      "A nutritionally complete vegan meal plan with a variety of plant-based proteins, whole grains, and vegetables.",
    diet: "Vegan",
    category: "weight-loss",
    calories: "1800-2000",
    image: "/meal-plans/vegan-balanced.jpg",
    meals: {
      breakfast: [meals[3]],
      lunch: [meals[7]],
      dinner: [meals[11]],
      snacks: [meals[16]],
    },
  },
  {
    id: "keto-low-carb",
    title: "Keto Low-Carb Plan",
    description: "A high-fat, low-carb ketogenic meal plan designed to help your body enter and maintain ketosis.",
    diet: "Keto",
    category: "keto",
    calories: "1800-2200",
    image: "/meal-plans/keto-low-carb.jpg",
    meals: {
      breakfast: [meals[4]],
      lunch: [meals[8]],
      dinner: [meals[12]],
      snacks: [meals[16]],
    },
  },
  {
    id: "high-protein-muscle",
    title: "High Protein Muscle Building",
    description: "A protein-rich meal plan designed to support muscle growth and recovery after workouts.",
    diet: "High Protein",
    category: "muscle-building",
    calories: "2500-2800",
    image: "/meal-plans/high-protein-muscle.jpg",
    meals: {
      breakfast: [meals[2], meals[4]],
      lunch: [meals[5]],
      dinner: [meals[9]],
      snacks: [meals[13]],
    },
  },
  {
    id: "indian-vegetarian",
    title: "Indian Vegetarian Plan",
    description:
      "A flavorful vegetarian meal plan inspired by Indian cuisine, rich in spices and plant-based proteins.",
    diet: "Vegetarian",
    category: "weight-loss",
    calories: "1800-2000",
    image: "/meal-plans/indian-vegetarian.jpg",
    meals: {
      breakfast: [meals[0], meals[1]],
      lunch: [meals[6]],
      dinner: [meals[10]],
      snacks: [meals[14]],
    },
  },
  {
    id: "mediterranean-diet",
    title: "Mediterranean Diet Plan",
    description: "A heart-healthy meal plan based on the traditional foods of Mediterranean countries.",
    diet: "Mediterranean",
    category: "weight-loss",
    calories: "1800-2200",
    image: "/meal-plans/mediterranean-diet.jpg",
    meals: {
      breakfast: [meals[2]],
      lunch: [meals[5], meals[6]],
      dinner: [meals[9], meals[10]],
      snacks: [meals[15], meals[16]],
    },
  },
]
