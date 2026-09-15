"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { APP_CONFIG } from "@/lib/constants";
import { useAuth } from "@/lib/auth/AuthContext";
import { useToast } from "@/lib/toast/ToastContext";
import { cn } from "@/lib/utils";
import {
  ChevronDown,
  Sparkles,
  Heart,
  Mail,
  Camera,
  MapPin,
  Compass,
  Lock,
  BookOpen,
  Settings,
  LogOut,
  Calendar,
  ArrowRight,
} from "lucide-react";

export interface CoupleProfileDropdownProps {
  onOpenIntro?: () => void;
  onOpenWriteLetter?: () => void;
  onOpenAddMemory?: () => void;
  onOpenAddReason?: () => void;
  onOpenSettings?: () => void;
  className?: string;
}

export function CoupleProfileDropdown({
  onOpenIntro,
  onOpenWriteLetter,
  onOpenAddMemory,
  onOpenAddReason,
  onOpenSettings,
  className,
}: CoupleProfileDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { user, isAdmin, signOut, switchDemoRole } = useAuth();
  const toast = useToast();

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Calculate days together
  const startDate = new Date(APP_CONFIG.couple.relationshipStartDate);
  const now = new Date();
  const diffDays = Math.max(
    1,
    Math.floor((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
  );

  const handleSignOut = async () => {
    setIsOpen(false);
    await signOut();
    toast?.info("Signed Out", "Sanctuary locked.");
    router.push("/");
  };

  const currentRole = user?.name?.toLowerCase() === "surya" ? "surya" : isAdmin ? "admin" : "tharani";

  return (
    <div className={cn("relative inline-block text-left", className)} ref={dropdownRef}>
      {/* ------------------------------------------------------------- */}
      {/* 1. TRIGGER PILL (Matches user screenshot perfectly)           */}
      {/* ------------------------------------------------------------- */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        type="button"
        className={cn(
          "group flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/95 hover:bg-white border transition-all duration-300 shadow-sm select-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-rose-400/40 backdrop-blur-xl",
          isOpen
            ? "border-rose-400 shadow-[0_4px_20px_rgba(255,107,107,0.2)] ring-2 ring-rose-400/20"
            : "border-rose-200/80 hover:border-rose-300 hover:shadow-[0_4px_15px_rgba(255,107,107,0.12)]"
        )}
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label="Couple sanctuary features menu"
      >
        {/* Avatar circle with soft pink ring */}
        <div className="relative w-8 h-8 rounded-full overflow-hidden border-2 border-rose-300 shadow-sm shrink-0 group-hover:scale-105 transition-transform">
          <Image
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=85"
            alt={APP_CONFIG.couple.partner1}
            fill
            className="object-cover"
          />
        </div>

        {/* Text Details */}
        <div className="flex flex-col text-left">
          <span className="text-xs font-semibold text-charcoal-900 leading-tight group-hover:text-rose-600 transition-colors font-sans">
            {APP_CONFIG.couple.partner1} &amp; {APP_CONFIG.couple.partner2}
          </span>
          <span className="text-[10px] text-rose-500 font-mono font-medium flex items-center gap-1 tracking-tight">
            Our Little Universe
          </span>
        </div>

        {/* Dropdown Chevron */}
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="ml-0.5 text-charcoal-400 group-hover:text-rose-500 transition-colors"
        >
          <ChevronDown className="w-3.5 h-3.5" />
        </motion.div>
      </button>

      {/* ------------------------------------------------------------- */}
      {/* 2. RICH EXPANDED FEATURES DROPDOWN PANEL                      */}
      {/* ------------------------------------------------------------- */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="absolute right-0 top-full mt-2 w-[340px] sm:w-[380px] rounded-3xl bg-white/95 backdrop-blur-2xl border border-rose-200/90 shadow-[0_20px_50px_rgba(255,107,107,0.18)] z-50 overflow-hidden text-charcoal-900 font-sans"
          >
            {/* Header: Couple Sanctuary Monogram & Status */}
            <div className="relative p-5 bg-gradient-to-br from-[#FFF0F3] via-[#FFF8F5] to-[#FFE8EE] border-b border-rose-100 overflow-hidden">
              {/* Background ambient glow */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-rose-300/20 rounded-full blur-2xl pointer-events-none" />

              <div className="relative z-10 flex items-center justify-between gap-3">
                {/* Connected Dual Avatars */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center -space-x-2">
                    <div className="relative w-11 h-11 rounded-full overflow-hidden border-2 border-white shadow-md">
                      <Image
                        src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=85"
                        alt={APP_CONFIG.couple.partner1}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="relative w-11 h-11 rounded-full overflow-hidden border-2 border-white shadow-md">
                      <Image
                        src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=85"
                        alt={APP_CONFIG.couple.partner2}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>

                  <div>
                    <h3 className="font-serif text-base font-semibold text-charcoal-900 leading-tight">
                      {APP_CONFIG.couple.partner1} &amp; {APP_CONFIG.couple.partner2}
                    </h3>
                    <p className="text-[11px] text-rose-600 font-medium flex items-center gap-1 mt-0.5">
                      <Heart className="w-3 h-3 fill-rose-500 text-rose-500" />
                      <span>{diffDays} Days of Love</span>
                    </p>
                  </div>
                </div>

                {/* Anniversary Badge */}
                <div className="text-right">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/90 border border-rose-200/80 text-[10px] font-mono text-charcoal-700 font-medium shadow-xs">
                    <Calendar className="w-3 h-3 text-rose-500" />
                    <span>{APP_CONFIG.couple.anniversary}</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Main Interactive Feature Actions */}
            <div className="p-3 space-y-1 max-h-[420px] overflow-y-auto custom-scrollbar">
              {/* Highlight Action 1: Replay Starting Animation */}
              <button
                onClick={() => {
                  setIsOpen(false);
                  if (onOpenIntro) onOpenIntro();
                }}
                className="w-full group flex items-center justify-between p-3 rounded-2xl bg-gradient-to-r from-rose-500/10 via-pink-500/5 to-purple-500/10 hover:from-rose-500/15 hover:to-purple-500/15 border border-rose-200/70 hover:border-rose-300 transition-all text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-rose-500 to-pink-500 text-white flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                    <Sparkles className="w-4.5 h-4.5 text-white" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-charcoal-900 block group-hover:text-rose-600 transition-colors">
                      Replay Starting Animation
                    </span>
                    <span className="text-[10px] text-charcoal-500 block">
                      7-scene universe opening with music
                    </span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-md bg-rose-500 text-white text-[9px] font-mono font-bold">
                  PLAY
                </span>
              </button>

              {/* Quick Actions Grid */}
              <div className="pt-2 pb-1 px-1">
                <span className="text-[10px] uppercase font-mono tracking-widest text-charcoal-400 font-semibold block mb-2">
                  Sanctuary Features
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {/* Write Letter */}
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      if (onOpenWriteLetter) onOpenWriteLetter();
                    }}
                    className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white hover:bg-rose-50/70 border border-rose-100 hover:border-rose-200 transition-all text-left group"
                  >
                    <div className="p-2 rounded-lg bg-sky-100 text-sky-600 group-hover:scale-105 transition-transform">
                      <Mail className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <span className="text-xs font-medium text-charcoal-800 block leading-snug">
                        Write Letter
                      </span>
                      <span className="text-[9px] text-charcoal-400 block">Sealed notes</span>
                    </div>
                  </button>

                  {/* Add Memory */}
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      if (onOpenAddMemory) onOpenAddMemory();
                    }}
                    className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white hover:bg-rose-50/70 border border-rose-100 hover:border-rose-200 transition-all text-left group"
                  >
                    <div className="p-2 rounded-lg bg-rose-100 text-rose-600 group-hover:scale-105 transition-transform">
                      <Camera className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <span className="text-xs font-medium text-charcoal-800 block leading-snug">
                        Add Memory
                      </span>
                      <span className="text-[9px] text-charcoal-400 block">Photos &amp; moments</span>
                    </div>
                  </button>

                  {/* Add Reason */}
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      if (onOpenAddReason) onOpenAddReason();
                    }}
                    className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white hover:bg-rose-50/70 border border-rose-100 hover:border-rose-200 transition-all text-left group"
                  >
                    <div className="p-2 rounded-lg bg-purple-100 text-purple-600 group-hover:scale-105 transition-transform">
                      <Heart className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <span className="text-xs font-medium text-charcoal-800 block leading-snug">
                        Love Reasons
                      </span>
                      <span className="text-[9px] text-charcoal-400 block">100 things I love</span>
                    </div>
                  </button>

                  {/* Vault */}
                  <Link
                    href="/vault"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white hover:bg-rose-50/70 border border-rose-100 hover:border-rose-200 transition-all text-left group"
                  >
                    <div className="p-2 rounded-lg bg-fuchsia-100 text-fuchsia-600 group-hover:scale-105 transition-transform">
                      <Lock className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <span className="text-xs font-medium text-charcoal-800 block leading-snug">
                        Secret Vault
                      </span>
                      <span className="text-[9px] text-charcoal-400 block">Audio &amp; secrets</span>
                    </div>
                  </Link>

                  {/* Special Places */}
                  <Link
                    href="/places"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white hover:bg-rose-50/70 border border-rose-100 hover:border-rose-200 transition-all text-left group"
                  >
                    <div className="p-2 rounded-lg bg-emerald-100 text-emerald-600 group-hover:scale-105 transition-transform">
                      <MapPin className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <span className="text-xs font-medium text-charcoal-800 block leading-snug">
                        Our Places
                      </span>
                      <span className="text-[9px] text-charcoal-400 block">Map coordinates</span>
                    </div>
                  </Link>

                  {/* Future Bucket List */}
                  <Link
                    href="/future"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white hover:bg-rose-50/70 border border-rose-100 hover:border-rose-200 transition-all text-left group"
                  >
                    <div className="p-2 rounded-lg bg-amber-100 text-amber-600 group-hover:scale-105 transition-transform">
                      <Compass className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <span className="text-xs font-medium text-charcoal-800 block leading-snug">
                        Future Dreams
                      </span>
                      <span className="text-[9px] text-charcoal-400 block">Bucket list</span>
                    </div>
                  </Link>
                </div>
              </div>

              {/* Navigation Links */}
              <div className="pt-2 border-t border-rose-100 space-y-1">
                <Link
                  href="/timeline"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-between px-3 py-2 rounded-xl text-xs text-charcoal-700 hover:bg-rose-50/80 hover:text-rose-600 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <BookOpen className="w-3.5 h-3.5 text-rose-500" />
                    <span>View Our Story &amp; Milestones</span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-charcoal-400" />
                </Link>

                <button
                  onClick={() => {
                    setIsOpen(false);
                    if (onOpenSettings) onOpenSettings();
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs text-charcoal-700 hover:bg-rose-50/80 hover:text-rose-600 transition-colors text-left"
                >
                  <div className="flex items-center gap-2.5">
                    <Settings className="w-3.5 h-3.5 text-rose-500" />
                    <span>Sanctuary Settings &amp; Preferences</span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-charcoal-400" />
                </button>
              </div>

              {/* Switch Active Partner View (Demo Mode) */}
              <div className="pt-2 border-t border-rose-100 px-1">
                <span className="text-[9px] uppercase font-mono tracking-widest text-charcoal-400 font-semibold block mb-1.5">
                  Switch Partner View (Demo)
                </span>
                <div className="grid grid-cols-3 gap-1.5">
                  <button
                    onClick={() => {
                      switchDemoRole?.("tharani");
                      toast?.success("View Switched", "Now viewing as Tharani");
                      setIsOpen(false);
                    }}
                    className={cn(
                      "text-[10px] py-1.5 px-2 rounded-lg font-medium transition-all text-center",
                      currentRole === "tharani"
                        ? "bg-rose-500 text-white shadow-xs"
                        : "bg-rose-50/70 text-charcoal-700 hover:bg-rose-100/70"
                    )}
                  >
                    Tharani
                  </button>
                  <button
                    onClick={() => {
                      switchDemoRole?.("surya");
                      toast?.success("View Switched", "Now viewing as Surya");
                      setIsOpen(false);
                    }}
                    className={cn(
                      "text-[10px] py-1.5 px-2 rounded-lg font-medium transition-all text-center",
                      currentRole === "surya"
                        ? "bg-rose-500 text-white shadow-xs"
                        : "bg-rose-50/70 text-charcoal-700 hover:bg-rose-100/70"
                    )}
                  >
                    Surya
                  </button>
                  <button
                    onClick={() => {
                      switchDemoRole?.("admin");
                      toast?.success("Admin Mode", "Unlocked full control");
                      setIsOpen(false);
                    }}
                    className={cn(
                      "text-[10px] py-1.5 px-2 rounded-lg font-bold transition-all text-center",
                      isAdmin
                        ? "bg-purple-600 text-white shadow-xs"
                        : "bg-purple-50 text-purple-700 hover:bg-purple-100"
                    )}
                  >
                    Admin
                  </button>
                </div>
              </div>
            </div>

            {/* Footer / Lock Sanctuary */}
            <div className="p-3 bg-rose-50/50 border-t border-rose-100 flex items-center justify-between">
              <span className="text-[10px] font-mono text-charcoal-400">
                Encrypted &bull; Private
              </span>
              <button
                onClick={handleSignOut}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white hover:bg-rose-100/80 border border-rose-200 text-[11px] font-medium text-rose-600 transition-colors shadow-xs"
              >
                <LogOut className="w-3 h-3" />
                <span>Lock Sanctuary</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
