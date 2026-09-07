"use client";

import React, { useState } from "react";
import Image from "next/image";
import { TimelineEvent } from "@/lib/supabase/types";
import { Modal } from "@/components/ui/Modal";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { formatDate } from "@/lib/utils";
import {
  MapPin,
  Calendar,
  Sparkles,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export interface TimelineDetailModalProps {
  event: TimelineEvent | null;
  onClose: () => void;
}

export function TimelineDetailModal({ event, onClose }: TimelineDetailModalProps) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  if (!event) return null;

  const images = event.gallery_urls && event.gallery_urls.length > 0
    ? event.gallery_urls
    : event.image_url
    ? [event.image_url]
    : [];

  const nextImage = () => {
    if (images.length > 1) {
      setActiveImageIndex((prev) => (prev + 1) % images.length);
    }
  };

  const prevImage = () => {
    if (images.length > 1) {
      setActiveImageIndex((prev) => (prev - 1 + images.length) % images.length);
    }
  };

  return (
    <Modal
      isOpen={Boolean(event)}
      onClose={onClose}
      title={event.title}
      subtitle={`${formatDate(event.date)} ${event.location ? `• ${event.location}` : ""}`}
      size="lg"
    >
      <div className="space-y-6">
        {/* Image Gallery Showcase */}
        {images.length > 0 && (
          <div className="relative rounded-2xl overflow-hidden aspect-[16/10] bg-universe-950 border border-white/[0.08] shadow-inner group">
            <Image
              src={images[activeImageIndex]}
              alt={event.title}
              fill
              className="object-cover transition-all duration-500"
            />

            {/* Gallery Navigation Controls */}
            {images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-universe-950/70 hover:bg-universe-900 border border-white/[0.1] text-cream-100 backdrop-blur-md transition-colors"
                  aria-label="Previous photograph"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-universe-950/70 hover:bg-universe-900 border border-white/[0.1] text-cream-100 backdrop-blur-md transition-colors"
                  aria-label="Next photograph"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>

                {/* Thumbnails indicator */}
                <div className="absolute bottom-3 inset-x-0 flex items-center justify-center gap-1.5 z-10">
                  {images.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`h-1.5 rounded-full transition-all ${
                        activeImageIndex === idx
                          ? "w-6 bg-gold-400"
                          : "w-1.5 bg-white/40 hover:bg-white/70"
                      }`}
                      aria-label={`View photo ${idx + 1}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* Metadata Badges */}
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="gold">{event.category}</Badge>
          {event.location && (
            <div className="flex items-center gap-1.5 text-xs text-rose-300 bg-rose-500/10 px-3 py-1 rounded-full border border-rose-400/20">
              <MapPin className="w-3 h-3 shrink-0" />
              <span>{event.location}</span>
            </div>
          )}
          <div className="flex items-center gap-1.5 text-xs text-cream-300 font-mono ml-auto">
            <Calendar className="w-3 h-3 text-gold-400" />
            <span>{formatDate(event.date)}</span>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-3">
          <h4 className="text-xs uppercase tracking-widest text-cream-400 font-mono">
            Memory Narrative
          </h4>
          <p className="text-sm sm:text-base text-cream-100 font-sans leading-relaxed whitespace-pre-line">
            {event.description}
          </p>
        </div>

        {/* Personal Note Callout */}
        {event.personal_note && (
          <div className="p-6 rounded-2xl bg-gradient-to-r from-universe-950/90 via-universe-900/90 to-universe-950/90 border border-gold-400/25 relative overflow-hidden space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-widest text-gold-300 font-mono flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-gold-400" />
                Personal Reflection
              </span>
              {event.personal_note_author && (
                <span className="text-xs text-cream-400 italic">
                  Penned by {event.personal_note_author}
                </span>
              )}
            </div>

            <p className="font-serif text-base sm:text-lg text-cream-100 italic leading-relaxed">
              &ldquo;{event.personal_note}&rdquo;
            </p>
          </div>
        )}

        {/* Modal Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-white/[0.06]">
          <div className="text-[11px] text-cream-500 font-sans">
            Preserved in Our Story Sanctuary
          </div>
          <Button variant="glass" size="sm" onClick={onClose}>
            Close Chronicle
          </Button>
        </div>
      </div>
    </Modal>
  );
}
