"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { Profile } from "@/lib/types";

export interface DemoUser {
  id: string;
  email: string;
  name: string;
  role: "partner" | "admin";
  avatar_url?: string;
}

export type AuthUser = DemoUser;

export const DEMO_PROFILES: Record<string, DemoUser> = {
  tharani: {
    id: "00000000-0000-0000-0000-000000000001",
    email: "tharani@universe.love",
    name: "Tharani",
    role: "partner",
    avatar_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
  },
  surya: {
    id: "00000000-0000-0000-0000-000000000002",
    email: "surya@universe.love",
    name: "Surya",
    role: "partner",
    avatar_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
  },
  admin: {
    id: "00000000-0000-0000-0000-000000000003",
    email: "admin@universe.love",
    name: "Sanctuary Curator",
    role: "admin",
    avatar_url: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80",
  },
  // Backward compatibility aliases
  alex: {
    id: "00000000-0000-0000-0000-000000000001",
    email: "tharani@universe.love",
    name: "Tharani",
    role: "partner",
    avatar_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
  },
  maya: {
    id: "00000000-0000-0000-0000-000000000002",
    email: "surya@universe.love",
    name: "Surya",
    role: "partner",
    avatar_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
  },
};

interface AuthContextType {
  user: AuthUser | null;
  profile: Profile | null;
  session: { user: AuthUser } | null;
  isAdmin: boolean;
  isAuthenticated: boolean;
  isLoading: boolean;
  isDemoMode: boolean;
  signIn: (email: string, password?: string) => Promise<{ error?: string }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  switchDemoRole: (roleKey: "tharani" | "surya" | "admin" | "alex" | "maya") => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEMO_USER_STORAGE_KEY = "olu_demo_auth_user";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize client auth from localStorage (default to Tharani)
  useEffect(() => {
    try {
      const savedKey = localStorage.getItem(DEMO_USER_STORAGE_KEY) || "tharani";
      const demoUser = DEMO_PROFILES[savedKey] || DEMO_PROFILES.tharani;
      setUser(demoUser);
      setProfile({
        id: demoUser.id,
        full_name: demoUser.name,
        role: demoUser.role,
        avatar_url: demoUser.avatar_url,
      });
    } catch {
      setUser(DEMO_PROFILES.tharani);
      setProfile({
        id: DEMO_PROFILES.tharani.id,
        full_name: DEMO_PROFILES.tharani.name,
        role: DEMO_PROFILES.tharani.role,
        avatar_url: DEMO_PROFILES.tharani.avatar_url,
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signIn = async (email: string, _password?: string): Promise<{ error?: string }> => {
    setIsLoading(true);
    try {
      const lower = email.toLowerCase();
      let demoKey = "tharani";
      if (lower.includes("surya") || lower.includes("maya")) demoKey = "surya";
      if (lower.includes("admin")) demoKey = "admin";

      const demo = DEMO_PROFILES[demoKey] || {
        id: "00000000-0000-0000-0000-" + Date.now().toString(16).padStart(12, "0"),
        email,
        name: email.split("@")[0].charAt(0).toUpperCase() + email.split("@")[0].slice(1),
        role: "partner" as const,
      };

      try {
        localStorage.setItem(DEMO_USER_STORAGE_KEY, demoKey in DEMO_PROFILES ? demoKey : "tharani");
      } catch {}

      setUser(demo);
      setProfile({
        id: demo.id,
        full_name: demo.name,
        role: demo.role,
        avatar_url: demo.avatar_url,
      });
      setIsLoading(false);
      return {};
    } catch (e) {
      setIsLoading(false);
      return { error: e instanceof Error ? e.message : "Authentication failed" };
    }
  };

  const signUp = async (
    email: string,
    _password: string,
    fullName: string
  ): Promise<{ error?: string }> => {
    setIsLoading(true);
    try {
      const newDemo: DemoUser = {
        id: "00000000-0000-0000-0000-" + Date.now().toString(16).padStart(12, "0"),
        email,
        name: fullName,
        role: "partner",
      };
      try {
        localStorage.setItem(DEMO_USER_STORAGE_KEY, "tharani");
      } catch {}
      setUser(newDemo);
      setProfile({
        id: newDemo.id,
        full_name: fullName,
        role: "partner",
      });
      setIsLoading(false);
      return {};
    } catch (e) {
      setIsLoading(false);
      return { error: e instanceof Error ? e.message : "Registration failed" };
    }
  };

  const signOut = async () => {
    setIsLoading(true);
    try {
      localStorage.removeItem(DEMO_USER_STORAGE_KEY);
    } catch {}
    setUser(null);
    setProfile(null);
    setIsLoading(false);
  };

  const switchDemoRole = (roleKey: "tharani" | "surya" | "admin" | "alex" | "maya") => {
    const demo = DEMO_PROFILES[roleKey];
    if (demo) {
      try {
        localStorage.setItem(DEMO_USER_STORAGE_KEY, roleKey);
      } catch {}
      setUser(demo);
      setProfile({
        id: demo.id,
        full_name: demo.name,
        role: demo.role,
        avatar_url: demo.avatar_url,
      });
    }
  };

  const isAdmin = profile?.role === "admin" || user?.role === "admin";
  const isAuthenticated = Boolean(user);
  const isDemoMode = true;
  const session = user ? { user } : null;

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        session,
        isAdmin,
        isAuthenticated,
        isLoading,
        isDemoMode,
        signIn,
        signUp,
        signOut,
        switchDemoRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
