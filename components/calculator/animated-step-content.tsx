"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ReactNode } from "react";

interface AnimatedStepContentProps {
  children: ReactNode;
  step: number;
  direction?: "forward" | "backward";
}

export function AnimatedStepContent({ children, step, direction = "forward" }: AnimatedStepContentProps) {
  const variants = {
    enter: {
      x: direction === "forward" ? 50 : -50,
      opacity: 0,
      scale: 0.95,
    },
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: {
      x: direction === "forward" ? -50 : 50,
      opacity: 0,
      scale: 0.95,
    },
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={step}
        variants={variants}
        initial="enter"
        animate="center"
        exit="exit"
        transition={{
          x: { type: "spring", stiffness: 300, damping: 30 },
          opacity: { duration: 0.2 },
          scale: { duration: 0.2 },
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

