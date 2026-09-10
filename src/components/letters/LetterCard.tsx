"use client";

import React from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Letter } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import {
  Lock,
  Mail,
  MailOpen,
  Mic,
  ImageIcon,
  Calendar,
} from "lucide-react";

interface LetterCardProps {
  letter: Letter;
  onClick: () => void;
}

export function LetterCard({ letter, onClick }: LetterCardProps) {
  const isLocked = letter.is_sealed;

  // Category badge color
  const getCategoryBadgeVariant = (cat?: string) => {
    switch (cat) {
      case "Open when you miss me":
      case "Open when you're sad":
        return "rose";
      case "Open when you're angry":
        return "subtle";
      case "Open when you need motivation":
      case "Anniversary letter":
      case "Birthday letter":
        return "gold";
      case "Future letter":
        return "outline";
      default:
        return "subtle";
    }
  };

  return (
    <Card
      onClick={onClick}
      hoverEffect={!isLocked}
      className={`h-full p-6 sm:p-7 flex flex-col justify-between border-universe-750/70 relative overflow-hidden group cursor-pointer transition-all duration-300 ${
        isLocked
          ? "bg-universe-900/60 opacity-80 hover:border-rose-400/40 border-dashed"
          : "bg-white/90 hover:border-rose-400/60 shadow-glass"
      }`}
    >
      {/* Background ambient glow on hover */}
      {!isLocked && (
        <div className="absolute top-0 right-0 w-32 h-32 bg-rose-400/10 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      )}

      {/* Top Header with Seal & Status */}
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-3.5 border-b border-universe-750/50">
          {/* Wax Seal / Initial */}
          <div className="flex items-center gap-3">
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-serif font-bold shadow-md transition-transform group-hover:scale-105 ${
                letter.seal_color === "rose"
                  ? "bg-gradient-to-tr from-rose-600 to-rose-400 text-white shadow-glow-rose"
                  : letter.seal_color === "charcoal"
                  ? "bg-universe-800 text-cream-200 border border-universe-750"
                  : "bg-gradient-to-tr from-rose-500 to-rose-400 text-white shadow-glow-rose"
              }`}
            >
              {isLocked ? (
                <Lock className="w-3.5 h-3.5" />
              ) : (
                letter.author[0]
              )}
            </div>

            <div>
              <div className="text-xs font-medium text-cream-100 flex items-center gap-1.5">
                <span>{letter.author}</span>
                <span className="text-cream-400">&rarr;</span>
                <span>{letter.recipient}</span>
              </div>
              <div className="text-[11px] text-cream-300 font-sans flex items-center gap-1">
                <Calendar className="w-3 h-3 text-cream-400" />
                <span>{formatDate(letter.date)}</span>
              </div>
            </div>
          </div>

          {/* Read Status Pill */}
          <div className="flex items-center gap-1.5">
            {isLocked ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono text-rose-700 bg-rose-400/15 border border-rose-400/30 font-medium">
                <Lock className="w-2.5 h-2.5" />
                Time Locked
              </span>
            ) : letter.is_read ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono text-cream-400 bg-universe-900 border border-universe-750/70">
                <MailOpen className="w-2.5 h-2.5 text-cream-400" />
                Read
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono text-rose-700 bg-rose-500/15 border border-rose-400/40 font-semibold animate-pulse">
                <Mail className="w-2.5 h-2.5 text-rose-500" />
                Unread
              </span>
            )}
          </div>
        </div>

        {/* Special Category Tag */}
        {letter.category && (
          <div>
            <Badge variant={getCategoryBadgeVariant(letter.category)} size="sm">
              {letter.category}
            </Badge>
          </div>
        )}

        {/* Title */}
        <h3 className="font-serif text-xl sm:text-2xl text-cream-50 font-normal leading-snug group-hover:text-rose-600 transition-colors">
          {letter.title}
        </h3>

        {/* Excerpt / Locked Notice */}
        <p className="text-xs sm:text-sm text-cream-300 font-serif italic leading-relaxed line-clamp-3">
          {isLocked
            ? `Sealed in digital wax until ${formatDate(
                letter.open_date || letter.date
              )}. This letter is time-locked for your designated future anniversary.`
            : `&ldquo;${letter.content.slice(0, 140)}...&rdquo;`}
        </p>
      </div>

      {/* Footer / Attachments */}
      <div className="pt-4 mt-5 border-t border-universe-750/50 space-y-2.5">
        {/* Attachment badges */}
        <div className="flex items-center gap-2">
          {letter.audio_duration && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-mono text-rose-700 bg-rose-400/15 border border-rose-400/30">
              <Mic className="w-2.5 h-2.5 text-rose-500" />
              <span>Voice Note ({letter.audio_duration})</span>
            </span>
          )}
          {letter.image_url && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-mono text-cream-300 bg-universe-900 border border-universe-750/60">
              <ImageIcon className="w-2.5 h-2.5 text-rose-500" />
              <span>Photo Attached</span>
            </span>
          )}
        </div>

        {/* Read action */}
        <div className="flex items-center justify-between text-xs pt-1">
          {isLocked ? (
            <span className="text-cream-400 flex items-center gap-1.5 text-[11px]">
              <Lock className="w-3 h-3 text-rose-500" />
              Opens {formatDate(letter.open_date || "")}
            </span>
          ) : (
            <span className="text-rose-600 font-medium flex items-center gap-1.5 group-hover:text-rose-700 group-hover:translate-x-0.5 transition-all">
              <Mail className="w-3.5 h-3.5" />
              Open &amp; Read Letter
            </span>
          )}

          <span className="text-cream-400 font-mono text-[10px]">
            Archived Letter
          </span>
        </div>
      </div>
    </Card>
  );
}
