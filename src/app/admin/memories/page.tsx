"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { MediaUploader } from "@/components/admin/MediaUploader";
import { DeleteConfirmModal } from "@/components/admin/DeleteConfirmModal";
import { MOCK_MEMORIES } from "@/lib/mockData";
import { Memory } from "@/lib/supabase/types";
import { formatDate } from "@/lib/utils";
import { useToast } from "@/lib/toast/ToastContext";
import {
  Plus,
  Search,
  Camera,
  Star,
  Lock,
  Edit2,
  Trash2,
  Calendar,
  MapPin,
} from "lucide-react";

export default function AdminMemoriesPage() {
  const toast = useToast();
  const [memories, setMemories] = useState<Memory[]>(MOCK_MEMORIES);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMemory, setEditingMemory] = useState<Memory | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Form states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState<Memory["category"]>("Date Night");
  const [mediaType, setMediaType] = useState<"image" | "video">("image");
  const [mediaUrl, setMediaUrl] = useState("");
  const [isFavorite, setIsFavorite] = useState(false);
  const [isPrivate, setIsPrivate] = useState(false);

  const categories = ["All", "Trip", "Date Night", "Milestone", "Quiet Moment", "Celebration"];

  const filteredMemories = useMemo(() => {
    return memories.filter((m) => {
      if (categoryFilter !== "All" && m.category !== categoryFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          m.title.toLowerCase().includes(q) ||
          m.description.toLowerCase().includes(q) ||
          (m.location || "").toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [memories, categoryFilter, searchQuery]);

  const handleOpenAdd = () => {
    setEditingMemory(null);
    setTitle("");
    setDescription("");
    setDate(new Date().toISOString().split("T")[0]);
    setLocation("");
    setCategory("Date Night");
    setMediaType("image");
    setMediaUrl("");
    setIsFavorite(false);
    setIsPrivate(false);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (m: Memory) => {
    setEditingMemory(m);
    setTitle(m.title);
    setDescription(m.description);
    setDate(m.date);
    setLocation(m.location || "");
    setCategory(m.category);
    setMediaType(m.media_type === "video" ? "video" : "image");
    setMediaUrl(m.media_url || "");
    setIsFavorite(m.is_favorite);
    setIsPrivate(m.is_private || false);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Title required", "Please enter a memory title.");
      return;
    }

    if (editingMemory) {
      setMemories((prev) =>
        prev.map((m) =>
          m.id === editingMemory.id
            ? {
                ...m,
                title,
                description,
                date,
                location,
                category,
                media_type: mediaType,
                media_url: mediaUrl,
                is_favorite: isFavorite,
                is_private: isPrivate,
                updated_at: new Date().toISOString(),
              }
            : m
        )
      );
      toast.success("Memory Updated", `"${title}" has been saved.`);
    } else {
      const newMemory: Memory = {
        id: "mem-" + Date.now().toString(36),
        title,
        description,
        date: date || new Date().toISOString().split("T")[0],
        location,
        category,
        media_type: mediaType,
        media_url: mediaUrl,
        is_favorite: isFavorite,
        is_private: isPrivate,
        tags: [],
        created_at: new Date().toISOString(),
      };
      setMemories([newMemory, ...memories]);
      toast.success("Memory Preserved", `"${title}" added to gallery.`);
    }

    setIsModalOpen(false);
  };

  const handleDelete = () => {
    if (!deleteId) return;
    setMemories((prev) => prev.filter((m) => m.id !== deleteId));
    toast.info("Memory Deleted", "Removed from archives.");
    setDeleteId(null);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="gold" size="sm">
              Gallery CMS
            </Badge>
            <span className="text-xs text-cream-400 font-mono">Memories &amp; Media</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl text-cream-50 font-normal">
            Manage Visual Moments
          </h1>
          <p className="text-xs text-cream-300 font-sans mt-0.5">
            Upload photographs, videos, write captions, and tag sacred memories.
          </p>
        </div>

        <Button variant="gold" size="sm" icon={<Plus className="w-4 h-4" />} onClick={handleOpenAdd}>
          Add New Memory
        </Button>
      </div>

      {/* Filter & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            placeholder="Search memories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-full bg-universe-900/90 border border-white/[0.08] px-4 py-2 pl-9 text-xs text-cream-100 placeholder-cream-500 focus:outline-none focus:border-gold-400"
          />
          <Search className="w-3.5 h-3.5 text-cream-500 absolute left-3 top-2.5" />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1 rounded-full text-xs font-sans transition-all ${
                categoryFilter === cat
                  ? "bg-gold-500 text-universe-950 font-semibold"
                  : "bg-universe-900 text-cream-300 hover:text-white border border-white/[0.08]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMemories.map((m) => (
          <Card key={m.id} className="p-5 flex flex-col justify-between border-white/[0.08] bg-universe-900/70">
            <div className="space-y-3">
              {/* Media preview */}
              <div className="relative aspect-[16/10] rounded-xl overflow-hidden bg-universe-950 border border-white/[0.08]">
                {m.media_url ? (
                  m.media_type === "video" ? (
                    <video src={m.media_url} className="w-full h-full object-cover" muted />
                  ) : (
                    <Image src={m.media_url} alt={m.title} fill className="object-cover" />
                  )
                ) : (
                  <div className="flex items-center justify-center w-full h-full text-cream-600">
                    <Camera className="w-8 h-8" />
                  </div>
                )}

                <div className="absolute top-2 left-2 flex items-center gap-1.5">
                  <Badge variant="gold" size="sm">
                    {m.category}
                  </Badge>
                  {m.is_favorite && (
                    <span className="p-1 rounded-full bg-rose-500/80 text-white shadow-sm">
                      <Star className="w-3 h-3 fill-current" />
                    </span>
                  )}
                  {m.is_private && (
                    <span className="p-1 rounded-full bg-universe-950/80 text-gold-400 border border-gold-400/30">
                      <Lock className="w-3 h-3" />
                    </span>
                  )}
                </div>
              </div>

              {/* Title & info */}
              <div>
                <h3 className="font-serif text-lg text-cream-50 line-clamp-1">{m.title}</h3>
                <div className="flex items-center gap-3 text-[11px] text-cream-400 font-mono mt-1">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-gold-400/70" />
                    {formatDate(m.date)}
                  </span>
                  {m.location && (
                    <span className="flex items-center gap-1 truncate">
                      <MapPin className="w-3 h-3 text-rose-400/70" />
                      {m.location}
                    </span>
                  )}
                </div>
              </div>

              <p className="text-xs text-cream-300 font-sans line-clamp-2 leading-relaxed">
                {m.description}
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2 pt-4 mt-4 border-t border-white/[0.06]">
              <Button
                variant="ghost"
                size="sm"
                className="p-2 h-8 text-cream-300 hover:text-gold-300"
                onClick={() => handleOpenEdit(m)}
              >
                <Edit2 className="w-3.5 h-3.5 mr-1" /> Edit
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="p-2 h-8 text-rose-400 hover:bg-rose-500/10"
                onClick={() => setDeleteId(m.id)}
              >
                <Trash2 className="w-3.5 h-3.5 mr-1" /> Delete
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Add / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingMemory ? "Edit Memory Record" : "Add New Memory"}
        subtitle="Preserve photographic or video chronicles for our gallery."
        size="md"
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs uppercase tracking-wider text-cream-300 mb-1.5 font-sans">
              Memory Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g., Midnight Walk in Paris"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-xl bg-universe-950 border border-white/[0.1] px-4 py-2.5 text-sm text-cream-100 placeholder-cream-600 focus:outline-none focus:border-gold-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-cream-300 mb-1.5 font-sans">
                Date *
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full rounded-xl bg-universe-950 border border-white/[0.1] px-3.5 py-2.5 text-sm text-cream-100 focus:outline-none focus:border-gold-400"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-cream-300 mb-1.5 font-sans">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as Memory["category"])}
                className="w-full rounded-xl bg-universe-950 border border-white/[0.1] px-3.5 py-2.5 text-sm text-cream-100 focus:outline-none focus:border-gold-400"
              >
                <option value="Date Night">Date Night</option>
                <option value="Trip">Trip</option>
                <option value="Milestone">Milestone</option>
                <option value="Quiet Moment">Quiet Moment</option>
                <option value="Celebration">Celebration</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-cream-300 mb-1.5 font-sans">
              Location Name
            </label>
            <input
              type="text"
              placeholder="e.g., Café de Flore, Paris"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full rounded-xl bg-universe-950 border border-white/[0.1] px-4 py-2.5 text-sm text-cream-100 placeholder-cream-600 focus:outline-none focus:border-gold-400"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-cream-300 mb-1.5 font-sans">
              Story / Description
            </label>
            <textarea
              rows={3}
              placeholder="Write the intimate backstory of this moment..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-xl bg-universe-950 border border-white/[0.1] p-3 text-sm text-cream-100 placeholder-cream-600 focus:outline-none focus:border-gold-400 font-sans"
            />
          </div>

          {/* Media Uploader */}
          <MediaUploader
            label="Attach Photo or Video"
            accept={mediaType}
            folder="photos"
            currentUrl={mediaUrl}
            onUploadComplete={(url) => setMediaUrl(url)}
          />

          {/* Toggles */}
          <div className="flex items-center gap-6 pt-2">
            <label className="flex items-center gap-2 text-xs text-cream-200 cursor-pointer">
              <input
                type="checkbox"
                checked={isFavorite}
                onChange={(e) => setIsFavorite(e.target.checked)}
                className="rounded border-white/[0.2] bg-universe-950 text-gold-400 focus:ring-0"
              />
              <span>Mark as Favorite Snapshot</span>
            </label>

            <label className="flex items-center gap-2 text-xs text-cream-200 cursor-pointer">
              <input
                type="checkbox"
                checked={isPrivate}
                onChange={(e) => setIsPrivate(e.target.checked)}
                className="rounded border-white/[0.2] bg-universe-950 text-gold-400 focus:ring-0"
              />
              <span>Keep in Private Vault</span>
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-white/[0.06]">
            <Button type="button" variant="ghost" size="sm" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="gold" size="sm">
              Save Memory
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <DeleteConfirmModal
        isOpen={Boolean(deleteId)}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Memory"
        itemName={memories.find((m) => m.id === deleteId)?.title}
      />
    </div>
  );
}
