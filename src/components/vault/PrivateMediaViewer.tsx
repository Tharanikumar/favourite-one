"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { VaultItem } from "@/lib/supabase/types";
import { formatDate } from "@/lib/utils";
import { Shield, Lock, Sparkles } from "lucide-react";

interface PrivateMediaViewerProps {
  item: VaultItem | null;
  onClose: () => void;
}

export function PrivateMediaViewer({ item, onClose }: PrivateMediaViewerProps) {
  const [resolvedUrl, setResolvedUrl] = useState<string | null>(null);
  const [loadingMedia, setLoadingMedia] = useState(false);

  useEffect(() => {
    if (!item?.media_url) {
      setResolvedUrl(null);
      return;
    }

    // If media_url is already a public / mock url, use directly
    if (item.media_url.startsWith("http") || item.media_url.startsWith("/")) {
      setResolvedUrl(item.media_url);
      return;
    }

    // Otherwise fetch temporary signed URL from server API
    async function fetchSigned() {
      setLoadingMedia(true);
      try {
        const res = await fetch("/api/vault/media-url", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ path: item?.media_url }),
        });
        const data = await res.json();
        if (data.signedUrl) {
          setResolvedUrl(data.signedUrl);
        } else {
          setResolvedUrl(item?.media_url || null);
        }
      } catch {
        setResolvedUrl(item?.media_url || null);
      } finally {
        setLoadingMedia(false);
      }
    }

    fetchSigned();
  }, [item]);

  if (!item) return null;

  const isVideo = item.media_type === "video";
  const isPhoto = item.media_type === "photo";

  return (
    <Modal
      isOpen={Boolean(item)}
      onClose={onClose}
      title={item.title}
      subtitle={`Encrypted Sanctuary File • Recorded on ${formatDate(item.recorded_date)}`}
      size="lg"
    >
      <div
        className="space-y-6 select-none"
        onContextMenu={(e) => e.preventDefault()}
      >
        {/* Media Container */}
        <div className="relative rounded-2xl overflow-hidden bg-universe-950 border border-white/[0.08] min-h-[260px] flex items-center justify-center">
          {loadingMedia ? (
            <div className="flex flex-col items-center gap-2 p-8 text-cream-400">
              <Shield className="w-8 h-8 text-gold-400 animate-pulse" />
              <span className="text-xs font-mono">Decrypting protected stream...</span>
            </div>
          ) : isVideo ? (
            <video
              src={resolvedUrl || ""}
              controls
              autoPlay
              controlsList="nodownload"
              className="w-full max-h-[70vh] rounded-2xl object-contain bg-black"
            />
          ) : isPhoto ? (
            <div className="relative w-full aspect-[4/3] sm:aspect-[16/10]">
              <Image
                src={resolvedUrl || item.media_url || ""}
                alt={item.title}
                fill
                priority
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 800px"
              />
            </div>
          ) : (
            <div className="p-8 text-center space-y-3">
              <Sparkles className="w-10 h-10 text-gold-400 mx-auto" />
              <p className="font-serif text-lg text-cream-100 italic leading-relaxed max-w-lg mx-auto">
                &ldquo;{item.description}&rdquo;
              </p>
            </div>
          )}
        </div>

        {/* File Metadata & Description */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Badge variant="gold" size="sm" className="flex items-center gap-1.5">
              <Shield className="w-3 h-3 text-gold-400" />
              <span>{item.category}</span>
            </Badge>

            {item.duration && (
              <span className="text-xs font-mono text-cream-400">
                Duration: {item.duration}
              </span>
            )}
          </div>

          <p className="text-sm text-cream-200 font-sans leading-relaxed">
            {item.description}
          </p>
        </div>

        {/* Bottom Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-white/[0.06]">
          <div className="flex items-center gap-2 text-[11px] text-gold-400 font-mono">
            <Lock className="w-3.5 h-3.5" />
            <span>Encrypted Session Protected</span>
          </div>

          <Button variant="glass" size="sm" onClick={onClose}>
            Close Viewer
          </Button>
        </div>
      </div>
    </Modal>
  );
}
