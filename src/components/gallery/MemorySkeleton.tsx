import React from "react";

export function MemorySkeleton() {
  return (
    <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-5">
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className="mb-5 break-inside-avoid rounded-2xl overflow-hidden bg-universe-900/60 border border-white/[0.05] p-3 space-y-3 animate-pulse"
        >
          <div
            className={`w-full rounded-xl bg-universe-800 ${
              i % 2 === 0 ? "aspect-[4/3]" : "aspect-[3/4]"
            }`}
          />
          <div className="space-y-2 px-1">
            <div className="h-4 w-3/4 rounded bg-universe-800" />
            <div className="h-3 w-1/2 rounded bg-universe-800/60" />
          </div>
        </div>
      ))}
    </div>
  );
}
