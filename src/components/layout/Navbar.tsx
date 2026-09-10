"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { NAV_ITEMS, APP_CONFIG } from "@/lib/constants";
import { useAuth } from "@/lib/auth/AuthContext";
import { useToast } from "@/lib/toast/ToastContext";
import { cn } from "@/lib/utils";
import {
  Menu,
  X,
  Sparkles,
  Clock,
  Mail,
  Camera,
  MapPin,
  Compass,
  Lock,
  Heart,
  ShieldCheck,
  LogOut,
  LogIn,
  ChevronDown,
} from "lucide-react";
import { CosmicNavMenu } from "@/components/layout/CosmicNavMenu";
import { OpeningExperience } from "@/components/intro";

const iconMap: Record<string, React.ReactNode> = {
  Sparkles: <Sparkles className="w-4 h-4" />,
  Clock: <Clock className="w-4 h-4" />,
  Mail: <Mail className="w-4 h-4" />,
  Camera: <Camera className="w-4 h-4" />,
  MapPin: <MapPin className="w-4 h-4" />,
  Heart: <Heart className="w-4 h-4" />,
  Compass: <Compass className="w-4 h-4" />,
  Lock: <Lock className="w-4 h-4" />,
};

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, profile, isAdmin, isAuthenticated, signOut, switchDemoRole } = useAuth();
  const toast = useToast();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [showOpeningIntro, setShowOpeningIntro] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu & profile on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setProfileDropdownOpen(false);
  }, [pathname]);

  // Click outside listener for profile dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    toast.info("Signed Out", "Sanctuary gates secured.");
    router.push("/");
  };

  const displayName =
    profile?.full_name ||
    ("name" in (user || {}) ? (user as { name: string }).name : null) ||
    (user?.email ? user.email.split("@")[0] : "Partner");

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-40 px-3 sm:px-6 py-4 transition-all duration-300 pointer-events-none",
          scrolled ? "py-2.5" : "py-4"
        )}
      >
        <div className={cn(
          "max-w-7xl mx-auto flex items-center justify-between pointer-events-auto",
          pathname === "/dashboard" && "lg:hidden"
        )}>
          {/* Logo / Monogram */}
          <Link
            href="/"
            className="group flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/85 backdrop-blur-xl border border-universe-750/70 shadow-glass hover:border-rose-400/50 transition-all duration-300"
          >
            <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-rose-500 to-rose-400 flex items-center justify-center text-white font-serif font-bold text-xs shadow-glow-sm">
              {APP_CONFIG.couple.monogram.slice(0, 1)}
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-xs sm:text-sm tracking-widest text-cream-50 group-hover:text-rose-600 transition-colors uppercase font-medium">
                {APP_CONFIG.couple.monogram}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Pill */}
          <nav className="hidden md:flex items-center gap-1 p-1 rounded-full bg-white/85 backdrop-blur-xl border border-universe-750/70 shadow-glass">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "relative px-3.5 py-1.5 rounded-full text-xs font-sans tracking-wide transition-all duration-300 flex items-center gap-1.5",
                    isActive
                      ? "text-white font-medium"
                      : "text-cream-300 hover:text-cream-50 hover:bg-rose-100/50"
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeNavTab"
                      className="absolute inset-0 bg-gradient-to-r from-rose-500 to-rose-400 rounded-full shadow-glow-rose"
                      transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-1.5">
                    {iconMap[item.iconName]}
                    {item.name}
                  </span>
                </Link>
              );
            })}

            {/* Admin link if Admin */}
            {isAdmin && (
              <Link
                href="/admin"
                className={cn(
                  "relative px-3 py-1.5 rounded-full text-xs font-sans tracking-wide transition-all duration-300 flex items-center gap-1",
                  pathname.startsWith("/admin")
                    ? "bg-gradient-to-r from-rose-500 to-rose-400 text-white font-semibold shadow-glow-rose"
                    : "text-rose-600 hover:text-rose-700 hover:bg-rose-100/50"
                )}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Admin</span>
              </Link>
            )}
          </nav>

          {/* Right Action: Profile / Vault / Login */}
          <div className="flex items-center gap-2">
            {isAuthenticated ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/85 backdrop-blur-xl border border-universe-750/70 hover:border-rose-400/50 text-xs text-cream-100 shadow-glass transition-all"
                >
                  <div className="w-5 h-5 rounded-full bg-rose-500/15 text-rose-700 flex items-center justify-center font-serif text-[11px] font-bold">
                    {displayName.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden sm:inline font-sans text-xs font-medium">{displayName}</span>
                  {isAdmin && (
                    <span className="hidden lg:inline text-[9px] px-1.5 py-0.2 rounded-full bg-rose-500 text-white font-mono font-bold">
                      ADMIN
                    </span>
                  )}
                  <ChevronDown className="w-3 h-3 text-cream-400" />
                </button>

                {/* Dropdown Menu */}
                <AnimatePresence>
                  {profileDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-11 w-56 p-2 rounded-2xl bg-white/95 backdrop-blur-2xl border border-universe-750/70 shadow-2xl space-y-1 z-50 text-left"
                    >
                      <div className="p-2.5 border-b border-universe-750/50 mb-1">
                        <span className="text-xs font-serif text-cream-50 font-medium block truncate">
                          {displayName}
                        </span>
                        <span className="text-[10px] text-rose-600 font-mono block truncate">
                          {user?.email || "Authenticated Partner"}
                        </span>
                      </div>

                      {isAdmin && (
                        <Link
                          href="/admin"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="flex items-center gap-2 px-2.5 py-2 rounded-xl text-xs text-cream-200 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                        >
                          <ShieldCheck className="w-3.5 h-3.5 text-rose-500" />
                          <span>Admin Control Panel</span>
                        </Link>
                      )}

                      <Link
                        href="/vault"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-2 px-2.5 py-2 rounded-xl text-xs text-cream-200 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                      >
                        <Lock className="w-3.5 h-3.5 text-rose-500" />
                        <span>Secret Sanctuary Vault</span>
                      </Link>

                      {/* Demo role switchers */}
                      <div className="pt-2 border-t border-universe-750/50">
                        <span className="text-[9px] uppercase tracking-wider text-cream-400 px-2 block mb-1 font-mono">
                          Switch Profile (Demo)
                        </span>
                        <div className="grid grid-cols-3 gap-1 px-1">
                          <button
                            onClick={() => {
                              switchDemoRole("tharani");
                              setProfileDropdownOpen(false);
                            }}
                            className="text-[10px] py-1 rounded bg-universe-900 text-cream-200 hover:text-rose-600 hover:bg-rose-100/50 transition-colors"
                          >
                            Tharani
                          </button>
                          <button
                            onClick={() => {
                              switchDemoRole("surya");
                              setProfileDropdownOpen(false);
                            }}
                            className="text-[10px] py-1 rounded bg-universe-900 text-cream-200 hover:text-rose-600 hover:bg-rose-100/50 transition-colors"
                          >
                            Surya
                          </button>
                          <button
                            onClick={() => {
                              switchDemoRole("admin");
                              setProfileDropdownOpen(false);
                            }}
                            className="text-[10px] py-1 rounded bg-universe-900 text-rose-600 font-bold hover:bg-rose-100/50 transition-colors"
                          >
                            Admin
                          </button>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-universe-750/50">
                        <button
                          onClick={handleSignOut}
                          className="w-full flex items-center gap-2 px-2.5 py-2 rounded-xl text-xs text-rose-600 hover:bg-rose-500/10 transition-colors"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                href="/auth/login"
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/85 backdrop-blur-xl border border-universe-750/70 hover:border-rose-400/50 text-xs text-rose-600 shadow-glass transition-all font-medium"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span className="font-sans">Sign In</span>
              </Link>
            )}

            {/* Desktop Universe Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/85 backdrop-blur-xl border border-universe-750/70 hover:border-rose-400/50 text-xs text-cream-100 hover:text-rose-600 shadow-glass transition-all font-medium"
              title="Open Cosmic Menu"
              aria-label="Open Cosmic Navigation Menu"
            >
              <Sparkles className="w-3.5 h-3.5 text-rose-500" />
              <span className="font-sans">Menu</span>
            </button>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-full bg-white/90 backdrop-blur-xl border border-universe-750/70 text-cream-100 shadow-glass focus:outline-none hover:text-rose-600"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Fullscreen Romantic Opening Experience if triggered */}
      {showOpeningIntro && (
        <OpeningExperience onComplete={() => setShowOpeningIntro(false)} />
      )}

      {/* Cosmic Navigation Drawer for Mobile / Tablet */}
      <CosmicNavMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        mode="drawer"
        onPlayOpening={() => setShowOpeningIntro(true)}
      />
    </>
  );
}
