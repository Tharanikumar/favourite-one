"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { MediaUploader } from "@/components/admin/MediaUploader";
import { DeleteConfirmModal } from "@/components/admin/DeleteConfirmModal";
import { MOCK_TIMELINE_EVENTS } from "@/lib/mockData";
import { TimelineEvent } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { useToast } from "@/lib/toast/ToastContext";
import { Plus, Edit2, Trash2, Calendar } from "lucide-react";

export default function AdminTimelinePage() {
  const toast = useToast();
  const [events, setEvents] = useState<TimelineEvent[]>(MOCK_TIMELINE_EVENTS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<TimelineEvent | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Form states
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<TimelineEvent["category"]>("Milestones");
  const [location, setLocation] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isMajor, setIsMajor] = useState(false);

  const handleOpenAdd = () => {
    setEditingEvent(null);
    setTitle("");
    setDate(new Date().toISOString().split("T")[0]);
    setDescription("");
    setCategory("Milestones");
    setLocation("");
    setImageUrl("");
    setIsMajor(false);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (ev: TimelineEvent) => {
    setEditingEvent(ev);
    setTitle(ev.title);
    setDate(ev.date);
    setDescription(ev.description);
    setCategory(ev.category);
    setLocation(ev.location || "");
    setImageUrl(ev.image_url || "");
    setIsMajor(ev.is_major || false);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (editingEvent) {
      setEvents((prev) =>
        prev.map((ev) =>
          ev.id === editingEvent.id
            ? {
                ...ev,
                title,
                date,
                description,
                category,
                location,
                image_url: imageUrl,
                is_major: isMajor,
                updated_at: new Date().toISOString(),
              }
            : ev
        )
      );
      toast.success("Timeline Event Updated", title);
    } else {
      const newEv: TimelineEvent = {
        id: "tl-" + Date.now().toString(36),
        title,
        date,
        description,
        category,
        location,
        image_url: imageUrl,
        is_major: isMajor,
        created_at: new Date().toISOString(),
      };
      setEvents([newEv, ...events]);
      toast.success("Timeline Event Added", title);
    }

    setIsModalOpen(false);
  };

  const handleDelete = () => {
    if (!deleteId) return;
    setEvents((prev) => prev.filter((e) => e.id !== deleteId));
    toast.info("Event Deleted", "Removed from chronology.");
    setDeleteId(null);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="gold" size="sm">
              Chronology CMS
            </Badge>
            <span className="text-xs text-cream-400 font-mono">Story Milestones</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl text-cream-50 font-normal">
            Manage Story Timeline
          </h1>
          <p className="text-xs text-cream-300 font-sans mt-0.5">
            Curate the key dates, chapters, and turning points in our love story.
          </p>
        </div>

        <Button variant="gold" size="sm" icon={<Plus className="w-4 h-4" />} onClick={handleOpenAdd}>
          Add Timeline Event
        </Button>
      </div>

      <div className="space-y-4">
        {events.map((ev) => (
          <Card key={ev.id} className="p-5 flex items-start justify-between gap-4 bg-universe-900/70 border-white/[0.08]">
            <div className="space-y-1.5 flex-1">
              <div className="flex items-center gap-2">
                <Badge variant={ev.is_major ? "gold" : "subtle"} size="sm">
                  {ev.category}
                </Badge>
                {ev.is_major && (
                  <span className="text-[10px] text-gold-400 uppercase tracking-widest font-mono">
                    ★ Major Milestone
                  </span>
                )}
                <span className="text-xs text-cream-400 font-mono flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-gold-400/80" />
                  {formatDate(ev.date)}
                </span>
              </div>

              <h3 className="font-serif text-xl text-cream-50 font-normal">{ev.title}</h3>
              <p className="text-xs text-cream-300 font-sans leading-relaxed">{ev.description}</p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Button
                variant="ghost"
                size="sm"
                className="p-2 h-8 text-cream-300 hover:text-gold-300"
                onClick={() => handleOpenEdit(ev)}
              >
                <Edit2 className="w-3.5 h-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="p-2 h-8 text-rose-400 hover:bg-rose-500/10"
                onClick={() => setDeleteId(ev.id)}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingEvent ? "Edit Milestone" : "Add Timeline Event"}
        subtitle="Chronicle a significant date in our relationship history."
        size="md"
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs uppercase tracking-wider text-cream-300 mb-1.5 font-sans">
              Event Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g., The First Date in Greenwich"
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
                onChange={(e) => setCategory(e.target.value as TimelineEvent["category"])}
                className="w-full rounded-xl bg-universe-950 border border-white/[0.1] px-3.5 py-2.5 text-sm text-cream-100 focus:outline-none focus:border-gold-400"
              >
                <option value="Milestones">Milestones</option>
                <option value="Trips">Trips</option>
                <option value="Photos">Photos</option>
                <option value="Special Moments">Special Moments</option>
                <option value="Beginning">Beginning</option>
                <option value="Firsts">Firsts</option>
                <option value="Adventures">Adventures</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-cream-300 mb-1.5 font-sans">
              Location
            </label>
            <input
              type="text"
              placeholder="e.g., London, UK"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full rounded-xl bg-universe-950 border border-white/[0.1] px-4 py-2.5 text-sm text-cream-100 placeholder-cream-600 focus:outline-none focus:border-gold-400"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-cream-300 mb-1.5 font-sans">
              Story Description
            </label>
            <textarea
              rows={3}
              placeholder="The memory, the feeling, the words spoken..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-xl bg-universe-950 border border-white/[0.1] p-3 text-sm text-cream-100 placeholder-cream-600 focus:outline-none focus:border-gold-400 font-sans"
            />
          </div>

          <MediaUploader
            label="Cover Image"
            accept="image"
            folder="photos"
            currentUrl={imageUrl}
            onUploadComplete={(url) => setImageUrl(url)}
          />

          <label className="flex items-center gap-2 text-xs text-cream-200 cursor-pointer pt-2">
            <input
              type="checkbox"
              checked={isMajor}
              onChange={(e) => setIsMajor(e.target.checked)}
              className="rounded border-white/[0.2] bg-universe-950 text-gold-400 focus:ring-0"
            />
            <span>Highlight as Major Turning Point / Sacred Milestone</span>
          </label>

          <div className="flex justify-end gap-3 pt-4 border-t border-white/[0.06]">
            <Button type="button" variant="ghost" size="sm" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="gold" size="sm">
              Save Event
            </Button>
          </div>
        </form>
      </Modal>

      <DeleteConfirmModal
        isOpen={Boolean(deleteId)}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Milestone"
        itemName={events.find((e) => e.id === deleteId)?.title}
      />
    </div>
  );
}
