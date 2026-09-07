"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Volume2, VolumeX, Music } from "lucide-react";
import { cn } from "@/lib/utils";

export interface AmbientSoundPlayerProps {
  className?: string;
  variant?: "hero" | "floating" | "minimal";
}

export function AmbientSoundPlayer({
  className,
  variant = "hero",
}: AmbientSoundPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Royalty-free serene ambient piano & acoustic guitar stream or gentle soundtrack
    const audio = new Audio("https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=romantic-piano-112199.mp3");
    audio.loop = true;
    audio.volume = 0.35;
    audioRef.current = audio;

    return () => {
      audio.pause();
      audio.src = "";
    };
  }, []);

  const toggleSound = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {
          // If browser autoplay prevents unmuted audio, toggle UI state gracefully
          setIsPlaying(true);
        });
    }
  };

  if (variant === "minimal") {
    return (
      <button
        onClick={toggleSound}
        className={cn(
          "inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs transition-all duration-300",
          isPlaying
            ? "bg-gold-500/15 text-gold-300 border border-gold-400/30 shadow-glow-sm"
            : "bg-white/[0.04] text-cream-300 hover:text-white border border-white/[0.08]",
          className
        )}
        title={isPlaying ? "Mute Ambient Soundtrack" : "Play Ambient Soundtrack"}
      >
        {isPlaying ? (
          <>
            <Volume2 className="w-3.5 h-3.5 text-gold-400 animate-pulse" />
            <span className="text-[11px] font-medium">Sound On</span>
            <div className="flex items-center gap-0.5 h-3">
              {[0.4, 0.9, 0.6, 0.8].map((h, i) => (
                <motion.div
                  key={i}
                  animate={{ height: ["3px", `${h * 12}px`, "3px"] }}
                  transition={{ repeat: Infinity, duration: 0.7, delay: i * 0.12 }}
                  className="w-0.5 bg-gold-400 rounded-full"
                />
              ))}
            </div>
          </>
        ) : (
          <>
            <VolumeX className="w-3.5 h-3.5 text-cream-400" />
            <span className="text-[11px]">Music</span>
          </>
        )}
      </button>
    );
  }

  return (
    <button
      onClick={toggleSound}
      className={cn(
        "group relative inline-flex items-center gap-2.5 px-4 py-2.5 rounded-full backdrop-blur-xl transition-all duration-300 focus:outline-none",
        isPlaying
          ? "bg-universe-900/90 text-gold-300 border border-gold-400/40 shadow-glow-gold"
          : "bg-universe-950/60 text-cream-300 hover:text-cream-50 hover:bg-universe-900/80 border border-white/[0.1] hover:border-white/[0.2]",
        className
      )}
      title={isPlaying ? "Pause Ambient Music" : "Play Ambient Music"}
      aria-label="Toggle ambient relationship music"
    >
      <div
        className={cn(
          "w-6 h-6 rounded-full flex items-center justify-center transition-colors",
          isPlaying ? "bg-gold-400/20 text-gold-300" : "bg-white/[0.05] text-cream-400"
        )}
      >
        {isPlaying ? (
          <Volume2 className="w-3.5 h-3.5" />
        ) : (
          <Music className="w-3.5 h-3.5" />
        )}
      </div>

      <div className="flex flex-col text-left">
        <span className="text-xs font-medium tracking-wide">
          {isPlaying ? "Serenade Playing" : "Ambient Music"}
        </span>
        <span className="text-[10px] text-cream-400/80 font-mono">
          {isPlaying ? "Acoustic Warmth" : "Tap to listen"}
        </span>
      </div>

      {isPlaying && (
        <div className="flex items-center gap-0.5 h-3 ml-1">
          {[0.3, 0.8, 0.5, 1, 0.6].map((h, i) => (
            <motion.div
              key={i}
              animate={{ height: ["2px", `${h * 14}px`, "2px"] }}
              transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.15 }}
              className="w-0.5 bg-gold-400 rounded-full"
            />
          ))}
        </div>
      )}
    </button>
  );
}
