"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { getSupabaseClient, isSupabaseConfigured } from "@/lib/supabase";
import {
  Cpu, Loader2, Eye, EyeOff, Phone, Mail, ArrowRight,
  Users, Star, Quote, Zap, Package, Globe,
} from "lucide-react";

type Mode = "email" | "phone";

const COMMUNITY_STATS = [
  { icon: <Users className="w-5 h-5" />, value: "10,000+", label: "Makers joined", color: "text-cyan-400", bg: "bg-cyan-950/50 border-cyan-800/50" },
  { icon: <Package className="w-5 h-5" />, value: "500+", label: "Components", color: "text-blue-400", bg: "bg-blue-950/50 border-blue-800/50" },
  { icon: <Globe className="w-5 h-5" />, value: "50+", label: "Cities", color: "text-purple-400", bg: "bg-purple-950/50 border-purple-800/50" },
];

const TESTIMONIALS = [
  {
    quote: "Found all components for my final year project in under a minute. Incredible tool!",
    author: "Priya S.",
    role: "B.Tech, NIT Trichy",
    rating: 5,
    avatar: "P",
  },
  {
    quote: "The price comparison feature saved me ₹800 on my Arduino project. Highly recommend!",
    author: "Rahul M.",
    role: "Hobbyist Maker",
    rating: 5,
    avatar: "R",
  },
  {
    quote: "COTsify is a game changer for engineering students. No more manual BOM creation!",
    author: "Sneha T.",
    role: "ECE Student, BITS",
    rating: 5,
    avatar: "S",
  },
];

export default function SignUpPage() {
  const router = useRouter();
  const { signUpGuest, signInWithGoogle, user, loading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading && user) router.replace("/");
  }, [user, authLoading, router]);

  const supabaseReady = isSupabaseConfigured();

  const [mode, setMode] = useState<Mode>("email");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    const result = await signUpGuest(email, password, fullName);
    if (result.error) { setError(result.error); setSubmitting(false); }
    else router.push("/dashboard");
  };

  const handleGoogle = async () => {
    setError("");
    setSubmitting(true);
    const result = await signInWithGoogle();
    if (result.error) { setError(result.error); setSubmitting(false); }
    // On success browser redirects to /auth/callback
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!phone.trim()) { setError("Enter a valid phone number with country code."); return; }
    const sb = getSupabaseClient();
    if (!sb) { setError("Configure Supabase credentials to enable phone login."); return; }
    setSubmitting(true);
    const { error } = await sb.auth.signInWithOtp({ phone });
    if (error) { setError(error.message); setSubmitting(false); }
    else { setOtpSent(true); setSubmitting(false); }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const sb = getSupabaseClient();
    if (!sb) return;
    setSubmitting(true);
    const { error } = await sb.auth.verifyOtp({ phone, token: otp, type: "sms" });
    if (error) { setError(error.message); setSubmitting(false); }
    else router.push("/dashboard");
  };

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
              <p className="text-gray-400">Create your account</p>
            </div>

            <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-8 flex flex-col gap-5 backdrop-blur-sm">
              {/* Google */}
              <button onClick={handleGoogle} disabled={submitting}
                className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-100 disabled:opacity-50 text-gray-900 font-medium py-2.5 rounded-xl transition-colors">
                <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
                {!supabaseReady && <span className="text-xs text-gray-400 ml-1">(needs Supabase)</span>}
              </button>

              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-gray-800" />
                <span className="text-gray-600 text-xs">or</span>
                <div className="flex-1 h-px bg-gray-800" />
              </div>

              {/* Mode toggle */}
              <div className="flex bg-gray-800 rounded-xl p-1 gap-1">
                <button onClick={() => { setMode("email"); setError(""); }}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-colors ${mode === "email" ? "bg-gray-700 text-white" : "text-gray-500 hover:text-gray-300"}`}>
                  <Mail className="w-4 h-4" /> Email
                </button>
                <button onClick={() => { setMode("phone"); setError(""); setOtpSent(false); }}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-colors ${mode === "phone" ? "bg-gray-700 text-white" : "text-gray-500 hover:text-gray-300"}`}>
                  <Phone className="w-4 h-4" /> Phone
                </button>
              </div>

              {error && (
                <div className="bg-red-950/50 border border-red-800 text-red-400 text-sm rounded-xl px-4 py-3">{error}</div>
              )}

              {/* Email form */}
              {mode === "email" && (
                <form onSubmit={handleEmailSubmit} className="flex flex-col gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1.5">Full name</label>
                    <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)}
                      className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-cyan-600 transition-colors"
                      placeholder="Jane Doe" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1.5">Email</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                      className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-cyan-600 transition-colors"
                      placeholder="you@example.com" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1.5">Password</label>
                    <div className="relative">
                      <input type={showPw ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6}
                        className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-cyan-600 transition-colors pr-10"
                        placeholder="Min. 6 characters" />
                      <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
                        {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <button type="submit" disabled={submitting}
                    className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-50 text-white font-semibold py-2.5 rounded-xl transition-all flex items-center justify-center gap-2">
                    {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
                    Create account
                  </button>
                </form>
              )}

              {/* Phone OTP */}
              {mode === "phone" && !otpSent && (
                <form onSubmit={handleSendOtp} className="flex flex-col gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1.5">Phone number</label>
                    <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required
                      className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-cyan-600 transition-colors"
                      placeholder="+91 98765 43210" />
                    <p className="text-xs text-gray-500 mt-1">Include country code (e.g. +91 for India)</p>
                  </div>
                  <button type="submit" disabled={submitting}
                    className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-50 text-white font-semibold py-2.5 rounded-xl transition-all flex items-center justify-center gap-2">
                    {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Phone className="w-4 h-4" />}
                    Send OTP
                    {!supabaseReady && <span className="text-xs opacity-70">(needs Supabase)</span>}
                  </button>
                </form>
              )}

              {mode === "phone" && otpSent && (
                <form onSubmit={handleVerifyOtp} className="flex flex-col gap-4">
                  <div className="text-center">
                    <div className="text-2xl mb-2">📱</div>
                    <p className="text-white font-medium">OTP sent to {phone}</p>
                    <p className="text-gray-400 text-sm mt-1">Enter the 6-digit code from your SMS</p>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1.5">OTP Code</label>
                    <input type="text" value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                      required maxLength={6}
                      className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-cyan-600 transition-colors text-center text-2xl tracking-widest font-mono"
                      placeholder="000000" />
                  </div>
                  <button type="submit" disabled={submitting || otp.length < 6}
                    className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-50 text-white font-semibold py-2.5 rounded-xl transition-all flex items-center justify-center gap-2">
                    {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
                    Verify & Sign up
                  </button>
                  <button type="button" onClick={() => { setOtpSent(false); setOtp(""); }}
                    className="text-sm text-gray-500 hover:text-gray-300 text-center">
                    ← Change number
                  </button>
                </form>
              )}

              <p className="text-center text-gray-500 text-sm">
                Already have an account?{" "}
                <Link href="/auth/signin" className="text-cyan-400 hover:text-cyan-300">Sign in</Link>
              </p>
            </div>
          </div>

          {/* ── Right: Community stats + testimonials ──────────────────────── */}
          <div className="hidden lg:flex flex-col gap-5">
            {/* Join makers */}
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

            {/* Testimonials */}
            <div className="flex flex-col gap-3">
              {TESTIMONIALS.map((t) => (
                <div key={t.author}
                  className="bg-gray-900/60 border border-gray-800 hover:border-gray-700 rounded-2xl p-4 transition-all hover:-translate-y-0.5 backdrop-blur-sm relative overflow-hidden">
                  <div className="absolute top-3 right-3 text-gray-800">
                    <Quote className="w-5 h-5" />
                  </div>
                  <div className="flex gap-1 mb-2">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} className="w-3 h-3 text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-gray-300 text-sm leading-relaxed mb-3 italic pr-6">
                    &ldquo;{t.quote}&rdquo;
                  </p>
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
