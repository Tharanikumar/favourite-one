"use client";

import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { PageTransition } from "@/components/layout/PageTransition";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { MobileBottomNav } from "@/components/dashboard/MobileBottomNav";
import { MOCK_LOVE_REASONS } from "@/lib/mockData";
import { LoveReason } from "@/lib/types";
import { LoveReasonCard } from "@/components/love-reasons/LoveReasonCard";
import { LoveReasonExpandedModal } from "@/components/love-reasons/LoveReasonExpandedModal";
import { AddLoveReasonModal } from "@/components/love-reasons/AddLoveReasonModal";
import {
  Shuffle,
  Plus,
  Search,
  Mic,
  ImageIcon,
  Star,
  Layers,
} from "lucide-react";

export default function ThingsILovePage() {
  const [reasons, setReasons] = useState<LoveReason[]>(MOCK_LOVE_REASONS);
  const [selectedReason, setSelectedReason] = useState<LoveReason | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [mediaFilter, setMediaFilter] = useState<"all" | "audio" | "photo" | "favorite">("all");
  const [isAddOpen, setIsAddOpen] = useState(false);

  const categories = [
    "All",
    "The Little Things",
    "Soul & Depth",
    "Everyday Magic",
    "Conversations",
    "Quirks",
    "Heart",
  ];

  // Filter reasons
  const filteredReasons = useMemo(() => {
    return reasons.filter((item) => {
      // Category filter
      if (selectedCategory !== "All" && item.category !== selectedCategory) {
        return false;
      }
      // Media type filter
      if (mediaFilter === "audio" && !item.audio_duration) return false;
      if (mediaFilter === "photo" && !item.photo_url) return false;
      if (mediaFilter === "favorite" && !item.is_favorite) return false;

      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const msg = (item.message || item.description || "").toLowerCase();
        const title = item.title.toLowerCase();
        const author = item.author.toLowerCase();
        return title.includes(q) || msg.includes(q) || author.includes(q);
      }
      return true;
    });
  }, [reasons, selectedCategory, mediaFilter, searchQuery]);

  // Index of currently selected reason in filtered array
  const currentModalIndex = useMemo(() => {
    if (!selectedReason) return -1;
    return filteredReasons.findIndex((r) => r.id === selectedReason.id);
  }, [selectedReason, filteredReasons]);

  const handlePrevReason = () => {
    if (currentModalIndex > 0) {
      setSelectedReason(filteredReasons[currentModalIndex - 1]);
    }
  };

  const handleNextReason = () => {
    if (currentModalIndex < filteredReasons.length - 1) {
      setSelectedReason(filteredReasons[currentModalIndex + 1]);
    }
  };

  // Surprise Me / Random Reason
  const handleSurpriseMe = () => {
    const random = reasons[Math.floor(Math.random() * reasons.length)];
    setSelectedReason(random);
  };

  const handleAddReason = (newReason: LoveReason) => {
    setReasons((prev) => [newReason, ...prev]);
  };

  return (
    <PageTransition>
      <DashboardHeader />

      <main className="pb-28 pt-8 px-4 sm:px-6">
        <Section
          eyebrow="A Living Journal of Devotion"
          title="Things I Love About You"
          subtitle="An interactive collection of little moments, mannerisms, and unscripted magic that make you irreplaceable."
          centered={true}
        >
          {/* Controls Bar */}
          <div className="max-w-6xl mx-auto space-y-6 mb-12">
            {/* Top Row: Search & Actions */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              {/* Search Bar */}
              <div className="relative w-full md:w-80">
                <Search className="w-4 h-4 text-cream-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search cards, keywords..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-full bg-white/[0.03] border border-white/[0.08] text-xs text-cream-100 placeholder-cream-500 focus:outline-none focus:border-gold-400/50 transition-colors font-sans"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                <Button
                  variant="glass"
                  size="sm"
                  icon={<Shuffle className="w-3.5 h-3.5 text-gold-400" />}
                  onClick={handleSurpriseMe}
                >
                  Surprise Me
                </Button>

                <Button
                  variant="gold"
                  size="sm"
                  icon={<Plus className="w-3.5 h-3.5" />}
                  onClick={() => setIsAddOpen(true)}
                >
                  Add Card
                </Button>
              </div>
            </div>

            {/* Category Pills & Media Filter Tabs */}
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pt-2 border-t border-white/[0.06]">
              {/* Category Pills */}
              <div className="flex flex-wrap items-center gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-1.5 rounded-full text-xs font-sans tracking-wide transition-all duration-300 ${
                      selectedCategory === cat
                        ? "bg-gold-500 text-universe-950 font-semibold shadow-glow-sm"
                        : "bg-white/[0.03] text-cream-300 hover:text-white border border-white/[0.08]"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Media Sub-Filters */}
              <div className="flex items-center gap-1.5 bg-universe-950/80 p-1 rounded-full border border-white/[0.08] text-[11px] font-mono">
                <button
                  onClick={() => setMediaFilter("all")}
                  className={`px-3 py-1 rounded-full transition-all ${
                    mediaFilter === "all"
                      ? "bg-white/10 text-gold-300 font-medium"
                      : "text-cream-400 hover:text-white"
                  }`}
                >
                  All ({reasons.length})
                </button>
                <button
                  onClick={() => setMediaFilter("audio")}
                  className={`px-3 py-1 rounded-full flex items-center gap-1 transition-all ${
                    mediaFilter === "audio"
                      ? "bg-white/10 text-gold-300 font-medium"
                      : "text-cream-400 hover:text-white"
                  }`}
                >
                  <Mic className="w-3 h-3 text-gold-400" />
                  Voice Memos
                </button>
                <button
                  onClick={() => setMediaFilter("photo")}
                  className={`px-3 py-1 rounded-full flex items-center gap-1 transition-all ${
                    mediaFilter === "photo"
                      ? "bg-white/10 text-gold-300 font-medium"
                      : "text-cream-400 hover:text-white"
                  }`}
                >
                  <ImageIcon className="w-3 h-3 text-gold-400" />
                  Photos
                </button>
                <button
                  onClick={() => setMediaFilter("favorite")}
                  className={`px-3 py-1 rounded-full flex items-center gap-1 transition-all ${
                    mediaFilter === "favorite"
                      ? "bg-white/10 text-gold-300 font-medium"
                      : "text-cream-400 hover:text-white"
                  }`}
                >
                  <Star className="w-3 h-3 text-gold-400" />
                  Favorites
                </button>
              </div>
            </div>
          </div>

          {/* Cards Grid */}
          {filteredReasons.length === 0 ? (
            <div className="max-w-md mx-auto text-center py-16 px-6 rounded-3xl bg-universe-900/40 border border-white/[0.06] space-y-3">
              <Layers className="w-8 h-8 text-cream-500 mx-auto" />
              <h3 className="font-serif text-xl text-cream-100">No cards matched your filter</h3>
              <p className="text-xs text-cream-400">
                Try selecting a different category or clearing your search term.
              </p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSelectedCategory("All");
                  setMediaFilter("all");
                  setSearchQuery("");
                }}
              >
                Reset All Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {filteredReasons.map((reason, idx) => (
                <motion.div
                  key={reason.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.04 }}
                >
                  <LoveReasonCard
                    reason={reason}
                    index={idx}
                    onClick={() => setSelectedReason(reason)}
                  />
                </motion.div>
              ))}
            </div>
          )}
        </Section>

        {/* Expanded View Modal */}
        <LoveReasonExpandedModal
          reason={selectedReason}
          isOpen={Boolean(selectedReason)}
          onClose={() => setSelectedReason(null)}
          onPrev={handlePrevReason}
          onNext={handleNextReason}
          hasPrev={currentModalIndex > 0}
          hasNext={currentModalIndex < filteredReasons.length - 1}
          currentIndex={currentModalIndex}
          totalCount={filteredReasons.length}
        />

        {/* Add Love Reason Modal */}
        <AddLoveReasonModal
          isOpen={isAddOpen}
          onClose={() => setIsAddOpen(false)}
          onAdd={handleAddReason}
          nextNumber={reasons.length + 1}
        />
      </main>

      <MobileBottomNav />
    </PageTransition>
  );
}
