"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Home, Search, PlusSquare, Heart, MessageCircle, User, LogOut, Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { useStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { RealTimeNotifications } from "@/components/real-time-notifications"
import { toast } from "@/components/ui/use-toast"

export function MainNav() {
  const pathname = usePathname()
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const { currentUser, setCurrentUser, setSearchQuery: setGlobalSearchQuery } = useStore()

  // Check if user is logged in
  useEffect(() => {
    if (!currentUser) {
      const storedUser = localStorage.getItem("FlexForge-current-user")
      if (storedUser) {
        setCurrentUser(JSON.parse(storedUser))
      } else if (pathname !== "/") {
        router.push("/")
      }
    }
  }, [currentUser, pathname, router, setCurrentUser])

  const routes = [
    {
      href: "/feed",
      label: "Home",
      icon: Home,
      active: pathname === "/feed",
    },
    {
      href: "/search",
      label: "Search",
      icon: Search,
      active: pathname === "/search" || pathname === "/explore",
    },
    {
      href: "/create",
      label: "Create",
      icon: PlusSquare,
      active: pathname === "/create",
    },
    {
      href: "/activity",
      label: "Activity",
      icon: Heart,
      active: pathname === "/activity",
      notification: 3,
    },
    {
      href: "/messages",
      label: "Messages",
      icon: MessageCircle,
      active: pathname === "/messages",
      notification: 5,
    },
    {
      href: "/profile",
      label: "Profile",
      icon: User,
      active: pathname === "/profile",
    },
  ]

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      setGlobalSearchQuery(searchQuery)
      router.push("/search")
    }
  }

  const handleLogout = () => {
    // Remove user from localStorage
    localStorage.removeItem("FlexForge-current-user")
    setCurrentUser(null)

    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    })

    router.push("/")
  }

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  if (!currentUser && pathname !== "/") {
    return null
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-sm">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo - visible on all screens */}
        <div className="flex items-center">
          <Link href="/feed" className="flex items-center space-x-2">
            <div className="relative h-8 w-8">
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500"></div>
              <div className="absolute inset-0.5 rounded-full bg-background flex items-center justify-center">
                <span className="text-lg font-bold gradient-text">N</span>
              </div>
            </div>
            <span className="hidden md:inline-block text-xl font-bold">FlexForge</span>
          </Link>
        </div>

        {/* Search - visible on medium screens and up */}
        <div className="hidden md:flex md:w-1/3 lg:w-1/4">
          <form className="relative w-full" onSubmit={handleSearch}>
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search"
              className="w-full pl-9 rounded-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>
        </div>

        {/* Desktop Navigation - visible on medium screens and up */}
        <nav className="hidden md:flex items-center space-x-1">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "flex items-center justify-center h-10 w-10 rounded-full hover:bg-accent hover:text-accent-foreground relative",
                route.active && "bg-accent text-accent-foreground",
              )}
            >
              <route.icon className="h-5 w-5" />
              {route.notification && (
                <span className="absolute top-0 right-0 h-4 w-4 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                  {route.notification}
                </span>
              )}
              <span className="sr-only">{route.label}</span>
            </Link>
          ))}

          {/* Real-time notifications */}
          <RealTimeNotifications />

          {/* Theme toggle */}
          <Button variant="ghost" size="icon" className="rounded-full" onClick={toggleTheme}>
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>

          {/* User menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-10 w-10 rounded-full p-0">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={currentUser?.avatar} alt={currentUser?.name || "User"} />
                  <AvatarFallback>{currentUser?.name?.charAt(0) || "U"}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => router.push("/profile")}>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>

        {/* Mobile Navigation - visible on small screens */}
        <div className="md:hidden flex items-center space-x-2">
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-menu"
            >
              <line x1="4" x2="20" y1="12" y2="12" />
              <line x1="4" x2="20" y1="6" y2="6" />
              <line x1="4" x2="20" y1="18" y2="18" />
            </svg>
            <span className="sr-only">Toggle menu</span>
          </Button>

          <RealTimeNotifications />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 rounded-full p-0">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={currentUser?.avatar} alt={currentUser?.name || "User"} />
                  <AvatarFallback>{currentUser?.name?.charAt(0) || "U"}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => router.push("/profile")}>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={toggleTheme}>
                {theme === "dark" ? <Sun className="mr-2 h-4 w-4" /> : <Moon className="mr-2 h-4 w-4" />}
                <span>{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden">
          <div className="container py-2">
            <form className="relative mb-4" onSubmit={handleSearch}>
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search"
                className="w-full pl-9 rounded-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>
            <div className="grid grid-cols-4 gap-2">
              {routes.map((route) => (
                <Link
                  key={route.href}
                  href={route.href}
                  className={cn(
                    "flex flex-col items-center justify-center p-2 rounded-lg hover:bg-accent hover:text-accent-foreground relative",
                    route.active && "bg-accent text-accent-foreground",
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <div className="relative">
                    <route.icon className="h-5 w-5 mb-1" />
                    {route.notification && (
                      <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                        {route.notification}
                      </span>
                    )}
                  </div>
                  <span className="text-xs">{route.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

