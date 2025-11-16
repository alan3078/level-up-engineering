"use client";

import * as React from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Calculator, ArrowRight, Sparkles, Home, Palette } from "lucide-react";

export function HeroBanner() {
  const ref = React.useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);

  return (
    <section
      ref={ref}
      className="relative w-full h-screen min-h-[600px] flex items-center justify-center overflow-hidden"
    >
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <motion.div style={{ y: imageY }} className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1920&h=1080&fit=crop&q=80"
            alt="Modern interior design"
            fill
            className="object-cover"
            priority
            sizes="100vw"
            onError={(e) => {
              // Fallback to a different image if this one fails
              const target = e.target as HTMLImageElement;
              target.src = "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=1920&h=1080&fit=crop&q=80";
            }}
          />
        </motion.div>
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-background/80 via-background/60 to-background/80" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
      </div>

      {/* Animated Background Shapes */}
      <div className="absolute inset-0">
        {/* Floating shapes */}
        <motion.div
          className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl"
          animate={{
            y: [0, 30, 0],
            x: [0, 20, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl"
          animate={{
            y: [0, -30, 0],
            x: [0, -20, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 w-64 h-64 bg-primary/5 rounded-full blur-2xl"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </div>

      {/* Decorative Images */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
        className="absolute right-10 top-20 w-64 h-64 md:w-80 md:h-80 rounded-2xl overflow-hidden shadow-2xl border-4 border-background/20 hidden lg:block"
      >
        <Image
          src="https://images.unsplash.com/photo-1600607688969-a5bfcd646154?w=800&h=800&fit=crop&q=80"
          alt="Interior design"
          fill
          className="object-cover"
          sizes="320px"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800&h=800&fit=crop&q=80";
          }}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 0.7 }}
        className="absolute left-10 bottom-20 w-48 h-48 md:w-64 md:h-64 rounded-2xl overflow-hidden shadow-2xl border-4 border-background/20 hidden md:block"
      >
        <Image
          src="https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=600&h=600&fit=crop&q=80"
          alt="Home renovation"
          fill
          className="object-cover"
          sizes="256px"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=600&h=600&fit=crop&q=80";
          }}
        />
      </motion.div>

      {/* Content */}
      <motion.div
        style={{ y, opacity, scale }}
        className="relative z-10 container px-4 md:px-6"
      >
        <div className="flex flex-col items-center space-y-6 text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-sm">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">
                20年專業經驗
              </span>
            </div>
          </motion.div>

          {/* Main Heading */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-4"
          >
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl bg-clip-text text-transparent bg-gradient-to-r from-foreground via-primary to-foreground">
              專業裝修服務
            </h1>
            <p className="mx-auto max-w-[700px] text-lg md:text-xl lg:text-2xl text-muted-foreground">
              為您打造理想家居，提供一站式裝修及設計服務
            </p>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 pt-4"
          >
            <Button asChild size="lg" className="text-lg px-8 py-6">
              <Link href="/calculator">
                <Calculator className="mr-2 h-5 w-5" />
                免費報價
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg px-8 py-6">
              <Link href="/portfolio">
                瀏覽作品
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="grid grid-cols-3 gap-8 pt-8"
          >
            {[
              { icon: Home, value: "500+", label: "完成項目" },
              { icon: Palette, value: "20年", label: "專業經驗" },
              { icon: Sparkles, value: "98%", label: "客戶滿意度" },
            ].map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
                  className="flex flex-col items-center gap-2"
                >
                  <Icon className="h-6 w-6 text-primary" />
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="flex flex-col items-center gap-2"
        >
          <span className="text-sm text-muted-foreground">向下滾動</span>
          <div className="w-6 h-10 border-2 border-muted-foreground/30 rounded-full flex justify-center p-2">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1.5 h-1.5 bg-muted-foreground rounded-full"
            />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}

