"use client";

import React, { useState, useMemo } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { PageTransition } from "@/components/layout/PageTransition";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { MobileBottomNav } from "@/components/dashboard/MobileBottomNav";
import { MOCK_PLACES } from "@/lib/mockData";
import { Place } from "@/lib/types";
import { PlaceCard } from "@/components/places/PlaceCard";
import { PlaceMemoryModal } from "@/components/places/PlaceMemoryModal";
import { AddPlaceModal } from "@/components/places/AddPlaceModal";

const InteractiveMemoryMap = dynamic(
  () =>
    import("@/components/places/InteractiveMemoryMap").then(
      (mod) => mod.InteractiveMemoryMap
    ),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[520px] sm:h-[620px] rounded-3xl bg-rose-50/60 border border-rose-200/50 flex flex-col items-center justify-center gap-3 text-rose-500 shadow-sm animate-pulse">
        <Compass className="w-8 h-8 animate-spin-slow text-rose-400" />
        <span className="font-mono text-xs uppercase tracking-widest font-semibold text-rose-600">
          Loading Real Interactive Map...
        </span>
      </div>
    ),
  }
);
import {
  Compass,
  Search,
  Plus,
  Lock,
  Layers,
  Map as MapIcon,
  Grid,
} from "lucide-react";

export default function PlacesPage() {
  const [places, setPlaces] = useState<Place[]>(MOCK_PLACES);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [detailModalPlace, setDetailModalPlace] = useState<Place | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"split" | "map" | "grid">("split");
  const [isAddOpen, setIsAddOpen] = useState(false);

  const categories = [
    "All",
    "Travel",
    "First Date",
    "Favorite Café",
    "Stargazing",
    "Quiet Moment",
    "Home",
  ];

  // Filtered places
  const filteredPlaces = useMemo(() => {
    return places.filter((place) => {
      if (selectedCategory !== "All" && place.category !== selectedCategory) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const title = place.title.toLowerCase();
        const loc = place.location_name.toLowerCase();
        const city = (place.city || "").toLowerCase();
        const country = (place.country || "").toLowerCase();
        const desc = place.description.toLowerCase();
        return (
          title.includes(q) ||
          loc.includes(q) ||
          city.includes(q) ||
          country.includes(q) ||
          desc.includes(q)
        );
      }
      return true;
    });
  }, [places, selectedCategory, searchQuery]);

  // Unique countries count
  const countriesCount = useMemo(() => {
    const set = new Set(places.map((p) => p.country).filter(Boolean));
    return set.size;
  }, [places]);

  // Modal navigation
  const currentModalIndex = useMemo(() => {
    if (!detailModalPlace) return -1;
    return filteredPlaces.findIndex((p) => p.id === detailModalPlace.id);
  }, [detailModalPlace, filteredPlaces]);

  const handlePrevPlace = () => {
    if (currentModalIndex > 0) {
      setDetailModalPlace(filteredPlaces[currentModalIndex - 1]);
    }
  };

  const handleNextPlace = () => {
    if (currentModalIndex < filteredPlaces.length - 1) {
      setDetailModalPlace(filteredPlaces[currentModalIndex + 1]);
    }
  };

  const handleAddPlace = (newPlace: Place) => {
    setPlaces((prev) => [newPlace, ...prev]);
    setSelectedPlace(newPlace);
  };

  return (
    <PageTransition>
      <DashboardHeader />

      <main className="pb-28 pt-8 px-4 sm:px-6">
        <Section
          eyebrow="Geography of Us"
          title="Coordinates of Our Story"
          subtitle="An interactive memory map preserving the cities, coffeehouses, coastal trails, and stargazing summits that hold our footsteps."
          centered={true}
        >
          {/* Privacy & Auth Banner */}
          <div className="max-w-6xl mx-auto mb-8 p-3.5 rounded-2xl bg-universe-950/80 border border-gold-400/20 backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-cream-300">
              <Lock className="w-3.5 h-3.5 text-gold-400" />
              <span className="font-mono text-gold-300">Private Coordinate Vault:</span>
              <span className="text-cream-400">
                Exact geographic markers are restricted to authenticated family access only.
              </span>
            </div>

            <div className="flex items-center gap-4 text-xs font-mono text-cream-400">
              <span>{places.length} Preserved Pins</span>
              <span>&bull;</span>
              <span>{countriesCount} Countries</span>
            </div>
          </div>

          {/* Controls Bar */}
          <div className="max-w-6xl mx-auto space-y-6 mb-8">
            {/* Top Row: Search, View Mode Switcher, & Add Button */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              {/* Search Bar */}
              <div className="relative w-full md:w-80">
                <Search className="w-4 h-4 text-cream-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search cities, places, memories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-full bg-white/[0.03] border border-white/[0.08] text-xs text-cream-100 placeholder-cream-500 focus:outline-none focus:border-gold-400/50 transition-colors font-sans"
                />
              </div>

              {/* View Switcher & Action */}
              <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                {/* View Mode Switcher */}
                <div className="flex items-center gap-1 bg-universe-950/80 p-1 rounded-full border border-white/[0.08] text-xs font-mono">
                  <button
                    onClick={() => setViewMode("split")}
                    className={`px-3 py-1.5 rounded-full flex items-center gap-1.5 transition-all ${
                      viewMode === "split"
                        ? "bg-gold-500 text-universe-950 font-semibold shadow-glow-sm"
                        : "text-cream-400 hover:text-white"
                    }`}
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Split View</span>
                  </button>

                  <button
                    onClick={() => setViewMode("map")}
                    className={`px-3 py-1.5 rounded-full flex items-center gap-1.5 transition-all ${
                      viewMode === "map"
                        ? "bg-gold-500 text-universe-950 font-semibold shadow-glow-sm"
                        : "text-cream-400 hover:text-white"
                    }`}
                  >
                    <MapIcon className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Full Map</span>
                  </button>

                  <button
                    onClick={() => setViewMode("grid")}
                    className={`px-3 py-1.5 rounded-full flex items-center gap-1.5 transition-all ${
                      viewMode === "grid"
                        ? "bg-gold-500 text-universe-950 font-semibold shadow-glow-sm"
                        : "text-cream-400 hover:text-white"
                    }`}
                  >
                    <Grid className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Card Grid</span>
                  </button>
                </div>

                <Button
                  variant="gold"
                  size="sm"
                  icon={<Plus className="w-3.5 h-3.5" />}
                  onClick={() => setIsAddOpen(true)}
                >
                  Pin New Place
                </Button>
              </div>
            </div>

            {/* Category Pills */}
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-white/[0.06]">
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
          </div>

          {/* Main Map & Places Layout */}
          <div className="max-w-6xl mx-auto space-y-8">
            {/* Map Canvas if not in pure grid view */}
            {viewMode !== "grid" && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <InteractiveMemoryMap
                  places={filteredPlaces}
                  selectedPlace={selectedPlace}
                  onSelectPlace={(p) => setSelectedPlace(p)}
                  onOpenDetail={(p) => setDetailModalPlace(p)}
                  className={viewMode === "map" ? "h-[650px] sm:h-[720px]" : ""}
                />
              </motion.div>
            )}

            {/* Places Card Grid if not in pure map view */}
            {viewMode !== "map" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif text-2xl text-cream-100 font-normal">
                    Preserved Coordinates &amp; Stories
                  </h3>
                  <span className="text-xs font-mono text-cream-400">
                    Showing {filteredPlaces.length} location{filteredPlaces.length === 1 ? "" : "s"}
                  </span>
                </div>

                {filteredPlaces.length === 0 ? (
                  <div className="text-center py-12 px-6 rounded-3xl bg-universe-900/40 border border-white/[0.06] space-y-3">
                    <Compass className="w-8 h-8 text-cream-500 mx-auto" />
                    <h4 className="font-serif text-xl text-cream-100">No coordinates matched your filter</h4>
                    <p className="text-xs text-cream-400">
                      Try selecting a different category or clearing your search term.
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedCategory("All");
                        setSearchQuery("");
                      }}
                    >
                      Reset All Filters
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredPlaces.map((place, idx) => (
                      <motion.div
                        key={place.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: idx * 0.04 }}
                      >
                        <PlaceCard
                          place={place}
                          isSelected={selectedPlace?.id === place.id}
                          onSelect={() => {
                            setSelectedPlace(place);
                            setDetailModalPlace(place);
                          }}
                          onLocateOnMap={() => {
                            setSelectedPlace(place);
                            if (viewMode === "grid") setViewMode("split");
                            window.scrollTo({ top: 200, behavior: "smooth" });
                          }}
                        />
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </Section>

        {/* Place Detail Memory Modal */}
        <PlaceMemoryModal
          place={detailModalPlace}
          isOpen={Boolean(detailModalPlace)}
          onClose={() => setDetailModalPlace(null)}
          onPrev={handlePrevPlace}
          onNext={handleNextPlace}
          hasPrev={currentModalIndex > 0}
          hasNext={currentModalIndex < filteredPlaces.length - 1}
          onLocateOnMap={(p) => {
            setSelectedPlace(p);
            if (viewMode === "grid") setViewMode("split");
            window.scrollTo({ top: 200, behavior: "smooth" });
          }}
        />

        {/* Pin New Place Modal */}
        <AddPlaceModal
          isOpen={isAddOpen}
          onClose={() => setIsAddOpen(false)}
          onAdd={handleAddPlace}
        />
      </main>

      <MobileBottomNav />
    </PageTransition>
  );
}
