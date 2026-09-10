"use client";

import React, { useState } from "react";
import { Memory } from "@/lib/types";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { CinematicImage } from "@/components/ui/CinematicImage";
import { Modal } from "@/components/ui/Modal";
import { formatDate } from "@/lib/utils";
import { MapPin, Calendar } from "lucide-react";

export interface MemoryCardProps {
  memory: Memory;
  onSelect?: (memory: Memory) => void;
}

export function MemoryCard({ memory, onSelect }: MemoryCardProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = () => {
    if (onSelect) {
      onSelect(memory);
    } else {
      setIsOpen(true);
    }
  };

  return (
    <>
      <div onClick={handleClick} className="cursor-pointer group">
        <Card
          className="h-full flex flex-col justify-between p-4 sm:p-5 border-white/[0.06] hover:border-gold-400/30 transition-all duration-300"
          hoverEffect={true}
        >
          <div className="space-y-3.5">
            {/* Image Preview if available */}
            {memory.media_url && (
              <div className="overflow-hidden rounded-xl">
                <CinematicImage
                  src={memory.media_url}
                  alt={memory.title}
                  aspectRatio="video"
                  className="rounded-xl group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            )}

            {/* Header info: Category & Date */}
            <div className="flex items-center justify-between text-xs text-cream-400 pt-1">
              <Badge variant={memory.is_favorite ? "gold" : "subtle"} size="sm">
                {memory.category}
              </Badge>
              <div className="flex items-center gap-1.5 font-sans">
                <Calendar className="w-3 h-3 text-gold-400/70" />
                <span>{formatDate(memory.date)}</span>
              </div>
            </div>

            {/* Title */}
            <h4 className="font-serif text-lg sm:text-xl text-cream-50 group-hover:text-gold-300 transition-colors line-clamp-1 font-normal">
              {memory.title}
            </h4>

            {/* Description preview */}
            <p className="text-xs sm:text-sm text-cream-300 font-sans leading-relaxed line-clamp-2">
              {memory.description}
            </p>
          </div>

          {/* Footer location & tags */}
          <div className="pt-4 mt-3 border-t border-white/[0.04] flex items-center justify-between text-[11px] text-cream-400">
            {memory.location ? (
              <span className="flex items-center gap-1 truncate max-w-[70%]">
                <MapPin className="w-3 h-3 text-rose-400 shrink-0" />
                <span className="truncate">{memory.location}</span>
              </span>
            ) : (
              <span />
            )}

            {memory.tags && memory.tags.length > 0 && (
              <span className="text-gold-400/80 uppercase tracking-widest text-[10px]">
                #{memory.tags[0]}
              </span>
            )}
          </div>
        </Card>
      </div>

      {/* Detail Modal */}
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title={memory.title}
        subtitle={`${formatDate(memory.date)} ${memory.location ? `• ${memory.location}` : ""}`}
        size="lg"
      >
        <div className="space-y-6">
          {memory.media_url && (
            <div className="rounded-2xl overflow-hidden max-h-[420px]">
              <CinematicImage
                src={memory.media_url}
                alt={memory.title}
                aspectRatio="wide"
                className="max-h-[420px]"
              />
            </div>
          )}

          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Badge variant="gold">{memory.category}</Badge>
              {memory.tags.map((tag) => (
                <Badge key={tag} variant="subtle">
                  #{tag}
                </Badge>
              ))}
            </div>

            <p className="text-sm sm:text-base text-cream-100 font-sans leading-relaxed whitespace-pre-line">
              {memory.description}
            </p>
          </div>
        </div>
      </Modal>
    </>
  );
}
