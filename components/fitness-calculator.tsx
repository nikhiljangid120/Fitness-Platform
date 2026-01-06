"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calculator, Scale, Flame } from "lucide-react"

export default function FitnessCalculator() {
  const [activeTab, setActiveTab] = useState("bmi")
  const [bmiResult, setBmiResult] = useState<number | null>(null)
  const [bmiCategory, setBmiCategory] = useState<string>("")
  const [tdeeResult, setTdeeResult] = useState<number | null>(null)
  const [macrosResult, setMacrosResult] = useState<{ protein: number; carbs: number; fat: number } | null>(null)

  // BMI Calculator
  const [bmiData, setBmiData] = useState({
    weight: "",
    height: "",
    unit: "metric", // metric or imperial
  })

  // TDEE Calculator
  const [tdeeData, setTdeeData] = useState({
    weight: "",
    height: "",
    age: "",
    gender: "male",
    activity: "moderate",
    unit: "metric",
  })

  // Macro Calculator
  const [macroData, setMacroData] = useState({
    weight: "",
    goal: "maintain", // lose, maintain, gain
    unit: "metric",
  })

  const handleBmiSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const weight = Number.parseFloat(bmiData.weight)
    const height = Number.parseFloat(bmiData.height)

    if (isNaN(weight) || isNaN(height) || weight <= 0 || height <= 0) {
      return
    }

    let bmi: number

    if (bmiData.unit === "metric") {
      // Weight in kg, height in cm
      bmi = weight / Math.pow(height / 100, 2)
    } else {
      // Weight in lbs, height in inches
      bmi = (weight * 703) / Math.pow(height, 2)
    }

    setBmiResult(Number.parseFloat(bmi.toFixed(1)))

    // Determine BMI category
    if (bmi < 18.5) {
      setBmiCategory("Underweight")
    } else if (bmi >= 18.5 && bmi < 25) {
      setBmiCategory("Normal weight")
    } else if (bmi >= 25 && bmi < 30) {
      setBmiCategory("Overweight")
    } else {
      setBmiCategory("Obesity")
    }
  }

  const handleTdeeSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    let weight = Number.parseFloat(tdeeData.weight)
    let height = Number.parseFloat(tdeeData.height)
    const age = Number.parseFloat(tdeeData.age)

    if (isNaN(weight) || isNaN(height) || isNaN(age) || weight <= 0 || height <= 0 || age <= 0) {
      return
    }

    // Convert to metric if needed
    if (tdeeData.unit === "imperial") {
      weight = weight * 0.453592 // lbs to kg
      height = height * 2.54 // inches to cm
    }

    // Calculate BMR using Mifflin-St Jeor Equation
    let bmr: number
    if (tdeeData.gender === "male") {
      bmr = 10 * weight + 6.25 * height - 5 * age + 5
    } else {
      bmr = 10 * weight + 6.25 * height - 5 * age - 161
    }

    // Apply activity multiplier
    let tdee: number
    switch (tdeeData.activity) {
      case "sedentary":
        tdee = bmr * 1.2
        break
      case "light":
        tdee = bmr * 1.375
        break
      case "moderate":
        tdee = bmr * 1.55
        break
      case "active":
        tdee = bmr * 1.725
        break
      case "very":
        tdee = bmr * 1.9
        break
      default:
        tdee = bmr * 1.55
    }

    setTdeeResult(Math.round(tdee))
  }

  const handleMacroSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    let weight = Number.parseFloat(macroData.weight)

    if (isNaN(weight) || weight <= 0) {
      return
    }

    // Convert to kg if needed
    if (macroData.unit === "imperial") {
      weight = weight * 0.453592 // lbs to kg
    }

    let protein: number
    let fat: number
    let carbs: number

    switch (macroData.goal) {
      case "lose":
        protein = weight * 2.2 // 2.2g per kg
        fat = weight * 0.8 // 0.8g per kg
        carbs = weight * 2 // 2g per kg
        break
      case "maintain":
        protein = weight * 1.8 // 1.8g per kg
        fat = weight * 1 // 1g per kg
        carbs = weight * 3 // 3g per kg
        break
      case "gain":
        protein = weight * 2 // 2g per kg
        fat = weight * 1.2 // 1.2g per kg
        carbs = weight * 4 // 4g per kg
        break
      default:
        protein = weight * 1.8
        fat = weight * 1
        carbs = weight * 3
    }

    setMacrosResult({
      protein: Math.round(protein),
      carbs: Math.round(carbs),
      fat: Math.round(fat),
    })
  }

  return (
    <div className="max-w-3xl mx-auto">
      <Tabs defaultValue="bmi" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 mb-8">
          <TabsTrigger value="bmi" className="flex items-center gap-2">
            <Scale className="h-4 w-4" /> BMI
          </TabsTrigger>
          <TabsTrigger value="tdee" className="flex items-center gap-2">
            <Flame className="h-4 w-4" /> TDEE
          </TabsTrigger>
          <TabsTrigger value="macros" className="flex items-center gap-2">
            <Calculator className="h-4 w-4" /> Macros
          </TabsTrigger>
        </TabsList>

        {/* BMI Calculator */}
        <TabsContent value="bmi">
          <Card>
            <CardHeader>
              <CardTitle>Body Mass Index (BMI) Calculator</CardTitle>
              <CardDescription>
                Calculate your Body Mass Index to determine if your weight is in a healthy range.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleBmiSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label>Unit System</Label>
                  <RadioGroup
                    defaultValue="metric"
                    value={bmiData.unit}
                    onValueChange={(value) => setBmiData({ ...bmiData, unit: value })}
                    className="flex space-x-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="metric" id="bmi-metric" />
                      <Label htmlFor="bmi-metric">Metric (kg/cm)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="imperial" id="bmi-imperial" />
                      <Label htmlFor="bmi-imperial">Imperial (lb/in)</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="bmi-weight">Weight ({bmiData.unit === "metric" ? "kg" : "lb"})</Label>
                    <Input
                      id="bmi-weight"
                      type="number"
                      placeholder="Enter weight"
                      value={bmiData.weight}
                      onChange={(e) => setBmiData({ ...bmiData, weight: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bmi-height">Height ({bmiData.unit === "metric" ? "cm" : "in"})</Label>
                    <Input
                      id="bmi-height"
                      type="number"
                      placeholder="Enter height"
                      value={bmiData.height}
                      onChange={(e) => setBmiData({ ...bmiData, height: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
                  Calculate BMI
                </Button>
              </form>

              {bmiResult !== null && (
                <div className="mt-6 p-4 bg-primary/10 rounded-lg">
                  <h3 className="font-semibold text-lg mb-2">Your Results</h3>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-muted-foreground">Your BMI</p>
                      <p className="text-3xl font-bold">{bmiResult}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Category</p>
                      <p className="text-xl font-semibold">{bmiCategory}</p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* TDEE Calculator */}
        <TabsContent value="tdee">
          <Card>
            <CardHeader>
              <CardTitle>Total Daily Energy Expenditure (TDEE)</CardTitle>
              <CardDescription>
                Calculate how many calories you burn per day based on your activity level.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleTdeeSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label>Unit System</Label>
                  <RadioGroup
                    defaultValue="metric"
                    value={tdeeData.unit}
                    onValueChange={(value) => setTdeeData({ ...tdeeData, unit: value })}
                    className="flex space-x-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="metric" id="tdee-metric" />
                      <Label htmlFor="tdee-metric">Metric (kg/cm)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="imperial" id="tdee-imperial" />
                      <Label htmlFor="tdee-imperial">Imperial (lb/in)</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="tdee-weight">Weight ({tdeeData.unit === "metric" ? "kg" : "lb"})</Label>
                    <Input
                      id="tdee-weight"
                      type="number"
                      placeholder="Enter weight"
                      value={tdeeData.weight}
                      onChange={(e) => setTdeeData({ ...tdeeData, weight: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tdee-height">Height ({tdeeData.unit === "metric" ? "cm" : "in"})</Label>
                    <Input
                      id="tdee-height"
                      type="number"
                      placeholder="Enter height"
                      value={tdeeData.height}
                      onChange={(e) => setTdeeData({ ...tdeeData, height: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="tdee-age">Age</Label>
                    <Input
                      id="tdee-age"
                      type="number"
                      placeholder="Enter age"
                      value={tdeeData.age}
                      onChange={(e) => setTdeeData({ ...tdeeData, age: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Gender</Label>
                    <RadioGroup
                      defaultValue="male"
                      value={tdeeData.gender}
                      onValueChange={(value) => setTdeeData({ ...tdeeData, gender: value })}
                      className="flex space-x-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="male" id="tdee-male" />
                        <Label htmlFor="tdee-male">Male</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="female" id="tdee-female" />
                        <Label htmlFor="tdee-female">Female</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tdee-activity">Activity Level</Label>
                  <Select
                    value={tdeeData.activity}
                    onValueChange={(value) => setTdeeData({ ...tdeeData, activity: value })}
                  >
                    <SelectTrigger id="tdee-activity">
                      <SelectValue placeholder="Select activity level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sedentary">Sedentary (little or no exercise)</SelectItem>
                      <SelectItem value="light">Lightly active (light exercise 1-3 days/week)</SelectItem>
                      <SelectItem value="moderate">Moderately active (moderate exercise 3-5 days/week)</SelectItem>
                      <SelectItem value="active">Very active (hard exercise 6-7 days/week)</SelectItem>
                      <SelectItem value="very">Extra active (very hard exercise & physical job)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
                  Calculate TDEE
                </Button>
              </form>

              {tdeeResult !== null && (
                <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                  <h3 className="font-semibold text-lg mb-2">Your Results</h3>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Your Daily Calorie Needs</p>
                    <p className="text-3xl font-bold">{tdeeResult} calories</p>
                    <div className="grid grid-cols-3 gap-2 mt-4 text-sm">
                      <div className="bg-background p-2 rounded shadow-sm">
                        <p className="text-muted-foreground">Weight Loss</p>
                        <p className="font-semibold">{tdeeResult - 500} cal</p>
                      </div>
                      <div className="bg-background p-2 rounded shadow-sm">
                        <p className="text-muted-foreground">Maintenance</p>
                        <p className="font-semibold">{tdeeResult} cal</p>
                      </div>
                      <div className="bg-background p-2 rounded shadow-sm">
                        <p className="text-muted-foreground">Weight Gain</p>
                        <p className="font-semibold">{tdeeResult + 500} cal</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Macro Calculator */}
        <TabsContent value="macros">
          <Card>
            <CardHeader>
              <CardTitle>Macronutrient Calculator</CardTitle>
              <CardDescription>
                Calculate your recommended daily intake of protein, carbs, and fat based on your goals.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleMacroSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label>Unit System</Label>
                  <RadioGroup
                    defaultValue="metric"
                    value={macroData.unit}
                    onValueChange={(value) => setMacroData({ ...macroData, unit: value })}
                    className="flex space-x-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="metric" id="macro-metric" />
                      <Label htmlFor="macro-metric">Metric (kg)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="imperial" id="macro-imperial" />
                      <Label htmlFor="macro-imperial">Imperial (lb)</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="macro-weight">Weight ({macroData.unit === "metric" ? "kg" : "lb"})</Label>
                  <Input
                    id="macro-weight"
                    type="number"
                    placeholder="Enter weight"
                    value={macroData.weight}
                    onChange={(e) => setMacroData({ ...macroData, weight: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="macro-goal">Goal</Label>
                  <Select value={macroData.goal} onValueChange={(value) => setMacroData({ ...macroData, goal: value })}>
                    <SelectTrigger id="macro-goal">
                      <SelectValue placeholder="Select your goal" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="lose">Weight Loss</SelectItem>
                      <SelectItem value="maintain">Maintenance</SelectItem>
                      <SelectItem value="gain">Muscle Gain</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
                  Calculate Macros
                </Button>
              </form>

              {macrosResult !== null && (
                <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                  <h3 className="font-semibold text-lg mb-2">Your Daily Macros</h3>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="bg-background p-3 rounded-lg shadow-sm">
                      <div className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-2">
                        <span className="text-red-500 font-semibold">P</span>
                      </div>
                      <p className="text-sm text-muted-foreground">Protein</p>
                      <p className="text-xl font-bold">{macrosResult.protein}g</p>
                      <p className="text-xs text-muted-foreground">{Math.round(macrosResult.protein * 4)} calories</p>
                    </div>
                    <div className="bg-background p-3 rounded-lg shadow-sm">
                      <div className="w-8 h-8 rounded-full bg-yellow-500/10 flex items-center justify-center mx-auto mb-2">
                        <span className="text-yellow-500 font-semibold">C</span>
                      </div>
                      <p className="text-sm text-muted-foreground">Carbs</p>
                      <p className="text-xl font-bold">{macrosResult.carbs}g</p>
                      <p className="text-xs text-muted-foreground">{Math.round(macrosResult.carbs * 4)} calories</p>
                    </div>
                    <div className="bg-background p-3 rounded-lg shadow-sm">
                      <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center mx-auto mb-2">
                        <span className="text-blue-500 font-semibold">F</span>
                      </div>
                      <p className="text-sm text-muted-foreground">Fat</p>
                      <p className="text-xl font-bold">{macrosResult.fat}g</p>
                      <p className="text-xs text-muted-foreground">{Math.round(macrosResult.fat * 9)} calories</p>
                    </div>
                  </div>
                  <div className="mt-4 text-center">
                    <p className="text-sm text-muted-foreground">Total Daily Calories</p>
                    <p className="text-xl font-bold">
                      {Math.round(macrosResult.protein * 4 + macrosResult.carbs * 4 + macrosResult.fat * 9)}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
