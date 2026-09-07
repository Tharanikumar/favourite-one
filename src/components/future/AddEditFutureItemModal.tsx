"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { FutureItem, FutureCategory, FutureStatus } from "@/lib/supabase/types";
import { uploadMemoryMedia } from "@/lib/supabase/storage";
import { useToast } from "@/lib/toast/ToastContext";
import { Sparkles, Upload } from "lucide-react";

interface AddEditFutureItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: Partial<FutureItem>) => void;
  initialItem?: FutureItem | null;
}

export function AddEditFutureItemModal({
  isOpen,
  onClose,
  onSave,
  initialItem,
}: AddEditFutureItemModalProps) {
  const toast = useToast();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<FutureCategory>("Places We Want To Visit");
  const [status, setStatus] = useState<FutureStatus>("Dream");
  const [targetDate, setTargetDate] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imageTab, setImageTab] = useState<"url" | "upload">("upload");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (initialItem) {
      setTitle(initialItem.title || "");
      setDescription(initialItem.description || "");
      setCategory(initialItem.category || "Places We Want To Visit");
      setStatus(initialItem.status || "Dream");
      setTargetDate(initialItem.target_date || "");
      setImageUrl(initialItem.image_url || "");
    } else {
      setTitle("");
      setDescription("");
      setCategory("Places We Want To Visit");
      setStatus("Dream");
      setTargetDate("");
      setImageUrl("");
    }
  }, [initialItem, isOpen]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const res = await uploadMemoryMedia(file, "photos");
      if (res.url) {
        setImageUrl(res.url);
        toast.success("Image uploaded", "Attached to your future dream.");
      } else {
        toast.error("Upload failed", res.error);
      }
    } catch {
      toast.error("Upload failed", "Could not process image file.");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Title required", "Please name your aspiration.");
      return;
    }

    const payload: Partial<FutureItem> = {
      ...(initialItem?.id ? { id: initialItem.id } : {}),
      title: title.trim(),
      description: description.trim(),
      category,
      status,
      target_date: targetDate || undefined,
      image_url: imageUrl || undefined,
      is_completed: status === "Completed",
      completed_date: status === "Completed" ? (initialItem?.completed_date || new Date().toISOString().split("T")[0]) : undefined,
      updated_at: new Date().toISOString(),
    };

    onSave(payload);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialItem ? "Edit Aspiration" : "Chart a New Chapter"}
      subtitle="Shape our future journeys, shared goals, and bucket list milestones."
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <div>
          <label className="block text-xs uppercase tracking-wider text-cream-300 mb-1.5 font-sans">
            Aspiration Title *
          </label>
          <input
            type="text"
            required
            placeholder="e.g., Rent a villa in the hills of Ravello"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-xl bg-universe-950 border border-white/[0.1] px-4 py-2.5 text-sm text-cream-100 placeholder-cream-600 focus:outline-none focus:border-gold-400"
          />
        </div>

        {/* Category & Status Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs uppercase tracking-wider text-cream-300 mb-1.5 font-sans">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as FutureCategory)}
              className="w-full rounded-xl bg-universe-950 border border-white/[0.1] px-3.5 py-2.5 text-sm text-cream-100 focus:outline-none focus:border-gold-400"
            >
              <option value="Places We Want To Visit">Places We Want To Visit</option>
              <option value="Things We Want To Do">Things We Want To Do</option>
              <option value="Dreams & Goals">Dreams &amp; Goals</option>
            </select>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-cream-300 mb-1.5 font-sans">
              Current Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as FutureStatus)}
              className="w-full rounded-xl bg-universe-950 border border-white/[0.1] px-3.5 py-2.5 text-sm text-cream-100 focus:outline-none focus:border-gold-400"
            >
              <option value="Dream">Dream (Conceived)</option>
              <option value="Planned">Planned (Scheduled)</option>
              <option value="In Progress">In Progress (Active)</option>
              <option value="Completed">Completed (Fulfilled)</option>
            </select>
          </div>
        </div>

        {/* Target Date */}
        <div>
          <label className="block text-xs uppercase tracking-wider text-cream-300 mb-1.5 font-sans">
            Target Horizon / Date (Optional)
          </label>
          <input
            type="text"
            placeholder="e.g., Summer 2027 or 2026-12-15"
            value={targetDate}
            onChange={(e) => setTargetDate(e.target.value)}
            className="w-full rounded-xl bg-universe-950 border border-white/[0.1] px-4 py-2.5 text-sm text-cream-100 placeholder-cream-600 focus:outline-none focus:border-gold-400"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs uppercase tracking-wider text-cream-300 mb-1.5 font-sans">
            Notes &amp; Inspiration
          </label>
          <textarea
            rows={3}
            placeholder="What does this dream look like? What feelings will we discover?"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded-xl bg-universe-950 border border-white/[0.1] p-3.5 text-sm text-cream-100 placeholder-cream-600 focus:outline-none focus:border-gold-400 font-sans"
          />
        </div>

        {/* Image Attachment (Upload or URL) */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs uppercase tracking-wider text-cream-300 font-sans">
              Inspirational Image
            </label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setImageTab("upload")}
                className={`text-[11px] px-2 py-0.5 rounded-md transition-colors ${
                  imageTab === "upload"
                    ? "bg-gold-400/20 text-gold-300 font-medium"
                    : "text-cream-400 hover:text-white"
                }`}
              >
                Upload File
              </button>
              <button
                type="button"
                onClick={() => setImageTab("url")}
                className={`text-[11px] px-2 py-0.5 rounded-md transition-colors ${
                  imageTab === "url"
                    ? "bg-gold-400/20 text-gold-300 font-medium"
                    : "text-cream-400 hover:text-white"
                }`}
              >
                Image URL
              </button>
            </div>
          </div>

          {imageTab === "upload" ? (
            <div className="relative border-2 border-dashed border-white/[0.1] hover:border-gold-400/40 rounded-xl p-4 text-center cursor-pointer transition-colors bg-universe-950/60">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                disabled={uploading}
              />
              <Upload className="w-5 h-5 text-gold-400 mx-auto mb-1.5" />
              <span className="text-xs text-cream-300 block">
                {uploading ? "Uploading to sanctuary..." : "Click or drag to attach inspiration photo"}
              </span>
            </div>
          ) : (
            <input
              type="url"
              placeholder="https://images.unsplash.com/..."
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full rounded-xl bg-universe-950 border border-white/[0.1] px-4 py-2.5 text-sm text-cream-100 placeholder-cream-600 focus:outline-none focus:border-gold-400"
            />
          )}

          {imageUrl && (
            <div className="mt-3 relative h-28 rounded-xl overflow-hidden border border-white/[0.1]">
              <Image src={imageUrl} alt="Inspiration preview" fill className="object-cover" />
              <button
                type="button"
                onClick={() => setImageUrl("")}
                className="absolute top-2 right-2 px-2 py-1 rounded-md bg-universe-950/80 text-[10px] text-rose-400 border border-white/[0.1]"
              >
                Remove
              </button>
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t border-white/[0.06]">
          <Button type="button" variant="ghost" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="gold" size="sm" icon={<Sparkles className="w-3.5 h-3.5" />}>
            {initialItem ? "Save Changes" : "Pledge Aspiration"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
