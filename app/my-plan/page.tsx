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
  let workouts: any[] = []
  try {
    workouts = await prisma.completedWorkout.findMany({
      where: { userId: user.id },
      orderBy: { completedAt: "desc" },
    })
  } catch (e) { console.warn("DB Error (Workouts):", e) }

  // Calculate streak logic...
  // ... (keep existing streak logic, it works on empty array too)

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
  let progress: any[] = []
  try {
    progress = await prisma.progress.findMany({
      where: { userId: user.id },
      orderBy: { date: "asc" },
    })
  } catch (e) { console.warn("DB Error (Progress):", e) }

  // Fetch latest AI Plan
  let latestPlan = null
  try {
    latestPlan = await prisma.workoutPlan.findFirst({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' }
    })
  } catch (e) { console.warn("DB Error (Plan):", e) }

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

  return <DashboardClient user={user} stats={stats} initialPlan={latestPlan?.planData as any} />
}
