"use client";

import React, { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Letter, LetterCategory } from "@/lib/types";
import {
  Sparkles,
  Lock,
  Image as ImageIcon,
  Mic,
  Feather,
} from "lucide-react";

interface ComposeLetterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCompose: (newLetter: Letter) => void;
}

export function ComposeLetterModal({
  isOpen,
  onClose,
  onCompose,
}: ComposeLetterModalProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState("Tharani");
  const [recipient, setRecipient] = useState("Surya");
  const [category, setCategory] = useState<LetterCategory>("Open when you miss me");
  const [isSealed, setIsSealed] = useState(false);
  const [openDate, setOpenDate] = useState("");
  const [sealColor, setSealColor] = useState<"gold" | "rose" | "charcoal">("gold");
  const [imageUrl, setImageUrl] = useState("");
  const [imageCaption, setImageCaption] = useState("");
  const [hasAudio, setHasAudio] = useState(false);
  const [audioDuration, setAudioDuration] = useState("1:15");

  const categories: LetterCategory[] = [
    "Open when you miss me",
    "Open when you're sad",
    "Open when you're angry",
    "Open when you need motivation",
    "Anniversary letter",
    "Birthday letter",
    "Future letter",
    "Just Because",
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    const newLetter: Letter = {
      id: `let-${Date.now()}`,
      title: title.trim(),
      content: content.trim(),
      author,
      recipient,
      date: new Date().toISOString().split("T")[0],
      category,
      is_sealed: isSealed,
      is_read: false,
      open_date: isSealed ? openDate : undefined,
      seal_color: sealColor,
      image_url: imageUrl.trim() || undefined,
      image_caption: imageCaption.trim() || undefined,
      audio_url: hasAudio ? "custom-audio" : undefined,
      audio_duration: hasAudio ? audioDuration : undefined,
    };

    onCompose(newLetter);
    onClose();

    // Reset form
    setTitle("");
    setContent("");
    setImageUrl("");
    setImageCaption("");
    setIsSealed(false);
    setOpenDate("");
    setHasAudio(false);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Compose a Heartfelt Letter"
      subtitle="Pen a note for today, or seal it in digital wax for a future anniversary."
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Author & Recipient Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs uppercase tracking-wider text-cream-300 mb-1.5 font-mono">
              From
            </label>
            <select
              value={author}
              onChange={(e) => {
                const val = e.target.value;
                setAuthor(val);
                setRecipient(val === "Tharani" ? "Surya" : "Tharani");
              }}
              className="w-full rounded-xl bg-universe-950 border border-white/[0.1] px-4 py-2.5 text-sm text-cream-100 focus:outline-none focus:border-gold-400"
            >
              <option value="Tharani">Tharani</option>
              <option value="Surya">Surya</option>
            </select>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-cream-300 mb-1.5 font-mono">
              To
            </label>
            <select
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              className="w-full rounded-xl bg-universe-950 border border-white/[0.1] px-4 py-2.5 text-sm text-cream-100 focus:outline-none focus:border-gold-400"
            >
              <option value="Surya">Surya</option>
              <option value="Tharani">Tharani</option>
            </select>
          </div>
        </div>

        {/* Special Category & Seal Color */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs uppercase tracking-wider text-cream-300 mb-1.5 font-mono">
              Letter Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as LetterCategory)}
              className="w-full rounded-xl bg-universe-950 border border-white/[0.1] px-4 py-2.5 text-sm text-cream-100 focus:outline-none focus:border-gold-400"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-cream-300 mb-1.5 font-mono">
              Wax Seal Theme
            </label>
            <div className="flex items-center gap-3 pt-1.5">
              {(["gold", "rose", "charcoal"] as const).map((color) => (
                <label
                  key={color}
                  onClick={() => setSealColor(color)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono border cursor-pointer transition-all ${
                    sealColor === color
                      ? "bg-white/10 border-gold-400 text-gold-300"
                      : "border-white/[0.08] text-cream-400 hover:border-white/20"
                  }`}
                >
                  <span
                    className={`w-3 h-3 rounded-full ${
                      color === "gold"
                        ? "bg-gold-500"
                        : color === "rose"
                        ? "bg-rose-500"
                        : "bg-universe-700 border border-white/20"
                    }`}
                  />
                  <span className="capitalize">{color}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Title */}
        <div>
          <label className="block text-xs uppercase tracking-wider text-cream-300 mb-1.5 font-mono">
            Letter Title / Salutation
          </label>
          <input
            type="text"
            required
            placeholder="e.g., Open When You Miss Me, To the Love of My Life..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-xl bg-universe-950 border border-white/[0.1] px-4 py-2.5 text-sm text-cream-100 placeholder-cream-600 focus:outline-none focus:border-gold-400"
          />
        </div>

        {/* Letter Content */}
        <div>
          <label className="block text-xs uppercase tracking-wider text-cream-300 mb-1.5 font-mono">
            Letter Message
          </label>
          <textarea
            required
            rows={6}
            placeholder="Pour your thoughts freely onto this digital parchment..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full rounded-xl bg-universe-950 border border-white/[0.1] p-4 text-sm text-cream-100 placeholder-cream-600 focus:outline-none focus:border-gold-400 font-serif leading-relaxed"
          />
        </div>

        {/* Time-Lock & Future Seal Setting */}
        <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-3">
          <label className="flex items-center gap-2 text-xs text-cream-200 cursor-pointer">
            <input
              type="checkbox"
              checked={isSealed}
              onChange={(e) => setIsSealed(e.target.checked)}
              className="w-4 h-4 rounded border-white/[0.2] bg-universe-950 text-gold-500 focus:ring-gold-400"
            />
            <span className="flex items-center gap-1.5 font-medium">
              <Lock className="w-3.5 h-3.5 text-gold-400" />
              Time-Lock with Digital Wax Seal
            </span>
          </label>

          {isSealed && (
            <div className="pt-2">
              <label className="block text-xs text-cream-400 mb-1">
                Unseal Date (Scheduled Unlock)
              </label>
              <input
                type="date"
                required={isSealed}
                value={openDate}
                onChange={(e) => setOpenDate(e.target.value)}
                className="w-full sm:w-60 rounded-xl bg-universe-950 border border-white/[0.1] px-3.5 py-2 text-xs text-cream-100 focus:outline-none focus:border-gold-400 font-mono"
              />
            </div>
          )}
        </div>

        {/* Optional Media (Photo & Voice Memo) */}
        <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-4">
          <div className="flex items-center gap-2 text-xs font-mono text-gold-300 uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-gold-400" />
            <span>Optional Attachments</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-cream-300 mb-1 flex items-center gap-1.5">
                <ImageIcon className="w-3 h-3 text-gold-400" />
                Attached Photo URL
              </label>
              <input
                type="url"
                placeholder="https://images.unsplash.com/..."
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full rounded-xl bg-universe-950 border border-white/[0.1] px-3.5 py-2 text-xs text-cream-100 placeholder-cream-600 focus:outline-none focus:border-gold-400"
              />
            </div>

            <div>
              <label className="block text-xs text-cream-300 mb-1">
                Photo Caption
              </label>
              <input
                type="text"
                placeholder="e.g. A sunset memory from last summer"
                value={imageCaption}
                onChange={(e) => setImageCaption(e.target.value)}
                className="w-full rounded-xl bg-universe-950 border border-white/[0.1] px-3.5 py-2 text-xs text-cream-100 placeholder-cream-600 focus:outline-none focus:border-gold-400"
              />
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between border-t border-white/[0.04]">
            <label className="flex items-center gap-2 text-xs text-cream-300 cursor-pointer">
              <input
                type="checkbox"
                checked={hasAudio}
                onChange={(e) => setHasAudio(e.target.checked)}
                className="w-4 h-4 rounded border-white/[0.2] bg-universe-950 text-gold-500 focus:ring-gold-400"
              />
              <span className="flex items-center gap-1.5">
                <Mic className="w-3.5 h-3.5 text-gold-400" />
                Attach Voice Recording
              </span>
            </label>

            {hasAudio && (
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
            icon={<Feather className="w-3.5 h-3.5" />}
          >
            {isSealed ? "Seal in Digital Wax" : "Send to Letter Archive"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
