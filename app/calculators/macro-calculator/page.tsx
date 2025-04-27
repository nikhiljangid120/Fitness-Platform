"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { motion } from "framer-motion"
import { Calculator, ChevronRight, Info, Target, Utensils } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Progress } from "@/components/ui/progress"

const formSchema = z.object({
  gender: z.enum(["male", "female"]),
  age: z.coerce.number().min(15).max(100),
  weight: z.coerce.number().min(40).max(200),
  height: z.coerce.number().min(140).max(220),
  activityLevel: z.enum(["sedentary", "light", "moderate", "active", "veryActive"]),
  goal: z.enum(["lose", "maintain", "gain"]),
  rate: z.coerce.number().min(0).max(2),
})

type FormValues = z.infer<typeof formSchema>

const activityLevelMap = {
  sedentary: { label: "Sedentary (little or no exercise)", factor: 1.2 },
  light: { label: "Lightly active (light exercise 1-3 days/week)", factor: 1.375 },
  moderate: { label: "Moderately active (moderate exercise 3-5 days/week)", factor: 1.55 },
  active: { label: "Active (hard exercise 6-7 days/week)", factor: 1.725 },
  veryActive: { label: "Very active (very hard exercise & physical job)", factor: 1.9 },
}

const goalMap = {
  lose: { label: "Lose weight", factor: -1 },
  maintain: { label: "Maintain weight", factor: 0 },
  gain: { label: "Gain weight", factor: 1 },
}

export default function MacroCalculator() {
  const [results, setResults] = useState<{
    calories: number
    protein: number
    carbs: number
    fat: number
  } | null>(null)

  const [activeTab, setActiveTab] = useState("form")

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      gender: "male",
      age: 30,
      weight: 70,
      height: 175,
      activityLevel: "moderate",
      goal: "maintain",
      rate: 0.5,
    },
  })

  function calculateMacros(data: FormValues) {
    // Calculate BMR using Mifflin-St Jeor Equation
    let bmr = 0
    if (data.gender === "male") {
      bmr = 10 * data.weight + 6.25 * data.height - 5 * data.age + 5
    } else {
      bmr = 10 * data.weight + 6.25 * data.height - 5 * data.age - 161
    }

    // Calculate TDEE (Total Daily Energy Expenditure)
    const activityFactor = activityLevelMap[data.activityLevel].factor
    const tdee = bmr * activityFactor

    // Adjust calories based on goal
    const goalFactor = goalMap[data.goal].factor
    const calorieAdjustment = goalFactor * data.rate * 500 // 500 calories per 0.5kg/week
    const targetCalories = Math.round(tdee + calorieAdjustment)

    // Calculate macros
    // Protein: 2g per kg of bodyweight (or adjusted based on goals)
    let proteinRatio = 0.3 // 30% of calories from protein
    if (data.goal === "gain") proteinRatio = 0.25 // 25% for muscle gain
    if (data.goal === "lose") proteinRatio = 0.35 // 35% for weight loss

    const proteinCalories = targetCalories * proteinRatio
    const proteinGrams = Math.round(proteinCalories / 4) // 4 calories per gram of protein

    // Fat: minimum 20% of calories
    let fatRatio = 0.25 // 25% of calories from fat
    if (data.goal === "lose") fatRatio = 0.3 // 30% for weight loss

    const fatCalories = targetCalories * fatRatio
    const fatGrams = Math.round(fatCalories / 9) // 9 calories per gram of fat

    // Remaining calories from carbs
    const carbCalories = targetCalories - proteinCalories - fatCalories
    const carbGrams = Math.round(carbCalories / 4) // 4 calories per gram of carbs

    return {
      calories: targetCalories,
      protein: proteinGrams,
      carbs: carbGrams,
      fat: fatGrams,
    }
  }

  function onSubmit(data: FormValues) {
    const macros = calculateMacros(data)
    setResults(macros)
    setActiveTab("results")
  }

  return (
    <div className="container max-w-5xl py-10 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Macro Calculator</h1>
        <p className="text-muted-foreground">Calculate your ideal protein, carb, and fat intake based on your goals</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="form">Calculator</TabsTrigger>
          <TabsTrigger value="results" disabled={!results}>
            Results
          </TabsTrigger>
        </TabsList>

        <TabsContent value="form" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                <span>Your Information</span>
              </CardTitle>
              <CardDescription>Enter your details to calculate your ideal macronutrient ratios</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="gender"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel>Gender</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="flex gap-4"
                            >
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="male" />
                                </FormControl>
                                <FormLabel className="font-normal">Male</FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="female" />
                                </FormControl>
                                <FormLabel className="font-normal">Female</FormLabel>
                              </FormItem>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="age"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Age (years)</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="weight"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Weight (kg)</FormLabel>
                          <FormControl>
                            <Input type="number" step="0.1" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="height"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Height (cm)</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="activityLevel"
                      render={({ field }) => (
                        <FormItem className="col-span-1 md:col-span-2">
                          <FormLabel>Activity Level</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select your activity level" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {Object.entries(activityLevelMap).map(([value, { label }]) => (
                                <SelectItem key={value} value={value}>
                                  {label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="goal"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Goal</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select your goal" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {Object.entries(goalMap).map(([value, { label }]) => (
                                <SelectItem key={value} value={value}>
                                  {label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {form.watch("goal") !== "maintain" && (
                      <FormField
                        control={form.control}
                        name="rate"
                        render={({ field: { value, onChange } }) => (
                          <FormItem>
                            <FormLabel>
                              {form.watch("goal") === "lose" ? "Weight Loss" : "Weight Gain"} Rate (kg/week)
                            </FormLabel>
                            <FormControl>
                              <div className="space-y-2">
                                <Slider
                                  min={0}
                                  max={2}
                                  step={0.1}
                                  value={[value]}
                                  onValueChange={(vals) => onChange(vals[0])}
                                />
                                <div className="flex justify-between text-xs text-muted-foreground">
                                  <span>0.0</span>
                                  <span>0.5</span>
                                  <span>1.0</span>
                                  <span>1.5</span>
                                  <span>2.0</span>
                                </div>
                                <div className="text-center font-medium">{value} kg per week</div>
                              </div>
                            </FormControl>
                            <FormDescription>
                              {form.watch("goal") === "lose"
                                ? "Recommended: 0.5-1kg per week for sustainable weight loss"
                                : "Recommended: 0.25-0.5kg per week for lean muscle gain"}
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                  </div>

                  <Button type="submit" className="w-full">
                    Calculate My Macros
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="results" className="space-y-4 mt-4">
          {results && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    <span>Your Personalized Macro Plan</span>
                  </CardTitle>
                  <CardDescription>
                    Based on your information and goals, here are your recommended daily macros
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex flex-col md:flex-row gap-4 justify-between">
                    <div className="flex-1 flex flex-col items-center p-4 bg-muted rounded-lg">
                      <Utensils className="h-8 w-8 mb-2 text-primary" />
                      <div className="text-3xl font-bold">{results.calories}</div>
                      <div className="text-sm text-muted-foreground">Daily Calories</div>
                    </div>

                    <div className="flex-1 flex flex-col items-center p-4 bg-muted rounded-lg">
                      <div className="text-3xl font-bold">{results.protein}g</div>
                      <div className="text-sm text-muted-foreground">Protein</div>
                      <div className="text-xs">{Math.round(results.protein * 4)} calories</div>
                      <Progress
                        value={Math.round(((results.protein * 4) / results.calories) * 100)}
                        className="h-2 mt-2 bg-primary/20"
                      />
                    </div>

                    <div className="flex-1 flex flex-col items-center p-4 bg-muted rounded-lg">
                      <div className="text-3xl font-bold">{results.carbs}g</div>
                      <div className="text-sm text-muted-foreground">Carbs</div>
                      <div className="text-xs">{Math.round(results.carbs * 4)} calories</div>
                      <Progress
                        value={Math.round(((results.carbs * 4) / results.calories) * 100)}
                        className="h-2 mt-2 bg-primary/20"
                      />
                    </div>

                    <div className="flex-1 flex flex-col items-center p-4 bg-muted rounded-lg">
                      <div className="text-3xl font-bold">{results.fat}g</div>
                      <div className="text-sm text-muted-foreground">Fat</div>
                      <div className="text-xs">{Math.round(results.fat * 9)} calories</div>
                      <Progress
                        value={Math.round(((results.fat * 9) / results.calories) * 100)}
                        className="h-2 mt-2 bg-primary/20"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Macro Breakdown</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                          <span>Protein</span>
                        </div>
                        <div className="text-sm">{Math.round(((results.protein * 4) / results.calories) * 100)}%</div>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-green-500"></div>
                          <span>Carbs</span>
                        </div>
                        <div className="text-sm">{Math.round(((results.carbs * 4) / results.calories) * 100)}%</div>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                          <span>Fat</span>
                        </div>
                        <div className="text-sm">{Math.round(((results.fat * 9) / results.calories) * 100)}%</div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-muted p-4 rounded-lg">
                    <div className="flex items-start gap-2">
                      <Info className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                      <div className="text-sm">
                        <p className="font-medium">How to use your macros:</p>
                        <ul className="list-disc list-inside space-y-1 mt-2 text-muted-foreground">
                          <li>Track your food intake using a nutrition app</li>
                          <li>Aim to get within 5-10% of each macro target daily</li>
                          <li>Prioritize whole, nutrient-dense foods</li>
                          <li>Adjust your macros if you're not seeing results after 2-3 weeks</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" onClick={() => setActiveTab("form")}>
                    Recalculate
                  </Button>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button>Save Results</Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Coming soon: Save your results to your profile</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </CardFooter>
              </Card>
            </motion.div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
