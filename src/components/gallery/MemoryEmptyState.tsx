import React from "react";
import { Button } from "@/components/ui/Button";
import { Camera, RefreshCw, Search } from "lucide-react";

export interface MemoryEmptyStateProps {
  searchQuery?: string;
  onClearFilters: () => void;
  onOpenUpload: () => void;
}

export function MemoryEmptyState({
  searchQuery,
  onClearFilters,
  onOpenUpload,
}: MemoryEmptyStateProps) {
  return (
    <div className="py-20 text-center max-w-md mx-auto space-y-5 p-8 rounded-3xl bg-universe-900/40 border border-white/[0.06] backdrop-blur-md">
      <div className="w-16 h-16 rounded-full bg-universe-800 border border-gold-400/20 mx-auto flex items-center justify-center text-gold-400 shadow-glow-sm">
        {searchQuery ? (
          <Search className="w-7 h-7" />
        ) : (
          <Camera className="w-7 h-7" />
        )}
      </div>

      <div className="space-y-2">
        <h3 className="font-serif text-2xl text-cream-50 font-normal">
          {searchQuery
            ? `No memories matching "${searchQuery}"`
            : "No memories in this constellation yet"}
        </h3>
        <p className="text-xs sm:text-sm text-cream-300 font-sans leading-relaxed">
          {searchQuery
            ? "Try searching by another keyword, location, or clearing category filters."
            : "Capture your first photo or video moment and preserve it in your personal vault."}
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onClearFilters}
          icon={<RefreshCw className="w-3.5 h-3.5" />}
        >
          Reset Filters
        </Button>

        <Button
          variant="gold"
          size="sm"
          onClick={onOpenUpload}
          icon={<Camera className="w-3.5 h-3.5" />}
        >
          Upload New Moment
        </Button>
      </div>
    </div>
  );
}
