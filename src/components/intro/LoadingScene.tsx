"use client";

import React from "react";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { IntroScene } from "./IntroScene";
import { slideUp, scaleIn } from "./transitions";

interface LoadingSceneProps {
  title: string;
  subtitle: string;
}

export function LoadingScene({ title, subtitle }: LoadingSceneProps) {
  return (
    <IntroScene className="bg-gradient-to-b from-[#FFFDF9] via-[#FFF5F7] to-[#FDE8E9]">
      {/* Gentle ambient light aura */}
      <div className="absolute w-[450px] sm:w-[600px] h-[350px] bg-gradient-radial from-rose-300/20 via-peach-200/15 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 space-y-6 sm:space-y-8 max-w-lg mx-auto">
        {/* Top title: "Just a moment..." */}
        <motion.h2
          variants={slideUp}
          initial="initial"
          animate="animate"
          className="font-serif text-3xl sm:text-4xl md:text-5xl text-charcoal-900 font-normal tracking-wide"
        >
          {title}
        </motion.h2>

        {/* Minimal outlined heart with soft breathing animation */}
        <motion.div
          variants={scaleIn}
          initial="initial"
          animate="animate"
          className="flex justify-center my-2"
        >
          <motion.div
            animate={{
              scale: [1, 1.15, 1],
              opacity: [0.75, 1, 0.75],
            }}
            transition={{
              duration: 2.2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="p-3.5 rounded-full bg-white/80 border border-rose-300/50 shadow-sm backdrop-blur-md"
          >
            <Heart className="w-6 h-6 sm:w-7 sm:h-7 stroke-[1.5] text-rose-500 fill-rose-400/10" />
          </motion.div>
        </motion.div>

        {/* Subtitle: "SOMETHING SPECIAL IS LOADING FOR YOU" */}
        <motion.p
          variants={slideUp}
          initial="initial"
          animate="animate"
          transition={{ delay: 0.2 }}
          className="text-[11px] sm:text-xs uppercase tracking-[0.25em] font-sans font-semibold text-rose-700/80"
        >
          {subtitle}
        </motion.p>
      </div>
    </IntroScene>
  );
}
