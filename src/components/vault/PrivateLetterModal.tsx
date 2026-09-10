"use client";

import React, { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { VaultItem } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { Clock, Feather } from "lucide-react";

interface PrivateLetterModalProps {
  item: VaultItem | null;
  onClose: () => void;
}

export function PrivateLetterModal({ item, onClose }: PrivateLetterModalProps) {
  const [isSealBroken, setIsSealBroken] = useState(false);

  if (!item) return null;

  const isFutureMessage = item.media_type === "future_message";
  const isTimeLocked =
    isFutureMessage && item.unlock_date && new Date(item.unlock_date) > new Date();

  return (
    <Modal
      isOpen={Boolean(item)}
      onClose={onClose}
      title={item.title}
      subtitle={`Confidential Correspondence • ${formatDate(item.recorded_date)}`}
      size="md"
    >
      <div className="space-y-6">
        {isTimeLocked ? (
          /* Time Locked Capsule Warning */
          <div className="p-8 rounded-2xl bg-universe-950 border border-gold-400/30 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-gold-400/10 border border-gold-400/30 mx-auto flex items-center justify-center text-gold-400 shadow-glow-gold">
              <Clock className="w-6 h-6 animate-pulse" />
            </div>

            <div className="space-y-1">
              <Badge variant="gold" size="sm">
                Time-Locked Capsule
              </Badge>
              <h3 className="font-serif text-xl text-cream-50 font-normal">
                Scheduled for Future Unlocking
              </h3>
              <p className="text-xs text-cream-300 font-sans max-w-sm mx-auto leading-relaxed">
                This letter is sealed in digital stasis until{" "}
                <strong className="text-gold-300 font-mono">
                  {formatDate(item.unlock_date!)}
                </strong>
                .
              </p>
            </div>

            <div className="pt-3 border-t border-white/[0.06] text-[11px] text-cream-500 font-mono">
              Preserved in vault stasis
            </div>
          </div>
        ) : !isSealBroken ? (
          /* Wax Seal Gate */
          <div className="p-8 rounded-2xl bg-universe-950 border border-gold-400/25 text-center space-y-5">
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-gold-500 to-rose-400 mx-auto flex items-center justify-center text-universe-950 font-serif font-bold text-lg shadow-glow-gold">
              <span>&hearts;</span>
            </div>

            <div className="space-y-1.5">
              <span className="text-[11px] uppercase tracking-widest text-gold-400 font-mono">
                Private Wax Seal Intact
              </span>
              <h3 className="font-serif text-xl text-cream-50 font-normal">
                {item.title}
              </h3>
              <p className="text-xs text-cream-300 font-sans">
                Break the digital seal to read this confidential letter.
              </p>
            </div>

            <Button
              variant="gold"
              size="md"
              onClick={() => setIsSealBroken(true)}
              icon={<Feather className="w-4 h-4" />}
            >
              Break Seal &amp; Read
            </Button>
          </div>
        ) : (
          /* Letter Content */
          <div className="space-y-5">
            <div className="p-8 rounded-2xl bg-gradient-to-b from-universe-950 to-universe-900 border border-gold-400/30 space-y-4 shadow-glass">
              <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
                <span className="font-serif text-xs uppercase tracking-widest text-gold-400">
                  Private Sanctuary Letter
                </span>
                <span className="text-xs font-mono text-cream-400">
                  {formatDate(item.recorded_date)}
                </span>
              </div>

              <div className="font-serif text-cream-100 text-base sm:text-lg leading-relaxed whitespace-pre-wrap italic">
                &ldquo;{item.description}&rdquo;
              </div>

              <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between text-xs text-cream-400 font-serif">
                <span>Forever &amp; Always,</span>
                <span className="text-gold-300 font-medium">With all my love</span>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end pt-3 border-t border-white/[0.06]">
          <Button variant="glass" size="sm" onClick={onClose}>
            Close Letter
          </Button>
        </div>
      </div>
    </Modal>
  );
}
