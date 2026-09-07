"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { APP_CONFIG } from "@/lib/constants";
import { MOCK_MEMORIES, MOCK_LOVE_REASONS } from "@/lib/mockData";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { MobileBottomNav } from "@/components/dashboard/MobileBottomNav";
import { PageTransition } from "@/components/layout/PageTransition";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { DaysCounter } from "@/components/ui/DaysCounter";
import { Modal } from "@/components/ui/Modal";
import { formatDate } from "@/lib/utils";
import {
  Clock,
  Camera,
  Mail,
  MapPin,
  Heart,
  Compass,
  Lock,
  ArrowRight,
  Calendar,
  Send,
  Feather,
} from "lucide-react";

export default function DashboardPage() {
  const [greeting, setGreeting] = useState("Welcome back");
  const [activeMemoryModal, setActiveMemoryModal] = useState<(typeof MOCK_MEMORIES)[0] | null>(null);

  // Quick Action Modal states
  const [isWriteLetterOpen, setIsWriteLetterOpen] = useState(false);
  const [isAddMemoryOpen, setIsAddMemoryOpen] = useState(false);
  const [isAddLoveReasonOpen, setIsAddLoveReasonOpen] = useState(false);

  // Form states
  const [quickLetterTitle, setQuickLetterTitle] = useState("");
  const [quickLetterContent, setQuickLetterContent] = useState("");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 18) setGreeting("Good afternoon");
    else setGreeting("Good evening");
  }, []);

  const latestMemory = MOCK_MEMORIES[0];
  const favoriteMemory = MOCK_MEMORIES[1];

  const navigationDimensions = [
    {
      id: "story",
      title: "Our Story",
      subtitle: "Milestones through time",
      description: "From our first glance at the café to every milestone that cemented our journey.",
      href: "/timeline",
      count: "6 Major Milestones",
      icon: <Clock className="w-6 h-6 text-gold-400" />,
      accent: "gold",
      tag: "Chronology",
    },
    {
      id: "memories",
      title: "Memories & Gallery",
      subtitle: "Visual snapshots",
      description: "Curated photo albums, spontaneous laughter, and quiet moments captured forever.",
      href: "/gallery",
      count: "6 Preserved Moments",
      icon: <Camera className="w-6 h-6 text-rose-400" />,
      accent: "rose",
      tag: "Photographs",
    },
    {
      id: "letters",
      title: "Preserved Letters",
      subtitle: "Sealed & open words",
      description: "Intimate love notes, digital wax seals, and letters time-locked for future anniversaries.",
      href: "/letters",
      count: "4 Sealed Envelopes",
      icon: <Mail className="w-6 h-6 text-gold-400" />,
      accent: "gold",
      tag: "Correspondence",
    },
    {
      id: "places",
      title: "Our Special Places",
      subtitle: "Geographic coordinates",
      description: "Coordinates of our favorite lookout points, intimate cafés, and unforgettable road trips.",
      href: "/places",
      count: "4 Pinned Locations",
      icon: <MapPin className="w-6 h-6 text-rose-400" />,
      accent: "rose",
      tag: "Coordinates",
    },
    {
      id: "things-i-love",
      title: "Things I Love About You",
      subtitle: "Reasons I adore you",
      description: "A growing collection of the little habits, deep virtues, and endearing quirks that define you.",
      href: "/things-i-love",
      count: `${MOCK_LOVE_REASONS.length} Recorded Reasons`,
      icon: <Heart className="w-6 h-6 text-rose-400" />,
      accent: "rose",
      tag: "Devotion",
    },
    {
      id: "future",
      title: "Future Together",
      subtitle: "Bucket list & aspirations",
      description: "The dream voyages we have pledged to take, our shared home blueprints, and unwritten chapters.",
      href: "/future",
      count: "5 Shared Goals",
      icon: <Compass className="w-6 h-6 text-gold-400" />,
      accent: "gold",
      tag: "Aspirations",
    },
    {
      id: "vault",
      title: "Secret Sanctuary Vault",
      subtitle: "Passcode encrypted",
      description: "Private voice memos, sacred wedding vow drafts, and confidential recordings meant only for us.",
      href: "/vault",
      count: "3 Protected Files",
      icon: <Lock className="w-6 h-6 text-cream-200" />,
      accent: "gold",
      tag: "Confidential",
    },
  ];

  return (
    <PageTransition>
      {/* 1. TOP SANCTUARY HEADER */}
      <DashboardHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-28 space-y-10 sm:space-y-14">
        {/* ------------------------------------------------------------- */}
        {/* 2. WELCOME & SANCTUARY STATUS HERO                            */}
        {/* ------------------------------------------------------------- */}
        <section className="relative rounded-3xl bg-gradient-to-b from-white via-universe-900 to-universe-850 border border-universe-750/70 p-6 sm:p-10 shadow-glass backdrop-blur-xl overflow-hidden">
          {/* Subtle Ambient Radial Lighting */}
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-rose-400/[0.12] rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-peach-400/[0.15] rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 relative z-10">
            {/* Greeting & Headline */}
            <div className="space-y-3 max-w-2xl">
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase tracking-[0.2em] font-mono text-rose-600 font-semibold">
                  {greeting}, {APP_CONFIG.couple.partner1} &amp; {APP_CONFIG.couple.partner2}
                </span>
                <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-pulse" />
              </div>

              <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-cream-50 tracking-tight leading-tight">
                Welcome back to our <br className="hidden sm:inline" />
                <span className="rose-gradient-text italic font-serif">little universe.</span>
              </h1>

              <p className="text-xs sm:text-sm text-cream-300 font-sans leading-relaxed max-w-xl">
                Every memory you preserve here remains encrypted in time. Here is a snapshot of our journey together today.
              </p>
            </div>

            {/* Live Days Together Box */}
            <div className="w-full lg:w-auto p-5 rounded-2xl bg-white/90 border border-rose-400/30 shadow-glass">
              <div className="flex items-center justify-between gap-4 mb-3">
                <span className="text-xs uppercase tracking-widest text-cream-400 font-mono font-medium">
                  Journey Duration
                </span>
                <Badge variant="rose" size="sm">
                  Active
                </Badge>
              </div>
              <DaysCounter showDetailed={true} />
            </div>
          </div>

          {/* Quick Actions Action Row */}
          <div className="pt-8 mt-8 border-t border-universe-750/50 flex flex-wrap items-center gap-3">
            <span className="text-xs text-cream-400 font-sans mr-2 font-medium">Quick Actions:</span>

            <Button
              variant="rose"
              size="sm"
              icon={<Feather className="w-3.5 h-3.5" />}
              onClick={() => setIsWriteLetterOpen(true)}
            >
              Write Love Letter
            </Button>

            <Button
              variant="glass"
              size="sm"
              icon={<Camera className="w-3.5 h-3.5 text-rose-500" />}
              onClick={() => setIsAddMemoryOpen(true)}
            >
              Add New Moment
            </Button>

            <Button
              variant="glass"
              size="sm"
              icon={<Heart className="w-3.5 h-3.5 text-rose-500" />}
              onClick={() => setIsAddLoveReasonOpen(true)}
            >
              Add Reason I Love You
            </Button>
          </div>
        </section>

        {/* ------------------------------------------------------------- */}
        {/* 3. HIGHLIGHT METRICS (Next Date, Latest & Favorite Memory)     */}
        {/* ------------------------------------------------------------- */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-2xl text-cream-50 font-normal">
              Sanctuary Spotlight
            </h2>
            <span className="text-xs text-cream-400 font-mono">Highlights</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* 1. Next Important Date Card */}
            <Card className="p-6 flex flex-col justify-between border-white/[0.08]" hoverEffect={true}>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Badge variant="gold" size="sm">
                    Sacred Date
                  </Badge>
                  <Calendar className="w-4 h-4 text-gold-400" />
                </div>

                <div>
                  <span className="font-serif text-3xl text-cream-50 font-normal block">
                    April 14
                  </span>
                  <span className="text-xs uppercase tracking-widest text-gold-400 font-mono">
                    Annual Anniversary
                  </span>
                </div>

                <p className="text-xs text-cream-300 font-sans leading-relaxed">
                  Celebrating the miraculous morning we met at the coffeehouse and began our story.
                </p>
              </div>

              <div className="pt-4 border-t border-white/[0.04] mt-4 flex items-center justify-between text-[11px] text-cream-400">
                <span>Countdown active</span>
                <span className="text-gold-300 font-medium">&hearts; Sacred Day</span>
              </div>
            </Card>

            {/* 2. Latest Preserved Memory */}
            <div
              onClick={() => setActiveMemoryModal(latestMemory)}
              className="cursor-pointer group"
            >
              <Card className="h-full p-6 flex flex-col justify-between border-white/[0.08] hover:border-gold-400/30" hoverEffect={true}>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Badge variant="subtle" size="sm">
                      Latest Memory
                    </Badge>
                    <span className="text-xs text-cream-400 font-sans">
                      {formatDate(latestMemory.date)}
                    </span>
                  </div>

                  <div className="relative aspect-[16/9] rounded-xl overflow-hidden">
                    <Image
                      src={latestMemory.media_url || ""}
                      alt={latestMemory.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  <h4 className="font-serif text-lg text-cream-50 group-hover:text-gold-300 transition-colors line-clamp-1 font-normal">
                    {latestMemory.title}
                  </h4>

                  <p className="text-xs text-cream-300 font-sans line-clamp-2 leading-relaxed">
                    {latestMemory.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/[0.04] mt-3 flex items-center justify-between text-[11px] text-gold-400 font-medium">
                  <span>View Full Memory</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Card>
            </div>

            {/* 3. Favorite Memory Spotlight */}
            <div
              onClick={() => setActiveMemoryModal(favoriteMemory)}
              className="cursor-pointer group"
            >
              <Card className="h-full p-6 flex flex-col justify-between border-white/[0.08] hover:border-gold-400/30" hoverEffect={true}>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Badge variant="rose" size="sm">
                      Favorite Snapshot
                    </Badge>
                    <span className="text-xs text-cream-400 font-sans">
                      {formatDate(favoriteMemory.date)}
                    </span>
                  </div>

                  <div className="relative aspect-[16/9] rounded-xl overflow-hidden">
                    <Image
                      src={favoriteMemory.media_url || ""}
                      alt={favoriteMemory.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  <h4 className="font-serif text-lg text-cream-50 group-hover:text-rose-300 transition-colors line-clamp-1 font-normal">
                    {favoriteMemory.title}
                  </h4>

                  <p className="text-xs text-cream-300 font-sans line-clamp-2 leading-relaxed">
                    {favoriteMemory.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/[0.04] mt-3 flex items-center justify-between text-[11px] text-rose-300 font-medium">
                  <span>View Favorite</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------------- */}
        {/* 4. THE 7 CORE DIMENSION NAVIGATION CARDS                      */}
        {/* ------------------------------------------------------------- */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="font-serif text-2xl sm:text-3xl text-cream-50 font-normal">
                Explore Our Constellations
              </h2>
              <p className="text-xs sm:text-sm text-cream-300 font-sans">
                Enter any portal to browse, reminisce, and chronicle new moments.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {navigationDimensions.map((item, idx) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.06 }}
                className={idx === 6 ? "md:col-span-2 lg:col-span-1" : ""}
              >
                <Link href={item.href} className="block h-full group">
                  <Card
                    className="h-full p-6 sm:p-7 flex flex-col justify-between border-white/[0.07] hover:border-gold-400/40 transition-all duration-300"
                    hoverEffect={true}
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="p-3 rounded-2xl bg-universe-800/80 border border-white/[0.06] group-hover:scale-110 transition-transform duration-300 shadow-sm">
                          {item.icon}
                        </div>
                        <Badge
                          variant={item.accent === "rose" ? "rose" : "gold"}
                          size="sm"
                        >
                          {item.tag}
                        </Badge>
                      </div>

                      <div className="space-y-1.5">
                        <h3 className="font-serif text-xl sm:text-2xl text-cream-50 group-hover:text-gold-300 transition-colors font-normal">
                          {item.title}
                        </h3>
                        <p className="text-xs uppercase tracking-widest text-gold-400/80 font-mono">
                          {item.subtitle}
                        </p>
                      </div>

                      <p className="text-xs sm:text-sm text-cream-300 font-sans leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    <div className="pt-4 mt-6 border-t border-white/[0.04] flex items-center justify-between text-xs text-cream-400">
                      <span>{item.count}</span>
                      <span className="flex items-center gap-1 text-gold-400 font-medium group-hover:translate-x-1 transition-transform">
                        <span>Open Portal</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>
      </main>

      {/* 5. MOBILE BOTTOM NAVIGATION */}
      <MobileBottomNav />

      {/* ------------------------------------------------------------- */}
      {/* 6. MODALS                                                     */}
      {/* ------------------------------------------------------------- */}

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
            <div className="relative aspect-[16/10] rounded-2xl overflow-hidden">
              <Image
                src={activeMemoryModal.media_url || ""}
                alt={activeMemoryModal.title}
                fill
                className="object-cover"
              />
            </div>
            <div className="space-y-3">
              <Badge variant="gold">{activeMemoryModal.category}</Badge>
              <p className="text-sm sm:text-base text-cream-100 font-sans leading-relaxed">
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
            <label className="block text-xs uppercase tracking-wider text-cream-300 mb-1.5">
              Title
            </label>
            <input
              type="text"
              required
              placeholder="e.g., A midnight thought for you"
              value={quickLetterTitle}
              onChange={(e) => setQuickLetterTitle(e.target.value)}
              className="w-full rounded-xl bg-universe-950 border border-white/[0.1] px-4 py-2.5 text-sm text-cream-100 focus:outline-none focus:border-gold-400"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-cream-300 mb-1.5">
              Letter Content
            </label>
            <textarea
              required
              rows={5}
              placeholder="Write with an open heart..."
              value={quickLetterContent}
              onChange={(e) => setQuickLetterContent(e.target.value)}
              className="w-full rounded-xl bg-universe-950 border border-white/[0.1] p-3.5 text-sm text-cream-100 font-serif focus:outline-none focus:border-gold-400"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-white/[0.06]">
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
              variant="gold"
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
          }}
          className="space-y-4"
        >
          <div>
            <label className="block text-xs uppercase tracking-wider text-cream-300 mb-1.5">
              Title
            </label>
            <input
              type="text"
              required
              placeholder="e.g., Stargazing by the fire"
              className="w-full rounded-xl bg-universe-950 border border-white/[0.1] px-4 py-2.5 text-sm text-cream-100 focus:outline-none focus:border-gold-400"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-cream-300 mb-1.5">
              Location
            </label>
            <input
              type="text"
              placeholder="e.g., Lake Tahoe Cabin"
              className="w-full rounded-xl bg-universe-950 border border-white/[0.1] px-4 py-2.5 text-sm text-cream-100 focus:outline-none focus:border-gold-400"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-cream-300 mb-1.5">
              Memory Description
            </label>
            <textarea
              rows={3}
              placeholder="What made this moment unforgettable?"
              className="w-full rounded-xl bg-universe-950 border border-white/[0.1] p-3.5 text-sm text-cream-100 font-sans focus:outline-none focus:border-gold-400"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-white/[0.06]">
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
          }}
          className="space-y-4"
        >
          <div>
            <label className="block text-xs uppercase tracking-wider text-cream-300 mb-1.5">
              Reason Headline
            </label>
            <input
              type="text"
              required
              placeholder="e.g., How your voice calms any chaotic day"
              className="w-full rounded-xl bg-universe-950 border border-white/[0.1] px-4 py-2.5 text-sm text-cream-100 focus:outline-none focus:border-gold-400"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-cream-300 mb-1.5">
              Description
            </label>
            <textarea
              rows={3}
              placeholder="Why this makes your heart beat faster..."
              className="w-full rounded-xl bg-universe-950 border border-white/[0.1] p-3.5 text-sm text-cream-100 font-serif focus:outline-none focus:border-gold-400"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-white/[0.06]">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setIsAddLoveReasonOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="gold" size="sm">
              Add to Reasons Deck
            </Button>
          </div>
        </form>
      </Modal>
    </PageTransition>
  );
}
