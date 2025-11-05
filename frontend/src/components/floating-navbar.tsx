"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { MessageSquare, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export function FloatingNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 px-4 transition-all duration-300"
      style={{ paddingTop: isScrolled ? "0.5rem" : "1rem" }}
    >
      <div className="mx-auto max-w-7xl">
        <motion.div
          className={`flex items-center justify-between border bg-white/80 backdrop-blur-xl transition-all duration-300 dark:bg-gray-900/80 ${
            isScrolled ? "rounded-xl px-4 py-3 shadow-md" : "rounded-2xl px-6 py-4 shadow-lg"
          }`}
          whileHover={{ scale: isScrolled ? 1 : 1.01 }}
          style={{
            borderColor: isScrolled
              ? "rgb(187 247 208 / 0.3)"
              : "rgb(187 247 208 / 0.5)",
          }}
        >
          <Link href="/" className="flex items-center gap-2">
            <motion.div
              className={`rounded-xl bg-linear-to-br from-green-400 to-emerald-500 shadow-lg transition-all duration-300 ${
                isScrolled ? "p-2" : "p-2.5"
              }`}
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
            >
              <motion.div
                className="text-white transition-all duration-300"
                animate={{
                  width: isScrolled ? "1.25rem" : "1.5rem",
                  height: isScrolled ? "1.25rem" : "1.5rem",
                }}
                transition={{
                  duration: 0.3,
                  ease: "easeInOut",
                }}
              >
                <MessageSquare className="h-full w-full" />
              </motion.div>
            </motion.div>
            <motion.span
              className={`font-bold text-gray-900 transition-all duration-300 dark:text-white ${
                isScrolled ? "text-xl" : "text-2xl"
              }`}
            >
              FlowChat
            </motion.span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-3 md:flex md:gap-4">
            <Link href="/login">
              <Button
                variant="ghost"
                className="rounded-xl text-gray-700 hover:bg-green-50 hover:text-green-600 dark:text-gray-300 dark:hover:bg-green-900/20 dark:hover:text-green-400"
              >
                Sign In
              </Button>
            </Link>
            <Link href="/signup">
              <Button className="rounded-xl bg-linear-to-r from-green-500 to-emerald-600 px-5 py-2 text-sm font-semibold shadow-lg shadow-green-500/30 hover:from-green-600 hover:to-emerald-700 sm:px-6">
                Get Started
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="rounded-xl p-2 text-gray-700 transition-colors hover:bg-green-50 hover:text-green-600 dark:text-gray-300 dark:hover:bg-green-900/20 md:hidden"
            aria-label="Toggle menu"
          >
            {isOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </motion.div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-2 overflow-hidden border bg-white/95 backdrop-blur-xl dark:bg-gray-900/95 md:hidden"
              style={{
                borderRadius: isScrolled ? "0.75rem" : "1rem",
                borderColor: isScrolled
                  ? "rgb(187 247 208 / 0.3)"
                  : "rgb(187 247 208 / 0.5)",
              }}
            >
              <div className="flex flex-col gap-2 p-4">
                <Link
                  href="/login"
                  onClick={() => setIsOpen(false)}
                  className="rounded-xl px-4 py-3 text-center font-medium text-gray-700 transition-colors hover:bg-green-50 hover:text-green-600 dark:text-gray-300 dark:hover:bg-green-900/20 dark:hover:text-green-400"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setIsOpen(false)}
                  className="rounded-xl bg-linear-to-r from-green-500 to-emerald-600 px-4 py-3 text-center font-semibold text-white shadow-lg shadow-green-500/30 transition-all hover:from-green-600 hover:to-emerald-700"
                >
                  Get Started
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
}

