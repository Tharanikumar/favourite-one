"use client";

import React from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

export interface CardProps extends Omit<HTMLMotionProps<"div">, "children"> {
  variant?: "glass" | "elevated" | "flat" | "borderless";
  hoverEffect?: boolean;
  glowColor?: "gold" | "rose" | "none";
  children?: React.ReactNode;
}

export function Card({
  className,
  variant = "glass",
  hoverEffect = true,
  glowColor = "gold",
  children,
  ...props
}: CardProps) {
  const variantStyles = {
    glass: "bg-white/85 border border-universe-750/70 backdrop-blur-md shadow-glass",
    elevated: "bg-white/95 border border-universe-700/50 backdrop-blur-xl shadow-xl",
    flat: "bg-universe-900 border border-universe-750/60",
    borderless: "bg-white/50 border-0",
  };

  const glowStyles = {
    gold: "hover:border-gold-500/60 hover:shadow-glow-gold",
    rose: "hover:border-rose-400/70 hover:shadow-glow-rose",
    none: "",
  };

  return (
    <motion.div
      whileHover={
        hoverEffect
          ? {
              y: -4,
              transition: { duration: 0.25, ease: "easeOut" },
            }
          : undefined
      }
      className={cn(
        "rounded-2xl p-6 transition-colors duration-300 relative overflow-hidden",
        variantStyles[variant],
        hoverEffect && glowStyles[glowColor],
        className
      )}
      {...props}
    >
      {/* Subtle corner light sheen */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 bg-rose-400/[0.06] rounded-full pointer-events-none blur-xl" />
      {children}
    </motion.div>
  );
}

export function CardHeader({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("flex flex-col space-y-1.5 pb-4", className)} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn(
        "font-serif text-xl sm:text-2xl font-normal text-cream-50 tracking-wide",
        className
      )}
      {...props}
    >
      {children}
    </h3>
  );
}

export function CardDescription({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn("text-xs sm:text-sm text-cream-300 font-sans leading-relaxed", className)} {...props}>
      {children}
    </p>
  );
}

export function CardContent({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("pt-0", className)} {...props}>{children}</div>;
}

export function CardFooter({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex items-center pt-4 border-t border-universe-750/40 mt-4", className)}
      {...props}
    >
      {children}
    </div>
  );
}
