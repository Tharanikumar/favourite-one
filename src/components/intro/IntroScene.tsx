"use client";

import React from "react";
import { motion } from "framer-motion";

interface IntroSceneProps {
  children: React.ReactNode;
  className?: string;
}

export function IntroScene({ children, className = "" }: IntroSceneProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className={`absolute inset-0 w-full h-full flex flex-col items-center justify-center px-4 sm:px-8 text-center select-none overflow-hidden ${className}`}
    >
      {children}
    </motion.div>
  );
}
