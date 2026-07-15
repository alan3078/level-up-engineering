"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Calculator, ArrowRight, Sparkles, Home } from "lucide-react";
import { useHeroStats, useConfigItem } from "@/lib/hooks";
import * as Icons from "lucide-react";
import { localize, localizeValue } from "@/lib/i18n";
import { useLocale } from "@/lib/providers/locale-provider";

// Hook to detect mobile devices
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return isMobile;
}

export function HeroBanner() {
  const { locale } = useLocale();
  const ref = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const prefersReducedMotion = useReducedMotion();

  // Disable scroll-based animations on mobile or when reduced motion is preferred
  const shouldAnimateScroll = !isMobile && !prefersReducedMotion;

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  // Always call hooks, but use values conditionally
  const yTransform = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacityTransform = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scaleTransform = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);
  const imageYTransform = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);

  const y = shouldAnimateScroll ? yTransform : "0%";
  const opacity = shouldAnimateScroll ? opacityTransform : 1;
  const scale = shouldAnimateScroll ? scaleTransform : 1;
  const imageY = shouldAnimateScroll ? imageYTransform : "0%";

  // Use TanStack Query hooks
  const { data: heroStats } = useHeroStats();
  const { data: titleConfig } = useConfigItem("hero_title");
  const { data: subtitleConfig } = useConfigItem("hero_subtitle");
  const { data: badgeConfig } = useConfigItem("hero_badge");
  const { data: experienceConfig } = useConfigItem("company_experience_years");

  // Extract values from config
  const heroTitle = localizeValue(
    titleConfig?.value,
    locale,
    "Professional Renovation Services"
  );
  const heroSubtitle = localizeValue(
    subtitleConfig?.value,
    locale,
    "Complete renovation and design services for your ideal home"
  );
  const badgeText = localizeValue(
    badgeConfig?.value ?? experienceConfig?.value,
    locale,
    "20+ Years of Experience"
  );

  // Process stats with icons
  const stats =
    heroStats?.stats && heroStats.stats.length > 0
      ? heroStats.stats.map((stat) => {
          const IconComponent =
            (Icons as unknown as Record<string, typeof Home>)[stat.icon] ||
            Home;
          return {
            icon: IconComponent,
            value: stat.value,
            label: localize(stat.label, locale),
          };
        })
      : [];

  // Animation variants that respect reduced motion
  const fadeInUp = {
    initial: { opacity: 0, y: prefersReducedMotion ? 0 : 20 },
    animate: { opacity: 1, y: 0 },
  };

  const fadeInUpDelayed = (delay: number) => ({
    initial: { opacity: 0, y: prefersReducedMotion ? 0 : 30 },
    animate: { opacity: 1, y: 0 },
    transition: {
      duration: prefersReducedMotion ? 0 : 0.8,
      delay: prefersReducedMotion ? 0 : delay,
    },
  });

  return (
    <section
      ref={ref}
      className="relative w-full h-screen min-h-[600px] flex items-center justify-center overflow-hidden"
    >
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <motion.div
          style={{
            y: imageY,
            willChange: shouldAnimateScroll ? "transform" : "auto",
          }}
          className="absolute inset-0"
        >
          <Image
            src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1920&h=1080&fit=crop&q=80"
            alt="Modern interior design"
            fill
            className="object-cover"
            priority
            sizes="100vw"
            quality={isMobile ? 75 : 85}
            onError={(e) => {
              // Fallback to a different image if this one fails
              const target = e.target as HTMLImageElement;
              target.src =
                "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=1920&h=1080&fit=crop&q=80";
            }}
          />
        </motion.div>
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-background/80 via-background/60 to-background/80" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
      </div>

      {/* Animated Background Shapes - Reduced on mobile */}
      {!prefersReducedMotion && (
        <div className="absolute inset-0">
          {/* Only show one shape on mobile, all three on desktop */}
          {!isMobile && (
            <>
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
                style={{ willChange: "transform" }}
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
                style={{ willChange: "transform" }}
              />
            </>
          )}
          {/* Single subtle shape on mobile with reduced blur */}
          <motion.div
            className={`absolute top-1/2 left-1/2 ${isMobile ? "w-48 h-48 blur-xl" : "w-64 h-64 blur-2xl"} bg-primary/5 rounded-full`}
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear",
            }}
            style={{ willChange: "transform" }}
          />
        </div>
      )}

      {/* Decorative Images - Already hidden on mobile via classes */}
      {!isMobile && (
        <>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: prefersReducedMotion ? 1 : 1, scale: 1 }}
            transition={{
              duration: prefersReducedMotion ? 0 : 1,
              delay: prefersReducedMotion ? 0 : 0.5,
            }}
            className="absolute right-10 top-20 w-64 h-64 md:w-80 md:h-80 rounded-2xl overflow-hidden shadow-2xl border-4 border-background/20 hidden lg:block"
          >
            <Image
              src="https://images.unsplash.com/photo-1600607688969-a5bfcd646154?w=800&h=800&fit=crop&q=80"
              alt="Interior design"
              fill
              className="object-cover"
              sizes="320px"
              loading="lazy"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src =
                  "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800&h=800&fit=crop&q=80";
              }}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: prefersReducedMotion ? 1 : 1, scale: 1 }}
            transition={{
              duration: prefersReducedMotion ? 0 : 1,
              delay: prefersReducedMotion ? 0 : 0.7,
            }}
            className="absolute left-10 bottom-20 w-48 h-48 md:w-64 md:h-64 rounded-2xl overflow-hidden shadow-2xl border-4 border-background/20 hidden md:block"
          >
            <Image
              src="https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=600&h=600&fit=crop&q=80"
              alt="Home renovation"
              fill
              className="object-cover"
              sizes="256px"
              loading="lazy"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src =
                  "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=600&h=600&fit=crop&q=80";
              }}
            />
          </motion.div>
        </>
      )}

      {/* Content */}
      <motion.div
        style={{
          y,
          opacity,
          scale,
          willChange: shouldAnimateScroll ? "transform, opacity" : "auto",
        }}
        className="relative z-10 container px-4 md:px-6"
      >
        <div className="flex flex-col items-center space-y-6 text-center">
          {/* Badge */}
          <motion.div
            {...fadeInUp}
            transition={{ duration: prefersReducedMotion ? 0 : 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-sm">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">
                {badgeText}
              </span>
            </div>
          </motion.div>

          {/* Main Heading */}
          <motion.div {...fadeInUpDelayed(0.2)} className="space-y-4">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl bg-clip-text text-transparent bg-gradient-to-r from-foreground via-primary to-foreground">
              {heroTitle}
            </h1>
            <p className="mx-auto max-w-[700px] text-lg md:text-xl lg:text-2xl text-muted-foreground">
              {heroSubtitle}
            </p>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            {...fadeInUpDelayed(0.4)}
            className="flex flex-col sm:flex-row gap-4 pt-4"
          >
            <Button asChild size="lg" className="text-lg px-8 py-6">
              <Link href="/calculator">
                <Calculator className="mr-2 h-5 w-5" />
                免費報價
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="text-lg px-8 py-6"
            >
              <Link href="/portfolio">
                瀏覽作品
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </motion.div>

          {/* Stats */}
          {stats.length > 0 && (
            <motion.div
              {...fadeInUpDelayed(0.6)}
              className="grid grid-cols-3 gap-8 pt-8"
            >
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{
                      opacity: 0,
                      scale: prefersReducedMotion ? 1 : 0.8,
                    }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                      duration: prefersReducedMotion ? 0 : 0.5,
                      delay: prefersReducedMotion ? 0 : 0.7 + index * 0.1,
                    }}
                    className="flex flex-col items-center gap-2"
                  >
                    <Icon className="h-6 w-6 text-primary" />
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">
                      {stat.label}
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Scroll Indicator */}
      {!prefersReducedMotion && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: prefersReducedMotion ? 0 : 1 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="flex flex-col items-center gap-2"
            style={{ willChange: "transform" }}
          >
            <span className="text-sm text-muted-foreground">向下滾動</span>
            <div className="w-6 h-10 border-2 border-muted-foreground/30 rounded-full flex justify-center p-2">
              <motion.div
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-1.5 h-1.5 bg-muted-foreground rounded-full"
                style={{ willChange: "transform" }}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </section>
  );
}
