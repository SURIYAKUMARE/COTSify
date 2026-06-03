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

      // Check for OAuth error in URL params (e.g. user denied access)
      const params = new URLSearchParams(window.location.search);
      const errorParam = params.get("error");
      const errorDescription = params.get("error_description");
      if (errorParam) {
        setStatus("error");
        setMessage(decodeURIComponent(errorDescription || errorParam).replace(/\+/g, " "));
        setTimeout(() => router.replace("/auth/signin"), 3000);
        return;
      }

      // With implicit flow, detectSessionInUrl:true automatically parses the
      // hash fragment (#access_token=...) and sets the session.
      // We just need to wait for onAuthStateChange to fire.
      try {
        await new Promise<void>((resolve, reject) => {
          const timeout = setTimeout(() => {
            // Last resort: try getSession directly
            sb.auth.getSession().then(({ data: { session } }) => {
              if (session?.user) {
                handleSuccess(session.user);
                resolve();
              } else {
                reject(new Error("Sign in timed out. Please try again."));
              }
            }).catch(reject);
          }, 3000);

          const { data: { subscription } } = sb.auth.onAuthStateChange((_event, session) => {
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

    const handleSuccess = (user: { user_metadata?: Record<string, string>; email?: string }) => {
      const meta = user.user_metadata || {};
      const name = meta.full_name || meta.name || user.email?.split("@")[0] || "User";
      setStatus("success");
      setMessage(`Welcome, ${name}! Redirecting...`);
      setTimeout(() => router.replace("/dashboard"), 1200);
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
            <p className="text-gray-400 text-sm mb-4">{message}</p>
            {message.toLowerCase().includes("exchange") && (
              <div className="bg-amber-950/40 border border-amber-800/50 rounded-xl px-4 py-3 mb-4 text-left max-w-sm mx-auto">
                <p className="text-amber-300 text-xs font-semibold mb-1">⚠️ Google OAuth not configured</p>
                <p className="text-amber-200/70 text-xs">
                  The Google redirect URI in Google Cloud Console doesn&apos;t match Supabase.
                  Add <code className="bg-amber-900/50 px-1 rounded text-amber-300">https://sdviuodapjzuuootixay.supabase.co/auth/v1/callback</code> to your Google OAuth client&apos;s Authorized redirect URIs.
                </p>
              </div>
            )}
            <button
              onClick={() => router.replace("/auth/signin")}
              className="mt-2 bg-cyan-500 hover:bg-cyan-400 text-gray-950 font-semibold px-6 py-2 rounded-xl text-sm transition-colors"
            >
              Back to Sign in
            </button>
          </>
        )}
      </div>
    </div>
  );
}
