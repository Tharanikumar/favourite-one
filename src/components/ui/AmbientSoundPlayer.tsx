"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, VolumeX, Music, SkipForward, SkipBack, ListMusic, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SongTrack {
  id: string;
  title: string;
  movie: string;
  tamilTitle: string;
  sources: string[];
}

export const PLAYLIST: SongTrack[] = [
  {
    id: "kannukkul-unnai-vaithen",
    title: "Kannukkul Unnai Vaithen",
    movie: "Pennin Manathai Thottu",
    tamilTitle: "கண்ணுக்குள் உன்னை வைத்தேன்",
    sources: [
      "/audio/kannukkul-unnai-vaithen.mp3",
      "/audio/kannukkul-unnai-vaithen.mp4",
      "/audio/kannukkul-unnai-vaithen.m4a",
      "/audio/song.mp3",
    ],
  },
  {
    id: "ennai-thalaattum-sangeetham",
    title: "Ennai Thalaattum Sangeetham",
    movie: "Jathi Malli",
    tamilTitle: "என்னை தாலாட்டும் சங்கீதம்",
    sources: [
      "/audio/ennai-thalaattum-sangeetham.mp3",
      "/audio/ennai-thalaattum-sangeetham.mp4",
      "/audio/ennai-thalaattum-sangeetham.m4a",
    ],
  },
  {
    id: "munbe-vaa",
    title: "Munbe Vaa Anbe Vaa",
    movie: "Sillunu Oru Kaadhal",
    tamilTitle: "முன்பே வா என் அன்பே வா",
    sources: [
      "/audio/munbe-vaa.mp3",
      "/audio/munbe-vaa.mp4",
      "/audio/munbe-vaa.m4a",
    ],
  },
];

export interface AmbientSoundPlayerProps {
  className?: string;
  variant?: "hero" | "floating" | "minimal" | "dark-hero";
}

export function AmbientSoundPlayer({
  className,
  variant = "hero",
}: AmbientSoundPlayerProps) {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showPlaylistMenu, setShowPlaylistMenu] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const isPlayingRef = useRef(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const currentTrack = PLAYLIST[currentTrackIndex];

  // Close menu on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowPlaylistMenu(false);
      }
    };
    if (showPlaylistMenu) {
      document.addEventListener("mousedown", handleOutsideClick);
    }
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [showPlaylistMenu]);

  // Audio setup and track change
  useEffect(() => {
    let sourceIndex = 0;
    const sources = currentTrack.sources;

    const audio = new Audio(sources[0]);
    audio.volume = 0.45;

    const handleEnded = () => {
      // Auto-advance to next song in playlist
      setCurrentTrackIndex((prev) => (prev + 1) % PLAYLIST.length);
    };

    const handleError = () => {
      if (sourceIndex < sources.length - 1) {
        sourceIndex++;
        audio.src = sources[sourceIndex];
        if (isPlayingRef.current) {
          audio.play().catch(() => {});
        }
      }
    };

    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("error", handleError);
    audioRef.current = audio;

    if (isPlayingRef.current) {
      audio
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    }

    return () => {
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("error", handleError);
      audio.pause();
      audio.src = "";
    };
  }, [currentTrackIndex, currentTrack.sources]);

  const toggleSound = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      isPlayingRef.current = false;
      setIsPlaying(false);
    } else {
      isPlayingRef.current = true;
      audioRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch(() => {
          setIsPlaying(true);
        });
    }
  };

  const playTrack = (index: number, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    isPlayingRef.current = true;
    setCurrentTrackIndex(index);
    setShowPlaylistMenu(false);
  };

  const nextTrack = (e: React.MouseEvent) => {
    e.stopPropagation();
    isPlayingRef.current = true;
    setCurrentTrackIndex((prev) => (prev + 1) % PLAYLIST.length);
  };

  const prevTrack = (e: React.MouseEvent) => {
    e.stopPropagation();
    isPlayingRef.current = true;
    setCurrentTrackIndex((prev) => (prev - 1 + PLAYLIST.length) % PLAYLIST.length);
  };

  // -------------------------------------------------------------
  // Variant: Minimal (Used in Top Header)
  // -------------------------------------------------------------
  if (variant === "minimal") {
    return (
      <div className="relative inline-flex items-center" ref={menuRef}>
        <div
          className={cn(
            "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs transition-all duration-300 shadow-sm border",
            isPlaying
              ? "bg-rose-500/15 text-rose-600 border-rose-400/40"
              : "bg-white/90 text-charcoal-700 hover:text-charcoal-900 border-universe-750/70",
            className
          )}
        >
          {/* Play/Pause Main Trigger */}
          <button
            onClick={toggleSound}
            className="flex items-center gap-1.5 focus:outline-none"
            title={isPlaying ? `Pause ${currentTrack.title}` : `Play ${currentTrack.title}`}
          >
            {isPlaying ? (
              <>
                <Volume2 className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
                <span className="text-[11px] font-medium text-rose-600 max-w-[120px] truncate">
                  {currentTrack.title}
                </span>
                <div className="flex items-center gap-0.5 h-3">
                  {[0.4, 0.9, 0.6, 0.8].map((h, i) => (
                    <motion.div
                      key={i}
                      animate={{ height: ["3px", `${h * 11}px`, "3px"] }}
                      transition={{ repeat: Infinity, duration: 0.7, delay: i * 0.12 }}
                      className="w-0.5 bg-rose-500 rounded-full"
                    />
                  ))}
                </div>
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5 text-charcoal-400" />
                <span className="text-[11px] font-sans max-w-[110px] truncate">
                  {currentTrack.title}
                </span>
              </>
            )}
          </button>

          {/* Quick Skip Next Track */}
          <button
            onClick={nextTrack}
            className="p-1 text-charcoal-400 hover:text-rose-600 transition-colors rounded-full hover:bg-rose-50 focus:outline-none"
            title="Next Song"
            aria-label="Next Song"
          >
            <SkipForward className="w-3 h-3" />
          </button>

          {/* Playlist Dropdown Toggle */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowPlaylistMenu(!showPlaylistMenu);
            }}
            className="p-1 text-charcoal-400 hover:text-rose-600 transition-colors rounded-full hover:bg-rose-50 focus:outline-none"
            title="Tamil Song Playlist"
            aria-label="Toggle Playlist"
          >
            <ListMusic className="w-3 h-3" />
          </button>
        </div>

        {/* Minimal Playlist Menu Popover */}
        <AnimatePresence>
          {showPlaylistMenu && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 6, scale: 0.95 }}
              transition={{ duration: 0.18 }}
              className="absolute right-0 top-full mt-2 w-64 rounded-2xl bg-white/95 backdrop-blur-2xl border border-rose-200/80 shadow-glass p-2 z-50"
            >
              <div className="px-3 py-1.5 border-b border-rose-100/80 mb-1 flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-wider font-semibold text-rose-600">
                  Tamil Soundtrack Playlist
                </span>
                <span className="text-[10px] text-charcoal-400">{PLAYLIST.length} Songs</span>
              </div>
              <div className="space-y-1">
                {PLAYLIST.map((track, idx) => (
                  <button
                    key={track.id}
                    onClick={(e) => playTrack(idx, e)}
                    className={cn(
                      "w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-left text-xs transition-colors",
                      idx === currentTrackIndex
                        ? "bg-rose-500/10 text-rose-700 font-medium"
                        : "hover:bg-rose-50/70 text-charcoal-700"
                    )}
                  >
                    <div className="flex flex-col truncate pr-2">
                      <span className="truncate font-medium">{track.title}</span>
                      <span className="text-[10px] text-rose-500/80 truncate font-sans">
                        {track.tamilTitle} &bull; {track.movie}
                      </span>
                    </div>
                    {idx === currentTrackIndex && (
                      <Check className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // -------------------------------------------------------------
  // Variant: Dark Hero (Used in Twilight / Dark Dashboard Hero Banner)
  // -------------------------------------------------------------
  if (variant === "dark-hero") {
    return (
      <div className={cn("relative inline-flex items-center", className)} ref={menuRef}>
        <div
          className={cn(
            "group relative flex items-center gap-3 px-4 py-3 rounded-2xl sm:rounded-3xl backdrop-blur-2xl transition-all duration-300 shadow-[0_12px_36px_rgba(0,0,0,0.5)] border",
            isPlaying
              ? "bg-[#180A26]/85 text-white border-rose-400/50 shadow-[0_0_25px_rgba(255,107,107,0.25)]"
              : "bg-black/45 text-white/90 hover:text-white hover:bg-black/60 border-white/20 hover:border-rose-400/40"
          )}
        >
          {/* Animated Vinyl / Music Icon */}
          <button
            onClick={toggleSound}
            className="flex items-center gap-3 text-left focus:outline-none"
            title={isPlaying ? `Pause ${currentTrack.title}` : `Play ${currentTrack.title}`}
            aria-label={`Toggle ${currentTrack.title} soundtrack`}
          >
            <div
              className={cn(
                "w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-500 shrink-0 shadow-md",
                isPlaying
                  ? "bg-gradient-to-tr from-rose-500 to-pink-500 text-white shadow-[0_0_15px_rgba(255,107,107,0.5)] animate-spin-slow"
                  : "bg-white/10 text-rose-300 group-hover:bg-white/15"
              )}
            >
              {isPlaying ? (
                <Volume2 className="w-5 h-5 animate-pulse" />
              ) : (
                <Music className="w-5 h-5" />
              )}
            </div>

            <div className="flex flex-col text-left pr-1 min-w-[120px] max-w-[170px] sm:max-w-[210px]">
              <div className="flex items-center gap-1.5">
                <span className="text-xs sm:text-sm font-semibold text-white tracking-wide truncate">
                  {currentTrack.title}
                </span>
              </div>
              <span className="text-[10px] sm:text-[11px] text-rose-300 font-sans font-medium truncate">
                {currentTrack.tamilTitle} &bull; {currentTrack.movie}
              </span>
            </div>
          </button>

          {/* Dynamic Equalizer Visualizer */}
          {isPlaying && (
            <div className="flex items-center gap-0.5 h-4 px-1">
              {[0.3, 0.85, 0.5, 1, 0.65].map((h, i) => (
                <motion.div
                  key={i}
                  animate={{ height: ["2px", `${h * 16}px`, "2px"] }}
                  transition={{ repeat: Infinity, duration: 0.75, delay: i * 0.12 }}
                  className="w-0.5 bg-gradient-to-t from-rose-500 to-pink-300 rounded-full"
                />
              ))}
            </div>
          )}

          {/* Vertical Separator */}
          <div className="h-5 w-px bg-white/20 mx-0.5" />

          {/* Controls: Prev & Next */}
          <div className="flex items-center gap-1">
            <button
              onClick={prevTrack}
              className="p-1.5 text-white/70 hover:text-white transition-colors rounded-full hover:bg-white/10 focus:outline-none"
              title="Previous Song"
              aria-label="Previous Track"
            >
              <SkipBack className="w-4 h-4" />
            </button>

            <button
              onClick={nextTrack}
              className="p-1.5 text-white/70 hover:text-white transition-colors rounded-full hover:bg-white/10 focus:outline-none"
              title="Next Song"
              aria-label="Next Track"
            >
              <SkipForward className="w-4 h-4" />
            </button>

            {/* Playlist Menu Toggle Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowPlaylistMenu(!showPlaylistMenu);
              }}
              className={cn(
                "p-1.5 transition-all rounded-full focus:outline-none",
                showPlaylistMenu
                  ? "bg-rose-500 text-white shadow-glow-rose"
                  : "text-white/70 hover:text-white hover:bg-white/10"
              )}
              title="View Tamil Playlist"
              aria-label="Open Playlist Selection"
            >
              <ListMusic className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Playlist Popover Menu */}
        <AnimatePresence>
          {showPlaylistMenu && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 top-full mt-3 w-80 rounded-3xl bg-[#14091f]/95 backdrop-blur-3xl border border-rose-500/30 shadow-[0_20px_60px_rgba(0,0,0,0.8)] p-3 z-50 text-white"
            >
              <div className="px-3 py-2 border-b border-white/10 flex items-center justify-between mb-2">
                <span className="text-xs uppercase tracking-wider font-mono font-bold text-rose-300 flex items-center gap-1.5">
                  <Music className="w-3.5 h-3.5 text-rose-400" />
                  Romantic Soundtrack
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-mono font-bold">
                  {PLAYLIST.length} Songs
                </span>
              </div>

              <div className="space-y-1.5">
                {PLAYLIST.map((track, idx) => (
                  <button
                    key={track.id}
                    onClick={(e) => playTrack(idx, e)}
                    className={cn(
                      "w-full flex items-center justify-between p-2.5 rounded-2xl text-left transition-all duration-200",
                      idx === currentTrackIndex
                        ? "bg-gradient-to-r from-rose-500/30 to-purple-500/20 border border-rose-400/40 text-white shadow-sm"
                        : "hover:bg-white/[0.08] text-rose-100/80 hover:text-white border border-transparent"
                    )}
                  >
                    <div className="flex items-center gap-3 truncate">
                      <div
                        className={cn(
                          "w-7 h-7 rounded-xl flex items-center justify-center text-xs font-mono shrink-0 shadow-inner",
                          idx === currentTrackIndex
                            ? "bg-rose-500 text-white font-bold shadow-[0_0_10px_rgba(255,107,107,0.5)]"
                            : "bg-white/10 text-rose-200"
                        )}
                      >
                        {idx + 1}
                      </div>
                      <div className="flex flex-col truncate">
                        <span className="text-xs font-semibold text-white truncate">
                          {track.title}
                        </span>
                        <span className="text-[10px] text-rose-300/90 font-sans truncate">
                          {track.tamilTitle} &bull; {track.movie}
                        </span>
                      </div>
                    </div>

                    {idx === currentTrackIndex && isPlaying && (
                      <div className="flex items-center gap-0.5 h-3 shrink-0 pl-1">
                        {[0.4, 0.9, 0.6].map((h, i) => (
                          <motion.div
                            key={i}
                            animate={{ height: ["2px", `${h * 12}px`, "2px"] }}
                            transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.1 }}
                            className="w-0.5 bg-rose-400 rounded-full"
                          />
                        ))}
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // -------------------------------------------------------------
  // Variant: Hero (Landing Page)
  // -------------------------------------------------------------
  return (
    <div className="relative inline-flex items-center" ref={menuRef}>
      <div
        className={cn(
          "group relative inline-flex items-center gap-2 px-3.5 py-2 rounded-full backdrop-blur-xl transition-all duration-300 shadow-sm border",
          isPlaying
            ? "bg-white/95 text-charcoal-900 border-rose-400/50 shadow-glow-coral"
            : "bg-white/85 text-charcoal-700 hover:text-charcoal-900 hover:bg-white border-rose-200/70 hover:border-rose-300",
          className
        )}
      >
        {/* Play/Pause Button */}
        <button
          onClick={toggleSound}
          className="flex items-center gap-2.5 text-left focus:outline-none"
          title={isPlaying ? `Pause ${currentTrack.title}` : `Play ${currentTrack.title}`}
          aria-label={`Toggle ${currentTrack.title} soundtrack`}
        >
          <div
            className={cn(
              "w-7 h-7 rounded-full flex items-center justify-center transition-colors shrink-0",
              isPlaying ? "bg-rose-500/15 text-rose-600" : "bg-rose-50 text-rose-400"
            )}
          >
            {isPlaying ? (
              <Volume2 className="w-4 h-4 animate-pulse" />
            ) : (
              <Music className="w-4 h-4" />
            )}
          </div>

          <div className="flex flex-col text-left pr-1 min-w-[130px] max-w-[190px]">
            <span className="text-xs font-semibold text-charcoal-900 tracking-wide truncate">
              {currentTrack.title}
            </span>
            <span className="text-[10px] text-rose-600/90 font-sans font-medium truncate">
              {currentTrack.tamilTitle} &bull; Tamil
            </span>
          </div>
        </button>

        {/* Dynamic Equalizer Visualizer */}
        {isPlaying && (
          <div className="flex items-center gap-0.5 h-3 px-1">
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

        {/* Separator */}
        <div className="h-4 w-px bg-rose-200/60 mx-0.5" />

        {/* Prev Track Button */}
        <button
          onClick={prevTrack}
          className="p-1.5 text-charcoal-400 hover:text-rose-600 transition-colors rounded-full hover:bg-rose-50 focus:outline-none"
          title="Previous Track"
          aria-label="Previous Track"
        >
          <SkipBack className="w-3.5 h-3.5" />
        </button>

        {/* Next Track Button */}
        <button
          onClick={nextTrack}
          className="p-1.5 text-charcoal-400 hover:text-rose-600 transition-colors rounded-full hover:bg-rose-50 focus:outline-none"
          title="Next Track"
          aria-label="Next Track"
        >
          <SkipForward className="w-3.5 h-3.5" />
        </button>

        {/* Playlist Toggle */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowPlaylistMenu(!showPlaylistMenu);
          }}
          className={cn(
            "p-1.5 transition-colors rounded-full focus:outline-none",
            showPlaylistMenu
              ? "bg-rose-500 text-white shadow-sm"
              : "text-charcoal-400 hover:text-rose-600 hover:bg-rose-50"
          )}
          title="Playlist Selection"
          aria-label="Open Playlist Selection"
        >
          <ListMusic className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Hero Playlist Dropdown Popover */}
      <AnimatePresence>
        {showPlaylistMenu && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            className="absolute left-0 sm:left-auto sm:right-0 top-full mt-2.5 w-72 rounded-2xl bg-white/95 backdrop-blur-2xl border border-rose-200/80 shadow-glass p-2.5 z-50"
          >
            <div className="px-3 py-2 border-b border-rose-100 flex items-center justify-between mb-1.5">
              <span className="text-[11px] uppercase tracking-wider font-semibold text-rose-600">
                Romantic Tamil Soundtrack
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-50 text-rose-600 font-medium">
                {PLAYLIST.length} Songs
              </span>
            </div>

            <div className="space-y-1">
              {PLAYLIST.map((track, idx) => (
                <button
                  key={track.id}
                  onClick={(e) => playTrack(idx, e)}
                  className={cn(
                    "w-full flex items-center justify-between p-2.5 rounded-xl text-left transition-all duration-200",
                    idx === currentTrackIndex
                      ? "bg-gradient-to-r from-rose-500/15 to-peach-500/10 border border-rose-300/40 text-charcoal-900"
                      : "hover:bg-rose-50/60 text-charcoal-700"
                  )}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <div
                      className={cn(
                        "w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-mono shrink-0",
                        idx === currentTrackIndex
                          ? "bg-rose-500 text-white font-bold"
                          : "bg-rose-100/70 text-rose-700"
                      )}
                    >
                      {idx + 1}
                    </div>
                    <div className="flex flex-col truncate">
                      <span className="text-xs font-semibold text-charcoal-900 truncate">
                        {track.title}
                      </span>
                      <span className="text-[10px] text-rose-600 font-sans truncate">
                        {track.tamilTitle} &bull; {track.movie}
                      </span>
                    </div>
                  </div>

                  {idx === currentTrackIndex && isPlaying && (
                    <div className="flex items-center gap-0.5 h-2.5 shrink-0 pl-1">
                      {[0.4, 0.9, 0.6].map((h, i) => (
                        <motion.div
                          key={i}
                          animate={{ height: ["2px", `${h * 10}px`, "2px"] }}
                          transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.1 }}
                          className="w-0.5 bg-rose-500 rounded-full"
                        />
                      ))}
                    </div>
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}


