import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { workoutCategories } from "@/data/workouts"

export const metadata: Metadata = {
  title: "Workouts - FitVerseX",
  description: "Browse and discover workouts for all fitness levels",
}

export default function WorkoutsPage() {
  return (
    <div className="container py-8 md:py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Workouts</h1>
          <p className="text-muted-foreground mt-2">Browse our collection of workouts for all fitness levels.</p>
        </div>
        <Button asChild>
          <Link href="/my-plan">View My Plan</Link>
        </Button>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-8 flex flex-wrap gap-2">
          <TabsTrigger value="all">All Workouts</TabsTrigger>
          <TabsTrigger value="weight-loss">Weight Loss</TabsTrigger>
          <TabsTrigger value="muscle-gain">Muscle Gain</TabsTrigger>
          <TabsTrigger value="cardio">Cardio</TabsTrigger>
          <TabsTrigger value="yoga">Yoga & Flexibility</TabsTrigger>
          <TabsTrigger value="hiit">HIIT</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {workoutCategories.flatMap((category) =>
              category.workouts.map((workout) => (
                <WorkoutCard
                  key={workout.id}
                  title={workout.title}
                  description={workout.description}
                  level={workout.level}
                  duration={workout.duration}
                  category={category.name}
                  image={workout.image}
                  href={`/workouts/${category.id}/${workout.id}`}
                />
              )),
            )}
          </div>
        </TabsContent>

        {workoutCategories.map((category) => (
          <TabsContent key={category.id} value={category.id} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {category.workouts.map((workout) => (
                <WorkoutCard
                  key={workout.id}
                  title={workout.title}
                  description={workout.description}
                  level={workout.level}
                  duration={workout.duration}
                  category={category.name}
                  image={workout.image}
                  href={`/workouts/${category.id}/${workout.id}`}
                />
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}

interface WorkoutCardProps {
  title: string
  description: string
  level: string
  duration: string
  category: string
  image: string
  href: string
}

function WorkoutCard({ title, description, level, duration, category, image, href }: WorkoutCardProps) {
  return (
    <Card className="overflow-hidden">
      <div className="aspect-video relative overflow-hidden">
        <img
          src={image || `/placeholder.svg?height=200&width=400&text=${encodeURIComponent(title)}`}
          alt={title}
          className="object-cover w-full h-full transition-transform hover:scale-105"
        />
        <div className="absolute top-2 right-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-md">
          {level}
        </div>
      </div>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>
          {category} • {duration}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full">
          <Link href={href} className="w-full h-full flex items-center justify-center text-primary-foreground hover:text-primary-foreground">
            View Workout
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
