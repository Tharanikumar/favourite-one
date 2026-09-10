"use client";

import React, { useState, useMemo } from "react";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { PageTransition } from "@/components/layout/PageTransition";
import { MemoryMasonryCard } from "@/components/gallery/MemoryMasonryCard";
import { MemoryLightbox } from "@/components/gallery/MemoryLightbox";
import { UploadMemoryModal } from "@/components/gallery/UploadMemoryModal";
import { MemoryEmptyState } from "@/components/gallery/MemoryEmptyState";
import { MOCK_MEMORIES } from "@/lib/mockData";
import { Memory } from "@/lib/supabase/types";
import { MobileBottomNav } from "@/components/dashboard/MobileBottomNav";
import {
  Plus,
  Heart,
  Search,
  Play,
  ArrowUpDown,
} from "lucide-react";

export default function GalleryPage() {
  const [memories, setMemories] = useState<Memory[]>(MOCK_MEMORIES);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc");
  const [activeMemoryIndex, setActiveMemoryIndex] = useState<number | null>(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  const categories = [
    { id: "All", label: "All Moments" },
    { id: "Favorites", label: "Favorites" },
    { id: "Trip", label: "Trips" },
    { id: "Date Night", label: "Date Nights" },
    { id: "Milestone", label: "Milestones" },
    { id: "Quiet Moment", label: "Quiet Moments" },
    { id: "Videos", label: "Videos" },
  ];

  // Filter & Search & Sort Logic
  const filteredMemories = useMemo(() => {
    return memories
      .filter((m) => {
        // Category filter
        if (selectedCategory === "Favorites" && !m.is_favorite) return false;
        if (selectedCategory === "Videos" && m.media_type !== "video") return false;
        if (
          selectedCategory !== "All" &&
          selectedCategory !== "Favorites" &&
          selectedCategory !== "Videos" &&
          m.category !== selectedCategory
        ) {
          return false;
        }

        // Search Query filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = m.title.toLowerCase().includes(q);
          const matchDesc = m.description.toLowerCase().includes(q);
          const matchLocation = m.location?.toLowerCase().includes(q);
          const matchTags = m.tags.some((t) => t.toLowerCase().includes(q));
          return matchTitle || matchDesc || matchLocation || matchTags;
        }

        return true;
      })
      .sort((a, b) => {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
      });
  }, [memories, selectedCategory, searchQuery, sortOrder]);

  const activeMemory =
    activeMemoryIndex !== null && filteredMemories[activeMemoryIndex]
      ? filteredMemories[activeMemoryIndex]
      : null;

  const handleOpenLightbox = (memory: Memory) => {
    const idx = filteredMemories.findIndex((m) => m.id === memory.id);
    if (idx !== -1) {
      setActiveMemoryIndex(idx);
    }
  };

  const handleNextLightbox = () => {
    if (activeMemoryIndex !== null && activeMemoryIndex < filteredMemories.length - 1) {
      setActiveMemoryIndex(activeMemoryIndex + 1);
    }
  };

  const handlePrevLightbox = () => {
    if (activeMemoryIndex !== null && activeMemoryIndex > 0) {
      setActiveMemoryIndex(activeMemoryIndex - 1);
    }
  };

  const handleToggleFavorite = (id: string) => {
    setMemories((prev) =>
      prev.map((m) => (m.id === id ? { ...m, is_favorite: !m.is_favorite } : m))
    );
  };

  const handleAddMemory = (newMemory: Memory) => {
    setMemories([newMemory, ...memories]);
  };

  const handleClearFilters = () => {
    setSelectedCategory("All");
    setSearchQuery("");
  };

  return (
    <PageTransition>
      <Section
        eyebrow="Visual Chronicles"
        title="Our Curated Gallery of Moments"
        subtitle="Unfiltered joy, spontaneous getaways, and quiet mornings captured in cinematic frames."
        centered={true}
      >
        {/* Controls & Search Toolbar */}
        <div className="space-y-4 mb-10 max-w-6xl mx-auto">
          {/* Top Bar: Search Input, Sort, and Add Memory Button */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-cream-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search memories by title, location, or tag..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-full bg-universe-900/80 border border-white/[0.08] text-xs text-cream-100 placeholder-cream-500 focus:outline-none focus:border-gold-400/50 shadow-glass"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-cream-400 hover:text-white"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Right Controls: Sort Order & Upload Button */}
            <div className="flex items-center gap-2 self-end sm:self-auto">
              <button
                onClick={() => setSortOrder(sortOrder === "desc" ? "asc" : "desc")}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-universe-900/80 border border-white/[0.08] text-xs text-cream-300 hover:text-white transition-colors shadow-glass"
                title={`Sorted by ${sortOrder === "desc" ? "Newest First" : "Oldest First"}`}
              >
                <ArrowUpDown className="w-3.5 h-3.5 text-gold-400" />
                <span className="font-mono text-[11px]">
                  {sortOrder === "desc" ? "Newest" : "Oldest"}
                </span>
              </button>

              <Button
                variant="gold"
                size="sm"
                icon={<Plus className="w-4 h-4" />}
                onClick={() => setIsUploadOpen(true)}
              >
                Add Moment
              </Button>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-1.5 rounded-full text-xs font-sans tracking-wide transition-all duration-300 flex items-center gap-1.5 ${
                  selectedCategory === cat.id
                    ? "bg-gold-500 text-universe-950 font-semibold shadow-glow-sm"
                    : "bg-white/[0.04] text-cream-300 hover:text-white border border-white/[0.08]"
                }`}
              >
                {cat.id === "Favorites" && (
                  <Heart className="w-3 h-3 fill-current text-rose-400" />
                )}
                {cat.id === "Videos" && <Play className="w-3 h-3 fill-current text-gold-400" />}
                <span>{cat.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Masonry Grid */}
        <div className="max-w-6xl mx-auto">
          {filteredMemories.length > 0 ? (
            <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-5">
              {filteredMemories.map((memory, index) => (
                <MemoryMasonryCard
                  key={memory.id}
                  memory={memory}
                  onClick={handleOpenLightbox}
                  index={index}
                />
              ))}
            </div>
          ) : (
            <MemoryEmptyState
              searchQuery={searchQuery}
              onClearFilters={handleClearFilters}
              onOpenUpload={() => setIsUploadOpen(true)}
            />
          )}
        </div>
      </Section>

      {/* Fullscreen Cinematic Lightbox */}
      <MemoryLightbox
        isOpen={Boolean(activeMemory)}
        memory={activeMemory}
        onClose={() => setActiveMemoryIndex(null)}
        onNext={handleNextLightbox}
        onPrev={handlePrevLightbox}
        onToggleFavorite={handleToggleFavorite}
        hasPrev={activeMemoryIndex !== null && activeMemoryIndex > 0}
        hasNext={activeMemoryIndex !== null && activeMemoryIndex < filteredMemories.length - 1}
      />

      {/* Upload Memory Modal with Supabase Storage Integration */}
      <UploadMemoryModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onAddMemory={handleAddMemory}
      />

      <MobileBottomNav />
    </PageTransition>
  );
}
