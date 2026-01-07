"use client"

import type React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  ArrowRight,
  Dumbbell,
  Utensils,
  Brain,
  User,
  Trophy,
  ChevronRight,
  Star,
  Calendar,
  Medal,
  BarChart3,
  Sparkles,
  Play,
  CheckCircle,
  ArrowUpRight,
} from "lucide-react"

import { Flame as Fire, Clock, Zap } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import FitnessTip from "@/components/fitness-tip"
import WorkoutOfTheDay from "@/components/workout-of-the-day"
import FitnessCalculator from "@/components/fitness-calculator"
import { useState, useEffect } from "react"

export default function Home() {
  // Add animated counter state
  const [counts, setCounts] = useState({
    workouts: 0,
    users: 0,
    countries: 0
  });

  // Add scroll position state for parallax effects
  const [scrollY, setScrollY] = useState(0);

  // Handle scroll for parallax and animation triggers
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    // Animation for statistics counters
    const animateStats = () => {
      const interval = setInterval(() => {
        setCounts(prev => ({
          workouts: prev.workouts >= 500 ? 500 : prev.workouts + 25,
          users: prev.users >= 250000 ? 250000 : prev.users + 12500,
          countries: prev.countries >= 90 ? 90 : prev.countries + 5
        }));
      }, 50);

      return () => clearInterval(interval);
    };

    // Add scroll event listener
    window.addEventListener('scroll', handleScroll);

    // Start counter animation
    const counterTimer = animateStats();

    // Initialize intersection observer for sections
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.section-fade-in').forEach(section => {
      observer.observe(section);
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (typeof counterTimer === 'function') counterTimer();
      observer.disconnect();
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden">
      {/* Hero Section with 3D Effects and Parallax */}
      <section className="relative py-20 md:py-32 px-4 sm:px-6 lg:px-8 overflow-hidden perspective-1000">
        {/* 3D Background with depth layers and parallax effect */}
        {/* 3D Background with depth layers and parallax effect */}
        <div
          className="absolute inset-0 bg-background z-0 transform-style-3d"
          style={{ transform: `translateY(${scrollY * 0.1}px)` }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 dark:from-primary/10 dark:to-secondary/10 opacity-100"></div>
        </div>

        {/* 3D Animated background elements with parallax */}
        <div className="absolute inset-0 overflow-hidden transform-style-3d">
          <div
            className="absolute top-[10%] left-[5%] w-32 h-32 bg-white/10 rounded-full blur-xl animate-float"
            style={{ transform: `translateY(${scrollY * -0.2}px)` }}
          ></div>
          <div
            className="absolute top-[40%] right-[10%] w-40 h-40 bg-white/10 rounded-full blur-xl animate-float animation-delay-2"
            style={{ transform: `translateY(${scrollY * -0.15}px)` }}
          ></div>
          <div
            className="absolute bottom-[20%] left-[20%] w-24 h-24 bg-white/10 rounded-full blur-xl animate-float animation-delay-4"
            style={{ transform: `translateY(${scrollY * -0.25}px)` }}
          ></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="text-foreground transform-style-3d">
              <div className="inline-block mb-4 bg-primary/10 backdrop-blur-sm px-3 py-1 rounded-full">
                <span className="text-primary text-sm font-medium flex items-center">
                  <Sparkles className="h-4 w-4 mr-1 animate-pulse" /> Premium Fitness Experience
                </span>
              </div>
              <h1 className="text-5xl md:text-7xl font-extrabold mb-6 animate-fade-in text-foreground">
                FlexForge
                <span className="block text-2xl md:text-3xl mt-2 text-muted-foreground">
                  Transform Your Body, Transform Your Life
                </span>
              </h1>
              <p className="text-lg md:text-xl mb-8 text-muted-foreground animate-fade-in animation-delay-1">
                Personalized workouts, nutrition plans, and AI coaching - all completely free. Start your fitness
                transformation today.
              </p>
              <div className="flex flex-wrap gap-4 animate-fade-in animation-delay-2">
                <Button
                  asChild
                  size="lg"
                  className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg transition-all duration-300 hover:scale-105 hover:rotate-1 rounded-full font-medium"
                >
                  <Link href="/onboarding">
                    Get Started <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="border-primary text-primary hover:bg-primary/10 transition-all duration-300 hover:scale-105 backdrop-blur-sm hover:-rotate-1 rounded-full font-medium"
                >
                  <Link href="/ai-trainer" className="flex items-center">
                    <Play className="mr-2 h-4 w-4" /> Watch Demo
                  </Link>
                </Button>
              </div>

              {/* Trust badges */}
              <div className="mt-8 pt-6 border-t border-border flex flex-wrap gap-4 items-center animate-fade-in animation-delay-3">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  <span className="text-muted-foreground text-sm">Free Forever</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  <span className="text-muted-foreground text-sm">No Credit Card</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  <span className="text-muted-foreground text-sm">Cancel Anytime</span>
                </div>
              </div>
            </div>
            <div className="flex justify-center transform-style-3d">
              <div className="relative w-full max-w-md animate-float animation-delay-3">
                <div className="relative rounded-lg overflow-hidden group">
                  <img
                    src="https://images.unsplash.com/photo-1549060279-7e168fcee0c2?q=80&w=2070&auto=format&fit=crop"
                    alt="Fitness Training"
                    className="rounded-lg shadow-2xl object-cover w-full h-full hover:scale-105 transition-all duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Button className="bg-background/90 hover:bg-background text-foreground rounded-full flex items-center gap-2">
                      <Play className="h-5 w-5" /> Watch Workout
                    </Button>
                  </div>
                </div>

                {/* 3D floating elements */}
                <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-primary/30 rounded-full blur-xl animate-pulse"></div>
                <div className="absolute -top-4 -left-4 w-24 h-24 bg-primary/20 rounded-full blur-xl animate-float animation-delay-2"></div>

                {/* Floating badge */}
                <div className="absolute -bottom-2 -right-2 bg-card shadow-xl rounded-lg p-2 animate-float animation-delay-5">
                  <div className="flex items-center gap-2">
                    <div className="bg-primary/20 rounded-full p-1">
                      <Trophy className="h-4 w-4 text-primary" />
                    </div>
                    <div className="text-xs font-medium">
                      <div className="text-foreground">Beginner Friendly</div>
                      <div className="text-primary">Start Today</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced wave divider with multiple layers */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full animate-wave">
            <path
              className="fill-background/30"
              fillOpacity="0.3"
              d="M0,192L48,176C96,160,192,128,288,128C384,128,480,160,576,176C672,192,768,192,864,176C960,160,1056,128,1152,128C1248,128,1344,160,1392,176L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            ></path>
          </svg>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full absolute bottom-0 animate-wave-slow">
            <path
              className="fill-background"
              fillOpacity="1"
              d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,149.3C960,160,1056,160,1152,138.7C1248,117,1344,75,1392,53.3L1440,32L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            ></path>
          </svg>
        </div>
      </section>

      {/* Stats Counter Section */}
      <section className="py-8 bg-card border-b border-border">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center">
              <div className="text-4xl font-bold text-primary mb-2">{counts.workouts}+</div>
              <div className="text-muted-foreground">Unique Workouts</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-4xl font-bold text-primary mb-2">{new Intl.NumberFormat().format(counts.users)}+</div>
              <div className="text-muted-foreground">Active Users</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-4xl font-bold text-primary mb-2">{counts.countries}+</div>
              <div className="text-muted-foreground">Countries</div>
            </div>
          </div>
        </div>
      </section>

      {/* Premium Features Banner with hover effects */}
      <section className="py-8 bg-muted/30">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-4 md:gap-8 lg:gap-16">
            <div className="feature-icon-hover group">
              <div className="flex items-center gap-3 px-4 py-3 rounded-full bg-card shadow-md transition-all duration-300 group-hover:shadow-lg">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center transition-all duration-300 group-hover:bg-primary/30 group-hover:scale-110">
                  <Dumbbell className="h-5 w-5 text-primary" />
                </div>
                <span className="font-medium whitespace-nowrap text-foreground">500+ Workouts</span>
              </div>
            </div>
            <div className="feature-icon-hover group">
              <div className="flex items-center gap-3 px-4 py-3 rounded-full bg-card shadow-md transition-all duration-300 group-hover:shadow-lg">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center transition-all duration-300 group-hover:bg-primary/30 group-hover:scale-110">
                  <Brain className="h-5 w-5 text-primary" />
                </div>
                <span className="font-medium whitespace-nowrap text-foreground">AI Coaching</span>
              </div>
            </div>
            <div className="feature-icon-hover group">
              <div className="flex items-center gap-3 px-4 py-3 rounded-full bg-card shadow-md transition-all duration-300 group-hover:shadow-lg">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center transition-all duration-300 group-hover:bg-primary/30 group-hover:scale-110">
                  <Utensils className="h-5 w-5 text-primary" />
                </div>
                <span className="font-medium whitespace-nowrap text-foreground">Nutrition Plans</span>
              </div>
            </div>
            <div className="feature-icon-hover group">
              <div className="flex items-center gap-3 px-4 py-3 rounded-full bg-card shadow-md transition-all duration-300 group-hover:shadow-lg">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center transition-all duration-300 group-hover:bg-primary/30 group-hover:scale-110">
                  <Trophy className="h-5 w-5 text-primary" />
                </div>
                <span className="font-medium whitespace-nowrap text-foreground">Progress Tracking</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Workout of the Day with enhanced UI */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-background section-fade-in">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <Badge className="mb-4 px-4 py-1.5 bg-primary/10 text-primary hover:bg-primary/20 transition-colors font-medium text-sm rounded-full">TODAY'S WORKOUT</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Workout of the Day</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A new workout every day to keep your routine fresh and challenging
            </p>
          </div>

          <WorkoutOfTheDay />

          {/* Today's Progress Tracker - New Component */}
          <div className="mt-12 max-w-4xl mx-auto bg-muted/30 rounded-2xl p-6 shadow-lg">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="w-full md:w-auto flex-1">
                <h3 className="text-xl font-semibold mb-3">Today's Progress</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-card rounded-xl p-4 shadow-sm flex flex-col items-center justify-center">
                    <Fire className="h-8 w-8 text-orange-500 mb-2" />
                    <div className="text-lg font-bold">328</div>
                    <div className="text-xs text-muted-foreground">Calories</div>
                  </div>
                  <div className="bg-card rounded-xl p-4 shadow-sm flex flex-col items-center justify-center">
                    <Clock className="h-8 w-8 text-blue-500 mb-2" />
                    <div className="text-lg font-bold">24 min</div>
                    <div className="text-xs text-muted-foreground">Active Time</div>
                  </div>
                  <div className="bg-card rounded-xl p-4 shadow-sm flex flex-col items-center justify-center">
                    <Zap className="h-8 w-8 text-yellow-500 mb-2" />
                    <div className="text-lg font-bold">3 / 5</div>
                    <div className="text-xs text-muted-foreground">Exercises</div>
                  </div>
                </div>
              </div>
              <div className="w-full md:w-auto">
                <Button className="w-full md:w-auto bg-primary hover:bg-primary/90 rounded-full font-medium">
                  Complete Today's Workout <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Workouts Section with enhanced cards */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30 section-fade-in">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <Badge className="mb-4 px-4 py-1.5 bg-primary/10 text-primary hover:bg-primary/20 transition-colors font-medium text-sm rounded-full">TRENDING</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Workouts</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover our most popular workout programs designed for all fitness levels
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "HIIT Fat Burn",
                image: "/workouts/hiit-fat-burn.jpg",
                level: "Intermediate",
                duration: "30 min",
                category: "Weight Loss",
                rating: 4.9,
                reviews: 245,
                href: "/workouts/weight-loss/hiit-fat-burn",
              },
              {
                title: "Full Body Strength",
                image: "/workouts/full-body-strength.jpg",
                level: "Advanced",
                duration: "60 min",
                category: "Muscle Gain",
                rating: 4.8,
                reviews: 189,
                href: "/workouts/muscle-gain/full-body-strength",
              },
              {
                title: "Morning Yoga Flow",
                image: "/workouts/morning-yoga.jpg",
                level: "Beginner",
                duration: "20 min",
                category: "Yoga",
                rating: 4.9,
                reviews: 312,
                href: "/workouts/yoga/morning-yoga",
              },
            ].map((workout, index) => (
              <Card
                key={index}
                className="overflow-hidden group hover:shadow-xl transition-all duration-300 workout-card hover:scale-105 border-0 rounded-2xl"
              >
                <Link href={workout.href} className="block h-full">
                  <div className="aspect-video relative overflow-hidden">
                    <img
                      src={workout.image || "/placeholder.svg"}
                      alt={workout.title}
                      className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>

                    {/* Play button overlay */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="rounded-full bg-white/20 backdrop-blur-sm p-3">
                        <Play className="h-8 w-8 text-white" />
                      </div>
                    </div>

                    <div className="absolute top-4 left-4">
                      <Badge className="bg-primary/80 text-white">{workout.category}</Badge>
                    </div>

                    <div className="absolute top-4 right-4">
                      <Badge className="bg-white/90 text-primary">{workout.level}</Badge>
                    </div>

                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <h3 className="text-xl font-bold mb-1">{workout.title}</h3>
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" /> {workout.duration}
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                          <span>{workout.rating}</span>
                          <span className="text-white/70">({workout.reviews})</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button
              asChild
              variant="outline"
              className="group hover:scale-105 transition-all duration-300 rounded-full px-6 py-2 shadow-md hover:shadow-lg"
            >
              <Link href="/workouts" className="flex items-center">
                View All Workouts
                <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Add CSS for animations */}
      <style jsx global>{`
        .animation-delay-1 {
          animation-delay: 0.2s;
        }
        .animation-delay-2 {
          animation-delay: 0.4s;
        }
        .animation-delay-3 {
          animation-delay: 0.6s;
        }
        .animation-delay-4 {
          animation-delay: 0.8s;
        }
        .animation-delay-5 {
          animation-delay: 1s;
        }
        
        @keyframes wave {
          0% {
            transform: translateY(10px);
          }
          50% {
            transform: translateY(0);
          }
          100% {
            transform: translateY(10px);
          }
        }
        
        @keyframes wave-slow {
          0% {
            transform: translateY(5px);
          }
          50% {
            transform: translateY(-5px);
          }
          100% {
            transform: translateY(5px);
          }
        }
        
        .animate-wave {
          animation: wave 8s ease-in-out infinite;
        }
        
        .animate-wave-slow {
          animation: wave-slow 12s ease-in-out infinite;
        }
        
        .feature-icon-hover {
          transition: all 0.3s ease;
        }
        
        .glowing-text {
          text-shadow: 0 0 10px rgba(255, 69, 0, 0.5);
        }
        
        .shadow-neon {
          box-shadow: 0 0 15px rgba(255, 69, 0, 0.5);
        }
        
        .section-fade-in {
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 1s ease, transform 1s ease;
        }
        
        .section-fade-in.visible {
          opacity: 1;
          transform: translateY(0);
        }
        
        .perspective-1000 {
          perspective: 1000px;
        }
        
        .transform-style-3d {
          transform-style: preserve-3d;
        }
        
        @keyframes float {
          0% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-15px);
          }
          100% {
            transform: translateY(0px);
          }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        @keyframes pulse {
          0% {
            opacity: 0.6;
          }
          50% {
            opacity: 1;
          }
          100% {
            opacity: 0.6;
          }
        }
        
        .animate-pulse {
          animation: pulse 2s ease-in-out infinite;
        }
      `}</style>

      {/* Fitness Challenges with enhanced visual appeal */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-background section-fade-in">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <Badge className="mb-4 px-4 py-1.5 bg-primary/10 text-primary hover:bg-primary/20 transition-colors font-medium text-sm rounded-full">COMMUNITY</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Fitness Challenges</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Join our community challenges and push your limits
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "30-Day Push-Up Challenge",
                image: "https://images.unsplash.com/photo-1598971639058-fab3c3109a00?q=80&w=2076&auto=format&fit=crop",
                participants: "2,547",
                duration: "30 days",
                difficulty: "All Levels",
                progress: 72,
                href: "/challenges/pushup-challenge",
              },
              {
                title: "Summer Shred Challenge",
                image: "https://images.unsplash.com/photo-1517344884509-a0c97ec11bcc?q=80&w=2070&auto=format&fit=crop",
                participants: "1,823",
                duration: "8 weeks",
                difficulty: "Intermediate",
                progress: 45,
                featured: true,
                href: "/challenges/summer-shred",
              },
              {
                title: "Flexibility Journey",
                image: "https://images.unsplash.com/photo-1552196563-55cd4e45efb3?q=80&w=2026&auto=format&fit=crop",
                participants: "986",
                duration: "21 days",
                difficulty: "Beginner",
                progress: 25,
                href: "/challenges/flexibility-journey",
              },
            ].map((challenge, index) => (
              <Card
                key={index}
                className={`overflow-hidden group hover:shadow-xl transition-all duration-300 workout-card border-0 rounded-2xl ${challenge.featured ? 'ring-2 ring-primary/50 ring-offset-4' : ''}`}
              >
                <Link href={challenge.href}>
                  <div className="aspect-video relative overflow-hidden">
                    <img
                      src={challenge.image || "/placeholder.svg"}
                      alt={challenge.title}
                      className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>

                    {challenge.featured && (
                      <div className="absolute top-0 left-0 right-0 bg-primary text-white text-center text-xs font-bold py-1">
                        FEATURED CHALLENGE
                      </div>
                    )}

                    <div className="absolute top-4 right-4">
                      <Badge className={`${challenge.featured ? 'bg-white text-primary' : 'bg-primary text-white'}`}>
                        {challenge.difficulty}
                      </Badge>
                    </div>

                    <div className="absolute bottom-16 left-4 right-4 text-white">
                      <h3 className="text-xl font-bold mb-1">{challenge.title}</h3><div className="flex items-center gap-2 text-sm mb-2">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" /> {challenge.duration}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <User className="h-3 w-3" /> {challenge.participants} joined
                        </span>
                      </div>
                    </div>

                    {/* Progress bar */}
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <div className="flex justify-between text-xs mb-1">
                        <span>Progress</span>
                        <span>{challenge.progress}%</span>
                      </div>
                      <div className="w-full bg-white/30 rounded-full h-1.5">
                        <div
                          className="bg-primary h-1.5 rounded-full"
                          style={{ width: `${challenge.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </Link>
              </Card>
            ))}
          </div>

          <div className="text-center mt-10">
            <Button
              asChild
              className="bg-primary hover:bg-primary/90 rounded-full font-medium px-8 py-2 hover:scale-105 transition-all duration-300 shadow-md hover:shadow-lg"
            >
              <Link href="/challenges" className="flex items-center">
                Join a Challenge <Medal className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Fitness Calculator with enhanced UI */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30 section-fade-in">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <Badge className="mb-4 px-4 py-1.5 bg-primary/10 text-primary hover:bg-primary/20 transition-colors font-medium text-sm rounded-full">TOOLS</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Fitness Calculator</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Calculate your BMI, daily calorie needs, and more with our interactive tools
            </p>
          </div>

          <FitnessCalculator />

          {/* Additional calculators cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            {[
              {
                title: "Macro Calculator",
                description: "Calculate your ideal protein, carb, and fat intake based on your goals",
                icon: <Utensils className="h-6 w-6 text-orange-500" />,
                href: "/calculators/macro-calculator"
              },
              {
                title: "Workout Planner",
                description: "Build a custom workout plan based on your schedule and equipment",
                icon: <Calendar className="h-6 w-6 text-green-500" />,
                href: "/calculators/workout-planner"
              },
              {
                title: "Body Fat Calculator",
                description: "Estimate your body fat percentage using different measurement methods",
                icon: <BarChart3 className="h-6 w-6 text-blue-500" />,
                href: "/calculators/body-fat-calculator"
              }
            ].map((tool, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-lg transition-all duration-300 group border border-gray-200">
                <Link href={tool.href}>
                  <CardContent className="p-6">
                    <div className="mb-4 w-12 h-12 rounded-full bg-card flex items-center justify-center shadow-md group-hover:shadow-lg group-hover:scale-110 transition-all duration-300">
                      {tool.icon}
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{tool.title}</h3>
                    <p className="text-muted-foreground">{tool.description}</p>
                    <div className="mt-4 flex">
                      <span className="text-primary font-medium flex items-center">
                        Try Now <ArrowUpRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:translate-y-[-4px]" />
                      </span>
                    </div>
                  </CardContent>
                </Link>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section with enhanced cards and animations */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-background section-fade-in">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <Badge className="mb-4 px-4 py-1.5 bg-primary/10 text-primary hover:bg-primary/20 transition-colors font-medium text-sm rounded-full">FEATURES</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything You Need For Your Fitness Journey</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Comprehensive tools and resources to help you reach your fitness goals
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard
              icon={<Dumbbell className="h-10 w-10 text-primary" />}
              title="Workout Library"
              description="Access hundreds of exercises with detailed instructions and animations."
              href="/workouts"
            />
            <FeatureCard
              icon={<Utensils className="h-10 w-10 text-primary" />}
              title="Nutrition Plans"
              description="Customized meal plans for different dietary preferences and fitness goals."
              href="/nutrition"
            />
            <FeatureCard
              icon={<Brain className="h-10 w-10 text-primary" />}
              title="AI Trainer"
              description="Get personalized advice and answers to all your fitness questions."
              href="/ai-trainer"
            />
            <FeatureCard
              icon={<BarChart3 className="h-10 w-10 text-primary" />}
              title="Progress Tracking"
              description="Track your workouts, measurements, and achievements over time."
              href="/my-plan"
            />
          </div>

          {/* App promo section */}
          <div className="mt-16 bg-gradient-to-br from-orange-100 to-red-100 dark:from-slate-900 dark:to-slate-800 rounded-3xl overflow-hidden border border-transparent dark:border-border">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="p-8 md:p-12 flex flex-col justify-center">
                <Badge className="mb-4 inline-flex w-auto px-3 py-1 bg-primary/10 text-primary hover:bg-primary/20 self-start">MOBILE APP</Badge>
                <h3 className="text-2xl md:text-3xl font-bold mb-4 text-foreground">Take FlexForge Everywhere</h3>
                <p className="text-lg text-muted-foreground mb-6">Download our mobile app to track workouts, log nutrition, and get coaching on the go. Available for iOS and Android.</p>
                <div className="flex flex-wrap gap-4">
                  <Button className="bg-black hover:bg-black/90 text-white rounded-xl flex items-center gap-2">
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83z" />
                      <path d="M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                    </svg>
                    App Store
                  </Button>
                  <Button className="bg-black hover:bg-black/90 text-white rounded-xl flex items-center gap-2">
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M3 20.69a2.9 2.9 0 001.28 1.58c.42.23.89.37 1.37.36.82 0 1.41-.25 1.79-.75l.12-.15 6.43-11.14-4.1-4.1L3 19.44a2.9 2.9 0 00-.06 1.21l.06.04zM15.36 3.73l-2.95 5.12 3.4 3.41 5.14-2.95c.36-.21.66-.51.87-.87.21-.36.32-.77.32-1.18 0-.4-.1-.8-.3-1.15l-.3-.42a2.91 2.91 0 00-6.18-1.96zM10.54 14.03l-7.2 7.2A2.82 2.82 0 005.7 24a2.82 2.82 0 002.24-1.1c.35-.43 5.2-9.18 7.03-12.45l-4.43 3.58z" />
                      <path d="M10.93 10.23l3.61-6.25.01-.02c.17-.3.4-.57.66-.79a3.62 3.62 0 015.01.94l.29.41c.47.63.7 1.4.66 2.18-.03.77-.33 1.51-.85 2.07l-5.14 2.95-4.25-1.49z" />
                    </svg>
                    Google Play
                  </Button>
                </div>
              </div>
              <div className="relative flex items-center justify-center p-8">
                <div className="absolute w-64 h-64 bg-orange-300/20 rounded-full blur-3xl"></div>
                <img
                  src="https://sdmntprwestus.oaiusercontent.com/files/00000000-efdc-6230-bb67-6a1e457dc18c/raw?se=2025-04-27T17%3A39%3A18Z&sp=r&sv=2024-08-04&sr=b&scid=73309986-c661-5db1-a80d-34cb491ae8ee&skoid=51916beb-8d6a-49b8-8b29-ca48ed86557e&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2025-04-27T08%3A44%3A51Z&ske=2025-04-28T08%3A44%3A51Z&sks=b&skv=2024-08-04&sig=OgCYYN9T16LbcLovA1VPyaOGvglsnCuz2A%2BlW3mHNkw%3D"
                  alt="FlexForge Mobile App"
                  className="relative z-10 max-h-80 w-auto object-contain rounded-3xl shadow-2xl transition-all duration-500 hover:scale-105 hover:shadow-[0_8px_30px_rgb(255,115,0,0.7)]"
                />

              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Fitness Tip Section with enhanced design */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white section-fade-in">
        <div className="max-w-3xl mx-auto">
          <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-8 shadow-lg relative overflow-hidden">
            <div className="absolute -top-12 -right-12 w-24 h-24 bg-primary/10 rounded-full blur-xl"></div>
            <div className="absolute -bottom-8 -left-8 w-16 h-16 bg-primary/10 rounded-full blur-xl"></div>

            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <Sparkles className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Today's Fitness Tip</h3>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm">
                <p className="text-gray-700 leading-relaxed">
                  Consistency is more important than intensity. It's better to work out for 20 minutes every day than to do a
                  2-hour session once a week. Start small, build the habit, and gradually increase your workout duration and
                  intensity.
                </p>
              </div>

              <div className="mt-6 flex">
                <Button variant="ghost" className="text-primary hover:text-primary/80 hover:bg-primary/10 gap-1 rounded-full px-4">
                  <ArrowRight className="h-4 w-4" /> Get Daily Tips
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section - New */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-orange-50 to-red-50 section-fade-in">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl md:text-3xl font-bold mb-4">Get Weekly Fitness Tips</h3>
                <p className="text-gray-600 mb-6">
                  Join our newsletter to receive workout tips, nutrition advice, and exclusive offers directly to your inbox.
                </p>

                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-grow">
                    <input
                      type="email"
                      placeholder="Enter your email"
                      className="w-full px-4 py-3 rounded-full border border-gray-300 focus:ring-2 focus:ring-primary/30 focus:border-primary focus:outline-none"
                    />
                  </div>
                  <Button className="bg-primary hover:bg-primary/90 text-white rounded-full px-6 whitespace-nowrap">
                    Subscribe
                  </Button>
                </div>

                <p className="text-xs text-gray-500 mt-3">
                  By subscribing, you agree to our Privacy Policy. No spam, unsubscribe anytime.
                </p>
              </div>

              <div className="flex justify-center">
                <div className="grid grid-cols-2 gap-4 max-w-md">
                  <div className="bg-orange-50 p-4 rounded-xl flex flex-col items-center text-center">
                    <Dumbbell className="h-8 w-8 text-primary mb-2" />
                    <div className="font-medium">Workout Plans</div>
                  </div>
                  <div className="bg-red-50 p-4 rounded-xl flex flex-col items-center text-center">
                    <Utensils className="h-8 w-8 text-primary mb-2" />
                    <div className="font-medium">Recipe Ideas</div>
                  </div>
                  <div className="bg-yellow-50 p-4 rounded-xl flex flex-col items-center text-center">
                    <Brain className="h-8 w-8 text-primary mb-2" />
                    <div className="font-medium">Fitness Advice</div>
                  </div>
                  <div className="bg-green-50 p-4 rounded-xl flex flex-col items-center text-center">
                    <Medal className="h-8 w-8 text-primary mb-2" />
                    <div className="font-medium">Success Stories</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden perspective-1000">
        <div
          className="absolute inset-0 bg-gradient-to-br from-orange-600 to-red-600 z-0 transform-style-3d"
          style={{ transform: `translateY(${scrollY * 0.05}px)` }}
        ></div>

        {/* Animated background shapes */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/6 w-32 h-32 bg-white/10 rounded-full blur-xl animate-float"></div>
          <div className="absolute top-2/3 right-1/4 w-48 h-48 bg-white/10 rounded-full blur-xl animate-float animation-delay-2"></div>
          <div className="absolute bottom-1/3 left-1/3 w-24 h-24 bg-white/10 rounded-full blur-xl animate-float animation-delay-4"></div>
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="mb-4 px-4 py-1.5 bg-gray-800 dark:bg-white/20 text-white dark:text-white font-medium text-sm rounded-full backdrop-blur-sm transition-colors hover:bg-gray-700 dark:hover:bg-orange/30">
            START TODAY
          </div>

          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-orange-500 dark:text-white">
            Ready to Transform Your Fitness Journey?
          </h2>

          <p className="text-xl mb-8 text-gray-700 dark:text-white/90 max-w-2xl mx-auto">
            Join thousands of users who have already improved their health and fitness with FlexForge.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Button
              asChild
              size="lg"
              className="bg-white text-primary hover:bg-white/90 shadow-neon transition-all duration-300 hover:scale-105 font-medium rounded-full px-8"
            >
              <Link href="/onboarding">
                Start Your Free Plan <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-white text-white hover:bg-white/10 transition-all duration-300 hover:scale-105 backdrop-blur-sm rounded-full px-8 font-medium"
            >
              <a href="/testimonials" className="text-blue-800 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors font-medium">
                See Success Stories
              </a>
            </Button>
          </div>

          {/* Trust badges */}
          <div className="mt-12 flex flex-wrap justify-center gap-8">
            <div className="bg-black backdrop-blur-sm rounded-xl px-5 py-3 flex items-center gap-3">
              <User className="h-5 w-5 text-white" />
              <span className="text-white font-medium">250,000+ Users</span>
            </div>
            <div className="bg-black backdrop-blur-sm rounded-xl px-5 py-3 flex items-center gap-3">
              <Star className="h-5 w-5 text-white" />
              <span className="text-white font-medium">4.9 Star Rating</span>
            </div>
            <div className="bg-black backdrop-blur-sm rounded-xl px-5 py-3 flex items-center gap-3">
              <Calendar className="h-5 w-5 text-white" />
              <span className="text-white font-medium">Free 30-Day Trial</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

function FeatureCard({
  icon,
  title,
  description,
  href,
}: {
  icon: React.ReactNode
  title: string
  description: string
  href: string
}) {
  return (
    <Link href={href}>
      <div className="bg-card border border-border rounded-2xl p-6 h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-2 hover:scale-105 group">
        <div className="mb-4 w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-all duration-300 group-hover:scale-110">
          {icon}
        </div>
        <h3 className="text-xl font-semibold mb-2 text-card-foreground">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
        <div className="mt-4 flex items-center text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          Learn More <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  )
}