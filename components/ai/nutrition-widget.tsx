"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Utensils, Apple, Info, RefreshCw } from "lucide-react"
import { motion } from "framer-motion"

interface Macro {
    label: string
    value: string
    color: string
}

interface Meal {
    name: string
    calories: string
    protein: string
}

interface NutritionPlan {
    title: string
    totalCalories: string
    macros: Macro[]
    meals: Meal[]
}

export function NutritionAIWidget({ data }: { data: NutritionPlan }) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md my-4"
        >
            <Card className="overflow-hidden border-none shadow-lg bg-gradient-to-br from-green-50/50 to-emerald-100/30 dark:from-green-950/20 dark:to-emerald-900/10">
                <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                        <CardTitle className="text-lg font-bold flex items-center gap-2">
                            <Utensils className="w-5 h-5 text-green-600" />
                            {data.title}
                        </CardTitle>
                        <Badge className="bg-green-600 hover:bg-green-700">{data.totalCalories} kcal</Badge>
                    </div>
                </CardHeader>
                <CardContent className="p-4 space-y-4">
                    {/* Macros */}
                    <div className="flex justify-between gap-2">
                        {data.macros.map((macro, i) => (
                            <div key={i} className="flex-1 text-center p-2 rounded-xl bg-background/60 shadow-sm border">
                                <div className={`w-2 h-2 rounded-full mx-auto mb-1 ${macro.color}`} />
                                <p className="text-xs text-muted-foreground uppercase tracking-wider">{macro.label}</p>
                                <p className="font-bold text-sm">{macro.value}</p>
                            </div>
                        ))}
                    </div>

                    {/* Meals */}
                    <div className="space-y-2">
                        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Suggested Meals</h4>
                        {data.meals.map((meal, i) => (
                            <div key={i} className="flex justify-between items-center p-3 rounded-lg bg-white/50 dark:bg-black/20 hover:bg-white/80 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="p-1.5 rounded-md bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">
                                        <Apple className="w-4 h-4" />
                                    </div>
                                    <span className="font-medium text-sm">{meal.name}</span>
                                </div>
                                <div className="text-xs text-muted-foreground flex flex-col items-end">
                                    <span>{meal.calories} kcal</span>
                                    <span className="text-green-600 font-medium">{meal.protein} pro</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    )
}
