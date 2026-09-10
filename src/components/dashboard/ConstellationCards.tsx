"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Mail,
  MapPin,
  Heart,
  Compass,
  Lock,
  ArrowRight,
  Layers,
  Sprout,
} from "lucide-react";
import { MOCK_LOVE_REASONS, MOCK_FUTURE_ITEMS } from "@/lib/mockData";

export function ConstellationCards() {
  return (
    <section className="space-y-6">
      {/* Section Header */}
      <div className="space-y-1">
        <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-white font-normal tracking-tight">
          Explore More Constellations
        </h2>
        <p className="text-xs sm:text-sm text-rose-200/80 font-sans">
          Browse letters, special coordinates, reasons I love you, and protected files.
        </p>
      </div>

      {/* Row 1: 3 Grid Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
        {/* ------------------------------------------------------------- */}
        {/* CARD 1: PRESERVED LETTERS                                     */}
        {/* ------------------------------------------------------------- */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="h-full"
        >
          <Link href="/letters" className="block h-full group">
            <div className="h-full relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#FFF0F3] via-[#FFF6F8] to-[#FFE4EC] border border-rose-200/80 p-6 sm:p-7 shadow-[0_10px_30px_rgba(244,63,94,0.07)] hover:shadow-[0_20px_40px_rgba(244,63,94,0.16)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
              {/* Background 3D Envelope Art on Right */}
              <div className="absolute right-1 top-6 sm:top-8 w-28 sm:w-36 h-28 sm:h-36 pointer-events-none group-hover:scale-105 group-hover:rotate-2 transition-transform duration-500">
                <svg
                  viewBox="0 0 160 140"
                  className="w-full h-full drop-shadow-md"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    <linearGradient id="envelopeGrad" x1="0" y1="0" x2="160" y2="140" gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stopColor="#FFE0E9" />
                      <stop offset="100%" stopColor="#FFB8CE" />
                    </linearGradient>
                    <linearGradient id="envelopeFlap" x1="80" y1="20" x2="80" y2="90" gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stopColor="#FFF2F6" />
                      <stop offset="100%" stopColor="#FFC7D8" />
                    </linearGradient>
                    <linearGradient id="waxSealGrad" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stopColor="#FF4D6D" />
                      <stop offset="60%" stopColor="#E61E43" />
                      <stop offset="100%" stopColor="#A80724" />
                    </linearGradient>
                    <linearGradient id="heartGrad1" x1="0" y1="0" x2="30" y2="30" gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stopColor="#FF758F" />
                      <stop offset="100%" stopColor="#FF4D6D" />
                    </linearGradient>
                    <filter id="softGlow1" x="-20%" y="-20%" width="140%" height="140%">
                      <feDropShadow dx="0" dy="6" stdDeviation="6" floodColor="#FF4D6D" floodOpacity="0.25" />
                    </filter>
                  </defs>

                  {/* Floating Mini Heart Left */}
                  <g transform="translate(18, 22) scale(0.6)" filter="url(#softGlow1)">
                    <path
                      d="M20 14 C20 6, 6 2, 6 12 C6 20, 20 30, 20 30 C20 30, 34 20, 34 12 C34 2, 20 6, 20 14 Z"
                      fill="#FF8FA3"
                      opacity="0.9"
                    />
                  </g>

                  {/* Main Envelope Body */}
                  <g filter="url(#softGlow1)">
                    <rect x="35" y="42" width="112" height="74" rx="14" fill="url(#envelopeGrad)" stroke="#FFFFFF" strokeWidth="2" />
                    {/* Bottom triangular fold */}
                    <path d="M35 116 L91 78 L147 116 Z" fill="#FFAEC6" opacity="0.6" />
                    {/* Left and right folds */}
                    <path d="M35 42 L91 78 L35 116 Z" fill="#FFC2D4" opacity="0.5" />
                    <path d="M147 42 L91 78 L147 116 Z" fill="#FFB3C7" opacity="0.5" />
                    {/* Top Flap */}
                    <path d="M35 44 Q91 92 147 44" fill="url(#envelopeFlap)" stroke="#FFFFFF" strokeWidth="1.5" />
                  </g>

                  {/* Wax Seal Medallion */}
                  <g filter="url(#softGlow1)">
                    <circle cx="91" cy="74" r="15" fill="url(#waxSealGrad)" stroke="#FFB3C1" strokeWidth="1.5" />
                    <circle cx="91" cy="74" r="11" fill="none" stroke="#FF8FA3" strokeWidth="1" strokeDasharray="2 1" />
                    {/* Heart in Wax Seal */}
                    <path d="M91 70 C91 67, 86 65.5, 86 69 C86 72, 91 75.5, 91 75.5 C91 75.5, 96 72, 96 69 C96 65.5, 91 67, 91 70 Z" fill="#FFF0F3" />
                  </g>

                  {/* Big 3D Glossy Heart Floating on Right */}
                  <g transform="translate(112, 10)">
                    <path
                      d="M22 18 C22 8, 4 4, 4 16 C4 27, 22 38, 22 38 C22 38, 40 27, 40 16 C40 4, 22 8, 22 18 Z"
                      fill="url(#heartGrad1)"
                      filter="url(#softGlow1)"
                    />
                    <ellipse cx="14" cy="14" rx="4" ry="2" transform="rotate(-30 14 14)" fill="#FFFFFF" opacity="0.6" />
                  </g>
                </svg>
              </div>

              {/* Card Content */}
              <div className="relative z-10 space-y-3.5">
                {/* Top Row: Icon & Tag */}
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-[#FFE4E9] border border-rose-200/80 flex items-center justify-center text-rose-500 shadow-sm group-hover:scale-105 transition-transform">
                    <Mail className="w-5 h-5" />
                  </div>
                  <span className="px-3 py-1 rounded-full bg-rose-50/90 border border-rose-200 text-rose-500 text-[10px] font-mono font-bold tracking-widest uppercase shadow-sm">
                    CORRESPONDENCE
                  </span>
                </div>

                {/* Title & Subtitle */}
                <div>
                  <h3 className="font-serif text-2xl font-bold text-slate-900 leading-tight group-hover:text-rose-600 transition-colors">
                    Preserved Letters
                  </h3>
                  <p className="text-[11px] font-mono font-bold text-rose-500 tracking-wider uppercase mt-1">
                    SEALED &amp; OPEN WORDS
                  </p>
                </div>

                {/* Description */}
                <p className="text-xs sm:text-[13px] text-slate-600 font-sans leading-relaxed max-w-[230px]">
                  Intimate love notes, digital wax seals, and letters time-locked for future anniversaries.
                </p>
              </div>

              {/* Bottom Row */}
              <div className="relative z-10 pt-4 mt-6 border-t border-rose-200/60 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                  <Layers className="w-3.5 h-3.5 text-rose-500" />
                  <span>4 Sealed Envelopes</span>
                </div>
                <span className="text-xs sm:text-sm font-bold text-rose-600 flex items-center gap-1 group-hover:translate-x-1.5 transition-transform">
                  <span>Open</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          </Link>
        </motion.div>

        {/* ------------------------------------------------------------- */}
        {/* CARD 2: OUR SPECIAL PLACES                                    */}
        {/* ------------------------------------------------------------- */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.05 }}
          className="h-full"
        >
          <Link href="/places" className="block h-full group">
            <div className="h-full relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#F0F7FF] via-[#F6FAFF] to-[#E2F0FF] border border-blue-200/80 p-6 sm:p-7 shadow-[0_10px_30px_rgba(59,130,246,0.07)] hover:shadow-[0_20px_40px_rgba(59,130,246,0.16)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
              {/* Background 3D Folded Map Art on Right */}
              <div className="absolute right-1 top-6 sm:top-8 w-28 sm:w-36 h-28 sm:h-36 pointer-events-none group-hover:scale-105 group-hover:-rotate-2 transition-transform duration-500">
                <svg
                  viewBox="0 0 160 140"
                  className="w-full h-full drop-shadow-md"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    <linearGradient id="mapFold1" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#E0F2FE" />
                      <stop offset="100%" stopColor="#BAE6FD" />
                    </linearGradient>
                    <linearGradient id="mapFold2" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#F0F9FF" />
                      <stop offset="100%" stopColor="#E0F2FE" />
                    </linearGradient>
                    <linearGradient id="mapFold3" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#BAE6FD" />
                      <stop offset="100%" stopColor="#7DD3FC" />
                    </linearGradient>
                    <linearGradient id="pinGrad1" x1="0" y1="0" x2="20" y2="30">
                      <stop offset="0%" stopColor="#38BDF8" />
                      <stop offset="50%" stopColor="#0284C7" />
                      <stop offset="100%" stopColor="#0369A1" />
                    </linearGradient>
                    <linearGradient id="sunGrad1" x1="0" y1="0" x2="30" y2="30">
                      <stop offset="0%" stopColor="#FDE047" />
                      <stop offset="100%" stopColor="#F59E0B" />
                    </linearGradient>
                    <filter id="blueGlow1" x="-20%" y="-20%" width="140%" height="140%">
                      <feDropShadow dx="0" dy="6" stdDeviation="6" floodColor="#0284C7" floodOpacity="0.25" />
                    </filter>
                  </defs>

                  {/* Golden Sun & Mountains in Background */}
                  <circle cx="132" cy="28" r="14" fill="url(#sunGrad1)" opacity="0.9" />
                  <circle cx="132" cy="28" r="22" fill="#FDE047" opacity="0.25" />
                  <path d="M50 72 L75 44 L100 72 Z" fill="#93C5FD" opacity="0.45" />
                  <path d="M85 72 L115 38 L145 72 Z" fill="#60A5FA" opacity="0.35" />

                  {/* 3-Fold Map */}
                  <g filter="url(#blueGlow1)" transform="translate(18, 48)">
                    <path d="M10 20 L45 8 L45 68 L10 80 Z" fill="url(#mapFold1)" stroke="#FFFFFF" strokeWidth="1.5" />
                    <path d="M45 8 L85 22 L85 82 L45 68 Z" fill="url(#mapFold2)" stroke="#FFFFFF" strokeWidth="1.5" />
                    <path d="M85 22 L120 10 L120 70 L85 82 Z" fill="url(#mapFold3)" stroke="#FFFFFF" strokeWidth="1.5" />
                    <path d="M28 48 Q55 24 70 52 T102 38" fill="none" stroke="#0284C7" strokeWidth="2.5" strokeDasharray="3 3" strokeLinecap="round" />
                  </g>

                  {/* Pin 1 (Left) */}
                  <g filter="url(#blueGlow1)" transform="translate(42, 54)">
                    <path d="M12 0 C5.37 0 0 5.37 0 12 C0 20 12 32 12 32 C12 32 24 20 24 12 C24 5.37 18.63 0 12 0 Z" fill="url(#pinGrad1)" />
                    <circle cx="12" cy="11" r="4.5" fill="#FFFFFF" />
                  </g>

                  {/* Pin 2 (Right) */}
                  <g filter="url(#blueGlow1)" transform="translate(112, 64)">
                    <path d="M10 0 C4.47 0 0 4.47 0 10 C0 17 10 26 10 26 C10 26 20 17 20 10 C20 4.47 15.53 0 10 0 Z" fill="url(#pinGrad1)" />
                    <circle cx="10" cy="9" r="4" fill="#FFFFFF" />
                  </g>
                </svg>
              </div>

              {/* Card Content */}
              <div className="relative z-10 space-y-3.5">
                {/* Top Row: Icon & Tag */}
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-[#E0EFFF] border border-blue-200/80 flex items-center justify-center text-blue-600 shadow-sm group-hover:scale-105 transition-transform">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <span className="px-3 py-1 rounded-full bg-blue-50/90 border border-blue-200 text-blue-600 text-[10px] font-mono font-bold tracking-widest uppercase shadow-sm">
                    COORDINATES
                  </span>
                </div>

                {/* Title & Subtitle */}
                <div>
                  <h3 className="font-serif text-2xl font-bold text-slate-900 leading-tight group-hover:text-blue-600 transition-colors">
                    Our Special Places
                  </h3>
                  <p className="text-[11px] font-mono font-bold text-blue-600 tracking-wider uppercase mt-1">
                    GEOGRAPHIC COORDINATES
                  </p>
                </div>

                {/* Description */}
                <p className="text-xs sm:text-[13px] text-slate-600 font-sans leading-relaxed max-w-[230px]">
                  Coordinates of our favorite lookout points, intimate cafés, and unforgettable road trips.
                </p>
              </div>

              {/* Bottom Row */}
              <div className="relative z-10 pt-4 mt-6 border-t border-blue-200/60 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                  <MapPin className="w-3.5 h-3.5 text-blue-600" />
                  <span>8 Pinned Locations</span>
                </div>
                <span className="text-xs sm:text-sm font-bold text-blue-600 flex items-center gap-1 group-hover:translate-x-1.5 transition-transform">
                  <span>Open</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          </Link>
        </motion.div>

        {/* ------------------------------------------------------------- */}
        {/* CARD 3: THINGS I LOVE ABOUT YOU                               */}
        {/* ------------------------------------------------------------- */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="h-full"
        >
          <Link href="/things-i-love" className="block h-full group">
            <div className="h-full relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#FFF6F0] via-[#FFFAF5] to-[#FFEAE0] border border-orange-200/80 p-6 sm:p-7 shadow-[0_10px_30px_rgba(249,115,22,0.07)] hover:shadow-[0_20px_40px_rgba(249,115,22,0.16)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
              {/* Background 3D Glossy Peach Hearts Art on Right */}
              <div className="absolute right-1 top-6 sm:top-8 w-28 sm:w-36 h-28 sm:h-36 pointer-events-none group-hover:scale-105 group-hover:rotate-3 transition-transform duration-500">
                <svg
                  viewBox="0 0 160 140"
                  className="w-full h-full drop-shadow-md"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    <linearGradient id="peachHeartMain1" x1="20" y1="20" x2="110" y2="120" gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stopColor="#FFA685" />
                      <stop offset="40%" stopColor="#FF7052" />
                      <stop offset="100%" stopColor="#E04828" />
                    </linearGradient>
                    <linearGradient id="peachHeartMini1" x1="0" y1="0" x2="30" y2="30" gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stopColor="#FFBAA3" />
                      <stop offset="100%" stopColor="#FF7A59" />
                    </linearGradient>
                    <filter id="peachGlow1" x="-30%" y="-30%" width="160%" height="160%">
                      <feDropShadow dx="0" dy="8" stdDeviation="8" floodColor="#FF6B4A" floodOpacity="0.3" />
                    </filter>
                  </defs>

                  {/* Floating Mini Hearts */}
                  <g transform="translate(38, 28) scale(0.65)" filter="url(#peachGlow1)">
                    <path d="M20 14 C20 6, 6 2, 6 12 C6 20, 20 30, 20 30 C20 30, 34 20, 34 12 C34 2, 20 6, 20 14 Z" fill="url(#peachHeartMini1)" />
                  </g>
                  <g transform="translate(120, 85) scale(0.55)" filter="url(#peachGlow1)">
                    <path d="M20 14 C20 6, 6 2, 6 12 C6 20, 20 30, 20 30 C20 30, 34 20, 34 12 C34 2, 20 6, 20 14 Z" fill="url(#peachHeartMini1)" />
                  </g>

                  {/* Big Hero 3D Glossy Peach Heart */}
                  <g transform="translate(68, 24)" filter="url(#peachGlow1)">
                    <path d="M42 30 C42 12, 10 6, 10 26 C10 46, 42 68, 42 68 C42 68, 74 46, 74 26 C74 6, 42 12, 42 30 Z" fill="url(#peachHeartMain1)" />
                    <ellipse cx="28" cy="22" rx="9" ry="5" transform="rotate(-35 28 22)" fill="#FFFFFF" opacity="0.55" />
                    <circle cx="20" cy="29" r="2.5" fill="#FFFFFF" opacity="0.4" />
                  </g>
                </svg>
              </div>

              {/* Card Content */}
              <div className="relative z-10 space-y-3.5">
                {/* Top Row: Icon & Tag */}
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-[#FFEADB] border border-orange-200/80 flex items-center justify-center text-orange-500 shadow-sm group-hover:scale-105 transition-transform">
                    <Heart className="w-5 h-5" />
                  </div>
                  <span className="px-3 py-1 rounded-full bg-orange-50/90 border border-orange-200 text-orange-600 text-[10px] font-mono font-bold tracking-widest uppercase shadow-sm">
                    DEVOTION
                  </span>
                </div>

                {/* Title & Subtitle */}
                <div>
                  <h3 className="font-serif text-2xl font-bold text-slate-900 leading-tight group-hover:text-orange-600 transition-colors">
                    Things I Love About You
                  </h3>
                  <p className="text-[11px] font-mono font-bold text-orange-600 tracking-wider uppercase mt-1">
                    REASONS I ADORE YOU
                  </p>
                </div>

                {/* Description */}
                <p className="text-xs sm:text-[13px] text-slate-600 font-sans leading-relaxed max-w-[230px]">
                  A growing collection of the little habits, deep virtues, and endearing quirks that define you.
                </p>
              </div>

              {/* Bottom Row */}
              <div className="relative z-10 pt-4 mt-6 border-t border-orange-200/60 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                  <Heart className="w-3.5 h-3.5 text-orange-500" />
                  <span>{MOCK_LOVE_REASONS.length} Recorded Reasons</span>
                </div>
                <span className="text-xs sm:text-sm font-bold text-orange-600 flex items-center gap-1 group-hover:translate-x-1.5 transition-transform">
                  <span>Open</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          </Link>
        </motion.div>
      </div>

      {/* Row 2: 2 Wide Grid Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">
        {/* ------------------------------------------------------------- */}
        {/* CARD 4: FUTURE TOGETHER (Aspirations)                         */}
        {/* ------------------------------------------------------------- */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="h-full"
        >
          <Link href="/future" className="block h-full group">
            <div className="h-full relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#F1FDF4] via-[#F7FCF9] to-[#E3F9EC] border border-emerald-200/80 p-6 sm:p-7 shadow-[0_10px_30px_rgba(16,185,129,0.07)] hover:shadow-[0_20px_40px_rgba(16,185,129,0.16)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
              {/* Background 3D Sprout Hill Art on Right */}
              <div className="absolute right-1 sm:right-4 bottom-2 sm:bottom-4 w-36 sm:w-48 h-28 sm:h-36 pointer-events-none group-hover:scale-105 transition-transform duration-500">
                <svg
                  viewBox="0 0 200 130"
                  className="w-full h-full drop-shadow-md"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    <linearGradient id="hillGrad1" x1="100" y1="50" x2="100" y2="130" gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stopColor="#4ADE80" />
                      <stop offset="50%" stopColor="#22C55E" />
                      <stop offset="100%" stopColor="#16A34A" />
                    </linearGradient>
                    <linearGradient id="leafGrad1" x1="0" y1="0" x2="30" y2="30">
                      <stop offset="0%" stopColor="#86EFAC" />
                      <stop offset="100%" stopColor="#22C55E" />
                    </linearGradient>
                    <linearGradient id="sunGold1" x1="0" y1="0" x2="30" y2="30">
                      <stop offset="0%" stopColor="#FEF08A" />
                      <stop offset="100%" stopColor="#F59E0B" />
                    </linearGradient>
                    <filter id="greenGlow1" x="-20%" y="-20%" width="140%" height="140%">
                      <feDropShadow dx="0" dy="6" stdDeviation="6" floodColor="#16A34A" floodOpacity="0.2" />
                    </filter>
                  </defs>

                  {/* Golden Sun & Clouds */}
                  <circle cx="70" cy="35" r="14" fill="url(#sunGold1)" filter="url(#greenGlow1)" />
                  <circle cx="70" cy="35" r="22" fill="#FEF08A" opacity="0.3" />
                  <path d="M20 54 Q25 44 36 46 Q44 38 54 44 Q62 42 66 50 Q72 54 68 62 L20 62 Z" fill="#FFFFFF" opacity="0.8" />
                  <path d="M125 48 Q130 38 142 40 Q150 32 162 38 Q170 36 174 44 Q180 48 176 56 L125 56 Z" fill="#FFFFFF" opacity="0.85" />

                  {/* Green Hill */}
                  <path d="M15 130 Q100 55 185 130 Z" fill="url(#hillGrad1)" filter="url(#greenGlow1)" />

                  {/* Sprout */}
                  <g transform="translate(98, 48)">
                    <path d="M2 38 Q3 20 2 0" stroke="#15803D" strokeWidth="3" strokeLinecap="round" />
                    <path d="M2 18 C-12 18, -18 6, -2 4 C-2 12, 0 16, 2 18 Z" fill="url(#leafGrad1)" stroke="#16A34A" strokeWidth="1" />
                    <path d="M2 12 C16 12, 22 0, 6 -2 C6 6, 4 10, 2 12 Z" fill="url(#leafGrad1)" stroke="#16A34A" strokeWidth="1" />
                  </g>
                </svg>
              </div>

              {/* Card Content */}
              <div className="relative z-10 space-y-3.5">
                {/* Top Row: Icon & Tag */}
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-[#DDFBE8] border border-emerald-200/80 flex items-center justify-center text-emerald-600 shadow-sm group-hover:scale-105 transition-transform">
                    <Compass className="w-5 h-5" />
                  </div>
                  <span className="px-3 py-1 rounded-full bg-emerald-50/90 border border-emerald-200 text-emerald-600 text-[10px] font-mono font-bold tracking-widest uppercase shadow-sm">
                    ASPIRATIONS
                  </span>
                </div>

                {/* Title & Subtitle */}
                <div>
                  <h3 className="font-serif text-2xl font-bold text-slate-900 leading-tight group-hover:text-emerald-600 transition-colors">
                    Future Together
                  </h3>
                  <p className="text-[11px] font-mono font-bold text-emerald-600 tracking-wider uppercase mt-1">
                    BUCKET LIST &amp; ASPIRATIONS
                  </p>
                </div>

                {/* Description */}
                <p className="text-xs sm:text-[13px] text-slate-600 font-sans leading-relaxed max-w-sm sm:max-w-md">
                  The dream voyages we have pledged to take, our shared home blueprints, and unwritten chapters.
                </p>
              </div>

              {/* Bottom Row */}
              <div className="relative z-10 pt-4 mt-6 border-t border-emerald-200/60 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                  <Sprout className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{MOCK_FUTURE_ITEMS.length} Shared Goals</span>
                </div>
                <span className="text-xs sm:text-sm font-bold text-emerald-600 flex items-center gap-1 group-hover:translate-x-1.5 transition-transform">
                  <span>Open</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          </Link>
        </motion.div>

        {/* ------------------------------------------------------------- */}
        {/* CARD 5: SECRET SANCTUARY VAULT                                */}
        {/* ------------------------------------------------------------- */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="h-full"
        >
          <Link href="/vault" className="block h-full group">
            <div className="h-full relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#F6F4FF] via-[#FAF8FF] to-[#ECE7FE] border border-purple-200/80 p-6 sm:p-7 shadow-[0_10px_30px_rgba(124,58,237,0.07)] hover:shadow-[0_20px_40px_rgba(124,58,237,0.16)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
              {/* Background 3D Shield Art on Right */}
              <div className="absolute right-1 sm:right-4 bottom-2 sm:bottom-4 w-36 sm:w-48 h-28 sm:h-36 pointer-events-none group-hover:scale-105 transition-transform duration-500">
                <svg
                  viewBox="0 0 200 130"
                  className="w-full h-full drop-shadow-md"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    <linearGradient id="shieldGrad1" x1="0" y1="0" x2="60" y2="80" gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stopColor="#C4B5FD" />
                      <stop offset="40%" stopColor="#A78BFA" />
                      <stop offset="100%" stopColor="#7C3AED" />
                    </linearGradient>
                    <linearGradient id="shieldBorder1" x1="0" y1="0" x2="60" y2="80" gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stopColor="#FFFFFF" />
                      <stop offset="100%" stopColor="#DDD6FE" />
                    </linearGradient>
                    <filter id="purpleGlow1" x="-30%" y="-30%" width="160%" height="160%">
                      <feDropShadow dx="0" dy="8" stdDeviation="8" floodColor="#7C3AED" floodOpacity="0.3" />
                    </filter>
                  </defs>

                  {/* Lavender Clouds & Sparkles */}
                  <path d="M50 78 Q58 58 78 62 Q92 48 112 58 Q126 52 134 68 Q146 72 142 86 L50 86 Z" fill="#EDE9FE" opacity="0.85" />
                  <path d="M110 70 Q118 52 136 56 Q148 44 166 54 Q178 50 184 64 Q194 68 190 82 L110 82 Z" fill="#DDD6FE" opacity="0.6" />
                  <path d="M60 38 Q63 45 70 48 Q63 51 60 58 Q57 51 50 48 Q57 45 60 38 Z" fill="#A78BFA" opacity="0.8" />
                  <path d="M168 32 Q170 37 175 39 Q170 41 168 46 Q166 41 161 39 Q166 37 168 32 Z" fill="#C4B5FD" opacity="0.9" />
                  <circle cx="178" cy="68" r="2" fill="#A78BFA" />

                  {/* 3D Security Shield with Lock */}
                  <g transform="translate(100, 24)" filter="url(#purpleGlow1)">
                    <path d="M30 4 L56 14 C56 42 30 58 30 58 C30 58 4 42 4 14 Z" fill="url(#shieldGrad1)" stroke="url(#shieldBorder1)" strokeWidth="2.5" />
                    <circle cx="30" cy="27" r="6" fill="#FFFFFF" />
                    <path d="M27 27 L33 27 L35 41 L25 41 Z" fill="#FFFFFF" />
                    <circle cx="30" cy="27" r="2.5" fill="#7C3AED" />
                  </g>
                </svg>
              </div>

              {/* Card Content */}
              <div className="relative z-10 space-y-3.5">
                {/* Top Row: Icon & Tag */}
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-[#EDE8FF] border border-purple-200/80 flex items-center justify-center text-purple-600 shadow-sm group-hover:scale-105 transition-transform">
                    <Lock className="w-5 h-5" />
                  </div>
                  <span className="px-3 py-1 rounded-full bg-purple-50/90 border border-purple-200 text-purple-600 text-[10px] font-mono font-bold tracking-widest uppercase shadow-sm">
                    CONFIDENTIAL
                  </span>
                </div>

                {/* Title & Subtitle */}
                <div>
                  <h3 className="font-serif text-2xl font-bold text-slate-900 leading-tight group-hover:text-purple-600 transition-colors">
                    Secret Sanctuary Vault
                  </h3>
                  <p className="text-[11px] font-mono font-bold text-purple-600 tracking-wider uppercase mt-1">
                    PASSCODE ENCRYPTED
                  </p>
                </div>

                {/* Description */}
                <p className="text-xs sm:text-[13px] text-slate-600 font-sans leading-relaxed max-w-sm sm:max-w-md">
                  Private voice memos, sacred wedding vow drafts, and confidential recordings meant only for us.
                </p>
              </div>

              {/* Bottom Row */}
              <div className="relative z-10 pt-4 mt-6 border-t border-purple-200/60 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                  <Lock className="w-3.5 h-3.5 text-purple-600" />
                  <span>5 Protected Files</span>
                </div>
                <span className="text-xs sm:text-sm font-bold text-purple-600 flex items-center gap-1 group-hover:translate-x-1.5 transition-transform">
                  <span>Open</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
