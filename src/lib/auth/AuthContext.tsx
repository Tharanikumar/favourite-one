"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase, isSupabaseConfigured } from "@/lib/supabase/client";
import { Profile } from "@/lib/supabase/types";

export interface DemoUser {
  id: string;
  email: string;
  name: string;
  role: "partner" | "admin";
  avatar_url?: string;
}

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
  user: User | DemoUser | null;
  profile: Profile | null;
  session: Session | null;
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
  const [user, setUser] = useState<User | DemoUser | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth
  useEffect(() => {
    let mounted = true;

    async function initAuth() {
      if (isSupabaseConfigured && supabase) {
        try {
          const { data } = await supabase.auth.getSession();
          if (mounted) {
            setSession(data.session);
            setUser(data.session?.user ?? null);
            if (data.session?.user) {
              await fetchProfile(data.session.user.id);
            }
          }

          const {
            data: { subscription },
          } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
            if (mounted) {
              setSession(newSession);
              setUser(newSession?.user ?? null);
              if (newSession?.user) {
                await fetchProfile(newSession.user.id);
              } else {
                setProfile(null);
              }
            }
          });

          return () => {
            subscription.unsubscribe();
          };
        } catch (e) {
          console.error("Supabase auth init error:", e);
        }
      } else {
        // Fallback demo mode: load active demo user from localStorage (default to Tharani)
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
        }
      }

      if (mounted) setIsLoading(false);
    }

    initAuth();

    return () => {
      mounted = false;
    };
  }, []);

  const fetchProfile = async (userId: string) => {
    if (!isSupabaseConfigured || !supabase) return;
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (!error && data) {
        setProfile(data as Profile);
      }
    } catch (err) {
      console.warn("Could not fetch user profile:", err);
    }
  };

  const signIn = async (email: string, password?: string): Promise<{ error?: string }> => {
    setIsLoading(true);
    try {
      if (isSupabaseConfigured && supabase && password) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) {
          setIsLoading(false);
          return { error: error.message };
        }
        setUser(data.user);
        setSession(data.session);
        if (data.user) await fetchProfile(data.user.id);
        setIsLoading(false);
        return {};
      } else {
        // Demo sign in
        const lower = email.toLowerCase();
        let demoKey = "tharani";
        if (lower.includes("surya") || lower.includes("maya")) demoKey = "surya";
        if (lower.includes("admin")) demoKey = "admin";

        const demo = DEMO_PROFILES[demoKey] || DEMO_PROFILES.tharani;
        localStorage.setItem(DEMO_USER_STORAGE_KEY, demoKey);
        setUser(demo);
        setProfile({
          id: demo.id,
          full_name: demo.name,
          role: demo.role,
          avatar_url: demo.avatar_url,
        });
        setIsLoading(false);
        return {};
      }
    } catch (e) {
      setIsLoading(false);
      return { error: e instanceof Error ? e.message : "Authentication failed" };
    }
  };

  const signUp = async (
    email: string,
    password: string,
    fullName: string
  ): Promise<{ error?: string }> => {
    setIsLoading(true);
    try {
      if (isSupabaseConfigured && supabase) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName },
          },
        });
        if (error) {
          setIsLoading(false);
          return { error: error.message };
        }
        setUser(data.user);
        setIsLoading(false);
        return {};
      } else {
        // Demo sign up
        const newDemo: DemoUser = {
          id: "00000000-0000-0000-0000-" + Date.now().toString(16).padStart(12, "0"),
          email,
          name: fullName,
          role: "partner",
        };
        setUser(newDemo);
        setProfile({
          id: newDemo.id,
          full_name: fullName,
          role: "partner",
        });
        setIsLoading(false);
        return {};
      }
    } catch (e) {
      setIsLoading(false);
      return { error: e instanceof Error ? e.message : "Registration failed" };
    }
  };

  const signOut = async () => {
    setIsLoading(true);
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    }
    try {
      localStorage.removeItem(DEMO_USER_STORAGE_KEY);
    } catch {}
    setUser(null);
    setProfile(null);
    setSession(null);
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

  const isAdmin = profile?.role === "admin" || (user as DemoUser)?.role === "admin";
  const isAuthenticated = Boolean(user);
  const isDemoMode = !isSupabaseConfigured;

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
