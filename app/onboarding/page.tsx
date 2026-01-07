import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import OnboardingWizard from "@/components/onboarding-wizard"

export default async function OnboardingPage() {
  const user = await getCurrentUser()

  // 1. If not logged in -> Sign In
  if (!user) {
    redirect("/sign-in")
  }

  // 2. If user already has critical profile data -> Dashboard (My Plan)
  // We check if 'fitnessGoal' or 'age' is set as a proxy for completed onboarding
  if (user.fitnessGoal && user.age) {
    redirect("/my-plan")
  }

  // 3. User logged in but no profile -> Show Onboarding
  return <OnboardingWizard />
}
