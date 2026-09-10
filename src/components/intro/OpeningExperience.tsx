"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import { DEFAULT_INTRO_CONFIG, IntroConfig } from "./introConfig";
import { LoadingScene } from "./LoadingScene";
import { HeartScene } from "./HeartScene";
import { MessageScene } from "./MessageScene";
import { MemoryScene } from "./MemoryScene";
import { TitleScene } from "./TitleScene";
import { EmotionalScene } from "./EmotionalScene";
import { EntryScene } from "./EntryScene";
import { IntroMusicControl } from "./IntroMusicControl";
import { FastForward } from "lucide-react";

interface OpeningExperienceProps {
  config?: Partial<IntroConfig>;
  onComplete?: () => void;
  autoSkipIfSeen?: boolean;
}

export function OpeningExperience({
  config: customConfig,
  onComplete,
  autoSkipIfSeen = false,
}: OpeningExperienceProps) {
  const router = useRouter();
  const config: IntroConfig = { ...DEFAULT_INTRO_CONFIG, ...customConfig };

  const [sceneIndex, setSceneIndex] = useState(0);
  const [isExiting, setIsExiting] = useState(false);

  const completeIntro = useCallback(() => {
    setIsExiting(true);
    if (typeof window !== "undefined") {
      sessionStorage.setItem("olu_intro_completed", "true");
    }

    if (onComplete) {
      onComplete();
    } else {
      router.push("/dashboard");
    }
  }, [onComplete, router]);

  // Check auto-skip preference
  useEffect(() => {
    if (autoSkipIfSeen && typeof window !== "undefined") {
      const seen = sessionStorage.getItem("olu_intro_completed");
      if (seen === "true") {
        completeIntro();
      }
    }
  }, [autoSkipIfSeen, completeIntro]);

  // Timed progression through scenes 1 to 7
  useEffect(() => {
    // Scene timings in milliseconds:
    // Scene 0 (Loading): 1200ms
    // Scene 1 (Heart Formation): 1500ms
    // Scene 2 (Personal Message): 1200ms
    // Scene 3 (Memory Glimpse): 1500ms
    // Scene 4 (Title): 1500ms
    // Scene 5 (Emotional Hero): 1800ms
    // Scene 6 (Entry): Holds indefinitely until user clicks Enter
    const sceneDurations = [1200, 1500, 1200, 1500, 1500, 1800];

    if (sceneIndex < sceneDurations.length) {
      const timer = setTimeout(() => {
        setSceneIndex((prev) => prev + 1);
      }, sceneDurations[sceneIndex]);

      return () => clearTimeout(timer);
    }
  }, [sceneIndex]);

  // Keyboard navigation (Escape or 's' to skip, Enter to proceed on final scene)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === "s" || e.key === "S") {
        completeIntro();
      } else if (e.key === "Enter" && sceneIndex === 6) {
        completeIntro();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [completeIntro, sceneIndex]);

  if (isExiting) {
    return (
      <div className="fixed inset-0 z-[100] bg-[#FFF8F3] pointer-events-none transition-opacity duration-500 opacity-0" />
    );
  }

  return (
    <div
      className="fixed inset-0 z-50 w-full h-full overflow-hidden select-none bg-[#FFF8F3]"
      role="region"
      aria-label="Cinematic Opening Experience"
    >
      {/* Top Floating Controls: Ambient Music */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-50">
        <IntroMusicControl audioUrl={config.audioUrl} />
      </div>

      {/* Main Animated Scene Projection */}
      <AnimatePresence mode="wait">
        {sceneIndex === 0 && (
          <LoadingScene
            key="scene-loading"
            title={config.loadingTitle}
            subtitle={config.loadingSubtitle}
          />
        )}

        {sceneIndex === 1 && (
          <HeartScene key="scene-heart" message={config.heartMessage} />
        )}

        {sceneIndex === 2 && (
          <MessageScene
            key="scene-message"
            message={config.personalMessage}
          />
        )}

        {sceneIndex === 3 && (
          <MemoryScene
            key="scene-memory"
            photos={config.memoryPhotos}
            centerCardText={config.memoryCardText}
          />
        )}

        {sceneIndex === 4 && (
          <TitleScene
            key="scene-title"
            title={config.title}
            subtitle={config.subtitle}
          />
        )}

        {sceneIndex === 5 && (
          <EmotionalScene
            key="scene-emotional"
            heroPhotoUrl={config.heroPhotoUrl}
            emotionalText={config.emotionalText}
          />
        )}

        {sceneIndex === 6 && (
          <EntryScene
            key="scene-entry"
            promptText={config.finalPrompt}
            subtitle={config.finalSubtitle}
            signature={config.signature}
            onEnter={completeIntro}
          />
        )}
      </AnimatePresence>

      {/* Bottom Floating Controls: Skip Button */}
      <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 z-50">
        <button
          onClick={completeIntro}
          type="button"
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/80 hover:bg-white border border-[#E6B8B7]/60 text-[#2E2E2E] hover:text-[#C97B94] text-xs font-sans font-medium backdrop-blur-md shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#E6B8B7]"
          title="Skip intro animation (Esc or S)"
          aria-label="Skip intro animation"
        >
          <span>Skip</span>
          <FastForward className="w-3.5 h-3.5 text-[#E6A0B0]" />
        </button>
      </div>

      {/* Progress Indicator Dots (Subtle) */}
      <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-1.5">
        {[0, 1, 2, 3, 4, 5, 6].map((idx) => (
          <button
            key={idx}
            onClick={() => setSceneIndex(idx)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              sceneIndex === idx
                ? "w-6 bg-rose-500 shadow-sm"
                : "w-1.5 bg-rose-300/40 hover:bg-rose-300/70"
            }`}
            aria-label={`Jump to scene ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
