"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { Memory } from "@/lib/supabase/types";
import { uploadMemoryMedia } from "@/lib/supabase/storage";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import {
  UploadCloud,
  X,
  Sparkles,
  Heart,
} from "lucide-react";

export interface UploadMemoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddMemory: (newMemory: Memory) => void;
}

export function UploadMemoryModal({
  isOpen,
  onClose,
  onAddMemory,
}: UploadMemoryModalProps) {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [category, setCategory] = useState<Memory["category"]>("Trip");
  const [mediaType, setMediaType] = useState<"image" | "video">("image");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [isFavorite, setIsFavorite] = useState(false);

  // File upload state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const isVideoFile = file.type.startsWith("video");
      setMediaType(isVideoFile ? "video" : "image");
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setPreviewUrl("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);

    let finalMediaUrl = previewUrl || "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=80";

    if (selectedFile) {
      const result = await uploadMemoryMedia(
        selectedFile,
        mediaType === "video" ? "videos" : "photos"
      );
      finalMediaUrl = result.url;
    }

    const newMemory: Memory = {
      id: `mem-${Date.now()}`,
      title,
      date,
      category,
      media_type: mediaType,
      media_url: finalMediaUrl,
      location: location || undefined,
      description,
      is_favorite: isFavorite,
      tags: tags
        ? tags
            .split(",")
            .map((t) => t.trim().replace(/^#/, ""))
            .filter(Boolean)
        : ["Memory"],
    };

    onAddMemory(newMemory);
    setIsUploading(false);
    onClose();

    // Reset Form
    setTitle("");
    setDate("");
    setDescription("");
    setLocation("");
    setTags("");
    setIsFavorite(false);
    setSelectedFile(null);
    setPreviewUrl("");
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add a New Moment"
      subtitle="Preserve a photo or video memory into our sanctuary archive."
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Media Upload Area */}
        <div>
          <label className="block text-xs uppercase tracking-wider text-cream-300 mb-2 font-sans">
            Upload Photograph or Video
          </label>

          {previewUrl ? (
            <div className="relative aspect-[16/9] rounded-2xl overflow-hidden bg-universe-950 border border-gold-400/30 group">
              {mediaType === "video" ? (
                <video
                  src={previewUrl}
                  controls
                  className="w-full h-full object-cover"
                />
              ) : (
                <Image
                  src={previewUrl}
                  alt="Preview"
                  fill
                  className="object-cover"
                />
              )}

              <button
                type="button"
                onClick={handleRemoveFile}
                className="absolute top-3 right-3 p-2 rounded-full bg-universe-950/80 hover:bg-rose-500 text-cream-100 transition-colors z-20"
                title="Remove media"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-white/[0.1] hover:border-gold-400/40 rounded-2xl p-6 sm:p-8 text-center cursor-pointer transition-all bg-universe-950/50 hover:bg-universe-900/50 flex flex-col items-center justify-center space-y-2"
            >
              <div className="w-12 h-12 rounded-full bg-universe-800 flex items-center justify-center text-gold-400 border border-white/[0.06] mb-1">
                <UploadCloud className="w-6 h-6" />
              </div>
              <div className="text-sm font-medium text-cream-100">
                Click to choose photo or video
              </div>
              <div className="text-xs text-cream-400">
                Supports JPG, PNG, WEBP, MP4, MOV (Processed via Supabase Storage)
              </div>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,video/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>

        {/* Title */}
        <div>
          <label className="block text-xs uppercase tracking-wider text-cream-300 mb-1.5 font-sans">
            Memory Title
          </label>
          <input
            type="text"
            required
            placeholder="e.g., The Rainy Evening in Montmartre"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-xl bg-universe-950 border border-white/[0.1] px-4 py-2.5 text-sm text-cream-100 focus:outline-none focus:border-gold-400"
          />
        </div>

        {/* Date & Category */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs uppercase tracking-wider text-cream-300 mb-1.5 font-sans">
              Date
            </label>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full rounded-xl bg-universe-950 border border-white/[0.1] px-4 py-2.5 text-sm text-cream-100 focus:outline-none focus:border-gold-400"
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
              <option value="Trip">Trip</option>
              <option value="Date Night">Date Night</option>
              <option value="Milestone">Milestone</option>
              <option value="Quiet Moment">Quiet Moment</option>
              <option value="Celebration">Celebration</option>
            </select>
          </div>
        </div>

        {/* Location & Tags */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs uppercase tracking-wider text-cream-300 mb-1.5 font-sans">
              Location (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g., Paris, France"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full rounded-xl bg-universe-950 border border-white/[0.1] px-4 py-2.5 text-sm text-cream-100 focus:outline-none focus:border-gold-400"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-cream-300 mb-1.5 font-sans">
              Tags (Comma separated)
            </label>
            <input
              type="text"
              placeholder="e.g., Rain, Paris, Bookstore"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="w-full rounded-xl bg-universe-950 border border-white/[0.1] px-4 py-2.5 text-sm text-cream-100 focus:outline-none focus:border-gold-400"
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs uppercase tracking-wider text-cream-300 mb-1.5 font-sans">
            Story / Caption
          </label>
          <textarea
            required
            rows={3}
            placeholder="What feelings, sounds, and laughter made this memory special?"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded-xl bg-universe-950 border border-white/[0.1] p-3.5 text-sm text-cream-100 focus:outline-none focus:border-gold-400 font-sans"
          />
        </div>

        {/* Favorite Checkbox */}
        <div className="flex items-center gap-2 pt-1">
          <input
            type="checkbox"
            id="favCheck"
            checked={isFavorite}
            onChange={(e) => setIsFavorite(e.target.checked)}
            className="rounded bg-universe-950 border-white/[0.2] text-gold-400 focus:ring-0 w-4 h-4 cursor-pointer"
          />
          <label
            htmlFor="favCheck"
            className="text-xs text-cream-200 cursor-pointer flex items-center gap-1.5"
          >
            <Heart className="w-3.5 h-3.5 text-rose-400" />
            Mark as Favorite Sanctuary Memory
          </label>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-3 border-t border-white/[0.06]">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onClose}
            disabled={isUploading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="gold"
            size="sm"
            isLoading={isUploading}
            icon={<Sparkles className="w-3.5 h-3.5" />}
          >
            Preserve in Sanctuary
          </Button>
        </div>
      </form>
    </Modal>
  );
}
