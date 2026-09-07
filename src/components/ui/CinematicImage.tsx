"use client";

import React, { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Image as ImageIcon } from "lucide-react";

export interface CinematicImageProps {
  src?: string;
  alt: string;
  aspectRatio?: "video" | "square" | "portrait" | "wide" | "auto";
  caption?: string;
  className?: string;
  priority?: boolean;
  fill?: boolean;
  sizes?: string;
}

export function CinematicImage({
  src,
  alt,
  aspectRatio = "video",
  caption,
  className,
  priority = false,
  fill = true,
  sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
}: CinematicImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(!src);

  const aspectStyles = {
    video: "aspect-[16/10]",
    square: "aspect-square",
    portrait: "aspect-[3/4]",
    wide: "aspect-[21/9]",
    auto: "",
  };

  return (
    <figure className={cn("group relative overflow-hidden rounded-2xl bg-universe-900", className)}>
      <div className={cn("relative w-full overflow-hidden", aspectStyles[aspectRatio])}>
        {/* Loading shimmer */}
        {isLoading && !hasError && (
          <div className="absolute inset-0 bg-universe-850 animate-pulse z-10 flex items-center justify-center">
            <div className="w-8 h-8 rounded-full border border-gold-400/20 border-t-gold-400 animate-spin" />
          </div>
        )}

        {/* Fallback state */}
        {hasError ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-universe-900 border border-white/[0.05] text-cream-400 p-4 text-center">
            <ImageIcon className="w-8 h-8 mb-2 opacity-40 text-gold-400" />
            <span className="text-xs">{alt || "Visual Memory"}</span>
          </div>
        ) : (
          <Image
            src={src!}
            alt={alt}
            fill={fill}
            sizes={sizes}
            priority={priority}
            onLoad={() => setIsLoading(false)}
            onError={() => {
              setIsLoading(false);
              setHasError(true);
            }}
            className={cn(
              "object-cover transition-transform duration-700 ease-out group-hover:scale-105",
              isLoading ? "scale-105 blur-sm" : "scale-100 blur-0"
            )}
          />
        )}

        {/* Subtle dark gradient overlay for cinematic contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-universe-950/80 via-transparent to-transparent opacity-60 pointer-events-none transition-opacity duration-300 group-hover:opacity-40" />
      </div>

      {caption && (
        <figcaption className="p-3 text-xs text-cream-300 font-sans tracking-wide text-center italic border-t border-white/[0.04]">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
