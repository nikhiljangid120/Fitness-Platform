import { getCurrentUser } from "@/lib/auth"
import { redirect } from "next/navigation"
import DashboardClient from "@/components/dashboard/dashboard-client"
import prisma from "@/lib/prisma"

export default async function MyPlanPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/sign-in")
  }

  // Fetch workout history
  const workouts = await prisma.completedWorkout.findMany({
    where: { userId: user.id },
    orderBy: { completedAt: "desc" },
  })

  // Calculate streak
  // Naive implementation: Check consecutive days backwards from today
  // In a real app, this might be more complex or stored as a field
  let streak = 0
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  // Create a set of unique dates where workout happened
  const workoutDates = new Set(
    workouts.map((w: any) => {
      const d = new Date(w.completedAt)
      d.setHours(0, 0, 0, 0)
      return d.getTime()
    })
  )

  if (workoutDates.has(today.getTime())) {
    streak = 1
    let checkDate = new Date(today)
    checkDate.setDate(checkDate.getDate() - 1)

    while (workoutDates.has(checkDate.getTime())) {
      streak++
      checkDate.setDate(checkDate.getDate() - 1)
    }
  }

  // Fetch weight progress
  const progress = await prisma.progress.findMany({
    where: { userId: user.id },
    orderBy: { date: "asc" },
  })

  const startWeight = progress.length > 0 ? progress[0].weight : (user.weight || 80)
  const currentWeight = user.weight || 80

  // Prepare stats object
  const stats = {
    streak,
    workoutsCompleted: workouts.length,
    currentWeight,
    targetWeight: user.targetWeight || 70, // Fallback if not set
    startWeight,
  }

  return <DashboardClient user={user} stats={stats} />
}
