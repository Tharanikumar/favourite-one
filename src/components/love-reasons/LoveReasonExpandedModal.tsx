"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { LoveReason } from "@/lib/types";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { VoiceNotePlayer } from "@/components/ui/VoiceNotePlayer";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Quote,
  Copy,
  Check,
} from "lucide-react";

interface LoveReasonExpandedModalProps {
  reason: LoveReason | null;
  isOpen: boolean;
  onClose: () => void;
  onPrev?: () => void;
  onNext?: () => void;
  hasPrev?: boolean;
  hasNext?: boolean;
  currentIndex?: number;
  totalCount?: number;
}

export function LoveReasonExpandedModal({
  reason,
  isOpen,
  onClose,
  onPrev,
  onNext,
  hasPrev = false,
  hasNext = false,
  currentIndex = 0,
  totalCount = 0,
}: LoveReasonExpandedModalProps) {
  const [copied, setCopied] = React.useState(false);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft" && hasPrev && onPrev) onPrev();
      if (e.key === "ArrowRight" && hasNext && onNext) onNext();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, hasPrev, hasNext, onPrev, onNext, onClose]);

  if (!reason || !isOpen) return null;

  const displayMessage = reason.message || reason.description;
  const isPartner1 = reason.author.toLowerCase() === "tharani" || reason.author.toLowerCase() === "alex";

  const handleCopy = () => {
    const textToCopy = `"${reason.title}"\n\n${displayMessage}\n\n— Penned by ${reason.author} (Our Little Universe)`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-universe-950/85 backdrop-blur-xl transition-all"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 15 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-3xl rounded-3xl bg-gradient-to-b from-universe-900 via-universe-900/95 to-universe-950 border border-gold-400/30 shadow-2xl overflow-hidden z-10 my-auto"
        >
          {/* Ambient header glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-32 bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Top Bar Navigation & Controls */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.08] bg-universe-950/50 backdrop-blur-sm relative z-10">
            {/* Reason Index & Category */}
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono font-medium text-gold-400 bg-gold-500/10 px-3 py-1 rounded-full border border-gold-400/25">
                Reason #{String(reason.number || currentIndex + 1).padStart(2, "0")}
              </span>
              <Badge variant="subtle" size="sm">
                {reason.category}
              </Badge>
              {totalCount > 0 && (
                <span className="hidden sm:inline-block text-[11px] font-mono text-cream-500">
                  ({currentIndex + 1} of {totalCount})
                </span>
              )}
            </div>

            {/* Actions: Copy & Close */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                className="p-2 rounded-full text-cream-400 hover:text-gold-300 hover:bg-white/[0.06] transition-colors"
                title="Copy card message"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-gold-400" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>

              <button
                onClick={onClose}
                className="p-2 rounded-full text-cream-400 hover:text-white hover:bg-white/[0.08] transition-colors"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Body Content */}
          <div className="p-6 sm:p-10 space-y-7 max-h-[75vh] overflow-y-auto">
            {/* Title Section */}
            <div className="space-y-2 text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2 text-gold-400/80 text-xs font-mono uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>What I Adore About You</span>
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl text-cream-50 font-normal leading-tight">
                {reason.title}
              </h2>
            </div>

            {/* Optional Attached High-Res Photo */}
            {reason.photo_url && (
              <div className="relative w-full h-64 sm:h-80 rounded-2xl overflow-hidden border border-white/[0.1] shadow-xl">
                <Image
                  src={reason.photo_url}
                  alt={reason.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 800px"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-universe-950/80 via-transparent to-transparent" />
                {reason.photo_caption && (
                  <div className="absolute bottom-3 left-4 right-4 text-xs font-serif italic text-cream-200 bg-universe-950/70 backdrop-blur-md px-3.5 py-2 rounded-lg border border-white/[0.08]">
                    &ldquo;{reason.photo_caption}&rdquo;
                  </div>
                )}
              </div>
            )}

            {/* Full Personal Message */}
            <div className="relative p-6 sm:p-8 rounded-2xl bg-white/[0.02] border border-white/[0.06] backdrop-blur-sm space-y-4">
              <Quote className="w-8 h-8 text-gold-400/20 absolute top-4 right-4 pointer-events-none" />
              <p className="font-serif text-lg sm:text-xl text-cream-100 font-normal leading-relaxed italic whitespace-pre-line">
                &ldquo;{displayMessage}&rdquo;
              </p>

              <div className="pt-4 mt-4 border-t border-white/[0.06] flex items-center justify-between text-xs text-cream-400">
                <div className="flex items-center gap-2">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      isPartner1 ? "bg-gold-400" : "bg-rose-400"
                    }`}
                  />
                  <span>Penned with infinite devotion by {reason.author}</span>
                </div>
                <span className="text-gold-400/80 font-mono text-[11px]">
                  Forever Written
                </span>
              </div>
            </div>

            {/* Optional Interactive Voice Note Player */}
            {reason.audio_duration && (
              <div className="pt-2">
                <VoiceNotePlayer
                  audioUrl={reason.audio_url}
                  duration={reason.audio_duration}
                  title={`Voice Memo for Reason #${reason.number}`}
                  author={reason.author}
                />
              </div>
            )}
          </div>

          {/* Footer Navigation Bar (Previous / Next) */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-white/[0.08] bg-universe-950/80">
            <Button
              variant="ghost"
              size="sm"
              icon={<ChevronLeft className="w-4 h-4" />}
              onClick={onPrev}
              disabled={!hasPrev}
              className={!hasPrev ? "opacity-30 cursor-not-allowed" : ""}
            >
              Previous Reason
            </Button>

            <div className="text-xs font-mono text-cream-400 hidden sm:block">
              Use &larr; &rarr; arrow keys to browse
            </div>

            <Button
              variant="ghost"
              size="sm"
              icon={<ChevronRight className="w-4 h-4" />}
              onClick={onNext}
              disabled={!hasNext}
              className={!hasNext ? "opacity-30 cursor-not-allowed" : ""}
            >
              Next Reason
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
