"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ToastProps {
  id: string;
  type: "success" | "error" | "info" | "warning";
  title: string;
  message?: string;
}

export function ToastContainer({
  toasts,
  onDismiss,
}: {
  toasts: ToastProps[];
  onDismiss: (id: string) => void;
}) {
  return (
    <div
      aria-live="polite"
      className="fixed bottom-20 md:bottom-8 right-4 sm:right-6 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none"
    >
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            layout
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
            className={cn(
              "pointer-events-auto p-4 rounded-2xl border backdrop-blur-2xl shadow-2xl flex items-start gap-3 relative overflow-hidden",
              toast.type === "success" &&
                "bg-universe-900/95 border-gold-400/30 text-cream-50 shadow-glow-sm",
              toast.type === "error" &&
                "bg-universe-900/95 border-rose-500/40 text-cream-50 shadow-glow-rose",
              toast.type === "warning" &&
                "bg-universe-900/95 border-amber-500/40 text-cream-50",
              toast.type === "info" &&
                "bg-universe-900/95 border-white/[0.12] text-cream-50"
            )}
          >
            {/* Ambient accent background flare */}
            <div
              className={cn(
                "absolute top-0 left-0 bottom-0 w-1",
                toast.type === "success" && "bg-gradient-to-b from-gold-400 to-gold-600",
                toast.type === "error" && "bg-gradient-to-b from-rose-400 to-rose-600",
                toast.type === "warning" && "bg-gradient-to-b from-amber-400 to-amber-600",
                toast.type === "info" && "bg-gradient-to-b from-cream-300 to-cream-500"
              )}
            />

            {/* Icon */}
            <div className="pt-0.5 shrink-0">
              {toast.type === "success" && (
                <CheckCircle2 className="w-5 h-5 text-gold-400" />
              )}
              {toast.type === "error" && (
                <AlertCircle className="w-5 h-5 text-rose-400" />
              )}
              {toast.type === "warning" && (
                <AlertTriangle className="w-5 h-5 text-amber-400" />
              )}
              {toast.type === "info" && (
                <Info className="w-5 h-5 text-cream-300" />
              )}
            </div>

            {/* Content */}
            <div className="flex-1 space-y-0.5 min-w-0 pr-2">
              <h4 className="text-xs sm:text-sm font-medium tracking-wide text-cream-50 line-clamp-1 font-serif">
                {toast.title}
              </h4>
              {toast.message && (
                <p className="text-[11px] sm:text-xs text-cream-300 font-sans leading-relaxed line-clamp-2">
                  {toast.message}
                </p>
              )}
            </div>

            {/* Close Button */}
            <button
              onClick={() => onDismiss(toast.id)}
              className="text-cream-400 hover:text-white p-1 rounded-lg hover:bg-white/[0.06] transition-colors"
              aria-label="Dismiss notification"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
