"use client";

import React from "react";
import { motion } from "framer-motion";
import { IntroScene } from "./IntroScene";
import { ParticleHeart } from "./ParticleHeart";
import { slideUp } from "./transitions";

interface HeartSceneProps {
  message: string;
}

export function HeartScene({ message }: HeartSceneProps) {
  return (
    <IntroScene className="bg-gradient-to-b from-[#2A1D28] via-[#352230] to-[#1F1722] text-white">
      {/* Canvas Particle Heart */}
      <ParticleHeart />

      {/* Atmospheric center glow */}
      <div className="absolute w-[400px] sm:w-[500px] h-[400px] bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Text positioned gently below the heart center */}
      <div className="relative z-10 mt-[260px] sm:mt-[320px] max-w-md mx-auto px-4">
        <motion.p
          variants={slideUp}
          initial="initial"
          animate="animate"
          transition={{ delay: 0.6, duration: 0.9 }}
          className="font-serif italic text-lg sm:text-xl md:text-2xl text-rose-100/90 font-light tracking-wide drop-shadow-md"
        >
          &ldquo;{message}&rdquo;
        </motion.p>
      </div>
    </IntroScene>
  );
}
