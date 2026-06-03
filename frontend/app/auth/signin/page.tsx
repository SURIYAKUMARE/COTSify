"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { getSupabaseClient, isSupabaseConfigured } from "@/lib/supabase";
import {
  Loader2, Eye, EyeOff, ArrowRight, RefreshCw, CheckCircle2,
  Bookmark, TrendingUp, Award, Download, CheckCircle, Mail,
} from "lucide-react";

const BENEFITS = [
  { icon: <Bookmark className="w-5 h-5" />, title: "Save Projects", desc: "Keep all your analyzed projects in one place, accessible anytime.", color: "text-cyan-400", bg: "bg-cyan-950/50 border-cyan-800/50" },
  { icon: <TrendingUp className="w-5 h-5" />, title: "Track Progress", desc: "Monitor project status from planning to completion.", color: "text-blue-400", bg: "bg-blue-950/50 border-blue-800/50" },
  { icon: <Award className="w-5 h-5" />, title: "Earn Badges", desc: "Unlock achievement badges as you build more projects.", color: "text-amber-400", bg: "bg-amber-950/50 border-amber-800/50" },
  { icon: <Download className="w-5 h-5" />, title: "Export BOM", desc: "Download full Bill of Materials as text files for any project.", color: "text-green-400", bg: "bg-green-950/50 border-green-800/50" },
];


const GoogleIcon = () => (
  <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
);

export default function SignInPage() {
  const router = useRouter();
  const { signInGuest, signInWithGoogle, user, loading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading && user) router.replace("/dashboard");
  }, [user, authLoading, router]);

  const supabaseReady = isSupabaseConfigured();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [needsConfirmation, setNeedsConfirmation] = useState(false);
  const [resending, setResending] = useState(false);
  const [resent, setResent] = useState(false);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    if (countdown <= 0) return;
    const t = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setNeedsConfirmation(false);
    setSubmitting(true);
    const result = await signInGuest(email, password);
    if (result.needsConfirmation) {
      setNeedsConfirmation(true);
      setError(result.error || "");
      setSubmitting(false);
    } else if (result.error) {
      setError(result.error);
      setSubmitting(false);
    } else {
      router.replace("/dashboard");
    }
  };

  const handleResendConfirmation = async () => {
    const sb = getSupabaseClient();
    if (!sb || !email) return;
    setResending(true);
    await sb.auth.resend({ type: "signup", email });
    setResending(false);
    setResent(true);
    setCountdown(60);
  };

  const handleGoogle = async () => {
    setError("");
    setNeedsConfirmation(false);
    setSubmitting(true);
    const result = await signInWithGoogle();
    if (result.error) {
      setError(result.error);
      setSubmitting(false);
    }
  };

  if (authLoading) return null;

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-5xl">
        <div className="grid lg:grid-cols-2 gap-8 items-center">

          {/* ── Left: Form ─────────────────────────────────────────────────── */}
          <div className="w-full">
            <div className="text-center mb-8">
              <div className="flex flex-col items-center gap-2 mb-2">
                <img src="/cotsify-logo.svg" alt="COTsify Logo" className="w-20 h-20 drop-shadow-[0_0_20px_rgba(6,182,212,0.5)]" />
                <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">COTsify</span>
              </div>
              <p className="text-gray-400">Sign in to your account</p>
            </div>

            <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-8 flex flex-col gap-5 backdrop-blur-sm">

              {/* Google sign in */}
              <button
                onClick={handleGoogle}
                disabled={submitting}
                className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-100 disabled:opacity-50 text-gray-900 font-medium py-3 rounded-xl transition-colors"
              >
                <GoogleIcon />
                Continue with Google
                {!supabaseReady && <span className="text-xs text-gray-400 ml-1">(needs Supabase)</span>}
              </button>

              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-gray-800" />
                <span className="text-gray-600 text-xs">or sign in with email</span>
                <div className="flex-1 h-px bg-gray-800" />
              </div>

              {/* Error */}
              {error && !needsConfirmation && (
                <div className="bg-red-950/50 border border-red-800 text-red-400 text-sm rounded-xl px-4 py-3 flex items-start gap-2">
                  <span className="mt-0.5">⚠️</span>
                  <span>{error}</span>
                </div>
              )}

              {/* Email not confirmed — show resend option */}
              {needsConfirmation && (
                <div className="bg-amber-950/40 border border-amber-800/50 rounded-xl p-4 flex flex-col gap-3">
                  <div className="flex items-start gap-2">
                    <Mail className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-amber-300 text-sm font-medium">Email not confirmed</p>
                      <p className="text-amber-400/70 text-xs mt-0.5">
                        Check your inbox at <strong>{email}</strong> and click the confirmation link.
                        Also check your spam folder.
                      </p>
                    </div>
                  </div>
                  {resent ? (
                    <div className="flex items-center gap-2 text-green-400 text-xs">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Confirmation email resent! {countdown > 0 && `(${countdown}s)`}
                    </div>
                  ) : (
                    <button
                      onClick={handleResendConfirmation}
                      disabled={resending || countdown > 0}
                      className="flex items-center justify-center gap-2 text-xs text-amber-400 hover:text-amber-300 bg-amber-950/60 border border-amber-800/50 py-2 rounded-lg transition-colors disabled:opacity-50"
                    >
                      {resending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
                      {countdown > 0 ? `Resend in ${countdown}s` : "Resend confirmation email"}
                    </button>
                  )}
                </div>
              )}

              {/* Email / Password form */}
              <form onSubmit={handleEmailSubmit} className="flex flex-col gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1.5">Email</label>
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
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-sm text-gray-400">Password</label>
                    <Link href="/auth/forgot-password" className="text-xs text-cyan-500 hover:text-cyan-400">
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <input
                      type={showPw ? "text" : "password"}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      required
                      autoComplete="current-password"
                      className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-cyan-600 transition-colors pr-10"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPw(!showPw)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                    >
                      {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-50 text-white font-semibold py-2.5 rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
                  Sign in
                </button>
              </form>

              <p className="text-center text-gray-500 text-sm">
                No account?{" "}
                <Link href="/auth/signup" className="text-cyan-400 hover:text-cyan-300 font-medium">
                  Sign up free
                </Link>
              </p>
            </div>
          </div>

          {/* ── Right: Benefits + Testimonial ──────────────────────────────── */}
          <div className="hidden lg:flex flex-col gap-6">
            <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-6 backdrop-blur-sm">
              <h3 className="text-white font-bold text-lg mb-2 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-cyan-400" />
                Why sign in?
              </h3>
              <p className="text-gray-400 text-sm mb-5">Unlock the full COTsify experience with a free account.</p>
              <div className="flex flex-col gap-3">
                {BENEFITS.map((b) => (
                  <div key={b.title} className={`flex items-start gap-3 p-3 rounded-xl border ${b.bg} transition-all hover:-translate-y-0.5`}>
                    <div className={`mt-0.5 flex-shrink-0 ${b.color}`}>{b.icon}</div>
                    <div>
                      <p className="text-white font-medium text-sm">{b.title}</p>
                      <p className="text-gray-400 text-xs mt-0.5">{b.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>


          </div>

        </div>
      </div>
    </div>
  );
}
