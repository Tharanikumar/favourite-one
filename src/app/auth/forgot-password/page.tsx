"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useToast } from "@/lib/toast/ToastContext";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { KeyRound, Mail, ArrowLeft, CheckCircle2 } from "lucide-react";

export default function ForgotPasswordPage() {
  const toast = useToast();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      toast.success("Recovery Email Sent", "Check your inbox for password reset instructions.");
    }, 400);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 relative">
      <div className="max-w-md w-full relative z-10">
        <Card className="p-8 sm:p-10 bg-universe-900/90 border-gold-400/20 backdrop-blur-2xl shadow-2xl">
          <div className="text-center space-y-3 mb-8">
            <div className="w-14 h-14 rounded-full bg-universe-800 border border-gold-400/30 mx-auto flex items-center justify-center text-gold-400 shadow-glow-gold">
              <KeyRound className="w-6 h-6" />
            </div>

            <div>
              <span className="text-[11px] uppercase tracking-[0.25em] text-gold-400 font-mono block">
                Security Recovery
              </span>
              <h1 className="font-serif text-2xl sm:text-3xl text-cream-50 font-normal">
                Reset Password
              </h1>
            </div>

            <p className="text-xs text-cream-300 font-sans">
              Enter your email address to receive a secure recovery link.
            </p>
          </div>

          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-cream-300 mb-1.5 font-sans">
                  Account Email
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    placeholder="alex@universe.love"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl bg-universe-950 border border-white/[0.1] px-4 py-3 text-sm text-cream-100 placeholder-cream-600 focus:outline-none focus:border-gold-400 transition-colors pl-10"
                  />
                  <Mail className="w-4 h-4 text-cream-500 absolute left-3.5 top-3.5" />
                </div>
              </div>

              <Button
                type="submit"
                variant="gold"
                size="lg"
                className="w-full mt-2"
                disabled={loading}
              >
                {loading ? "Sending Recovery..." : "Send Reset Link"}
              </Button>
            </form>
          ) : (
            <div className="text-center space-y-4 py-4">
              <CheckCircle2 className="w-10 h-10 text-gold-400 mx-auto" />
              <p className="text-sm text-cream-100">
                A password reset link has been dispatched to <strong className="text-gold-300">{email}</strong>.
              </p>
              <p className="text-xs text-cream-400">
                Please check your inbox or spam folder.
              </p>
            </div>
          )}

          <div className="mt-8 pt-4 border-t border-white/[0.06] text-center">
            <Link
              href="/auth/login"
              className="inline-flex items-center gap-1.5 text-xs text-cream-400 hover:text-gold-300 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to Login
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
