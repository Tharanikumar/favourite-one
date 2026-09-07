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
          "inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs transition-all duration-300",
          isPlaying
            ? "bg-rose-500/15 text-rose-600 border border-rose-400/40 shadow-sm"
            : "bg-white/80 text-charcoal-700 hover:text-charcoal-900 border border-rose-200/60 shadow-sm",
          className
        )}
        title={isPlaying ? "Pause Poove Mudhal Poove" : "Play Poove Mudhal Poove (Tamil)"}
      >
        {isPlaying ? (
          <>
            <Volume2 className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
            <span className="text-[11px] font-medium text-rose-600">Poove Mudhal Poove</span>
            <div className="flex items-center gap-0.5 h-3">
              {[0.4, 0.9, 0.6, 0.8].map((h, i) => (
                <motion.div
                  key={i}
                  animate={{ height: ["3px", `${h * 12}px`, "3px"] }}
                  transition={{ repeat: Infinity, duration: 0.7, delay: i * 0.12 }}
                  className="w-0.5 bg-rose-500 rounded-full"
                />
              ))}
            </div>
          </>
        ) : (
          <>
            <VolumeX className="w-3.5 h-3.5 text-charcoal-400" />
            <span className="text-[11px] font-sans">Poove Mudhal Poove</span>
          </>
        )}
      </button>
    );
  }

  return (
    <button
      onClick={toggleSound}
      className={cn(
        "group relative inline-flex items-center gap-2.5 px-4 py-2.5 rounded-full backdrop-blur-xl transition-all duration-300 focus:outline-none shadow-sm",
        isPlaying
          ? "bg-white/95 text-charcoal-900 border border-rose-400/50 shadow-glow-coral"
          : "bg-white/85 text-charcoal-700 hover:text-charcoal-900 hover:bg-white border border-rose-200/70 hover:border-rose-300",
        className
      )}
      title={isPlaying ? "Pause Poove Mudhal Poove" : "Play Poove Mudhal Poove (Tamil Romance)"}
      aria-label="Toggle Poove Mudhal Poove soundtrack"
    >
      <div
        className={cn(
          "w-7 h-7 rounded-full flex items-center justify-center transition-colors",
          isPlaying ? "bg-rose-500/15 text-rose-600" : "bg-rose-50 text-rose-400"
        )}
      >
        {isPlaying ? (
          <Volume2 className="w-4 h-4 animate-pulse" />
        ) : (
          <Music className="w-4 h-4" />
        )}
      </div>

      <div className="flex flex-col text-left">
        <span className="text-xs font-semibold text-charcoal-900 tracking-wide">
          {isPlaying ? "Poove Mudhal Poove" : "Poove Mudhal Poove"}
        </span>
        <span className="text-[10px] text-rose-600/90 font-sans font-medium">
          {isPlaying ? "பூவே முதல் பூவே • Tamil" : "Tap to listen • Tamil"}
        </span>
      </div>

      {isPlaying && (
        <div className="flex items-center gap-0.5 h-3 ml-1.5">
          {[0.3, 0.8, 0.5, 1, 0.6].map((h, i) => (
            <motion.div
              key={i}
              animate={{ height: ["2px", `${h * 14}px`, "2px"] }}
              transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.15 }}
              className="w-0.5 bg-rose-500 rounded-full"
            />
          ))}
        </div>
      )}
    </button>
  );
}
