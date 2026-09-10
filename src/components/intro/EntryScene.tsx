"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Flame, Sparkles } from "lucide-react";
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
    // Smooth cinematic delay for exit compression, zoom, and fade
    setTimeout(() => {
      onEnter();
    }, 550);
  };

  return (
    <IntroScene className="bg-gradient-to-b from-[#FFF8F3] via-[#FDE7EA] to-[#FFE0D6]">
      {/* 1. Warm Sunset Light & Radial Aura */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] sm:w-[850px] h-[550px] bg-gradient-radial from-[#FFE0D6]/40 via-[#FDE7EA]/30 to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* 2. Delicate Floral Sprigs Around Edges */}
      <div className="absolute top-6 left-6 text-2xl sm:text-3xl opacity-60 pointer-events-none select-none drop-shadow-sm">
        🌸 🌿
      </div>
      <div className="absolute bottom-6 left-6 text-2xl sm:text-3xl opacity-50 pointer-events-none select-none drop-shadow-sm">
        🌿 🌸
      </div>
      <div className="absolute bottom-6 right-8 text-2xl sm:text-3xl opacity-60 pointer-events-none select-none drop-shadow-sm">
        🌸 ✨
      </div>

      {/* 3. Small Warm Lantern Glowing on One Side (Top Right) */}
      <div className="absolute top-6 right-6 sm:top-10 sm:right-12 z-20 pointer-events-none flex flex-col items-center">
        {/* Fine chain */}
        <div className="w-[1px] h-8 sm:h-12 bg-amber-700/40" />
        {/* Lantern body with flame */}
        <div className="relative w-8 h-12 rounded-lg bg-gradient-to-b from-amber-900/80 to-amber-950/90 border border-amber-400/60 shadow-[0_0_25px_rgba(251,191,36,0.6)] flex items-center justify-center">
          <div className="w-3.5 h-5 rounded-full bg-amber-300 shadow-[0_0_15px_#fbbf24] animate-pulse" />
          <Flame className="w-3 h-3 text-amber-100 absolute fill-amber-200" />
        </div>
      </div>

      {/* 4. Main Center Content Container */}
      <motion.div
        animate={
          isEntering
            ? { scale: 1.08, opacity: 0, filter: "blur(10px)" }
            : { scale: 1, opacity: 1, filter: "blur(0px)" }
        }
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 max-w-xl mx-auto space-y-6 sm:space-y-8 px-4 text-center"
      >
        {/* Minimal Pill Badge */}
        <motion.div
          variants={scaleIn}
          initial="initial"
          animate="animate"
          className="flex justify-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 border border-[#E6B8B7]/60 shadow-sm backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-[#E6A0B0]" />
            <span className="text-[11px] sm:text-xs uppercase tracking-[0.2em] font-sans font-semibold text-[#2E2E2E]/80">
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
          className="font-serif text-3xl sm:text-5xl md:text-6xl text-[#2E2E2E] font-normal leading-[1.12] whitespace-pre-line text-balance tracking-tight"
        >
          {promptText}
        </motion.h2>

        {/* Enter Button (Rounded pill, dusty-rose, white text, minimal arrow) */}
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
            className="group relative inline-flex items-center justify-center gap-3 px-9 sm:px-12 py-3.5 sm:py-4 rounded-full bg-gradient-to-r from-[#E6A0B0] via-[#D9829B] to-[#C97B94] hover:from-[#DF94A5] hover:to-[#C06F87] text-white font-sans text-base sm:text-lg font-medium tracking-wide shadow-[0_8px_25px_rgba(217,130,155,0.35)] hover:shadow-[0_12px_32px_rgba(217,130,155,0.5)] transition-all duration-300 transform active:scale-95 hover:scale-[1.03] focus:outline-none focus:ring-4 focus:ring-[#E6B8B7]/50"
            aria-label="Enter Our Little Universe dashboard"
          >
            <span>Enter</span>
            <ArrowRight className="w-4 h-4 text-white transition-transform duration-300 group-hover:translate-x-1.5" />
          </button>
        </motion.div>

        {/* Supporting Text & Handwritten Note */}
        <motion.div
          variants={slideUp}
          initial="initial"
          animate="animate"
          transition={{ duration: 0.8, delay: 0.45 }}
          className="space-y-3 pt-2"
        >
          <p className="text-[11px] sm:text-xs uppercase tracking-[0.25em] font-sans font-semibold text-[#C97B94]/90">
            {subtitle}
          </p>

          <p className="font-serif italic text-sm sm:text-base text-[#2E2E2E]/70 font-normal flex items-center justify-center gap-1.5">
            <span>{signature}</span>
          </p>
        </motion.div>
      </motion.div>
    </IntroScene>
  );
}

