"use client";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { getSupabaseClient } from "./supabase";

export interface AppUser {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  phone?: string;
  provider: "guest" | "supabase";
  google_connected?: boolean;
}

interface AuthContextType {
  user: AppUser | null;
  loading: boolean;
  signInGuest: (email: string, password: string) => Promise<{ error?: string; needsConfirmation?: boolean }>;
  signUpGuest: (email: string, password: string, fullName?: string) => Promise<{ error?: string; confirmEmail?: boolean }>;
  signInWithGoogle: () => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  updateProfile: (data: { full_name?: string; avatar_url?: string }) => Promise<{ error?: string }>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signInGuest: async () => ({}),
  signUpGuest: async () => ({}),
  signInWithGoogle: async () => ({}),
  signOut: async () => {},
  updateProfile: async () => ({}),
});

const GUEST_KEY = "cotsify_guest_user";
const SUPABASE_USER_KEY = "cotsify_supabase_user";

type SupabaseUser = {
  id: string;
  email?: string;
  phone?: string;
  user_metadata?: Record<string, string>;
  identities?: Array<{ provider: string }>;
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  const buildUser = (supaUser: SupabaseUser): AppUser => {
    const meta = supaUser.user_metadata || {};
    const identities = supaUser.identities || [];
    const isGoogle =
      identities.some((i) => i.provider === "google") ||
      meta.iss?.includes("accounts.google.com") ||
      meta.provider_id !== undefined;

    const u: AppUser = {
      id: supaUser.id,
      email: supaUser.email || supaUser.phone || "",
      full_name:
        meta.full_name || meta.name ||
        meta.email?.split("@")[0] ||
        supaUser.email?.split("@")[0] || "User",
      avatar_url: meta.avatar_url || meta.picture || meta.photo_url || undefined,
      phone: supaUser.phone,
      provider: "supabase",
      google_connected: isGoogle,
    };
    try { localStorage.setItem(SUPABASE_USER_KEY, JSON.stringify(u)); } catch {}
    return u;
  };

  useEffect(() => {
    const sb = getSupabaseClient();
    if (sb) {
      try { localStorage.removeItem(GUEST_KEY); } catch {}

      try {
        const cached = localStorage.getItem(SUPABASE_USER_KEY);
        if (cached) setUser(JSON.parse(cached));
      } catch {}

      sb.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          setUser(buildUser(session.user as SupabaseUser));
        } else {
          try { localStorage.removeItem(SUPABASE_USER_KEY); } catch {}
          setUser(null);
        }
        setLoading(false);
      }).catch(() => {
        setUser(null);
        setLoading(false);
      });

      const { data: { subscription } } = sb.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          setUser(buildUser(session.user as SupabaseUser));
        } else {
          try { localStorage.removeItem(SUPABASE_USER_KEY); } catch {}
          setUser(null);
        }
        setLoading(false);
      });

      return () => subscription.unsubscribe();
    } else {
      try {
        const stored = localStorage.getItem(GUEST_KEY);
        setUser(stored ? JSON.parse(stored) : null);
      } catch {
        setUser(null);
      }
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateProfile = async (data: { full_name?: string; avatar_url?: string }): Promise<{ error?: string }> => {
    if (!user) return { error: "Not signed in" };
    if (user.provider === "supabase") {
      const sb = getSupabaseClient();
      if (!sb) return { error: "Supabase not configured" };
      const { data: updated, error } = await sb.auth.updateUser({ data });
      if (error) return { error: error.message };
      if (updated.user) setUser(buildUser(updated.user as SupabaseUser));
      return {};
    } else {
      const updated: AppUser = { ...user, ...data };
      try { localStorage.setItem(GUEST_KEY, JSON.stringify(updated)); } catch {}
      setUser(updated);
      return {};
    }
  };

  const signUpGuest = async (
    email: string,
    password: string,
    fullName?: string
  ): Promise<{ error?: string; confirmEmail?: boolean }> => {
    if (!email || !password) return { error: "Email and password required" };
    if (password.length < 6) return { error: "Password must be at least 6 characters" };

    const sb = getSupabaseClient();
    if (sb) {
      const { data, error } = await sb.auth.signUp({
        email,
        password,
        options: { data: { full_name: fullName || email.split("@")[0] } },
      });

      if (error) {
        if (error.message.includes("Too many requests") || error.status === 429) {
          return { error: "Too many sign-up attempts. Please wait 60 seconds and try again." };
        }
        // Email delivery failure — account was created, show confirmation screen
        // Supabase may still queue/deliver the email even if it returned an error
        if (
          error.message.toLowerCase().includes("sending confirmation email") ||
          error.message.toLowerCase().includes("smtp") ||
          error.message.toLowerCase().includes("email")
        ) {
          return { confirmEmail: true };
        }
        if (
          error.message.toLowerCase().includes("already registered") ||
          error.message.toLowerCase().includes("already exists") ||
          error.message.toLowerCase().includes("user already")
        ) {
          return { error: "An account with this email already exists. Please sign in instead." };
        }
        return { error: error.message };
      }

      if (data.user) {
        // Email confirmation disabled — signed in immediately
        if (data.session) {
          setUser(buildUser(data.user as SupabaseUser));
          return {};
        }
        // Email confirmation required — sent successfully
        return { confirmEmail: true };
      }
    }

    // Fallback: guest mode (only when Supabase not configured)
    const newUser: AppUser = {
      id: crypto.randomUUID(),
      email,
      full_name: fullName || email.split("@")[0],
      provider: "guest",
    };
    try { localStorage.setItem(GUEST_KEY, JSON.stringify(newUser)); } catch {}
    setUser(newUser);
    return {};
  };

  const signInGuest = async (email: string, password: string): Promise<{ error?: string; needsConfirmation?: boolean }> => {
    if (!email || !password) return { error: "Email and password required" };

    const sb = getSupabaseClient();
    if (sb) {
      const { data, error } = await sb.auth.signInWithPassword({ email, password });
      if (error) {
        if (error.message.includes("Too many requests") || error.status === 429) {
          return { error: "Too many sign-in attempts. Please wait 60 seconds and try again." };
        }
        // Email not confirmed yet — give user a way to resend
        if (error.message.toLowerCase().includes("email not confirmed")) {
          return { needsConfirmation: true, error: "Please confirm your email first. Check your inbox (and spam folder)." };
        }
        return { error: error.message };
      }
      if (data.user) {
        setUser(buildUser(data.user as SupabaseUser));
        return {};
      }
    }

    // Fallback: guest mode (only when Supabase not configured)
    try {
      const stored = localStorage.getItem(GUEST_KEY);
      if (stored) {
        const existing: AppUser = JSON.parse(stored);
        if (existing.email === email) { setUser(existing); return {}; }
        return { error: "Wrong email or password." };
      }
    } catch {}
    const newUser: AppUser = {
      id: crypto.randomUUID(),
      email,
      full_name: email.split("@")[0],
      provider: "guest",
    };
    try { localStorage.setItem(GUEST_KEY, JSON.stringify(newUser)); } catch {}
    setUser(newUser);
    return {};
  };

  const signOut = async (): Promise<void> => {
    const sb = getSupabaseClient();
    if (sb) { try { await sb.auth.signOut(); } catch {} }
    try {
      localStorage.removeItem(GUEST_KEY);
      localStorage.removeItem(SUPABASE_USER_KEY);
    } catch {}
    setUser(null);
  };

  const signInWithGoogle = async (): Promise<{ error?: string }> => {
    const sb = getSupabaseClient();
    if (!sb) return { error: "Supabase not configured. Add your keys to .env.local" };
    try {
      const redirectTo = `${window.location.origin}/auth/callback`;
      const { error } = await sb.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo,
          queryParams: { access_type: "offline", prompt: "select_account" },
        },
      });
      if (error) return { error: error.message };
      return {};
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Google sign in failed";
      return { error: msg };
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signInGuest, signUpGuest, signInWithGoogle, signOut, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
