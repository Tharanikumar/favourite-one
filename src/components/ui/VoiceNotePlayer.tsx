"use client";

import React, { useState, useEffect, useRef } from "react";
import { Play, Pause, Volume2, VolumeX, Mic } from "lucide-react";

interface VoiceNotePlayerProps {
  audioUrl?: string;
  duration?: string; // e.g. "0:42"
  title?: string;
  author?: string;
  compact?: boolean;
}

export function VoiceNotePlayer({
  audioUrl,
  duration = "0:45",
  title = "Voice Memo",
  author,
  compact = false,
}: VoiceNotePlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0); // 0 to 100
  const [currentTime, setCurrentTime] = useState("0:00");
  const [isMuted, setIsMuted] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const synthCtxRef = useRef<AudioContext | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Parse total duration into seconds
  const parseDuration = (dur: string): number => {
    const parts = dur.split(":").map(Number);
    if (parts.length === 2) return parts[0] * 60 + parts[1];
    return 45;
  };

  const totalSeconds = parseDuration(duration);

  // Format seconds to mm:ss
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  // Play ambient synthesized sound chords if real URL is mock or fails
  const playAmbientVoiceNoteSynth = () => {
    if (typeof window === "undefined") return;
    try {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioContextClass) return;

      if (!synthCtxRef.current) {
        synthCtxRef.current = new AudioContextClass();
      }
      const ctx = synthCtxRef.current;
      if (ctx.state === "suspended") {
        ctx.resume();
      }

      // Play soft warm chime sequence
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";

      // Warm peaceful notes
      const notes = [220, 277.18, 329.63, 440, 554.37];
      const randomFreq = notes[Math.floor(Math.random() * notes.length)];
      osc.frequency.setValueAtTime(randomFreq, ctx.currentTime);

      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.2);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 1.3);
    } catch {
      // Audio context may be restricted
    }
  };

  const togglePlay = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();

    if (isPlaying) {
      setIsPlaying(false);
      if (audioRef.current) audioRef.current.pause();
      if (intervalRef.current) clearInterval(intervalRef.current);
    } else {
      setIsPlaying(true);
      playAmbientVoiceNoteSynth();

      if (audioRef.current && audioUrl && !audioUrl.startsWith("mock")) {
        audioRef.current.play().catch(() => {
          // Fallback to simulated playback timer
        });
      }

      // Simulated playback ticker
      let currentSec = (progress / 100) * totalSeconds;
      if (currentSec >= totalSeconds) currentSec = 0;

      intervalRef.current = setInterval(() => {
        currentSec += 0.25;
        if (currentSec % 2 < 0.3) {
          playAmbientVoiceNoteSynth();
        }

        if (currentSec >= totalSeconds) {
          setIsPlaying(false);
          setProgress(100);
          setCurrentTime(duration);
          if (intervalRef.current) clearInterval(intervalRef.current);
        } else {
          const pct = (currentSec / totalSeconds) * 100;
          setProgress(pct);
          setCurrentTime(formatTime(currentSec));
        }
      }, 250);
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newPct = Math.max(0, Math.min(100, (clickX / rect.width) * 100));
    setProgress(newPct);
    const newSec = (newPct / 100) * totalSeconds;
    setCurrentTime(formatTime(newSec));
    if (audioRef.current && audioUrl && !audioUrl.startsWith("mock")) {
      audioRef.current.currentTime = newSec;
    }
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (synthCtxRef.current && synthCtxRef.current.state !== "closed") {
        synthCtxRef.current.close().catch(() => {});
      }
    };
  }, []);

  // Pre-generate 28 waveform bars heights
  const waveformHeights = [
    30, 45, 75, 90, 60, 40, 65, 85, 100, 70, 50, 80, 95, 60, 40, 55, 70, 90,
    65, 50, 85, 100, 75, 45, 60, 40, 30, 20,
  ];

  if (compact) {
    return (
      <div
        onClick={togglePlay}
        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gold-500/10 hover:bg-gold-500/20 border border-gold-400/25 transition-all duration-300 cursor-pointer group"
      >
        <div className="w-5 h-5 rounded-full bg-gold-500 text-universe-950 flex items-center justify-center shadow-glow-sm">
          {isPlaying ? (
            <Pause className="w-2.5 h-2.5 fill-current" />
          ) : (
            <Play className="w-2.5 h-2.5 fill-current ml-0.5" />
          )}
        </div>
        <div className="flex items-center gap-1">
          <Mic className="w-3 h-3 text-gold-400" />
          <span className="text-[11px] font-mono text-gold-300">
            {isPlaying ? currentTime : duration}
          </span>
        </div>
        {/* Tiny animated waveform preview */}
        <div className="flex items-center gap-0.5 h-3">
          {[40, 80, 50, 90, 60].map((h, i) => (
            <span
              key={i}
              className={`w-0.5 rounded-full transition-all duration-300 ${
                isPlaying ? "bg-gold-400 animate-pulse" : "bg-gold-400/40"
              }`}
              style={{
                height: isPlaying ? `${Math.max(25, (h * (progress + 20)) % 100)}%` : `${h}%`,
              }}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="p-4 sm:p-5 rounded-2xl bg-universe-950/80 border border-gold-400/25 shadow-lg backdrop-blur-md relative overflow-hidden"
    >
      {/* Background audio glow */}
      <div className="absolute -top-12 -right-12 w-32 h-32 bg-gold-500/5 rounded-full blur-2xl pointer-events-none" />

      {/* Header Info */}
      <div className="flex items-center justify-between mb-3 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-gold-400 animate-pulse" />
          <span className="font-mono text-gold-300 tracking-wider uppercase text-[11px]">
            {title}
          </span>
          {author && (
            <span className="text-cream-400 text-[11px] font-sans">
              • Penned by {author}
            </span>
          )}
        </div>
        <button
          onClick={() => setIsMuted(!isMuted)}
          className="text-cream-400 hover:text-gold-300 transition-colors"
          title={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted ? (
            <VolumeX className="w-3.5 h-3.5" />
          ) : (
            <Volume2 className="w-3.5 h-3.5" />
          )}
        </button>
      </div>

      {/* Main Waveform & Control Bar */}
      <div className="flex items-center gap-3.5">
        {/* Play/Pause Button */}
        <button
          onClick={togglePlay}
          className="w-11 h-11 shrink-0 rounded-full bg-gradient-to-tr from-gold-500 to-gold-400 text-universe-950 flex items-center justify-center shadow-glow-sm hover:scale-105 active:scale-95 transition-all duration-300"
        >
          {isPlaying ? (
            <Pause className="w-4 h-4 fill-current" />
          ) : (
            <Play className="w-4 h-4 fill-current ml-0.5" />
          )}
        </button>

        {/* Interactive Waveform Display */}
        <div
          onClick={handleSeek}
          className="flex-1 h-10 flex items-center justify-between gap-1 cursor-pointer relative px-1 py-1 rounded-lg bg-white/[0.02] hover:bg-white/[0.04] transition-colors"
        >
          {waveformHeights.map((h, i) => {
            const barPct = (i / waveformHeights.length) * 100;
            const isFilled = barPct <= progress;
            return (
              <div
                key={i}
                className="flex-1 flex items-center justify-center h-full"
              >
                <div
                  className={`w-full max-w-[4px] rounded-full transition-all duration-200 ${
                    isFilled
                      ? "bg-gradient-to-t from-gold-500 to-gold-300 shadow-glow-sm"
                      : "bg-white/15"
                  } ${isPlaying && isFilled ? "animate-pulse" : ""}`}
                  style={{
                    height: isPlaying
                      ? `${Math.max(20, (h * (1 + Math.sin(i + progress))) / 1.6)}%`
                      : `${h}%`,
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Time Tracker */}
      <div className="flex items-center justify-between text-[11px] font-mono text-cream-400 mt-2 px-1">
        <span>{currentTime}</span>
        <span className="text-gold-400/80">Voice Memo • {duration}</span>
      </div>
    </div>
  );
}
