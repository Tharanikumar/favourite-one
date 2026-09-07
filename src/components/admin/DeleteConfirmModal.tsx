"use client";

import React from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Trash2, AlertTriangle } from "lucide-react";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  itemName?: string;
}

export function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Deletion",
  itemName = "this item",
}: DeleteConfirmModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      subtitle="This action cannot be undone."
      size="sm"
    >
      <div className="space-y-5 text-center pt-2">
        <div className="w-12 h-12 rounded-full bg-rose-500/10 border border-rose-500/25 mx-auto flex items-center justify-center text-rose-400">
          <AlertTriangle className="w-6 h-6" />
        </div>

        <p className="text-xs sm:text-sm text-cream-200 font-sans">
          Are you sure you want to delete <strong className="text-rose-300 font-medium">&ldquo;{itemName}&rdquo;</strong> from our universe archives?
        </p>

        <div className="flex justify-end gap-3 pt-3 border-t border-white/[0.06]">
          <Button variant="ghost" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="rose"
            size="sm"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            icon={<Trash2 className="w-3.5 h-3.5" />}
          >
            Permanently Delete
          </Button>
        </div>
      </div>
    </Modal>
  );
}
