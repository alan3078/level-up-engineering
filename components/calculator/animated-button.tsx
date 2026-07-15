"use client";

import { motion } from "framer-motion";
import { Button, ButtonProps } from "@/components/ui/button";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";

export const AnimatedButton = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, className, disabled, ...props }, ref) => {
    return (
      <motion.div
        whileHover={!disabled ? { scale: 1.02 } : {}}
        whileTap={!disabled ? { scale: 0.98 } : {}}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        <Button
          ref={ref}
          className={cn(
            "relative overflow-hidden transition-all duration-300",
            !disabled && "hover:shadow-lg",
            className
          )}
          disabled={disabled}
          {...props}
        >
          <motion.span
            className="relative z-10 flex items-center"
            initial={false}
            animate={!disabled ? {
              transition: {
                duration: 0.3,
              }
            } : {}}
          >
            {children}
          </motion.span>
          
          {!disabled && (
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              initial={{ x: "-100%" }}
              whileHover={{ x: "100%" }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
            />
          )}
        </Button>
      </motion.div>
    );
  }
);

AnimatedButton.displayName = "AnimatedButton";

