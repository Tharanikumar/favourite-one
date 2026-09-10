"use client";

import React, { useEffect, useState } from "react";
import { calculateTimeElapsed } from "@/lib/utils";
import { APP_CONFIG } from "@/lib/constants";
import { motion } from "framer-motion";
import { Heart, Clock, Send, Star, Sparkles } from "lucide-react";

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

  const statCards = [
    {
      label: "DAYS",
      value: time.days,
      icon: <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />,
      iconBg: "bg-rose-500/15 text-rose-600",
      cardBg: "bg-gradient-to-b from-[#FFF2F5]/90 to-[#FFE6EC]/90 border-rose-200/80 shadow-sm",
      textColor: "text-[#1F1D24]",
      labelColor: "text-rose-600/90",
    },
    {
      label: "HOURS",
      value: time.hours,
      icon: <Clock className="w-4 h-4 text-amber-600" />,
      iconBg: "bg-amber-500/15 text-amber-600",
      cardBg: "bg-gradient-to-b from-[#FFF7ED]/90 to-[#FFEAD4]/90 border-amber-200/80 shadow-sm",
      textColor: "text-[#1F1D24]",
      labelColor: "text-amber-700/90",
    },
    {
      label: "MINUTES",
      value: time.minutes,
      icon: <Send className="w-4 h-4 text-purple-600 fill-purple-600/20" />,
      iconBg: "bg-purple-500/15 text-purple-600",
      cardBg: "bg-gradient-to-b from-[#F7F2FF]/90 to-[#ECE0FE]/90 border-purple-200/80 shadow-sm",
      textColor: "text-[#1F1D24]",
      labelColor: "text-purple-700/90",
    },
    {
      label: "SECONDS",
      value: time.seconds,
      icon: <Star className="w-4 h-4 text-emerald-600 fill-emerald-600" />,
      iconBg: "bg-emerald-500/15 text-emerald-600",
      cardBg: "bg-gradient-to-b from-[#F0FDF4]/90 to-[#DCFCE7]/90 border-emerald-200/80 shadow-sm",
      textColor: "text-[#1F1D24]",
      labelColor: "text-emerald-700/90",
    },
  ];

  return (
    <div className={className}>
      {showDetailed ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 w-full">
          {statCards.map((item, idx) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08, duration: 0.4 }}
              className={`flex items-center gap-3.5 p-3.5 sm:p-4 rounded-2xl border backdrop-blur-md transition-all duration-300 hover:scale-[1.02] ${item.cardBg}`}
            >
              {/* Icon Circle */}
              <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${item.iconBg}`}>
                {item.icon}
              </div>

              {/* Number and Label */}
              <div className="flex flex-col">
                <span className={`font-serif text-2xl sm:text-3xl font-semibold leading-none tracking-tight ${item.textColor}`}>
                  {item.value}
                </span>
                <span className={`text-[10px] font-sans font-bold tracking-widest uppercase mt-1 ${item.labelColor}`}>
                  {item.label}
                </span>
              </div>
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

