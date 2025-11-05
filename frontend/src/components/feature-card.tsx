"use client";

import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  delay?: number;
}

export function FeatureCard({
  icon: Icon,
  title,
  description,
  delay = 0,
}: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ scale: 1.05, y: -5 }}
    >
      <Card className="border-green-200/50 bg-white/80 backdrop-blur-sm hover:border-green-400/50 hover:shadow-green-200/50 dark:bg-gray-900/80 dark:border-green-800/50">
        <CardContent className="p-6">
          <motion.div
            className="mb-4 inline-flex rounded-xl bg-linear-to-br from-green-400 to-emerald-500 p-3 text-white shadow-lg"
            whileHover={{ rotate: 360, scale: 1.1 }}
            transition={{ duration: 0.6 }}
          >
            <Icon className="h-6 w-6" />
          </motion.div>
          <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
            {title}
          </h3>
          <p className="text-gray-600 dark:text-gray-400">{description}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
}

