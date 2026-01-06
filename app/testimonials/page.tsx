import { Quote, Star } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function TestimonialsPage() {
    const testimonials = [
        {
            name: "Sarah Jenkins",
            role: "Weight Loss Success",
            image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop",
            quote: "FlexForge completely transformed my approach to fitness. The AI plans adapted to my busy schedule, and I've lost 15kg in 6 months!",
            rating: 5,
        },
        {
            name: "Mike Chen",
            role: "Muscle Gain",
            image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop",
            quote: "I was stuck at a plateau for years. The workout variety and nutrition tracking helped me pack on lean muscle like never before.",
            rating: 5,
        },
        {
            name: "Emma Wilson",
            role: "Yoga Enthusiast",
            image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop",
            quote: "The yoga sessions are incredible. I love how the difficulty scales with my progress. It feels like having a personal instructor.",
            rating: 5,
        },
        {
            name: "David Thompson",
            role: "Marathon Runner",
            image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop",
            quote: "Training for my first marathon was seamless with the tailored cardio plans. The tracking features are top-notch.",
            rating: 4,
        },
        {
            name: "Lisa Rodriguez",
            role: "Post-Partum Fitness",
            image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop",
            quote: "Gentle, effective, and encouraging. Exactly what I needed to get back into shape after my pregnancy.",
            rating: 5,
        },
        {
            name: "Alex Kim",
            role: "Busy Professional",
            image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop",
            quote: "15-minute HIIT workouts saved me. I can stay fit without sacrificing my work hours. Best fitness investment I've made.",
            rating: 5,
        },
    ]

    return (
        <div className="container py-12 md:py-24 space-y-12">
            <div className="text-center space-y-4 max-w-3xl mx-auto">
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">
                    Success Stories
                </h1>
                <p className="text-xl text-muted-foreground">
                    Join thousands of members who have transformed their lives with FlexForge. Real people, real results.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {testimonials.map((testimonial, index) => (
                    <Card key={index} className="h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-primary/10 bg-card/50 backdrop-blur-sm">
                        <CardHeader className="flex flex-row items-center gap-4 pb-2">
                            <Avatar className="h-12 w-12 border-2 border-primary/20">
                                <AvatarImage src={testimonial.image} alt={testimonial.name} />
                                <AvatarFallback>{testimonial.name[0]}</AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col">
                                <CardTitle className="text-base">{testimonial.name}</CardTitle>
                                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                                    {testimonial.role}
                                </p>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex text-amber-500">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <Star
                                        key={i}
                                        className={`h-4 w-4 ${i < testimonial.rating ? "fill-current" : "text-muted/30"}`}
                                    />
                                ))}
                            </div>
                            <div className="relative">
                                <Quote className="h-8 w-8 text-primary/10 absolute -top-2 -left-2 transform scale-x-[-1]" />
                                <p className="text-muted-foreground italic relative z-10 pl-4 text-sm leading-relaxed">
                                    "{testimonial.quote}"
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="bg-primary/5 rounded-3xl p-8 md:p-12 text-center space-y-6 mt-16 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200&h=600&fit=crop')] bg-cover bg-center" />
                <div className="relative z-10 max-w-2xl mx-auto space-y-6">
                    <h2 className="text-3xl font-bold">Ready to write your own story?</h2>
                    <p className="text-lg text-muted-foreground">
                        Start your journey today with a personalized AI plan tailored just for you.
                    </p>
                    <a
                        href="/sign-up"
                        className="inline-flex h-11 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                    >
                        Get Started Free
                    </a>
                </div>
            </div>
        </div>
    )
}
