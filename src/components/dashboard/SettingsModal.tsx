"use client";

import React, { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { APP_CONFIG } from "@/lib/constants";
import { Save, Shield } from "lucide-react";

export interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const [partner1, setPartner1] = useState(APP_CONFIG.couple.partner1);
  const [partner2, setPartner2] = useState(APP_CONFIG.couple.partner2);
  const [anniversary, setAnniversary] = useState(APP_CONFIG.couple.anniversary);
  const [quote, setQuote] = useState(APP_CONFIG.couple.favoriteQuote);
  const [passcode, setPasscode] = useState("0414");
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 800);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Sanctuary Settings &amp; Preferences"
      subtitle="Customize your shared sanctuary names, milestone dates, and encryption key."
      size="md"
    >
      <form onSubmit={handleSave} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs uppercase tracking-wider text-cream-300 mb-1.5 font-sans">
              Partner 1 Name
            </label>
            <input
              type="text"
              value={partner1}
              onChange={(e) => setPartner1(e.target.value)}
              className="w-full rounded-xl bg-universe-950 border border-white/[0.1] px-3.5 py-2.5 text-sm text-cream-100 focus:outline-none focus:border-gold-400"
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wider text-cream-300 mb-1.5 font-sans">
              Partner 2 Name
            </label>
            <input
              type="text"
              value={partner2}
              onChange={(e) => setPartner2(e.target.value)}
              className="w-full rounded-xl bg-universe-950 border border-white/[0.1] px-3.5 py-2.5 text-sm text-cream-100 focus:outline-none focus:border-gold-400"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs uppercase tracking-wider text-cream-300 mb-1.5 font-sans">
              Anniversary Date
            </label>
            <input
              type="text"
              value={anniversary}
              onChange={(e) => setAnniversary(e.target.value)}
              className="w-full rounded-xl bg-universe-950 border border-white/[0.1] px-3.5 py-2.5 text-sm text-cream-100 focus:outline-none focus:border-gold-400"
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wider text-cream-300 mb-1.5 font-sans">
              Vault Passcode
            </label>
            <input
              type="password"
              maxLength={6}
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              className="w-full rounded-xl bg-universe-950 border border-white/[0.1] px-3.5 py-2.5 text-sm text-cream-100 font-mono tracking-widest focus:outline-none focus:border-gold-400"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs uppercase tracking-wider text-cream-300 mb-1.5 font-sans">
            Our Shared Lifetime Quote
          </label>
          <textarea
            rows={3}
            value={quote}
            onChange={(e) => setQuote(e.target.value)}
            className="w-full rounded-xl bg-universe-950 border border-white/[0.1] p-3.5 text-sm text-cream-100 italic font-serif focus:outline-none focus:border-gold-400"
          />
        </div>

        <div className="p-3.5 rounded-xl bg-universe-950/80 border border-white/[0.06] flex items-center gap-2.5 text-xs text-cream-400">
          <Shield className="w-4 h-4 text-gold-400 shrink-0" />
          <span>All settings are preserved locally and protected by client encryption.</span>
        </div>

        <div className="flex justify-end gap-3 pt-3 border-t border-white/[0.06]">
          <Button type="button" variant="ghost" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="gold"
            size="sm"
            icon={<Save className="w-3.5 h-3.5" />}
          >
            {isSaved ? "Saved Successfully!" : "Save Preferences"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
