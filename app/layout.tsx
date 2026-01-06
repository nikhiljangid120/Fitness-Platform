import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import Navbar from "@/components/navbar"
import Script from "next/script"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "FlexForge - Your AI-Powered Fitness Companion",
  description: "Personalized workouts, nutrition plans, and AI coaching for your fitness journey",
}

import { ClerkProvider } from "@clerk/nextjs"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <Navbar />
          {children}
          <Script id="section-animations" strategy="afterInteractive">
            {`
              function handleIntersection(entries, observer) {
                entries.forEach(entry => {
                  if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                  }
                });
              }
              
              document.addEventListener('DOMContentLoaded', function() {
                const observer = new IntersectionObserver(handleIntersection, {
                  root: null,
                  rootMargin: '0px',
                  threshold: 0.1
                });
                
                document.querySelectorAll('.section-fade-in').forEach(section => {
                  observer.observe(section);
                });
              });
              
              // Also run on load in case DOMContentLoaded already fired
              window.addEventListener('load', function() {
                const observer = new IntersectionObserver(handleIntersection, {
                  root: null,
                  rootMargin: '0px',
                  threshold: 0.1
                });
                
                document.querySelectorAll('.section-fade-in').forEach(section => {
                  observer.observe(section);
                });
              });
            `}
          </Script>
        </ThemeProvider>
      </body>
    </html>
  )
}
