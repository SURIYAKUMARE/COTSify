"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { getSupabaseClient, isSupabaseConfigured } from "@/lib/supabase";
import {
  Loader2, Eye, EyeOff, ArrowRight,
  Users, Star, Quote, Zap, Package, Globe, CheckCircle2, RefreshCw,
} from "lucide-react";

const COMMUNITY_STATS = [
  { icon: <Users className="w-5 h-5" />, value: "10,000+", label: "Makers joined", color: "text-cyan-400", bg: "bg-cyan-950/50 border-cyan-800/50" },
  { icon: <Package className="w-5 h-5" />, value: "500+", label: "Components", color: "text-blue-400", bg: "bg-blue-950/50 border-blue-800/50" },
  { icon: <Globe className="w-5 h-5" />, value: "50+", label: "Cities", color: "text-purple-400", bg: "bg-purple-950/50 border-purple-800/50" },
];

const TESTIMONIALS = [
  { quote: "Found all components for my final year project in under a minute. Incredible tool!", author: "Priya S.", role: "B.Tech, NIT Trichy", rating: 5, avatar: "P" },
  { quote: "The price comparison feature saved me ₹800 on my Arduino project. Highly recommend!", author: "Rahul M.", role: "Hobbyist Maker", rating: 5, avatar: "R" },
  { quote: "COTsify is a game changer for engineering students. No more manual BOM creation!", author: "Sneha T.", role: "ECE Student, BITS", rating: 5, avatar: "S" },
];

const GoogleIcon = () => (
  <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
);

// ── Email Confirmation Screen ─────────────────────────────────────────────────
function EmailConfirmScreen({ email, onResend }: { email: string; onResend: () => void }) {
  const [resending, setResending] = useState(false);
  const [resent, setResent] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const handleResend = async () => {
    setResending(true);
    await onResend();
    setResending(false);
    setResent(true);
    setCountdown(60);
  };

  useEffect(() => {
    if (countdown <= 0) return;
    const t = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  return (
    <div className="w-full max-w-md mx-auto text-center">
      <div className="relative w-24 h-24 mx-auto mb-6">
        <div className="w-24 h-24 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/30 rounded-full flex items-center justify-center animate-pulse">
          <div className="w-16 h-16 bg-gradient-to-br from-cyan-500/30 to-blue-600/30 rounded-full flex items-center justify-center">
            <span className="text-4xl">✉️</span>
          </div>
        </div>
        <div className="absolute -top-1 -right-1 w-7 h-7 bg-green-500 rounded-full flex items-center justify-center border-2 border-gray-950">
          <CheckCircle2 className="w-4 h-4 text-white" />
        </div>
      </div>

      <h2 className="text-2xl font-bold text-white mb-2">Check your email</h2>
      <p className="text-gray-400 mb-1">We sent a confirmation link to</p>
      <p className="text-cyan-400 font-semibold text-lg mb-6 break-all">{email}</p>

      <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-5 mb-5 text-left">
        <p className="text-gray-400 text-sm font-medium mb-3">Follow these steps:</p>
        <div className="flex flex-col gap-3">
          {[
            { step: "1", text: "Open your email inbox" },
            { step: "2", text: 'Click the "Confirm your email" button' },
            { step: "3", text: "You'll be signed in automatically" },
          ].map(({ step, text }) => (
            <div key={step} className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center flex-shrink-0">
                <span className="text-cyan-400 text-xs font-bold">{step}</span>
              </div>
              <span className="text-gray-300 text-sm">{text}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-amber-950/30 border border-amber-800/40 rounded-xl px-4 py-3 mb-5 flex items-start gap-2 text-left">
        <span className="text-amber-400 text-sm flex-shrink-0">⚠️</span>
        <p className="text-amber-300/80 text-xs">
          Don&apos;t see it? Check your <strong>spam or junk folder</strong>.
          Email is from <strong>noreply@mail.app.supabase.io</strong>.
          If nothing arrives in 2 minutes, your account was still created — use the button below.
        </p>
      </div>

      {/* Primary action — go sign in */}
      <Link
        href="/auth/signin"
        className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold py-3 rounded-xl text-sm transition-all mb-4"
      >
        Go to Sign In →
      </Link>

      {/* Resend */}
      {resent ? (
        <div className="flex items-center justify-center gap-2 text-green-400 text-sm mb-3">
          <CheckCircle2 className="w-4 h-4" />
          Resent! {countdown > 0 && <span className="text-gray-500">({countdown}s)</span>}
        </div>
      ) : (
        <button
          onClick={handleResend}
          disabled={resending || countdown > 0}
          className="flex items-center justify-center gap-2 text-sm text-gray-500 hover:text-cyan-400 disabled:opacity-40 transition-colors mx-auto mb-3"
        >
          {resending ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
          {countdown > 0 ? `Resend in ${countdown}s` : "Resend confirmation email"}
        </button>
      )}

      <p className="text-gray-600 text-sm">
        Wrong email?{" "}
        <Link href="/auth/signup" className="text-cyan-400 hover:text-cyan-300">Sign up again</Link>
      </p>
    </div>
  );
}

// ── Main Signup Page ──────────────────────────────────────────────────────────
export default function SignUpPage() {
  const router = useRouter();
  const { signUpGuest, signInWithGoogle, user, loading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading && user) router.replace("/");
  }, [user, authLoading, router]);

  const supabaseReady = isSupabaseConfigured();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [confirmEmail, setConfirmEmail] = useState(false);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    const result = await signUpGuest(email, password, fullName);
    if (result.confirmEmail) {
      setConfirmEmail(true);
      setSubmitting(false);
    } else if (result.error) {
      setError(result.error);
      setSubmitting(false);
    } else {
      router.push("/dashboard");
    }
  };

  const handleResend = async () => {
    const sb = getSupabaseClient();
    if (!sb) return;
    await sb.auth.resend({ type: "signup", email });
  };

  const handleGoogle = async () => {
    setError("");
    setSubmitting(true);
    const result = await signInWithGoogle();
    if (result.error) {
      setError(result.error);
      setSubmitting(false);
    }
  };

  if (authLoading) return null;

  if (confirmEmail) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
        <EmailConfirmScreen email={email} onResend={handleResend} />
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-5xl">
        <div className="grid lg:grid-cols-2 gap-8 items-start">

          {/* ── Left: Form ─────────────────────────────────────────────────── */}
          <div className="w-full">
            <div className="text-center mb-8">
              <div className="flex flex-col items-center gap-2 mb-2">
                <img src="/cotsify-logo.svg" alt="COTsify Logo" className="w-20 h-20 drop-shadow-[0_0_20px_rgba(6,182,212,0.5)]" />
                <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">COTsify</span>
              </div>
              <p className="text-gray-400">Create your free account</p>
            </div>

            <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-8 flex flex-col gap-5 backdrop-blur-sm">

              {/* Google */}
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
                <span className="text-gray-600 text-xs">or sign up with email</span>
                <div className="flex-1 h-px bg-gray-800" />
              </div>

              {error && (
                <div className="bg-red-950/50 border border-red-800 text-red-400 text-sm rounded-xl px-4 py-3 flex items-start gap-2">
                  <span className="mt-0.5">⚠️</span>
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleEmailSubmit} className="flex flex-col gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1.5">Full name</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    autoComplete="name"
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-cyan-600 transition-colors"
                    placeholder="Jane Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1.5">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-cyan-600 transition-colors"
                    placeholder="you@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1.5">Password</label>
                  <div className="relative">
                    <input
                      type={showPw ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={6}
                      autoComplete="new-password"
                      className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-cyan-600 transition-colors pr-10"
                      placeholder="Min. 6 characters"
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
                  Create account
                </button>
              </form>

              <p className="text-center text-gray-500 text-sm">
                Already have an account?{" "}
                <Link href="/auth/signin" className="text-cyan-400 hover:text-cyan-300 font-medium">Sign in</Link>
              </p>
            </div>
          </div>

          {/* ── Right: Community stats + testimonials ──────────────────────── */}
          <div className="hidden lg:flex flex-col gap-5">
            <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-6 backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-5 h-5 text-cyan-400" />
                <h3 className="text-white font-bold text-lg">Join 10,000+ makers</h3>
              </div>
              <p className="text-gray-400 text-sm mb-5">Be part of a growing community of engineers and students.</p>
              <div className="grid grid-cols-3 gap-3">
                {COMMUNITY_STATS.map((s) => (
                  <div key={s.label} className={`flex flex-col items-center p-3 rounded-xl border ${s.bg} text-center`}>
                    <div className={`mb-1 ${s.color}`}>{s.icon}</div>
                    <div className={`text-xl font-bold ${s.color}`}>{s.value}</div>
                    <div className="text-gray-500 text-xs mt-0.5">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-3">
              {TESTIMONIALS.map((t) => (
                <div key={t.author} className="bg-gray-900/60 border border-gray-800 hover:border-gray-700 rounded-2xl p-4 transition-all hover:-translate-y-0.5 backdrop-blur-sm relative overflow-hidden">
                  <div className="absolute top-3 right-3 text-gray-800">
                    <Quote className="w-5 h-5" />
                  </div>
                  <div className="flex gap-1 mb-2">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} className="w-3 h-3 text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-gray-300 text-sm leading-relaxed mb-3 italic pr-6">&ldquo;{t.quote}&rdquo;</p>
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold text-xs">
                      {t.avatar}
                    </div>
                    <div>
                      <p className="text-white font-medium text-xs">{t.author}</p>
                      <p className="text-gray-500 text-xs">{t.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
