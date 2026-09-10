"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { AddEditFutureItemModal } from "@/components/future/AddEditFutureItemModal";
import { DeleteConfirmModal } from "@/components/admin/DeleteConfirmModal";
import { MOCK_FUTURE_ITEMS } from "@/lib/mockData";
import { FutureItem, FutureCategory, FutureStatus } from "@/lib/types";
import { useToast } from "@/lib/toast/ToastContext";
import { Plus, Edit2, Trash2, Calendar } from "lucide-react";

export default function AdminFuturePage() {
  const toast = useToast();
  const [items, setItems] = useState<FutureItem[]>(MOCK_FUTURE_ITEMS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<FutureItem | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleSaveItem = (data: Partial<FutureItem>) => {
    if (data.id) {
      setItems((prev) =>
        prev.map((i) => (i.id === data.id ? ({ ...i, ...data } as FutureItem) : i))
      );
      toast.success("Goal Updated", `"${data.title}" saved.`);
    } else {
      const newItem: FutureItem = {
        id: "ft-" + Date.now().toString(36),
        title: data.title || "Untitled Aspiration",
        description: data.description || "",
        category: (data.category as FutureCategory) || "Places We Want To Visit",
        status: (data.status as FutureStatus) || "Dream",
        target_date: data.target_date,
        image_url: data.image_url,
        is_completed: data.status === "Completed",
        completed_date: data.completed_date,
        created_at: new Date().toISOString(),
      };
      setItems([newItem, ...items]);
      toast.success("Goal Created", `"${newItem.title}" added to constellation.`);
    }
    setIsModalOpen(false);
  };

  const handleDelete = () => {
    if (!deleteId) return;
    setItems((prev) => prev.filter((i) => i.id !== deleteId));
    toast.info("Goal Deleted", "Removed from future roadmap.");
    setDeleteId(null);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="gold" size="sm">
              Roadmap CMS
            </Badge>
            <span className="text-xs text-cream-400 font-mono">Future Together</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl text-cream-50 font-normal">
            Manage Aspirations &amp; Bucket List
          </h1>
          <p className="text-xs text-cream-300 font-sans mt-0.5">
            Create, update, and manage future dreams across the three core categories.
          </p>
        </div>

        <Button
          variant="gold"
          size="sm"
          icon={<Plus className="w-4 h-4" />}
          onClick={() => {
            setEditingItem(null);
            setIsModalOpen(true);
          }}
        >
          Add Future Goal
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <Card
            key={item.id}
            className="p-5 flex flex-col justify-between border-white/[0.08] bg-universe-900/70"
          >
            <div className="space-y-3">
              {item.image_url && (
                <div className="relative aspect-[16/10] rounded-xl overflow-hidden border border-white/[0.08]">
                  <Image src={item.image_url} alt={item.title} fill className="object-cover" />
                </div>
              )}

              <div className="flex items-center justify-between">
                <Badge variant="subtle" size="sm">
                  {item.category}
                </Badge>
                <Badge
                  variant={
                    item.status === "Completed"
                      ? "gold"
                      : item.status === "In Progress"
                      ? "rose"
                      : "default"
                  }
                  size="sm"
                >
                  {item.status}
                </Badge>
              </div>

              <div>
                <h3 className="font-serif text-lg text-cream-50 line-clamp-1">{item.title}</h3>
                {item.target_date && (
                  <span className="text-[11px] text-cream-400 font-mono flex items-center gap-1 mt-0.5">
                    <Calendar className="w-3 h-3 text-gold-400/80" />
                    Target: {item.target_date}
                  </span>
                )}
              </div>

              <p className="text-xs text-cream-300 font-sans line-clamp-2 leading-relaxed">
                {item.description}
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-4 mt-4 border-t border-white/[0.06]">
              <Button
                variant="ghost"
                size="sm"
                className="p-2 h-8 text-cream-300 hover:text-gold-300"
                onClick={() => {
                  setEditingItem(item);
                  setIsModalOpen(true);
                }}
              >
                <Edit2 className="w-3.5 h-3.5 mr-1" /> Edit
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="p-2 h-8 text-rose-400 hover:bg-rose-500/10"
                onClick={() => setDeleteId(item.id)}
              >
                <Trash2 className="w-3.5 h-3.5 mr-1" /> Delete
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <AddEditFutureItemModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveItem}
        initialItem={editingItem}
      />

      <DeleteConfirmModal
        isOpen={Boolean(deleteId)}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Future Goal"
        itemName={items.find((i) => i.id === deleteId)?.title}
      />
    </div>
  );
}
