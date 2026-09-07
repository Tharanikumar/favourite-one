import React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "gold" | "rose" | "subtle" | "outline" | "solid" | "default" | "sage" | "mauve" | "peach";
  size?: "sm" | "md";
}

export function Badge({
  className,
  variant = "subtle",
  size = "md",
  children,
  ...props
}: BadgeProps) {
  const baseStyles = "inline-flex items-center font-medium rounded-full tracking-wider uppercase";

  const variantStyles = {
    gold: "bg-gold-400/20 text-gold-700 border border-gold-500/35",
    rose: "bg-rose-400/20 text-rose-700 border border-rose-500/35",
    subtle: "bg-universe-900/90 text-cream-200 border border-universe-750/70",
    default: "bg-universe-900/90 text-cream-200 border border-universe-750/70",
    outline: "border border-universe-700/60 text-cream-200 bg-white/60",
    solid: "bg-universe-800 text-cream-100 border border-universe-700",
    sage: "bg-sage-400/35 text-sage-700 border border-sage-500/30",
    mauve: "bg-mauve-400/35 text-mauve-700 border border-mauve-500/30",
    peach: "bg-peach-400/40 text-rose-700 border border-peach-500/40",
  };

  const sizeStyles = {
    sm: "text-[10px] px-2 py-0.5 leading-none",
    md: "text-xs px-2.5 py-1 leading-normal",
  };

  return (
    <span className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)} {...props}>
      {children}
    </span>
  );
}
