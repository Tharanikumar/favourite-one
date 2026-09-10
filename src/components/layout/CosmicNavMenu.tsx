"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  BookOpen,
  Image as ImageIcon,
  Mail,
  MapPin,
  Star,
  Lock,
  Sparkles,
  Play,
  ChevronRight,
  X,
  Heart,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface CosmicNavMenuProps {
  isOpen?: boolean;
  onClose?: () => void;
  mode?: "drawer" | "sidebar" | "standalone";
  variant?: "light" | "dark";
  onPlayOpening?: () => void;
  className?: string;
}

interface CosmicNavItem {
  id: string;
  name: string;
  subtitle: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  lightIconBg: string;
  lightIconColor: string;
  lightIconBorder: string;
  darkIconBg: string;
  darkIconColor: string;
  darkIconBorder: string;
  activeGradient: string;
  activeGlow: string;
  badge?: string;
}

const NAV_ITEMS: CosmicNavItem[] = [
  {
    id: "home",
    name: "Home",
    subtitle: "Welcome back",
    href: "/dashboard",
    icon: Home,
    lightIconBg: "bg-white/30 backdrop-blur-md",
    lightIconColor: "text-white",
    lightIconBorder: "border-white/40",
    darkIconBg: "bg-white/20 backdrop-blur-md",
    darkIconColor: "text-white",
    darkIconBorder: "border-white/30",
    activeGradient: "from-[#FF4B72] via-[#E13B7E] to-[#9D4EDD]",
    activeGlow: "rgba(255, 75, 114, 0.45)",
  },
  {
    id: "story",
    name: "Our Story",
    subtitle: "How it all began",
    href: "/timeline",
    icon: BookOpen,
    lightIconBg: "bg-purple-100/90",
    lightIconColor: "text-purple-600",
    lightIconBorder: "border-purple-200/60",
    darkIconBg: "bg-[#38185E]/70",
    darkIconColor: "text-[#C4B5FD]",
    darkIconBorder: "border-[#8B5CF6]/30",
    activeGradient: "from-[#8B5CF6] via-[#7C3AED] to-[#6D28D9]",
    activeGlow: "rgba(139, 92, 246, 0.45)",
  },
  {
    id: "memories",
    name: "Memories",
    subtitle: "Pictures & moments",
    href: "/gallery",
    icon: ImageIcon,
    lightIconBg: "bg-rose-100/90",
    lightIconColor: "text-rose-600",
    lightIconBorder: "border-rose-200/60",
    darkIconBg: "bg-[#541731]/70",
    darkIconColor: "text-[#FDA4AF]",
    darkIconBorder: "border-[#FB7185]/30",
    activeGradient: "from-[#FB7185] via-[#F43F5E] to-[#E11D48]",
    activeGlow: "rgba(251, 113, 133, 0.45)",
  },
  {
    id: "letters",
    name: "Letters",
    subtitle: "Words from the heart",
    href: "/letters",
    icon: Mail,
    lightIconBg: "bg-sky-100/90",
    lightIconColor: "text-sky-600",
    lightIconBorder: "border-sky-200/60",
    darkIconBg: "bg-[#122852]/70",
    darkIconColor: "text-[#7DD3FC]",
    darkIconBorder: "border-[#38BDF8]/30",
    activeGradient: "from-[#38BDF8] via-[#0284C7] to-[#0369A1]",
    activeGlow: "rgba(56, 189, 248, 0.45)",
    badge: "3",
  },
  {
    id: "places",
    name: "Places",
    subtitle: "Where we belong",
    href: "/places",
    icon: MapPin,
    lightIconBg: "bg-emerald-100/90",
    lightIconColor: "text-emerald-600",
    lightIconBorder: "border-emerald-200/60",
    darkIconBg: "bg-[#0C3938]/70",
    darkIconColor: "text-[#5EEAD4]",
    darkIconBorder: "border-[#2DD4BF]/30",
    activeGradient: "from-[#2DD4BF] via-[#0D9488] to-[#115E59]",
    activeGlow: "rgba(45, 212, 191, 0.45)",
  },
  {
    id: "future",
    name: "Future",
    subtitle: "Dreams together",
    href: "/future",
    icon: Star,
    lightIconBg: "bg-amber-100/90",
    lightIconColor: "text-amber-600",
    lightIconBorder: "border-amber-200/60",
    darkIconBg: "bg-[#4C3410]/70",
    darkIconColor: "text-[#FDE68A]",
    darkIconBorder: "border-[#FBBF24]/30",
    activeGradient: "from-[#FBBF24] via-[#D97706] to-[#B45309]",
    activeGlow: "rgba(251, 191, 36, 0.45)",
  },
  {
    id: "vault",
    name: "Vault",
    subtitle: "Our private space",
    href: "/vault",
    icon: Lock,
    lightIconBg: "bg-fuchsia-100/90",
    lightIconColor: "text-fuchsia-600",
    lightIconBorder: "border-fuchsia-200/60",
    darkIconBg: "bg-[#421448]/70",
    darkIconColor: "text-[#F0ABFC]",
    darkIconBorder: "border-[#E879F9]/30",
    activeGradient: "from-[#E879F9] via-[#C026D3] to-[#86198F]",
    activeGlow: "rgba(232, 121, 249, 0.45)",
  },
];

export function CosmicNavMenu({
  isOpen = true,
  onClose,
  mode = "drawer",
  variant = "light",
  onPlayOpening,
  className,
}: CosmicNavMenuProps) {
  const pathname = usePathname();
  const isLight = variant === "light";

  const isRouteActive = (itemHref: string) => {
    if (itemHref === "/dashboard") {
      return pathname === "/" || pathname === "/dashboard";
    }
    return pathname.startsWith(itemHref);
  };

  const content = (
    <div
      className={cn(
        "relative w-full h-full flex flex-col justify-between overflow-hidden selection:bg-pink-500/30 font-sans",
        isLight
          ? "bg-white/85 text-charcoal-900 border-r border-rose-200/50 backdrop-blur-2xl"
          : "bg-[#0A0517] text-white border-r border-pink-500/20",
        mode === "drawer" ? "p-5 sm:p-7 max-w-md mx-auto min-h-screen" : "p-5 sm:p-6",
        className
      )}
    >
      {/* Ambient background glows */}
      {isLight ? (
        <>
          <div className="absolute top-0 right-0 w-80 h-96 bg-gradient-radial from-rose-200/40 via-pink-100/30 to-transparent blur-3xl pointer-events-none -z-10" />
          <div className="absolute bottom-10 left-0 w-72 h-72 bg-gradient-radial from-purple-100/40 via-peach-100/30 to-transparent blur-3xl pointer-events-none -z-10" />
        </>
      ) : (
        <>
          <div className="absolute top-0 right-0 w-80 h-96 bg-gradient-radial from-purple-600/20 via-pink-600/10 to-transparent blur-3xl pointer-events-none -z-10" />
          <div className="absolute bottom-10 left-0 w-72 h-72 bg-gradient-radial from-indigo-600/15 via-rose-900/10 to-transparent blur-3xl pointer-events-none -z-10" />
        </>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 1. HEADER SECTION: Brand & Tagline                            */}
      {/* ------------------------------------------------------------- */}
      <div className="relative z-10 pt-2 pb-5 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1
              className={cn(
                "font-serif text-2xl sm:text-3xl font-normal tracking-tight drop-shadow-sm",
                isLight ? "text-charcoal-900" : "text-white"
              )}
            >
              Our Little Universe
            </h1>
            <span className="text-xl sm:text-2xl text-pink-500 font-serif italic drop-shadow-[0_0_10px_rgba(244,63,94,0.5)] animate-pulse">
              ♡
            </span>
            <span className="text-xs text-rose-400 animate-pulse">✦</span>
          </div>

          <div
            className={cn(
              "flex items-center gap-2 mt-1.5 text-[10px] sm:text-[11px] font-mono font-medium tracking-[0.25em] uppercase",
              isLight ? "text-rose-400/90" : "text-[#9D8EB9]"
            )}
          >
            <span>MEMORIES</span>
            <span className="text-pink-400">&bull;</span>
            <span>MOMENTS</span>
            <span className="text-pink-400">&bull;</span>
            <span>FOREVER</span>
          </div>
        </div>

        {/* Close Button if Drawer Mode */}
        {mode === "drawer" && onClose && (
          <button
            onClick={onClose}
            className={cn(
              "p-2 rounded-full backdrop-blur-md transition-all border focus:outline-none",
              isLight
                ? "bg-rose-50 text-rose-600 border-rose-200 hover:bg-rose-100"
                : "bg-white/10 text-white/80 hover:bg-white/20 border-white/10"
            )}
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 2. NAVIGATION CARDS LIST                                      */}
      {/* ------------------------------------------------------------- */}
      <div className="relative z-10 flex-1 overflow-y-auto pr-1 space-y-2.5 sm:space-y-3 py-1 custom-scrollbar">
        {NAV_ITEMS.map((item, idx) => {
          const isActive = isRouteActive(item.href);
          const IconComponent = item.icon;

          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -14 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.03 }}
            >
              <Link
                href={item.href}
                onClick={onClose}
                className={cn(
                  "group relative w-full flex items-center justify-between p-3 sm:p-3.5 rounded-2xl sm:rounded-[1.25rem] transition-all duration-300 select-none",
                  isActive
                    ? cn(
                        "bg-gradient-to-r text-white font-medium border border-white/30",
                        item.activeGradient
                      )
                    : isLight
                    ? "bg-white/70 hover:bg-white/95 border border-rose-100/90 hover:border-rose-300/60 shadow-sm text-charcoal-800"
                    : "bg-[#130B24]/75 hover:bg-[#1C1135]/90 border border-white/[0.07] hover:border-pink-500/30 text-white/90"
                )}
                style={
                  isActive
                    ? {
                        boxShadow: `0 8px 24px -2px ${item.activeGlow}, inset 0 1px 1px rgba(255, 255, 255, 0.35)`,
                      }
                    : undefined
                }
              >
                {/* Left: Circular Icon Badge + Title & Subtitle */}
                <div className="flex items-center gap-3.5">
                  {/* Circular Icon Badge */}
                  <div
                    className={cn(
                      "w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center shrink-0 border transition-transform duration-300 group-hover:scale-105",
                      isActive
                        ? "bg-white/20 backdrop-blur-md border-white/30 text-white shadow-inner"
                        : isLight
                        ? cn(item.lightIconBg, item.lightIconColor, item.lightIconBorder)
                        : cn(item.darkIconBg, item.darkIconColor, item.darkIconBorder)
                    )}
                  >
                    <IconComponent className="w-5 h-5 sm:w-5.5 sm:h-5.5" />
                  </div>

                  {/* Text Column */}
                  <div className="text-left">
                    <div
                      className={cn(
                        "font-sans text-sm sm:text-base font-semibold leading-snug tracking-tight",
                        isActive
                          ? "text-white"
                          : isLight
                          ? "text-charcoal-900 group-hover:text-rose-600"
                          : "text-white/95 group-hover:text-white"
                      )}
                    >
                      {item.name}
                    </div>
                    <div
                      className={cn(
                        "text-[11px] sm:text-xs tracking-normal mt-0.5",
                        isActive
                          ? "text-white/85 font-normal"
                          : isLight
                          ? "text-charcoal-500 group-hover:text-charcoal-700"
                          : "text-[#9D8EB9] group-hover:text-purple-200/80"
                      )}
                    >
                      {item.subtitle}
                    </div>
                  </div>
                </div>

                {/* Right: Unread Badge & Chevron Icon */}
                <div className="flex items-center gap-2 pr-1">
                  {item.badge && (
                    <span className="w-6 h-6 rounded-full bg-gradient-to-r from-[#FF2A6D] to-[#FF5E7E] text-white text-xs font-bold flex items-center justify-center shadow-[0_0_10px_rgba(255,42,109,0.7)] ring-1 ring-white/20">
                      {item.badge}
                    </span>
                  )}

                  <ChevronRight
                    className={cn(
                      "w-5 h-5 transition-transform duration-300 group-hover:translate-x-1",
                      isActive
                        ? "text-white/90"
                        : isLight
                        ? "text-rose-300 group-hover:text-rose-500"
                        : "text-[#9D8EB9]/60 group-hover:text-pink-300"
                    )}
                  />
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 3. FOOTER: SAME SOUL • BRIGHTER TOMORROW & Heart Line Flourish*/}
      {/* ------------------------------------------------------------- */}
      <div
        className={cn(
          "relative z-10 pt-4 pb-1 border-t flex items-center justify-between text-[10px] sm:text-[11px] font-mono uppercase tracking-[0.2em]",
          isLight
            ? "border-rose-200/60 text-rose-500/80"
            : "border-white/[0.08] text-[#8E7EAA]"
        )}
      >
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-2xl bg-rose-500/10 border border-rose-300/40 flex items-center justify-center text-rose-500 shrink-0 shadow-sm">
            <Heart className="w-4 h-4 fill-rose-500/20 text-rose-500" />
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-[11px] text-charcoal-900 lowercase capitalize">
              Same Soul
            </span>
            <span className="text-[9px] text-rose-400 font-mono tracking-wider lowercase capitalize">
              Brighter Tomorrow
            </span>
          </div>
        </div>

        {/* Decorative Glowing Heart Line Curve Flourish */}
        <div className="flex items-center gap-1 text-pink-400">
          <div className="w-6 sm:w-10 h-px bg-gradient-to-r from-transparent via-pink-400/50 to-pink-400" />
          <span className="text-xs text-pink-400 drop-shadow-[0_0_6px_rgba(244,63,94,0.5)]">
            ♡
          </span>
        </div>
      </div>
    </div>
  );

  if (mode === "drawer") {
    return (
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex justify-start overflow-hidden">
            {/* Backdrop Blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={onClose}
              className="fixed inset-0 bg-black/40 backdrop-blur-md z-40"
            />

            {/* Slide-in Drawer Container */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="relative z-50 w-full max-w-sm sm:max-w-md h-full shadow-2xl border-r border-rose-200/50"
            >
              {content}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    );
  }

  return content;
}
