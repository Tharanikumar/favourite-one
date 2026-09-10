"use client";

import React, { useEffect, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Memory } from "@/lib/types";
import { Badge } from "@/components/ui/Badge";
import { formatDate } from "@/lib/utils";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Heart,
  Calendar,
  MapPin,
} from "lucide-react";

export interface MemoryLightboxProps {
  isOpen: boolean;
  memory: Memory | null;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  onToggleFavorite: (id: string) => void;
  hasPrev: boolean;
  hasNext: boolean;
}

export function MemoryLightbox({
  isOpen,
  memory,
  onClose,
  onPrev,
  onNext,
  onToggleFavorite,
  hasPrev,
  hasNext,
}: MemoryLightboxProps) {
  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft" && hasPrev) onPrev();
      if (e.key === "ArrowRight" && hasNext) onNext();
    },
    [isOpen, onClose, onPrev, onNext, hasPrev, hasNext]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    if (isOpen) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, handleKeyDown]);

  if (!memory) return null;

  const isVideo = memory.media_type === "video";

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6 overflow-hidden">
          {/* Backdrop Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            className="fixed inset-0 bg-universe-950/95 backdrop-blur-2xl"
          />

          {/* Top Control Bar */}
          <div className="fixed top-4 inset-x-4 sm:inset-x-8 z-50 flex items-center justify-between pointer-events-none">
            <div className="flex items-center gap-2 pointer-events-auto">
              <Badge variant="gold" size="sm">
                {memory.category}
              </Badge>
              {memory.location && (
                <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-universe-900/80 border border-white/[0.1] text-xs text-cream-200 backdrop-blur-md">
                  <MapPin className="w-3.5 h-3.5 text-rose-400" />
                  <span>{memory.location}</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 pointer-events-auto">
              {/* Favorite Button */}
              <button
                onClick={() => onToggleFavorite(memory.id)}
                className={`p-2.5 rounded-full backdrop-blur-xl border transition-all duration-200 ${
                  memory.is_favorite
                    ? "bg-rose-500/20 border-rose-400/50 text-rose-300 shadow-glow-rose"
                    : "bg-universe-900/80 border-white/[0.1] text-cream-300 hover:text-white"
                }`}
                title={memory.is_favorite ? "Favorited" : "Add to favorites"}
                aria-label="Toggle favorite"
              >
                <Heart
                  className={`w-5 h-5 ${
                    memory.is_favorite ? "fill-rose-400 text-rose-400" : ""
                  }`}
                />
              </button>

              {/* Close Button */}
              <button
                onClick={onClose}
                className="p-2.5 rounded-full bg-universe-900/80 hover:bg-universe-800 border border-white/[0.1] text-cream-200 hover:text-white backdrop-blur-xl transition-all"
                title="Close lightbox (Esc)"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Main Media & Caption Container */}
          <motion.div
            key={memory.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 w-full max-w-5xl max-h-[90vh] flex flex-col items-center justify-center pointer-events-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Media Viewer */}
            <div className="relative w-full max-h-[68vh] aspect-[16/10] sm:aspect-[16/9] rounded-2xl overflow-hidden bg-universe-900 border border-white/[0.08] shadow-2xl flex items-center justify-center">
              {isVideo ? (
                <div className="relative w-full h-full flex items-center justify-center bg-black">
                  <video
                    src={memory.media_url}
                    controls
                    autoPlay
                    playsInline
                    className="w-full h-full object-contain"
                  />
                </div>
              ) : (
                memory.media_url && (
                  <Image
                    src={memory.media_url}
                    alt={memory.title}
                    fill
                    priority
                    className="object-contain"
                    sizes="95vw"
                  />
                )
              )}
            </div>

            {/* Bottom Caption & Date Card */}
            <div className="w-full mt-4 p-4 sm:p-5 rounded-2xl bg-universe-900/90 border border-white/[0.08] backdrop-blur-xl shadow-glass flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="space-y-1 max-w-2xl">
                <div className="flex items-center gap-2">
                  <h3 className="font-serif text-lg sm:text-xl text-cream-50 font-normal">
                    {memory.title}
                  </h3>
                  <span className="text-xs text-cream-400 font-mono flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-gold-400" />
                    {formatDate(memory.date)}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-cream-300 font-sans leading-relaxed">
                  {memory.description}
                </p>
              </div>

              {memory.tags && memory.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 shrink-0">
                  {memory.tags.map((tag) => (
                    <Badge key={tag} variant="subtle" size="sm">
                      #{tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </motion.div>

          {/* Left / Right Nav Arrows */}
          {hasPrev && (
            <button
              onClick={onPrev}
              className="fixed left-3 sm:left-6 top-1/2 -translate-y-1/2 z-50 p-3 sm:p-3.5 rounded-full bg-universe-900/80 hover:bg-universe-800 border border-white/[0.1] text-cream-100 backdrop-blur-xl transition-all shadow-glass"
              title="Previous Memory (Left Arrow)"
              aria-label="Previous"
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          )}

          {hasNext && (
            <button
              onClick={onNext}
              className="fixed right-3 sm:right-6 top-1/2 -translate-y-1/2 z-50 p-3 sm:p-3.5 rounded-full bg-universe-900/80 hover:bg-universe-800 border border-white/[0.1] text-cream-100 backdrop-blur-xl transition-all shadow-glass"
              title="Next Memory (Right Arrow)"
              aria-label="Next"
            >
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          )}
        </div>
      )}
    </AnimatePresence>
  );
}
