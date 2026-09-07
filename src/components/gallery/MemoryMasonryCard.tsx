"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Memory } from "@/lib/supabase/types";
import { Badge } from "@/components/ui/Badge";
import { formatDate } from "@/lib/utils";
import {
  MapPin,
  Calendar,
  Play,
  Heart,
} from "lucide-react";

export interface MemoryMasonryCardProps {
  memory: Memory;
  onClick: (memory: Memory) => void;
  index: number;
}

export function MemoryMasonryCard({
  memory,
  onClick,
  index,
}: MemoryMasonryCardProps) {
  const isVideo = memory.media_type === "video";

  // Cycle through elegant aspect ratios for organic masonry rhythm
  const aspectRatios = [
    "aspect-[4/5]",
    "aspect-[16/10]",
    "aspect-square",
    "aspect-[4/3]",
    "aspect-[3/4]",
    "aspect-[16/9]",
  ];
  const aspectClass = aspectRatios[index % aspectRatios.length];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-20px" }}
      transition={{ duration: 0.5, delay: (index % 6) * 0.06 }}
      onClick={() => onClick(memory)}
      className="group cursor-pointer mb-5 break-inside-avoid relative rounded-2xl overflow-hidden bg-universe-900/80 border border-white/[0.08] hover:border-gold-400/40 transition-all duration-300 shadow-glass"
    >
      {/* Media Image Container */}
      <div className={`relative w-full ${aspectClass} overflow-hidden`}>
        {memory.media_url ? (
          <Image
            src={memory.media_url}
            alt={memory.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          />
        ) : (
          <div className="absolute inset-0 bg-universe-850 flex items-center justify-center text-cream-400 text-xs">
            No Media
          </div>
        )}

        {/* Dark Vignette Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-universe-950 via-universe-950/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-300" />

        {/* Top Badges (Category & Video/Favorite) */}
        <div className="absolute top-3 inset-x-3 flex items-center justify-between z-10">
          <Badge variant="gold" size="sm">
            {memory.category}
          </Badge>

          <div className="flex items-center gap-1.5">
            {isVideo && (
              <span className="p-1.5 rounded-full bg-universe-950/70 backdrop-blur-md border border-white/[0.1] text-rose-300 shadow-sm">
                <Play className="w-3 h-3 fill-rose-300" />
              </span>
            )}

            {memory.is_favorite && (
              <span className="p-1.5 rounded-full bg-universe-950/70 backdrop-blur-md border border-rose-400/30 text-rose-400 shadow-glow-rose">
                <Heart className="w-3 h-3 fill-rose-400" />
              </span>
            )}
          </div>
        </div>

        {/* Bottom Title & Details Overlay */}
        <div className="absolute bottom-3 inset-x-3 z-10 space-y-1.5">
          <div className="flex items-center justify-between text-[11px] text-cream-300 font-sans">
            <span className="flex items-center gap-1 font-mono">
              <Calendar className="w-3 h-3 text-gold-400/80" />
              {formatDate(memory.date)}
            </span>

            {memory.location && (
              <span className="flex items-center gap-1 text-rose-300 truncate max-w-[50%]">
                <MapPin className="w-3 h-3 shrink-0" />
                <span className="truncate">{memory.location}</span>
              </span>
            )}
          </div>

          <h3 className="font-serif text-base sm:text-lg text-cream-50 group-hover:text-gold-300 transition-colors font-normal line-clamp-1 leading-snug">
            {memory.title}
          </h3>

          <p className="text-xs text-cream-300 font-sans line-clamp-2 leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden sm:block">
            {memory.description}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
