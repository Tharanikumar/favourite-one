"use client";

import React from "react";
import Image from "next/image";
import { FutureItem, FutureStatus } from "@/lib/supabase/types";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { formatDate } from "@/lib/utils";
import {
  CheckCircle2,
  Circle,
  Calendar,
  MapPin,
  Sparkles,
  Compass,
  Edit2,
  Trash2,
  Check,
} from "lucide-react";
import confetti from "canvas-confetti";

interface FutureItemCardProps {
  item: FutureItem;
  onToggleComplete: (id: string) => void;
  onEdit?: (item: FutureItem) => void;
  onDelete?: (id: string) => void;
  showAdminActions?: boolean;
}

export function FutureItemCard({
  item,
  onToggleComplete,
  onEdit,
  onDelete,
  showAdminActions = true,
}: FutureItemCardProps) {
  const isDone = item.is_completed || item.status === "Completed";

  const handleToggle = () => {
    if (!isDone) {
      // Trigger golden celebration burst
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.7 },
        colors: ["#C86F82", "#FEDEC8", "#E093A2", "#C7D7CE", "#BA873C"],
      });
    }
    onToggleComplete(item.id);
  };

  const getStatusBadgeVariant = (status: FutureStatus) => {
    switch (status) {
      case "Completed":
        return "sage";
      case "In Progress":
        return "rose";
      case "Planned":
        return "mauve";
      case "Dream":
      default:
        return "peach";
    }
  };

  const getCategoryIcon = (cat: string) => {
    if (cat === "Places We Want To Visit") return <MapPin className="w-3.5 h-3.5" />;
    if (cat === "Things We Want To Do") return <Compass className="w-3.5 h-3.5" />;
    return <Sparkles className="w-3.5 h-3.5" />;
  };

  return (
    <Card
      className={`p-5 sm:p-6 border-universe-750/70 transition-all duration-300 relative overflow-hidden ${
        isDone
          ? "bg-universe-900/60 border-rose-400/30 shadow-sm"
          : "hover:border-rose-400/50 bg-white/90 shadow-glass"
      }`}
      hoverEffect={true}
    >
      <div className="flex flex-col sm:flex-row items-start justify-between gap-5">
        {/* Left Checkbox & Core Content */}
        <div className="flex items-start gap-4 flex-1">
          {/* Completion Checkbox */}
          <button
            onClick={handleToggle}
            className="mt-1 text-rose-500 hover:text-rose-600 transition-transform active:scale-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400 rounded-full p-0.5"
            title={isDone ? "Mark as in progress" : "Mark as completed"}
            aria-label={isDone ? "Mark as in progress" : "Mark as completed"}
          >
            {isDone ? (
              <CheckCircle2 className="w-6 h-6 text-rose-500 fill-rose-500/20" />
            ) : (
              <Circle className="w-6 h-6 text-cream-300 hover:text-rose-500 transition-colors" />
            )}
          </button>

          {/* Details */}
          <div className="space-y-2 flex-1">
            {/* Badges & Date */}
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="subtle" size="sm" className="flex items-center gap-1">
                {getCategoryIcon(item.category)}
                <span>{item.category}</span>
              </Badge>

              <Badge variant={getStatusBadgeVariant(item.status)} size="sm">
                {item.status}
              </Badge>

              {item.target_date && (
                <span className="text-xs text-cream-400 flex items-center gap-1 font-mono">
                  <Calendar className="w-3 h-3 text-rose-500/80" />
                  Target: {item.target_date}
                </span>
              )}

              {isDone && item.completed_date && (
                <span className="text-xs text-sage-600 flex items-center gap-1 font-mono font-medium">
                  <Check className="w-3 h-3" />
                  Fulfilled: {formatDate(item.completed_date)}
                </span>
              )}
            </div>

            {/* Title */}
            <h4
              className={`font-serif text-lg sm:text-xl font-normal transition-colors ${
                isDone
                  ? "text-cream-400 line-through decoration-rose-400/50"
                  : "text-cream-50"
              }`}
            >
              {item.title}
            </h4>

            {/* Description */}
            <p className="text-xs sm:text-sm text-cream-300 font-sans leading-relaxed">
              {item.description}
            </p>
          </div>
        </div>

        {/* Right Thumbnail & Actions */}
        <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-universe-750/40">
          {item.image_url && (
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden border border-universe-750/70 shrink-0">
              <Image
                src={item.image_url}
                alt={item.title}
                fill
                className={`object-cover transition-all duration-500 hover:scale-110 ${
                  isDone ? "filter grayscale contrast-125" : ""
                }`}
              />
            </div>
          )}

          {showAdminActions && (
            <div className="flex items-center gap-1.5 self-end">
              {onEdit && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(item)}
                  className="p-2 h-8 w-8 text-cream-400 hover:text-rose-600"
                  aria-label="Edit goal"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </Button>
              )}
              {onDelete && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(item.id)}
                  className="p-2 h-8 w-8 text-cream-400 hover:text-red-500"
                  aria-label="Delete goal"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
