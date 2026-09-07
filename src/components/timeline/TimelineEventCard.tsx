"use client";

import React from "react";
import Image from "next/image";
import { TimelineEvent } from "@/lib/supabase/types";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { formatDate } from "@/lib/utils";
import {
  MapPin,
  Calendar,
  Sparkles,
  Coffee,
  Navigation,
  Key,
  Compass,
  HeartHandshake,
  Camera,
  ArrowRight,
} from "lucide-react";

export interface TimelineEventCardProps {
  event: TimelineEvent;
  onClick: (event: TimelineEvent) => void;
}

const iconMap: Record<string, React.ReactNode> = {
  Coffee: <Coffee className="w-4 h-4 text-gold-400" />,
  Navigation: <Navigation className="w-4 h-4 text-rose-400" />,
  Sparkles: <Sparkles className="w-4 h-4 text-gold-300" />,
  Key: <Key className="w-4 h-4 text-gold-400" />,
  Compass: <Compass className="w-4 h-4 text-rose-400" />,
  HeartHandshake: <HeartHandshake className="w-4 h-4 text-gold-400" />,
  Camera: <Camera className="w-4 h-4 text-gold-400" />,
};

export function TimelineEventCard({ event, onClick }: TimelineEventCardProps) {
  return (
    <div onClick={() => onClick(event)} className="cursor-pointer group">
      <Card
        className={`h-full p-6 sm:p-7 flex flex-col justify-between border-white/[0.08] hover:border-gold-400/40 transition-all duration-300 ${
          event.is_major ? "bg-universe-900/90 border-gold-400/25 shadow-glow-sm" : "bg-universe-900/60"
        }`}
        hoverEffect={true}
      >
        <div className="space-y-4">
          {/* Header Row: Category Badge & Date */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-universe-800 border border-white/[0.06] text-gold-400 group-hover:scale-105 transition-transform">
                {iconMap[event.icon || "Sparkles"] || <Sparkles className="w-4 h-4 text-gold-400" />}
              </span>
              <Badge variant={event.is_major ? "gold" : "subtle"} size="sm">
                {event.category}
              </Badge>
            </div>

            <span className="text-xs text-cream-400 font-sans flex items-center gap-1.5 font-mono">
              <Calendar className="w-3.5 h-3.5 text-gold-400/70" />
              {formatDate(event.date)}
            </span>
          </div>

          {/* Optional Thumbnail Image */}
          {event.image_url && (
            <div className="relative aspect-[16/9] rounded-xl overflow-hidden shadow-md">
              <Image
                src={event.image_url}
                alt={event.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-universe-950/70 via-transparent to-transparent opacity-60" />
            </div>
          )}

          {/* Title & Short Description */}
          <div className="space-y-2">
            <h3 className="font-serif text-xl sm:text-2xl text-cream-50 group-hover:text-gold-300 transition-colors font-normal leading-snug">
              {event.title}
            </h3>

            <p className="text-xs sm:text-sm text-cream-300 font-sans leading-relaxed line-clamp-3">
              {event.description}
            </p>
          </div>

          {/* Location if present */}
          {event.location && (
            <div className="flex items-center gap-1.5 text-xs text-rose-300">
              <MapPin className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">{event.location}</span>
            </div>
          )}
        </div>

        {/* Card Footer */}
        <div className="pt-4 mt-5 border-t border-white/[0.04] flex items-center justify-between text-xs">
          {event.personal_note ? (
            <span className="text-gold-400/90 italic font-serif text-[11px] line-clamp-1 max-w-[65%]">
              Note from {event.personal_note_author || "us"}
            </span>
          ) : (
            <span className="text-cream-500 text-[11px]">Sanctuary Milestone</span>
          )}

          <span className="text-gold-400 font-medium flex items-center gap-1 group-hover:translate-x-1 transition-transform">
            <span>Read Story</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </Card>
    </div>
  );
}
