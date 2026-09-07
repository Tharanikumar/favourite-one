"use client";

import React from "react";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { IntroScene } from "./IntroScene";
import { slideUp, scaleIn } from "./transitions";

interface TitleSceneProps {
  title: string;
  subtitle: string;
}

export function TitleScene({ title, subtitle }: TitleSceneProps) {
  return (
    <IntroScene className="bg-gradient-to-b from-[#FFF5F8] via-[#FFEBF1] to-[#FCDCE4]">
      {/* Ambient pastel glow */}
      <motion.div
        animate={{
          scale: [1, 1.12, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        className="absolute w-[600px] sm:w-[800px] h-[500px] bg-gradient-radial from-rose-300/30 via-peach-300/20 to-transparent rounded-full blur-3xl pointer-events-none"
      />

      <div className="relative z-10 max-w-3xl mx-auto space-y-6 sm:space-y-8 px-4">
        {/* "WELCOME TO" Eyebrow */}
        <motion.p
          variants={slideUp}
          initial="initial"
          animate="animate"
          transition={{ duration: 0.7 }}
          className="text-xs sm:text-sm uppercase tracking-[0.35em] font-sans font-semibold text-rose-600/90"
        >
          WELCOME TO
        </motion.p>

        {/* Main Title: "Our Little Universe" + Heart */}
        <motion.div
          variants={scaleIn}
          initial="initial"
          animate="animate"
          transition={{ duration: 0.9, delay: 0.2 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3"
        >
          <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl lg:text-8xl text-charcoal-900 font-normal tracking-tight leading-[1.08] text-balance">
            {title}
          </h1>
          <motion.span
            variants={scaleIn}
            initial="initial"
            animate="animate"
            transition={{ delay: 0.4 }}
            className="hidden sm:inline-block"
          >
            <Heart className="w-8 h-8 md:w-10 md:h-10 text-rose-500 fill-rose-500/20 stroke-[1.5]" />
          </motion.span>
        </motion.div>

        {/* Subtitle: "SAME PEOPLE. A THOUSAND BEAUTIFUL MOMENTS." */}
        <motion.p
          variants={slideUp}
          initial="initial"
          animate="animate"
          transition={{ duration: 0.8, delay: 0.45 }}
          className="text-xs sm:text-sm md:text-base uppercase tracking-[0.2em] font-sans font-medium text-charcoal-700 max-w-xl mx-auto"
        >
          {subtitle}
        </motion.p>
      </div>
    </IntroScene>
  );
}
