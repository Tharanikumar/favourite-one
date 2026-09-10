"use client";

import React, { useState } from "react";
import { TimelineEvent } from "@/lib/types";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Send } from "lucide-react";

export interface AddTimelineEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddEvent: (newEvent: TimelineEvent) => void;
}

export function AddTimelineEventModal({
  isOpen,
  onClose,
  onAddEvent,
}: AddTimelineEventModalProps) {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [category, setCategory] = useState<TimelineEvent["category"]>("Milestones");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [personalNote, setPersonalNote] = useState("");
  const [noteAuthor, setNoteAuthor] = useState("Tharani");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const event: TimelineEvent = {
      id: `te-${Date.now()}`,
      title,
      date,
      category,
      description,
      location: location || undefined,
      image_url: imageUrl || undefined,
      gallery_urls: imageUrl ? [imageUrl] : undefined,
      personal_note: personalNote || undefined,
      personal_note_author: personalNote ? noteAuthor : undefined,
      is_major: category === "Milestones",
      icon: category === "Trips" ? "Compass" : category === "Photos" ? "Camera" : "Sparkles",
    };

    onAddEvent(event);
    onClose();

    // Reset form
    setTitle("");
    setDate("");
    setDescription("");
    setLocation("");
    setImageUrl("");
    setPersonalNote("");
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Record a Story Milestone"
      subtitle="Chronicle a special date, journey, or memory on your relationship timeline."
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs uppercase tracking-wider text-cream-300 mb-1.5 font-sans">
            Event Title
          </label>
          <input
            type="text"
            required
            placeholder="e.g., The Afternoon by the Lake"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-xl bg-universe-950 border border-white/[0.1] px-4 py-2.5 text-sm text-cream-100 placeholder-cream-500 focus:outline-none focus:border-gold-400"
          />
        </div>

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
              onChange={(e) => setCategory(e.target.value as TimelineEvent["category"])}
              className="w-full rounded-xl bg-universe-950 border border-white/[0.1] px-3.5 py-2.5 text-sm text-cream-100 focus:outline-none focus:border-gold-400"
            >
              <option value="Milestones">Milestones</option>
              <option value="Trips">Trips</option>
              <option value="Photos">Photos</option>
              <option value="Special Moments">Special Moments</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs uppercase tracking-wider text-cream-300 mb-1.5 font-sans">
              Location (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g., Big Sur Overlook"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full rounded-xl bg-universe-950 border border-white/[0.1] px-4 py-2.5 text-sm text-cream-100 placeholder-cream-500 focus:outline-none focus:border-gold-400"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-cream-300 mb-1.5 font-sans">
              Image URL (Optional)
            </label>
            <input
              type="url"
              placeholder="https://images.unsplash.com/..."
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full rounded-xl bg-universe-950 border border-white/[0.1] px-4 py-2.5 text-sm text-cream-100 placeholder-cream-500 focus:outline-none focus:border-gold-400 font-mono text-xs"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs uppercase tracking-wider text-cream-300 mb-1.5 font-sans">
            Story Narrative
          </label>
          <textarea
            required
            rows={3}
            placeholder="Tell the story of what happened..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded-xl bg-universe-950 border border-white/[0.1] p-3.5 text-sm text-cream-100 placeholder-cream-500 focus:outline-none focus:border-gold-400 font-sans"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs uppercase tracking-wider text-cream-300 font-sans">
              Personal Reflection Note (Optional)
            </label>
            <select
              value={noteAuthor}
              onChange={(e) => setNoteAuthor(e.target.value)}
              className="text-xs rounded-lg bg-universe-950 border border-white/[0.1] px-2 py-1 text-cream-300 focus:outline-none"
            >
              <option value="Tharani">By Tharani</option>
              <option value="Surya">By Surya</option>
            </select>
          </div>
          <textarea
            rows={2}
            placeholder="A private note or heartfelt quote from this day..."
            value={personalNote}
            onChange={(e) => setPersonalNote(e.target.value)}
            className="w-full rounded-xl bg-universe-950 border border-white/[0.1] p-3.5 text-sm text-cream-100 placeholder-cream-500 focus:outline-none focus:border-gold-400 font-serif italic"
          />
        </div>

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
            Chronicle Event
          </Button>
        </div>
      </form>
    </Modal>
  );
}
