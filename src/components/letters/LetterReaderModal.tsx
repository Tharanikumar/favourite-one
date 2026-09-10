"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Letter } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { VoiceNotePlayer } from "@/components/ui/VoiceNotePlayer";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Lock,
  Mail,
  MailOpen,
  Maximize2,
  Minimize2,
  ZoomIn,
  ZoomOut,
  Feather,
} from "lucide-react";

interface LetterReaderModalProps {
  letter: Letter | null;
  isOpen: boolean;
  onClose: () => void;
  onPrev?: () => void;
  onNext?: () => void;
  hasPrev?: boolean;
  hasNext?: boolean;
  onToggleRead?: (letterId: string) => void;
}

export function LetterReaderModal({
  letter,
  isOpen,
  onClose,
  onPrev,
  onNext,
  hasPrev = false,
  hasNext = false,
  onToggleRead,
}: LetterReaderModalProps) {
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [fontSize, setFontSize] = useState<"sm" | "base" | "lg" | "xl">("base");

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === "Escape") {
        if (isFocusMode) setIsFocusMode(false);
        else onClose();
      }
      if (e.key === "ArrowLeft" && hasPrev && onPrev) onPrev();
      if (e.key === "ArrowRight" && hasNext && onNext) onNext();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, hasPrev, hasNext, onPrev, onNext, onClose, isFocusMode]);

  if (!letter || !isOpen) return null;

  const isLocked = letter.is_sealed;

  const fontClasses = {
    sm: "text-base sm:text-lg leading-relaxed",
    base: "text-lg sm:text-xl leading-relaxed",
    lg: "text-xl sm:text-2xl leading-loose",
    xl: "text-2xl sm:text-3xl leading-loose",
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
        {/* Backdrop with subtle candle glow */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className={`fixed inset-0 backdrop-blur-xl transition-all duration-500 ${
            isFocusMode
              ? "bg-universe-950/80"
              : "bg-universe-950/50"
          }`}
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className={`relative w-full rounded-3xl shadow-2xl overflow-hidden z-10 my-auto transition-all duration-500 ${
            isFocusMode
              ? "max-w-4xl bg-white border border-rose-400/30"
              : "max-w-3xl bg-gradient-to-b from-white via-universe-900 to-universe-850 border border-rose-400/40"
          }`}
        >
          {/* Paper Texture and Header Ambient Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-40 bg-rose-400/10 rounded-full blur-3xl pointer-events-none" />

          {/* Top Bar / Reader Tools */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-universe-750/50 bg-white/70 backdrop-blur-sm relative z-10">
            {/* Wax Seal & Category */}
            <div className="flex items-center gap-3">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-serif font-bold ${
                  letter.seal_color === "rose"
                    ? "bg-rose-500 text-white shadow-glow-rose"
                    : "bg-gold-500 text-white shadow-glow-gold"
                }`}
              >
                {isLocked ? <Lock className="w-3 h-3" /> : letter.author[0]}
              </div>

              {letter.category && (
                <Badge variant="subtle" size="sm">
                  {letter.category}
                </Badge>
              )}
            </div>

            {/* Reading Controls */}
            <div className="flex items-center gap-2">
              {/* Font Sizer */}
              <div className="hidden sm:flex items-center gap-1 bg-universe-900 rounded-lg p-1 border border-universe-750/60">
                <button
                  onClick={() => {
                    if (fontSize === "xl") setFontSize("lg");
                    else if (fontSize === "lg") setFontSize("base");
                    else if (fontSize === "base") setFontSize("sm");
                  }}
                  className="p-1 text-cream-300 hover:text-rose-600"
                  title="Smaller text"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <span className="text-[10px] font-mono px-1 text-cream-300 font-semibold">
                  {fontSize.toUpperCase()}
                </span>
                <button
                  onClick={() => {
                    if (fontSize === "sm") setFontSize("base");
                    else if (fontSize === "base") setFontSize("lg");
                    else if (fontSize === "lg") setFontSize("xl");
                  }}
                  className="p-1 text-cream-300 hover:text-rose-600"
                  title="Larger text"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Focus Mode Toggle */}
              <button
                onClick={() => setIsFocusMode(!isFocusMode)}
                className={`p-2 rounded-full transition-colors ${
                  isFocusMode
                    ? "bg-rose-500 text-white shadow-glow-rose"
                    : "text-cream-300 hover:text-rose-600 hover:bg-rose-100/50"
                }`}
                title={isFocusMode ? "Exit Focus Mode" : "Distraction-Free Focus Mode"}
              >
                {isFocusMode ? (
                  <Minimize2 className="w-4 h-4" />
                ) : (
                  <Maximize2 className="w-4 h-4" />
                )}
              </button>

              {/* Read / Unread toggle */}
              {onToggleRead && !isLocked && (
                <button
                  onClick={() => onToggleRead(letter.id)}
                  className="p-2 rounded-full text-cream-300 hover:text-rose-600 hover:bg-rose-100/50 transition-colors"
                  title={letter.is_read ? "Mark as unread" : "Mark as read"}
                >
                  {letter.is_read ? (
                    <MailOpen className="w-4 h-4 text-cream-400" />
                  ) : (
                    <Mail className="w-4 h-4 text-rose-500" />
                  )}
                </button>
              )}

              {/* Close */}
              <button
                onClick={onClose}
                className="p-2 rounded-full text-cream-300 hover:text-rose-600 hover:bg-rose-100/50 transition-colors"
                title="Close Letter"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Letter Paper Body */}
          <div className="p-6 sm:p-12 space-y-8 max-h-[75vh] overflow-y-auto">
            {isLocked ? (
              /* Time Locked View */
              <div className="text-center py-12 px-6 space-y-5">
                <div className="w-16 h-16 rounded-full bg-rose-500/10 border border-rose-400/30 flex items-center justify-center mx-auto text-rose-500">
                  <Lock className="w-8 h-8" />
                </div>
                <h3 className="font-serif text-3xl text-cream-50 font-normal">
                  {letter.title}
                </h3>
                <p className="text-sm sm:text-base text-cream-200 font-serif italic max-w-lg mx-auto leading-relaxed">
                  This letter was sealed with digital wax by {letter.author} on{" "}
                  {formatDate(letter.date)}. It is scheduled to be opened on{" "}
                  <span className="text-rose-600 font-semibold">
                    {formatDate(letter.open_date || "")}
                  </span>
                  .
                </p>
                <div className="pt-4">
                  <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-universe-900 border border-universe-750/70 text-xs font-mono text-cream-300">
                    <Sparkles className="w-3.5 h-3.5 text-rose-500" />
                    Patience is the quiet companion of everlasting devotion
                  </span>
                </div>
              </div>
            ) : (
              /* Open Letter Experience */
              <div className="space-y-8">
                {/* Letterhead */}
                <div className="border-b border-universe-750/50 pb-6 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono text-cream-300">
                    <div className="flex items-center gap-2">
                      <Feather className="w-3.5 h-3.5 text-rose-500" />
                      <span>
                        From: <strong className="text-cream-50 font-sans">{letter.author}</strong>
                      </span>
                      <span>&bull;</span>
                      <span>
                        To: <strong className="text-cream-50 font-sans">{letter.recipient}</strong>
                      </span>
                    </div>
                    <span className="text-rose-600 font-medium">{formatDate(letter.date)}</span>
                  </div>

                  <h2 className="font-serif text-3xl sm:text-4xl text-cream-50 font-normal leading-snug pt-2">
                    {letter.title}
                  </h2>
                </div>

                {/* Optional Attached High-Res Photo */}
                {letter.image_url && (
                  <div className="p-3 sm:p-4 rounded-2xl bg-white/70 border border-universe-750/60 shadow-lg space-y-2">
                    <div className="relative w-full h-64 sm:h-80 rounded-xl overflow-hidden">
                      <Image
                        src={letter.image_url}
                        alt={letter.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 800px"
                      />
                    </div>
                    {letter.image_caption && (
                      <p className="text-xs font-serif italic text-cream-300 text-center pt-1">
                        &ldquo;{letter.image_caption}&rdquo;
                      </p>
                    )}
                  </div>
                )}

                {/* Letter Content with Paper/Parchment Luxury Feel */}
                <div
                  className={`font-serif text-cream-100 whitespace-pre-line leading-relaxed italic ${fontClasses[fontSize]}`}
                >
                  {letter.content}
                </div>

                {/* Sign-off Signature */}
                <div className="pt-6 border-t border-universe-750/50 flex items-center justify-between text-xs text-cream-300">
                  <div className="font-serif italic text-base text-cream-100 font-medium">
                    Forever yours, {letter.author}
                  </div>
                  <div className="font-mono text-[11px] text-rose-600/90 font-medium">
                    Preserved in Personal Archive
                  </div>
                </div>

                {/* Optional Voice Note Player */}
                {letter.audio_duration && (
                  <div className="pt-4">
                    <VoiceNotePlayer
                      audioUrl={letter.audio_url}
                      duration={letter.audio_duration}
                      title={`Voice Note: ${letter.title}`}
                      author={letter.author}
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer Navigation Bar (Previous / Next) */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-universe-750/50 bg-white/80">
            <Button
              variant="ghost"
              size="sm"
              icon={<ChevronLeft className="w-4 h-4" />}
              onClick={onPrev}
              disabled={!hasPrev}
              className={!hasPrev ? "opacity-30 cursor-not-allowed" : ""}
            >
              Previous Letter
            </Button>

            <span className="text-xs font-mono text-cream-300 hidden sm:block">
              Use &larr; &rarr; keys to browse
            </span>

            <Button
              variant="ghost"
              size="sm"
              icon={<ChevronRight className="w-4 h-4" />}
              onClick={onNext}
              disabled={!hasNext}
              className={!hasNext ? "opacity-30 cursor-not-allowed" : ""}
            >
              Next Letter
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
