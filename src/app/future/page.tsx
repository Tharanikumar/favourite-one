"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { PageTransition } from "@/components/layout/PageTransition";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { MobileBottomNav } from "@/components/dashboard/MobileBottomNav";
import { FutureStatsHeader } from "@/components/future/FutureStatsHeader";
import { FutureItemCard } from "@/components/future/FutureItemCard";
import { AddEditFutureItemModal } from "@/components/future/AddEditFutureItemModal";
import { MOCK_FUTURE_ITEMS } from "@/lib/mockData";
import { FutureItem, FutureCategory, FutureStatus } from "@/lib/supabase/types";
import { supabase, isSupabaseConfigured } from "@/lib/supabase/client";
import { useToast } from "@/lib/toast/ToastContext";
import {
  Plus,
  Search,
  Compass,
  ListFilter,
} from "lucide-react";

export default function FuturePage() {
  const toast = useToast();

  const [items, setItems] = useState<FutureItem[]>(MOCK_FUTURE_ITEMS);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedStatus, setSelectedStatus] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"date" | "target" | "status" | "title">("target");

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<FutureItem | null>(null);

  // Load from Supabase if configured
  useEffect(() => {
    async function fetchItems() {
      if (isSupabaseConfigured && supabase) {
        try {
          const { data, error } = await supabase
            .from("future_items")
            .select("*")
            .order("created_at", { ascending: false });

          if (!error && data && data.length > 0) {
            setItems(data as FutureItem[]);
          }
        } catch (e) {
          console.warn("Could not fetch future_items from Supabase:", e);
        }
      }
    }

    fetchItems();
  }, []);

  // Filtered and Sorted Items
  const filteredItems = useMemo(() => {
    return items
      .filter((item) => {
        // Category filter
        if (selectedCategory !== "All" && item.category !== selectedCategory) {
          return false;
        }

        // Status filter
        if (selectedStatus !== "All") {
          if (selectedStatus === "Completed" && !item.is_completed && item.status !== "Completed") {
            return false;
          }
          if (selectedStatus !== "Completed" && item.status !== selectedStatus) {
            return false;
          }
        }

        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const title = item.title.toLowerCase();
          const desc = item.description.toLowerCase();
          return title.includes(q) || desc.includes(q);
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "target") {
          return (a.target_date || "9999").localeCompare(b.target_date || "9999");
        }
        if (sortBy === "title") {
          return a.title.localeCompare(b.title);
        }
        if (sortBy === "status") {
          const rank: Record<FutureStatus, number> = {
            "In Progress": 1,
            Planned: 2,
            Dream: 3,
            Completed: 4,
          };
          return (rank[a.status] || 5) - (rank[b.status] || 5);
        }
        // default "date" (created_at)
        return (b.created_at || "").localeCompare(a.created_at || "");
      });
  }, [items, selectedCategory, selectedStatus, searchQuery, sortBy]);

  // Toggle completion
  const handleToggleComplete = async (id: string) => {
    const target = items.find((i) => i.id === id);
    if (!target) return;

    const willBeCompleted = !target.is_completed;
    const newStatus: FutureStatus = willBeCompleted ? "Completed" : "In Progress";
    const completedDate = willBeCompleted ? new Date().toISOString().split("T")[0] : undefined;

    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              is_completed: willBeCompleted,
              status: newStatus,
              completed_date: completedDate,
            }
          : item
      )
    );

    if (willBeCompleted) {
      toast.success("Dream Fulfilled!", `"${target.title}" marked as completed.`);
    }

    // Persist to Supabase
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase
          .from("future_items")
          .update({
            is_completed: willBeCompleted,
            status: newStatus,
            completed_date: completedDate,
            updated_at: new Date().toISOString(),
          })
          .eq("id", id);
      } catch (err) {
        console.warn("Supabase update error:", err);
      }
    }
  };

  // Add / Edit save handler
  const handleSaveItem = async (data: Partial<FutureItem>) => {
    if (data.id) {
      // Edit existing
      setItems((prev) =>
        prev.map((i) => (i.id === data.id ? ({ ...i, ...data } as FutureItem) : i))
      );
      toast.success("Aspiration Updated", `"${data.title}" updated.`);

      if (isSupabaseConfigured && supabase) {
        try {
          await supabase.from("future_items").update(data).eq("id", data.id);
        } catch (e) {
          console.warn("Supabase update error:", e);
        }
      }
    } else {
      // Create new
      const newItem: FutureItem = {
        id: "ft-" + Date.now().toString(36),
        title: data.title || "Untitled Aspiration",
        description: data.description || "",
        category: (data.category as FutureCategory) || "Places We Want To Visit",
        status: (data.status as FutureStatus) || "Dream",
        target_date: data.target_date,
        image_url: data.image_url,
        is_completed: data.status === "Completed",
        completed_date: data.completed_date,
        created_at: new Date().toISOString(),
      };

      setItems((prev) => [newItem, ...prev]);
      toast.success("New Dream Added", `"${newItem.title}" added to our constellation.`);

      if (isSupabaseConfigured && supabase) {
        try {
          const { data: inserted } = await supabase
            .from("future_items")
            .insert(newItem)
            .select()
            .single();

          if (inserted) {
            setItems((prev) => prev.map((i) => (i.id === newItem.id ? (inserted as FutureItem) : i)));
          }
        } catch (e) {
          console.warn("Supabase insert error:", e);
        }
      }
    }
  };

  // Delete item
  const handleDeleteItem = async (id: string) => {
    const item = items.find((i) => i.id === id);
    setItems((prev) => prev.filter((i) => i.id !== id));
    toast.info("Aspiration Removed", item?.title);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from("future_items").delete().eq("id", id);
      } catch (e) {
        console.warn("Supabase delete error:", e);
      }
    }
  };

  const categories = [
    "All",
    "Places We Want To Visit",
    "Things We Want To Do",
    "Dreams & Goals",
  ];

  const statuses = ["All", "Dream", "Planned", "In Progress", "Completed"];

  return (
    <PageTransition>
      <DashboardHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-28 space-y-10">
        {/* Constellation Progress Stats */}
        <FutureStatsHeader items={items} />

        {/* Controls & Filter Bar */}
        <div className="space-y-4 max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Search Bar */}
            <div className="relative w-full md:w-80">
              <input
                type="text"
                placeholder="Search dreams, places, or notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-full bg-universe-900/90 border border-white/[0.08] px-4 py-2.5 pl-10 text-xs text-cream-100 placeholder-cream-500 focus:outline-none focus:border-gold-400/50 shadow-glass"
              />
              <Search className="w-3.5 h-3.5 text-cream-500 absolute left-3.5 top-3" />
            </div>

            {/* Sort & Add Dream Action */}
            <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
              <div className="flex items-center gap-2">
                <span className="text-xs text-cream-400 font-sans hidden sm:inline">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as "date" | "target" | "status" | "title")}
                  className="rounded-full bg-universe-900/90 border border-white/[0.08] px-3.5 py-2 text-xs text-cream-200 focus:outline-none focus:border-gold-400/50"
                >
                  <option value="target">Target Date</option>
                  <option value="status">Status Priority</option>
                  <option value="date">Date Added</option>
                  <option value="title">Alphabetical</option>
                </select>
              </div>

              <Button
                variant="gold"
                size="sm"
                icon={<Plus className="w-4 h-4" />}
                onClick={() => {
                  setEditingItem(null);
                  setIsModalOpen(true);
                }}
              >
                Chart New Dream
              </Button>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 pt-2">
            {categories.map((cat) => {
              const count =
                cat === "All"
                  ? items.length
                  : items.filter((i) => i.category === cat).length;

              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-full text-xs font-sans tracking-wide transition-all duration-300 flex items-center gap-2 ${
                    selectedCategory === cat
                      ? "bg-gold-500 text-universe-950 font-semibold shadow-glow-sm"
                      : "bg-universe-900/80 text-cream-300 hover:text-white border border-white/[0.08]"
                  }`}
                >
                  <span>{cat}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                      selectedCategory === cat
                        ? "bg-universe-950 text-gold-300"
                        : "bg-universe-800 text-cream-400"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Status Filter Chips */}
          <div className="flex flex-wrap items-center gap-2 text-xs text-cream-400 pt-1">
            <span className="text-[11px] uppercase tracking-wider text-cream-500 mr-1 flex items-center gap-1 font-mono">
              <ListFilter className="w-3 h-3" /> Status:
            </span>
            {statuses.map((st) => (
              <button
                key={st}
                onClick={() => setSelectedStatus(st)}
                className={`px-3 py-1 rounded-lg text-xs transition-all ${
                  selectedStatus === st
                    ? "bg-white/[0.12] text-cream-50 font-medium border border-white/[0.2]"
                    : "text-cream-400 hover:text-cream-200 border border-transparent"
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Future Items List */}
        <div className="space-y-4 max-w-5xl mx-auto">
          <AnimatePresence mode="popLayout">
            {filteredItems.length > 0 ? (
              filteredItems.map((item, idx) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.35, delay: idx * 0.04 }}
                >
                  <FutureItemCard
                    item={item}
                    onToggleComplete={handleToggleComplete}
                    onEdit={(itm) => {
                      setEditingItem(itm);
                      setIsModalOpen(true);
                    }}
                    onDelete={handleDeleteItem}
                  />
                </motion.div>
              ))
            ) : (
              <div className="p-12 text-center rounded-3xl bg-universe-900/40 border border-white/[0.06] space-y-4">
                <Compass className="w-10 h-10 text-cream-500 mx-auto animate-pulse" />
                <div className="space-y-1">
                  <h3 className="font-serif text-xl text-cream-100 font-normal">
                    No aspirations found in this sector
                  </h3>
                  <p className="text-xs text-cream-400">
                    Try changing your category filters or chart a new dream for our universe.
                  </p>
                </div>
                <Button
                  variant="glass"
                  size="sm"
                  icon={<Plus className="w-3.5 h-3.5 text-gold-400" />}
                  onClick={() => {
                    setSelectedCategory("All");
                    setSelectedStatus("All");
                    setSearchQuery("");
                  }}
                >
                  Reset Filters
                </Button>
              </div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <MobileBottomNav />

      {/* Add / Edit Modal */}
      <AddEditFutureItemModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingItem(null);
        }}
        onSave={handleSaveItem}
        initialItem={editingItem}
      />
    </PageTransition>
  );
}
