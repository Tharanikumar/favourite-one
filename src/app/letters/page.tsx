"use client";

import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { PageTransition } from "@/components/layout/PageTransition";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { MobileBottomNav } from "@/components/dashboard/MobileBottomNav";
import { MOCK_LETTERS } from "@/lib/mockData";
import { Letter } from "@/lib/types";
import { LetterCard } from "@/components/letters/LetterCard";
import { LetterReaderModal } from "@/components/letters/LetterReaderModal";
import { ComposeLetterModal } from "@/components/letters/ComposeLetterModal";
import {
  Feather,
  Search,
  Mail,
  MailOpen,
  Lock,
  Inbox,
} from "lucide-react";

export default function LettersPage() {
  const [letters, setLetters] = useState<Letter[]>(MOCK_LETTERS);
  const [selectedLetter, setSelectedLetter] = useState<Letter | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [statusFilter, setStatusFilter] = useState<"all" | "unread" | "read" | "locked" | "tharani" | "surya" | "alex" | "maya">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isComposeOpen, setIsComposeOpen] = useState(false);

  const categories = [
    "All",
    "Open when you miss me",
    "Open when you're sad",
    "Open when you're angry",
    "Open when you need motivation",
    "Anniversary letter",
    "Birthday letter",
    "Future letter",
  ];

  // Filtered Letters
  const filteredLetters = useMemo(() => {
    return letters.filter((letter) => {
      // Category filter
      if (selectedCategory !== "All" && letter.category !== selectedCategory) {
        return false;
      }

      // Status / Author filter
      if (statusFilter === "unread" && (letter.is_read || letter.is_sealed)) return false;
      if (statusFilter === "read" && !letter.is_read) return false;
      if (statusFilter === "locked" && !letter.is_sealed) return false;
      if (statusFilter === "tharani" && letter.author.toLowerCase() !== "tharani" && letter.author.toLowerCase() !== "alex") return false;
      if (statusFilter === "surya" && letter.author.toLowerCase() !== "surya" && letter.author.toLowerCase() !== "maya") return false;
      if (statusFilter === "alex" && letter.author.toLowerCase() !== "tharani" && letter.author.toLowerCase() !== "alex") return false;
      if (statusFilter === "maya" && letter.author.toLowerCase() !== "surya" && letter.author.toLowerCase() !== "maya") return false;

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const title = letter.title.toLowerCase();
        const content = letter.content.toLowerCase();
        const author = letter.author.toLowerCase();
        return title.includes(q) || content.includes(q) || author.includes(q);
      }

      return true;
    });
  }, [letters, selectedCategory, statusFilter, searchQuery]);

  // Unread Count
  const unreadCount = useMemo(() => {
    return letters.filter((l) => !l.is_read && !l.is_sealed).length;
  }, [letters]);

  // Modal index in filtered array
  const currentModalIndex = useMemo(() => {
    if (!selectedLetter) return -1;
    return filteredLetters.findIndex((l) => l.id === selectedLetter.id);
  }, [selectedLetter, filteredLetters]);

  const handlePrevLetter = () => {
    if (currentModalIndex > 0) {
      setSelectedLetter(filteredLetters[currentModalIndex - 1]);
    }
  };

  const handleNextLetter = () => {
    if (currentModalIndex < filteredLetters.length - 1) {
      setSelectedLetter(filteredLetters[currentModalIndex + 1]);
    }
  };

  const handleOpenLetter = (letter: Letter) => {
    setSelectedLetter(letter);
    // Automatically mark as read if unsealed
    if (!letter.is_sealed && !letter.is_read) {
      setLetters((prev) =>
        prev.map((l) => (l.id === letter.id ? { ...l, is_read: true } : l))
      );
    }
  };

  const handleToggleRead = (letterId: string) => {
    setLetters((prev) =>
      prev.map((l) => (l.id === letterId ? { ...l, is_read: !l.is_read } : l))
    );
    if (selectedLetter && selectedLetter.id === letterId) {
      setSelectedLetter((prev) => (prev ? { ...prev, is_read: !prev.is_read } : null));
    }
  };

  const handleComposeLetter = (newLetter: Letter) => {
    setLetters((prev) => [newLetter, ...prev]);
  };

  return (
    <PageTransition>
      <DashboardHeader />

      <main className="pb-28 pt-8 px-4 sm:px-6">
        <Section
          eyebrow="Sealed Correspondence"
          title="Letters & Whispered Notes"
          subtitle="Words written across quiet evenings, preserved for whenever you need a reminder of how deeply you are cherished."
          centered={true}
        >
          {/* Controls & Search Bar */}
          <div className="max-w-6xl mx-auto space-y-6 mb-12">
            {/* Top Row: Search & Compose */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              {/* Search input */}
              <div className="relative w-full md:w-80">
                <Search className="w-4 h-4 text-cream-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search letters, words, authors..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-full bg-white/[0.03] border border-white/[0.08] text-xs text-cream-100 placeholder-cream-500 focus:outline-none focus:border-gold-400/50 transition-colors font-sans"
                />
              </div>

              {/* Compose Action */}
              <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                {unreadCount > 0 && (
                  <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono text-gold-300 bg-gold-500/10 border border-gold-400/25">
                    <Mail className="w-3.5 h-3.5 text-gold-400 animate-pulse" />
                    <span>{unreadCount} Unread Letter{unreadCount > 1 ? "s" : ""}</span>
                  </span>
                )}

                <Button
                  variant="gold"
                  size="sm"
                  icon={<Feather className="w-3.5 h-3.5" />}
                  onClick={() => setIsComposeOpen(true)}
                >
                  Compose New Letter
                </Button>
              </div>
            </div>

            {/* Special Categories Carousel / Pills */}
            <div className="space-y-3 pt-2 border-t border-white/[0.06]">
              <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-sans tracking-wide transition-all duration-300 ${
                      selectedCategory === cat
                        ? "bg-gold-500 text-universe-950 font-semibold shadow-glow-sm"
                        : "bg-white/[0.03] text-cream-300 hover:text-white border border-white/[0.08]"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Secondary Status / Sender Filter Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 text-[11px] font-mono">
                <div className="flex items-center gap-1.5 bg-universe-950/80 p-1 rounded-full border border-white/[0.08]">
                  <button
                    onClick={() => setStatusFilter("all")}
                    className={`px-3 py-1 rounded-full transition-all ${
                      statusFilter === "all"
                        ? "bg-white/10 text-gold-300 font-medium"
                        : "text-cream-400 hover:text-white"
                    }`}
                  >
                    All ({letters.length})
                  </button>
                  <button
                    onClick={() => setStatusFilter("unread")}
                    className={`px-3 py-1 rounded-full flex items-center gap-1 transition-all ${
                      statusFilter === "unread"
                        ? "bg-white/10 text-gold-300 font-medium"
                        : "text-cream-400 hover:text-white"
                    }`}
                  >
                    <Mail className="w-3 h-3 text-gold-400" />
                    Unread
                  </button>
                  <button
                    onClick={() => setStatusFilter("read")}
                    className={`px-3 py-1 rounded-full flex items-center gap-1 transition-all ${
                      statusFilter === "read"
                        ? "bg-white/10 text-gold-300 font-medium"
                        : "text-cream-400 hover:text-white"
                    }`}
                  >
                    <MailOpen className="w-3 h-3 text-cream-400" />
                    Read
                  </button>
                  <button
                    onClick={() => setStatusFilter("locked")}
                    className={`px-3 py-1 rounded-full flex items-center gap-1 transition-all ${
                      statusFilter === "locked"
                        ? "bg-white/10 text-gold-300 font-medium"
                        : "text-cream-400 hover:text-white"
                    }`}
                  >
                    <Lock className="w-3 h-3 text-gold-400" />
                    Time-Locked
                  </button>
                </div>

                <div className="flex items-center gap-1.5 bg-universe-950/80 p-1 rounded-full border border-white/[0.08]">
                  <button
                    onClick={() => setStatusFilter("tharani")}
                    className={`px-3 py-1 rounded-full transition-all ${
                      statusFilter === "tharani" || statusFilter === "alex"
                        ? "bg-gold-500/20 text-gold-300 font-medium border border-gold-400/30"
                        : "text-cream-400 hover:text-white"
                    }`}
                  >
                    From Tharani
                  </button>
                  <button
                    onClick={() => setStatusFilter("surya")}
                    className={`px-3 py-1 rounded-full transition-all ${
                      statusFilter === "surya" || statusFilter === "maya"
                        ? "bg-rose-500/20 text-rose-300 font-medium border border-rose-400/30"
                        : "text-cream-400 hover:text-white"
                    }`}
                  >
                    From Surya
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Letters Grid */}
          {filteredLetters.length === 0 ? (
            <div className="max-w-md mx-auto text-center py-16 px-6 rounded-3xl bg-universe-900/40 border border-white/[0.06] space-y-3">
              <Inbox className="w-8 h-8 text-cream-500 mx-auto" />
              <h3 className="font-serif text-xl text-cream-100">No letters found in this view</h3>
              <p className="text-xs text-cream-400">
                Try selecting a different category, clearing filters, or compose a new letter.
              </p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSelectedCategory("All");
                  setStatusFilter("all");
                  setSearchQuery("");
                }}
              >
                Reset All Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-5xl mx-auto">
              {filteredLetters.map((letter, idx) => (
                <motion.div
                  key={letter.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.05 }}
                >
                  <LetterCard
                    letter={letter}
                    onClick={() => handleOpenLetter(letter)}
                  />
                </motion.div>
              ))}
            </div>
          )}
        </Section>

        {/* Full Digital Letter Reader Modal */}
        <LetterReaderModal
          letter={selectedLetter}
          isOpen={Boolean(selectedLetter)}
          onClose={() => setSelectedLetter(null)}
          onPrev={handlePrevLetter}
          onNext={handleNextLetter}
          hasPrev={currentModalIndex > 0}
          hasNext={currentModalIndex < filteredLetters.length - 1}
          onToggleRead={handleToggleRead}
        />

        {/* Compose Letter Modal */}
        <ComposeLetterModal
          isOpen={isComposeOpen}
          onClose={() => setIsComposeOpen(false)}
          onCompose={handleComposeLetter}
        />
      </main>

      <MobileBottomNav />
    </PageTransition>
  );
}
