"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { MediaUploader } from "@/components/admin/MediaUploader";
import { DeleteConfirmModal } from "@/components/admin/DeleteConfirmModal";
import { MOCK_LOVE_REASONS } from "@/lib/mockData";
import { LoveReason, LoveReasonCategory } from "@/lib/types";
import { useToast } from "@/lib/toast/ToastContext";
import { Plus, Edit2, Trash2, Heart } from "lucide-react";

export default function AdminLoveCardsPage() {
  const toast = useToast();
  const [reasons, setReasons] = useState<LoveReason[]>(MOCK_LOVE_REASONS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingReason, setEditingReason] = useState<LoveReason | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Form states
  const [number, setNumber] = useState<number>(reasons.length + 1);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [category, setCategory] = useState<LoveReasonCategory>("The Little Things");
  const [author, setAuthor] = useState("Tharani");
  const [photoUrl, setPhotoUrl] = useState("");
  const [photoCaption, setPhotoCaption] = useState("");
  const [isFavorite, setIsFavorite] = useState(false);

  const handleOpenAdd = () => {
    setEditingReason(null);
    setNumber(reasons.length + 1);
    setTitle("");
    setMessage("");
    setCategory("The Little Things");
    setAuthor("Tharani");
    setPhotoUrl("");
    setPhotoCaption("");
    setIsFavorite(false);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (r: LoveReason) => {
    setEditingReason(r);
    setNumber(r.number);
    setTitle(r.title);
    setMessage(r.message || r.description);
    setCategory(r.category);
    setAuthor(r.author);
    setPhotoUrl(r.photo_url || "");
    setPhotoCaption(r.photo_caption || "");
    setIsFavorite(r.is_favorite || false);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) return;

    if (editingReason) {
      setReasons((prev) =>
        prev.map((r) =>
          r.id === editingReason.id
            ? {
                ...r,
                number,
                title,
                message,
                description: message,
                category,
                author,
                photo_url: photoUrl || undefined,
                photo_caption: photoCaption || undefined,
                is_favorite: isFavorite,
                updated_at: new Date().toISOString(),
              }
            : r
        )
      );
      toast.success("Love Card Updated", `Reason #${number} saved.`);
    } else {
      const newReason: LoveReason = {
        id: "lr-" + Date.now().toString(36),
        number,
        title,
        message,
        description: message,
        category,
        author,
        photo_url: photoUrl || undefined,
        photo_caption: photoCaption || undefined,
        is_favorite: isFavorite,
        created_at: new Date().toISOString(),
      };
      setReasons([newReason, ...reasons]);
      toast.success("Reason Added", `Reason #${number} recorded.`);
    }

    setIsModalOpen(false);
  };

  const handleDelete = () => {
    if (!deleteId) return;
    setReasons((prev) => prev.filter((r) => r.id !== deleteId));
    toast.info("Love Card Deleted", "Removed from deck.");
    setDeleteId(null);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="rose" size="sm">
              Devotion CMS
            </Badge>
            <span className="text-xs text-cream-400 font-mono">Things I Love About You</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl text-cream-50 font-normal">
            Manage Love Cards
          </h1>
          <p className="text-xs text-cream-300 font-sans mt-0.5">
            Add reasons, habits, virtues, and endearing quirks to the deck.
          </p>
        </div>

        <Button variant="gold" size="sm" icon={<Plus className="w-4 h-4" />} onClick={handleOpenAdd}>
          Add Reason
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reasons.map((r) => (
          <Card key={r.id} className="p-5 flex flex-col justify-between border-white/[0.08] bg-universe-900/70">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-gold-400 font-semibold">
                  Reason #{r.number}
                </span>
                <Badge variant="rose" size="sm">
                  {r.category}
                </Badge>
              </div>

              <div>
                <h3 className="font-serif text-lg text-cream-50 line-clamp-1">{r.title}</h3>
                <span className="text-[11px] text-cream-400">By {r.author}</span>
              </div>

              <p className="text-xs text-cream-300 font-serif line-clamp-3 leading-relaxed italic">
                &ldquo;{r.message || r.description}&rdquo;
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-4 mt-4 border-t border-white/[0.06]">
              <Button
                variant="ghost"
                size="sm"
                className="p-2 h-8 text-cream-300 hover:text-gold-300"
                onClick={() => handleOpenEdit(r)}
              >
                <Edit2 className="w-3.5 h-3.5 mr-1" /> Edit
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="p-2 h-8 text-rose-400 hover:bg-rose-500/10"
                onClick={() => setDeleteId(r.id)}
              >
                <Trash2 className="w-3.5 h-3.5 mr-1" /> Delete
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingReason ? `Edit Reason #${number}` : "Add New Reason I Love You"}
        subtitle="Record another nuance of affection to cherish forever."
        size="md"
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-cream-300 mb-1.5 font-sans">
                Card Number
              </label>
              <input
                type="number"
                required
                value={number}
                onChange={(e) => setNumber(parseInt(e.target.value) || 1)}
                className="w-full rounded-xl bg-universe-950 border border-white/[0.1] px-3.5 py-2.5 text-sm text-cream-100 focus:outline-none focus:border-gold-400 font-mono"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-xs uppercase tracking-wider text-cream-300 mb-1.5 font-sans">
                Reason Headline *
              </label>
              <input
                type="text"
                required
                placeholder="e.g., How your voice calms any day"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-xl bg-universe-950 border border-white/[0.1] px-4 py-2.5 text-sm text-cream-100 placeholder-cream-600 focus:outline-none focus:border-gold-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-cream-300 mb-1.5 font-sans">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as LoveReasonCategory)}
                className="w-full rounded-xl bg-universe-950 border border-white/[0.1] px-3.5 py-2.5 text-sm text-cream-100 focus:outline-none focus:border-gold-400"
              >
                <option value="The Little Things">The Little Things</option>
                <option value="Soul & Depth">Soul &amp; Depth</option>
                <option value="Everyday Magic">Everyday Magic</option>
                <option value="Conversations">Conversations</option>
                <option value="Quirks">Quirks</option>
                <option value="Heart">Heart</option>
                <option value="Memories">Memories</option>
              </select>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-cream-300 mb-1.5 font-sans">
                Author
              </label>
              <input
                type="text"
                required
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="w-full rounded-xl bg-universe-950 border border-white/[0.1] px-3.5 py-2.5 text-sm text-cream-100 focus:outline-none focus:border-gold-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-cream-300 mb-1.5 font-sans">
              Full Personal Message / Reflection *
            </label>
            <textarea
              rows={4}
              required
              placeholder="Why this makes your heart beat faster..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full rounded-xl bg-universe-950 border border-white/[0.1] p-3 text-sm text-cream-100 placeholder-cream-600 focus:outline-none focus:border-gold-400 font-serif leading-relaxed"
            />
          </div>

          <MediaUploader
            label="Accompanying Snapshot"
            accept="image"
            currentUrl={photoUrl}
            onUploadComplete={(url) => setPhotoUrl(url)}
          />

          <label className="flex items-center gap-2 text-xs text-cream-200 cursor-pointer pt-1">
            <input
              type="checkbox"
              checked={isFavorite}
              onChange={(e) => setIsFavorite(e.target.checked)}
              className="rounded border-white/[0.2] bg-universe-950 text-rose-400 focus:ring-0"
            />
            <span>Highlight as Favorite Reason</span>
          </label>

          <div className="flex justify-end gap-3 pt-4 border-t border-white/[0.06]">
            <Button type="button" variant="ghost" size="sm" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="gold" size="sm" icon={<Heart className="w-3.5 h-3.5" />}>
              Save Reason
            </Button>
          </div>
        </form>
      </Modal>

      <DeleteConfirmModal
        isOpen={Boolean(deleteId)}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Reason"
        itemName={reasons.find((r) => r.id === deleteId)?.title}
      />
    </div>
  );
}
