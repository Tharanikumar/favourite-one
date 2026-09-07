"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Section } from "@/components/ui/Section";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { PageTransition } from "@/components/layout/PageTransition";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { MobileBottomNav } from "@/components/dashboard/MobileBottomNav";
import { VaultOpeningAnimation } from "@/components/vault/VaultOpeningAnimation";
import { PrivateMediaViewer } from "@/components/vault/PrivateMediaViewer";
import { PrivateLetterModal } from "@/components/vault/PrivateLetterModal";
import { VaultPinModal } from "@/components/vault/VaultPinModal";
import { useAuth } from "@/lib/auth/AuthContext";
import { useToast } from "@/lib/toast/ToastContext";
import { MOCK_VAULT_ITEMS } from "@/lib/mockData";
import { VaultItem } from "@/lib/supabase/types";
import { supabase, isSupabaseConfigured } from "@/lib/supabase/client";
import {
  saveVaultSession,
  isVaultSessionActive,
  clearVaultSession,
  touchVaultSession,
} from "@/lib/supabase/vault";
import { formatDate } from "@/lib/utils";
import {
  Lock,
  Mic,
  Video,
  FileText,
  Play,
  Pause,
  KeyRound,
  ShieldCheck,
  Camera,
  Mail,
  Clock,
} from "lucide-react";

export default function VaultPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const toast = useToast();

  const [isUnlocked, setIsUnlocked] = useState(false);
  const [vaultItems, setVaultItems] = useState<VaultItem[]>(MOCK_VAULT_ITEMS);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedMediaItem, setSelectedMediaItem] = useState<VaultItem | null>(null);
  const [selectedLetterItem, setSelectedLetterItem] = useState<VaultItem | null>(null);
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);
  const [timeRemainingSeconds, setTimeRemainingSeconds] = useState<number>(300);

  // Redirect unauthenticated users
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/auth/login?redirect=/vault");
    }
  }, [authLoading, isAuthenticated, router]);

  // Check existing session
  useEffect(() => {
    if (isVaultSessionActive()) {
      setIsUnlocked(true);
    }
  }, []);

  // Fetch Supabase vault items when unlocked
  useEffect(() => {
    async function loadVault() {
      if (isUnlocked && isSupabaseConfigured && supabase) {
        try {
          const { data, error } = await supabase
            .from("vault_items")
            .select("*")
            .order("recorded_date", { ascending: false });

          if (!error && data && data.length > 0) {
            setVaultItems(data as VaultItem[]);
          }
        } catch (e) {
          console.warn("Could not fetch vault_items:", e);
        }
      }
    }

    loadVault();
  }, [isUnlocked]);

  // Inactivity Auto-Lock Timer
  useEffect(() => {
    if (!isUnlocked) return;

    const interval = setInterval(() => {
      if (!isVaultSessionActive()) {
        setIsUnlocked(false);
        toast.info("Vault Auto-Locked", "Vault automatically locked due to inactivity.");
      } else {
        setTimeRemainingSeconds((prev) => (prev > 1 ? prev - 1 : 0));
      }
    }, 1000);

    const handleUserActivity = () => {
      touchVaultSession();
      setTimeRemainingSeconds(300);
    };

    window.addEventListener("mousemove", handleUserActivity);
    window.addEventListener("keydown", handleUserActivity);
    window.addEventListener("touchstart", handleUserActivity);

    return () => {
      clearInterval(interval);
      window.removeEventListener("mousemove", handleUserActivity);
      window.removeEventListener("keydown", handleUserActivity);
      window.removeEventListener("touchstart", handleUserActivity);
    };
  }, [isUnlocked, toast]);

  const handleUnlockSuccess = () => {
    saveVaultSession();
    setIsUnlocked(true);
    setTimeRemainingSeconds(300);
    toast.success("Sanctuary Vault Decrypted", "Access granted to private archives.");
  };

  const handleLockVault = () => {
    clearVaultSession();
    setIsUnlocked(false);
    setPlayingAudioId(null);
    toast.info("Vault Locked", "Chamber encrypted and secured.");
  };

  const togglePlayAudio = (id: string) => {
    setPlayingAudioId(playingAudioId === id ? null : id);
  };

  const categories = [
    "All",
    "Private Letters",
    "Private Photos",
    "Private Videos",
    "Voice Messages",
    "Future Messages",
  ];

  const filteredItems = useMemo(() => {
    return vaultItems.filter((item) => {
      if (selectedCategory === "All") return true;
      return item.category === selectedCategory;
    });
  }, [vaultItems, selectedCategory]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-cream-400">
        Authenticating sanctuary credentials...
      </div>
    );
  }

  return (
    <PageTransition>
      <DashboardHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-28 space-y-10">
        <Section
          eyebrow="Confidential Archive"
          title="The Secret Sanctuary Vault"
          subtitle="An encrypted chamber for private voice memos, sacred promises, candid videos, and future time-capsules meant only for our eyes and ears."
          centered={true}
        >
          <AnimatePresence mode="wait">
            {!isUnlocked ? (
              /* PASSCODE ROTARY LOCK GATE */
              <motion.div
                key="vault-gate"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.4 }}
              >
                <VaultOpeningAnimation onUnlockSuccess={handleUnlockSuccess} />
              </motion.div>
            ) : (
              /* UNLOCKED VAULT SANCTUARY */
              <motion.div
                key="vault-content"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="space-y-8 max-w-5xl mx-auto"
              >
                {/* Active Session Status & Security Controls */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl bg-white/95 border border-rose-400/40 backdrop-blur-xl shadow-glass">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-rose-500/15 text-rose-600 border border-rose-400/30">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold uppercase tracking-wider text-rose-700">
                          Vault Decrypted &amp; Secure
                        </span>
                        <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-ping" />
                      </div>
                      <span className="text-[11px] text-cream-400 font-mono">
                        Auto-locks in {Math.floor(timeRemainingSeconds / 60)}:
                        {(timeRemainingSeconds % 60).toString().padStart(2, "0")} (activity resets timer)
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsPinModalOpen(true)}
                      icon={<KeyRound className="w-3.5 h-3.5" />}
                      className="text-xs text-cream-300 hover:text-rose-600"
                    >
                      Change PIN
                    </Button>

                    <Button
                      variant="rose"
                      size="sm"
                      onClick={handleLockVault}
                      icon={<Lock className="w-3.5 h-3.5" />}
                    >
                      Lock Vault Now
                    </Button>
                  </div>
                </div>

                {/* Category Pills */}
                <div className="flex flex-wrap items-center justify-center gap-2">
                  {categories.map((cat) => {
                    const count =
                      cat === "All"
                        ? vaultItems.length
                        : vaultItems.filter((i) => i.category === cat).length;

                    return (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-4 py-2 rounded-full text-xs font-sans tracking-wide transition-all duration-300 flex items-center gap-2 ${
                          selectedCategory === cat
                            ? "bg-gradient-to-r from-rose-500 to-rose-400 text-white font-semibold shadow-glow-rose"
                            : "bg-white/80 text-cream-300 hover:text-cream-50 border border-universe-750/70"
                        }`}
                      >
                        <span>{cat}</span>
                        <span
                          className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                            selectedCategory === cat
                              ? "bg-white/25 text-white"
                              : "bg-universe-900 text-cream-400"
                          }`}
                        >
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Vault Items Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredItems.map((item) => (
                    <Card
                      key={item.id}
                      className="p-6 flex flex-col justify-between border-universe-750/70 hover:border-rose-400/50 bg-white/90 relative group"
                      hoverEffect={true}
                    >
                      <div className="space-y-4">
                        {/* Type Icon & Badge */}
                        <div className="flex items-center justify-between">
                          <span className="p-2.5 rounded-xl bg-universe-900 border border-universe-750 text-rose-500 group-hover:scale-105 transition-transform">
                            {item.media_type === "audio" && <Mic className="w-5 h-5 text-rose-500" />}
                            {item.media_type === "video" && <Video className="w-5 h-5 text-rose-500" />}
                            {item.media_type === "photo" && <Camera className="w-5 h-5 text-rose-500" />}
                            {item.media_type === "letter" && <Mail className="w-5 h-5 text-rose-500" />}
                            {item.media_type === "future_message" && <Clock className="w-5 h-5 text-rose-500" />}
                            {item.media_type === "note" && <FileText className="w-5 h-5 text-rose-500" />}
                          </span>

                          <Badge variant="rose" size="sm">
                            {item.category}
                          </Badge>
                        </div>

                        {/* Title & Date */}
                        <div className="space-y-1">
                          <h4 className="font-serif text-xl text-cream-50 font-normal group-hover:text-rose-600 transition-colors">
                            {item.title}
                          </h4>
                          <span className="text-[11px] text-cream-400 font-mono block">
                            Recorded: {formatDate(item.recorded_date)}
                          </span>
                        </div>

                        {/* Description Preview */}
                        <p className="text-xs sm:text-sm text-cream-300 font-sans leading-relaxed line-clamp-3">
                          {item.description}
                        </p>

                        {/* Photo/Video Thumbnail Preview if present */}
                        {item.media_type === "photo" && item.media_url && (
                          <div className="relative aspect-[16/9] rounded-xl overflow-hidden border border-universe-750/60 filter brightness-95 group-hover:brightness-100 transition-all">
                            <Image
                              src={item.media_url}
                              alt={item.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                        )}
                      </div>

                      {/* Interactive Controls */}
                      <div className="pt-4 mt-6 border-t border-universe-750/50">
                        {item.media_type === "audio" ? (
                          <div className="space-y-3">
                            <button
                              onClick={() => togglePlayAudio(item.id)}
                              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-700 border border-rose-400/35 text-xs font-semibold transition-all"
                            >
                              {playingAudioId === item.id ? (
                                <>
                                  <Pause className="w-3.5 h-3.5" /> Playing Memo ({item.duration || "0:42"})
                                </>
                              ) : (
                                <>
                                  <Play className="w-3.5 h-3.5" /> Listen Memo ({item.duration || "Play"})
                                </>
                              )}
                            </button>

                            {/* Sound wave visualizer */}
                            {playingAudioId === item.id && (
                              <div className="flex items-center justify-center gap-1 h-5 pt-1">
                                {[0.3, 0.8, 0.5, 1, 0.6, 0.9, 0.4, 0.7, 0.5, 0.8].map((h, i) => (
                                  <motion.div
                                    key={i}
                                    animate={{ height: ["4px", `${h * 18}px`, "4px"] }}
                                    transition={{
                                      repeat: Infinity,
                                      duration: 0.7,
                                      delay: i * 0.08,
                                    }}
                                    className="w-1 bg-gradient-to-t from-rose-500 to-rose-400 rounded-full"
                                  />
                                ))}
                              </div>
                            )}
                          </div>
                        ) : item.media_type === "letter" || item.media_type === "future_message" ? (
                          <Button
                            variant="glass"
                            size="sm"
                            className="w-full"
                            icon={<Mail className="w-3.5 h-3.5 text-rose-500" />}
                            onClick={() => setSelectedLetterItem(item)}
                          >
                            Read Sealed Letter
                          </Button>
                        ) : (
                          <Button
                            variant="glass"
                            size="sm"
                            className="w-full"
                            icon={<ShieldCheck className="w-3.5 h-3.5 text-rose-500" />}
                            onClick={() => setSelectedMediaItem(item)}
                          >
                            View Protected Item
                          </Button>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </Section>
      </main>

      <MobileBottomNav />

      {/* Modals */}
      <PrivateMediaViewer
        item={selectedMediaItem}
        onClose={() => setSelectedMediaItem(null)}
      />

      <PrivateLetterModal
        item={selectedLetterItem}
        onClose={() => setSelectedLetterItem(null)}
      />

      <VaultPinModal
        isOpen={isPinModalOpen}
        onClose={() => setIsPinModalOpen(false)}
      />
    </PageTransition>
  );
}
