"use client";

import React from "react";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { IntroScene } from "./IntroScene";
import { ParticleHeart } from "./ParticleHeart";
import { slideUp, scaleIn } from "./transitions";

interface MessageSceneProps {
  message?: string;
}

export function MessageScene({ message = "For You" }: MessageSceneProps) {
  const lines = message.split("\n").length > 1 ? message.split("\n") : message.split(" ");
  const firstLine = lines[0] || "For";
  const restLine = lines.slice(1).join(" ") || "You";

  return (
    <IntroScene className="bg-gradient-to-b from-[#2B1D29] via-[#3B2536] to-[#201723] text-white">
      {/* Dissolving particles background */}
      <ParticleHeart isDissolving={true} />

      {/* Atmospheric center aura */}
      <div className="absolute w-[500px] h-[400px] bg-gradient-radial from-rose-400/20 via-mauve-400/10 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 space-y-4 max-w-sm mx-auto">
        {/* Line by line reveal */}
        <div className="flex flex-col items-center justify-center">
          <motion.span
            variants={slideUp}
            initial="initial"
            animate="animate"
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-serif italic text-3xl sm:text-4xl text-rose-200/90 font-light"
          >
            {firstLine}
          </motion.span>
          
          <motion.div
            variants={slideUp}
            initial="initial"
            animate="animate"
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex items-center gap-3 mt-1"
          >
            <span className="font-serif text-5xl sm:text-6xl md:text-7xl text-white font-normal tracking-wide drop-shadow-lg">
              {restLine}
            </span>
            <motion.span
              variants={scaleIn}
              initial="initial"
              animate="animate"
              transition={{ delay: 0.5 }}
              className="inline-block"
            >
              <Heart className="w-6 h-6 sm:w-8 sm:h-8 stroke-[1.5] text-rose-400 fill-rose-400/20" />
            </motion.span>
          </motion.div>
        </div>
      </div>
    </IntroScene>
  );
}
