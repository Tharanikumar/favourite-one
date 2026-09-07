"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { IntroScene } from "./IntroScene";
import { slideUp, scaleIn } from "./transitions";

interface EmotionalSceneProps {
  heroPhotoUrl: string;
  emotionalText: string[];
}

export function EmotionalScene({
  heroPhotoUrl,
  emotionalText,
}: EmotionalSceneProps) {
  const [imgError, setImgError] = useState(false);
  const fallbackHero = "https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=1600&q=80";

  return (
    <IntroScene className="bg-[#1C161D] text-white">
      {/* Background Hero Image with Slow Cinematic Zoom */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          initial={{ scale: 1, opacity: 0 }}
          animate={{
            scale: 1.12,
            opacity: 0.65,
          }}
          transition={{
            scale: { duration: 8, ease: "easeOut" },
            opacity: { duration: 1.2, ease: "easeOut" },
          }}
          className="relative w-full h-full"
        >
          <Image
            src={imgError ? fallbackHero : heroPhotoUrl}
            alt="Sanctuary sunset"
            fill
            priority
            className="object-cover object-center filter saturate-[1.15] brightness-90"
            onError={() => setImgError(true)}
          />
        </motion.div>

        {/* Ambient sunset gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1C161D] via-[#2A1E29]/50 to-transparent" />
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-[#1C161D]/30 to-[#1C161D]" />
      </div>

      {/* Floating rosy petals */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[1, 2, 3, 4, 5].map((i) => (
          <motion.div
            key={i}
            initial={{
              x: `${15 * i}%`,
              y: "-10%",
              opacity: 0,
              rotate: 0,
            }}
            animate={{
              y: "110%",
              x: `${15 * i + (i % 2 === 0 ? 15 : -15)}%`,
              opacity: [0, 0.4, 0],
              rotate: 360,
            }}
            transition={{
              duration: 4.5 + i,
              repeat: Infinity,
              ease: "linear",
              delay: i * 0.4,
            }}
            className="absolute w-3 h-2 rounded-full bg-rose-300/40 blur-[0.5px]"
          />
        ))}
      </div>

      {/* Center Cinematic Emotional Overlay: "You Me Always" */}
      <div className="relative z-10 max-w-lg mx-auto text-center space-y-2 sm:space-y-4 px-4">
        <div className="flex flex-col items-center justify-center space-y-1 sm:space-y-2">
          {emotionalText.map((line, idx) => (
            <motion.p
              key={idx}
              variants={slideUp}
              initial="initial"
              animate="animate"
              transition={{
                duration: 0.8,
                delay: 0.2 + idx * 0.25,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="font-serif italic text-4xl sm:text-5xl md:text-6xl text-white font-light tracking-wide drop-shadow-lg"
            >
              {line}
            </motion.p>
          ))}
        </div>

        <motion.div
          variants={scaleIn}
          initial="initial"
          animate="animate"
          transition={{ delay: 0.95 }}
          className="pt-2 flex justify-center"
        >
          <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-rose-400 fill-rose-400/30 stroke-[1.5]" />
        </motion.div>
      </div>
    </IntroScene>
  );
}
