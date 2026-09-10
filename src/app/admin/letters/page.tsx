"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { DeleteConfirmModal } from "@/components/admin/DeleteConfirmModal";
import { MOCK_LETTERS } from "@/lib/mockData";
import { Letter, LetterCategory } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { useToast } from "@/lib/toast/ToastContext";
import { Plus, Edit2, Trash2, Feather, Lock } from "lucide-react";

export default function AdminLettersPage() {
  const toast = useToast();
  const [letters, setLetters] = useState<Letter[]>(MOCK_LETTERS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLetter, setEditingLetter] = useState<Letter | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Form states
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState("Tharani");
  const [recipient, setRecipient] = useState("Surya");
  const [date, setDate] = useState("");
  const [category, setCategory] = useState<LetterCategory>("Just Because");
  const [isSealed, setIsSealed] = useState(false);
  const [sealColor, setSealColor] = useState<"gold" | "rose" | "charcoal">("gold");
  const [openDate, setOpenDate] = useState("");

  const handleOpenAdd = () => {
    setEditingLetter(null);
    setTitle("");
    setContent("");
    setAuthor("Tharani");
    setRecipient("Surya");
    setDate(new Date().toISOString().split("T")[0]);
    setCategory("Just Because");
    setIsSealed(false);
    setSealColor("gold");
    setOpenDate("");
    setIsModalOpen(true);
  };

  const handleOpenEdit = (l: Letter) => {
    setEditingLetter(l);
    setTitle(l.title);
    setContent(l.content);
    setAuthor(l.author);
    setRecipient(l.recipient);
    setDate(l.date);
    setCategory(l.category || "Just Because");
    setIsSealed(l.is_sealed);
    setSealColor(l.seal_color || "gold");
    setOpenDate(l.open_date || "");
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    if (editingLetter) {
      setLetters((prev) =>
        prev.map((l) =>
          l.id === editingLetter.id
            ? {
                ...l,
                title,
                content,
                author,
                recipient,
                date,
                category,
                is_sealed: isSealed,
                seal_color: sealColor,
                open_date: openDate || undefined,
                updated_at: new Date().toISOString(),
              }
            : l
        )
      );
      toast.success("Letter Updated", title);
    } else {
      const newLetter: Letter = {
        id: "let-" + Date.now().toString(36),
        title,
        content,
        author,
        recipient,
        date,
        category,
        is_sealed: isSealed,
        seal_color: sealColor,
        open_date: openDate || undefined,
        created_at: new Date().toISOString(),
      };
      setLetters([newLetter, ...letters]);
      toast.success("Letter Penned & Preserved", title);
    }

    setIsModalOpen(false);
  };

  const handleDelete = () => {
    if (!deleteId) return;
    setLetters((prev) => prev.filter((l) => l.id !== deleteId));
    toast.info("Letter Deleted", "Removed from archives.");
    setDeleteId(null);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="gold" size="sm">
              Letters CMS
            </Badge>
            <span className="text-xs text-cream-400 font-mono">Correspondence</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl text-cream-50 font-normal">
            Manage Preserved Letters
          </h1>
          <p className="text-xs text-cream-300 font-sans mt-0.5">
            Pen love notes, configure wax seals, and schedule time-locked letters.
          </p>
        </div>

        <Button variant="gold" size="sm" icon={<Plus className="w-4 h-4" />} onClick={handleOpenAdd}>
          Compose Letter
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {letters.map((l) => (
          <Card key={l.id} className="p-6 flex flex-col justify-between border-white/[0.08] bg-universe-900/70">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Badge variant="gold" size="sm">
                  {l.category || "Letter"}
                </Badge>
                {l.is_sealed && (
                  <Badge variant="rose" size="sm" className="flex items-center gap-1">
                    <Lock className="w-3 h-3" /> Wax Sealed
                  </Badge>
                )}
              </div>

              <div>
                <h3 className="font-serif text-xl text-cream-50 font-normal line-clamp-1">{l.title}</h3>
                <div className="text-[11px] text-cream-400 font-mono mt-0.5">
                  From <span className="text-gold-300">{l.author}</span> to <span className="text-gold-300">{l.recipient}</span> &bull; {formatDate(l.date)}
                </div>
              </div>

              <p className="text-xs sm:text-sm text-cream-300 font-serif line-clamp-3 leading-relaxed italic">
                &ldquo;{l.content}&rdquo;
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-4 mt-4 border-t border-white/[0.06]">
              <Button
                variant="ghost"
                size="sm"
                className="p-2 h-8 text-cream-300 hover:text-gold-300"
                onClick={() => handleOpenEdit(l)}
              >
                <Edit2 className="w-3.5 h-3.5 mr-1" /> Edit
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="p-2 h-8 text-rose-400 hover:bg-rose-500/10"
                onClick={() => setDeleteId(l.id)}
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
        title={editingLetter ? "Edit Love Letter" : "Compose Love Letter"}
        subtitle="Pen intimate thoughts and digital wax seals."
        size="md"
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs uppercase tracking-wider text-cream-300 mb-1.5 font-sans">
              Letter Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g., A note for your birthday morning"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-xl bg-universe-950 border border-white/[0.1] px-4 py-2.5 text-sm text-cream-100 placeholder-cream-600 focus:outline-none focus:border-gold-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
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

            <div>
              <label className="block text-xs uppercase tracking-wider text-cream-300 mb-1.5 font-sans">
                Recipient
              </label>
              <input
                type="text"
                required
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                className="w-full rounded-xl bg-universe-950 border border-white/[0.1] px-3.5 py-2.5 text-sm text-cream-100 focus:outline-none focus:border-gold-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-cream-300 mb-1.5 font-sans">
                Date Written
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
                onChange={(e) => setCategory(e.target.value as LetterCategory)}
                className="w-full rounded-xl bg-universe-950 border border-white/[0.1] px-3.5 py-2.5 text-sm text-cream-100 focus:outline-none focus:border-gold-400"
              >
                <option value="Just Because">Just Because</option>
                <option value="Open when you miss me">Open when you miss me</option>
                <option value="Open when you're sad">Open when you&apos;re sad</option>
                <option value="Open when you're angry">Open when you&apos;re angry</option>
                <option value="Open when you need motivation">Open when you need motivation</option>
                <option value="Anniversary letter">Anniversary letter</option>
                <option value="Birthday letter">Birthday letter</option>
                <option value="Future letter">Future letter</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-cream-300 mb-1.5 font-sans">
              Letter Content *
            </label>
            <textarea
              rows={6}
              required
              placeholder="Write with an open heart..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full rounded-xl bg-universe-950 border border-white/[0.1] p-3.5 text-sm text-cream-100 placeholder-cream-600 focus:outline-none focus:border-gold-400 font-serif leading-relaxed"
            />
          </div>

          {/* Sealed & Wax options */}
          <div className="flex items-center gap-6 pt-2">
            <label className="flex items-center gap-2 text-xs text-cream-200 cursor-pointer">
              <input
                type="checkbox"
                checked={isSealed}
                onChange={(e) => setIsSealed(e.target.checked)}
                className="rounded border-white/[0.2] bg-universe-950 text-gold-400 focus:ring-0"
              />
              <span>Apply Digital Wax Seal (Requires Breaking Seal)</span>
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-white/[0.06]">
            <Button type="button" variant="ghost" size="sm" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="gold" size="sm" icon={<Feather className="w-3.5 h-3.5" />}>
              Save Letter
            </Button>
          </div>
        </form>
      </Modal>

      <DeleteConfirmModal
        isOpen={Boolean(deleteId)}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Letter"
        itemName={letters.find((l) => l.id === deleteId)?.title}
      />
    </div>
  );
}
