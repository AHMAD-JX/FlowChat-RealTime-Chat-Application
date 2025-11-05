"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  MessageSquare,
  Shield,
  Zap,
  Users,
  Video,
  Lock,
  Globe,
  Sparkles,
  Send,
  Radio,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnimatedBackground } from "@/components/animated-background";
import { FeatureCard } from "@/components/feature-card";
import { FloatingNavbar } from "@/components/floating-navbar";
import { LoadingScreen } from "@/components/loading-screen";

export default function Home() {
  return (
    <>
      <LoadingScreen />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 0.6,
          delay: 2.6,
          ease: [0.16, 1, 0.3, 1],
        }}
        className="relative min-h-screen overflow-hidden"
      >
        <AnimatedBackground />
        <FloatingNavbar />

      {/* Hero Section */}
      <section className="relative px-4 pt-32 pb-20">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col items-center text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-6"
            >
              <motion.div
                className="inline-flex items-center gap-2 rounded-full border border-green-200 bg-white/80 px-4 py-2 text-sm font-medium text-green-700 shadow-lg backdrop-blur-sm dark:border-green-800 dark:bg-gray-900/80 dark:text-green-400"
                whileHover={{ scale: 1.05 }}
              >
                <Sparkles className="h-4 w-4" />
                <span>The Best Instant Messaging App</span>
              </motion.div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mb-6 max-w-4xl text-6xl font-bold leading-tight text-gray-900 dark:text-white md:text-7xl"
            >
              Connect with the{" "}
              <span className="bg-linear-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent">
                World
              </span>
              <br />
              Fast & Secure
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mb-10 max-w-2xl text-xl text-gray-600 dark:text-gray-400"
            >
              A modern messaging app that combines simplicity and security. Send messages,
              share files, and video chat with your friends and family.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-wrap items-center justify-center gap-4"
            >
              <Link href="/signup">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    size="lg"
                    className="h-14 rounded-2xl bg-linear-to-r from-green-500 to-emerald-600 px-8 text-lg font-semibold shadow-2xl shadow-green-500/30 hover:from-green-600 hover:to-emerald-700"
                  >
                    Get Started Free
                  </Button>
                </motion.div>
              </Link>
              <Link href="/login">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    size="lg"
                    variant="outline"
                    className="h-14 rounded-2xl border-2 border-green-300 bg-white/80 px-8 text-lg font-semibold text-gray-700 backdrop-blur-sm hover:border-green-500 hover:bg-green-50 hover:text-green-600 dark:border-green-700 dark:bg-gray-900/80 dark:text-gray-300 dark:hover:border-green-500 dark:hover:bg-green-900/20 dark:hover:text-green-400"
                  >
                    Sign In
                  </Button>
                </motion.div>
              </Link>
            </motion.div>

            {/* Floating animated elements */}
            <div className="relative mt-20 h-[800px] sm:h-[700px] md:h-[800px] lg:h-[900px] xl:h-[1000px] w-full max-w-[95vw] overflow-visible">
              {/* Chat Bubble 1 - Top Left */}
              <motion.div
                className="absolute top-10 left-5 rounded-2xl bg-white/90 p-5 shadow-2xl backdrop-blur-sm dark:bg-gray-800/90 sm:left-10 sm:p-6"
                animate={{
                  y: [0, -25, 0],
                  rotate: [-3, 3, -3],
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-linear-to-br from-green-400 to-emerald-500 sm:h-12 sm:w-12" />
                  <div>
                    <div className="h-3 w-20 rounded bg-gray-300 dark:bg-gray-600 sm:w-24" />
                    <div className="mt-2 h-2 w-28 rounded bg-gray-200 dark:bg-gray-700 sm:w-32" />
                  </div>
                </div>
              </motion.div>

              {/* Chat Bubble 2 - Top Right (Green) */}
              <motion.div
                className="absolute top-20 right-5 rounded-2xl bg-linear-to-br from-green-500 to-emerald-600 p-5 shadow-2xl sm:right-10 sm:p-6"
                animate={{
                  y: [0, 25, 0],
                  rotate: [3, -3, 3],
                  scale: [1, 0.95, 1],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.5,
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="h-3 w-32 rounded bg-white/30 sm:w-40" />
                </div>
                <div className="mt-2 h-2 w-24 rounded bg-white/20 sm:w-32" />
              </motion.div>

              {/* Video Call Bubble - Center Bottom */}
              <motion.div
                className="absolute bottom-20 left-1/2 -translate-x-1/2 rounded-2xl bg-white/90 p-5 shadow-2xl backdrop-blur-sm dark:bg-gray-800/90 sm:p-6"
                animate={{
                  y: [0, -20, 0],
                  scale: [1, 1.08, 1],
                }}
                transition={{
                  duration: 7,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1,
                }}
              >
                <div className="flex items-center gap-3">
                  <Video className="h-6 w-6 text-green-500 sm:h-8 sm:w-8" />
                  <div>
                    <div className="h-3 w-24 rounded bg-gray-300 dark:bg-gray-600 sm:w-32" />
                    <div className="mt-2 h-2 w-16 rounded bg-gray-200 dark:bg-gray-700 sm:w-24" />
                  </div>
                </div>
              </motion.div>

              {/* Global Connection Theme - Hero Image Box & Communication Lines */}
              
              {/* Main Hero Image Box - Center */}
              <motion.div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                animate={{
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  scale: {
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut",
                  },
                }}
              >
                <motion.div
                  className="relative w-[90vw] h-[67.5vw] sm:w-[600px] sm:h-[450px] md:w-[700px] md:h-[525px] lg:w-[900px] lg:h-[675px] xl:w-[1000px] xl:h-[750px] rounded-3xl shadow-2xl overflow-hidden border-4 border-green-500/30 backdrop-blur-sm bg-white/10 max-w-[95vw]"
                  whileHover={{ scale: 1.02 }}
                >
                  <img
                    src="/images/hero.png"
                    alt="FlowChat Hero"
                    className="w-full h-full object-cover object-left"
                    style={{ objectPosition: 'left center' }}
                  />
                  {/* Gradient overlay for better visibility */}
                  <div className="absolute inset-0 bg-gradient-to-t from-green-500/20 to-transparent pointer-events-none" />
                </motion.div>
              </motion.div>

              {/* Connection Lines - Animated paths connecting points */}
              <svg
                className="absolute inset-0 h-full w-full pointer-events-none"
                style={{ overflow: "visible" }}
              >
                <defs>
                  <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#22c55e" stopOpacity="0.5" />
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0.8" />
                  </linearGradient>
                  <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.5" />
                    <stop offset="100%" stopColor="#059669" stopOpacity="0.8" />
                  </linearGradient>
                  <linearGradient id="gradient3" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#34d399" stopOpacity="0.5" />
                    <stop offset="100%" stopColor="#22c55e" stopOpacity="0.8" />
                  </linearGradient>
                  <linearGradient id="gradient4" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#059669" stopOpacity="0.5" />
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0.8" />
                  </linearGradient>
                </defs>
                
                {/* Line 1: Top to Earth */}
                <motion.line
                  x1="25%"
                  y1="25%"
                  x2="50%"
                  y2="50%"
                  stroke="url(#gradient1)"
                  strokeWidth="2"
                  strokeDasharray="5,5"
                  initial={{ pathLength: 0, opacity: 0.3 }}
                  animate={{ pathLength: 1, opacity: [0.3, 0.7, 0.3] }}
                  transition={{
                    pathLength: { duration: 2, repeat: Infinity, ease: "linear" },
                    opacity: { duration: 2, repeat: Infinity, ease: "easeInOut" },
                  }}
                />
                
                {/* Line 2: Right to Earth */}
                <motion.line
                  x1="75%"
                  y1="30%"
                  x2="50%"
                  y2="50%"
                  stroke="url(#gradient2)"
                  strokeWidth="2"
                  strokeDasharray="5,5"
                  initial={{ pathLength: 0, opacity: 0.3 }}
                  animate={{ pathLength: 1, opacity: [0.3, 0.7, 0.3] }}
                  transition={{
                    pathLength: { duration: 2.5, repeat: Infinity, ease: "linear" },
                    opacity: { duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 },
                  }}
                />
                
                {/* Line 3: Bottom Left to Earth */}
                <motion.line
                  x1="20%"
                  y1="70%"
                  x2="50%"
                  y2="50%"
                  stroke="url(#gradient3)"
                  strokeWidth="2"
                  strokeDasharray="5,5"
                  initial={{ pathLength: 0, opacity: 0.3 }}
                  animate={{ pathLength: 1, opacity: [0.3, 0.7, 0.3] }}
                  transition={{
                    pathLength: { duration: 3, repeat: Infinity, ease: "linear" },
                    opacity: { duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 },
                  }}
                />
                
                {/* Line 4: Bottom Right to Earth */}
                <motion.line
                  x1="80%"
                  y1="65%"
                  x2="50%"
                  y2="50%"
                  stroke="url(#gradient4)"
                  strokeWidth="2"
                  strokeDasharray="5,5"
                  initial={{ pathLength: 0, opacity: 0.3 }}
                  animate={{ pathLength: 1, opacity: [0.3, 0.7, 0.3] }}
                  transition={{
                    pathLength: { duration: 2.8, repeat: Infinity, ease: "linear" },
                    opacity: { duration: 2.8, repeat: Infinity, ease: "easeInOut", delay: 0.7 },
                  }}
                />
              </svg>

              {/* Connection Points - Message Icons at connection endpoints */}
              
              {/* Point 1 - Top */}
              <motion.div
                className="absolute top-[25%] left-[25%]"
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.6, 1, 0.6],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <div className="rounded-full bg-green-500/80 p-2 shadow-lg backdrop-blur-sm">
                  <MessageSquare className="h-5 w-5 text-white sm:h-6 sm:w-6" />
                </div>
              </motion.div>

              {/* Point 2 - Right */}
              <motion.div
                className="absolute top-[30%] right-[25%]"
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.6, 1, 0.6],
                }}
                transition={{
                  duration: 3.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.5,
                }}
              >
                <div className="rounded-full bg-emerald-500/80 p-2 shadow-lg backdrop-blur-sm">
                  <Send className="h-5 w-5 text-white sm:h-6 sm:w-6" />
                </div>
              </motion.div>

              {/* Point 3 - Bottom Left */}
              <motion.div
                className="absolute bottom-[30%] left-[20%]"
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.6, 1, 0.6],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1,
                }}
              >
                <div className="rounded-full bg-green-400/80 p-2 shadow-lg backdrop-blur-sm">
                  <Radio className="h-5 w-5 text-white sm:h-6 sm:w-6" />
                </div>
              </motion.div>

              {/* Point 4 - Bottom Right */}
              <motion.div
                className="absolute bottom-[35%] right-[20%]"
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.6, 1, 0.6],
                }}
                transition={{
                  duration: 3.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.7,
                }}
              >
                <div className="rounded-full bg-emerald-400/80 p-2 shadow-lg backdrop-blur-sm">
                  <MessageSquare className="h-5 w-5 text-white sm:h-6 sm:w-6" />
                </div>
              </motion.div>

              {/* Floating Connection Nodes - Small dots traveling along connection lines */}
              <motion.div
                className="absolute top-[25%] left-[25%] h-2 w-2 rounded-full bg-green-400 shadow-lg sm:h-3 sm:w-3"
                animate={{
                  x: ["0%", "25%"],
                  y: ["0%", "25%"],
                  scale: [1, 1.5, 1],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />

              <motion.div
                className="absolute top-[30%] right-[25%] h-2 w-2 rounded-full bg-emerald-400 shadow-lg sm:h-3 sm:w-3"
                animate={{
                  x: ["0%", "-25%"],
                  y: ["0%", "20%"],
                  scale: [1, 1.5, 1],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 4.5,
                  repeat: Infinity,
                  ease: "linear",
                  delay: 0.5,
                }}
              />

              <motion.div
                className="absolute bottom-[30%] left-[20%] h-2 w-2 rounded-full bg-green-300 shadow-lg sm:h-3 sm:w-3"
                animate={{
                  x: ["0%", "30%"],
                  y: ["0%", "-20%"],
                  scale: [1, 1.5, 1],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "linear",
                  delay: 1,
                }}
              />

              {/* Orbiting Message Icons around Earth */}
              <motion.div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                style={{
                  transformOrigin: "center",
                }}
                animate={{
                  rotate: 360,
                }}
                transition={{
                  duration: 15,
                  repeat: Infinity,
                  ease: "linear",
                }}
              >
                <div className="relative h-40 w-40 sm:h-48 sm:w-48">
                  <motion.div
                    className="absolute left-0 top-1/2 -translate-y-1/2 rounded-full bg-green-500/90 p-2 shadow-xl backdrop-blur-sm"
                    animate={{
                      scale: [1, 1.2, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    <Send className="h-4 w-4 text-white sm:h-5 sm:w-5" />
                  </motion.div>
                </div>
              </motion.div>

              <motion.div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                style={{
                  transformOrigin: "center",
                }}
                animate={{
                  rotate: -360,
                }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  ease: "linear",
                  delay: 0.5,
                }}
              >
                <div className="relative h-48 w-48 sm:h-56 sm:w-56">
                  <motion.div
                    className="absolute right-0 top-1/2 -translate-y-1/2 rounded-full bg-emerald-500/90 p-2 shadow-xl backdrop-blur-sm"
                    animate={{
                      scale: [1, 1.2, 1],
                    }}
                    transition={{
                      duration: 2.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 0.3,
                    }}
                  >
                    <MessageSquare className="h-4 w-4 text-white sm:h-5 sm:w-5" />
                  </motion.div>
                </div>
              </motion.div>

              {/* Geometric Shapes */}
              
              {/* Circle 1 */}
              <motion.div
                className="absolute top-60 left-16 h-16 w-16 rounded-full bg-green-300/40 blur-sm dark:bg-green-500/20 sm:h-20 sm:w-20"
                animate={{
                  scale: [1, 1.5, 1],
                  x: [0, 30, 0],
                  y: [0, -30, 0],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.4,
                }}
              />

              {/* Circle 2 */}
              <motion.div
                className="absolute bottom-60 right-16 h-12 w-12 rounded-full bg-emerald-300/40 blur-sm dark:bg-emerald-500/20 sm:h-16 sm:w-16"
                animate={{
                  scale: [1, 1.8, 1],
                  x: [0, -25, 0],
                  y: [0, 25, 0],
                }}
                transition={{
                  duration: 7,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1.5,
                }}
              />

              {/* Circle 3 */}
              <motion.div
                className="absolute top-1/2 left-8 h-10 w-10 rounded-full bg-green-200/50 blur-sm dark:bg-green-400/30 sm:h-14 sm:w-14"
                animate={{
                  scale: [1, 1.6, 1],
                  rotate: [0, 180, 360],
                }}
                transition={{
                  duration: 10,
                  repeat: Infinity,
                  ease: "linear",
                  delay: 0.8,
                }}
              />

              {/* Triangle-like shape (using gradient) */}
              <motion.div
                className="absolute top-80 right-8 h-0 w-0 border-l-[15px] border-r-[15px] border-b-[25px] border-l-transparent border-r-transparent border-b-green-400/30 blur-sm sm:border-l-[20px] sm:border-r-[20px] sm:border-b-[35px]"
                animate={{
                  y: [0, -35, 0],
                  rotate: [0, 120, 240, 360],
                  scale: [1, 1.3, 1],
                }}
                transition={{
                  duration: 9,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1.8,
                }}
              />

              {/* Small chat bubbles */}
              <motion.div
                className="absolute top-40 left-1/2 h-8 w-8 rounded-full bg-green-400/30 shadow-lg sm:h-10 sm:w-10"
                animate={{
                  y: [0, -40, 0],
                  x: [0, 20, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.6,
                }}
              />

              <motion.div
                className="absolute bottom-48 right-1/3 h-6 w-6 rounded-full bg-emerald-400/40 shadow-lg sm:h-8 sm:w-8"
                animate={{
                  y: [0, 35, 0],
                  x: [0, -25, 0],
                }}
                transition={{
                  duration: 5.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1.3,
                }}
              />

              {/* Sparkle effect */}
              <motion.div
                className="absolute top-72 left-1/3"
                animate={{
                  scale: [0.5, 1.5, 0.5],
                  rotate: [0, 180, 360],
                  opacity: [0.3, 1, 0.3],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.5,
                }}
              >
                <Sparkles className="h-5 w-5 text-green-400 sm:h-6 sm:w-6" />
              </motion.div>

              <motion.div
                className="absolute bottom-72 right-1/4"
                animate={{
                  scale: [0.8, 1.8, 0.8],
                  rotate: [360, 180, 0],
                  opacity: [0.4, 0.9, 0.4],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1.7,
                }}
              >
                <Sparkles className="h-4 w-4 text-emerald-400 sm:h-5 sm:w-5" />
              </motion.div>

              {/* Message Square Icons */}
              <motion.div
                className="absolute top-1/3 right-20"
                animate={{
                  rotate: [0, 15, -15, 0],
                  y: [0, -15, 0],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1.1,
                }}
              >
                <MessageSquare className="h-6 w-6 text-green-500/50 sm:h-8 sm:w-8" />
              </motion.div>

              <motion.div
                className="absolute bottom-1/3 left-20"
                animate={{
                  rotate: [0, -20, 20, 0],
                  y: [0, 20, 0],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.4,
                }}
              >
                <MessageSquare className="h-5 w-5 fill-green-300/40 text-green-400/40 sm:h-7 sm:w-7" />
              </motion.div>

              {/* Glowing orbs */}
              <motion.div
                className="absolute top-1/2 right-1/4 h-24 w-24 rounded-full bg-green-400/20 blur-2xl dark:bg-green-500/10 sm:h-32 sm:w-32"
                animate={{
                  scale: [1, 1.4, 1],
                  x: [0, 40, 0],
                  y: [0, -40, 0],
                }}
                transition={{
                  duration: 12,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.2,
                }}
              />

              <motion.div
                className="absolute bottom-1/3 left-1/4 h-20 w-20 rounded-full bg-emerald-400/20 blur-2xl dark:bg-emerald-500/10 sm:h-28 sm:w-28"
                animate={{
                  scale: [1, 1.6, 1],
                  x: [0, -35, 0],
                  y: [0, 35, 0],
                }}
                transition={{
                  duration: 10,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1.4,
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative px-4 py-20">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mb-16 text-center"
          >
            <h2 className="mb-4 text-5xl font-bold text-gray-900 dark:text-white">
              Why FlowChat?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Discover the features that make us the best choice
            </p>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <FeatureCard
              icon={Zap}
              title="Lightning Fast"
              description="Send and receive messages instantly with blazing fast performance"
              delay={0.2}
            />
            <FeatureCard
              icon={Shield}
              title="Fully Secure"
              description="End-to-end encryption to protect your privacy and data"
              delay={0.4}
            />
            <FeatureCard
              icon={Users}
              title="Powerful Groups"
              description="Create groups with up to 100,000 members easily"
              delay={0.6}
            />
            <FeatureCard
              icon={Video}
              title="Video Calls"
              description="High-quality video calls with your friends"
              delay={0.8}
            />
          </div>

          <div className="mt-8 grid gap-8 md:grid-cols-3">
            <FeatureCard
              icon={Lock}
              title="Complete Privacy"
              description="We never share your data with any third party"
              delay={1.0}
            />
            <FeatureCard
              icon={Globe}
              title="Global"
              description="Available worldwide without restrictions"
              delay={1.2}
            />
            <FeatureCard
              icon={MessageSquare}
              title="Smart Messaging"
              description="Auto-replies and smart bots to facilitate communication"
              delay={1.4}
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative px-4 py-20">
        <div className="mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative overflow-hidden rounded-3xl bg-linear-to-r from-green-500 to-emerald-600 p-12 shadow-2xl"
          >
            <div className="relative z-10 text-center text-white">
              <h2 className="mb-4 text-4xl font-bold md:text-5xl">
                Ready to Get Started?
              </h2>
              <p className="mb-8 text-xl opacity-90">
                Join millions of users around the world
              </p>
              <Link href="/signup">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    size="lg"
                    className="h-14 rounded-2xl bg-white px-8 text-lg font-semibold text-green-600 hover:bg-gray-100"
                  >
                    Create Free Account
                  </Button>
                </motion.div>
              </Link>
            </div>

            {/* Animated background elements */}
            <motion.div
              className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-white/10"
              animate={{ scale: [1, 1.2, 1], rotate: 360 }}
              transition={{ duration: 10, repeat: Infinity }}
            />
            <motion.div
              className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-white/10"
              animate={{ scale: [1, 1.3, 1], rotate: -360 }}
              transition={{ duration: 12, repeat: Infinity }}
            />
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-green-200/50 bg-white/50 px-4 py-12 backdrop-blur-sm dark:border-green-800/50 dark:bg-gray-900/50">
        <div className="mx-auto max-w-7xl text-center">
          <div className="mb-6 flex items-center justify-center gap-2">
            <MessageSquare className="h-8 w-8 text-green-500" />
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              FlowChat
            </span>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            © 2025 FlowChat. All rights reserved.
          </p>
    </div>
      </footer>
      </motion.div>
    </>
  );
}
