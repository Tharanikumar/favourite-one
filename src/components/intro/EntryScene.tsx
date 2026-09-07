"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { IntroScene } from "./IntroScene";
import { slideUp, scaleIn } from "./transitions";

interface EntrySceneProps {
  promptText: string;
  subtitle: string;
  signature: string;
  onEnter: () => void;
}

export function EntryScene({
  promptText,
  subtitle,
  signature,
  onEnter,
}: EntrySceneProps) {
  const [isEntering, setIsEntering] = useState(false);

  const handleEnterClick = () => {
    if (isEntering) return;
    setIsEntering(true);
    // Smooth cinematic delay for exit compression & zoom
    setTimeout(() => {
      onEnter();
    }, 450);
  };

  return (
    <IntroScene className="bg-gradient-to-b from-[#FFF5F8] via-[#FFEAF0] to-[#FCDAE3]">
      {/* Warm sunset lighting & corner ambient blooms */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[800px] h-[500px] bg-gradient-radial from-rose-300/30 via-peach-300/20 to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* Decorative corner ambient glows */}
      <div className="absolute top-8 left-8 w-48 h-48 bg-peach-300/20 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute bottom-8 right-8 w-60 h-60 bg-rose-400/20 rounded-full blur-2xl pointer-events-none" />

      {/* Main Center Container */}
      <motion.div
        animate={
          isEntering
            ? { scale: 1.08, opacity: 0, filter: "blur(8px)" }
            : { scale: 1, opacity: 1, filter: "blur(0px)" }
        }
        transition={{ duration: 0.45, ease: "easeInOut" }}
        className="relative z-10 max-w-xl mx-auto space-y-7 sm:space-y-9 px-4 text-center"
      >
        {/* Top Icon Badge */}
        <motion.div
          variants={scaleIn}
          initial="initial"
          animate="animate"
          className="flex justify-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 border border-rose-300/40 shadow-sm backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-rose-500" />
            <span className="text-[11px] sm:text-xs uppercase tracking-[0.2em] font-sans font-semibold text-charcoal-700">
              Welcome Home
            </span>
          </div>
        </motion.div>

        {/* Prompt Heading */}
        <motion.h2
          variants={slideUp}
          initial="initial"
          animate="animate"
          transition={{ duration: 0.8, delay: 0.15 }}
          className="font-serif text-3xl sm:text-5xl md:text-6xl text-charcoal-900 font-normal leading-[1.12] whitespace-pre-line text-balance tracking-tight"
        >
          {promptText}
        </motion.h2>

        {/* Enter Button */}
        <motion.div
          variants={scaleIn}
          initial="initial"
          animate="animate"
          transition={{ duration: 0.8, delay: 0.3 }}
          className="pt-2 flex justify-center"
        >
          <button
            onClick={handleEnterClick}
            disabled={isEntering}
            type="button"
            className="group relative inline-flex items-center justify-center gap-3 px-8 sm:px-10 py-4 sm:py-4.5 rounded-full bg-rose-500 hover:bg-rose-600 text-white font-sans text-base sm:text-lg font-medium tracking-wide shadow-glow-rose hover:shadow-lg transition-all duration-300 transform active:scale-95 hover:scale-[1.03] focus:outline-none focus:ring-4 focus:ring-rose-400/40"
            aria-label="Enter Our Little Universe dashboard"
          >
            <span>Enter</span>
            <ArrowRight className="w-5 h-5 text-white transition-transform duration-300 group-hover:translate-x-1.5" />
          </button>
        </motion.div>

        {/* Supporting Text & Signature */}
        <motion.div
          variants={slideUp}
          initial="initial"
          animate="animate"
          transition={{ duration: 0.8, delay: 0.45 }}
          className="space-y-3 pt-2"
        >
          <p className="text-[11px] sm:text-xs uppercase tracking-[0.25em] font-sans font-semibold text-rose-700/80">
            {subtitle}
          </p>

          <p className="font-serif italic text-sm sm:text-base text-charcoal-600 font-normal flex items-center justify-center gap-1.5">
            <span>{signature}</span>
          </p>
        </motion.div>
      </motion.div>
    </IntroScene>
  );
}
