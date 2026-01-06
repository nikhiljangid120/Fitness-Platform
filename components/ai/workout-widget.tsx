"use client"

import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, Dumbbell, Zap, ChevronRight, PlayCircle } from "lucide-react"
import { motion } from "framer-motion"

interface WorkoutExercise {
    name: string
    sets: string
    reps: string
    notes?: string
}

interface WorkoutPlan {
    title: string
    duration: string
    level: string
    focus: string
    exercises: WorkoutExercise[]
}

export function WorkoutAIWidget({ data }: { data: WorkoutPlan }) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md my-4"
        >
            <Card className="overflow-hidden border-none shadow-lg bg-gradient-to-br from-card to-secondary/10">
                <CardHeader className="pb-2 bg-primary/5">
                    <div className="flex justify-between items-start">
                        <div>
                            <CardTitle className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">
                                {data.title}
                            </CardTitle>
                            <div className="flex gap-2 mt-2">
                                <Badge variant="outline" className="flex gap-1 items-center px-2 py-0.5">
                                    <Clock className="w-3 h-3" /> {data.duration}
                                </Badge>
                                <Badge variant="secondary" className="flex gap-1 items-center px-2 py-0.5">
                                    <Zap className="w-3 h-3" /> {data.level}
                                </Badge>
                            </div>
                        </div>
                        <div className="p-2 bg-primary/10 rounded-full">
                            <Dumbbell className="w-5 h-5 text-primary" />
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-4 space-y-4">
                    <div className="space-y-3">
                        {data.exercises.map((exercise, idx) => (
                            <div key={idx} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors border border-transparent hover:border-border/50">
                                <div className="flex items-center gap-3">
                                    <div className="h-6 w-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">
                                        {idx + 1}
                                    </div>
                                    <div>
                                        <p className="font-medium text-sm leading-none">{exercise.name}</p>
                                        {exercise.notes && <p className="text-xs text-muted-foreground mt-1">{exercise.notes}</p>}
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className="text-xs font-mono font-medium bg-muted px-2 py-1 rounded">
                                        {exercise.sets} x {exercise.reps}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
                <CardFooter className="bg-primary/5 p-3">
                    <Button className="w-full gap-2 shadow-md hover:shadow-lg transition-all" size="sm">
                        <PlayCircle className="w-4 h-4" /> Start Workout
                    </Button>
                </CardFooter>
            </Card>
        </motion.div>
    )
}
