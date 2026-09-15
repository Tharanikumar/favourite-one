"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface NavItemConfig {
  name: string;
  href: string;
  badge?: boolean;
  icon: (active: boolean) => React.ReactNode;
}

const NAV_ITEMS: NavItemConfig[] = [
  {
    name: "Sanctuary",
    href: "/dashboard",
    badge: true,
    icon: (active) => (
      <svg
        className={cn("w-5 h-5 sm:w-6 sm:h-6 transition-colors", active ? "text-white" : "text-[#1F2937]")}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
  {
    name: "Story",
    href: "/timeline",
    icon: (active) => (
      <svg
        className={cn("w-5 h-5 sm:w-6 sm:h-6 transition-colors", active ? "text-white" : "text-[#1F2937]")}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
      </svg>
    ),
  },
  {
    name: "Moments",
    href: "/gallery",
    icon: (active) => (
      <svg
        className={cn("w-5 h-5 sm:w-6 sm:h-6 transition-colors", active ? "text-white" : "text-[#1F2937]")}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
        <circle cx="12" cy="13" r="4" />
      </svg>
    ),
  },
  {
    name: "Letters",
    href: "/letters",
    badge: true,
    icon: (active) => (
      <svg
        className={cn("w-5 h-5 sm:w-6 sm:h-6 transition-colors", active ? "text-white" : "text-[#1F2937]")}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <polyline points="22,6 12,13 2,6" />
      </svg>
    ),
  },
  {
    name: "Future",
    href: "/future",
    icon: (active) => (
      <svg
        className={cn("w-5 h-5 sm:w-6 sm:h-6 transition-colors", active ? "text-white" : "text-[#1F2937]")}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="5" />
        <path d="M3.5 14.5c3.5 4.5 12.5 5.5 17-2" />
        <path d="M20.5 9.5c-3.5-4.5-12.5-5.5-17 2" />
        <path d="M19 5l1 2 2 1-2 1-1 2-1-2-2-1 2-1z" fill="currentColor" strokeWidth="0.5" />
      </svg>
    ),
  },
  {
    name: "Vault",
    href: "/vault",
    icon: (active) => (
      <svg
        className={cn("w-5 h-5 sm:w-6 sm:h-6 transition-colors", active ? "text-white" : "text-[#1F2937]")}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        <circle cx="12" cy="16" r="1.5" fill="currentColor" />
      </svg>
    ),
  },
];

export function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-4 sm:bottom-6 inset-x-0 z-50 flex justify-center px-3 sm:px-6 pb-[env(safe-area-inset-bottom)] pointer-events-none select-none">
      {/* ------------------------------------------------------------- */}
      {/* ULTRA-PREMIUM LIQUID GLASS DOCK BAR                           */}
      {/* ------------------------------------------------------------- */}
      <nav
        aria-label="Sanctuary Navigation Dock"
        className="pointer-events-auto relative w-full max-w-2xl h-[70px] sm:h-[76px] flex items-center justify-between px-2 sm:px-4 rounded-full bg-white/65 backdrop-blur-3xl border border-white/90 shadow-[0_20px_50px_rgba(200,100,120,0.18),0_4px_20px_rgba(255,255,255,0.8)_inset,0_-2px_10px_rgba(255,200,210,0.4)_inset] ring-1 ring-white/60"
      >
        {/* Soft edge light flare highlights */}
        <div className="absolute -top-1 left-12 w-24 h-2 bg-gradient-to-r from-transparent via-white to-transparent blur-[1px] opacity-90 pointer-events-none" />
        <div className="absolute -top-1 right-12 w-24 h-2 bg-gradient-to-r from-transparent via-white to-transparent blur-[1px] opacity-90 pointer-events-none" />
        <div className="absolute -bottom-1 left-1/3 w-32 h-2 bg-gradient-to-r from-transparent via-rose-300/40 to-transparent blur-[1px] opacity-80 pointer-events-none" />

        {/* Outer glass specular rim */}
        <div className="absolute inset-0 rounded-full border border-white/70 pointer-events-none" />

        {NAV_ITEMS.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className="relative flex-1 flex flex-col items-center justify-center h-full focus:outline-none group z-10"
            >
              {isActive ? (
                /* ========================================================= */
                /* ACTIVE ELEVATED LIQUID GLASS DISK WITH CURVED ARCH        */
                /* ========================================================= */
                <div className="relative flex flex-col items-center justify-center">
                  {/* Outer Glass Protrusion Arch Overlay */}
                  <motion.div
                    layoutId="activeGlassArch"
                    className="absolute -top-6 sm:-top-7 w-20 h-20 sm:w-22 sm:h-22 rounded-full pointer-events-none z-10"
                    style={{
                      background: "radial-gradient(circle, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.2) 65%, transparent 100%)",
                      boxShadow: "0 -4px 18px rgba(255,255,255,0.8), 0 8px 25px rgba(210,100,125,0.35)",
                    }}
                    transition={{ type: "spring", stiffness: 420, damping: 32 }}
                  />

                  {/* Liquid Rose-Pink Glass Disc */}
                  <motion.div
                    layoutId="activeRoseDisc"
                    className="relative -top-5 sm:-top-6 w-[68px] h-[68px] sm:w-[74px] sm:h-[74px] rounded-full bg-gradient-to-b from-[#E07A8B] via-[#C8596D] to-[#AE3E52] border-2 border-white/90 shadow-[0_10px_25px_rgba(200,80,105,0.45),inset_0_2px_4px_rgba(255,255,255,0.8),inset_0_-2px_4px_rgba(0,0,0,0.2)] flex flex-col items-center justify-center text-white z-20 cursor-pointer overflow-hidden"
                    transition={{ type: "spring", stiffness: 450, damping: 34 }}
                  >
                    {/* Top glass reflection crescent */}
                    <div className="absolute top-1 inset-x-3 h-3 rounded-full bg-gradient-to-b from-white/70 to-transparent pointer-events-none opacity-80" />
                    
                    {/* Active Icon */}
                    <div className="relative z-10 drop-shadow-sm mt-1">
                      {item.icon(true)}
                    </div>

                    {/* Active Name */}
                    <span className="relative z-10 text-[10px] sm:text-[11px] font-sans font-medium text-white tracking-tight leading-none mt-1 drop-shadow-sm">
                      {item.name}
                    </span>

                    {/* Clean White Horizontal Pill Indicator */}
                    <span className="relative z-10 w-4 sm:w-5 h-[2.5px] rounded-full bg-white shadow-xs mt-1" />
                  </motion.div>
                </div>
              ) : (
                /* ========================================================= */
                /* INACTIVE GLASS TAB WITH CRISP ICONS & PINK DOT BADGE      */
                /* ========================================================= */
                <div className="relative flex flex-col items-center justify-center py-1 group-hover:-translate-y-0.5 transition-all duration-200">
                  {/* Icon with optional notification pink badge */}
                  <div className="relative">
                    {item.icon(false)}
                    
                    {/* Pink notification dot badge (matches screenshot on Sanctuary & Letters) */}
                    {item.badge && (
                      <span className="w-2 h-2 rounded-full absolute -top-0.5 -right-1 bg-[#E85B7A] ring-1.5 ring-white shadow-xs" />
                    )}
                  </div>

                  {/* Label text */}
                  <span className="text-[11px] sm:text-xs font-sans font-medium text-[#2E2E2E] group-hover:text-rose-600 transition-colors tracking-tight mt-1">
                    {item.name}
                  </span>
                </div>
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
