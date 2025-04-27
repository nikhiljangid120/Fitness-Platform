"use client";

import React from "react";
import Link from "next/link";
import { Dumbbell, Instagram, Twitter, Facebook } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function Footer() {
  return (
    <footer className="bg-background border-t border-muted py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center mb-4">
              <Dumbbell className="h-8 w-8 text-primary mr-2" />
              <span className="text-xl font-bold text-foreground">FlexForge</span>
            </div>
            <p className="text-muted-foreground">
              Empowering your fitness journey with AI-powered workouts and nutrition plans.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h3 className="text-lg font-semibold text-foreground mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {[
                { name: "Home", href: "/" },
                { name: "Workouts", href: "/workouts" },
                { name: "Nutrition", href: "/nutrition" },
                { name: "AI Coach", href: "/ai-trainer" },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <h3 className="text-lg font-semibold text-foreground mb-4">Community</h3>
            <ul className="space-y-2">
              {[
                { name: "Challenges", href: "/challenges" },
                { name: "Blog", href: "/blog" },
                { name: "Events", href: "/events" },
                { name: "Support", href: "/support" },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <h3 className="text-lg font-semibold text-foreground mb-4">Connect With Us</h3>
            <div className="flex space-x-4">
              <motion.a
                href="https://instagram.com"
                whileHover={{ scale: 1.2, rotate: 10 }}
                className="text-muted-foreground hover:text-primary"
              >
                <Instagram className="h-6 w-6" />
              </motion.a>
              <motion.a
                href="https://twitter.com"
                whileHover={{ scale: 1.2, rotate: 10 }}
                className="text-muted-foreground hover:text-primary"
              >
                <Twitter className="h-6 w-6" />
              </motion.a>
              <motion.a
                href="https://facebook.com"
                whileHover={{ scale: 1.2, rotate: 10 }}
                className="text-muted-foreground hover:text-primary"
              >
                <Facebook className="h-6 w-6" />
              </motion.a>
            </div>
            {/* Uncomment if you have a newsletter subscription form
            <div className="mt-6">
              <h4 className="text-sm font-medium text-foreground mb-2">Subscribe to our newsletter</h4>
              <form className="flex">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-2 border border-muted rounded-l-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <Button type="submit" className="rounded-r-md">Subscribe</Button>
              </form>
            </div>
            */}
          </motion.div>
        </div>

        <motion.div
          className="mt-12 pt-8 border-t border-muted text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <p className="text-muted-foreground">
            &copy; {new Date().getFullYear()} FlexForge. All rights reserved.
          </p>
        </motion.div>
      </div>
    </footer>
  );
}