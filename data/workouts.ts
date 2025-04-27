export interface Workout {
  id: string
  title: string
  description: string
  level: "Beginner" | "Intermediate" | "Advanced"
  duration: string
  equipment: string[]
  image: string
  exercises: Exercise[]
}

export interface Exercise {
  id: string
  title: string
  equipment: string
  reps: string
  instructions: string
  level: "Beginner" | "Intermediate" | "Advanced"
  muscleGroup: string
  image: string
}

export interface WorkoutCategory {
  id: string
  name: string
  description: string
  workouts: Workout[]
}

// Sample exercises
const exercises: Exercise[] = [
  {
    id: "pushups",
    title: "Push-Ups",
    equipment: "No",
    reps: "3 sets of 15",
    instructions: "Keep your back straight, lower until elbows are 90°, push back up.",
    level: "Beginner",
    muscleGroup: "Chest, Triceps",
    image: "/exercises/pushups.gif",
  },
  {
    id: "squats",
    title: "Bodyweight Squats",
    equipment: "No",
    reps: "3 sets of 20",
    instructions:
      "Stand with feet shoulder-width apart, lower your hips until thighs are parallel to the floor, then return to standing.",
    level: "Beginner",
    muscleGroup: "Quadriceps, Glutes",
    image: "/exercises/squats.gif",
  },
  {
    id: "lunges",
    title: "Walking Lunges",
    equipment: "No",
    reps: "3 sets of 12 per leg",
    instructions: "Step forward with one leg, lowering your hips until both knees are bent at about a 90-degree angle.",
    level: "Beginner",
    muscleGroup: "Quadriceps, Hamstrings, Glutes",
    image: "/exercises/lunges.gif",
  },
  {
    id: "plank",
    title: "Plank",
    equipment: "No",
    reps: "3 sets of 30-60 seconds",
    instructions: "Hold a push-up position with your weight on your forearms, keeping your body in a straight line.",
    level: "Beginner",
    muscleGroup: "Core, Shoulders",
    image: "/exercises/plank.gif",
  },
  {
    id: "burpees",
    title: "Burpees",
    equipment: "No",
    reps: "3 sets of 10",
    instructions:
      "Begin in a standing position, drop into a squat position, kick feet back, do a push-up, return to squat, and jump up.",
    level: "Intermediate",
    muscleGroup: "Full Body",
    image: "/exercises/burpees.gif",
  },
  {
    id: "mountain-climbers",
    title: "Mountain Climbers",
    equipment: "No",
    reps: "3 sets of 30 seconds",
    instructions: "Start in a plank position and alternate bringing knees to chest in a running motion.",
    level: "Intermediate",
    muscleGroup: "Core, Shoulders, Legs",
    image: "/exercises/mountain-climbers.gif",
  },
  {
    id: "dumbbell-rows",
    title: "Dumbbell Rows",
    equipment: "Dumbbells",
    reps: "3 sets of 12 per arm",
    instructions: "Bend at the waist with one hand on a bench, pull dumbbell up to your side with the other hand.",
    level: "Intermediate",
    muscleGroup: "Back, Biceps",
    image: "/exercises/dumbbell-rows.gif",
  },
  {
    id: "bench-press",
    title: "Bench Press",
    equipment: "Barbell, Bench",
    reps: "4 sets of 8-10",
    instructions: "Lie on a bench, lower the barbell to your chest, then push it back up.",
    level: "Intermediate",
    muscleGroup: "Chest, Triceps, Shoulders",
    image: "/exercises/bench-press.gif",
  },
  {
    id: "deadlifts",
    title: "Deadlifts",
    equipment: "Barbell",
    reps: "4 sets of 8",
    instructions: "Stand with feet hip-width apart, bend at hips and knees to grip the bar, then stand up straight.",
    level: "Advanced",
    muscleGroup: "Lower Back, Hamstrings, Glutes",
    image: "/exercises/deadlifts.gif",
  },
  {
    id: "pull-ups",
    title: "Pull-Ups",
    equipment: "Pull-Up Bar",
    reps: "3 sets of 8-12",
    instructions: "Hang from a bar with palms facing away, pull yourself up until your chin is over the bar.",
    level: "Advanced",
    muscleGroup: "Back, Biceps",
    image: "/exercises/pull-ups.gif",
  },
]

// Sample workouts organized by categories
export const workoutCategories: WorkoutCategory[] = [
  {
    id: "weight-loss",
    name: "Weight Loss",
    description: "Workouts designed to burn calories and help with weight loss",
    workouts: [
      {
        id: "hiit-fat-burn",
        title: "HIIT Fat Burn",
        description: "High-intensity interval training to maximize calorie burn and boost metabolism.",
        level: "Intermediate",
        duration: "30 min",
        equipment: ["No Equipment"],
        image: "/workouts/hiit-fat-burn.jpg",
        exercises: [exercises[4], exercises[5], exercises[2], exercises[0], exercises[3]],
      },
      {
        id: "cardio-blast",
        title: "Cardio Blast",
        description: "A high-energy cardio workout to get your heart pumping and burn calories.",
        level: "Beginner",
        duration: "25 min",
        equipment: ["No Equipment"],
        image: "/workouts/cardio-blast.jpg",
        exercises: [exercises[4], exercises[5], exercises[1], exercises[2]],
      },
      {
        id: "full-body-burn",
        title: "Full Body Burn",
        description: "A comprehensive workout targeting all major muscle groups to increase calorie expenditure.",
        level: "Intermediate",
        duration: "45 min",
        equipment: ["Dumbbells"],
        image: "/workouts/full-body-burn.jpg",
        exercises: [exercises[0], exercises[1], exercises[6], exercises[4], exercises[3]],
      },
    ],
  },
  {
    id: "muscle-gain",
    name: "Muscle Gain",
    description: "Workouts focused on building muscle and strength",
    workouts: [
      {
        id: "upper-body-strength",
        title: "Upper Body Strength",
        description: "Focus on building strength and muscle in your chest, back, shoulders, and arms.",
        level: "Intermediate",
        duration: "50 min",
        equipment: ["Dumbbells", "Bench"],
        image: "/workouts/upper-body-strength.jpg",
        exercises: [exercises[7], exercises[6], exercises[0], exercises[9]],
      },
      {
        id: "lower-body-power",
        title: "Lower Body Power",
        description: "Build strong legs and glutes with this powerful lower body workout.",
        level: "Intermediate",
        duration: "45 min",
        equipment: ["Barbell", "Dumbbells"],
        image: "/workouts/lower-body-power.jpg",
        exercises: [exercises[8], exercises[1], exercises[2]],
      },
      {
        id: "full-body-strength",
        title: "Full Body Strength",
        description: "A comprehensive strength workout targeting all major muscle groups.",
        level: "Advanced",
        duration: "60 min",
        equipment: ["Barbell", "Dumbbells", "Bench"],
        image: "/workouts/full-body-strength.jpg",
        exercises: [exercises[7], exercises[8], exercises[6], exercises[1], exercises[9]],
      },
    ],
  },
  {
    id: "cardio",
    name: "Cardio",
    description: "Workouts to improve cardiovascular health and endurance",
    workouts: [
      {
        id: "beginner-cardio",
        title: "Beginner Cardio",
        description: "A gentle introduction to cardio exercises for beginners.",
        level: "Beginner",
        duration: "20 min",
        equipment: ["No Equipment"],
        image: "/workouts/beginner-cardio.jpg",
        exercises: [exercises[1], exercises[2], exercises[5]],
      },
      {
        id: "interval-training",
        title: "Interval Training",
        description: "Alternate between high and low-intensity exercises to improve cardiovascular fitness.",
        level: "Intermediate",
        duration: "30 min",
        equipment: ["No Equipment"],
        image: "/workouts/interval-training.jpg",
        exercises: [exercises[4], exercises[5], exercises[0], exercises[3]],
      },
      {
        id: "endurance-builder",
        title: "Endurance Builder",
        description: "Build your stamina and endurance with this challenging cardio workout.",
        level: "Advanced",
        duration: "45 min",
        equipment: ["No Equipment"],
        image: "/workouts/endurance-builder.jpg",
        exercises: [exercises[4], exercises[5], exercises[2], exercises[0], exercises[3]],
      },
    ],
  },
  {
    id: "yoga",
    name: "Yoga & Flexibility",
    description: "Workouts to improve flexibility, balance, and mental wellbeing",
    workouts: [
      {
        id: "morning-yoga",
        title: "Morning Yoga Flow",
        description: "Start your day with this energizing yoga flow to awaken your body and mind.",
        level: "Beginner",
        duration: "20 min",
        equipment: ["Yoga Mat"],
        image: "/workouts/morning-yoga.jpg",
        exercises: [
          {
            id: "sun-salutation",
            title: "Sun Salutation",
            equipment: "Yoga Mat",
            reps: "5 rounds",
            instructions:
              "Begin in mountain pose, then flow through upward salute, forward fold, plank, chaturanga, upward dog, downward dog, and back to mountain pose.",
            level: "Beginner",
            muscleGroup: "Full Body",
            image: "/exercises/sun-salutation.gif",
          },
          {
            id: "warrior-1",
            title: "Warrior I",
            equipment: "Yoga Mat",
            reps: "30 seconds each side",
            instructions:
              "From downward dog, step one foot forward between your hands, align your heel, and raise your arms overhead while lifting your torso.",
            level: "Beginner",
            muscleGroup: "Legs, Core, Shoulders",
            image: "/exercises/warrior-1.gif",
          },
          {
            id: "warrior-2",
            title: "Warrior II",
            equipment: "Yoga Mat",
            reps: "30 seconds each side",
            instructions: "From Warrior I, open your hips and arms to the side, gazing over your front hand.",
            level: "Beginner",
            muscleGroup: "Legs, Core, Shoulders",
            image: "/exercises/warrior-2.gif",
          },
          {
            id: "tree-pose",
            title: "Tree Pose",
            equipment: "Yoga Mat",
            reps: "30 seconds each side",
            instructions:
              "Stand on one leg, place the sole of your other foot on your inner thigh, and bring your hands to prayer position.",
            level: "Beginner",
            muscleGroup: "Legs, Core, Balance",
            image: "/exercises/tree-pose.gif",
          },
        ],
      },
      {
        id: "flexibility-routine",
        title: "Full Body Flexibility",
        description: "Improve your overall flexibility with this comprehensive stretching routine.",
        level: "Intermediate",
        duration: "30 min",
        equipment: ["Yoga Mat"],
        image: "/workouts/flexibility-routine.jpg",
        exercises: [
          {
            id: "forward-fold",
            title: "Standing Forward Fold",
            equipment: "Yoga Mat",
            reps: "Hold for 60 seconds",
            instructions:
              "Stand with feet hip-width apart, hinge at the hips, and fold forward, reaching toward the floor. Bend knees if needed.",
            level: "Beginner",
            muscleGroup: "Hamstrings, Lower Back",
            image: "/exercises/forward-fold.gif",
          },
          {
            id: "pigeon-pose",
            title: "Pigeon Pose",
            equipment: "Yoga Mat",
            reps: "60 seconds each side",
            instructions:
              "From downward dog, bring one knee forward behind your wrist, extend the other leg back, and fold forward over your bent leg.",
            level: "Intermediate",
            muscleGroup: "Hips, Glutes",
            image: "/exercises/pigeon-pose.gif",
          },
          {
            id: "butterfly-stretch",
            title: "Butterfly Stretch",
            equipment: "Yoga Mat",
            reps: "Hold for 60 seconds",
            instructions:
              "Sit with the soles of your feet together, knees out to the sides. Hold your feet and gently press your knees toward the floor.",
            level: "Beginner",
            muscleGroup: "Inner Thighs, Hips",
            image: "/exercises/butterfly-stretch.gif",
          },
          {
            id: "cobra-pose",
            title: "Cobra Pose",
            equipment: "Yoga Mat",
            reps: "Hold for 30 seconds, repeat 3 times",
            instructions:
              "Lie face down, place hands under shoulders, and gently lift chest while keeping hips on the floor.",
            level: "Beginner",
            muscleGroup: "Spine, Chest",
            image: "/exercises/cobra-pose.gif",
          },
          {
            id: "seated-forward-fold",
            title: "Seated Forward Fold",
            equipment: "Yoga Mat",
            reps: "Hold for 60 seconds",
            instructions: "Sit with legs extended, hinge at the hips, and reach toward your toes.",
            level: "Beginner",
            muscleGroup: "Hamstrings, Lower Back",
            image: "/exercises/seated-forward-fold.gif",
          },
        ],
      },
      {
        id: "power-yoga",
        title: "Power Yoga",
        description: "A more intense yoga practice that builds strength while improving flexibility.",
        level: "Advanced",
        duration: "45 min",
        equipment: ["Yoga Mat"],
        image: "/workouts/power-yoga.jpg",
        exercises: [
          {
            id: "sun-salutation-b",
            title: "Sun Salutation B",
            equipment: "Yoga Mat",
            reps: "5 rounds",
            instructions: "A more intense version of Sun Salutation that includes Chair pose and Warrior I.",
            level: "Intermediate",
            muscleGroup: "Full Body",
            image: "/exercises/sun-salutation-b.gif",
          },
          {
            id: "chaturanga",
            title: "Chaturanga Dandasana",
            equipment: "Yoga Mat",
            reps: "10 repetitions",
            instructions: "From plank position, lower halfway down like a push-up, keeping elbows close to your body.",
            level: "Intermediate",
            muscleGroup: "Chest, Arms, Core",
            image: "/exercises/chaturanga.gif",
          },
          {
            id: "side-plank",
            title: "Side Plank",
            equipment: "Yoga Mat",
            reps: "30 seconds each side, 3 sets",
            instructions:
              "From plank position, shift weight to one arm, stack feet, and lift other arm toward ceiling.",
            level: "Intermediate",
            muscleGroup: "Core, Shoulders",
            image: "/exercises/side-plank.gif",
          },
          {
            id: "boat-pose",
            title: "Boat Pose",
            equipment: "Yoga Mat",
            reps: "Hold for 30 seconds, 3 sets",
            instructions:
              "Sit with knees bent, lift feet off floor, balance on sit bones, and extend legs if possible.",
            level: "Intermediate",
            muscleGroup: "Core, Hip Flexors",
            image: "/exercises/boat-pose.gif",
          },
          {
            id: "crow-pose",
            title: "Crow Pose",
            equipment: "Yoga Mat",
            reps: "Hold for 20 seconds, 3 attempts",
            instructions:
              "Squat down, place hands on floor, knees on upper arms, and shift weight forward until feet lift off floor.",
            level: "Advanced",
            muscleGroup: "Arms, Core, Balance",
            image: "/exercises/crow-pose.gif",
          },
        ],
      },
    ],
  },
  {
    id: "hiit",
    name: "HIIT",
    description: "High-Intensity Interval Training for maximum results in minimum time",
    workouts: [
      {
        id: "quick-hiit",
        title: "Quick HIIT",
        description: "A short but effective HIIT workout for when you're short on time.",
        level: "Beginner",
        duration: "15 min",
        equipment: ["No Equipment"],
        image: "/workouts/quick-hiit.jpg",
        exercises: [exercises[4], exercises[5], exercises[0]],
      },
      {
        id: "tabata-workout",
        title: "Tabata Workout",
        description: "20 seconds of intense work followed by 10 seconds of rest for 4 minutes per exercise.",
        level: "Intermediate",
        duration: "25 min",
        equipment: ["No Equipment"],
        image: "/workouts/tabata-workout.jpg",
        exercises: [exercises[4], exercises[1], exercises[5], exercises[0]],
      },
      {
        id: "advanced-hiit",
        title: "Advanced HIIT Challenge",
        description: "Push your limits with this challenging high-intensity interval training workout.",
        level: "Advanced",
        duration: "35 min",
        equipment: ["Dumbbells"],
        image: "/workouts/advanced-hiit.jpg",
        exercises: [exercises[4], exercises[6], exercises[5], exercises[1], exercises[0]],
      },
    ],
  },
]
