"use client";

import React from "react";
import Link from "next/link";
import { APP_CONFIG, NAV_ITEMS } from "@/lib/constants";
import { DaysCounter } from "@/components/ui/DaysCounter";
import { Shield } from "lucide-react";

export function Footer() {
  return (
    <footer className="relative border-t border-white/[0.06] bg-universe-950/90 backdrop-blur-md pt-16 pb-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Subtle top shimmer glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-px bg-gradient-to-r from-transparent via-gold-400/40 to-transparent" />

      <div className="max-w-6xl mx-auto space-y-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
          {/* Brand and Quote */}
          <div className="space-y-3 max-w-md">
            <div className="flex items-center justify-center md:justify-start gap-2.5">
              <span className="font-serif text-xl tracking-wider text-cream-50 font-normal">
                {APP_CONFIG.name}
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-gold-400/10 text-gold-300 border border-gold-400/20">
                {APP_CONFIG.couple.monogram}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-cream-300 font-serif italic leading-relaxed">
              &ldquo;{APP_CONFIG.couple.favoriteQuote}&rdquo;
            </p>
            <span className="text-[11px] uppercase tracking-widest text-gold-400/80 block">
              — {APP_CONFIG.couple.quoteAuthor}
            </span>
          </div>

          {/* Days Together Counter */}
          <div className="flex flex-col items-center md:items-end gap-3">
            <span className="text-xs uppercase tracking-widest text-cream-400">
              Our Journey So Far
            </span>
            <DaysCounter showDetailed={false} />
          </div>
        </div>

        {/* Quick Links Bar */}
        <div className="flex flex-wrap items-center justify-center gap-6 pt-8 border-t border-white/[0.04] text-xs text-cream-400">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="hover:text-gold-300 transition-colors"
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* Bottom copyright & privacy seal */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-cream-500 pt-4">
          <div className="flex items-center gap-2">
            <Shield className="w-3.5 h-3.5 text-gold-400/60" />
            <span>Private & Encrypted Relationship Sanctuary</span>
          </div>
          <div>
            Built with devotion for {APP_CONFIG.couple.partner1} & {APP_CONFIG.couple.partner2}
          </div>
        </div>
      </div>
    </footer>
  );
}
