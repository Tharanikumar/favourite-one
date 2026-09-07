"use client";

import React, { useEffect, useState } from "react";
import { calculateTimeElapsed } from "@/lib/utils";
import { APP_CONFIG } from "@/lib/constants";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export interface DaysCounterProps {
  startDate?: string;
  showDetailed?: boolean;
  className?: string;
}

export function DaysCounter({
  startDate = APP_CONFIG.couple.relationshipStartDate,
  showDetailed = true,
  className,
}: DaysCounterProps) {
  const [time, setTime] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    totalDays: 0,
  });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const update = () => {
      setTime(calculateTimeElapsed(startDate));
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [startDate]);

  if (!mounted) {
    return (
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 border border-universe-750/70 text-cream-300 text-xs animate-pulse">
        <Sparkles className="w-3.5 h-3.5 text-rose-500" />
        <span>Calculating our journey...</span>
      </div>
    );
  }

  return (
    <div className={className}>
      {showDetailed ? (
        <div className="grid grid-cols-4 gap-2 sm:gap-4 max-w-lg mx-auto">
          {[
            { label: "Days", value: time.days },
            { label: "Hours", value: time.hours },
            { label: "Minutes", value: time.minutes },
            { label: "Seconds", value: time.seconds },
          ].map((item, idx) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1, duration: 0.4 }}
              className="flex flex-col items-center justify-center p-3 sm:p-4 rounded-2xl bg-white/90 border border-universe-750/70 backdrop-blur-md shadow-glass"
            >
              <span className="font-serif text-2xl sm:text-3xl md:text-4xl text-cream-50 font-normal">
                {String(item.value).padStart(2, "0")}
              </span>
              <span className="text-[10px] sm:text-xs uppercase tracking-widest text-rose-600 font-sans mt-1 font-medium">
                {item.label}
              </span>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/90 border border-rose-400/30 backdrop-blur-md text-xs sm:text-sm shadow-glass">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-500 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
          </span>
          <span className="text-cream-200 font-medium">
            <strong className="text-rose-600 font-serif text-base font-semibold">{time.totalDays}</strong> days in our universe
          </span>
        </div>
      )}
    </div>
  );
}
