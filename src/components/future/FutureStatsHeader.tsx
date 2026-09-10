"use client";

import React from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { FutureItem } from "@/lib/types";
import { Sparkles, CheckCircle2, Compass, Target } from "lucide-react";

interface FutureStatsHeaderProps {
  items: FutureItem[];
}

export function FutureStatsHeader({ items }: FutureStatsHeaderProps) {
  const total = items.length;
  const completed = items.filter((i) => i.is_completed || i.status === "Completed").length;
  const inProgress = items.filter((i) => i.status === "In Progress").length;
  const planned = items.filter((i) => i.status === "Planned").length;
  const dreams = items.filter((i) => i.status === "Dream").length;

  const progressPercent = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="space-y-6 max-w-5xl mx-auto mb-10">
      {/* Main Celestial Banner */}
      <Card className="p-6 sm:p-8 bg-gradient-to-r from-white via-universe-900 to-universe-850 border-rose-400/35 backdrop-blur-2xl shadow-glass relative overflow-hidden">
        {/* Glow orb background */}
        <div className="absolute -right-16 -bottom-16 w-64 h-64 bg-rose-400/[0.12] rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-16 -top-16 w-64 h-64 bg-peach-400/[0.15] rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 relative z-10">
          <div className="space-y-2 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/15 border border-rose-400/30 text-rose-700 text-xs font-mono font-medium">
              <Sparkles className="w-3.5 h-3.5" />
              Shared Aspirations Constellation
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl text-cream-50 font-normal">
              Future Together &amp; Unwritten Chapters
            </h2>
            <p className="text-xs sm:text-sm text-cream-300 font-sans max-w-xl">
              From faraway horizons to intimate rituals, every dream here is a promise we are building step by step.
            </p>
          </div>

          {/* Progress Ring & Bar */}
          <div className="w-full lg:w-72 p-4 rounded-2xl bg-white/90 border border-universe-750/70 space-y-3 shadow-sm">
            <div className="flex items-center justify-between text-xs">
              <span className="text-cream-400 font-mono font-medium">Constellation Progress</span>
              <span className="text-rose-600 font-bold font-mono">{progressPercent}%</span>
            </div>

            <div className="h-2.5 w-full rounded-full bg-universe-800 overflow-hidden relative">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-rose-500 via-rose-400 to-peach-500 rounded-full shadow-glow-rose"
              />
            </div>

            <div className="flex justify-between items-center text-[11px] text-cream-400 font-sans pt-1">
              <span>{completed} Fulfilled</span>
              <span>{total - completed} Remaining</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Mini Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <Card className="p-4 bg-white/90 border-universe-750/60 text-center space-y-1 shadow-sm">
          <div className="flex items-center justify-center gap-1.5 text-xs text-cream-400 font-sans">
            <Sparkles className="w-3.5 h-3.5 text-rose-500" />
            <span>Dreams</span>
          </div>
          <div className="font-serif text-2xl text-cream-50 font-normal">{dreams}</div>
          <div className="text-[10px] text-cream-400 uppercase tracking-wider font-mono">Conceived</div>
        </Card>

        <Card className="p-4 bg-white/90 border-universe-750/60 text-center space-y-1 shadow-sm">
          <div className="flex items-center justify-center gap-1.5 text-xs text-cream-400 font-sans">
            <Target className="w-3.5 h-3.5 text-mauve-600" />
            <span>Planned</span>
          </div>
          <div className="font-serif text-2xl text-cream-50 font-normal">{planned}</div>
          <div className="text-[10px] text-cream-400 uppercase tracking-wider font-mono">Scheduled</div>
        </Card>

        <Card className="p-4 bg-white/90 border-universe-750/60 text-center space-y-1 shadow-sm">
          <div className="flex items-center justify-center gap-1.5 text-xs text-cream-400 font-sans">
            <Compass className="w-3.5 h-3.5 text-rose-500" />
            <span>In Progress</span>
          </div>
          <div className="font-serif text-2xl text-cream-50 font-normal">{inProgress}</div>
          <div className="text-[10px] text-cream-400 uppercase tracking-wider font-mono">Active</div>
        </Card>

        <Card className="p-4 bg-white/90 border-universe-750/60 text-center space-y-1 shadow-sm">
          <div className="flex items-center justify-center gap-1.5 text-xs text-cream-400 font-sans">
            <CheckCircle2 className="w-3.5 h-3.5 text-sage-600" />
            <span>Completed</span>
          </div>
          <div className="font-serif text-2xl text-sage-700 font-normal">{completed}</div>
          <div className="text-[10px] text-sage-600 uppercase tracking-wider font-mono">Fulfilled</div>
        </Card>
      </div>
    </div>
  );
}
