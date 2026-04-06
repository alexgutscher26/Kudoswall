"use client";

import { motion } from "framer-motion";
import { cn } from "../lib/utils";

interface ProgressProps {
  currentStep: number;
  maxSteps: number;
  accentColor?: string;
  className?: string;
}

export function Progress({
  currentStep,
  maxSteps,
  accentColor = "#e8527a",
  className,
}: ProgressProps) {
  const percentage = (currentStep / maxSteps) * 100;

  return (
    <div className={cn("relative h-1.5 w-full overflow-hidden bg-neutral-100", className)}>
      <motion.div
        className="absolute top-0 bottom-0 left-0"
        initial={{ width: 0 }}
        animate={{ width: `${percentage}%` }}
        transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
        style={{
          backgroundColor: accentColor,
          boxShadow: `0 0 10px ${accentColor}30`,
        }}
      />
      {/* Segment Indicators */}
      <div className="absolute inset-0 flex justify-evenly">
        {Array.from({ length: maxSteps - 1 }).map((_, i) => (
          <div key={i} className="h-full w-px bg-white/20" />
        ))}
      </div>
    </div>
  );
}
