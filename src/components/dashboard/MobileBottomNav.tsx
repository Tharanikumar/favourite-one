"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  Home,
  BookOpen,
  Camera,
  Mail,
  Compass,
  Lock,
} from "lucide-react";

interface NavItemConfig {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  dotColor: string;
  gradient: string;
  glowColor: string;
  hasFloatingHearts?: boolean;
}

const NAV_ITEMS: NavItemConfig[] = [
  {
    name: "Sanctuary",
    href: "/dashboard",
    icon: Home,
    dotColor: "bg-[#FF5E7E]",
    gradient: "from-[#FF2A6D] via-[#FF5E7E] to-[#FFA8B6]",
    glowColor: "rgba(255, 42, 109, 0.55)",
  },
  {
    name: "Story",
    href: "/timeline",
    icon: BookOpen,
    dotColor: "bg-[#A855F7]",
    gradient: "from-[#7C3AED] via-[#8B5CF6] to-[#C4B5FD]",
    glowColor: "rgba(124, 58, 237, 0.55)",
  },
  {
    name: "Moments",
    href: "/gallery",
    icon: Camera,
    dotColor: "bg-[#0EA5E9]",
    gradient: "from-[#0284C7] via-[#0EA5E9] to-[#38BDF8]",
    glowColor: "rgba(14, 165, 233, 0.55)",
  },
  {
    name: "Letters",
    href: "/letters",
    icon: Mail,
    dotColor: "bg-[#F43F5E]",
    gradient: "from-[#E11D48] via-[#F43F5E] to-[#FDA4AF]",
    glowColor: "rgba(244, 63, 94, 0.55)",
    hasFloatingHearts: true,
  },
  {
    name: "Future",
    href: "/future",
    icon: Compass,
    dotColor: "bg-[#6366F1]",
    gradient: "from-[#6366F1] via-[#818CF8] to-[#C7D2FE]",
    glowColor: "rgba(99, 102, 241, 0.55)",
  },
  {
    name: "Vault",
    href: "/vault",
    icon: Lock,
    dotColor: "bg-[#F59E0B]",
    gradient: "from-[#D97706] via-[#F59E0B] to-[#FDE68A]",
    glowColor: "rgba(245, 158, 11, 0.55)",
  },
];

export function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-4 sm:bottom-6 inset-x-0 z-50 flex justify-center px-3 sm:px-6 pb-[env(safe-area-inset-bottom)] pointer-events-none">
      <nav
        aria-label="Sanctuary Mobile Navigation"
        className="pointer-events-auto relative w-full max-w-xl h-[68px] sm:h-[72px] flex items-center justify-between px-2 sm:px-6 rounded-full bg-white/95 backdrop-blur-2xl border border-white/90 shadow-[0_12px_40px_rgba(0,0,0,0.1),0_2px_10px_rgba(0,0,0,0.04)] ring-1 ring-slate-900/5"
      >
        {NAV_ITEMS.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));

          const IconComponent = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className="relative flex-1 flex flex-col items-center justify-center h-full focus:outline-none select-none group"
            >
              {isActive ? (
                /* ========================================================= */
                /* ACTIVE ELEVATED BUBBLE WITH GLOW & SPRING MOTION         */
                /* ========================================================= */
                <div className="relative flex flex-col items-center">
                  {/* Floating Micro Hearts for Letters Tab */}
                  {item.hasFloatingHearts && (
                    <motion.div
                      initial={{ opacity: 0, y: 4, scale: 0.8 }}
                      animate={{ opacity: 1, y: -2, scale: 1 }}
                      transition={{ duration: 0.4 }}
                      className="absolute -top-7 sm:-top-8 flex items-center gap-1 text-sm pointer-events-none z-30"
                    >
                      <motion.span
                        animate={{ y: [0, -3, 0], rotate: [-4, 4, -4] }}
                        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                        className="drop-shadow-sm text-xs"
                      >
                        💖
                      </motion.span>
                      <motion.span
                        animate={{ y: [-2, 1, -2], rotate: [4, -4, 4] }}
                        transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
                        className="drop-shadow-sm text-[11px]"
                      >
                        💕
                      </motion.span>
                    </motion.div>
                  )}

                  {/* Diffused Ambient Glow Halo */}
                  <motion.div
                    layoutId="activeBubbleGlow"
                    className="absolute -top-3 sm:-top-4 w-16 h-16 sm:w-[72px] sm:h-[72px] rounded-full blur-xl pointer-events-none opacity-80"
                    style={{
                      background: `radial-gradient(circle, ${item.glowColor} 0%, transparent 70%)`,
                    }}
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  />

                  {/* Elevated Vibrant Gradient Circular Bubble */}
                  <motion.div
                    layoutId="activeBubble"
                    className={cn(
                      "relative w-16 h-16 sm:w-[70px] sm:h-[70px] -top-3.5 sm:-top-4 rounded-full bg-gradient-to-tr border-2 border-white/95 shadow-xl flex flex-col items-center justify-center text-white z-20",
                      item.gradient
                    )}
                    style={{
                      boxShadow: `0 10px 24px -2px ${item.glowColor}, 0 4px 10px rgba(0,0,0,0.08)`,
                    }}
                    transition={{ type: "spring", stiffness: 450, damping: 35 }}
                  >
                    <IconComponent className="w-5 h-5 text-white drop-shadow-sm" />
                    <span className="text-[10px] sm:text-[11px] font-semibold text-white tracking-tight leading-none mt-1 drop-shadow-sm">
                      {item.name}
                    </span>
                    {/* Tiny Crisp White Bottom Indicator Dot */}
                    <span className="w-1.5 h-1.5 rounded-full bg-white shadow-sm mt-0.5" />
                  </motion.div>
                </div>
              ) : (
                /* ========================================================= */
                /* INACTIVE ITEM WITH TOP-RIGHT COLORED ACCENT DOT           */
                /* ========================================================= */
                <div className="relative flex flex-col items-center justify-center py-1 group-hover:-translate-y-0.5 transition-transform duration-200">
                  {/* Icon with Top-Right Accent Dot */}
                  <div className="relative">
                    <IconComponent className="w-5 h-5 text-slate-700 group-hover:text-slate-900 transition-colors" />
                    {/* Small Colored Notification/Category Accent Dot */}
                    <span
                      className={cn(
                        "w-2 h-2 rounded-full absolute -top-1 -right-1 ring-1 ring-white shadow-sm",
                        item.dotColor
                      )}
                    />
                  </div>

                  {/* Inactive Label */}
                  <span className="text-[10px] sm:text-[11px] font-medium text-slate-600 group-hover:text-slate-900 transition-colors tracking-tight mt-1">
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
