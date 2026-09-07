"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { useAuth, DEMO_PROFILES } from "@/lib/auth/AuthContext";
import { useToast } from "@/lib/toast/ToastContext";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { APP_CONFIG } from "@/lib/constants";
import { Lock, Mail, Sparkles, ArrowRight, ShieldCheck } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get("redirect") || "/dashboard";

  const { signIn } = useAuth();
  const toast = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    const result = await signIn(email, password);
    setLoading(false);

    if (result.error) {
      setErrorMsg(result.error);
      toast.error("Sign in failed", result.error);
    } else {
      toast.success("Welcome back", "Sanctuary gates unlocked.");
      router.push(redirectPath);
    }
  };

  const handleQuickDemo = async (roleKey: "tharani" | "surya" | "admin" | "alex" | "maya") => {
    const profile = DEMO_PROFILES[roleKey];
    setEmail(profile.email);
    setPassword("universe2024");
    setLoading(true);

    const result = await signIn(profile.email, "universe2024");
    setLoading(false);

    if (result.error) {
      setErrorMsg(result.error);
    } else {
      toast.success(`Welcome, ${profile.name}`, `Entered as ${profile.role}`);
      router.push(redirectPath);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 relative">
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-radial from-gold-400/[0.06] via-rose-400/[0.03] to-transparent rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-md w-full relative z-10"
      >
        <Card className="p-8 sm:p-10 bg-white/95 border-universe-750/70 backdrop-blur-2xl shadow-2xl">
          {/* Header Monogram */}
          <div className="text-center space-y-3 mb-8">
            <div className="w-14 h-14 rounded-full bg-universe-900 border border-rose-400/30 mx-auto flex items-center justify-center text-rose-500 shadow-glow-rose">
              <Sparkles className="w-6 h-6" />
            </div>

            <div>
              <span className="text-[11px] uppercase tracking-[0.25em] text-rose-600 font-mono font-semibold block">
                Private Sanctuary
              </span>
              <h1 className="font-serif text-2xl sm:text-3xl text-cream-50 font-normal">
                Enter {APP_CONFIG.name}
              </h1>
            </div>

            <p className="text-xs text-cream-300 font-sans">
              Authenticate to unlock confidential memories &amp; private notes.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-cream-300 mb-1.5 font-sans font-medium">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="yourname@domain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl bg-white border border-universe-750/70 px-4 py-3 text-sm text-cream-100 placeholder-cream-400 focus:outline-none focus:border-rose-400 transition-colors pl-10 shadow-sm"
                />
                <Mail className="w-4 h-4 text-cream-400 absolute left-3.5 top-3.5" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs uppercase tracking-wider text-cream-300 font-sans font-medium">
                  Password
                </label>
                <Link
                  href="/auth/forgot-password"
                  className="text-xs text-rose-600 hover:text-rose-700 transition-colors"
                >
                  Forgot passcode?
                </Link>
              </div>
              <div className="relative">
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl bg-white border border-universe-750/70 px-4 py-3 text-sm text-cream-100 placeholder-cream-400 focus:outline-none focus:border-rose-400 transition-colors pl-10 shadow-sm"
                />
                <Lock className="w-4 h-4 text-cream-400 absolute left-3.5 top-3.5" />
              </div>
            </div>

            {errorMsg && (
              <p className="text-xs text-rose-700 bg-rose-500/15 p-2.5 rounded-lg border border-rose-500/30">
                {errorMsg}
              </p>
            )}

            <Button
              type="submit"
              variant="rose"
              size="lg"
              className="w-full mt-2"
              disabled={loading}
              icon={<ArrowRight className="w-4 h-4" />}
            >
              {loading ? "Decrypting..." : "Enter Sanctuary"}
            </Button>
          </form>

          {/* Quick Demo Access Pills */}
          <div className="mt-8 pt-6 border-t border-universe-750/50 space-y-3">
            <div className="flex items-center justify-between text-xs font-mono text-cream-300">
              <span className="flex items-center gap-1.5 font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-rose-500" />
                Quick Demo Access
              </span>
              <span className="text-[10px] text-rose-600 font-semibold">Instant Login</span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemo("tharani")}
                className="p-2 rounded-xl bg-universe-900 border border-universe-750/70 hover:border-rose-400 text-center transition-all group"
              >
                <span className="text-xs text-cream-100 group-hover:text-rose-600 font-serif font-medium block">
                  Tharani
                </span>
                <span className="text-[10px] text-cream-400 block">Partner</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemo("surya")}
                className="p-2 rounded-xl bg-universe-900 border border-universe-750/70 hover:border-rose-400 text-center transition-all group"
              >
                <span className="text-xs text-cream-100 group-hover:text-rose-600 font-serif font-medium block">
                  Surya
                </span>
                <span className="text-[10px] text-cream-400 block">Partner</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemo("admin")}
                className="p-2 rounded-xl bg-universe-900 border border-universe-750/70 hover:border-rose-400 text-center transition-all group"
              >
                <span className="text-xs text-cream-100 group-hover:text-rose-600 font-serif font-semibold block">
                  Admin
                </span>
                <span className="text-[10px] text-rose-600 block font-medium">Curator</span>
              </button>
            </div>
          </div>

          {/* Registration link */}
          <div className="mt-6 text-center text-xs text-cream-300">
            Don&apos;t have an account?{" "}
            <Link
              href="/auth/signup"
              className="text-rose-600 hover:text-rose-700 underline underline-offset-4 font-medium"
            >
              Create couple profile
            </Link>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-cream-400">Loading portal...</div>}>
      <LoginForm />
    </Suspense>
  );
}
