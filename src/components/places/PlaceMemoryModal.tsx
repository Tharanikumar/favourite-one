"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Place } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  X,
  MapPin,
  Calendar,
  Compass,
  ChevronLeft,
  ChevronRight,
  Quote,
  Copy,
  Check,
  Globe,
} from "lucide-react";

interface PlaceMemoryModalProps {
  place: Place | null;
  isOpen: boolean;
  onClose: () => void;
  onPrev?: () => void;
  onNext?: () => void;
  hasPrev?: boolean;
  hasNext?: boolean;
  onLocateOnMap?: (place: Place) => void;
}

export function PlaceMemoryModal({
  place,
  isOpen,
  onClose,
  onPrev,
  onNext,
  hasPrev = false,
  hasNext = false,
  onLocateOnMap,
}: PlaceMemoryModalProps) {
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);
  const [copiedCoords, setCopiedCoords] = useState(false);

  useEffect(() => {
    setActivePhotoIdx(0);
  }, [place]);

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

  if (!place || !isOpen) return null;

  const allPhotos = place.gallery_urls?.length
    ? place.gallery_urls
    : place.photo_url
    ? [place.photo_url]
    : [];

  const handleCopyCoords = () => {
    const coordsStr = `${place.lat.toFixed(6)}, ${place.lng.toFixed(6)}`;
    navigator.clipboard.writeText(coordsStr);
    setCopiedCoords(true);
    setTimeout(() => setCopiedCoords(false), 2000);
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
          className="fixed inset-0 bg-universe-950/90 backdrop-blur-xl transition-all"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 15 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-3xl rounded-3xl bg-gradient-to-b from-universe-900 via-universe-900/95 to-universe-950 border border-gold-400/30 shadow-2xl overflow-hidden z-10 my-auto"
        >
          {/* Header Ambient Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-32 bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Top Bar Navigation */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.08] bg-universe-950/60 backdrop-blur-sm relative z-10">
            <div className="flex items-center gap-3">
              <Badge variant="gold" size="sm">
                {place.category}
              </Badge>
              {place.city && (
                <span className="text-xs font-mono text-cream-300 flex items-center gap-1">
                  <Globe className="w-3 h-3 text-gold-400" />
                  <span>{place.city}{place.country ? `, ${place.country}` : ""}</span>
                </span>
              )}
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full text-cream-400 hover:text-white hover:bg-white/[0.08] transition-colors"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body Content */}
          <div className="p-6 sm:p-10 space-y-6 max-h-[75vh] overflow-y-auto">
            {/* Gallery Viewer if photos exist */}
            {allPhotos.length > 0 && (
              <div className="space-y-3">
                <div className="relative w-full h-64 sm:h-80 rounded-2xl overflow-hidden border border-white/[0.1] shadow-xl">
                  <Image
                    src={allPhotos[activePhotoIdx]}
                    alt={place.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 800px"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-universe-950/70 via-transparent to-transparent" />
                </div>

                {/* Multiple photo selector pills */}
                {allPhotos.length > 1 && (
                  <div className="flex items-center gap-2 overflow-x-auto pb-1">
                    {allPhotos.map((url, i) => (
                      <button
                        key={i}
                        onClick={() => setActivePhotoIdx(i)}
                        className={`relative w-16 h-12 rounded-lg overflow-hidden shrink-0 border transition-all ${
                          activePhotoIdx === i
                            ? "border-gold-400 scale-105 shadow-glow-sm"
                            : "border-white/[0.1] opacity-60 hover:opacity-100"
                        }`}
                      >
                        <Image
                          src={url}
                          alt={`Thumbnail ${i + 1}`}
                          fill
                          className="object-cover"
                          sizes="64px"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Title & Location Metadata */}
            <div className="space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-cream-400">
                <div className="flex items-center gap-1.5 text-rose-300">
                  <MapPin className="w-4 h-4 text-rose-400" />
                  <span className="font-sans font-medium">{place.location_name}</span>
                </div>

                <div className="flex items-center gap-1 font-mono text-cream-400">
                  <Calendar className="w-3.5 h-3.5 text-gold-400/70" />
                  <span>{formatDate(place.visited_date)}</span>
                </div>
              </div>

              <h2 className="font-serif text-3xl sm:text-4xl text-cream-50 font-normal leading-snug">
                {place.title}
              </h2>
            </div>

            {/* Main Description */}
            <p className="text-sm sm:text-base text-cream-200 font-sans leading-relaxed">
              {place.description}
            </p>

            {/* Deep Personal Memory Note */}
            {place.memory_note && (
              <div className="relative p-6 rounded-2xl bg-white/[0.02] border border-gold-400/20 backdrop-blur-sm space-y-2">
                <Quote className="w-6 h-6 text-gold-400/25 absolute top-4 right-4 pointer-events-none" />
                <div className="text-[11px] font-mono text-gold-300 uppercase tracking-wider">
                  Unforgettable Memory
                </div>
                <p className="font-serif text-base sm:text-lg text-cream-100 italic leading-relaxed">
                  &ldquo;{place.memory_note}&rdquo;
                </p>
              </div>
            )}

            {/* Coordinates HUD Box */}
            <div className="p-4 rounded-xl bg-universe-950/80 border border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-gold-400" />
                <span className="text-cream-400">GPS Coordinates:</span>
                <span className="font-mono text-gold-300 font-semibold">
                  {place.lat.toFixed(6)}° N, {place.lng.toFixed(6)}° E
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyCoords}
                  className="px-3 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-cream-300 hover:text-white border border-white/[0.06] transition-colors flex items-center gap-1.5 text-xs font-mono"
                >
                  {copiedCoords ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-gold-400" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy GPS</span>
                    </>
                  )}
                </button>

                {onLocateOnMap && (
                  <button
                    onClick={() => {
                      onLocateOnMap(place);
                      onClose();
                    }}
                    className="px-3 py-1.5 rounded-lg bg-gold-500/10 hover:bg-gold-500/20 text-gold-300 border border-gold-400/25 transition-colors flex items-center gap-1.5 text-xs font-mono"
                  >
                    <Compass className="w-3.5 h-3.5 text-gold-400" />
                    <span>Focus on Map</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Footer Navigation Bar */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-white/[0.08] bg-universe-950/80">
            <Button
              variant="ghost"
              size="sm"
              icon={<ChevronLeft className="w-4 h-4" />}
              onClick={onPrev}
              disabled={!hasPrev}
              className={!hasPrev ? "opacity-30 cursor-not-allowed" : ""}
            >
              Previous Location
            </Button>

            <span className="text-xs font-mono text-cream-400 hidden sm:block">
              Use &larr; &rarr; arrow keys to browse
            </span>

            <Button
              variant="ghost"
              size="sm"
              icon={<ChevronRight className="w-4 h-4" />}
              onClick={onNext}
              disabled={!hasNext}
              className={!hasNext ? "opacity-30 cursor-not-allowed" : ""}
            >
              Next Location
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
