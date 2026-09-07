"use client";

import React from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth/AuthContext";
import { AdminSidebar, ADMIN_NAV_LINKS } from "@/components/admin/AdminSidebar";
import { PageTransition } from "@/components/layout/PageTransition";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ShieldAlert, ArrowLeft, UserCheck } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isAdmin, isLoading, switchDemoRole } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-cream-400">
        Verifying administrator credentials...
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <Card className="max-w-md w-full p-8 text-center bg-universe-900/90 border-rose-500/30 space-y-4">
          <ShieldAlert className="w-12 h-12 text-rose-400 mx-auto" />
          <h2 className="font-serif text-2xl text-cream-50">Admin Sign In Required</h2>
          <p className="text-xs text-cream-300">
            You must be logged in with administrative privileges to access the content management panel.
          </p>
          <Link href="/auth/login?redirect=/admin" className="block">
            <Button variant="gold" size="sm" className="w-full">
              Proceed to Sign In
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  // If authenticated but not admin, show barrier with demo role switch option
  if (!isAdmin) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <Card className="max-w-md w-full p-8 text-center bg-universe-900/90 border-amber-500/30 space-y-5">
          <div className="w-14 h-14 rounded-full bg-amber-500/10 border border-amber-500/30 mx-auto flex items-center justify-center text-amber-400">
            <ShieldAlert className="w-7 h-7" />
          </div>

          <div className="space-y-1.5">
            <h2 className="font-serif text-2xl text-cream-50">Restricted Admin Area</h2>
            <p className="text-xs text-cream-300">
              Your account currently has <strong className="text-gold-300">partner</strong> privileges. This area is reserved for the sanctuary curator administrator.
            </p>
          </div>

          <div className="pt-4 border-t border-white/[0.06] space-y-3">
            <Button
              variant="gold"
              size="sm"
              className="w-full"
              icon={<UserCheck className="w-4 h-4" />}
              onClick={() => {
                switchDemoRole("admin");
              }}
            >
              Switch to Admin Role (Demo Mode)
            </Button>

            <Link href="/dashboard" className="block">
              <Button variant="ghost" size="sm" className="w-full" icon={<ArrowLeft className="w-4 h-4" />}>
                Return to Sanctuary
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <PageTransition>
      <div className="flex flex-col lg:flex-row min-h-[calc(100vh-5rem)]">
        {/* Sidebar */}
        <AdminSidebar />

        {/* Mobile Header Bar for Admin */}
        <div className="lg:hidden p-4 bg-universe-900/80 border-b border-white/[0.08] flex items-center overflow-x-auto gap-2">
          {ADMIN_NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="shrink-0 px-3 py-1.5 rounded-full text-xs bg-universe-800/80 text-cream-200 border border-white/[0.06] hover:text-gold-300 flex items-center gap-1.5"
            >
              {link.icon}
              <span>{link.name}</span>
            </Link>
          ))}
        </div>

        {/* Main Admin Content View */}
        <div className="flex-1 p-4 sm:p-8 lg:p-10 max-w-7xl mx-auto w-full overflow-y-auto">
          {children}
        </div>
      </div>
    </PageTransition>
  );
}
