"use client";

import React, { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/lib/toast/ToastContext";
import { saveCustomVaultPin } from "@/lib/vault";
import { ShieldCheck } from "lucide-react";

interface VaultPinModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function VaultPinModal({ isOpen, onClose }: VaultPinModalProps) {
  const toast = useToast();
  const [newPin, setNewPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPin !== confirmPin) {
      setErrorMsg("Passcodes do not match");
      return;
    }
    if (newPin.length < 4) {
      setErrorMsg("Passcode must be at least 4 digits");
      return;
    }

    setLoading(true);
    setErrorMsg("");

    try {
      const success = await saveCustomVaultPin(newPin);
      if (success) {
        toast.success("Passcode Updated", "Your vault key has been securely re-encrypted.");
        onClose();
      } else {
        setErrorMsg("Failed to update passcode");
      }
    } catch {
      setErrorMsg("Error updating passcode");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Configure Vault Passcode"
      subtitle="Change the secret 4-digit key required to unlock confidential records."
      size="sm"
    >
      <form onSubmit={handleUpdate} className="space-y-4">
        <div>
          <label className="block text-xs uppercase tracking-wider text-cream-300 mb-1.5 font-sans">
            New 4-Digit Passcode
          </label>
          <input
            type="password"
            maxLength={6}
            placeholder="••••"
            value={newPin}
            onChange={(e) => setNewPin(e.target.value)}
            className="w-full text-center tracking-[0.5em] font-mono text-xl py-2.5 rounded-xl bg-universe-950 border border-white/[0.1] text-gold-300 focus:outline-none focus:border-gold-400"
            autoFocus
          />
        </div>

        <div>
          <label className="block text-xs uppercase tracking-wider text-cream-300 mb-1.5 font-sans">
            Confirm Passcode
          </label>
          <input
            type="password"
            maxLength={6}
            placeholder="••••"
            value={confirmPin}
            onChange={(e) => setConfirmPin(e.target.value)}
            className="w-full text-center tracking-[0.5em] font-mono text-xl py-2.5 rounded-xl bg-universe-950 border border-white/[0.1] text-gold-300 focus:outline-none focus:border-gold-400"
          />
        </div>

        {errorMsg && (
          <p className="text-xs text-rose-400 bg-rose-500/10 p-2 rounded-lg border border-rose-500/20 text-center">
            {errorMsg}
          </p>
        )}

        <div className="flex justify-end gap-3 pt-3 border-t border-white/[0.06]">
          <Button type="button" variant="ghost" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="gold"
            size="sm"
            disabled={loading}
            icon={<ShieldCheck className="w-4 h-4" />}
          >
            {loading ? "Re-encrypting..." : "Update Vault Key"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
