"use client"

import { useParams, notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChevronLeft, Utensils, Clock, CalendarDays } from "lucide-react"
import Link from "next/link"
import { mealPlans } from "@/data/nutrition"

export default function MealPlanDetailPage() {
  const params = useParams()

  // Find the meal plan
  const mealPlan = mealPlans.find((p) => p.id === params.id)

  if (!mealPlan) {
    notFound()
  }

  return (
    <div className="container py-8 md:py-12">
      <div className="flex items-center gap-2 mb-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/nutrition">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Nutrition Plans
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-8">
        <div className="lg:col-span-2">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{mealPlan.title}</h1>
              <div className="flex flex-wrap items-center gap-2 mt-2">
                <Badge variant="outline" className="flex items-center gap-1">
                  <Utensils className="h-3 w-3" />
                  {mealPlan.diet}
                </Badge>
                <Badge variant="outline" className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {mealPlan.calories} calories
                </Badge>
              </div>
            </div>
            <Button asChild>
              <Link href="/my-plan">Add to My Plan</Link>
            </Button>
          </div>

          <Card className="mb-8">
            <CardHeader className="pb-2">
              <CardTitle>About This Meal Plan</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{mealPlan.description}</p>
            </CardContent>
          </Card>

          <Tabs defaultValue="breakfast" className="w-full">
            <TabsList className="mb-6 flex flex-wrap gap-2 w-full overflow-x-auto pb-1">
              <TabsTrigger value="breakfast" className="flex-1 min-w-[100px]">
                Breakfast
              </TabsTrigger>
              <TabsTrigger value="lunch" className="flex-1 min-w-[100px]">
                Lunch
              </TabsTrigger>
              <TabsTrigger value="dinner" className="flex-1 min-w-[100px]">
                Dinner
              </TabsTrigger>
              <TabsTrigger value="snacks" className="flex-1 min-w-[100px]">
                Snacks
              </TabsTrigger>
            </TabsList>

            <TabsContent value="breakfast" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {mealPlan.meals.breakfast.map((meal, index) => (
                  <MealCard key={index} meal={meal} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="lunch" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {mealPlan.meals.lunch.map((meal, index) => (
                  <MealCard key={index} meal={meal} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="dinner" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {mealPlan.meals.dinner.map((meal, index) => (
                  <MealCard key={index} meal={meal} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="snacks" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {mealPlan.meals.snacks.map((meal, index) => (
                  <MealCard key={index} meal={meal} />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <div>
          <h2 className="text-xl font-bold mb-4">Weekly Meal Schedule</h2>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">7-Day Meal Plan</CardTitle>
              <CardDescription>Suggested schedule for this meal plan</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day, index) => (
                  <div key={day} className="border-b last:border-0 pb-3 last:pb-0">
                    <h3 className="font-medium flex items-center gap-2 mb-2">
                      <CalendarDays className="h-4 w-4" /> {day}
                    </h3>
                    <div className="text-sm space-y-1 text-muted-foreground">
                      <p>
                        <span className="font-medium text-foreground">Breakfast:</span>{" "}
                        {mealPlan.meals.breakfast[index % mealPlan.meals.breakfast.length].title}
                      </p>
                      <p>
                        <span className="font-medium text-foreground">Lunch:</span>{" "}
                        {mealPlan.meals.lunch[index % mealPlan.meals.lunch.length].title}
                      </p>
                      <p>
                        <span className="font-medium text-foreground">Dinner:</span>{" "}
                        {mealPlan.meals.dinner[index % mealPlan.meals.dinner.length].title}
                      </p>
                      <p>
                        <span className="font-medium text-foreground">Snack:</span>{" "}
                        {mealPlan.meals.snacks[index % mealPlan.meals.snacks.length].title}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button asChild variant="outline" className="w-full">
                <Link href="/ai-trainer">Customize with AI Trainer</Link>
              </Button>
            </CardFooter>
          </Card>

          <div className="mt-8">
            <h2 className="text-xl font-bold mb-4">Similar Meal Plans</h2>
            <div className="space-y-4">
              {mealPlans
                .filter((p) => p.id !== mealPlan.id && (p.diet === mealPlan.diet || p.category === mealPlan.category))
                .slice(0, 3)
                .map((relatedPlan) => (
                  <Card key={relatedPlan.id} className="overflow-hidden">
                    <Link href={`/nutrition/${relatedPlan.id}`}>
                      <div className="flex h-24">
                        <div className="w-24 bg-muted">
                          <img
                            src={
                              relatedPlan.image ||
                              `/placeholder.svg?height=100&width=100&text=${encodeURIComponent(relatedPlan.title) || "/placeholder.svg"}`
                            }
                            alt={relatedPlan.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 p-3">
                          <h3 className="font-medium line-clamp-1">{relatedPlan.title}</h3>
                          <p className="text-xs text-muted-foreground mt-1">
                            {relatedPlan.diet} • {relatedPlan.calories} calories
                          </p>
                        </div>
                      </div>
                    </Link>
                  </Card>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

interface MealCardProps {
  meal: {
    id: string
    title: string
    type: string
    diet: string
    calories: number
    ingredients: string[]
    instructions?: string
    image?: string
  }
}

function MealCard({ meal }: MealCardProps) {
  return (
    <Card>
      <div className="aspect-video relative overflow-hidden">
        <img
          src={meal.image || `/placeholder.svg?height=200&width=400&text=${encodeURIComponent(meal.title)}`}
          alt={meal.title}
          className="object-cover w-full h-full"
        />
        <div className="absolute top-2 right-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-md">
          {meal.calories} cal
        </div>
      </div>
      <CardHeader>
        <CardTitle>{meal.title}</CardTitle>
        <CardDescription>{meal.diet}</CardDescription>
      </CardHeader>
      <CardContent>
        <h3 className="font-medium mb-2">Ingredients:</h3>
        <ul className="space-y-1 text-sm text-muted-foreground mb-4">
          {meal.ingredients.map((ingredient, index) => (
            <li key={index}>• {ingredient}</li>
          ))}
        </ul>
        {meal.instructions && (
          <>
            <h3 className="font-medium mb-2">Instructions:</h3>
            <p className="text-sm text-muted-foreground">{meal.instructions}</p>
          </>
        )}
      </CardContent>
    </Card>
  )
}
