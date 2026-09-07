"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase, isSupabaseConfigured } from "@/lib/supabase/client";
import { useToast } from "@/lib/toast/ToastContext";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { APP_CONFIG } from "@/lib/constants";
import { Lock, ShieldCheck, ArrowRight } from "lucide-react";

export default function ResetPasswordPage() {
  const router = useRouter();
  const toast = useToast();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match");
      return;
    }
    if (password.length < 6) {
      setErrorMsg("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    setErrorMsg("");

    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) {
        setErrorMsg(error.message);
        toast.error("Password update failed", error.message);
        setLoading(false);
        return;
      }
    }

    setLoading(false);
    toast.success("Password Updated", "Your new credentials are now active.");
    router.push("/auth/login");
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 relative">
      <div className="max-w-md w-full relative z-10">
        <Card className="p-8 sm:p-10 bg-universe-900/90 border-gold-400/20 backdrop-blur-2xl shadow-2xl">
          <div className="text-center space-y-3 mb-8">
            <div className="w-14 h-14 rounded-full bg-universe-800 border border-gold-400/30 mx-auto flex items-center justify-center text-gold-400 shadow-glow-gold">
              <ShieldCheck className="w-6 h-6" />
            </div>

            <div>
              <span className="text-[11px] uppercase tracking-[0.25em] text-gold-400 font-mono block">
                Security Key
              </span>
              <h1 className="font-serif text-2xl sm:text-3xl text-cream-50 font-normal">
                Set New Password
              </h1>
            </div>

            <p className="text-xs text-cream-300 font-sans">
              Enter your new secure password for {APP_CONFIG.name}.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-cream-300 mb-1.5 font-sans">
                New Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  placeholder="At least 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl bg-universe-950 border border-white/[0.1] px-4 py-3 text-sm text-cream-100 placeholder-cream-600 focus:outline-none focus:border-gold-400 transition-colors pl-10"
                />
                <Lock className="w-4 h-4 text-cream-500 absolute left-3.5 top-3.5" />
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-cream-300 mb-1.5 font-sans">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  placeholder="Re-enter password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full rounded-xl bg-universe-950 border border-white/[0.1] px-4 py-3 text-sm text-cream-100 placeholder-cream-600 focus:outline-none focus:border-gold-400 transition-colors pl-10"
                />
                <Lock className="w-4 h-4 text-cream-500 absolute left-3.5 top-3.5" />
              </div>
            </div>

            {errorMsg && (
              <p className="text-xs text-rose-400 bg-rose-500/10 p-2.5 rounded-lg border border-rose-500/20">
                {errorMsg}
              </p>
            )}

            <Button
              type="submit"
              variant="gold"
              size="lg"
              className="w-full mt-2"
              disabled={loading}
              icon={<ArrowRight className="w-4 h-4" />}
            >
              {loading ? "Updating Security Key..." : "Update Password"}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
