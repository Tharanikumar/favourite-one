"use client";

import React from "react";
import { IntroScene } from "./IntroScene";
import { FloatingPhotos } from "./FloatingPhotos";

interface MemorySceneProps {
  photos: {
    url: string;
    caption: string;
    rotation: number;
    delay: number;
  }[];
  centerCardText: string;
}

export function MemoryScene({ photos, centerCardText }: MemorySceneProps) {
  return (
    <IntroScene className="bg-gradient-to-b from-[#FFF5F7] via-[#FFF0F4] to-[#FCE6EB]">
      {/* Soft warm sunset aura */}
      <div className="absolute inset-0 bg-[radial-gradient(#E093A215_1.5px,transparent_1.5px)] [background-size:24px_24px] pointer-events-none opacity-60" />
      <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-gradient-radial from-rose-300/20 via-peach-300/15 to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* Floating Polaroid Cards & Center Message */}
      <FloatingPhotos photos={photos} centerCardText={centerCardText} />
    </IntroScene>
  );
}
