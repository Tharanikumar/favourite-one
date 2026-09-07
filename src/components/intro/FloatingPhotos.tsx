"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Heart, Sparkles } from "lucide-react";

interface MemoryPhoto {
  url: string;
  caption: string;
  rotation: number;
  delay: number;
}

interface FloatingPhotosProps {
  photos: MemoryPhoto[];
  centerCardText: string;
}

export function FloatingPhotos({ photos, centerCardText }: FloatingPhotosProps) {
  const [imageErrorMap, setImageErrorMap] = useState<Record<number, boolean>>({});

  const fallbackImages = [
    "https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=800&q=80",
  ];

  // Positions on desktop & mobile
  const photoPositions = [
    { top: "8%", left: "6%", mobileTop: "5%", mobileLeft: "4%" },
    { top: "12%", right: "8%", mobileTop: "8%", mobileRight: "5%" },
    { bottom: "10%", left: "10%", mobileBottom: "6%", mobileLeft: "6%" },
    { bottom: "14%", right: "8%", mobileBottom: "10%", mobileRight: "6%" },
  ];

  return (
    <div className="relative w-full h-full max-w-5xl mx-auto flex items-center justify-center p-4">
      {/* Floating Polaroid Photos */}
      {photos.slice(0, 4).map((photo, index) => {
        const pos = photoPositions[index] || photoPositions[0];
        const hasError = imageErrorMap[index];
        const src = hasError ? fallbackImages[index % fallbackImages.length] : photo.url;

        return (
          <motion.div
            key={index}
            initial={{
              opacity: 0,
              scale: 0.8,
              y: 40,
              rotate: photo.rotation * 1.5,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: [0, index % 2 === 0 ? -10 : 10, 0],
              rotate: photo.rotation,
            }}
            transition={{
              opacity: { duration: 0.8, delay: photo.delay },
              scale: { duration: 0.8, delay: photo.delay, ease: [0.16, 1, 0.3, 1] },
              y: {
                duration: 5 + index,
                repeat: Infinity,
                ease: "easeInOut",
                delay: photo.delay,
              },
            }}
            style={{
              position: "absolute",
              top: pos.top,
              left: (pos as { left?: string }).left,
              right: (pos as { right?: string }).right,
              bottom: (pos as { bottom?: string }).bottom,
            }}
            className="z-10 hidden sm:block select-none pointer-events-none"
          >
            <div className="bg-white/95 p-2.5 pb-6 sm:p-3 sm:pb-8 rounded-xl shadow-2xl border border-rose-200/50 backdrop-blur-md w-36 sm:w-44 md:w-52 transform hover:scale-105 transition-transform duration-300">
              <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden bg-rose-50 border border-rose-100">
                <Image
                  src={src}
                  alt={photo.caption}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 140px, 210px"
                  onError={() => {
                    setImageErrorMap((prev) => ({ ...prev, [index]: true }));
                  }}
                />
              </div>
              <p className="mt-2 text-center font-serif italic text-xs text-charcoal-700 truncate px-1">
                {photo.caption}
              </p>
            </div>
          </motion.div>
        );
      })}

      {/* Mobile Miniature Scattered Photos Preview */}
      <div className="sm:hidden absolute inset-0 pointer-events-none flex items-center justify-center opacity-40">
        <div className="relative w-full h-full">
          <div className="absolute top-6 left-4 w-28 aspect-[4/3] bg-white p-2 pb-5 rounded-lg shadow-lg rotate-[-8deg] border border-rose-200/40">
            <div className="relative w-full h-full rounded bg-rose-100/50 overflow-hidden">
              <Image
                src={photos[0]?.url || fallbackImages[0]}
                alt="Memory"
                fill
                className="object-cover"
              />
            </div>
          </div>
          <div className="absolute bottom-10 right-4 w-28 aspect-[4/3] bg-white p-2 pb-5 rounded-lg shadow-lg rotate-[7deg] border border-rose-200/40">
            <div className="relative w-full h-full rounded bg-rose-100/50 overflow-hidden">
              <Image
                src={photos[1]?.url || fallbackImages[1]}
                alt="Memory"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Center Cinematic Romantic Note Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-20 max-w-sm sm:max-w-md w-full mx-auto text-center px-6 py-8 sm:px-10 sm:py-10 rounded-3xl bg-white/90 border border-rose-300/40 shadow-glass backdrop-blur-xl"
      >
        <div className="flex items-center justify-center mb-4">
          <span className="p-2 rounded-full bg-rose-50 border border-rose-200/60 text-rose-500 shadow-sm">
            <Heart className="w-5 h-5 fill-rose-400/20 text-rose-500" />
          </span>
        </div>

        <div className="space-y-3">
          <p className="font-serif text-2xl sm:text-3xl text-charcoal-900 leading-snug font-normal whitespace-pre-line">
            {centerCardText}
          </p>
        </div>

        <div className="mt-5 flex items-center justify-center gap-2 text-rose-400 text-xs font-mono">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Etched in Time</span>
          <Sparkles className="w-3.5 h-3.5" />
        </div>
      </motion.div>
    </div>
  );
}
