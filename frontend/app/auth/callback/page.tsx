"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseClient } from "@/lib/supabase";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";

export default function AuthCallbackPage() {
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("Completing sign in...");

  useEffect(() => {
    const handleCallback = async () => {
      const sb = getSupabaseClient();
      if (!sb) {
        setStatus("error");
        setMessage("Supabase not configured.");
        setTimeout(() => router.replace("/auth/signin"), 2000);
        return;
      }

      try {
        // Check for PKCE flow: ?code=... in URL
        const params = new URLSearchParams(window.location.search);
        const code = params.get("code");
        const errorParam = params.get("error");
        const errorDescription = params.get("error_description");

        // Handle OAuth error returned in URL
        if (errorParam) {
          throw new Error(errorDescription || errorParam);
        }

        if (code) {
          // PKCE flow — exchange code for session
          const { data, error } = await sb.auth.exchangeCodeForSession(
            window.location.href
          );
          if (error) throw error;
          if (data.session?.user) {
            return handleSuccess(data.session.user);
          }
        }

        // Implicit flow — session is set via hash fragment automatically
        // detectSessionInUrl: true in createClient handles this, just getSession
        const { data: sessionData, error: sessionError } = await sb.auth.getSession();
        if (sessionError) throw sessionError;

        if (sessionData.session?.user) {
          return handleSuccess(sessionData.session.user);
        }

        // Wait briefly for onAuthStateChange to fire (implicit flow)
        await new Promise<void>((resolve, reject) => {
          const timeout = setTimeout(() => reject(new Error("Sign in timed out. Please try again.")), 5000);
          const { data: { subscription } } = sb.auth.onAuthStateChange((event, session) => {
            if (session?.user) {
              clearTimeout(timeout);
              subscription.unsubscribe();
              handleSuccess(session.user);
              resolve();
            }
          });
        });

      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Sign in failed. Please try again.";
        console.error("OAuth callback error:", err);
        setStatus("error");
        setMessage(msg);
        setTimeout(() => router.replace("/auth/signin"), 3000);
      }
    };

    const handleSuccess = (user: { user_metadata?: Record<string, string> ; email?: string }) => {
      const meta = user.user_metadata || {};
      const name =
        meta.full_name ||
        meta.name ||
        user.email?.split("@")[0] ||
        "User";
      setStatus("success");
      setMessage(`Welcome, ${name}! Redirecting...`);
      setTimeout(() => router.replace("/"), 1200);
    };

    handleCallback();
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="text-center">
        {status === "loading" && (
          <>
            <div className="relative w-16 h-16 mx-auto mb-6">
              <Loader2 className="w-16 h-16 text-cyan-400 animate-spin" />
              <div className="absolute inset-0 w-16 h-16 rounded-full border-2 border-cyan-400/20 animate-ping" />
            </div>
            <h2 className="text-white font-bold text-xl mb-2">Signing you in</h2>
            <p className="text-gray-400 text-sm">{message}</p>
          </>
        )}
        {status === "success" && (
          <>
            <div className="w-16 h-16 bg-green-950 border border-green-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-8 h-8 text-green-400" />
            </div>
            <h2 className="text-white font-bold text-xl mb-2">Signed in!</h2>
            <p className="text-gray-400 text-sm">{message}</p>
          </>
        )}
        {status === "error" && (
          <>
            <div className="w-16 h-16 bg-red-950 border border-red-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-8 h-8 text-red-400" />
            </div>
            <h2 className="text-white font-bold text-xl mb-2">Sign in failed</h2>
            <p className="text-gray-400 text-sm">{message}</p>
            <p className="text-gray-600 text-xs mt-2">Redirecting to sign in...</p>
          </>
        )}
      </div>
    </div>
  );
}
