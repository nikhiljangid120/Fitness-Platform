import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { mealPlans } from "@/data/nutrition"

export const metadata: Metadata = {
  title: "Nutrition - FitVerseX",
  description: "Browse and discover nutrition plans for all dietary preferences",
}

export default function NutritionPage() {
  return (
    <div className="container py-8 md:py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Nutrition Plans</h1>
          <p className="text-muted-foreground mt-2">
            Browse our collection of meal plans for different dietary preferences and goals.
          </p>
        </div>
        <Button asChild>
          <Link href="/my-plan">View My Plan</Link>
        </Button>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-8 flex flex-wrap gap-2">
          <TabsTrigger value="all">All Plans</TabsTrigger>
          <TabsTrigger value="vegetarian">Vegetarian</TabsTrigger>
          <TabsTrigger value="vegan">Vegan</TabsTrigger>
          <TabsTrigger value="keto">Keto</TabsTrigger>
          <TabsTrigger value="weight-loss">Weight Loss</TabsTrigger>
          <TabsTrigger value="muscle-building">Muscle Building</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mealPlans.map((plan) => (
              <MealPlanCard
                key={plan.id}
                title={plan.title}
                description={plan.description}
                diet={plan.diet}
                calories={plan.calories}
                image={plan.image}
                href={`/nutrition/${plan.id}`}
              />
            ))}
          </div>
        </TabsContent>

        {["vegetarian", "vegan", "keto", "weight-loss", "muscle-building"].map((dietType) => (
          <TabsContent key={dietType} value={dietType} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mealPlans
                .filter((plan) => plan.diet.toLowerCase() === dietType || plan.category === dietType)
                .map((plan) => (
                  <MealPlanCard
                    key={plan.id}
                    title={plan.title}
                    description={plan.description}
                    diet={plan.diet}
                    calories={plan.calories}
                    image={plan.image}
                    href={`/nutrition/${plan.id}`}
                  />
                ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}

interface MealPlanCardProps {
  title: string
  description: string
  diet: string
  calories: string
  image: string
  href: string
}

function MealPlanCard({ title, description, diet, calories, image, href }: MealPlanCardProps) {
  return (
    <Card className="overflow-hidden">
      <div className="aspect-video relative overflow-hidden">
        <img
          src={image || `/placeholder.svg?height=200&width=400&text=${encodeURIComponent(title)}`}
          alt={title}
          className="object-cover w-full h-full transition-transform hover:scale-105"
        />
        <div className="absolute top-2 right-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-md">
          {diet}
        </div>
      </div>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>Approx. {calories} calories per day</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full">
          <Link href={href}>View Plan</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
