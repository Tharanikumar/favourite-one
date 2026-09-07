"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { MediaUploader } from "@/components/admin/MediaUploader";
import { DeleteConfirmModal } from "@/components/admin/DeleteConfirmModal";
import { VaultPinModal } from "@/components/vault/VaultPinModal";
import { MOCK_VAULT_ITEMS } from "@/lib/mockData";
import { VaultItem, VaultCategory, VaultMediaType } from "@/lib/supabase/types";
import { formatDate } from "@/lib/utils";
import { useToast } from "@/lib/toast/ToastContext";
import {
  Plus,
  Edit2,
  Trash2,
  Lock,
  KeyRound,
  Mic,
  Video,
  Camera,
  Mail,
  Clock,
  FileText,
} from "lucide-react";

export default function AdminVaultPage() {
  const toast = useToast();
  const [items, setItems] = useState<VaultItem[]>(MOCK_VAULT_ITEMS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<VaultItem | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Form states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<VaultCategory>("Voice Messages");
  const [mediaType, setMediaType] = useState<VaultMediaType>("audio");
  const [mediaUrl, setMediaUrl] = useState("");
  const [duration, setDuration] = useState("");
  const [recordedDate, setRecordedDate] = useState("");
  const [unlockDate, setUnlockDate] = useState("");

  const handleOpenAdd = () => {
    setEditingItem(null);
    setTitle("");
    setDescription("");
    setCategory("Voice Messages");
    setMediaType("audio");
    setMediaUrl("");
    setDuration("2:30");
    setRecordedDate(new Date().toISOString().split("T")[0]);
    setUnlockDate("");
    setIsModalOpen(true);
  };

  const handleOpenEdit = (it: VaultItem) => {
    setEditingItem(it);
    setTitle(it.title);
    setDescription(it.description);
    setCategory(it.category);
    setMediaType(it.media_type);
    setMediaUrl(it.media_url || "");
    setDuration(it.duration || "");
    setRecordedDate(it.recorded_date);
    setUnlockDate(it.unlock_date || "");
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (editingItem) {
      setItems((prev) =>
        prev.map((it) =>
          it.id === editingItem.id
            ? {
                ...it,
                title,
                description,
                category,
                media_type: mediaType,
                media_url: mediaUrl || undefined,
                duration: duration || undefined,
                recorded_date: recordedDate,
                unlock_date: unlockDate || undefined,
                updated_at: new Date().toISOString(),
              }
            : it
        )
      );
      toast.success("Vault Record Updated", title);
    } else {
      const newItem: VaultItem = {
        id: "vt-" + Date.now().toString(36),
        title,
        description,
        category,
        media_type: mediaType,
        media_url: mediaUrl || undefined,
        duration: duration || undefined,
        recorded_date: recordedDate,
        unlock_date: unlockDate || undefined,
        is_locked: true,
        created_at: new Date().toISOString(),
      };
      setItems([newItem, ...items]);
      toast.success("Encrypted in Vault", title);
    }

    setIsModalOpen(false);
  };

  const handleDelete = () => {
    if (!deleteId) return;
    setItems((prev) => prev.filter((it) => it.id !== deleteId));
    toast.info("Vault File Removed", "Deleted from encrypted storage.");
    setDeleteId(null);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="gold" size="sm">
              Vault CMS
            </Badge>
            <span className="text-xs text-cream-400 font-mono">Confidential Storage</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl text-cream-50 font-normal">
            Manage Secret Sanctuary Vault
          </h1>
          <p className="text-xs text-cream-300 font-sans mt-0.5">
            Curate protected recordings, confidential photos, future time-capsules, and manage vault PIN.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            icon={<KeyRound className="w-4 h-4 text-gold-400" />}
            onClick={() => setIsPinModalOpen(true)}
          >
            Vault Passcode
          </Button>
          <Button variant="gold" size="sm" icon={<Plus className="w-4 h-4" />} onClick={handleOpenAdd}>
            Add Vault Item
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((it) => (
          <Card key={it.id} className="p-5 flex flex-col justify-between border-white/[0.08] bg-universe-900/70">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="p-2 rounded-xl bg-universe-800 border border-white/[0.06] text-gold-400">
                  {it.media_type === "audio" && <Mic className="w-4 h-4" />}
                  {it.media_type === "video" && <Video className="w-4 h-4 text-rose-400" />}
                  {it.media_type === "photo" && <Camera className="w-4 h-4 text-amber-400" />}
                  {it.media_type === "letter" && <Mail className="w-4 h-4 text-cream-200" />}
                  {it.media_type === "future_message" && <Clock className="w-4 h-4 text-gold-300" />}
                  {it.media_type === "note" && <FileText className="w-4 h-4 text-cream-200" />}
                </span>

                <Badge variant="gold" size="sm">
                  {it.category}
                </Badge>
              </div>

              <div>
                <h3 className="font-serif text-lg text-cream-50 line-clamp-1">{it.title}</h3>
                <span className="text-[11px] text-cream-400 font-mono mt-0.5 block">
                  Recorded: {formatDate(it.recorded_date)} {it.duration ? `• ${it.duration}` : ""}
                </span>
                {it.unlock_date && (
                  <span className="text-[11px] text-rose-300 font-mono block">
                    Locked until: {formatDate(it.unlock_date)}
                  </span>
                )}
              </div>

              <p className="text-xs text-cream-300 font-sans line-clamp-2 leading-relaxed">
                {it.description}
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-4 mt-4 border-t border-white/[0.06]">
              <Button
                variant="ghost"
                size="sm"
                className="p-2 h-8 text-cream-300 hover:text-gold-300"
                onClick={() => handleOpenEdit(it)}
              >
                <Edit2 className="w-3.5 h-3.5 mr-1" /> Edit
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="p-2 h-8 text-rose-400 hover:bg-rose-500/10"
                onClick={() => setDeleteId(it.id)}
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
        title={editingItem ? "Edit Vault Item" : "Add Protected Vault File"}
        subtitle="Secure an encrypted recording, video, or private letter."
        size="md"
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs uppercase tracking-wider text-cream-300 mb-1.5 font-sans">
              Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g., Midnight Recording in Kyoto"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-xl bg-universe-950 border border-white/[0.1] px-4 py-2.5 text-sm text-cream-100 placeholder-cream-600 focus:outline-none focus:border-gold-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-cream-300 mb-1.5 font-sans">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as VaultCategory)}
                className="w-full rounded-xl bg-universe-950 border border-white/[0.1] px-3.5 py-2.5 text-sm text-cream-100 focus:outline-none focus:border-gold-400"
              >
                <option value="Voice Messages">Voice Messages</option>
                <option value="Private Photos">Private Photos</option>
                <option value="Private Videos">Private Videos</option>
                <option value="Private Letters">Private Letters</option>
                <option value="Future Messages">Future Messages</option>
                <option value="General">General</option>
              </select>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-cream-300 mb-1.5 font-sans">
                Media Format
              </label>
              <select
                value={mediaType}
                onChange={(e) => setMediaType(e.target.value as VaultMediaType)}
                className="w-full rounded-xl bg-universe-950 border border-white/[0.1] px-3.5 py-2.5 text-sm text-cream-100 focus:outline-none focus:border-gold-400"
              >
                <option value="audio">Audio Voice Note</option>
                <option value="photo">Photo / Picture</option>
                <option value="video">Video Recording</option>
                <option value="letter">Sealed Letter</option>
                <option value="future_message">Future Time-Lock</option>
                <option value="note">Confidential Note</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-cream-300 mb-1.5 font-sans">
                Recorded Date
              </label>
              <input
                type="date"
                required
                value={recordedDate}
                onChange={(e) => setRecordedDate(e.target.value)}
                className="w-full rounded-xl bg-universe-950 border border-white/[0.1] px-3.5 py-2.5 text-sm text-cream-100 focus:outline-none focus:border-gold-400"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-cream-300 mb-1.5 font-sans">
                Duration (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g., 3:42"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full rounded-xl bg-universe-950 border border-white/[0.1] px-3.5 py-2.5 text-sm text-cream-100 focus:outline-none focus:border-gold-400 font-mono"
              />
            </div>
          </div>

          {mediaType === "future_message" && (
            <div>
              <label className="block text-xs uppercase tracking-wider text-cream-300 mb-1.5 font-sans">
                Unlock Scheduled Date (Time-Lock)
              </label>
              <input
                type="date"
                value={unlockDate}
                onChange={(e) => setUnlockDate(e.target.value)}
                className="w-full rounded-xl bg-universe-950 border border-white/[0.1] px-3.5 py-2.5 text-sm text-cream-100 focus:outline-none focus:border-gold-400"
              />
            </div>
          )}

          <div>
            <label className="block text-xs uppercase tracking-wider text-cream-300 mb-1.5 font-sans">
              Encrypted Note / Description
            </label>
            <textarea
              rows={3}
              placeholder="Confidential context, vows, or transcript..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-xl bg-universe-950 border border-white/[0.1] p-3 text-sm text-cream-100 placeholder-cream-600 focus:outline-none focus:border-gold-400 font-sans"
            />
          </div>

          <MediaUploader
            label="Protected File Attachment (Private Bucket)"
            accept={mediaType === "video" ? "video" : mediaType === "photo" ? "image" : "audio"}
            bucket="vault-media"
            currentUrl={mediaUrl}
            onUploadComplete={(url) => setMediaUrl(url)}
          />

          <div className="flex justify-end gap-3 pt-4 border-t border-white/[0.06]">
            <Button type="button" variant="ghost" size="sm" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="gold" size="sm" icon={<Lock className="w-3.5 h-3.5" />}>
              Save to Vault
            </Button>
          </div>
        </form>
      </Modal>

      <VaultPinModal
        isOpen={isPinModalOpen}
        onClose={() => setIsPinModalOpen(false)}
      />

      <DeleteConfirmModal
        isOpen={Boolean(deleteId)}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Vault Item"
        itemName={items.find((it) => it.id === deleteId)?.title}
      />
    </div>
  );
}
