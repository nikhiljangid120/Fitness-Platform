"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowRight, ArrowLeft, Check, Activity, Dumbbell, Target, Users, Zap, Apple, TrendingUp } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

export default function OnboardingPage() {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
    height: "",
    weight: "",
    goal: "",
    fitnessLevel: "",
    workoutDays: [] as string[],
    dietaryPreferences: [] as string[],
  })
  const router = useRouter()
  const { toast } = useToast()

  const handleNext = () => {
    // Validation logic
    if (step === 1 && (!formData.name || !formData.age || !formData.gender)) {
      toast({ title: "Missing info", description: "Please complete all fields.", variant: "destructive" })
      return
    }
    if (step === 2 && (!formData.height || !formData.weight)) {
      toast({ title: "Missing info", description: "Height and weight are required.", variant: "destructive" })
      return
    }
    if (step === 3 && (!formData.goal || !formData.fitnessLevel)) {
      toast({ title: "Missing info", description: "Please select a goal and fitness level.", variant: "destructive" })
      return
    }

    if (step < 4) {
      setStep(step + 1)
    } else {
      toast({ title: "All set!", description: "Redirecting to your dashboard..." })
      setTimeout(() => router.push("/my-plan"), 1500)
    }
  }

  const handleBack = () => step > 1 && setStep(step - 1)

  const updateFormData = (field: string, value: any) => setFormData({ ...formData, [field]: value })

  const toggleSelection = (field: "workoutDays" | "dietaryPreferences", value: string) => {
    const current = formData[field]
    const updated = current.includes(value)
      ? current.filter(item => item !== value)
      : [...current, value]
    updateFormData(field, updated)
  }

  const fadeIn = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
    transition: { duration: 0.3 }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-muted/50 to-background overflow-hidden relative">
      {/* Background Decorative Blobs */}
      <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl z-0 pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-purple-500/5 rounded-full blur-3xl z-0 pointer-events-none" />

      <Card className="w-full max-w-4xl border-none shadow-2xl bg-card/80 backdrop-blur-xl relative z-10 overflow-hidden">
        <div className="flex h-full min-h-[600px] flex-col md:flex-row">

          {/* Sidebar / Progress */}
          <div className="w-full md:w-1/3 bg-muted/50 p-8 flex flex-col justify-between border-r border-border/50">
            <div>
              <div className="mb-8">
                <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600 mb-2">FlexForge</h1>
                <p className="text-sm text-muted-foreground">Setup your profile</p>
              </div>
              <div className="space-y-6">
                {[
                  { id: 1, label: "Basics", icon: Users },
                  { id: 2, label: "Body Stats", icon: Activity },
                  { id: 3, label: "Goals", icon: Target },
                  { id: 4, label: "Preferences", icon: Zap },
                ].map((s) => (
                  <div key={s.id} className={cn("flex items-center gap-4 transition-colors", step === s.id ? "text-primary" : step > s.id ? "text-foreground" : "text-muted-foreground")}>
                    <div className={cn(
                      "h-10 w-10 rounded-full flex items-center justify-center border-2 transition-all shadow-sm",
                      step === s.id ? "border-primary bg-primary/10 shadow-primary/20" : step > s.id ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background"
                    )}>
                      {step > s.id ? <Check className="h-5 w-5" /> : <s.icon className="h-5 w-5" />}
                    </div>
                    <span className="font-medium">{s.label}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-8">
              <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-primary to-purple-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${(step / 4) * 100}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-2 text-right">{step} of 4</p>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 p-8 md:p-12 flex flex-col">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div key="step1" {...fadeIn} className="flex-1 space-y-8">
                  <div>
                    <h2 className="text-3xl font-bold tracking-tight">Let's get to know you.</h2>
                    <p className="text-muted-foreground mt-2">Just the basics to get started.</p>
                  </div>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label>Full Name</Label>
                      <Input placeholder="John Doe" value={formData.name} onChange={(e) => updateFormData("name", e.target.value)} className="h-12 bg-background/50 text-lg" />
                    </div>
                    <div className="space-y-2">
                      <Label>Age</Label>
                      <Input type="number" placeholder="25" value={formData.age} onChange={(e) => updateFormData("age", e.target.value)} className="h-12 bg-background/50 text-lg" />
                    </div>
                    <div className="space-y-2">
                      <Label className="mb-2 block">Gender</Label>
                      <div className="grid grid-cols-3 gap-4">
                        {["Male", "Female", "Other"].map((g) => (
                          <div
                            key={g}
                            onClick={() => updateFormData("gender", g.toLowerCase())}
                            className={cn(
                              "cursor-pointer rounded-xl border-2 p-4 text-center hover:border-primary/50 transition-all",
                              formData.gender === g.toLowerCase() ? "border-primary bg-primary/5 shadow-md scale-[1.02]" : "border-muted bg-background"
                            )}
                          >
                            <span className="font-medium">{g}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div key="step2" {...fadeIn} className="flex-1 space-y-8">
                  <div>
                    <h2 className="text-3xl font-bold tracking-tight">Body Stats.</h2>
                    <p className="text-muted-foreground mt-2">To calculate your metrics accurately.</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4 p-6 rounded-2xl bg-muted/30 border border-border/50">
                      <Label className="text-lg">Height</Label>
                      <div className="flex items-end gap-2">
                        <Input type="number" placeholder="175" value={formData.height} onChange={(e) => updateFormData("height", e.target.value)} className="h-16 text-3xl font-bold bg-background text-center" />
                        <span className="mb-4 text-muted-foreground font-medium">cm</span>
                      </div>
                    </div>
                    <div className="space-y-4 p-6 rounded-2xl bg-muted/30 border border-border/50">
                      <Label className="text-lg">Weight</Label>
                      <div className="flex items-end gap-2">
                        <Input type="number" placeholder="70" value={formData.weight} onChange={(e) => updateFormData("weight", e.target.value)} className="h-16 text-3xl font-bold bg-background text-center" />
                        <span className="mb-4 text-muted-foreground font-medium">kg</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div key="step3" {...fadeIn} className="flex-1 space-y-8">
                  <div>
                    <h2 className="text-3xl font-bold tracking-tight">Your Goal.</h2>
                    <p className="text-muted-foreground mt-2">What are we aiming for?</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { id: "weight-loss", label: "Weight Loss", icon: TrendingUp },
                      { id: "muscle-gain", label: "Muscle Gain", icon: Dumbbell },
                      { id: "endurance", label: "Endurance", icon: Activity },
                      { id: "flexibility", label: "Flexibility", icon: Zap },
                    ].map((item) => (
                      <div
                        key={item.id}
                        onClick={() => updateFormData("goal", item.id)}
                        className={cn(
                          "cursor-pointer rounded-2xl border-2 p-6 flex flex-col items-center gap-3 transition-all hover:bg-muted/50",
                          formData.goal === item.id ? "border-primary bg-primary/5 shadow-lg scale-[1.02]" : "border-muted bg-background"
                        )}
                      >
                        <div className={cn("h-12 w-12 rounded-full flex items-center justify-center", formData.goal === item.id ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground")}>
                          <item.icon className="h-6 w-6" />
                        </div>
                        <span className="font-semibold">{item.label}</span>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-4 mt-6">
                    <Label className="text-lg">Fitness Level</Label>
                    <div className="grid grid-cols-3 gap-4">
                      {["Beginner", "Intermediate", "Advanced"].map((level) => (
                        <div
                          key={level}
                          onClick={() => updateFormData("fitnessLevel", level.toLowerCase())}
                          className={cn(
                            "cursor-pointer rounded-xl border-2 p-4 text-center transition-all",
                            formData.fitnessLevel === level.toLowerCase() ? "border-primary bg-primary/5 font-semibold text-primary" : "border-muted text-muted-foreground"
                          )}
                        >
                          {level}
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 4 && (
                <motion.div key="step4" {...fadeIn} className="flex-1 space-y-8">
                  <div>
                    <h2 className="text-3xl font-bold tracking-tight">Final Touches.</h2>
                    <p className="text-muted-foreground mt-2">Customize your schedule and diet.</p>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-3">
                      <Label className="text-base">Workout Days</Label>
                      <div className="flex flex-wrap gap-3">
                        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                          <div
                            key={day}
                            onClick={() => toggleSelection("workoutDays", day)}
                            className={cn(
                              "cursor-pointer h-12 w-12 rounded-full border-2 flex items-center justify-center font-medium transition-all",
                              formData.workoutDays.includes(day) ? "border-primary bg-primary text-primary-foreground shadow-md scale-110" : "border-border bg-background hover:border-primary/50"
                            )}
                          >
                            {day[0]}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label className="text-base">Dietary Preferences</Label>
                      <div className="grid grid-cols-2 gap-3">
                        {["Vegetarian", "Vegan", "Keto", "High Protein", "Gluten Free", "None"].map((diet) => (
                          <div
                            key={diet}
                            onClick={() => toggleSelection("dietaryPreferences", diet)}
                            className={cn(
                              "cursor-pointer rounded-xl border p-4 flex items-center gap-3 transition-colors hover:bg-muted/50",
                              formData.dietaryPreferences.includes(diet) ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-muted bg-background"
                            )}
                          >
                            <div className={cn("h-5 w-5 rounded border flex items-center justify-center", formData.dietaryPreferences.includes(diet) ? "bg-primary border-primary text-primary-foreground" : "border-muted-foreground")}>
                              {formData.dietaryPreferences.includes(diet) && <Check className="h-3 w-3" />}
                            </div>
                            <span className="font-medium text-sm">{diet}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="mt-auto pt-8 flex justify-between items-center">
              <Button variant="ghost" onClick={handleBack} disabled={step === 1} className="hover:bg-transparent hover:text-primary">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
              </Button>
              <Button onClick={handleNext} size="lg" className="rounded-full px-8 shadow-lg shadow-primary/25">
                {step === 4 ? "Complete Setup" : "Continue"} <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
