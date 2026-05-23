"use client";
import { useState } from "react";
import Link from "next/link";
import { getSupabaseClient } from "@/lib/supabase";
import { Loader2, ArrowLeft, Mail, CheckCircle2 } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    const sb = getSupabaseClient();
    if (!sb) {
      setError("Supabase not configured.");
      setSubmitting(false);
      return;
    }

    const { error } = await sb.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });

    if (error) {
      setError(error.message);
      setSubmitting(false);
    } else {
      setSent(true);
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <Link href="/auth/signin" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-300 text-sm mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to sign in
        </Link>

        <div className="text-center mb-8">
          <div className="flex flex-col items-center gap-2 mb-2">
            <img src="/cotsify-logo.svg" alt="COTsify Logo" className="w-16 h-16 drop-shadow-[0_0_20px_rgba(6,182,212,0.5)]" />
            <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">COTsify</span>
          </div>
          <p className="text-gray-400">Reset your password</p>
        </div>

        <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-8 backdrop-blur-sm">
          {sent ? (
            <div className="text-center">
              <div className="w-16 h-16 bg-green-950 border border-green-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-green-400" />
              </div>
              <h2 className="text-white font-bold text-lg mb-2">Check your email</h2>
              <p className="text-gray-400 text-sm mb-2">
                We sent a password reset link to
              </p>
              <p className="text-cyan-400 font-semibold mb-6">{email}</p>
              <p className="text-gray-500 text-xs mb-6">
                Check your spam folder if you don&apos;t see it. The link expires in 1 hour.
              </p>
              <Link href="/auth/signin"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold px-6 py-2.5 rounded-xl transition-all text-sm">
                Back to Sign In
              </Link>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-cyan-950/60 border border-cyan-800/50 rounded-xl">
                  <Mail className="w-5 h-5 text-cyan-400" />
                </div>
                <div>
                  <h2 className="text-white font-bold">Forgot your password?</h2>
                  <p className="text-gray-500 text-xs">Enter your email and we&apos;ll send a reset link</p>
                </div>
              </div>

              {error && (
                <div className="bg-red-950/50 border border-red-800 text-red-400 text-sm rounded-xl px-4 py-3 mb-4 flex items-start gap-2">
                  <span>⚠️</span> {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1.5">Email address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-cyan-600 transition-colors"
                    placeholder="you@example.com"
                  />
                </div>
                <button
                  type="submit"
                  disabled={submitting || !email}
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-50 text-white font-semibold py-2.5 rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
                  Send reset link
                </button>
              </form>

              <p className="text-center text-gray-500 text-sm mt-4">
                Remember your password?{" "}
                <Link href="/auth/signin" className="text-cyan-400 hover:text-cyan-300">Sign in</Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
