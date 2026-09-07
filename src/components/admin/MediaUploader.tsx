"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useToast } from "@/lib/toast/ToastContext";
import { Button } from "@/components/ui/Button";
import { Upload, X, Film, Music } from "lucide-react";

interface MediaUploaderProps {
  label?: string;
  accept?: "image" | "video" | "audio" | "all";
  folder?: "photos" | "videos";
  bucket?: "memories-vault" | "vault-media";
  currentUrl?: string;
  onUploadComplete: (url: string) => void;
}

export function MediaUploader({
  label = "Upload Media File",
  accept = "image",
  folder = "photos",
  bucket = "memories-vault",
  currentUrl,
  onUploadComplete,
}: MediaUploaderProps) {
  const toast = useToast();
  const [tab, setTab] = useState<"upload" | "url">("upload");
  const [urlInput, setUrlInput] = useState(currentUrl || "");
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [previewUrl, setPreviewUrl] = useState(currentUrl || "");

  const getAcceptedMime = () => {
    if (accept === "image") return "image/*";
    if (accept === "video") return "video/*";
    if (accept === "audio") return "audio/*";
    return "image/*,video/*,audio/*";
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Client-side file size verification
    const maxSizes = {
      image: 20 * 1024 * 1024,
      video: 100 * 1024 * 1024,
      audio: 25 * 1024 * 1024,
    };

    if (file.type.startsWith("image/") && file.size > maxSizes.image) {
      toast.error("File Too Large", "Images must be less than 20MB.");
      return;
    }
    if (file.type.startsWith("video/") && file.size > maxSizes.video) {
      toast.error("File Too Large", "Videos must be less than 100MB.");
      return;
    }
    if (file.type.startsWith("audio/") && file.size > maxSizes.audio) {
      toast.error("File Too Large", "Audio files must be less than 25MB.");
      return;
    }

    setUploading(true);
    setProgress(30);

    try {
      // Direct FormData upload to server endpoint for robust handling
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);
      formData.append("bucket", bucket);

      setProgress(60);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      setProgress(100);

      if (!res.ok || data.error) {
        toast.error("Upload Failed", data.error || "Could not upload file.");
      } else {
        setPreviewUrl(data.url);
        onUploadComplete(data.url);
        toast.success("Media Uploaded", "Saved to sanctuary storage.");
      }
    } catch {
      // Local fallback
      const localUrl = URL.createObjectURL(file);
      setPreviewUrl(localUrl);
      onUploadComplete(localUrl);
      toast.info("Media Attached", "Local preview active.");
    } finally {
      setUploading(false);
      setTimeout(() => setProgress(0), 1000);
    }
  };

  const handleUrlSubmit = () => {
    if (!urlInput.trim()) return;
    setPreviewUrl(urlInput.trim());
    onUploadComplete(urlInput.trim());
    toast.success("Media URL Attached", "External link set.");
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-xs uppercase tracking-wider text-cream-300 font-sans">
          {label}
        </label>
        <div className="flex items-center gap-1 bg-universe-950 p-0.5 rounded-lg border border-white/[0.08]">
          <button
            type="button"
            onClick={() => setTab("upload")}
            className={`text-[11px] px-2.5 py-0.5 rounded-md transition-all ${
              tab === "upload"
                ? "bg-gold-400 text-universe-950 font-semibold"
                : "text-cream-400 hover:text-white"
            }`}
          >
            Upload
          </button>
          <button
            type="button"
            onClick={() => setTab("url")}
            className={`text-[11px] px-2.5 py-0.5 rounded-md transition-all ${
              tab === "url"
                ? "bg-gold-400 text-universe-950 font-semibold"
                : "text-cream-400 hover:text-white"
            }`}
          >
            Direct URL
          </button>
        </div>
      </div>

      {tab === "upload" ? (
        <div className="relative border-2 border-dashed border-white/[0.1] hover:border-gold-400/40 rounded-2xl p-6 text-center cursor-pointer transition-colors bg-universe-950/60 group">
          <input
            type="file"
            accept={getAcceptedMime()}
            onChange={handleFileChange}
            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
            disabled={uploading}
          />
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-full bg-universe-900 border border-white/[0.08] mx-auto flex items-center justify-center text-gold-400 group-hover:scale-110 transition-transform">
              {accept === "video" ? (
                <Film className="w-5 h-5" />
              ) : accept === "audio" ? (
                <Music className="w-5 h-5" />
              ) : (
                <Upload className="w-5 h-5" />
              )}
            </div>
            <div className="text-xs text-cream-200">
              {uploading ? "Processing upload..." : "Drag & drop or click to browse"}
            </div>
            <div className="text-[10px] text-cream-500 font-mono">
              {accept === "image" && "PNG, JPG, WebP up to 20MB"}
              {accept === "video" && "MP4, WebM, MOV up to 100MB"}
              {accept === "audio" && "MP3, M4A, WAV up to 25MB"}
            </div>
          </div>

          {/* Progress bar */}
          {uploading && (
            <div className="mt-4 h-1.5 w-full bg-universe-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gold-400 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}
        </div>
      ) : (
        <div className="flex gap-2">
          <input
            type="url"
            placeholder="https://images.unsplash.com/... or media link"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            className="flex-1 rounded-xl bg-universe-950 border border-white/[0.1] px-4 py-2.5 text-xs text-cream-100 placeholder-cream-600 focus:outline-none focus:border-gold-400"
          />
          <Button type="button" variant="glass" size="sm" onClick={handleUrlSubmit}>
            Apply
          </Button>
        </div>
      )}

      {/* Media Preview Box */}
      {previewUrl && (
        <div className="relative mt-3 rounded-xl overflow-hidden border border-white/[0.1] bg-universe-950 p-2 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {accept === "video" || previewUrl.endsWith(".mp4") ? (
              <video
                src={previewUrl}
                className="w-16 h-12 object-cover rounded-lg bg-black"
                muted
              />
            ) : accept === "audio" || previewUrl.endsWith(".mp3") ? (
              <div className="w-12 h-12 rounded-lg bg-universe-800 flex items-center justify-center text-gold-400">
                <Music className="w-5 h-5" />
              </div>
            ) : (
              <div className="relative w-16 h-12 rounded-lg overflow-hidden">
                <Image src={previewUrl} alt="Preview" fill className="object-cover" />
              </div>
            )}
            <div className="text-xs text-cream-300 font-mono truncate max-w-[200px]">
              Media attached
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              setPreviewUrl("");
              setUrlInput("");
              onUploadComplete("");
            }}
            className="p-1.5 text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
            title="Remove media"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
