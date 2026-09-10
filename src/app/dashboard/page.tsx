"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { APP_CONFIG } from "@/lib/constants";
import { MOCK_MEMORIES } from "@/lib/mockData";
import { MobileBottomNav } from "@/components/dashboard/MobileBottomNav";
import { PageTransition } from "@/components/layout/PageTransition";
import { DaysCounter } from "@/components/ui/DaysCounter";
import { Modal } from "@/components/ui/Modal";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { formatDate } from "@/lib/utils";
import { AmbientSoundPlayer } from "@/components/ui/AmbientSoundPlayer";
import { OpeningExperience } from "@/components/intro";
import { ConstellationCards } from "@/components/dashboard/ConstellationCards";
import { CosmicNavMenu } from "@/components/layout/CosmicNavMenu";
import {
  Clock,
  Camera,
  MapPin,
  Heart,
  ArrowRight,
  Calendar,
  Send,
  Feather,
  Search,
  Bell,
  Sparkles,
  ChevronDown,
  MessageCircle,
} from "lucide-react";

export default function DashboardPage() {
  const [greeting, setGreeting] = useState("Good morning");
  const [showIntro, setShowIntro] = useState(false);
  const [activeMemoryModal, setActiveMemoryModal] = useState<(typeof MOCK_MEMORIES)[0] | null>(null);

  // Quick Action Modal states
  const [isWriteLetterOpen, setIsWriteLetterOpen] = useState(false);
  const [isAddMemoryOpen, setIsAddMemoryOpen] = useState(false);
  const [isAddLoveReasonOpen, setIsAddLoveReasonOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Form states
  const [quickLetterTitle, setQuickLetterTitle] = useState("");
  const [quickLetterContent, setQuickLetterContent] = useState("");
  const [quickMomentTitle, setQuickMomentTitle] = useState("");
  const [quickMomentLocation, setQuickMomentLocation] = useState("");
  const [quickMomentDesc, setQuickMomentDesc] = useState("");
  const [quickReasonTitle, setQuickReasonTitle] = useState("");
  const [quickReasonDesc, setQuickReasonDesc] = useState("");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 18) setGreeting("Good afternoon");
    else setGreeting("Good evening");
  }, []);

  return (
    <PageTransition>
      {/* ------------------------------------------------------------- */}
      {/* CINEMATIC ROMANTIC OPENING ANIMATION EXPERIENCE               */}
      {/* ------------------------------------------------------------- */}
      {showIntro && (
        <OpeningExperience onComplete={() => setShowIntro(false)} />
      )}

      <div className="min-h-screen flex flex-col lg:flex-row -mt-20 sm:-mt-24 bg-[#FFF8F3] text-charcoal-900 font-sans selection:bg-rose-500/20 selection:text-rose-900">
        {/* ================================================================= */}
        {/* 1. LEFT LIGHT FROSTED GLASS SIDEBAR (Desktop)                     */}
        {/* ================================================================= */}
        <aside className="w-72 lg:w-80 shrink-0 hidden lg:flex flex-col bg-white/80 backdrop-blur-2xl border-r border-rose-200/60 z-30 sticky top-0 h-screen overflow-y-auto shadow-[0_10px_40px_rgba(255,107,107,0.06)]">
          <CosmicNavMenu mode="sidebar" variant="light" onPlayOpening={() => setShowIntro(true)} />
        </aside>

        {/* ================================================================= */}
        {/* 2. MAIN CONTENT AREA                                              */}
        {/* ================================================================= */}
        <div className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8 pb-40 relative z-10 bg-gradient-to-b from-[#FFF5F0]/60 via-[#FFF8F3] to-[#FFF0F5]/80">
          
          {/* ------------------------------------------------------------- */}
          {/* TOP BAR: Search Capsule & Partner Profile Indicator           */}
          {/* ------------------------------------------------------------- */}
          <div className="flex items-center justify-between gap-4 pt-1">
            {/* Center / Left Search Pill */}
            <div className="flex-1 max-w-xl mx-auto lg:mx-0">
              <div
                onClick={() => setIsSearchOpen(true)}
                className="group w-full flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/90 hover:bg-white border border-rose-200/60 hover:border-rose-300 shadow-sm hover:shadow-[0_4px_16px_rgba(255,107,107,0.12)] transition-all cursor-pointer backdrop-blur-xl"
              >
                <Search className="w-4 h-4 text-charcoal-400 group-hover:text-rose-500 transition-colors" />
                <span className="text-xs sm:text-sm text-charcoal-400 font-sans font-light select-none">
                  Search memories, letters, moments...
                </span>
              </div>
            </div>

            {/* Right: Notifications & Profile Pill */}
            <div className="hidden sm:flex items-center gap-3 shrink-0">
              {/* Notifications Button */}
              <button
                onClick={() => setIsNotificationsOpen(true)}
                className="relative p-2.5 rounded-full bg-white/90 border border-rose-200/60 hover:border-rose-300 text-charcoal-600 hover:text-rose-600 shadow-sm transition-all focus:outline-none"
                aria-label="Notifications"
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#FF2A6D] ring-2 ring-white animate-pulse" />
              </button>

              {/* Partner Profile Badge */}
              <div className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/90 border border-rose-200/60 shadow-sm">
                <div className="relative w-8 h-8 rounded-full overflow-hidden border border-rose-300 shadow-sm">
                  <Image
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=85"
                    alt={APP_CONFIG.couple.partner1}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-xs font-semibold text-charcoal-900 leading-tight">
                    {APP_CONFIG.couple.partner1} &amp; {APP_CONFIG.couple.partner2}
                  </span>
                  <span className="text-[10px] text-rose-500 font-mono flex items-center gap-0.5">
                    Our Little Universe
                  </span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-charcoal-400 ml-0.5" />
              </div>
            </div>
          </div>

          {/* ------------------------------------------------------------- */}
          {/* 3. HERO SUNSET & SAKURA PANORAMA CANVAS CARD                  */}
          {/* ------------------------------------------------------------- */}
          <section className="relative rounded-[2.5rem] overflow-hidden min-h-[420px] sm:min-h-[480px] flex flex-col justify-between p-6 sm:p-10 lg:p-12 border border-white/90 shadow-[0_20px_50px_rgba(255,107,107,0.15)] group">
            {/* Panoramic Sunrise Lake & Sakura Background Image */}
            <div className="absolute inset-0 z-0">
              <Image
                src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=2000&q=90"
                alt="Golden sunrise over misty lake surrounded by blooming trees"
                fill
                priority
                className="object-cover object-center filter saturate-[1.25] brightness-[0.92] contrast-[1.05] group-hover:scale-105 transition-transform duration-1000"
              />
              {/* Soft Rose & Gold Mist Atmosphere Overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-white/95 via-white/40 to-transparent pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/30 to-transparent pointer-events-none" />
            </div>

            {/* Rustic Wooden Sign & Candle Lantern on Left (Graphic Overlay) */}
            <div className="absolute bottom-6 left-6 sm:left-10 z-10 hidden md:flex items-end gap-3 pointer-events-none opacity-95">
              {/* Rustic Sign */}
              <div className="px-4 py-3 rounded-2xl bg-[#E8D7C3]/90 border border-[#D1BFA8] shadow-md text-charcoal-800 text-left backdrop-blur-sm">
                <span className="font-serif italic text-xs block leading-tight font-medium">
                  Good<br />
                  Things<br />
                  Happen<br />
                  Here ♡
                </span>
              </div>
              {/* Warm Lantern */}
              <div className="w-8 h-12 rounded-lg bg-gradient-to-b from-amber-900 to-amber-950 border border-amber-400/80 shadow-[0_0_20px_rgba(251,191,36,0.6)] flex items-center justify-center">
                <div className="w-3.5 h-5 rounded-full bg-amber-300 shadow-[0_0_12px_#fbbf24] animate-pulse" />
              </div>
            </div>

            {/* Top Bar inside Hero: Greeting Tag + Utility Controls */}
            <div className="flex items-center justify-between gap-4 relative z-20">
              {/* Left Sub-Greeting */}
              <div>
                <span className="text-[11px] sm:text-xs uppercase tracking-[0.25em] font-mono text-rose-600 font-bold flex items-center gap-1.5">
                  {greeting.toUpperCase()}
                </span>
                <span className="text-xs sm:text-sm font-mono tracking-widest text-charcoal-900 font-bold uppercase block mt-0.5">
                  {APP_CONFIG.couple.partner1.toUpperCase()} &amp; {APP_CONFIG.couple.partner2.toUpperCase()} ♡
                </span>
              </div>

              {/* Right Hero Controls: Opening Pill + Music Chip + Controls */}
              <div className="flex items-center gap-2 sm:gap-3">
                {/* ✦ OPENING Button Pill */}
                <button
                  onClick={() => setShowIntro(true)}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/90 hover:bg-white border border-rose-300/60 text-xs font-mono font-bold text-rose-600 uppercase tracking-wider shadow-sm transition-all hover:scale-105 focus:outline-none"
                  title="Play Opening Cinematic Animation"
                >
                  <Sparkles className="w-3.5 h-3.5 text-rose-500" />
                  <span>✦ OPENING</span>
                </button>

                {/* Minimal Soundtrack Player (Top bar) */}
                <div className="hidden md:block">
                  <AmbientSoundPlayer variant="minimal" className="bg-white/90 backdrop-blur-xl border-rose-200/80 shadow-sm" />
                </div>

                {/* Search Button */}
                <button
                  onClick={() => setIsSearchOpen(true)}
                  className="w-9 h-9 rounded-full bg-white/90 backdrop-blur-xl border border-rose-200/80 hover:border-rose-400 shadow-sm flex items-center justify-center text-charcoal-700 hover:text-rose-600 transition-all hover:scale-105 focus:outline-none"
                  title="Search Sanctuary"
                  aria-label="Search"
                >
                  <Search className="w-4 h-4" />
                </button>

                {/* Notifications Button */}
                <button
                  onClick={() => setIsNotificationsOpen(true)}
                  className="relative w-9 h-9 rounded-full bg-white/90 backdrop-blur-xl border border-rose-200/80 hover:border-rose-400 shadow-sm flex items-center justify-center text-charcoal-700 hover:text-rose-600 transition-all hover:scale-105 focus:outline-none"
                  title="Notifications"
                  aria-label="Notifications"
                >
                  <Bell className="w-4 h-4" />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#FF2A6D] ring-2 ring-white animate-pulse" />
                </button>

                {/* Partner Avatar Profile */}
                <div className="relative w-9 h-9 rounded-full overflow-hidden border-2 border-rose-400 shadow-sm">
                  <Image
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=85"
                    alt={APP_CONFIG.couple.partner1}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Hero Main Body: Centered Headline, Subtext, and Centered Button */}
            <div className="relative z-20 my-auto py-6 sm:py-8 flex flex-col items-center justify-center text-center max-w-2xl mx-auto space-y-4">
              <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-normal text-charcoal-900 tracking-tight leading-[1.1]">
                Welcome back to our <br />
                <span className="font-serif italic text-rose-500 inline-flex items-center justify-center gap-2">
                  little universe.
                  <span className="inline-block text-3xl sm:text-4xl text-rose-400 animate-pulse font-serif not-italic">
                    ♡
                  </span>
                </span>
              </h1>

              <p className="text-xs sm:text-sm text-charcoal-600 font-sans leading-relaxed max-w-xl mx-auto">
                Every memory you preserve here remains encrypted in time.<br />
                Here is a snapshot of our journey together today.
              </p>

              {/* Centered Main Action: Continue Our Journey Button */}
              <div className="pt-2 flex justify-center">
                <Link href="/timeline">
                  <button
                    type="button"
                    className="inline-flex items-center gap-2.5 px-7 py-3 rounded-full bg-gradient-to-r from-[#FF517A] via-[#E14389] to-[#9D4EDD] hover:from-[#FF3B69] hover:to-[#8E3ACD] text-white text-xs sm:text-sm font-semibold shadow-[0_8px_24px_rgba(255,81,122,0.4)] hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4 fill-white/20 text-white" />
                    <span>Continue Our Journey</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </Link>
              </div>
            </div>

            {/* Bottom Floating Elements: Right Side Player & Calligraphy */}
            <div className="relative z-20 flex flex-col sm:flex-row items-end justify-between gap-4 pt-4 mt-auto">
              {/* Spacer on Left to balance wooden sign */}
              <div className="hidden md:block w-48" />

              {/* Right Corner: Cursive Typography & Music Player */}
              <div className="flex flex-col items-end gap-3 ml-auto">
                {/* Floating Cursive Calligraphy */}
                <div className="text-right pointer-events-none hidden lg:block">
                  <span className="font-serif italic text-charcoal-800 text-base sm:text-lg font-normal block leading-tight">
                    Same People
                  </span>
                  <span className="font-serif italic text-charcoal-700 text-sm sm:text-base block leading-tight">
                    A Thousand
                  </span>
                  <span className="font-serif italic text-rose-500 text-sm sm:text-base font-normal block leading-tight">
                    Beautiful Moments ♡
                  </span>
                </div>

                {/* Romantic Songs Player Widget (Bottom Right Pill) */}
                <AmbientSoundPlayer variant="dark-hero" className="w-full sm:w-auto" />
              </div>
            </div>
          </section>

          {/* ------------------------------------------------------------- */}
          {/* 4. MILESTONES THROUGH TIME (Exact match to Mockup)            */}
          {/* ------------------------------------------------------------- */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="rounded-[2.5rem] bg-white/85 backdrop-blur-2xl border border-white/90 p-6 sm:p-8 lg:p-10 shadow-[0_15px_45px_rgba(255,107,107,0.08)] relative overflow-hidden group"
          >
            {/* Subtle background ambient wave */}
            <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-rose-200/20 rounded-full blur-3xl pointer-events-none" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
              {/* Left Column: Icon, Tags, Headline, Description, Quick Actions Bar */}
              <div className="lg:col-span-7 space-y-5">
                <div className="flex items-center gap-3">
                  {/* Pink Clock Icon Rounded Square */}
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#FF5E7E] to-[#E6396E] text-white flex items-center justify-center shadow-md shadow-rose-500/25 shrink-0">
                    <Clock className="w-6 h-6" />
                  </div>

                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="text-xs font-mono uppercase tracking-[0.2em] font-bold text-rose-600">
                      OUR STORY
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-600 font-mono text-[11px] font-bold tracking-wider uppercase">
                      <Calendar className="w-3 h-3 text-rose-500" />
                      CHRONOLOGY
                    </span>
                    <span className="text-rose-400 text-sm font-serif italic">♡</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-normal text-charcoal-900 tracking-tight leading-tight">
                    Milestones Through Time
                  </h2>
                  <p className="text-xs sm:text-sm text-charcoal-600 font-sans leading-relaxed max-w-lg">
                    From our first glance at the café to every milestone that cemented our journey — a timeline of us.
                  </p>
                </div>

                {/* 3 Interactive Quick Actions Pills */}
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  {/* Action 1: Write Love Letter */}
                  <button
                    onClick={() => setIsWriteLetterOpen(true)}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/95 hover:bg-white text-charcoal-800 border border-rose-200/80 shadow-sm hover:shadow-md text-xs sm:text-sm font-medium transition-all hover:scale-105 focus:outline-none shrink-0"
                  >
                    <Feather className="w-3.5 h-3.5 text-rose-500" />
                    <span className="font-sans">Write Love Letter</span>
                  </button>

                  {/* Action 2: Add New Moment */}
                  <button
                    onClick={() => setIsAddMemoryOpen(true)}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#FFEBD7]/90 hover:bg-[#FFEBD7] text-amber-950 border border-amber-200/80 shadow-sm hover:shadow-md text-xs sm:text-sm font-medium transition-all hover:scale-105 focus:outline-none shrink-0"
                  >
                    <Camera className="w-3.5 h-3.5 text-amber-600" />
                    <span className="font-sans">Add New Moment</span>
                  </button>

                  {/* Action 3: Add Reason I Love You */}
                  <button
                    onClick={() => setIsAddLoveReasonOpen(true)}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#F3E8FF]/90 hover:bg-[#F3E8FF] text-purple-950 border border-purple-200/80 shadow-sm hover:shadow-md text-xs sm:text-sm font-medium transition-all hover:scale-105 focus:outline-none shrink-0"
                  >
                    <Heart className="w-3.5 h-3.5 text-purple-600 fill-purple-500" />
                    <span className="font-sans">Add Reason I Love You</span>
                  </button>
                </div>
              </div>

              {/* Right Column: Layered Polaroid with Couple Hand Heart & Washi Tape */}
              <div className="lg:col-span-5 flex justify-center lg:justify-end relative">
                <div className="relative w-64 sm:w-72 pt-4 pb-2">
                  {/* Background Tilt Polaroid */}
                  <div className="absolute top-0 right-4 w-44 sm:w-52 aspect-[4/5] bg-white p-2.5 pb-8 rounded-xl shadow-lg transform rotate-[6deg] border border-stone-200 pointer-events-none opacity-80">
                    <div className="relative w-full h-full rounded-lg overflow-hidden bg-stone-100">
                      <Image
                        src="https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=600&q=80"
                        alt="First café coffee date"
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>

                  {/* Main Foreground Polaroid: Hand Heart Sunset */}
                  <div className="relative w-52 sm:w-60 bg-white p-3 pb-9 rounded-2xl shadow-2xl transform -rotate-[2deg] group-hover:rotate-0 transition-transform duration-500 border border-stone-200 z-10">
                    {/* Washi Tape at Top */}
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-20 h-5 bg-rose-200/80 border border-rose-300/60 rounded-sm shadow-sm z-20 transform rotate-1" />

                    <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-stone-100">
                      <Image
                        src="https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=800&q=85"
                        alt="Couple hands forming heart in front of sunrise"
                        fill
                        className="object-cover"
                      />
                    </div>
                    {/* Handwritten caption on polaroid bottom */}
                    <div className="absolute bottom-2.5 left-0 right-0 text-center">
                      <span className="font-serif italic text-charcoal-700 text-xs sm:text-sm tracking-wide">
                        Our first moment ♡
                      </span>
                    </div>
                  </div>

                  {/* Dried Flowers Sprig Accent */}
                  <div className="absolute -bottom-2 -left-3 z-20 text-xl pointer-events-none drop-shadow-sm">
                    🌸 🌿
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* ------------------------------------------------------------- */}
          {/* 5. JOURNEY DURATION LIVE COUNTER CARD                         */}
          {/* ------------------------------------------------------------- */}
          <section className="rounded-[2.5rem] bg-white/85 backdrop-blur-2xl border border-white/90 p-6 sm:p-8 shadow-[0_15px_45px_rgba(255,107,107,0.06)]">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-50 border border-rose-200">
                <Calendar className="w-3.5 h-3.5 text-rose-600" />
                <span className="text-[11px] font-mono uppercase tracking-widest font-bold text-rose-700">
                  JOURNEY DURATION 💖
                </span>
              </div>

              <Link
                href="/timeline"
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white hover:bg-rose-50 border border-rose-200/80 text-xs text-rose-600 transition-all font-medium group"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[11px] uppercase tracking-wider font-mono">
                  STILL WRITING OUR STORY...
                </span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>

            <DaysCounter showDetailed={true} />
          </section>

          {/* ------------------------------------------------------------- */}
          {/* 6. OTHER CONSTELLATION PORTALS (Gallery, Letters, Places)     */}
          {/* ------------------------------------------------------------- */}
          <ConstellationCards />
        </div>

        {/* 7. MOBILE BOTTOM NAV (Mobile screens) */}
        <div className="lg:hidden">
          <MobileBottomNav />
        </div>

        {/* ================================================================= */}
        {/* 8. INTERACTIVE MODALS                                             */}
        {/* ================================================================= */}

        {/* Memory Detail Modal */}
        {activeMemoryModal && (
          <Modal
            isOpen={Boolean(activeMemoryModal)}
            onClose={() => setActiveMemoryModal(null)}
            title={activeMemoryModal.title}
            subtitle={`${formatDate(activeMemoryModal.date)} • ${activeMemoryModal.location || ""}`}
            size="lg"
          >
            <div className="space-y-6">
              <div className="relative aspect-[16/10] rounded-2xl overflow-hidden shadow-md">
                <Image
                  src={activeMemoryModal.media_url || ""}
                  alt={activeMemoryModal.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="space-y-3">
                <Badge variant="gold">{activeMemoryModal.category}</Badge>
                <p className="text-sm sm:text-base text-charcoal-700 font-sans leading-relaxed">
                  {activeMemoryModal.description}
                </p>
              </div>
            </div>
          </Modal>
        )}

        {/* Quick Write Letter Modal */}
        <Modal
          isOpen={isWriteLetterOpen}
          onClose={() => setIsWriteLetterOpen(false)}
          title="Compose a Love Letter"
          subtitle="Pen an intimate note for your partner's eyes."
          size="md"
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setIsWriteLetterOpen(false);
              setQuickLetterTitle("");
              setQuickLetterContent("");
            }}
            className="space-y-4"
          >
            <div>
              <label className="block text-xs uppercase tracking-wider text-rose-600 mb-1.5 font-mono font-medium">
                Title
              </label>
              <input
                type="text"
                required
                placeholder="e.g., A midnight thought for you"
                value={quickLetterTitle}
                onChange={(e) => setQuickLetterTitle(e.target.value)}
                className="w-full rounded-xl bg-white border border-rose-200/80 px-4 py-2.5 text-sm text-charcoal-900 focus:outline-none focus:border-rose-400 shadow-sm"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-rose-600 mb-1.5 font-mono font-medium">
                Letter Content
              </label>
              <textarea
                required
                rows={5}
                placeholder="Write with an open heart..."
                value={quickLetterContent}
                onChange={(e) => setQuickLetterContent(e.target.value)}
                className="w-full rounded-xl bg-white border border-rose-200/80 p-3.5 text-sm text-charcoal-900 font-serif focus:outline-none focus:border-rose-400 shadow-sm"
              />
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-rose-100">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setIsWriteLetterOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="rose"
                size="sm"
                icon={<Send className="w-3.5 h-3.5" />}
              >
                Save in Letters Archive
              </Button>
            </div>
          </form>
        </Modal>

        {/* Quick Add Memory Modal */}
        <Modal
          isOpen={isAddMemoryOpen}
          onClose={() => setIsAddMemoryOpen(false)}
          title="Capture a New Moment"
          subtitle="Preserve a photograph and chronicle this chapter."
          size="md"
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setIsAddMemoryOpen(false);
              setQuickMomentTitle("");
              setQuickMomentLocation("");
              setQuickMomentDesc("");
            }}
            className="space-y-4"
          >
            <div>
              <label className="block text-xs uppercase tracking-wider text-amber-700 mb-1.5 font-mono font-medium">
                Title
              </label>
              <input
                type="text"
                required
                placeholder="e.g., Sunset by the mountain lake"
                value={quickMomentTitle}
                onChange={(e) => setQuickMomentTitle(e.target.value)}
                className="w-full rounded-xl bg-white border border-amber-200/80 px-4 py-2.5 text-sm text-charcoal-900 focus:outline-none focus:border-amber-400 shadow-sm"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-amber-700 mb-1.5 font-mono font-medium">
                Location
              </label>
              <input
                type="text"
                placeholder="e.g., Lake Overlook Cabin"
                value={quickMomentLocation}
                onChange={(e) => setQuickMomentLocation(e.target.value)}
                className="w-full rounded-xl bg-white border border-amber-200/80 px-4 py-2.5 text-sm text-charcoal-900 focus:outline-none focus:border-amber-400 shadow-sm"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-amber-700 mb-1.5 font-mono font-medium">
                Memory Description
              </label>
              <textarea
                rows={3}
                placeholder="What made this moment unforgettable?"
                value={quickMomentDesc}
                onChange={(e) => setQuickMomentDesc(e.target.value)}
                className="w-full rounded-xl bg-white border border-amber-200/80 p-3.5 text-sm text-charcoal-900 font-sans focus:outline-none focus:border-amber-400 shadow-sm"
              />
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-amber-100">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setIsAddMemoryOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" variant="gold" size="sm">
                Save Moment
              </Button>
            </div>
          </form>
        </Modal>

        {/* Quick Add Reason Modal */}
        <Modal
          isOpen={isAddLoveReasonOpen}
          onClose={() => setIsAddLoveReasonOpen(false)}
          title="Add a Reason Why I Love You"
          subtitle="Record another detail of affection to cherish forever."
          size="md"
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setIsAddLoveReasonOpen(false);
              setQuickReasonTitle("");
              setQuickReasonDesc("");
            }}
            className="space-y-4"
          >
            <div>
              <label className="block text-xs uppercase tracking-wider text-purple-700 mb-1.5 font-mono font-medium">
                Reason Headline
              </label>
              <input
                type="text"
                required
                placeholder="e.g., How your laughter lights up the entire room"
                value={quickReasonTitle}
                onChange={(e) => setQuickReasonTitle(e.target.value)}
                className="w-full rounded-xl bg-white border border-purple-200/80 px-4 py-2.5 text-sm text-charcoal-900 focus:outline-none focus:border-purple-400 shadow-sm"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-purple-700 mb-1.5 font-mono font-medium">
                Description
              </label>
              <textarea
                rows={3}
                placeholder="Why this makes your heart beat faster..."
                value={quickReasonDesc}
                onChange={(e) => setQuickReasonDesc(e.target.value)}
                className="w-full rounded-xl bg-white border border-purple-200/80 p-3.5 text-sm text-charcoal-900 font-serif focus:outline-none focus:border-purple-400 shadow-sm"
              />
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-purple-100">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setIsAddLoveReasonOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" variant="rose" size="sm">
                Save Reason
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </PageTransition>
  );
}
