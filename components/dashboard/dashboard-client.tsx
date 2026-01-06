"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Dumbbell, Utensils, BarChart3, CalendarIcon, Trophy, CheckCircle2, Flame, Loader2, Sparkles } from "lucide-react"
import Link from "next/link"
import { workoutCategories } from "@/data/workouts"
import { mealPlans } from "@/data/nutrition"
import ProgressChart from "@/components/progress-chart"
import FitnessTip from "@/components/fitness-tip"
import { User } from "@prisma/client"
import { useToast } from "@/hooks/use-toast"

interface DashboardProps {
    user: User | null
    stats: {
        streak: number
        workoutsCompleted: number
        currentWeight: number
        targetWeight: number // fallback target
        startWeight: number
    }
}

export default function DashboardClient({ user, stats }: DashboardProps) {
    const [date, setDate] = useState<Date | undefined>(new Date())
    const [waterIntake, setWaterIntake] = useState(3)
    const maxWaterIntake = 8
    const { toast } = useToast()

    // Fallback data if user is missing specific fields
    const userData = {
        name: user?.name || "Member",
        goal: user?.fitnessGoal || "Get Fit",
        streak: stats.streak,
        workoutsCompleted: stats.workoutsCompleted,
        currentWeight: user?.weight || stats.currentWeight,
        targetWeight: stats.targetWeight,
        startWeight: stats.startWeight,
    }

    // AI Plan State
    const [aiPlan, setAiPlan] = useState<any[] | null>(null)
    const [isGeneratingPlan, setIsGeneratingPlan] = useState(false)

    // Use AI plan if available, otherwise fallback to static for demo
    const currentWorkoutPlan = aiPlan || [
        { day: "Monday", workout: workoutCategories[0].workouts[0], completed: true },
        { day: "Tuesday", workout: workoutCategories[2].workouts[1], completed: true },
        { day: "Wednesday", workout: null, completed: false, rest: true },
        { day: "Thursday", workout: workoutCategories[4].workouts[0], completed: false },
        { day: "Friday", workout: workoutCategories[1].workouts[1], completed: false },
        { day: "Saturday", workout: workoutCategories[3].workouts[0], completed: false },
        { day: "Sunday", workout: null, completed: false, rest: true },
    ]

    // Handler for generating plan
    const handleGeneratePlan = async () => {
        setIsGeneratingPlan(true)
        toast({ title: "Generating Plan...", description: "Consulting AI Trainer..." })

        try {
            // Dynamically import action to avoid server component issues in client
            const { generateWeeklyPlan } = await import("@/app/actions/plan")
            const result = await generateWeeklyPlan()

            if (result.success && result.plan?.planData) {
                setAiPlan(result.plan.planData as any[])
                toast({ title: "Plan Ready!", description: "Your custom workout plan has been created." })
            } else {
                toast({ variant: "destructive", title: "Error", description: "Failed to generate plan." })
            }
        } catch (e) {
            console.error(e)
            toast({ variant: "destructive", title: "Error", description: "Something went wrong." })
        } finally {
            setIsGeneratingPlan(false)
        }
    }

    // Sample meal plan - static for now
    const mealPlan = mealPlans[0]

    // Calculate progress percentage
    const weightLossProgress = Math.max(0, Math.min(100, Math.round(
        ((userData.startWeight - userData.currentWeight) / (userData.startWeight - userData.targetWeight)) * 100
    )))

    // Fitness tips
    const fitnessTips = [
        "Drink water before meals to help control your appetite and stay hydrated.",
        "Aim for 7-9 hours of quality sleep to optimize recovery and hormone balance.",
        "Include protein in every meal to support muscle recovery and growth.",
        "Don't forget to stretch after workouts to improve flexibility and reduce soreness.",
        "Small, consistent progress is better than sporadic intense efforts.",
    ]

    const [randomTip] = useState(() => fitnessTips[Math.floor(Math.random() * fitnessTips.length)])

    return (
        <div className="container py-8 md:py-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Welcome back, {userData.name}</h1>
                    <p className="text-muted-foreground mt-2">Track your progress and follow your personalized fitness plan</p>
                </div>
                <Button asChild className="bg-primary hover:bg-primary/90">
                    <Link href="/ai-trainer">Talk to AI Trainer</Link>
                </Button>
            </div>

            <FitnessTip title="Daily Tip">{randomTip}</FitnessTip>

            {/* Progress Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 mt-8">
                <Card className="progress-card">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Weight Progress</CardTitle>
                        <CardDescription>
                            Current: {userData.currentWeight}kg • Target: {userData.targetWeight}kg
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Progress value={weightLossProgress} className="h-2 mb-2 bg-muted overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-orange-500 to-red-500"
                                style={{ width: `${weightLossProgress}%` }}
                            />
                        </Progress>
                        <p className="text-sm text-muted-foreground">{weightLossProgress}% of goal achieved</p>
                    </CardContent>
                </Card>

                <Card className="progress-card">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Workout Streak</CardTitle>
                        <CardDescription>Keep your momentum going!</CardDescription>
                    </CardHeader>
                    <CardContent className="flex items-center gap-4">
                        <div className="h-14 w-14 rounded-full bg-primary/20 flex items-center justify-center">
                            <Flame className="h-7 w-7 text-primary" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold">{userData.streak} days</p>
                            <p className="text-sm text-muted-foreground">Current streak</p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="progress-card">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Water Intake</CardTitle>
                        <CardDescription>Daily goal: {maxWaterIntake} glasses</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-2 mb-2">
                            {Array.from({ length: maxWaterIntake }).map((_, i) => (
                                <button
                                    key={i}
                                    className={`h-8 w-5 rounded-sm transition-colors ${i < waterIntake ? "bg-blue-500" : "bg-muted"}`}
                                    onClick={() => setWaterIntake(i + 1)}
                                />
                            ))}
                        </div>
                        <p className="text-sm text-muted-foreground">
                            {waterIntake} of {maxWaterIntake} glasses
                        </p>
                    </CardContent>
                </Card>
            </div>

            <Tabs defaultValue="workout" className="w-full">
                <div className="flex justify-between items-center mb-8">
                    <TabsList className="flex flex-wrap gap-2 w-auto overflow-x-auto pb-1">
                        <TabsTrigger value="workout" className="flex-1 min-w-[120px] flex items-center gap-2">
                            <Dumbbell className="h-4 w-4" />
                            <span className="hidden sm:inline">Workout Plan</span>
                            <span className="sm:hidden">Workout</span>
                        </TabsTrigger>
                        <TabsTrigger value="nutrition" className="flex-1 min-w-[120px] flex items-center gap-2">
                            <Utensils className="h-4 w-4" />
                            <span className="hidden sm:inline">Nutrition Plan</span>
                            <span className="sm:hidden">Nutrition</span>
                        </TabsTrigger>
                        <TabsTrigger value="calendar" className="flex-1 min-w-[120px] flex items-center gap-2">
                            <CalendarIcon className="h-4 w-4" />
                            <span>Calendar</span>
                        </TabsTrigger>
                        <TabsTrigger value="progress" className="flex-1 min-w-[120px] flex items-center gap-2">
                            <BarChart3 className="h-4 w-4" />
                            <span>Progress</span>
                        </TabsTrigger>
                    </TabsList>

                    <Button onClick={handleGeneratePlan} disabled={isGeneratingPlan} variant="outline" className="hidden md:flex gap-2">
                        {isGeneratingPlan ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4 text-purple-500" />}
                        {isGeneratingPlan ? "Generating..." : "Generate AI Plan"}
                    </Button>
                </div>

                {/* Workout Plan Tab */}
                <TabsContent value="workout" className="space-y-6">
                    <div className="md:hidden mb-4">
                        <Button onClick={handleGeneratePlan} disabled={isGeneratingPlan} variant="outline" className="w-full gap-2">
                            {isGeneratingPlan ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4 text-purple-500" />}
                            Generate AI Plan
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                        {currentWorkoutPlan.map((day, index) => (
                            <Card key={index} className={`workout-card ${day.completed ? "border-green-500" : ""}`}>
                                <CardHeader>
                                    <div className="flex justify-between items-center">
                                        <CardTitle>{day.day}</CardTitle>
                                        {day.completed && <CheckCircle2 className="h-5 w-5 text-green-500" />}
                                    </div>
                                    {day.rest ? (
                                        <CardDescription>Rest Day</CardDescription>
                                    ) : (
                                        <CardDescription>
                                            {day.workout?.level} • {day.workout?.duration}
                                        </CardDescription>
                                    )}
                                </CardHeader>
                                <CardContent>
                                    {day.rest ? (
                                        <p className="text-muted-foreground">Take time to recover and recharge.</p>
                                    ) : (
                                        <>
                                            <h3 className="font-semibold mb-2">{day.workout?.title}</h3>
                                            <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{day.workout?.description}</p>
                                            <div className="flex flex-wrap gap-2">
                                                {day.workout?.equipment.map((item: string, i: number) => (
                                                    <Badge key={i} variant="outline">
                                                        {item}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </>
                                    )}
                                </CardContent>
                                <CardFooter>
                                    {!day.rest && (
                                        <Button
                                            asChild
                                            variant={day.completed ? "outline" : "default"}
                                            className={`w-full ${!day.completed ? "bg-primary hover:bg-primary/90" : ""}`}
                                        >
                                            <Link href={day.workout ? `/workouts/${day.workout.id}` : "#"}>
                                                {day.completed ? "View Details" : "Start Workout"}
                                            </Link>
                                        </Button>
                                    )}
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                </TabsContent>

                {/* Nutrition Plan Tab */}
                <TabsContent value="nutrition" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>{mealPlan.title}</CardTitle>
                            <CardDescription>
                                {mealPlan.diet} • Approx. {mealPlan.calories} calories per day
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="mb-4">{mealPlan.description}</p>

                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-lg font-semibold mb-3">Breakfast Options</h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {mealPlan.meals.breakfast.map((meal, index) => (
                                            <Card key={index} className="workout-card">
                                                <CardHeader className="p-4">
                                                    <CardTitle className="text-base">{meal.title}</CardTitle>
                                                    <CardDescription>{meal.calories} calories</CardDescription>
                                                </CardHeader>
                                                <CardContent className="p-4 pt-0">
                                                    <p className="text-sm font-medium mb-1">Ingredients:</p>
                                                    <ul className="text-sm text-muted-foreground space-y-1">
                                                        {meal.ingredients.map((ingredient, i) => (
                                                            <li key={i}>• {ingredient}</li>
                                                        ))}
                                                    </ul>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-lg font-semibold mb-3">Lunch Options</h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {mealPlan.meals.lunch.map((meal, index) => (
                                            <Card key={index} className="workout-card">
                                                <CardHeader className="p-4">
                                                    <CardTitle className="text-base">{meal.title}</CardTitle>
                                                    <CardDescription>{meal.calories} calories</CardDescription>
                                                </CardHeader>
                                                <CardContent className="p-4 pt-0">
                                                    <p className="text-sm font-medium mb-1">Ingredients:</p>
                                                    <ul className="text-sm text-muted-foreground space-y-1">
                                                        {meal.ingredients.map((ingredient, i) => (
                                                            <li key={i}>• {ingredient}</li>
                                                        ))}
                                                    </ul>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-lg font-semibold mb-3">Dinner Options</h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {mealPlan.meals.dinner.map((meal, index) => (
                                            <Card key={index} className="workout-card">
                                                <CardHeader className="p-4">
                                                    <CardTitle className="text-base">{meal.title}</CardTitle>
                                                    <CardDescription>{meal.calories} calories</CardDescription>
                                                </CardHeader>
                                                <CardContent className="p-4 pt-0">
                                                    <p className="text-sm font-medium mb-1">Ingredients:</p>
                                                    <ul className="text-sm text-muted-foreground space-y-1">
                                                        {meal.ingredients.map((ingredient, i) => (
                                                            <li key={i}>• {ingredient}</li>
                                                        ))}
                                                    </ul>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-lg font-semibold mb-3">Snack Options</h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {mealPlan.meals.snacks.map((meal, index) => (
                                            <Card key={index} className="workout-card">
                                                <CardHeader className="p-4">
                                                    <CardTitle className="text-base">{meal.title}</CardTitle>
                                                    <CardDescription>{meal.calories} calories</CardDescription>
                                                </CardHeader>
                                                <CardContent className="p-4 pt-0">
                                                    <p className="text-sm font-medium mb-1">Ingredients:</p>
                                                    <ul className="text-sm text-muted-foreground space-y-1">
                                                        {meal.ingredients.map((ingredient, i) => (
                                                            <li key={i}>• {ingredient}</li>
                                                        ))}
                                                    </ul>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button asChild className="bg-primary hover:bg-primary/90">
                                <Link href="/ai-trainer">Customize Meal Plan with AI</Link>
                            </Button>
                        </CardFooter>
                    </Card>
                </TabsContent>

                {/* Calendar Tab */}
                <TabsContent value="calendar" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Workout Calendar</CardTitle>
                            <CardDescription>View and plan your workouts</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex justify-center">
                                <Calendar mode="single" selected={date} onSelect={setDate} className="rounded-md border" />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Progress Tab */}
                <TabsContent value="progress" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Progress Tracking</CardTitle>
                            <CardDescription>Monitor your fitness journey</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-lg font-semibold mb-3">Weight Progress</h3>
                                    <ProgressChart
                                        title="Weight Tracking"
                                        data={[
                                            { date: "Jan 1", value: 80 },
                                            { date: "Jan 8", value: 79 },
                                            { date: "Jan 15", value: 78.2 },
                                            { date: "Jan 22", value: 77.5 },
                                            { date: "Jan 29", value: 76.8 },
                                            { date: "Feb 5", value: 76 },
                                            { date: "Feb 12", value: 75.5 },
                                            { date: "Feb 19", value: 75 },
                                        ]}
                                        yAxisLabel="Weight (kg)"
                                        color="#ff4500"
                                    />
                                </div>

                                <div>
                                    <h3 className="text-lg font-semibold mb-3">Workout Completion</h3>
                                    <ProgressChart
                                        title="Weekly Workouts"
                                        data={[
                                            { date: "Week 1", value: 3 },
                                            { date: "Week 2", value: 4 },
                                            { date: "Week 3", value: 3 },
                                            { date: "Week 4", value: 5 },
                                            { date: "Week 5", value: 4 },
                                            { date: "Week 6", value: 5 },
                                            { date: "Week 7", value: 6 },
                                            { date: "Week 8", value: 5 },
                                        ]}
                                        yAxisLabel="Workouts"
                                        color="#22c55e"
                                    />
                                </div>

                                <div>
                                    <h3 className="text-lg font-semibold mb-3">Achievements</h3>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        {[
                                            { title: "First Workout", description: "Completed your first workout", unlocked: true },
                                            { title: "Week Streak", description: "Worked out for 7 days in a row", unlocked: userData.streak >= 7 },
                                            { title: "Nutrition Master", description: "Followed meal plan for 14 days", unlocked: false },
                                            { title: "Weight Goal", description: "Reached your target weight", unlocked: userData.currentWeight <= userData.targetWeight },
                                        ].map((achievement, index) => (
                                            <Card
                                                key={index}
                                                className={`achievement-card ${achievement.unlocked ? "unlocked border-primary" : "opacity-70"}`}
                                            >
                                                <CardHeader className="p-4">
                                                    <div className="flex justify-center mb-2">
                                                        {achievement.unlocked ? (
                                                            <Trophy className="h-8 w-8 text-primary" />
                                                        ) : (
                                                            <Trophy className="h-8 w-8 text-muted-foreground" />
                                                        )}
                                                    </div>
                                                    <CardTitle className="text-center text-base">{achievement.title}</CardTitle>
                                                </CardHeader>
                                                <CardContent className="p-4 pt-0">
                                                    <p className="text-xs text-center text-muted-foreground">{achievement.description}</p>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
