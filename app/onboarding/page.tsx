"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowRight, ArrowLeft, Check } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

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
    workoutDays: [],
    dietaryPreferences: [],
  })
  const router = useRouter()
  const { toast } = useToast()

  const handleNext = () => {
    if (step === 1 && (!formData.name || !formData.age || !formData.gender)) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields before continuing.",
        variant: "destructive",
      })
      return
    }

    if (step === 2 && (!formData.height || !formData.weight)) {
      toast({
        title: "Missing information",
        description: "Please fill in your height and weight before continuing.",
        variant: "destructive",
      })
      return
    }

    if (step === 3 && !formData.goal) {
      toast({
        title: "Missing information",
        description: "Please select your primary fitness goal before continuing.",
        variant: "destructive",
      })
      return
    }

    if (step < 4) {
      setStep(step + 1)
    } else {
      // Submit form and redirect
      toast({
        title: "Profile created!",
        description: "Your personalized fitness plan is ready.",
      })
      router.push("/my-plan")
    }
  }

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  const updateFormData = (field: string, value: any) => {
    setFormData({
      ...formData,
      [field]: value,
    })
  }

  const toggleWorkoutDay = (day: string) => {
    const currentDays = [...formData.workoutDays] as string[]
    if (currentDays.includes(day)) {
      updateFormData(
        "workoutDays",
        currentDays.filter((d) => d !== day),
      )
    } else {
      updateFormData("workoutDays", [...currentDays, day])
    }
  }

  const toggleDietaryPreference = (preference: string) => {
    const currentPreferences = [...formData.dietaryPreferences] as string[]
    if (currentPreferences.includes(preference)) {
      updateFormData(
        "dietaryPreferences",
        currentPreferences.filter((p) => p !== preference),
      )
    } else {
      updateFormData("dietaryPreferences", [...currentPreferences, preference])
    }
  }

  return (
    <div className="container max-w-3xl py-12">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Create Your Fitness Profile</CardTitle>
          <CardDescription>Let's personalize your fitness journey with FitVerseX</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-8">
            <div className="flex justify-between mb-2">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className={`flex items-center justify-center w-10 h-10 rounded-full ${
                    i === step
                      ? "bg-primary text-primary-foreground"
                      : i < step
                        ? "bg-primary/20 text-primary"
                        : "bg-muted text-muted-foreground"
                  }`}
                >
                  {i < step ? <Check className="h-5 w-5" /> : i}
                </div>
              ))}
            </div>
            <div className="relative w-full h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="absolute top-0 left-0 h-full bg-primary transition-all duration-300"
                style={{ width: `${((step - 1) / 3) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Step 1: Basic Information */}
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Basic Information</h2>

              <div className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={(e) => updateFormData("name", e.target.value)}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    type="number"
                    placeholder="Enter your age"
                    value={formData.age}
                    onChange={(e) => updateFormData("age", e.target.value)}
                  />
                </div>

                <div className="grid gap-2">
                  <Label>Gender</Label>
                  <RadioGroup
                    value={formData.gender}
                    onValueChange={(value) => updateFormData("gender", value)}
                    className="flex gap-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="male" id="male" />
                      <Label htmlFor="male">Male</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="female" id="female" />
                      <Label htmlFor="female">Female</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="other" id="other" />
                      <Label htmlFor="other">Other</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Body Measurements */}
          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Body Measurements</h2>

              <div className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="height">Height (cm)</Label>
                  <Input
                    id="height"
                    type="number"
                    placeholder="Enter your height in cm"
                    value={formData.height}
                    onChange={(e) => updateFormData("height", e.target.value)}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="weight">Weight (kg)</Label>
                  <Input
                    id="weight"
                    type="number"
                    placeholder="Enter your weight in kg"
                    value={formData.weight}
                    onChange={(e) => updateFormData("weight", e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Fitness Goals */}
          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Fitness Goals</h2>

              <div className="space-y-4">
                <div className="grid gap-2">
                  <Label>Primary Goal</Label>
                  <RadioGroup
                    value={formData.goal}
                    onValueChange={(value) => updateFormData("goal", value)}
                    className="grid gap-2"
                  >
                    {[
                      { value: "weight-loss", label: "Weight Loss" },
                      { value: "muscle-gain", label: "Muscle Gain" },
                      { value: "endurance", label: "Improve Endurance" },
                      { value: "flexibility", label: "Increase Flexibility" },
                      { value: "general-fitness", label: "General Fitness" },
                    ].map((goal) => (
                      <div key={goal.value} className="flex items-center space-x-2">
                        <RadioGroupItem value={goal.value} id={goal.value} />
                        <Label htmlFor={goal.value}>{goal.label}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                <div className="grid gap-2">
                  <Label>Fitness Level</Label>
                  <Select
                    value={formData.fitnessLevel}
                    onValueChange={(value) => updateFormData("fitnessLevel", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select your fitness level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Preferences */}
          {step === 4 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Preferences</h2>

              <div className="space-y-4">
                <div className="grid gap-2">
                  <Label>Preferred Workout Days</Label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => (
                      <div key={day} className="flex items-center space-x-2">
                        <Checkbox
                          id={day}
                          checked={(formData.workoutDays as string[]).includes(day)}
                          onCheckedChange={() => toggleWorkoutDay(day)}
                        />
                        <Label htmlFor={day}>{day}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label>Dietary Preferences</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: "vegetarian", label: "Vegetarian" },
                      { id: "vegan", label: "Vegan" },
                      { id: "keto", label: "Keto" },
                      { id: "gluten-free", label: "Gluten-Free" },
                      { id: "dairy-free", label: "Dairy-Free" },
                      { id: "high-protein", label: "High Protein" },
                    ].map((pref) => (
                      <div key={pref.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={pref.id}
                          checked={(formData.dietaryPreferences as string[]).includes(pref.id)}
                          onCheckedChange={() => toggleDietaryPreference(pref.id)}
                        />
                        <Label htmlFor={pref.id}>{pref.label}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={handleBack} disabled={step === 1}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
          <Button onClick={handleNext}>
            {step < 4 ? (
              <>
                Next <ArrowRight className="ml-2 h-4 w-4" />
              </>
            ) : (
              "Create My Plan"
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
