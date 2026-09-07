"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { APP_CONFIG } from "@/lib/constants";
import { AmbientSoundPlayer } from "@/components/ui/AmbientSoundPlayer";
import { SettingsModal } from "@/components/dashboard/SettingsModal";
import {
  Settings,
  Lock,
} from "lucide-react";

export function DashboardHeader() {
  const router = useRouter();
  const [settingsOpen, setSettingsOpen] = useState(false);

  const handleLogout = () => {
    router.push("/");
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-universe-750/50 bg-white/85 backdrop-blur-xl px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Left Brand / Crest */}
          <Link
            href="/dashboard"
            className="flex items-center gap-3 group transition-transform duration-200"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-rose-500 to-rose-400 flex items-center justify-center text-white font-serif font-bold text-xs shadow-glow-sm group-hover:scale-105 transition-transform">
              {APP_CONFIG.couple.monogram.slice(0, 1)}
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-base tracking-wide text-cream-50 font-normal group-hover:text-rose-600 transition-colors">
                {APP_CONFIG.name}
              </span>
              <span className="text-[10px] uppercase tracking-widest text-rose-600/90 font-mono font-medium">
                Private Sanctuary
              </span>
            </div>
          </Link>

          {/* Center / Couple Avatar Indicator */}
          <div className="hidden md:flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/90 border border-universe-750/70 shadow-glass">
            <div className="flex -space-x-2 overflow-hidden">
              <div className="inline-block h-6 w-6 rounded-full ring-2 ring-white bg-rose-500/20 text-rose-700 font-serif text-[11px] font-semibold flex items-center justify-center">
                {APP_CONFIG.couple.partner1[0]}
              </div>
              <div className="inline-block h-6 w-6 rounded-full ring-2 ring-white bg-peach-500/30 text-rose-700 font-serif text-[11px] font-semibold flex items-center justify-center">
                {APP_CONFIG.couple.partner2[0]}
              </div>
            </div>
            <span className="text-xs text-cream-100 font-medium font-sans">
              {APP_CONFIG.couple.partner1} &amp; {APP_CONFIG.couple.partner2}
            </span>
            <span className="h-1.5 w-1.5 rounded-full bg-sage-600 shadow-[0_0_8px_#8FA799]" />
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Ambient Sound Player */}
            <AmbientSoundPlayer variant="minimal" />

            {/* Settings Trigger */}
            <button
              onClick={() => setSettingsOpen(true)}
              className="p-2 rounded-full bg-white/90 border border-universe-750/70 text-cream-300 hover:text-rose-600 hover:border-rose-400/40 transition-all shadow-glass"
              title="Sanctuary Settings"
              aria-label="Settings"
            >
              <Settings className="w-4 h-4" />
            </button>

            {/* Exit Sanctuary / Logout */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/90 border border-universe-750/70 text-cream-300 hover:text-rose-600 hover:border-rose-400/40 text-xs transition-all shadow-glass font-medium"
              title="Lock and Exit Sanctuary"
              aria-label="Exit Sanctuary"
            >
              <Lock className="w-3.5 h-3.5 text-rose-500" />
              <span className="hidden sm:inline">Lock</span>
            </button>
          </div>
        </div>
      </header>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      />
    </>
  );
}
