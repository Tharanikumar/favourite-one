"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Lock, KeyRound, ShieldCheck, AlertCircle, Eye, EyeOff } from "lucide-react";

interface VaultOpeningAnimationProps {
  onUnlockSuccess: () => void;
}

export function VaultOpeningAnimation({ onUnlockSuccess }: VaultOpeningAnimationProps) {
  const [pin, setPin] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isUnlockingAnim, setIsUnlockingAnim] = useState(false);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pin || pin.trim().length < 3) {
      setErrorMsg("Please enter your secret passcode");
      return;
    }

    setIsVerifying(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/vault/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMsg(data.error || "Incorrect vault passcode");
        setIsVerifying(false);
        return;
      }

      // Trigger cinematic rotary unlock sequence
      setIsUnlockingAnim(true);
      setTimeout(() => {
        onUnlockSuccess();
      }, 1600);
    } catch {
      setErrorMsg("Verification server error");
      setIsVerifying(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-8 relative">
      {/* Background celestial iris */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[420px] h-[420px] bg-gradient-radial from-rose-400/[0.15] via-peach-400/[0.1] to-transparent rounded-full blur-3xl pointer-events-none" />

      <Card className="p-8 sm:p-10 text-center bg-white/95 border-universe-750/70 backdrop-blur-2xl shadow-2xl relative overflow-hidden">
        {/* Unlocking animation overlay */}
        <AnimatePresence>
          {isUnlockingAnim && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-30 bg-white/95 backdrop-blur-xl flex flex-col items-center justify-center p-6 space-y-6"
            >
              {/* Rotating mechanical dial */}
              <motion.div
                animate={{ rotate: [0, 360, 720] }}
                transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
                className="w-24 h-24 rounded-full border-4 border-dashed border-rose-400 flex items-center justify-center shadow-glow-rose relative"
              >
                <div className="w-16 h-16 rounded-full bg-rose-400/20 border border-rose-400/40 flex items-center justify-center text-rose-600">
                  <ShieldCheck className="w-8 h-8 animate-pulse" />
                </div>
              </motion.div>

              <div className="space-y-1">
                <h3 className="font-serif text-2xl text-cream-50 font-normal">
                  Chamber Decrypting...
                </h3>
                <p className="text-xs text-rose-600 font-mono tracking-wider font-medium">
                  Access granted &bull; Unlocking private vault
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Lock Dial Header */}
        <div className="relative mb-6">
          <motion.div
            animate={{
              rotate: [0, 5, -5, 0],
              scale: [1, 1.02, 1],
            }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="w-20 h-20 rounded-full bg-universe-900 border-2 border-rose-400/40 mx-auto flex items-center justify-center text-rose-500 shadow-glow-rose relative group"
          >
            {/* Outer Tumbler Ring */}
            <div className="absolute inset-1 rounded-full border border-universe-750 border-t-rose-400 animate-spin [animation-duration:8s]" />
            <Lock className="w-8 h-8" />
          </motion.div>
        </div>

        <div className="space-y-1.5 mb-6">
          <span className="text-[10px] uppercase tracking-[0.25em] text-rose-600 font-mono font-semibold block">
            End-To-End Encrypted Chamber
          </span>
          <h3 className="font-serif text-2xl sm:text-3xl text-cream-50 font-normal">
            Sanctuary Vault Access
          </h3>
          <p className="text-xs text-cream-300 font-sans">
            Enter your secret passcode to open confidential memos, unreleased photos, and sealed letters.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleVerify} className="space-y-4">
          <div className="space-y-2">
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                maxLength={20}
                placeholder="••••••••"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                className="w-full text-center tracking-[0.4em] font-mono text-2xl py-3 px-12 rounded-2xl bg-white border border-rose-400/40 text-rose-700 focus:outline-none focus:border-rose-500 shadow-sm"
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1"
                title={showPassword ? "Hide password" : "Show password"}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {errorMsg && (
              <p className="text-xs text-rose-600 flex items-center justify-center gap-1 font-sans font-medium">
                <AlertCircle className="w-3.5 h-3.5" />
                {errorMsg}
              </p>
            )}
          </div>

          <Button
            type="submit"
            variant="rose"
            size="lg"
            className="w-full shadow-glow-rose"
            disabled={isVerifying || isUnlockingAnim}
            icon={<KeyRound className="w-4 h-4" />}
          >
            {isVerifying ? "Verifying..." : "Unlock Vault"}
          </Button>
        </form>

        {/* Footer info */}
        <div className="mt-6 pt-4 border-t border-universe-750/50 flex items-center justify-between text-xs text-slate-500 font-sans px-1">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
            <ShieldCheck className="w-3.5 h-3.5 text-rose-500" />
            <span>Encrypted Chamber</span>
          </div>
          {pin && (
            <button
              type="button"
              onClick={() => setPin("")}
              className="text-slate-500 hover:text-rose-600 font-medium text-xs transition-colors"
            >
              Clear
            </button>
          )}
        </div>
      </Card>
    </div>
  );
}
