"use client";

import { motion } from "framer-motion";
import { Home, DoorOpen, Sofa, Wrench, Sparkles, FileCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface AnimatedHouseStepperProps {
  steps: string[];
  currentStep: number;
}

const stepIcons = [
  Home,         // Property Info
  DoorOpen,     // Room Configuration
  Wrench,       // Renovation Scope
  Sofa,         // Material Quality
  Sparkles,     // Special Requirements
  FileCheck,    // Results/Settings
];

export function AnimatedHouseStepper({ steps, currentStep }: AnimatedHouseStepperProps) {
  return (
    <div className="w-full space-y-8">
      {/* House Visualization */}
      <div className="relative h-48 flex items-end justify-center">
        <svg
          viewBox="0 0 300 200"
          className="w-full max-w-md h-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Base/Foundation - Step 0 */}
          <motion.rect
            x="75"
            y="160"
            width="150"
            height="10"
            fill="#9CA3AF"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: currentStep >= 0 ? 1 : 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
          
          {/* Main Structure - Step 1 */}
          <motion.rect
            x="80"
            y="100"
            width="140"
            height="60"
            fill="#FEF3C7"
            stroke="#D97706"
            strokeWidth="2"
            initial={{ scaleY: 0 }}
            animate={{ scaleY: currentStep >= 1 ? 1 : 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            style={{ originY: 1 }}
          />
          
          {/* Roof - Step 2 */}
          <motion.path
            d="M 70 100 L 150 50 L 230 100"
            fill="#DC2626"
            stroke="#991B1B"
            strokeWidth="2"
            initial={{ opacity: 0, y: -20 }}
            animate={{ 
              opacity: currentStep >= 2 ? 1 : 0,
              y: currentStep >= 2 ? 0 : -20
            }}
            transition={{ duration: 0.5, delay: 0.4 }}
          />
          
          {/* Windows - Step 3 */}
          <motion.g
            initial={{ opacity: 0, scale: 0 }}
            animate={{ 
              opacity: currentStep >= 3 ? 1 : 0,
              scale: currentStep >= 3 ? 1 : 0
            }}
            transition={{ duration: 0.4, delay: 0.6 }}
          >
            <rect x="100" y="115" width="25" height="25" fill="#DBEAFE" stroke="#3B82F6" strokeWidth="2" />
            <rect x="175" y="115" width="25" height="25" fill="#DBEAFE" stroke="#3B82F6" strokeWidth="2" />
            {/* Window panes */}
            <line x1="112.5" y1="115" x2="112.5" y2="140" stroke="#3B82F6" strokeWidth="1" />
            <line x1="100" y1="127.5" x2="125" y2="127.5" stroke="#3B82F6" strokeWidth="1" />
            <line x1="187.5" y1="115" x2="187.5" y2="140" stroke="#3B82F6" strokeWidth="1" />
            <line x1="175" y1="127.5" x2="200" y2="127.5" stroke="#3B82F6" strokeWidth="1" />
          </motion.g>
          
          {/* Door - Step 4 */}
          <motion.rect
            x="135"
            y="130"
            width="30"
            height="30"
            fill="#92400E"
            stroke="#78350F"
            strokeWidth="2"
            rx="2"
            initial={{ scaleY: 0 }}
            animate={{ scaleY: currentStep >= 4 ? 1 : 0 }}
            transition={{ duration: 0.4, delay: 0.8 }}
            style={{ originY: 1 }}
          />
          
          {/* Door handle */}
          <motion.circle
            cx="142"
            cy="145"
            r="2"
            fill="#FCD34D"
            initial={{ opacity: 0 }}
            animate={{ opacity: currentStep >= 4 ? 1 : 0 }}
            transition={{ duration: 0.2, delay: 1 }}
          />
          
          {/* Decorative Details - Step 5 */}
          <motion.g
            initial={{ opacity: 0 }}
            animate={{ opacity: currentStep >= 5 ? 1 : 0 }}
            transition={{ duration: 0.5, delay: 1 }}
          >
            {/* Garden/landscaping */}
            <circle cx="60" cy="165" r="8" fill="#22C55E" />
            <circle cx="240" cy="165" r="8" fill="#22C55E" />
            <circle cx="50" cy="170" r="6" fill="#16A34A" />
            <circle cx="250" cy="170" r="6" fill="#16A34A" />
            
            {/* Flowers */}
            <circle cx="65" cy="168" r="2" fill="#F472B6" />
            <circle cx="235" cy="168" r="2" fill="#F472B6" />
            <circle cx="55" cy="172" r="2" fill="#FDE047" />
            <circle cx="245" cy="172" r="2" fill="#FDE047" />
            
            {/* Chimney */}
            <rect x="190" y="70" width="15" height="30" fill="#DC2626" stroke="#991B1B" strokeWidth="1" />
            
            {/* Smoke */}
            <motion.circle
              cx="197"
              cy="65"
              r="4"
              fill="#D1D5DB"
              opacity="0.6"
              animate={{
                y: [0, -10, -20],
                opacity: [0.6, 0.4, 0],
                scale: [1, 1.3, 1.6]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeOut"
              }}
            />
            <motion.circle
              cx="197"
              cy="65"
              r="4"
              fill="#D1D5DB"
              opacity="0.6"
              animate={{
                y: [0, -10, -20],
                opacity: [0.6, 0.4, 0],
                scale: [1, 1.3, 1.6]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeOut",
                delay: 0.7
              }}
            />
          </motion.g>
        </svg>
      </div>

      {/* Step Indicators */}
      <div className="relative">
        {/* Progress Line */}
        <div className="absolute top-6 left-0 right-0 h-1 bg-muted rounded-full">
          <motion.div
            className="h-full bg-primary rounded-full"
            initial={{ width: "0%" }}
            animate={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          />
        </div>

        {/* Step Circles */}
        <div className="relative flex justify-between">
          {steps.map((step, index) => {
            const Icon = stepIcons[index] || Home;
            const isCompleted = index < currentStep;
            const isCurrent = index === currentStep;
            
            return (
              <div
                key={index}
                className="flex flex-col items-center gap-2 relative z-10"
              >
                <div
                  className={cn(
                    "w-12 h-12 rounded-full flex items-center justify-center transition-all",
                    isCompleted && "bg-primary text-primary-foreground",
                    isCurrent && "bg-primary text-primary-foreground ring-2 ring-primary ring-offset-2",
                    !isCompleted && !isCurrent && "bg-muted text-muted-foreground"
                  )}
                >
                  {isCompleted ? (
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <Icon className="w-6 h-6" />
                  )}
                </div>
                
                <span
                  className={cn(
                    "text-xs font-medium text-center max-w-[80px] transition-colors hidden sm:block",
                    (isCompleted || isCurrent) && "text-foreground",
                    !isCompleted && !isCurrent && "text-muted-foreground"
                  )}
                >
                  {step}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

