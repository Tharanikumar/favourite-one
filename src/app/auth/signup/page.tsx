"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAuth } from "@/lib/auth/AuthContext";
import { useToast } from "@/lib/toast/ToastContext";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { APP_CONFIG } from "@/lib/constants";
import { Heart, Lock, Mail, User, ArrowRight } from "lucide-react";

export default function SignupPage() {
  const router = useRouter();
  const { signUp } = useAuth();
  const toast = useToast();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
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

    const result = await signUp(email, password, fullName);
    setLoading(false);

    if (result.error) {
      setErrorMsg(result.error);
      toast.error("Registration failed", result.error);
    } else {
      toast.success("Welcome to Our Universe", "Account created successfully.");
      router.push("/dashboard");
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-radial from-rose-400/[0.06] via-gold-400/[0.03] to-transparent rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-md w-full relative z-10"
      >
        <Card className="p-8 sm:p-10 bg-white/95 border-universe-750/70 backdrop-blur-2xl shadow-2xl">
          <div className="text-center space-y-3 mb-8">
            <div className="w-14 h-14 rounded-full bg-universe-900 border border-rose-400/30 mx-auto flex items-center justify-center text-rose-500 shadow-glow-rose">
              <Heart className="w-6 h-6" />
            </div>

            <div>
              <span className="text-[11px] uppercase tracking-[0.25em] text-rose-600 font-mono font-semibold block">
                Join Sanctuary
              </span>
              <h1 className="font-serif text-2xl sm:text-3xl text-cream-50 font-normal">
                Create Couple Profile
              </h1>
            </div>

            <p className="text-xs text-cream-300 font-sans">
              Begin preserving your memories in {APP_CONFIG.name}.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-cream-300 mb-1.5 font-sans font-medium">
                Full Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="e.g., Tharani"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full rounded-xl bg-white border border-universe-750/70 px-4 py-3 text-sm text-cream-100 placeholder-cream-400 focus:outline-none focus:border-rose-400 transition-colors pl-10 shadow-sm"
                />
                <User className="w-4 h-4 text-cream-400 absolute left-3.5 top-3.5" />
              </div>
            </div>

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
              <label className="block text-xs uppercase tracking-wider text-cream-300 mb-1.5 font-sans font-medium">
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  placeholder="At least 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl bg-white border border-universe-750/70 px-4 py-3 text-sm text-cream-100 placeholder-cream-400 focus:outline-none focus:border-rose-400 transition-colors pl-10 shadow-sm"
                />
                <Lock className="w-4 h-4 text-cream-400 absolute left-3.5 top-3.5" />
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-cream-300 mb-1.5 font-sans font-medium">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  placeholder="Re-enter password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
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
              {loading ? "Creating Profile..." : "Create Sanctuary Account"}
            </Button>
          </form>

          <div className="mt-6 text-center text-xs text-cream-300">
            Already have an account?{" "}
            <Link
              href="/auth/login"
              className="text-rose-600 hover:text-rose-700 underline underline-offset-4 font-medium"
            >
              Sign in
            </Link>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
