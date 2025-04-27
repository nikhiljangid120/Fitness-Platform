import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Dumbbell, Users, Star } from "lucide-react"

export const metadata: Metadata = {
  title: "Workout Programs - FitVerseX",
  description: "Structured workout programs for all fitness goals",
}

// Sample workout programs data with high-quality images
const workoutPrograms = [
  {
    id: "30-day-weight-loss",
    title: "30-Day Weight Loss Challenge",
    description:
      "A comprehensive 30-day program designed to help you lose weight through a combination of cardio, HIIT, and strength training.",
    level: "Beginner to Intermediate",
    duration: "30 days",
    workoutsPerWeek: 5,
    category: "weight-loss",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=2070&auto=format&fit=crop",
    participants: 2547,
    rating: 4.8,
  },
  {
    id: "strength-builder",
    title: "8-Week Strength Builder",
    description:
      "Build serious strength and muscle with this progressive 8-week program focusing on compound movements and progressive overload.",
    level: "Intermediate",
    duration: "8 weeks",
    workoutsPerWeek: 4,
    category: "muscle-gain",
    image: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=2070&auto=format&fit=crop",
    participants: 1823,
    rating: 4.9,
  },
  {
    id: "beginner-fitness",
    title: "Beginner Fitness Kickstart",
    description:
      "The perfect program for fitness beginners, gradually introducing you to different types of exercise over 6 weeks.",
    level: "Beginner",
    duration: "6 weeks",
    workoutsPerWeek: 3,
    category: "general-fitness",
    image: "https://images.unsplash.com/photo-1549060279-7e168fcee0c2?q=80&w=2070&auto=format&fit=crop",
    participants: 3156,
    rating: 4.7,
  },
  {
    id: "hiit-fat-burner",
    title: "HIIT Fat Burner",
    description: "A high-intensity 4-week program designed to maximize calorie burn and boost your metabolism.",
    level: "Intermediate to Advanced",
    duration: "4 weeks",
    workoutsPerWeek: 4,
    category: "weight-loss",
    image: "https://images.unsplash.com/photo-1434682881908-b43d0467b798?q=80&w=2074&auto=format&fit=crop",
    participants: 1542,
    rating: 4.6,
  },
  {
    id: "yoga-flexibility",
    title: "Yoga & Flexibility Journey",
    description: "Improve your flexibility, balance, and mindfulness with this 6-week yoga-focused program.",
    level: "All Levels",
    duration: "6 weeks",
    workoutsPerWeek: 5,
    category: "yoga",
    image: "https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?q=80&w=2070&auto=format&fit=crop",
    participants: 1247,
    rating: 4.9,
  },
  {
    id: "marathon-prep",
    title: "Marathon Preparation",
    description:
      "A 12-week running program designed to prepare you for a marathon, with a mix of short runs, long runs, and cross-training.",
    level: "Intermediate to Advanced",
    duration: "12 weeks",
    workoutsPerWeek: 5,
    category: "cardio",
    image: "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?q=80&w=2070&auto=format&fit=crop",
    participants: 876,
    rating: 4.8,
  },
  {
    id: "bodyweight-master",
    title: "Bodyweight Master",
    description:
      "Build strength and muscle using just your bodyweight with this 8-week progressive calisthenics program.",
    level: "All Levels",
    duration: "8 weeks",
    workoutsPerWeek: 4,
    category: "muscle-gain",
    image: "https://images.unsplash.com/photo-1616803689943-5601631c7fec?q=80&w=2070&auto=format&fit=crop",
    participants: 1985,
    rating: 4.7,
  },
  {
    id: "kettlebell-conditioning",
    title: "Kettlebell Conditioning",
    description: "Transform your body with this 6-week kettlebell program that combines strength and cardio.",
    level: "Intermediate",
    duration: "6 weeks",
    workoutsPerWeek: 3,
    category: "general-fitness",
    image: "https://images.unsplash.com/photo-1517344884509-a0c97ec11bcc?q=80&w=2070&auto=format&fit=crop",
    participants: 1123,
    rating: 4.8,
  },
  {
    id: "mobility-mastery",
    title: "Mobility Mastery",
    description: "Improve your joint mobility, flexibility, and movement quality with this 4-week program.",
    level: "All Levels",
    duration: "4 weeks",
    workoutsPerWeek: 4,
    category: "yoga",
    image: "https://images.unsplash.com/photo-1552196563-55cd4e45efb3?q=80&w=2026&auto=format&fit=crop",
    participants: 945,
    rating: 4.9,
  },
]

export default function WorkoutProgramsPage() {
  return (
    <div className="container py-8 md:py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Workout Programs</h1>
          <p className="text-muted-foreground mt-2">
            Structured workout programs to help you achieve your fitness goals
          </p>
        </div>
        <Button asChild>
          <Link href="/my-plan">View My Plan</Link>
        </Button>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-8 flex flex-wrap gap-2">
          <TabsTrigger value="all">All Programs</TabsTrigger>
          <TabsTrigger value="weight-loss">Weight Loss</TabsTrigger>
          <TabsTrigger value="muscle-gain">Muscle Gain</TabsTrigger>
          <TabsTrigger value="cardio">Cardio</TabsTrigger>
          <TabsTrigger value="yoga">Yoga & Flexibility</TabsTrigger>
          <TabsTrigger value="general-fitness">General Fitness</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {workoutPrograms.map((program) => (
              <ProgramCard
                key={program.id}
                title={program.title}
                description={program.description}
                level={program.level}
                duration={program.duration}
                workoutsPerWeek={program.workoutsPerWeek}
                image={program.image}
                participants={program.participants}
                rating={program.rating}
                href={`/workout-programs/${program.id}`}
              />
            ))}
          </div>
        </TabsContent>

        {["weight-loss", "muscle-gain", "cardio", "yoga", "general-fitness"].map((category) => (
          <TabsContent key={category} value={category} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {workoutPrograms
                .filter((program) => program.category === category)
                .map((program) => (
                  <ProgramCard
                    key={program.id}
                    title={program.title}
                    description={program.description}
                    level={program.level}
                    duration={program.duration}
                    workoutsPerWeek={program.workoutsPerWeek}
                    image={program.image}
                    participants={program.participants}
                    rating={program.rating}
                    href={`/workout-programs/${program.id}`}
                  />
                ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}

interface ProgramCardProps {
  title: string
  description: string
  level: string
  duration: string
  workoutsPerWeek: number
  image: string
  participants: number
  rating: number
  href: string
}

function ProgramCard({
  title,
  description,
  level,
  duration,
  workoutsPerWeek,
  image,
  participants,
  rating,
  href,
}: ProgramCardProps) {
  return (
    <Card className="overflow-hidden flex flex-col h-full perspective-500 transform-style-3d hover:shadow-xl transition-all duration-300">
      <div className="aspect-video relative overflow-hidden">
        <img
          src={image || `/placeholder.svg?height=200&width=400&text=${encodeURIComponent(title)}`}
          alt={title}
          className="object-cover w-full h-full transition-transform duration-500 hover:scale-105"
        />
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black/60 to-transparent"></div>
        <div className="absolute top-2 right-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-md">
          {level}
        </div>
        <div className="absolute bottom-2 left-2 flex items-center gap-1 text-white text-sm">
          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
          <span>{rating}</span>
        </div>
      </div>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription className="flex flex-wrap gap-2 mt-1">
          <Badge variant="outline" className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {duration}
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1">
            <Dumbbell className="h-3 w-3" />
            {workoutsPerWeek}x per week
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1">
            <Users className="h-3 w-3" />
            {participants.toLocaleString()} joined
          </Badge>
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full bg-primary hover:bg-primary/90">
          <Link href={href}>View Program</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
