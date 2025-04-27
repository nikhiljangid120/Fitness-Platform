"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { ChevronRight, Scale, Ruler } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const navyFormSchema = z.object({
  gender: z.enum(["male", "female"]),
  height: z.coerce.number().min(140, "Height must be between 140-220 cm").max(220, "Height must be between 140-220 cm"),
  weight: z.coerce.number().min(40, "Weight must be between 40-200 kg").max(200, "Weight must be between 40-200 kg"),
  waist: z.coerce.number().min(50, "Waist must be between 50-150 cm").max(150, "Waist must be between 50-150 cm"),
  neck: z.coerce.number().min(25, "Neck must be between 25-60 cm").max(60, "Neck must be between 25-60 cm"),
  hip: z.coerce.number().min(50, "Hip must be between 50-150 cm").max(150, "Hip must be between 50-150 cm").optional(),
}).refine((data) => data.gender === "male" || (data.gender === "female" && data.hip !== undefined), {
  message: "Hip measurement is required for females",
  path: ["hip"],
})

const skinfoldFormSchema = z.object({
  gender: z.enum(["male", "female"]),
  age: z.coerce.number().min(15, "Age must be between 15-100 years").max(100, "Age must be between 15-100 years"),
  chest: z.coerce.number().min(1, "Chest measurement must be between 1-50 mm").max(50, "Chest measurement must be between 1-50 mm").optional(),
  abdominal: z.coerce.number().min(1, "Abdominal measurement must be between 1-50 mm").max(50, "Abdominal measurement must be between 1-50 mm").optional(),
  thigh: z.coerce.number().min(1, "Thigh measurement must be between 1-50 mm").max(50, "Thigh measurement must be between 1-50 mm"),
  tricep: z.coerce.number().min(1, "Tricep measurement must be between 1-50 mm").max(50, "Tricep measurement must be between 1-50 mm").optional(),
  suprailiac: z.coerce.number().min(1, "Suprailiac measurement must be between 1-50 mm").max(50, "Suprailiac measurement must be between 1-50 mm").optional(),
}).refine((data) => data.gender === "female" || (data.chest !== undefined && data.abdominal !== undefined), {
  message: "Chest and abdominal measurements are required for males",
  path: ["chest"],
}).refine((data) => data.gender === "male" || (data.tricep !== undefined && data.suprailiac !== undefined), {
  message: "Tricep and suprailiac measurements are required for females",
  path: ["tricep"],
})

const bioFormSchema = z.object({
  gender: z.enum(["male", "female"]),
  age: z.coerce.number().min(15, "Age must be between 15-100 years").max(100, "Age must be between 15-100 years"),
  height: z.coerce.number().min(140, "Height must be between 140-220 cm").max(220, "Height must be between 140-220 cm"),
  weight: z.coerce.number().min(40, "Weight must be between 40-200 kg").max(200, "Weight must be between 40-200 kg"),
  bodyFat: z.coerce.number().min(1, "Body fat must be between 1-50%").max(50, "Body fat must be between 1-50%"),
})

type NavyFormValues = z.infer<typeof navyFormSchema>
type SkinfoldFormValues = z.infer<typeof skinfoldFormSchema>
type BioFormValues = z.infer<typeof bioFormSchema>

// Body fat categories
const bodyFatCategories = {
  male: [
    { name: "Essential Fat", range: "2-5%", min: 2, max: 5 },
    { name: "Athletes", range: "6-13%", min: 6, max: 13 },
    { name: "Fitness", range: "14-17%", min: 14, max: 17 },
    { name: "Average", range: "18-24%", min: 18, max: 24 },
    { name: "Obese", range: "25%+", min: 25, max: 100 },
  ],
  female: [
    { name: "Essential Fat", range: "10-13%", min: 10, max: 13 },
    { name: "Athletes", range: "14-20%", min: 14, max: 20 },
    { name: "Fitness", range: "21-24%", min: 21, max: 24 },
    { name: "Average", range: "25-31%", min: 25, max: 31 },
    { name: "Obese", range: "32%+", min: 32, max: 100 },
  ],
}

export default function BodyFatCalculator() {
  const [activeTab, setActiveTab] = useState('navy')
  const [results, setResults] = useState<{
    bodyFat: number;
    leanMass?: number;
    fatMass?: number;
    category: string;
    method: string;
    gender: 'male' | 'female';
  } | null>(null)
  
  const [showResults, setShowResults] = useState(false)

  const navyForm = useForm<NavyFormValues>({
    resolver: zodResolver(navyFormSchema),
    defaultValues: {
      gender: 'male',
      height: 175,
      weight: 70,
      waist: 80,
      neck: 35,
    },
  })

  const skinfoldForm = useForm<SkinfoldFormValues>({
    resolver: zodResolver(skinfoldFormSchema),
    defaultValues: {
      gender: 'male',
      age: 30,
      chest: 10,
      abdominal: 15,
      thigh: 10,
    },
  })

  const bioForm = useForm<BioFormValues>({
    resolver: zodResolver(bioFormSchema),
    defaultValues: {
      gender: 'male',
      age: 30,
      height: 175,
      weight: 70,
      bodyFat: 15,
    },
  })

  function calculateNavyMethod(data: NavyFormValues) {
    let bodyFat = 0
    
    if (data.gender === 'male') {
      bodyFat = 495 / (1.0324 - 0.19077 * Math.log10(data.waist - data.neck) + 0.15456 * Math.log10(data.height)) - 450
    } else {
      bodyFat = 495 / (1.29579 - 0.35004 * Math.log10(data.waist + (data.hip || 0) - data.neck) + 0.22100 * Math.log10(data.height)) - 450
    }
    
    const fatMass = (bodyFat / 100) * data.weight
    const leanMass = data.weight - fatMass
    
    const categories = bodyFatCategories[data.gender]
    let category = ''
    for (const cat of categories) {
      if (bodyFat >= cat.min && bodyFat <= cat.max) {
        category = cat.name
        break
      }
    }
    
    return {
      bodyFat: Math.max(1, Math.min(Math.round(bodyFat * 10) / 10, 50)),
      leanMass: Math.round(leanMass * 10) / 10,
      fatMass: Math.round(fatMass * 10) / 10,
      category,
      method: 'Navy Method',
      gender: data.gender,
    }
  }

  function calculateSkinfoldMethod(data: SkinfoldFormValues) {
    let bodyDensity = 0
    let bodyFat = 0
    let weight = 70 // Default weight for calculation; ideally, we should get this from user input
    
    if (data.gender === 'male') {
      const sum = (data.chest || 0) + (data.abdominal || 0) + data.thigh
      bodyDensity = 1.10938 - (0.0008267 * sum) + (0.0000016 * sum * sum) - (0.0002574 * data.age)
      bodyFat = (495 / bodyDensity) - 450
    } else {
      const sum = (data.tricep || 0) + (data.suprailiac || 0) + data.thigh
      bodyDensity = 1.0994921 - (0.0009929 * sum) + (0.0000023 * sum * sum) - (0.0001392 * data.age)
      bodyFat = (495 / bodyDensity) - 450
    }
    
    const fatMass = (bodyFat / 100) * weight
    const leanMass = weight - fatMass
    
    const categories = bodyFatCategories[data.gender]
    let category = ''
    for (const cat of categories) {
      if (bodyFat >= cat.min && bodyFat <= cat.max) {
        category = cat.name
        break
      }
    }
    
    return {
      bodyFat: Math.max(1, Math.min(Math.round(bodyFat * 10) / 10, 50)),
      leanMass: Math.round(leanMass * 10) / 10,
      fatMass: Math.round(fatMass * 10) / 10,
      category,
      method: 'Skinfold Method',
      gender: data.gender,
    }
  }

  function calculateBioMethod(data: BioFormValues) {
    const bodyFat = data.bodyFat
    const fatMass = (bodyFat / 100) * data.weight
    const leanMass = data.weight - fatMass
    
    const categories = bodyFatCategories[data.gender]
    let category = ''
    for (const cat of categories) {
      if (bodyFat >= cat.min && bodyFat <= cat.max) {
        category = cat.name
        break
      }
    }
    
    return {
      bodyFat: Math.round(bodyFat * 10) / 10,
      leanMass: Math.round(leanMass * 10) / 10,
      fatMass: Math.round(fatMass * 10) / 10,
      category,
      method: 'Bioelectrical Impedance',
      gender: data.gender,
    }
  }

  function onNavySubmit(data: NavyFormValues) {
    const result = calculateNavyMethod(data)
    setResults(result)
    setShowResults(true)
  }

  function onSkinfoldSubmit(data: SkinfoldFormValues) {
    const result = calculateSkinfoldMethod(data)
    setResults(result)
    setShowResults(true)
  }

  function onBioSubmit(data: BioFormValues) {
    const result = calculateBioMethod(data)
    setResults(result)
    setShowResults(true)
  }

  function getBodyFatColor(bodyFat: number, gender: 'male' | 'female') {
    if (gender === 'male') {
      if (bodyFat < 6) return 'text-blue-500'
      if (bodyFat < 14) return 'text-green-500'
      if (bodyFat < 18) return 'text-yellow-500'
      if (bodyFat < 25) return 'text-orange-500'
      return 'text-red-500'
    } else {
      if (bodyFat < 14) return 'text-blue-500'
      if (bodyFat < 21) return 'text-green-500'
      if (bodyFat < 25) return 'text-yellow-500'
      if (bodyFat < 32) return 'text-orange-500'
      return 'text-red-500'
    }
  }

  function getProgressValue(bodyFat: number, gender: 'male' | 'female') {
    const max = gender === 'male' ? 35 : 45
    return Math.min(100, (bodyFat / max) * 100)
  }

  return (
    <div className="container max-w-5xl py-10 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Body Fat Calculator</h1>
        <p className="text-muted-foreground">
          Estimate your body fat percentage using different measurement methods
        </p>
      </div>

      <Tabs value={showResults ? 'results' : activeTab} onValueChange={(value) => {
        if (value !== 'results') {
          setActiveTab(value)
          setShowResults(false)
        }
      }} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="navy">Navy Method</TabsTrigger>
          <TabsTrigger value="skinfold">Skinfold</TabsTrigger>
          <TabsTrigger value="bio">Bioimpedance</TabsTrigger>
          <TabsTrigger value="results" disabled={!results}>Results</TabsTrigger>
        </TabsList>
        
        <TabsContent value="navy" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Ruler className="h-5 w-5" />
                <span>Navy Method Calculator</span>
              </CardTitle>
              <CardDescription>
                Calculate body fat using circumference measurements
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...navyForm}>
                <form onSubmit={navyForm.handleSubmit(onNavySubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={navyForm.control}
                      name="gender"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel>Gender</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="flex gap-4"
                            >
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="male" />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  Male
                                </FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="female" />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  Female
                                </FormLabel>
                              </FormItem>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={navyForm.control}
                      name="height"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Height (cm)</FormLabel>
                          <FormControl>
                            <Input type="number" step="0.1" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={navyForm.control}
                      name="weight"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Weight (kg)</FormLabel>
                          <FormControl>
                            <Input type="number" step="0.1" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={navyForm.control}
                      name="neck"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Neck Circumference (cm)</FormLabel>
                          <FormControl>
                            <Input type="number" step="0.1" {...field} />
                          </FormControl>
                          <FormDescription>
                            Measure at the narrowest point
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={navyForm.control}
                      name="waist"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Waist Circumference (cm)</FormLabel>
                          <FormControl>
                            <Input type="number" step="0.1" {...field} />
                          </FormControl>
                          <FormDescription>
                            Measure at the navel level
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {navyForm.watch('gender') === 'female' && (
                      <FormField
                        control={navyForm.control}
                        name="hip"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Hip Circumference (cm)</FormLabel>
                            <FormControl>
                              <Input type="number" step="0.1" {...field} />
                            </FormControl>
                            <FormDescription>
                              Measure at the widest point
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                  </div>

                  <Button type="submit" className="w-full">
                    Calculate Body Fat
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="skinfold" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Scale className="h-5 w-5" />
                <span>Skinfold Method Calculator</span>
              </CardTitle>
              <CardDescription>
                Calculate body fat using skinfold measurements (Jackson-Pollock 3-Site)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...skinfoldForm}>
                <form onSubmit={skinfoldForm.handleSubmit(onSkinfoldSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={skinfoldForm.control}
                      name="gender"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel>Gender</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={(value) => {
                                field.onChange(value)
                                if (value === 'male') {
                                  skinfoldForm.setValue('chest', 10)
                                  skinfoldForm.setValue('abdominal', 15)
                                  skinfoldForm.setValue('thigh', 10)
                                  skinfoldForm.setValue('tricep', undefined)
                                  skinfoldForm.setValue('suprailiac', undefined)
                                } else {
                                  skinfoldForm.setValue('chest', undefined)
                                  skinfoldForm.setValue('abdominal', undefined)
                                  skinfoldForm.setValue('tricep', 15)
                                  skinfoldForm.setValue('suprailiac', 12)
                                  skinfoldForm.setValue('thigh', 20)
                                }
                                skinfoldForm.clearErrors()
                              }}
                              defaultValue={field.value}
                              className="flex gap-4"
                            >
                              <FormItem className="flex(uv items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="male" />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  Male
                                </FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="female" />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  Female
                                </FormLabel>
                              </FormItem>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={skinfoldForm.control}
                      name="age"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Age (years)</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {skinfoldForm.watch('gender') === 'male' && (
                      <>
                        <FormField
                          control={skinfoldForm.control}
                          name="chest"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Chest Skinfold (mm)</FormLabel>
                              <FormControl>
                                <Input type="number" step="0.1" {...field} />
                              </FormControl>
                              <FormDescription>
                                Diagonal fold halfway between the nipple and the anterior axillary fold
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={skinfoldForm.control}
                          name="abdominal"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Abdominal Skinfold (mm)</FormLabel>
                              <FormControl>
                                <Input type="number" step="0.1" {...field} />
                              </FormControl>
                              <FormDescription>
                                Vertical fold 2cm to the right of the umbilicus
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </>
                    )}

                    {skinfoldForm.watch('gender') === 'female' && (
                      <>
                        <FormField
                          control={skinfoldForm.control}
                          name="tricep"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Tricep Skinfold (mm)</FormLabel>
                              <FormControl>
                                <Input type="number" step="0.1" {...field} />
                              </FormControl>
                              <FormDescription>
                                Vertical fold on the back of the upper arm, halfway between the shoulder and elbow
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={skinfoldForm.control}
                          name="suprailiac"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Suprailiac Skinfold (mm)</FormLabel>
                              <FormControl>
                                <Input type="number" step="0.1" {...field} />
                              </FormControl>
                              <FormDescription>
                                Diagonal fold above the iliac crest at the anterior axillary line
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </>
                    )}

                    <FormField
                      control={skinfoldForm.control}
                      name="thigh"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Thigh Skinfold (mm)</FormLabel>
                          <FormControl>
                            <Input type="number" step="0.1" {...field} />
                          </FormControl>
                          <FormDescription>
                            Vertical fold on the front of the thigh, halfway between the hip and knee
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Button type="submit" className="w-full">
                    Calculate Body Fat
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bio" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Scale className="h-5 w-5" />
                <span>Bioelectrical Impedance</span>
              </CardTitle>
              <CardDescription>
                Enter your body fat percentage from a bioimpedance scale
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...bioForm}>
                <form onSubmit={bioForm.handleSubmit(onBioSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={bioForm.control}
                      name="gender"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel>Gender</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="flex gap-4"
                            >
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="male" />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  Male
                                </FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="female" />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  Female
                                </FormLabel>
                              </FormItem>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={bioForm.control}
                      name="age"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Age (years)</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={bioForm.control}
                      name="height"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Height (cm)</FormLabel>
                          <FormControl>
                            <Input type="number" step="0.1" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={bioForm.control}
                      name="weight"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Weight (kg)</FormLabel>
                          <FormControl>
                            <Input type="number" step="0.1" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={bioForm.control}
                      name="bodyFat"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Body Fat Percentage (%)</FormLabel>
                          <FormControl>
                            <Input type="number" step="0.1" {...field} />
                          </FormControl>
                          <FormDescription>
                            Enter the body fat percentage from your bioimpedance device
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Button type="submit" className="w-full">
                    Calculate Body Fat
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="results" className="space-y-4 mt-4">
          {results && (
            <Card>
              <CardHeader>
                <CardTitle>Body Fat Results</CardTitle>
                <CardDescription>
                  Results calculated using the {results.method}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold">Body Fat Percentage</h3>
                    <p className={`text-3xl font-bold ${getBodyFatColor(results.bodyFat, results.gender)}`}>
                      {results.bodyFat}%
                    </p>
                    <div className="mt-2 h-2 w-full bg-gray-200 rounded-full">
                      <div
                        className="h-full bg-green-500 rounded-full"
                        style={{ width: `${getProgressValue(results.bodyFat, results.gender)}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold">Category</h3>
                    <p className="text-xl">{results.category}</p>
                  </div>

                  {(results.leanMass && results.fatMass) && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h3 className="text-lg font-semibold">Lean Mass</h3>
                        <p className="text-xl">{results.leanMass} kg</p>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">Fat Mass</h3>
                        <p className="text-xl">{results.fatMass} kg</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="border-t pt-4">
                  <h3 className="text-lg font-semibold mb-2">Body Fat Categories</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {bodyFatCategories[results.gender].map((category) => (
                      <div
                        key={category.name}
                        className={`p-3 rounded-md ${
                          results.category === category.name
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted'
                        }`}
                      >
                        <p className="font-medium">{category.name}</p>
                        <p className="text-sm">{category.range}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <Button
                  variant="outline"
                  onClick={() => {
                    setShowResults(false)
                    setActiveTab(activeTab)
                  }}
                  className="w-full"
                >
                  Calculate Again
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}