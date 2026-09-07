"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  centered?: boolean;
  containerSize?: "sm" | "md" | "lg" | "xl" | "full";
  badge?: React.ReactNode;
}

export function Section({
  className,
  eyebrow,
  title,
  subtitle,
  centered = false,
  containerSize = "lg",
  badge,
  children,
  ...props
}: SectionProps) {
  const containerSizes = {
    sm: "max-w-3xl",
    md: "max-w-5xl",
    lg: "max-w-6xl",
    xl: "max-w-7xl",
    full: "max-w-full",
  };

  return (
    <section
      className={cn("py-16 sm:py-24 px-4 sm:px-6 lg:px-8 relative", className)}
      {...props}
    >
      <div className={cn("mx-auto", containerSizes[containerSize])}>
        {(eyebrow || title || subtitle || badge) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className={cn("mb-12 sm:mb-16 space-y-3", centered && "text-center mx-auto max-w-2xl")}
          >
            {badge && <div className="mb-2">{badge}</div>}
            {eyebrow && (
              <span className="text-xs uppercase tracking-[0.25em] font-semibold text-rose-600 block font-sans">
                {eyebrow}
              </span>
            )}
            {title && (
              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-cream-50 tracking-tight leading-[1.15]">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-sm sm:text-base md:text-lg text-cream-300 font-sans font-light leading-relaxed max-w-2xl">
                {subtitle}
              </p>
            )}
            <div
              className={cn(
                "h-px w-16 bg-gradient-to-r from-rose-400/60 to-transparent mt-4",
                centered && "mx-auto bg-gradient-to-r from-transparent via-rose-400/60 to-transparent w-24"
              )}
            />
          </motion.div>
        )}
        {children}
      </div>
    </section>
  );
}
