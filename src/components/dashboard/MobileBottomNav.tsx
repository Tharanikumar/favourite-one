"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  Sparkles,
  Clock,
  Camera,
  Mail,
  Compass,
  Lock,
} from "lucide-react";

export function MobileBottomNav() {
  const pathname = usePathname();

  const items = [
    { name: "Sanctuary", href: "/dashboard", icon: <Sparkles className="w-4 h-4" /> },
    { name: "Story", href: "/timeline", icon: <Clock className="w-4 h-4" /> },
    { name: "Moments", href: "/gallery", icon: <Camera className="w-4 h-4" /> },
    { name: "Letters", href: "/letters", icon: <Mail className="w-4 h-4" /> },
    { name: "Future", href: "/future", icon: <Compass className="w-4 h-4" /> },
    { name: "Vault", href: "/vault", icon: <Lock className="w-4 h-4" /> },
  ];

  return (
    <div className="md:hidden fixed bottom-3 inset-x-3 z-40 pb-[env(safe-area-inset-bottom)] pointer-events-none">
      <nav className="flex items-center justify-around py-2 px-1 rounded-2xl bg-white/95 backdrop-blur-2xl border border-universe-750/70 shadow-2xl pointer-events-auto">
        {items.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative flex flex-col items-center py-1.5 px-2.5 rounded-xl transition-all duration-200 text-[10px] font-sans min-h-[44px] justify-center",
                isActive
                  ? "text-rose-600 font-semibold"
                  : "text-cream-300 hover:text-cream-50"
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="mobileActiveTab"
                  className="absolute inset-0 bg-rose-500/15 rounded-xl border border-rose-400/35 shadow-glow-rose"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                />
              )}
              <span className="relative z-10 flex flex-col items-center gap-1">
                {item.icon}
                <span className="leading-none tracking-tight">{item.name}</span>
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
