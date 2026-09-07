"use client";

import React from "react";
import Image from "next/image";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { LoveReason } from "@/lib/supabase/types";
import { Mic, ImageIcon, Sparkles, Star } from "lucide-react";

interface LoveReasonCardProps {
  reason: LoveReason;
  onClick: () => void;
  index: number;
}

export function LoveReasonCard({
  reason,
  onClick,
  index,
}: LoveReasonCardProps) {
  const displayMessage = reason.message || reason.description;
  const isPartner1 = reason.author.toLowerCase() === "tharani" || reason.author.toLowerCase() === "alex";

  return (
    <Card
      onClick={onClick}
      hoverEffect={true}
      className="h-full p-6 sm:p-7 flex flex-col justify-between border-white/[0.08] hover:border-gold-400/40 bg-gradient-to-b from-universe-900/70 via-universe-900/50 to-universe-950/80 cursor-pointer group transition-all duration-300 relative overflow-hidden"
    >
      {/* Subtle ambient gradient corner glow on hover */}
      <div className="absolute top-0 right-0 w-36 h-36 bg-gold-500/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      {/* Top Header Row */}
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-medium text-gold-400/90 bg-gold-500/10 px-2.5 py-1 rounded-full border border-gold-400/20">
              #{String(reason.number || index + 1).padStart(2, "0")}
            </span>
            <Badge variant="subtle" size="sm">
              {reason.category}
            </Badge>
          </div>

          {reason.is_favorite && (
            <div className="text-gold-400 flex items-center gap-1 text-[11px] font-mono">
              <Star className="w-3 h-3 fill-gold-400/30 text-gold-400" />
              <span>Cherished</span>
            </div>
          )}
        </div>

        {/* Optional Miniature Photo Preview */}
        {reason.photo_url && (
          <div className="relative w-full h-36 rounded-xl overflow-hidden border border-white/[0.08] group-hover:border-gold-400/30 transition-colors">
            <Image
              src={reason.photo_url}
              alt={reason.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700 brightness-90 group-hover:brightness-100"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-universe-950/80 via-transparent to-transparent" />
            <div className="absolute bottom-2 right-2 px-2 py-1 rounded-md bg-universe-950/80 backdrop-blur-sm border border-white/[0.1] text-[10px] text-cream-300 flex items-center gap-1">
              <ImageIcon className="w-3 h-3 text-gold-400" />
              <span>Photo Attached</span>
            </div>
          </div>
        )}

        {/* Card Title in Cormorant Garamond Serif */}
        <h3 className="font-serif text-2xl sm:text-[26px] text-cream-50 font-normal leading-snug group-hover:text-gold-300 transition-colors">
          &ldquo;{reason.title}&rdquo;
        </h3>

        {/* Message preview snippet */}
        <p className="text-xs sm:text-sm text-cream-300 font-sans leading-relaxed line-clamp-3">
          {displayMessage}
        </p>
      </div>

      {/* Footer & Attachment Tags */}
      <div className="pt-4 mt-5 border-t border-white/[0.04] space-y-3">
        {/* Audio badge if attached */}
        {reason.audio_duration && (
          <div className="flex items-center gap-1.5 text-[11px] font-mono text-gold-300/90 bg-gold-500/10 px-2.5 py-1 rounded-full border border-gold-400/20 w-fit">
            <Mic className="w-3 h-3 text-gold-400 animate-pulse" />
            <span>Voice Memo attached • {reason.audio_duration}</span>
          </div>
        )}

        <div className="flex items-center justify-between text-[11px]">
          <span className="flex items-center gap-1.5 text-cream-400">
            <span
              className={`w-2 h-2 rounded-full ${
                isPartner1 ? "bg-gold-400" : "bg-rose-400"
              }`}
            />
            <span>Penned by {reason.author}</span>
          </span>

          <span className="text-gold-400/80 group-hover:text-gold-300 font-sans font-medium flex items-center gap-1 text-xs group-hover:translate-x-0.5 transition-all">
            <span>Read full card</span>
            <Sparkles className="w-3 h-3 text-gold-400 opacity-60 group-hover:opacity-100" />
          </span>
        </div>
      </div>
    </Card>
  );
}
