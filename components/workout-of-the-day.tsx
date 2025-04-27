"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dumbbell, Clock, Calendar, ChevronRight } from "lucide-react"
import Link from "next/link"

export default function WorkoutOfTheDay() {
  const [workout, setWorkout] = useState<{
    title: string
    description: string
    level: string
    duration: string
    category: string
    image: string
    exercises: string[]
    href: string
  } | null>(null)

  const [date, setDate] = useState("")

  useEffect(() => {
    // Get today's date in a readable format
    const today = new Date()
    setDate(today.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" }))

    // Simulate fetching workout of the day
    // In a real app, this would come from an API
    const workouts = [
      {
        title: "Full Body HIIT Blast",
        description: "A high-intensity full body workout to boost your metabolism and burn calories all day long.",
        level: "Intermediate",
        duration: "30 min",
        category: "HIIT",
        image: "/workouts/hiit-fat-burn.jpg",
        exercises: ["Burpees", "Mountain Climbers", "Jump Squats", "Push-ups", "Plank Jacks"],
        href: "/workouts/hiit/full-body-hiit",
      },
      {
        title: "Core Crusher",
        description: "Focus on your core with this targeted ab workout that will leave your midsection burning.",
        level: "All Levels",
        duration: "20 min",
        category: "Strength",
        image: "/workouts/full-body-burn.jpg",
        exercises: ["Crunches", "Russian Twists", "Plank", "Bicycle Kicks", "Leg Raises"],
        href: "/workouts/strength/core-crusher",
      },
      {
        title: "Morning Energizer",
        description: "Start your day right with this quick but effective full body workout to boost your energy.",
        level: "Beginner",
        duration: "15 min",
        category: "Cardio",
        image: "/workouts/cardio-blast.jpg",
        exercises: ["Jumping Jacks", "High Knees", "Bodyweight Squats", "Push-ups", "Plank"],
        href: "/workouts/cardio/morning-energizer",
      },
    ]

    // Select workout based on day of week to ensure it changes daily
    const dayOfWeek = today.getDay()
    const workoutIndex = dayOfWeek % workouts.length
    setWorkout(workouts[workoutIndex])
  }, [])

  if (!workout) {
    return <div className="h-40 flex items-center justify-center">Loading today's workout...</div>
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="relative aspect-video md:aspect-auto">
            <img src={workout.image || "/placeholder.svg"} alt={workout.title} className="object-cover w-full h-full" />
            <div className="absolute top-4 left-4">
              <Badge className="bg-primary text-white">{date}</Badge>
            </div>
          </div>
          <div className="p-6">
            <CardHeader className="p-0 pb-4">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline" className="bg-primary/10 text-primary">
                  Workout of the Day
                </Badge>
              </div>
              <CardTitle className="text-2xl">{workout.title}</CardTitle>
              <CardDescription className="flex items-center gap-2 mt-1">
                <span className="flex items-center gap-1">
                  <Dumbbell className="h-3 w-3" /> {workout.level}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" /> {workout.duration}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" /> {workout.category}
                </span>
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0 pb-4">
              <p className="text-muted-foreground mb-4">{workout.description}</p>
              <div>
                <h4 className="font-medium mb-2">Exercises:</h4>
                <ul className="grid grid-cols-2 gap-2">
                  {workout.exercises.map((exercise, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-xs text-primary font-medium">
                        {index + 1}
                      </div>
                      <span>{exercise}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
            <CardFooter className="p-0">
              <Button asChild className="w-full bg-primary hover:bg-primary/90">
                <Link href={workout.href}>
                  Start Workout <ChevronRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </div>
        </div>
      </Card>
    </div>
  )
}
