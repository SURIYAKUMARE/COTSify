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
        // Exchange the code in the URL for a session
        const { data, error } = await sb.auth.exchangeCodeForSession(
          window.location.href
        );

        if (error) throw error;

        if (data.session?.user) {
          const u = data.session.user;
          const name =
            u.user_metadata?.full_name ||
            u.user_metadata?.name ||
            u.email?.split("@")[0] ||
            "User";
          const avatar =
            u.user_metadata?.avatar_url ||
            u.user_metadata?.picture ||
            "";

          setStatus("success");
          setMessage(`Welcome, ${name}! Redirecting...`);

          // Small delay so user sees the success state
          setTimeout(() => router.replace("/"), 1200);
        } else {
          // No session — try getSession as fallback
          const { data: sessionData } = await sb.auth.getSession();
          if (sessionData.session?.user) {
            setStatus("success");
            setMessage("Signed in! Redirecting...");
            setTimeout(() => router.replace("/"), 1200);
          } else {
            throw new Error("No session found after OAuth callback.");
          }
        }
      } catch (err: any) {
        console.error("OAuth callback error:", err);
        setStatus("error");
        setMessage(err?.message || "Sign in failed. Please try again.");
        setTimeout(() => router.replace("/auth/signin"), 3000);
      }
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
