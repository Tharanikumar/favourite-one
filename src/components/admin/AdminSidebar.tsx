"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Camera,
  Clock,
  Mail,
  Heart,
  MapPin,
  Compass,
  Lock,
  ArrowLeft,
  ShieldCheck,
} from "lucide-react";

export const ADMIN_NAV_LINKS = [
  {
    name: "Overview",
    href: "/admin",
    icon: <LayoutDashboard className="w-4 h-4" />,
  },
  {
    name: "Memories & Media",
    href: "/admin/memories",
    icon: <Camera className="w-4 h-4" />,
  },
  {
    name: "Story Timeline",
    href: "/admin/timeline",
    icon: <Clock className="w-4 h-4" />,
  },
  {
    name: "Letters Archive",
    href: "/admin/letters",
    icon: <Mail className="w-4 h-4" />,
  },
  {
    name: "Love Cards",
    href: "/admin/love-cards",
    icon: <Heart className="w-4 h-4" />,
  },
  {
    name: "Special Places",
    href: "/admin/places",
    icon: <MapPin className="w-4 h-4" />,
  },
  {
    name: "Future Together",
    href: "/admin/future",
    icon: <Compass className="w-4 h-4" />,
  },
  {
    name: "Secret Vault",
    href: "/admin/vault",
    icon: <Lock className="w-4 h-4" />,
  },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 shrink-0 hidden lg:flex flex-col justify-between p-6 bg-universe-900/90 border-r border-white/[0.08] backdrop-blur-2xl min-h-[calc(100vh-5rem)]">
      <div className="space-y-6">
        {/* Admin Header */}
        <div className="flex items-center gap-3 pb-4 border-b border-white/[0.06]">
          <div className="p-2.5 rounded-xl bg-gold-400/10 border border-gold-400/30 text-gold-400 shadow-glow-sm">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="font-serif text-base text-cream-50 font-normal block">
              Curator CMS
            </span>
            <span className="text-[10px] uppercase tracking-widest text-gold-400 font-mono">
              Admin Control
            </span>
          </div>
        </div>

        {/* Nav Links */}
        <nav className="space-y-1.5">
          {ADMIN_NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-sans tracking-wide transition-all",
                  isActive
                    ? "bg-gold-500 text-universe-950 font-semibold shadow-glow-sm"
                    : "text-cream-300 hover:text-white hover:bg-white/[0.05]"
                )}
              >
                {link.icon}
                <span>{link.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Return to Sanctuary Link */}
      <div className="pt-6 border-t border-white/[0.06]">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-cream-400 hover:text-gold-300 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Exit to Sanctuary</span>
        </Link>
      </div>
    </aside>
  );
}
