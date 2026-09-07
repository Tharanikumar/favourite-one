"use client";

import React, { forwardRef } from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

export interface ButtonProps extends Omit<HTMLMotionProps<"button">, "children"> {
  variant?: "gold" | "glass" | "rose" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg" | "icon";
  children?: React.ReactNode;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "gold",
      size = "md",
      children,
      icon,
      iconPosition = "left",
      isLoading = false,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "relative inline-flex items-center justify-center font-medium rounded-full tracking-wide transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400/50 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]";

    const variantStyles = {
      gold: "bg-gradient-to-r from-gold-500 to-gold-400 hover:from-gold-400 hover:to-gold-300 text-white shadow-glow-gold hover:shadow-[0_0_25px_rgba(212,163,89,0.4)] font-semibold border border-gold-300/40",
      glass:
        "bg-white/85 hover:bg-white text-cream-100 hover:text-universe-950 border border-universe-750 hover:border-rose-400/60 backdrop-blur-md shadow-glass",
      rose: "bg-gradient-to-r from-rose-500 to-rose-400 hover:from-rose-400 hover:to-rose-300 text-white shadow-glow-rose hover:shadow-[0_0_25px_rgba(200,111,130,0.4)] border border-rose-300/40",
      outline:
        "border border-rose-400/50 hover:border-rose-500 text-cream-100 hover:text-rose-600 bg-white/40 hover:bg-rose-50/70",
      ghost: "text-cream-300 hover:text-cream-50 hover:bg-rose-100/40 border border-transparent",
      danger: "bg-red-500/15 hover:bg-red-500/25 text-red-600 border border-red-400/30",
    };

    const sizeStyles = {
      sm: "text-xs px-3.5 py-1.5 gap-1.5",
      md: "text-sm px-5 py-2.5 gap-2",
      lg: "text-base px-7 py-3.5 gap-2.5 font-medium",
      icon: "p-2.5 h-10 w-10 aspect-square",
    };

    return (
      <motion.button
        ref={ref}
        whileTap={{ scale: disabled || isLoading ? 1 : 0.97 }}
        whileHover={{ scale: disabled || isLoading ? 1 : 1.01 }}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
        {...props}
      >
        {isLoading ? (
          <span className="inline-flex items-center gap-2">
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Loading...
          </span>
        ) : (
          <>
            {icon && iconPosition === "left" && (
              <span className="inline-flex shrink-0 items-center">{icon}</span>
            )}
            {children}
            {icon && iconPosition === "right" && (
              <span className="inline-flex shrink-0 items-center">{icon}</span>
            )}
          </>
        )}
      </motion.button>
    );
  }
);

Button.displayName = "Button";
