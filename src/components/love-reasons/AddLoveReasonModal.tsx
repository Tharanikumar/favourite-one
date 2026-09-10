"use client";

import React, { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { LoveReason, LoveReasonCategory } from "@/lib/types";
import { Send, Sparkles, Image as ImageIcon, Mic } from "lucide-react";

interface AddLoveReasonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (newReason: LoveReason) => void;
  nextNumber: number;
}

export function AddLoveReasonModal({
  isOpen,
  onClose,
  onAdd,
  nextNumber,
}: AddLoveReasonModalProps) {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [category, setCategory] = useState<LoveReasonCategory>("The Little Things");
  const [author, setAuthor] = useState("Tharani");
  const [photoUrl, setPhotoUrl] = useState("");
  const [photoCaption, setPhotoCaption] = useState("");
  const [hasVoiceNote, setHasVoiceNote] = useState(false);
  const [audioDuration, setAudioDuration] = useState("0:45");

  const categories: LoveReasonCategory[] = [
    "The Little Things",
    "Soul & Depth",
    "Everyday Magic",
    "Conversations",
    "Quirks",
    "Heart",
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) return;

    const newReason: LoveReason = {
      id: `lr-${Date.now()}`,
      number: nextNumber,
      title: title.trim(),
      message: message.trim(),
      description: message.trim(),
      category,
      author,
      photo_url: photoUrl.trim() || undefined,
      photo_caption: photoCaption.trim() || undefined,
      audio_url: hasVoiceNote ? "custom-audio" : undefined,
      audio_duration: hasVoiceNote ? audioDuration : undefined,
      is_favorite: false,
    };

    onAdd(newReason);
    onClose();

    // Reset form
    setTitle("");
    setMessage("");
    setPhotoUrl("");
    setPhotoCaption("");
    setHasVoiceNote(false);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add a Thing I Love About You"
      subtitle="Pen another detail of affection to immortalize in your universe."
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Author & Category Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs uppercase tracking-wider text-cream-300 mb-1.5 font-mono">
              Penned By
            </label>
            <select
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="w-full rounded-xl bg-universe-950 border border-white/[0.1] px-4 py-2.5 text-sm text-cream-100 focus:outline-none focus:border-gold-400"
            >
              <option value="Tharani">Tharani</option>
              <option value="Surya">Surya</option>
            </select>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-cream-300 mb-1.5 font-mono">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as LoveReasonCategory)}
              className="w-full rounded-xl bg-universe-950 border border-white/[0.1] px-4 py-2.5 text-sm text-cream-100 focus:outline-none focus:border-gold-400"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Short Title */}
        <div>
          <label className="block text-xs uppercase tracking-wider text-cream-300 mb-1.5 font-mono">
            Short Title
          </label>
          <input
            type="text"
            required
            placeholder="e.g., Your smile, The way you care, Our conversations..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-xl bg-universe-950 border border-white/[0.1] px-4 py-2.5 text-sm text-cream-100 placeholder-cream-600 focus:outline-none focus:border-gold-400"
          />
        </div>

        {/* Full Personal Message */}
        <div>
          <label className="block text-xs uppercase tracking-wider text-cream-300 mb-1.5 font-mono">
            Personal Message
          </label>
          <textarea
            required
            rows={4}
            placeholder="Describe what makes this trait, moment, or quality so irreplaceable..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full rounded-xl bg-universe-950 border border-white/[0.1] p-4 text-sm text-cream-100 placeholder-cream-600 focus:outline-none focus:border-gold-400 font-serif leading-relaxed"
          />
        </div>

        {/* Optional Media (Photo & Voice Note) */}
        <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-4">
          <div className="flex items-center gap-2 text-xs font-mono text-gold-300 uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-gold-400" />
            <span>Optional Attachments</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-cream-300 mb-1 flex items-center gap-1.5">
                <ImageIcon className="w-3 h-3 text-gold-400" />
                Photo URL (Optional)
              </label>
              <input
                type="url"
                placeholder="https://images.unsplash.com/..."
                value={photoUrl}
                onChange={(e) => setPhotoUrl(e.target.value)}
                className="w-full rounded-xl bg-universe-950 border border-white/[0.1] px-3.5 py-2 text-xs text-cream-100 placeholder-cream-600 focus:outline-none focus:border-gold-400"
              />
            </div>

            <div>
              <label className="block text-xs text-cream-300 mb-1">
                Photo Caption (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Laughing by the seaside"
                value={photoCaption}
                onChange={(e) => setPhotoCaption(e.target.value)}
                className="w-full rounded-xl bg-universe-950 border border-white/[0.1] px-3.5 py-2 text-xs text-cream-100 placeholder-cream-600 focus:outline-none focus:border-gold-400"
              />
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between border-t border-white/[0.04]">
            <label className="flex items-center gap-2 text-xs text-cream-300 cursor-pointer">
              <input
                type="checkbox"
                checked={hasVoiceNote}
                onChange={(e) => setHasVoiceNote(e.target.checked)}
                className="w-4 h-4 rounded border-white/[0.2] bg-universe-950 text-gold-500 focus:ring-gold-400"
              />
              <span className="flex items-center gap-1.5">
                <Mic className="w-3.5 h-3.5 text-gold-400" />
                Attach Simulated Voice Memo
              </span>
            </label>

            {hasVoiceNote && (
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono text-cream-400">Duration:</span>
                <input
                  type="text"
                  value={audioDuration}
                  onChange={(e) => setAudioDuration(e.target.value)}
                  className="w-16 rounded-lg bg-universe-950 border border-white/[0.1] px-2 py-1 text-xs text-center text-gold-300 font-mono"
                />
              </div>
            )}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3 pt-3 border-t border-white/[0.06]">
          <Button type="button" variant="ghost" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="gold"
            size="sm"
            icon={<Send className="w-3.5 h-3.5" />}
          >
            Save to Card Deck
          </Button>
        </div>
      </form>
    </Modal>
  );
}
