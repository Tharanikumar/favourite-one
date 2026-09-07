"use client";

import React from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  MOCK_MEMORIES,
  MOCK_TIMELINE_EVENTS,
  MOCK_LETTERS,
  MOCK_LOVE_REASONS,
  MOCK_PLACES,
  MOCK_FUTURE_ITEMS,
  MOCK_VAULT_ITEMS,
} from "@/lib/mockData";
import {
  Camera,
  Film,
  Image as ImageIcon,
  Clock,
  Mail,
  Heart,
  MapPin,
  Compass,
  Lock,
  Plus,
  ArrowRight,
  Database,
  HardDrive,
  Sparkles,
} from "lucide-react";

export default function AdminOverviewPage() {
  const totalMemories = MOCK_MEMORIES.length;
  const totalPhotos = MOCK_MEMORIES.filter((m) => m.media_type === "image").length + 12; // with gallery
  const totalVideos = MOCK_MEMORIES.filter((m) => m.media_type === "video").length + 2;
  const totalTimeline = MOCK_TIMELINE_EVENTS.length;
  const totalLetters = MOCK_LETTERS.length;
  const totalLoveCards = MOCK_LOVE_REASONS.length;
  const totalPlaces = MOCK_PLACES.length;
  const totalFutureGoals = MOCK_FUTURE_ITEMS.length;
  const totalVaultItems = MOCK_VAULT_ITEMS.length;

  const metricCards = [
    {
      title: "Total Memories",
      count: totalMemories,
      subtext: "Chronicles & Moments",
      icon: <Camera className="w-5 h-5 text-gold-400" />,
      href: "/admin/memories",
      action: "Manage",
    },
    {
      title: "Total Photos",
      count: totalPhotos,
      subtext: "High-Res Snapshots",
      icon: <ImageIcon className="w-5 h-5 text-amber-400" />,
      href: "/admin/memories",
      action: "Upload",
    },
    {
      title: "Total Videos",
      count: totalVideos,
      subtext: "Motion Memories",
      icon: <Film className="w-5 h-5 text-rose-400" />,
      href: "/admin/memories",
      action: "Upload",
    },
    {
      title: "Timeline Events",
      count: totalTimeline,
      subtext: "Milestones Across Time",
      icon: <Clock className="w-5 h-5 text-gold-400" />,
      href: "/admin/timeline",
      action: "Manage",
    },
    {
      title: "Letters Archive",
      count: totalLetters,
      subtext: "Sealed & Audio Notes",
      icon: <Mail className="w-5 h-5 text-gold-400" />,
      href: "/admin/letters",
      action: "Manage",
    },
    {
      title: "Love Cards",
      count: totalLoveCards,
      subtext: "Reasons I Adore You",
      icon: <Heart className="w-5 h-5 text-rose-400" />,
      href: "/admin/love-cards",
      action: "Manage",
    },
    {
      title: "Special Places",
      count: totalPlaces,
      subtext: "Coordinates of Our Love",
      icon: <MapPin className="w-5 h-5 text-rose-400" />,
      href: "/admin/places",
      action: "Manage",
    },
    {
      title: "Future Goals",
      count: totalFutureGoals,
      subtext: "Bucket List & Dreams",
      icon: <Compass className="w-5 h-5 text-gold-400" />,
      href: "/admin/future",
      action: "Manage",
    },
    {
      title: "Secret Vault Content",
      count: totalVaultItems,
      subtext: "Encrypted Files & Memos",
      icon: <Lock className="w-5 h-5 text-cream-200" />,
      href: "/admin/vault",
      action: "Manage",
    },
  ];

  return (
    <div className="space-y-10">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="gold" size="sm">
              Admin CMS
            </Badge>
            <span className="text-xs text-cream-400 font-mono">Sanctuary Curator</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl text-cream-50 font-normal">
            Content Management Hub
          </h1>
          <p className="text-xs sm:text-sm text-cream-300 font-sans mt-1">
            Create, modify, upload, and curate all records in our shared little universe.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/admin/memories">
            <Button variant="gold" size="sm" icon={<Plus className="w-4 h-4" />}>
              Add Memory
            </Button>
          </Link>
          <Link href="/admin/future">
            <Button variant="glass" size="sm" icon={<Sparkles className="w-4 h-4 text-gold-400" />}>
              New Goal
            </Button>
          </Link>
        </div>
      </div>

      {/* 9 Core Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {metricCards.map((card) => (
          <Link key={card.title} href={card.href} className="group block">
            <Card
              className="p-6 h-full flex flex-col justify-between border-white/[0.08] hover:border-gold-400/40 transition-all bg-universe-900/70"
              hoverEffect={true}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="p-3 rounded-2xl bg-universe-800 border border-white/[0.06] group-hover:scale-105 transition-transform">
                    {card.icon}
                  </div>
                  <span className="text-[11px] text-gold-400 font-mono flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    {card.action} <ArrowRight className="w-3 h-3" />
                  </span>
                </div>

                <div>
                  <span className="font-serif text-3xl sm:text-4xl text-cream-50 font-normal block">
                    {card.count}
                  </span>
                  <h3 className="font-serif text-lg text-cream-100 font-normal mt-1">
                    {card.title}
                  </h3>
                  <p className="text-xs text-cream-400 font-sans">{card.subtext}</p>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      {/* System Status & Storage Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
        <Card className="p-6 bg-universe-900/80 border-white/[0.08] space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-gold-400" />
              <h3 className="font-serif text-lg text-cream-50 font-normal">
                Database &amp; RLS Status
              </h3>
            </div>
            <Badge variant="gold" size="sm">
              Operational
            </Badge>
          </div>

          <div className="space-y-2.5 text-xs text-cream-300 font-mono">
            <div className="flex justify-between pb-2 border-b border-white/[0.04]">
              <span>Row Level Security:</span>
              <span className="text-emerald-400">Enforced on all 10 tables</span>
            </div>
            <div className="flex justify-between pb-2 border-b border-white/[0.04]">
              <span>Secret Vault Hashing:</span>
              <span className="text-emerald-400">SHA-256 + Unique Salt</span>
            </div>
            <div className="flex justify-between">
              <span>Client Exposure:</span>
              <span className="text-emerald-400">Protected (Service keys hidden)</span>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-universe-900/80 border-white/[0.08] space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <HardDrive className="w-4 h-4 text-gold-400" />
              <h3 className="font-serif text-lg text-cream-50 font-normal">
                Storage Buckets
              </h3>
            </div>
            <Badge variant="subtle" size="sm">
              2 Buckets Active
            </Badge>
          </div>

          <div className="space-y-2.5 text-xs text-cream-300 font-mono">
            <div className="flex justify-between pb-2 border-b border-white/[0.04]">
              <span>memories-vault (Public read):</span>
              <span className="text-cream-200">Shared Moments &amp; Gallery</span>
            </div>
            <div className="flex justify-between pb-2 border-b border-white/[0.04]">
              <span>vault-media (Private):</span>
              <span className="text-gold-300">Signed URLs Only (Strict)</span>
            </div>
            <div className="flex justify-between">
              <span>Max Upload Size:</span>
              <span className="text-cream-200">20MB (Img) / 100MB (Vid)</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
