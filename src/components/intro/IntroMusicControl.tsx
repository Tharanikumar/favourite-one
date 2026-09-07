"use client";

import React, { useState, useEffect, useRef } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { motion } from "framer-motion";

interface IntroMusicControlProps {
  audioUrl: string;
}

export function IntroMusicControl({ audioUrl }: IntroMusicControlProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isAudioAvailable, setIsAudioAvailable] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = new Audio(audioUrl);
    audio.loop = true;
    audio.volume = 0.35;
    audioRef.current = audio;

    const savedPreference = typeof window !== "undefined" ? sessionStorage.getItem("olu_intro_audio") : null;
    const shouldPlay = savedPreference !== "muted";

    if (shouldPlay) {
      // Attempt autoplay
      audio
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {
          // Autoplay blocked by browser policy — wait for first user gesture
          const handleFirstInteraction = () => {
            if (audioRef.current && sessionStorage.getItem("olu_intro_audio") !== "muted") {
              audioRef.current
                .play()
                .then(() => setIsPlaying(true))
                .catch(() => setIsAudioAvailable(false));
            }
            window.removeEventListener("click", handleFirstInteraction);
            window.removeEventListener("keydown", handleFirstInteraction);
            window.removeEventListener("touchstart", handleFirstInteraction);
          };

          window.addEventListener("click", handleFirstInteraction, { once: true });
          window.addEventListener("keydown", handleFirstInteraction, { once: true });
          window.addEventListener("touchstart", handleFirstInteraction, { once: true });
        });
    }

    return () => {
      audio.pause();
      audio.src = "";
    };
  }, [audioUrl]);

  const toggleSound = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      sessionStorage.setItem("olu_intro_audio", "muted");
    } else {
      audioRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
          sessionStorage.setItem("olu_intro_audio", "playing");
        })
        .catch(() => setIsAudioAvailable(false));
    }
  };

  if (!isAudioAvailable) return null;

  return (
    <button
      onClick={toggleSound}
      type="button"
      className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 hover:bg-white border border-rose-300/40 text-charcoal-800 backdrop-blur-xl transition-all duration-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-rose-400"
      title={isPlaying ? "Mute Background Soundtrack" : "Play Background Soundtrack"}
      aria-label="Toggle ambient intro soundtrack"
    >
      {isPlaying ? (
        <>
          <Volume2 className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
          <span className="text-[11px] font-sans font-medium text-charcoal-700">Sound</span>
          <div className="flex items-center gap-0.5 h-3">
            {[0.4, 0.9, 0.6, 0.8].map((h, i) => (
              <motion.div
                key={i}
                animate={{ height: ["2px", `${h * 10}px`, "2px"] }}
                transition={{ repeat: Infinity, duration: 0.65, delay: i * 0.12 }}
                className="w-0.5 bg-rose-500 rounded-full"
              />
            ))}
          </div>
        </>
      ) : (
        <>
          <VolumeX className="w-3.5 h-3.5 text-charcoal-400" />
          <span className="text-[11px] font-sans text-charcoal-500">Muted</span>
        </>
      )}
    </button>
  );
}
