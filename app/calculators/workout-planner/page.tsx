"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { motion } from "framer-motion"
import { Calendar, ChevronRight, Clock, Download, Dumbbell, Home, Info, Target, Users } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

const formSchema = z.object({
  goal: z.enum(["strength", "hypertrophy", "endurance", "weight-loss", "general"]),
  experience: z.enum(["beginner", "intermediate", "advanced"]),
  daysPerWeek: z.coerce.number().min(1).max(7),
  sessionLength: z.coerce.number().min(15).max(120),
  equipment: z.object({
    none: z.boolean().optional(),
    dumbbells: z.boolean().optional(),
    barbell: z.boolean().optional(),
    kettlebells: z.boolean().optional(),
    resistanceBands: z.boolean().optional(),
    pullupBar: z.boolean().optional(),
    bench: z.boolean().optional(),
    machines: z.boolean().optional(),
  }),
  focusAreas: z.object({
    fullBody: z.boolean().optional(),
    upperBody: z.boolean().optional(),
    lowerBody: z.boolean().optional(),
    core: z.boolean().optional(),
    back: z.boolean().optional(),
    chest: z.boolean().optional(),
    shoulders: z.boolean().optional(),
    arms: z.boolean().optional(),
    legs: z.boolean().optional(),
    glutes: z.boolean().optional(),
    cardio: z.boolean().optional(),
  }),
})

type FormValues = z.infer<typeof formSchema>

// Exercise database
const exercises = {
  bodyweight: {
    upper: ["Push-ups", "Pike Push-ups", "Dips (on furniture)", "Inverted Rows", "Pull-ups"],
    lower: ["Squats", "Lunges", "Glute Bridges", "Calf Raises", "Step-ups"],
    core: ["Planks", "Mountain Climbers", "Bicycle Crunches", "Russian Twists", "Leg Raises"],
    cardio: ["Jumping Jacks", "High Knees", "Burpees", "Jump Squats", "Mountain Climbers"],
  },
  dumbbells: {
    upper: [
      "Dumbbell Bench Press",
      "Dumbbell Rows",
      "Dumbbell Shoulder Press",
      "Dumbbell Flyes",
      "Bicep Curls",
      "Tricep Extensions",
    ],
    lower: ["Dumbbell Squats", "Dumbbell Lunges", "Romanian Deadlifts", "Goblet Squats", "Dumbbell Step-ups"],
    core: ["Dumbbell Russian Twists", "Weighted Crunches", "Dumbbell Side Bends", "Weighted Planks"],
    cardio: ["Dumbbell Thrusters", "Dumbbell Swings", "Dumbbell Clean and Press"],
  },
  barbell: {
    upper: ["Bench Press", "Bent Over Rows", "Overhead Press", "Barbell Curls", "Skull Crushers"],
    lower: ["Back Squats", "Front Squats", "Deadlifts", "Romanian Deadlifts", "Hip Thrusts"],
    core: ["Landmine Rotations", "Ab Rollouts", "Weighted Planks"],
    cardio: ["Clean and Jerk", "Barbell Complexes"],
  },
  machines: {
    upper: [
      "Chest Press",
      "Lat Pulldown",
      "Shoulder Press Machine",
      "Cable Rows",
      "Tricep Pushdown",
      "Bicep Curl Machine",
    ],
    lower: ["Leg Press", "Leg Extension", "Leg Curl", "Calf Raise Machine", "Hip Abduction/Adduction"],
    core: ["Cable Crunches", "Cable Woodchoppers", "Ab Machine"],
    cardio: ["Rowing Machine", "Elliptical", "Stair Climber"],
  },
}

// Workout templates based on goals
const workoutTemplates = {
  strength: {
    sets: "3-5",
    reps: "4-6",
    rest: "2-3 minutes",
    tempo: "Controlled (2-0-1)",
    frequency: "Train each muscle group 2x per week",
  },
  hypertrophy: {
    sets: "3-4",
    reps: "8-12",
    rest: "60-90 seconds",
    tempo: "Moderate (2-1-2)",
    frequency: "Train each muscle group 2-3x per week",
  },
  endurance: {
    sets: "2-3",
    reps: "15-20",
    rest: "30-45 seconds",
    tempo: "Moderate (1-1-1)",
    frequency: "Train each muscle group 3-4x per week",
  },
  "weight-loss": {
    sets: "3",
    reps: "10-15",
    rest: "30-60 seconds",
    tempo: "Moderate (1-0-1)",
    frequency: "Full body workouts 3-4x per week with cardio",
  },
  general: {
    sets: "2-3",
    reps: "8-15",
    rest: "60 seconds",
    tempo: "Moderate (2-0-2)",
    frequency: "Mix of full body and split routines",
  },
}

export default function WorkoutPlanner() {
  const [results, setResults] = useState<any>(null)
  const [activeTab, setActiveTab] = useState('form')

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      goal: 'general',
      experience: 'beginner',
      daysPerWeek: 3,
      sessionLength: 45,
      equipment: {
        none: false,
        dumbbells: true,
        barbell: false,
        kettlebells: false,
        resistanceBands: false,
        pullupBar: false,
        bench: false,
        machines: false,
      },
      focusAreas: {
        fullBody: true,
        upperBody: false,
        lowerBody: false,
        core: false,
        back: false,
        chest: false,
        shoulders: false,
        arms: false,
        legs: false,
        glutes: false,
        cardio: false,
      },
    },
  })

  const watchEquipment = form.watch('equipment')
  const watchFocusAreas = form.watch('focusAreas')
  
  // Check if "none" is selected and disable other equipment options
  const noneSelected = watchEquipment.none
  
  // Check if "fullBody" is selected and disable other focus areas
  const fullBodySelected = watchFocusAreas.fullBody

  function generateWorkoutPlan(data: FormValues) {
    const { goal, experience, daysPerWeek, sessionLength, equipment, focusAreas } = data
    
    // Determine available equipment
    let availableEquipment = ['bodyweight']
    if (equipment.dumbbells) availableEquipment.push('dumbbells')
    if (equipment.barbell) availableEquipment.push('barbell')
    if (equipment.machines) availableEquipment.push('machines')
    
    // If "none" is selected, only use bodyweight
    if (equipment.none) availableEquipment = ['bodyweight']
    
    // Determine workout split based on days per week and focus areas
    let workoutSplit: string[] = []
    
    if (focusAreas.fullBody || daysPerWeek <= 3) {
      workoutSplit = Array(daysPerWeek).fill('Full Body')
    } else if (daysPerWeek === 4) {
      workoutSplit = ['Upper Body', 'Lower Body', 'Upper Body', 'Lower Body']
    } else if (daysPerWeek === 5) {
      workoutSplit = ['Push', 'Pull', 'Legs', 'Upper Body', 'Lower Body']
    } else if (daysPerWeek >= 6) {
      workoutSplit = ['Push', 'Pull', 'Legs', 'Push', 'Pull', 'Legs']
      if (daysPerWeek === 7) workoutSplit.push('Active Recovery')
    }
    
    // Generate workouts for each day
    const workouts = workoutSplit.map((day, index) => {
      let selectedExercises: string[] = []
      
      // Helper function to add exercises if not already included
      const addExercises = (source: string[], limit: number) => {
        const newExercises = source.filter(ex => !selectedExercises.includes(ex))
        selectedExercises.push(...newExercises.slice(0, limit))
      }
      
      // Select exercises based on the day's focus
      if (day === 'Full Body') {
        availableEquipment.forEach(equip => {
          addExercises(exercises[equip]?.upper || [], 2)
          addExercises(exercises[equip]?.lower || [], 2)
          addExercises(exercises[equip]?.core || [], 1)
          if (focusAreas.cardio) {
            addExercises(exercises[equip]?.cardio || [], 1)
          }
        })
      } else if (day === 'Upper Body') {
        availableEquipment.forEach(equip => {
          addExercises(exercises[equip]?.upper || [], 4)
        })
      } else if (day === 'Lower Body') {
        availableEquipment.forEach(equip => {
          addExercises(exercises[equip]?.lower || [], 4)
          addExercises(exercises[equip]?.core || [], 1)
        })
      } else if (day === 'Push') {
        availableEquipment.forEach(equip => {
          const upperExercises = exercises[equip]?.upper || []
          const pushExercises = upperExercises.filter(ex => 
            ex.includes('Press') || ex.includes('Push') || ex.includes('Dips') || 
            ex.includes('Flyes') || ex.includes('Extensions')
          )
          addExercises(pushExercises, 4)
        })
      } else if (day === 'Pull') {
        availableEquipment.forEach(equip => {
          const upperExercises = exercises[equip]?.upper || []
          const pullExercises = upperExercises.filter(ex => 
            ex.includes('Row') || ex.includes('Pull') || ex.includes('Curl') || 
            ex.includes('Deadlift')
          )
          addExercises(pullExercises, 4)
        })
      } else if (day === 'Legs') {
        availableEquipment.forEach(equip => {
          addExercises(exercises[equip]?.lower || [], 4)
        })
      } else if (day === 'Active Recovery') {
        availableEquipment.forEach(equip => {
          addExercises(exercises[equip]?.cardio || [], 2)
        })
        selectedExercises.push('Mobility Work', 'Light Stretching', 'Foam Rolling')
      }
      
      // Fallback to bodyweight if not enough exercises
      if (selectedExercises.length < 4) {
        if (day === 'Full Body' || day === 'Upper Body' || day === 'Push' || day === 'Pull') {
          addExercises(exercises.bodyweight.upper, 2)
        }
        if (day === 'Full Body' || day === 'Lower Body' || day === 'Legs') {
          addExercises(exercises.bodyweight.lower, 2)
        }
        addExercises(exercises.bodyweight.core, 1)
      }
      
      // Remove duplicates
      selectedExercises = [...new Set(selectedExercises)]
      
      // Limit exercises based on session length
      const exerciseCount = Math.floor(sessionLength / 10)
      selectedExercises = selectedExercises.slice(0, Math.max(4, exerciseCount))
      // Get workout parameters based on goal
      const params = workoutTemplates[goal]
      
      return {
        day: `Day ${index + 1}: ${day}`,
        exercises: selectedExercises.map(exercise => ({
          name: exercise,
          sets: params.sets,
          reps: params.reps,
          rest: params.rest
        })),
        params
      }
    })
    
    return {
      goal,
      experience,
      daysPerWeek,
      sessionLength,
      workouts,
      params: workoutTemplates[goal]
    }
  }

  function onSubmit(data: FormValues) {
    // Handle equipment conflicts
    if (data.equipment.none) {
      Object.keys(data.equipment).forEach(key => {
        if (key !== 'none') {
          data.equipment[key as keyof typeof data.equipment] = false
        }
      })
    }
    
    // Handle focus area conflicts
    if (data.focusAreas.fullBody) {
      Object.keys(data.focusAreas).forEach(key => {
        if (key !== 'fullBody') {
          data.focusAreas[key as keyof typeof data.focusAreas] = false
        }
      })
    }
    
    const plan = generateWorkoutPlan(data)
    setResults(plan)
    setActiveTab('results')
  }

  return (
    <div className="container max-w-5xl py-10 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Workout Planner</h1>
        <p className="text-muted-foreground">
          Build a custom workout plan based on your schedule and equipment
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="form">Planner</TabsTrigger>
          <TabsTrigger value="results" disabled={!results}>Your Plan</TabsTrigger>
        </TabsList>
        
        <TabsContent value="form" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Dumbbell className="h-5 w-5" />
                <span>Your Workout Preferences</span>
              </CardTitle>
              <CardDescription>
                Tell us about your goals and available resources
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="goal"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Primary Goal</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select your primary goal" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="strength">Build Strength</SelectItem>
                              <SelectItem value="hypertrophy">Build Muscle</SelectItem>
                              <SelectItem value="endurance">Improve Endurance</SelectItem>
                              <SelectItem value="weight-loss">Lose Weight</SelectItem>
                              <SelectItem value="general">General Fitness</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="experience"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Experience Level</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select your experience level" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="beginner">Beginner (0-1 years)</SelectItem>
                              <SelectItem value="intermediate">Intermediate (1-3 years)</SelectItem>
                              <SelectItem value="advanced">Advanced (3+ years)</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="daysPerWeek"
                      render={({ field: { value, onChange } }) => (
                        <FormItem>
                          <FormLabel>Days Per Week</FormLabel>
                          <FormControl>
                            <div className="space-y-2">
                              <Slider
                                min={1}
                                max={7}
                                step={1}
                                value={[value]}
                                onValueChange={(vals) => onChange(vals[0])}
                              />
                              <div className="flex justify-between text-xs text-muted-foreground">
                                <span>1</span>
                                <span>2</span>
                                <span>3</span>
                                <span>4</span>
                                <span>5</span>
                                <span>6</span>
                                <span>7</span>
                              </div>
                              <div className="text-center font-medium">
                                {value} {value === 1 ? 'day' : 'days'} per week
                              </div>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="sessionLength"
                      render={({ field: { value, onChange } }) => (
                        <FormItem>
                          <FormLabel>Session Length (minutes)</FormLabel>
                          <FormControl>
                            <div className="space-y-2">
                              <Slider
                                min={15}
                                max={120}
                                step={5}
                                value={[value]}
                                onValueChange={(vals) => onChange(vals[0])}
                              />
                              <div className="flex justify-between text-xs text-muted-foreground">
                                <span>15</span>
                                <span>30</span>
                                <span>45</span>
                                <span>60</span>
                                <span>75</span>
                                <span>90</span>
                                <span>120</span>
                              </div>
                              <div className="text-center font-medium">
                                {value} minutes
                              </div>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="equipment"
                      render={() => (
                        <FormItem>
                          <div className="mb-4">
                            <FormLabel>Available Equipment</FormLabel>
                            <FormDescription>
                              Select all equipment you have access to
                            </FormDescription>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                            <FormField
                              control={form.control}
                              name="equipment.none"
                              render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value}
                                      onCheckedChange={(checked) => {
                                        field.onChange(checked)
                                        if (checked) {
                                          Object.keys(form.getValues('equipment')).forEach(key => {
                                            if (key !== 'none') {
                                              form.setValue(`equipment.${key}`, false)
                                            }
                                          })
                                        }
                                      }}
                                    />
                                  </FormControl>
                                  <div className="space-y-1 leading-none">
                                    <FormLabel className="flex items-center gap-1">
                                      <Home className="h-3 w-3" />
                                      <span>None/Bodyweight</span>
                                    </FormLabel>
                                  </div>
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="equipment.dumbbells"
                              render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value}
                                      onCheckedChange={field.onChange}
                                      disabled={noneSelected}
                                    />
                                  </FormControl>
                                  <div className="space-y-1 leading-none">
                                    <FormLabel className="flex items-center gap-1">
                                      <Dumbbell className="h-3 w-3" />
                                      <span>Dumbbells</span>
                                    </FormLabel>
                                  </div>
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="equipment.barbell"
                              render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value}
                                      onCheckedChange={field.onChange}
                                      disabled={noneSelected}
                                    />
                                  </FormControl>
                                  <div className="space-y-1 leading-none">
                                    <FormLabel>Barbell</FormLabel>
                                  </div>
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="equipment.kettlebells"
                              render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value}
                                      onCheckedChange={field.onChange}
                                      disabled={noneSelected}
                                    />
                                  </FormControl>
                                  <div className="space-y-1 leading-none">
                                    <FormLabel>Kettlebells</FormLabel>
                                  </div>
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="equipment.resistanceBands"
                              render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value}
                                      onCheckedChange={field.onChange}
                                      disabled={noneSelected}
                                    />
                                  </FormControl>
                                  <div className="space-y-1 leading-none">
                                    <FormLabel>Resistance Bands</FormLabel>
                                  </div>
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="equipment.pullupBar"
                              render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value}
                                      onCheckedChange={field.onChange}
                                      disabled={noneSelected}
                                    />
                                  </FormControl>
                                  <div className="space-y-1 leading-none">
                                    <FormLabel>Pull-up Bar</FormLabel>
                                  </div>
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="equipment.bench"
                              render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value}
                                      onCheckedChange={field.onChange}
                                      disabled={noneSelected}
                                    />
                                  </FormControl>
                                  <div className="space-y-1 leading-none">
                                    <FormLabel>Bench</FormLabel>
                                  </div>
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="equipment.machines"
                              render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value}
                                      onCheckedChange={field.onChange}
                                      disabled={noneSelected}
                                    />
                                  </FormControl>
                                  <div className="space-y-1 leading-none">
                                    <FormLabel>Gym Machines</FormLabel>
                                  </div>
                                </FormItem>
                              )}
                            />
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="focusAreas"
                      render={() => (
                        <FormItem>
                          <div className="mb-4">
                            <FormLabel>Focus Areas</FormLabel>
                            <FormDescription>
                              Select the areas you want to focus on
                            </FormDescription>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                            <FormField
                              control={form.control}
                              name="focusAreas.fullBody"
                              render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value}
                                      onCheckedChange={(checked) => {
                                        field.onChange(checked)
                                        if (checked) {
                                          Object.keys(form.getValues('focusAreas')).forEach(key => {
                                            if (key !== 'fullBody') {
                                              form.setValue(`focusAreas.${key}`, false)
                                            }
                                          })
                                        }
                                      }}
                                    />
                                  </FormControl>
                                  <div className="space-y-1 leading-none">
                                    <FormLabel className="flex items-center gap-1">
                                      <Users className="h-3 w-3" />
                                      <span>Full Body</span>
                                    </FormLabel>
                                  </div>
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="focusAreas.upperBody"
                              render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value}
                                      onCheckedChange={field.onChange}
                                      disabled={fullBodySelected}
                                    />
                                  </FormControl>
                                  <div className="space-y-1 leading-none">
                                    <FormLabel>Upper Body</FormLabel>
                                  </div>
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="focusAreas.lowerBody"
                              render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value}
                                      onCheckedChange={field.onChange}
                                      disabled={fullBodySelected}
                                    />
                                  </FormControl>
                                  <div className="space-y-1 leading-none">
                                    <FormLabel>Lower Body</FormLabel>
                                  </div>
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="focusAreas.core"
                              render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value}
                                      onCheckedChange={field.onChange}
                                      disabled={fullBodySelected}
                                    />
                                  </FormControl>
                                  <div className="space-y-1 leading-none">
                                    <FormLabel>Core</FormLabel>
                                  </div>
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="focusAreas.back"
                              render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value}
                                      onCheckedChange={field.onChange}
                                      disabled={fullBodySelected}
                                    />
                                  </FormControl>
                                  <div className="space-y-1 leading-none">
                                    <FormLabel>Back</FormLabel>
                                  </div>
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="focusAreas.chest"
                              render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value}
                                      onCheckedChange={field.onChange}
                                      disabled={fullBodySelected}
                                    />
                                  </FormControl>
                                  <div className="space-y-1 leading-none">
                                    <FormLabel>Chest</FormLabel>
                                  </div>
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="focusAreas.shoulders"
                              render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value}
                                      onCheckedChange={field.onChange}
                                      disabled={fullBodySelected}
                                    />
                                  </FormControl>
                                  <div className="space-y-1 leading-none">
                                    <FormLabel>Shoulders</FormLabel>
                                  </div>
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="focusAreas.arms"
                              render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value}
                                      onCheckedChange={field.onChange}
                                      disabled={fullBodySelected}
                                    />
                                  </FormControl>
                                  <div className="space-y-1 leading-none">
                                    <FormLabel>Arms</FormLabel>
                                  </div>
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="focusAreas.legs"
                              render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value}
                                      onCheckedChange={field.onChange}
                                      disabled={fullBodySelected}
                                    />
                                  </FormControl>
                                  <div className="space-y-1 leading-none">
                                    <FormLabel>Legs</FormLabel>
                                  </div>
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="focusAreas.glutes"
                              render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value}
                                      onCheckedChange={field.onChange}
                                      disabled={fullBodySelected}
                                    />
                                  </FormControl>
                                  <div className="space-y-1 leading-none">
                                    <FormLabel>Glutes</FormLabel>
                                  </div>
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="focusAreas.cardio"
                              render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value}
                                      onCheckedChange={field.onChange}
                                      disabled={fullBodySelected}
                                    />
                                  </FormControl>
                                  <div className="space-y-1 leading-none">
                                    <FormLabel>Cardio</FormLabel>
                                  </div>
                                </FormItem>
                              )}
                            />
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Button type="submit" className="w-full">
                    Create My Workout Plan
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="results" className="space-y-4 mt-4">
          {results && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    <span>Your Custom Workout Plan</span>
                  </CardTitle>
                  <CardDescription>
                    Based on your preferences, here's your personalized workout plan
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex flex-col items-center p-4 bg-muted rounded-lg">
                      <Target className="h-8 w-8 mb-2 text-primary" />
                      <div className="text-lg font-medium">Goal</div>
                      <div className="text-center">
                        {results.goal === 'strength' && 'Build Strength'}
                        {results.goal === 'hypertrophy' && 'Build Muscle'}
                        {results.goal === 'endurance' && 'Improve Endurance'}
                        {results.goal === 'weight-loss' && 'Lose Weight'}
                        {results.goal === 'general' && 'General Fitness'}
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-center p-4 bg-muted rounded-lg">
                      <Calendar className="h-8 w-8 mb-2 text-primary" />
                      <div className="text-lg font-medium">Frequency</div>
                      <div className="text-center">
                        {results.daysPerWeek} days per week
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-center p-4 bg-muted rounded-lg">
                      <Clock className="h-8 w-8 mb-2 text-primary" />
                      <div className="text-lg font-medium">Duration</div>
                      <div className="text-center">
                        {results.sessionLength} minutes per session
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">Training Parameters</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      <div className="p-3 bg-muted rounded-lg">
                        <div className="text-sm text-muted-foreground">Sets</div>
                        <div className="font-medium">{results.params.sets}</div>
                      </div>
                      <div className="p-3 bg-muted rounded-lg">
                        <div className="text-sm text-muted-foreground">Reps</div>
                        <div className="font-medium">{results.params.reps}</div>
                      </div>
                      <div className="p-3 bg-muted rounded-lg">
                        <div className="text-sm text-muted-foreground">Rest</div>
                        <div className="font-medium">{results.params.rest}</div>
                      </div>
                      <div className="p-3 bg-muted rounded-lg">
                        <div className="text-sm text-muted-foreground">Tempo</div>
                        <div className="font-medium">{results.params.tempo}</div>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Weekly Schedule</h3>
                    <Accordion type="single" collapsible className="w-full">
                      {results.workouts.map((workout, index) => (
                        <AccordionItem key={index} value={`day-${index}`}>
                          <AccordionTrigger className="hover:bg-muted/50 px-4 rounded-md">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="mr-2">Day {index + 1}</Badge>
                              {workout.day.split(': ')[1]}
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="px-4">
                            <div className="space-y-4 py-2">
                              <div className="grid grid-cols-1 md:grid-cols-[1fr_100px_100px_100px] gap-2 font-medium text-sm">
                                <div>Exercise</div>
                                <div className="text-center">Sets</div>
                                <div className="text-center">Reps</div>
                                <div className="text-center">Rest</div>
                              </div>
                              <Separator />
                              {workout.exercises.map((exercise, exIndex) => (
                                <div key={exIndex} className="grid grid-cols-1 md:grid-cols-[1fr_100px_100px_100px] gap-2 items-center">
                                  <div>{exercise.name}</div>
                                  <div className="text-center">{exercise.sets}</div>
                                  <div className="text-center">{exercise.reps}</div>
                                  <div className="text-center">{exercise.rest}</div>
                                </div>
                              ))}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </div>

                  <div className="bg-muted p-4 rounded-lg">
                    <div className="flex items-start gap-2">
                      <Info className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                      <div className="text-sm">
                        <p className="font-medium">Workout Tips:</p>
                        <ul className="list-disc list-inside space-y-1 mt-2 text-muted-foreground">
                          <li>Always warm up for 5-10 minutes before starting your workout</li>
                          <li>Focus on proper form rather than lifting heavier weights</li>
                          <li>Stay hydrated throughout your workout</li>
                          <li>Allow 48 hours of rest for muscle groups between training sessions</li>
                          <li>Adjust weights as needed to stay within the recommended rep ranges</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" onClick={() => setActiveTab('form')}>
                    Modify Plan
                  </Button>
                  <Button>
                    <Download className="mr-2 h-4 w-4" />
                    Save Plan
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}