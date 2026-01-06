"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star } from "lucide-react"

export default function TestimonialsPage() {
    return (
        <div className="container py-16 px-4 md:px-8">
            <div className="text-center mb-12">
                <Badge className="mb-4 px-4 py-1.5 bg-primary/10 text-primary hover:bg-primary/20 transition-colors font-medium text-sm rounded-full">TESTIMONIALS</Badge>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Success Stories</h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                    See how FlexForge has transformed the lives of our community members
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                    {
                        name: "Govind Goyal",
                        achievement: "Lost 30 lbs in 3 months",
                        image: "/govind.jpg",
                        quote:
                            "FlexForge completely changed my approach to fitness. The personalized plans and AI trainer kept me motivated and on track.",
                    },
                    {
                        name: "Sachin Gurjar",
                        achievement: "Gained 15 lbs of muscle",
                        image: "/sachin.jpg",
                        quote:
                            "As someone who struggled with building muscle, the structured programs and nutrition advice were exactly what I needed to see real results.",
                    },
                    {
                        name: "Soyal Islam",
                        achievement: "Improved marathon time by 20 minutes",
                        image: "/soyal.jpg",
                        quote:
                            "The cardio programs and endurance training tips helped me shave 20 minutes off my marathon time. I couldn't be happier with my progress!",
                    },
                ].map((testimonial, index) => (
                    <Card
                        key={index}
                        className="bg-card p-6 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-[1.03] border-0 rounded-2xl"
                    >
                        <CardContent className="p-0">
                            <div className="relative flex justify-center mb-6">
                                <div className="relative w-20 h-20 rounded-full overflow-hidden border-4 border-primary/50 shadow-lg group">
                                    <img
                                        src={testimonial.image || "/placeholder.svg"}
                                        alt={testimonial.name}
                                        className={`w-full h-full object-cover object-center transition-transform duration-500 ${testimonial.name === "Govind Goyal"
                                            ? "scale-125 group-hover:scale-150"
                                            : ""
                                            }`}
                                    />
                                    {/* Halo Ping Animation */}
                                    <span className="absolute inset-0 rounded-full border-2 border-primary/30 animate-ping opacity-50"></span>
                                </div>
                            </div>
                            <div className="flex justify-center mb-3">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                        key={star}
                                        className="h-5 w-5 text-yellow-400 fill-yellow-400"
                                    />
                                ))}
                            </div>
                            <p className="text-muted-foreground text-center italic mb-6">
                                "{testimonial.quote}"
                            </p>
                            <div className="pt-4 border-t border-border text-center">
                                <h3 className="font-semibold text-lg">{testimonial.name}</h3>
                                <p className="text-sm text-primary">{testimonial.achievement}</p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}
