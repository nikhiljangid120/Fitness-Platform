"use client"

import { useState } from "react"
import { useParams, notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Calendar,
  Clock,
  Dumbbell,
  CheckCircle,
  ChevronLeft,
  Share2,
  Users,
  Star,
  ChevronDown,
  ChevronUp,
} from "lucide-react"
import Link from "next/link"
import { workoutCategories } from "@/data/workouts"

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
    overview:
      "This 30-day weight loss challenge is designed to help you create a calorie deficit through a combination of cardio, HIIT, and strength training. The program progressively increases in intensity to keep challenging your body and prevent plateaus. Each week includes 5 workout days and 2 rest days, with a mix of different training styles to keep things interesting and target different energy systems.",
    goals: [
      "Lose 2-4 pounds per week in a healthy, sustainable way",
      "Improve cardiovascular fitness and endurance",
      "Build lean muscle to boost metabolism",
      "Establish consistent workout habits",
    ],
    community: {
      participants: 2547,
      completionRate: 68,
      averageRating: 4.8,
      reviews: 342,
    },
    weeks: [
      {
        weekNumber: 1,
        theme: "Foundation Building",
        description:
          "The first week focuses on establishing proper form and building a foundation of fitness with moderate-intensity workouts.",
        days: [
          {
            day: 1,
            title: "Cardio Kickstart",
            workout: workoutCategories[2].workouts[0],
            completed: false,
          },
          {
            day: 2,
            title: "Full Body Strength",
            workout: workoutCategories[1].workouts[2],
            completed: false,
          },
          {
            day: 3,
            title: "Active Recovery",
            description: "Light walking or stretching for 20-30 minutes",
            isRest: true,
            completed: false,
          },
          {
            day: 4,
            title: "HIIT Introduction",
            workout: workoutCategories[4].workouts[0],
            completed: false,
          },
          {
            day: 5,
            title: "Lower Body Focus",
            workout: workoutCategories[1].workouts[1],
            completed: false,
          },
          {
            day: 6,
            title: "Cardio & Core",
            workout: workoutCategories[2].workouts[1],
            completed: false,
          },
          {
            day: 7,
            title: "Rest Day",
            description: "Complete rest to allow your body to recover",
            isRest: true,
            completed: false,
          },
        ],
      },
      {
        weekNumber: 2,
        theme: "Increasing Intensity",
        description:
          "Week 2 builds on the foundation with slightly higher intensity workouts and more challenging exercises.",
        days: [
          {
            day: 1,
            title: "Cardio Intervals",
            workout: workoutCategories[2].workouts[2],
            completed: false,
          },
          {
            day: 2,
            title: "Upper Body Strength",
            workout: workoutCategories[1].workouts[0],
            completed: false,
          },
          {
            day: 3,
            title: "HIIT Circuit",
            workout: workoutCategories[4].workouts[1],
            completed: false,
          },
          {
            day: 4,
            title: "Active Recovery",
            description: "Light walking or yoga for 20-30 minutes",
            isRest: true,
            completed: false,
          },
          {
            day: 5,
            title: "Full Body Burn",
            workout: workoutCategories[0].workouts[2],
            completed: false,
          },
          {
            day: 6,
            title: "Cardio Endurance",
            workout: workoutCategories[2].workouts[1],
            completed: false,
          },
          {
            day: 7,
            title: "Rest Day",
            description: "Complete rest to allow your body to recover",
            isRest: true,
            completed: false,
          },
        ],
      },
      {
        weekNumber: 3,
        theme: "Challenge Week",
        description:
          "Week 3 significantly increases the challenge with more intense workouts and complex exercise combinations.",
        days: [
          {
            day: 1,
            title: "HIIT Blast",
            workout: workoutCategories[4].workouts[2],
            completed: false,
          },
          {
            day: 2,
            title: "Total Body Strength",
            workout: workoutCategories[1].workouts[2],
            completed: false,
          },
          {
            day: 3,
            title: "Cardio Intervals",
            workout: workoutCategories[2].workouts[2],
            completed: false,
          },
          {
            day: 4,
            title: "Active Recovery",
            description: "Light mobility work and stretching",
            isRest: true,
            completed: false,
          },
          {
            day: 5,
            title: "Circuit Training",
            workout: workoutCategories[0].workouts[0],
            completed: false,
          },
          {
            day: 6,
            title: "Endurance Challenge",
            workout: workoutCategories[2].workouts[2],
            completed: false,
          },
          {
            day: 7,
            title: "Rest Day",
            description: "Complete rest to allow your body to recover",
            isRest: true,
            completed: false,
          },
        ],
      },
      {
        weekNumber: 4,
        theme: "Peak Week",
        description:
          "The final week pushes you to your limits with the most challenging workouts of the program to maximize results.",
        days: [
          {
            day: 1,
            title: "HIIT Max",
            workout: workoutCategories[4].workouts[2],
            completed: false,
          },
          {
            day: 2,
            title: "Strength Finisher",
            workout: workoutCategories[1].workouts[2],
            completed: false,
          },
          {
            day: 3,
            title: "Cardio Burn",
            workout: workoutCategories[0].workouts[0],
            completed: false,
          },
          {
            day: 4,
            title: "Active Recovery",
            description: "Light walking and stretching",
            isRest: true,
            completed: false,
          },
          {
            day: 5,
            title: "Full Body HIIT",
            workout: workoutCategories[4].workouts[1],
            completed: false,
          },
          {
            day: 6,
            title: "Final Challenge",
            workout: workoutCategories[0].workouts[0],
            completed: false,
          },
          {
            day: 7,
            title: "Active Recovery",
            description: "Light activity and reflection on your progress",
            isRest: true,
            completed: false,
          },
        ],
      },
    ],
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
    overview:
      "This 8-week strength building program is designed to help you build muscle and increase strength through progressive overload and compound movements. The program follows a 4-day split targeting different muscle groups, with built-in recovery days to maximize muscle growth.",
    goals: [
      "Increase strength in major compound lifts",
      "Build lean muscle mass",
      "Improve overall body composition",
      "Learn proper lifting techniques",
    ],
    community: {
      participants: 1823,
      completionRate: 72,
      averageRating: 4.9,
      reviews: 256,
    },
    weeks: [
      {
        weekNumber: 1,
        theme: "Foundation Phase",
        description: "Focus on proper form and establishing baseline strength levels.",
        days: [
          {
            day: 1,
            title: "Upper Body Push",
            workout: workoutCategories[1].workouts[0],
            completed: false,
          },
          {
            day: 2,
            title: "Lower Body",
            workout: workoutCategories[1].workouts[1],
            completed: false,
          },
          {
            day: 3,
            title: "Rest Day",
            description: "Complete rest to allow your body to recover",
            isRest: true,
            completed: false,
          },
          {
            day: 4,
            title: "Upper Body Pull",
            workout: workoutCategories[1].workouts[0],
            completed: false,
          },
          {
            day: 5,
            title: "Full Body",
            workout: workoutCategories[1].workouts[2],
            completed: false,
          },
          {
            day: 6,
            title: "Rest Day",
            description: "Complete rest to allow your body to recover",
            isRest: true,
            completed: false,
          },
          {
            day: 7,
            title: "Rest Day",
            description: "Complete rest to allow your body to recover",
            isRest: true,
            completed: false,
          },
        ],
      },
    ],
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
    overview:
      "This beginner-friendly program is designed to introduce you to different types of exercise in a progressive manner. You'll start with basic movements and gradually increase intensity as your fitness improves.",
    goals: [
      "Build a foundation of fitness",
      "Learn proper exercise technique",
      "Develop a consistent workout habit",
      "Improve overall health and energy levels",
    ],
    community: {
      participants: 3156,
      completionRate: 75,
      averageRating: 4.7,
      reviews: 412,
    },
    weeks: [
      {
        weekNumber: 1,
        theme: "Introduction to Fitness",
        description: "Getting comfortable with basic movements and building a foundation.",
        days: [
          {
            day: 1,
            title: "Full Body Basics",
            workout: workoutCategories[0].workouts[2],
            completed: false,
          },
          {
            day: 2,
            title: "Rest Day",
            description: "Complete rest to allow your body to recover",
            isRest: true,
            completed: false,
          },
          {
            day: 3,
            title: "Cardio Introduction",
            workout: workoutCategories[2].workouts[0],
            completed: false,
          },
          {
            day: 4,
            title: "Rest Day",
            description: "Complete rest to allow your body to recover",
            isRest: true,
            completed: false,
          },
          {
            day: 5,
            title: "Bodyweight Strength",
            workout: workoutCategories[1].workouts[1],
            completed: false,
          },
          {
            day: 6,
            title: "Rest Day",
            description: "Complete rest to allow your body to recover",
            isRest: true,
            completed: false,
          },
          {
            day: 7,
            title: "Rest Day",
            description: "Complete rest to allow your body to recover",
            isRest: true,
            completed: false,
          },
        ],
      },
    ],
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
    overview:
      "This high-intensity interval training program is designed to maximize calorie burn and boost your metabolism. You'll alternate between intense bursts of activity and short recovery periods to keep your heart rate elevated throughout each workout.",
    goals: [
      "Burn maximum calories in minimum time",
      "Boost metabolism for continued fat burning",
      "Improve cardiovascular fitness",
      "Increase endurance and stamina",
    ],
    community: {
      participants: 1542,
      completionRate: 62,
      averageRating: 4.6,
      reviews: 187,
    },
    weeks: [
      {
        weekNumber: 1,
        theme: "HIIT Foundations",
        description: "Introduction to HIIT principles and building baseline conditioning.",
        days: [
          {
            day: 1,
            title: "HIIT Basics",
            workout: workoutCategories[4].workouts[0],
            completed: false,
          },
          {
            day: 2,
            title: "Rest Day",
            description: "Complete rest to allow your body to recover",
            isRest: true,
            completed: false,
          },
          {
            day: 3,
            title: "Tabata Intervals",
            workout: workoutCategories[4].workouts[1],
            completed: false,
          },
          {
            day: 4,
            title: "Rest Day",
            description: "Complete rest to allow your body to recover",
            isRest: true,
            completed: false,
          },
          {
            day: 5,
            title: "Full Body HIIT",
            workout: workoutCategories[4].workouts[2],
            completed: false,
          },
          {
            day: 6,
            title: "Active Recovery",
            description: "Light walking or stretching for 20-30 minutes",
            isRest: true,
            completed: false,
          },
          {
            day: 7,
            title: "Rest Day",
            description: "Complete rest to allow your body to recover",
            isRest: true,
            completed: false,
          },
        ],
      },
    ],
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
    overview:
      "This yoga and flexibility program is designed to improve your range of motion, balance, and mindfulness. You'll progress through a variety of yoga styles and stretching routines to enhance your overall flexibility and reduce stress.",
    goals: [
      "Increase overall flexibility and range of motion",
      "Improve balance and stability",
      "Reduce stress and enhance mindfulness",
      "Build strength through bodyweight exercises",
    ],
    community: {
      participants: 1247,
      completionRate: 78,
      averageRating: 4.9,
      reviews: 203,
    },
    weeks: [
      {
        weekNumber: 1,
        theme: "Yoga Foundations",
        description: "Introduction to basic yoga poses and breathing techniques.",
        days: [
          {
            day: 1,
            title: "Morning Flow",
            workout: workoutCategories[3].workouts[0],
            completed: false,
          },
          {
            day: 2,
            title: "Flexibility Focus",
            workout: workoutCategories[3].workouts[1],
            completed: false,
          },
          {
            day: 3,
            title: "Rest Day",
            description: "Complete rest to allow your body to recover",
            isRest: true,
            completed: false,
          },
          {
            day: 4,
            title: "Gentle Flow",
            workout: workoutCategories[3].workouts[0],
            completed: false,
          },
          {
            day: 5,
            title: "Balance Practice",
            workout: workoutCategories[3].workouts[2],
            completed: false,
          },
          {
            day: 6,
            title: "Deep Stretching",
            workout: workoutCategories[3].workouts[1],
            completed: false,
          },
          {
            day: 7,
            title: "Rest Day",
            description: "Complete rest to allow your body to recover",
            isRest: true,
            completed: false,
          },
        ],
      },
    ],
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
    overview:
      "This comprehensive 12-week marathon training program is designed to prepare you for the full 26.2-mile distance. The program includes a mix of short runs, long runs, speed work, and cross-training to build endurance while preventing injury.",
    goals: [
      "Build endurance to complete a full marathon",
      "Improve running economy and efficiency",
      "Develop mental toughness for long-distance running",
      "Learn proper pacing and race strategy",
    ],
    community: {
      participants: 876,
      completionRate: 65,
      averageRating: 4.8,
      reviews: 142,
    },
    weeks: [
      {
        weekNumber: 1,
        theme: "Base Building",
        description: "Establishing a solid foundation of running fitness.",
        days: [
          {
            day: 1,
            title: "Easy Run",
            description: "3 miles at conversational pace",
            isRest: false,
            completed: false,
          },
          {
            day: 2,
            title: "Cross Training",
            description: "30 minutes of low-impact cardio (swimming, cycling, or elliptical)",
            isRest: false,
            completed: false,
          },
          {
            day: 3,
            title: "Speed Work",
            description: "4x400m intervals with 200m recovery jogs",
            isRest: false,
            completed: false,
          },
          {
            day: 4,
            title: "Rest Day",
            description: "Complete rest to allow your body to recover",
            isRest: true,
            completed: false,
          },
          {
            day: 5,
            title: "Tempo Run",
            description: "3 miles with middle mile at half-marathon pace",
            isRest: false,
            completed: false,
          },
          {
            day: 6,
            title: "Long Run",
            description: "6 miles at easy pace",
            isRest: false,
            completed: false,
          },
          {
            day: 7,
            title: "Rest Day",
            description: "Complete rest to allow your body to recover",
            isRest: true,
            completed: false,
          },
        ],
      },
    ],
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
    overview:
      "This bodyweight training program helps you build strength and muscle without any equipment. Using progressive calisthenics principles, you'll advance through increasingly challenging variations of fundamental movements.",
    goals: [
      "Build strength using only bodyweight exercises",
      "Develop muscle control and body awareness",
      "Master advanced bodyweight skills",
      "Improve relative strength and power",
    ],
    community: {
      participants: 1985,
      completionRate: 70,
      averageRating: 4.7,
      reviews: 231,
    },
    weeks: [
      {
        weekNumber: 1,
        theme: "Fundamentals",
        description: "Mastering the basic bodyweight movements and building a foundation.",
        days: [
          {
            day: 1,
            title: "Push Day",
            description: "Focus on push-ups and their variations",
            isRest: false,
          },
          {
            day: 2,
            title: "Rest Day",
            description: "Complete rest to allow your body to recover",
            isRest: true,
          },
          {
            day: 3,
            title: "Pull Day",
            description: "Focus on pull-ups, rows, and their variations",
            isRest: false,
          },
          {
            day: 4,
            title: "Rest Day",
            description: "Complete rest to allow your body to recover",
            isRest: true,
          },
          {
            day: 5,
            title: "Legs & Core",
            description: "Focus on squats, lunges, and core exercises",
            isRest: false,
          },
          {
            day: 6,
            title: "Full Body Circuit",
            description: "Circuit combining all movement patterns",
            isRest: false,
          },
          {
            day: 7,
            title: "Rest Day",
            description: "Complete rest to allow your body to recover",
            isRest: true,
          },
        ],
      },
    ],
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
    overview:
      "This kettlebell conditioning program combines strength training and cardiovascular exercise for efficient, full-body workouts. You'll learn proper kettlebell technique while improving strength, power, and endurance.",
    goals: [
      "Master fundamental kettlebell exercises",
      "Build full-body strength and power",
      "Improve cardiovascular conditioning",
      "Enhance movement efficiency and coordination",
    ],
    community: {
      participants: 1123,
      completionRate: 68,
      averageRating: 4.8,
      reviews: 176,
    },
    weeks: [
      {
        weekNumber: 1,
        theme: "Technique Foundations",
        description: "Learning proper kettlebell techniques and building a foundation.",
        days: [
          {
            day: 1,
            title: "Kettlebell Basics",
            description: "Focus on swing, goblet squat, and halo techniques",
            isRest: false,
          },
          {
            day: 2,
            title: "Rest Day",
            description: "Complete rest to allow your body to recover",
            isRest: true,
          },
          {
            day: 3,
            title: "Kettlebell Strength",
            description: "Focus on press, row, and Turkish get-up techniques",
            isRest: false,
          },
          {
            day: 4,
            title: "Rest Day",
            description: "Complete rest to allow your body to recover",
            isRest: true,
          },
          {
            day: 5,
            title: "Kettlebell Conditioning",
            description: "Circuit combining all fundamental movements",
            isRest: false,
          },
          {
            day: 6,
            title: "Rest Day",
            description: "Complete rest to allow your body to recover",
            isRest: true,
          },
          {
            day: 7,
            title: "Rest Day",
            description: "Complete rest to allow your body to recover",
            isRest: true,
          },
        ],
      },
    ],
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
    overview:
      "This mobility program focuses on improving joint function, flexibility, and movement quality. You'll work through a series of mobility drills and stretches designed to enhance your range of motion and reduce pain or stiffness.",
    goals: [
      "Improve joint mobility and function",
      "Reduce movement restrictions and pain",
      "Enhance recovery between workouts",
      "Develop better movement patterns for daily life",
    ],
    community: {
      participants: 945,
      completionRate: 82,
      averageRating: 4.9,
      reviews: 156,
    },
    weeks: [
      {
        weekNumber: 1,
        theme: "Assessment & Foundations",
        description: "Identifying mobility restrictions and learning basic drills.",
        days: [
          {
            day: 1,
            title: "Mobility Assessment",
            description: "Full-body mobility assessment and targeted drills",
            isRest: false,
          },
          {
            day: 2,
            title: "Upper Body Focus",
            description: "Shoulder, wrist, and thoracic spine mobility work",
            isRest: false,
          },
          {
            day: 3,
            title: "Rest Day",
            description: "Complete rest to allow your body to recover",
            isRest: true,
          },
          {
            day: 4,
            title: "Lower Body Focus",
            description: "Hip, knee, and ankle mobility work",
            isRest: false,
          },
          {
            day: 5,
            title: "Spine & Core",
            description: "Spinal mobility and core stability work",
            isRest: false,
          },
          {
            day: 6,
            title: "Rest Day",
            description: "Complete rest to allow your body to recover",
            isRest: true,
          },
          {
            day: 7,
            title: "Full Body Integration",
            description: "Combining all mobility work into flowing sequences",
            isRest: false,
          },
        ],
      },
    ],
  },
]

export default function WorkoutProgramDetailPage() {
  const params = useParams()
  const [activeWeek, setActiveWeek] = useState(0)
  const [expandedWeeks, setExpandedWeeks] = useState<number[]>([0])
  const [showShareOptions, setShowShareOptions] = useState(false)

  // Find the program
  const program = workoutPrograms.find((p) => p.id === params.id)

  if (!program) {
    notFound()
  }

  const toggleWeekExpansion = (weekIndex: number) => {
    setExpandedWeeks((prev) => (prev.includes(weekIndex) ? prev.filter((w) => w !== weekIndex) : [...prev, weekIndex]))
  }

  // Calculate overall program progress
  const totalDays = program.weeks ? program.weeks.reduce((acc, week) => acc + week.days.length, 0) : 0
  const completedDaysTotal = program.weeks
    ? program.weeks.reduce((acc, week) => acc + week.days.filter((day) => day.completed).length, 0)
    : 0
  const progressPercentage = totalDays > 0 ? (completedDaysTotal / totalDays) * 100 : 0

  // Share program function
  const shareProgram = (platform: string) => {
    const url = window.location.href
    const text = `Check out this awesome fitness program: ${program.title} on FlexForge!`

    switch (platform) {
      case "twitter":
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`)
        break
      case "facebook":
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`)
        break
      case "whatsapp":
        window.open(`https://wa.me/?text=${encodeURIComponent(text + " " + url)}`)
        break
      case "copy":
        navigator.clipboard.writeText(url)
        alert("Link copied to clipboard!")
        break
    }

    setShowShareOptions(false)
  }

  return (
    <div className="container py-8 md:py-12">
      <div className="flex items-center gap-2 mb-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/workout-programs">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Programs
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{program.title}</h1>
              <div className="flex flex-wrap items-center gap-2 mt-2">
                <Badge variant="outline" className="flex items-center gap-1">
                  <Dumbbell className="h-3 w-3" />
                  {program.level}
                </Badge>
                <Badge variant="outline" className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {program.duration}
                </Badge>
                <Badge variant="outline" className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {program.workoutsPerWeek}x per week
                </Badge>
              </div>
            </div>
            <div className="flex gap-2">
              <Button asChild className="bg-primary hover:bg-primary/90">
                <Link href="/my-plan">Add to My Plan</Link>
              </Button>
              <div className="relative">
                <Button variant="outline" size="icon" onClick={() => setShowShareOptions(!showShareOptions)}>
                  <Share2 className="h-4 w-4" />
                </Button>

                {showShareOptions && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg z-10 border">
                    <div className="py-1">
                      <button
                        className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                        onClick={() => shareProgram("twitter")}
                      >
                        <svg className="h-4 w-4 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.1 10.1 0 01-3.127 1.184 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                        </svg>
                        Twitter
                      </button>
                      <button
                        className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                        onClick={() => shareProgram("facebook")}
                      >
                        <svg className="h-4 w-4 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                        </svg>
                        Facebook
                      </button>
                      <button
                        className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                        onClick={() => shareProgram("whatsapp")}
                      >
                        <svg className="h-4 w-4 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                        </svg>
                        WhatsApp
                      </button>
                      <button
                        className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                        onClick={() => shareProgram("copy")}
                      >
                        <svg
                          className="h-4 w-4 text-gray-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                          ></path>
                        </svg>
                        Copy Link
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Program Image */}
          <div className="mb-8 rounded-lg overflow-hidden">
            <img src={program.image || "/placeholder.svg"} alt={program.title} className="w-full h-64 object-cover" />
          </div>

          <Card className="mb-8">
            <CardHeader className="pb-2">
              <CardTitle>Program Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-6">{program.overview}</p>

              <h3 className="font-semibold mb-2">Program Goals:</h3>
              <ul className="space-y-1 mb-6">
                {program.goals.map((goal, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                    <span>{goal}</span>
                  </li>
                ))}
              </ul>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold">Overall Progress:</h3>
                  <span className="text-sm font-medium">
                    {completedDaysTotal} of {totalDays} days completed
                  </span>
                </div>
                <Progress value={progressPercentage} className="h-2" />
              </div>
            </CardContent>
          </Card>

          {/* Community Stats - NEW FEATURE */}
          <Card className="mb-8 bg-gradient-to-r from-primary/10 to-primary/5">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" /> Community Stats
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-4">
                <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                  <Users className="h-6 w-6 mx-auto mb-2 text-primary" />
                  <p className="text-sm text-muted-foreground">Participants</p>
                  <p className="text-2xl font-bold">{program.community.participants.toLocaleString()}</p>
                </div>
                <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                  <CheckCircle className="h-6 w-6 mx-auto mb-2 text-primary" />
                  <p className="text-sm text-muted-foreground">Completion Rate</p>
                  <p className="text-2xl font-bold">{program.community.completionRate}%</p>
                </div>
                <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                  <Star className="h-6 w-6 mx-auto mb-2 text-primary" />
                  <p className="text-sm text-muted-foreground">Rating</p>
                  <p className="text-2xl font-bold">{program.community.averageRating}</p>
                </div>
                <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                  <Users className="h-6 w-6 mx-auto mb-2 text-primary" />
                  <p className="text-sm text-muted-foreground">Reviews</p>
                  <p className="text-2xl font-bold">{program.community.reviews}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {program.weeks && program.weeks.length > 0 ? (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Program Schedule</h2>

              <div className="space-y-6">
                {program.weeks.map((week, weekIndex) => (
                  <Card key={weekIndex} className={weekIndex === activeWeek ? "border-primary" : ""}>
                    <CardHeader className="cursor-pointer p-4 sm:p-6" onClick={() => toggleWeekExpansion(weekIndex)}>
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-lg sm:text-xl">
                          Week {week.weekNumber}: {week.theme}
                        </CardTitle>
                        {expandedWeeks.includes(weekIndex) ? (
                          <ChevronUp className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                        )}
                      </div>
                      <CardDescription className="mt-1 line-clamp-2">{week.description}</CardDescription>
                    </CardHeader>

                    {expandedWeeks.includes(weekIndex) && (
                      <CardContent>
                        <div className="space-y-4">
                          {week.days.map((day, dayIndex) => (
                            <Card key={dayIndex} className={day.completed ? "border-green-500" : ""}>
                              <CardHeader className="p-4">
                                <div className="flex justify-between items-center">
                                  <div className="flex items-center gap-3">
                                    <div
                                      className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                                        day.completed ? "bg-green-500 text-white" : "bg-muted text-muted-foreground"
                                      }`}
                                    >
                                      {day.completed ? <CheckCircle className="h-4 w-4" /> : day.day}
                                    </div>
                                    <div>
                                      <CardTitle className="text-base">{day.title}</CardTitle>
                                      {day.isRest ? (
                                        <CardDescription>Rest Day</CardDescription>
                                      ) : day.workout ? (
                                        <CardDescription>
                                          {day.workout.level} • {day.workout.duration}
                                        </CardDescription>
                                      ) : (
                                        <CardDescription>Workout</CardDescription>
                                      )}
                                    </div>
                                  </div>
                                  {day.completed && <CheckCircle className="h-5 w-5 text-green-500" />}
                                </div>
                              </CardHeader>
                              <CardContent className="p-4 pt-0">
                                {day.isRest ? (
                                  <p className="text-muted-foreground">{day.description}</p>
                                ) : day.workout ? (
                                  <>
                                    <p className="text-sm text-muted-foreground mb-4">{day.workout.description}</p>
                                    <div className="flex flex-wrap gap-2">
                                      {day.workout.equipment.map((item, i) => (
                                        <Badge key={i} variant="outline">
                                          {item}
                                        </Badge>
                                      ))}
                                    </div>
                                  </>
                                ) : (
                                  <p className="text-muted-foreground">{day.description}</p>
                                )}
                              </CardContent>
                              <CardFooter className="p-4 pt-0">
                                {!day.isRest && (
                                  <Button asChild variant={day.completed ? "outline" : "default"} className="w-full">
                                    <Link href={day.workout ? `/workouts/${day.workout.id}` : "#"}>
                                      {day.completed ? "View Workout" : "Start Workout"}
                                    </Link>
                                  </Button>
                                )}
                              </CardFooter>
                            </Card>
                          ))}
                        </div>
                      </CardContent>
                    )}
                  </Card>
                ))}
              </div>
            </div>
          ) : (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Program Schedule</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-center py-8 text-muted-foreground">
                  Full program schedule will be available soon. Check back later for updates!
                </p>
              </CardContent>
              <CardFooter>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/my-plan">Add to My Plan</Link>
                </Button>
              </CardFooter>
            </Card>
          )}
        </div>

        <div>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Program Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Duration</h3>
                  <p className="text-lg font-semibold">{program.duration}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Workouts Per Week</h3>
                  <p className="text-lg font-semibold">{program.workoutsPerWeek} workouts</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Difficulty Level</h3>
                  <p className="text-lg font-semibold">{program.level}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Category</h3>
                  <Badge>{program.category.replace("-", " ")}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Social Sharing Card - NEW FEATURE */}
          <Card className="mb-6 bg-gradient-to-r from-primary/10 to-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Share2 className="h-5 w-5" /> Share This Program
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center gap-4">
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full bg-white hover:bg-blue-50"
                  onClick={() => shareProgram("twitter")}
                >
                  <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.1 10.1 0 01-3.127 1.184 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                  </svg>
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full bg-white hover:bg-blue-50"
                  onClick={() => shareProgram("facebook")}
                >
                  <svg className="h-5 w-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full bg-white hover:bg-green-50"
                  onClick={() => shareProgram("whatsapp")}
                >
                  <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full bg-white hover:bg-gray-100"
                  onClick={() => shareProgram("copy")}
                >
                  <svg
                    className="h-5 w-5 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                    ></path>
                  </svg>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Related Programs</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {workoutPrograms
                  .filter((p) => p.category === program.category && p.id !== program.id)
                  .slice(0, 3)
                  .map((relatedProgram, index) => (
                    <Link key={index} href={`/workout-programs/${relatedProgram.id}`}>
                      <div className="flex items-center gap-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                        <div className="w-16 h-16 rounded-md overflow-hidden">
                          <img
                            src={relatedProgram.image || "/placeholder.svg"}
                            alt={relatedProgram.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <h3 className="font-medium">{relatedProgram.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            {relatedProgram.duration} • {relatedProgram.level}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button asChild variant="outline" className="w-full">
                <Link href="/ai-trainer">Get AI Workout Advice</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
