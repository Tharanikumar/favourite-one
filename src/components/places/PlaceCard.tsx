"use client";

import React from "react";
import Image from "next/image";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Place } from "@/lib/supabase/types";
import { formatDate } from "@/lib/utils";
import {
  MapPin,
  Calendar,
  Sparkles,
  Compass,
  Star,
  Layers,
} from "lucide-react";

interface PlaceCardProps {
  place: Place;
  isSelected?: boolean;
  onSelect: () => void;
  onLocateOnMap?: () => void;
}

export function PlaceCard({
  place,
  isSelected = false,
  onSelect,
  onLocateOnMap,
}: PlaceCardProps) {
  return (
    <Card
      onClick={onSelect}
      hoverEffect={true}
      className={`h-full p-5 sm:p-6 flex flex-col justify-between border-white/[0.08] cursor-pointer group transition-all duration-300 relative overflow-hidden ${
        isSelected
          ? "border-gold-400/60 bg-gradient-to-b from-gold-500/10 via-universe-900/80 to-universe-950 shadow-glow-sm"
          : "bg-gradient-to-b from-universe-900/70 via-universe-900/50 to-universe-950/80 hover:border-gold-400/40"
      }`}
    >
      {/* Background ambient glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gold-500/5 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

      <div className="space-y-4">
        {/* Photo with zoom effect */}
        {place.photo_url && (
          <div className="relative w-full h-44 sm:h-48 rounded-xl overflow-hidden border border-white/[0.08] group-hover:border-gold-400/30 transition-colors">
            <Image
              src={place.photo_url}
              alt={place.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700 brightness-90 group-hover:brightness-100"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-universe-950/90 via-transparent to-transparent" />

            {/* Top badges on photo */}
            <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
              <Badge variant="gold" size="sm">
                {place.category}
              </Badge>

              {place.is_favorite && (
                <div className="w-6 h-6 rounded-full bg-universe-950/80 backdrop-blur-sm border border-gold-400/40 flex items-center justify-center text-gold-400">
                  <Star className="w-3 h-3 fill-gold-400/40" />
                </div>
              )}
            </div>

            {/* Gallery multi-photo count */}
            {place.gallery_urls && place.gallery_urls.length > 1 && (
              <div className="absolute bottom-2.5 right-2.5 px-2 py-1 rounded-md bg-universe-950/80 backdrop-blur-md border border-white/[0.1] text-[10px] text-cream-300 font-mono flex items-center gap-1">
                <Layers className="w-3 h-3 text-gold-400" />
                <span>{place.gallery_urls.length} photos</span>
              </div>
            )}
          </div>
        )}

        {/* Title & Metadata */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs text-cream-400">
            <div className="flex items-center gap-1.5 text-rose-300 font-sans text-xs">
              <MapPin className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">{place.location_name}</span>
            </div>
            <span className="text-[11px] font-mono flex items-center gap-1">
              <Calendar className="w-3 h-3 text-gold-400/70" />
              {formatDate(place.visited_date)}
            </span>
          </div>

          <h3 className="font-serif text-2xl text-cream-50 font-normal leading-snug group-hover:text-gold-300 transition-colors">
            {place.title}
          </h3>
        </div>

        {/* Description */}
        <p className="text-xs sm:text-sm text-cream-300 font-sans leading-relaxed line-clamp-2">
          {place.description}
        </p>
      </div>

      {/* Footer / Coordinate Tag & Action Buttons */}
      <div className="pt-4 mt-5 border-t border-white/[0.04] flex items-center justify-between text-xs">
        <span className="font-mono text-[10px] text-gold-400/80 bg-white/[0.02] px-2 py-0.5 rounded border border-white/[0.04]">
          {place.lat.toFixed(2)}°, {place.lng.toFixed(2)}°
        </span>

        <div className="flex items-center gap-2">
          {onLocateOnMap && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onLocateOnMap();
              }}
              className="p-1.5 rounded-lg text-cream-400 hover:text-gold-300 hover:bg-white/[0.06] transition-colors"
              title="Locate on map"
            >
              <Compass className="w-3.5 h-3.5" />
            </button>
          )}

          <span className="text-gold-400/90 font-medium group-hover:text-gold-300 flex items-center gap-1 group-hover:translate-x-0.5 transition-all text-xs">
            <span>Read Story</span>
            <Sparkles className="w-3 h-3 text-gold-400 opacity-60 group-hover:opacity-100" />
          </span>
        </div>
      </div>
    </Card>
  );
}
