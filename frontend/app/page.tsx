"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import {
  Cpu, Search, MapPin, BarChart3, Shield, Zap, ArrowRight,
  BookOpen, Bot, Loader2, Star, Users, Package, TrendingUp,
  Compass, ChevronRight, Play, CheckCircle, Globe, Layers,
} from "lucide-react";

const FEATURES = [
  { icon: <Cpu className="w-6 h-6" />, title: "AI Component Extraction", desc: "GPT-4 analyzes your project title and extracts every required hardware and software component automatically.", color: "from-cyan-500 to-blue-600", detail: "Supports 500+ component types" },
  { icon: <MapPin className="w-6 h-6" />, title: "Local Store Finder", desc: "Find nearby electronics shops with real-time ratings, distance, and opening hours using Google Maps.", color: "from-blue-500 to-purple-600", detail: "Powered by Google Maps API" },
  { icon: <BarChart3 className="w-6 h-6" />, title: "Price Comparison", desc: "Compare prices across Amazon, Flipkart, Robu.in and more — find the best deal instantly.", color: "from-purple-500 to-pink-600", detail: "3+ platforms compared" },
  { icon: <Bot className="w-6 h-6" />, title: "AI Chat Assistant", desc: "Ask anything about components, wiring, pricing, or project planning. Your 24/7 engineering expert.", color: "from-pink-500 to-rose-600", detail: "GPT-4o-mini powered" },
  { icon: <BookOpen className="w-6 h-6" />, title: "Catalog & Compare", desc: "Browse curated components and compare technical specifications side-by-side to make the best choice.", color: "from-amber-500 to-orange-600", detail: "Interactive spec comparison" },
  { icon: <Compass className="w-6 h-6" />, title: "Project Explorer", desc: "Discover 20 curated project ideas across IoT, Robotics, AI/ML with cost estimates and difficulty ratings.", color: "from-green-500 to-cyan-600", detail: "20 project templates" },
];

const STATS = [
  { value: "500+", label: "Components", icon: <Package className="w-5 h-5" /> },
  { value: "20+", label: "Project Templates", icon: <Layers className="w-5 h-5" /> },
  { value: "3", label: "Price Platforms", icon: <TrendingUp className="w-5 h-5" /> },
  { value: "AI", label: "Powered Analysis", icon: <Zap className="w-5 h-5" /> },
];

const EXAMPLES = [
  "Smart Irrigation System using IoT",
  "Line Following Robot",
  "Home Automation with Raspberry Pi",
  "Face Recognition Attendance System",
  "Smart Parking System",
  "Gesture Controlled Robot",
];

const HOW_IT_WORKS = [
  { step: "01", icon: "✏️", title: "Enter your project", desc: "Type any project name — from 'Smart Irrigation System' to 'Gesture Controlled Robot'." },
  { step: "02", icon: "🤖", title: "AI extracts components", desc: "Our AI identifies every hardware part, sensor, module, and software tool you need." },
  { step: "03", icon: "💰", title: "Compare prices", desc: "See prices across Amazon, Flipkart, and Robu.in. Find the cheapest option instantly." },
  { step: "04", icon: "🗺️", title: "Find local stores", desc: "Locate nearby electronics shops with ratings and directions via Google Maps." },
];

const TESTIMONIALS = [
  { name: "Arjun K.", role: "ECE Student, VIT", text: "COTsify saved me 3 hours of research for my IoT project. Got the full component list in seconds!", avatar: "A" },
  { name: "Priya M.", role: "Robotics Club Lead", text: "The price comparison feature is incredible. Found Arduino Uno for ₹349 instead of ₹649!", avatar: "P" },
  { name: "Rahul S.", role: "Final Year Project", text: "The AI chat helped me understand which sensors to use for my health monitoring system.", avatar: "R" },
];

export default function HomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [typingIdx, setTypingIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [typed, setTyped] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!loading && !user) router.replace("/auth/signin");
  }, [user, loading, router]);

  // Typewriter
  useEffect(() => {
    const current = EXAMPLES[typingIdx];
    const timeout = setTimeout(() => {
      if (!deleting) {
        if (charIdx < current.length) { setTyped(current.slice(0, charIdx + 1)); setCharIdx(c => c + 1); }
        else setTimeout(() => setDeleting(true), 1800);
      } else {
        if (charIdx > 0) { setTyped(current.slice(0, charIdx - 1)); setCharIdx(c => c - 1); }
        else { setDeleting(false); setTypingIdx(i => (i + 1) % EXAMPLES.length); }
      }
    }, deleting ? 30 : 60);
    return () => clearTimeout(timeout);
  }, [charIdx, deleting, typingIdx]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
    </div>
  );
  if (!user) return null;

  return (
    <div className="flex flex-col">

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden px-4">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(6,182,212,0.2),transparent)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_80%_90%,rgba(59,130,246,0.12),transparent)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_40%_30%_at_10%_60%,rgba(139,92,246,0.08),transparent)]" />
          <div className="absolute inset-0 opacity-[0.025]" style={{ backgroundImage: "linear-gradient(rgba(6,182,212,1) 1px, transparent 1px), linear-gradient(90deg, rgba(6,182,212,1) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
          {[{t:"15%",l:"8%",s:6,d:"0s"},{t:"25%",l:"92%",s:4,d:"1s"},{t:"70%",l:"5%",s:5,d:"2s"},{t:"80%",l:"88%",s:6,d:"0.5s"}].map((n,i) => (
            <div key={i} className="absolute rounded-full bg-cyan-400 animate-pulse" style={{ top:n.t, left:n.l, width:n.s, height:n.s, opacity:0.4, animationDelay:n.d }} />
          ))}
        </div>

        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-cyan-950/60 border border-cyan-800/60 text-cyan-400 text-xs px-4 py-2 rounded-full mb-6 backdrop-blur-sm">
            <Zap className="w-3.5 h-3.5" />
            AI-powered engineering component sourcing
          </div>

          <h1 className="text-5xl sm:text-7xl font-bold tracking-tight mb-6 leading-tight">
            <span className="text-white">Build smarter,</span>
            <br />
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500 bg-clip-text text-transparent">source faster</span>
          </h1>

          <p className="text-gray-400 text-lg sm:text-xl max-w-2xl mx-auto mb-8 leading-relaxed">
            Enter any project title. COTsify's AI identifies every component, compares prices across platforms, and finds local stores near you.
          </p>

          {/* Typewriter demo */}
          <div className="max-w-xl mx-auto mb-10">
            <div className="bg-gray-900/80 border border-gray-700 rounded-2xl px-5 py-4 flex items-center gap-3 backdrop-blur-sm">
              <Search className="w-5 h-5 text-gray-500 flex-shrink-0" />
              <span className="text-gray-300 text-sm flex-1 text-left">
                {typed}<span className="inline-block w-0.5 h-4 bg-cyan-400 animate-pulse ml-0.5" />
              </span>
              <Link href={`/search?q=${encodeURIComponent(typed)}`}
                className="bg-cyan-500 hover:bg-cyan-400 text-gray-950 font-semibold px-4 py-1.5 rounded-xl text-sm transition-colors flex-shrink-0">
                Analyze
              </Link>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-14">
            <Link href="/search" className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold px-8 py-4 rounded-full transition-all shadow-lg shadow-cyan-500/25 hover:scale-105">
              <Search className="w-4 h-4" /> Start analyzing <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/explore" className="inline-flex items-center justify-center gap-2 bg-gray-900/80 hover:bg-gray-800 text-white px-8 py-4 rounded-full transition-all border border-gray-700 hover:border-cyan-700 backdrop-blur-sm">
              <Compass className="w-4 h-4" /> Explore projects
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto">
            {STATS.map(s => (
              <div key={s.label} className="bg-gray-900/60 border border-gray-800 rounded-2xl p-4 text-center backdrop-blur-sm">
                <div className="flex justify-center mb-2 text-cyan-400">{s.icon}</div>
                <div className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">{s.value}</div>
                <div className="text-gray-500 text-xs mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-950 to-transparent pointer-events-none" />
      </section>

      {/* ── HOW IT WORKS ──────────────────────────────────────────────────── */}
      <section className="px-4 py-20 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 bg-blue-950/60 border border-blue-800/50 text-blue-400 text-xs px-4 py-1.5 rounded-full mb-4">
              <Play className="w-3 h-3" /> How it works
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">From idea to sourced in 30 seconds</h2>
            <p className="text-gray-400 max-w-xl mx-auto">No more hours of research. COTsify does the heavy lifting.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {HOW_IT_WORKS.map((item, i) => (
              <div key={item.step} className="relative">
                {i < HOW_IT_WORKS.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-full w-full h-px bg-gradient-to-r from-cyan-800/50 to-transparent z-0" />
                )}
                <div className="relative bg-gray-900/60 border border-gray-800 hover:border-cyan-800/50 rounded-2xl p-6 text-center transition-all hover:-translate-y-1 group">
                  <div className="text-4xl mb-4">{item.icon}</div>
                  <div className="text-xs font-bold text-cyan-500 tracking-widest mb-2">{item.step}</div>
                  <h3 className="text-white font-semibold mb-2 group-hover:text-cyan-300 transition-colors">{item.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ──────────────────────────────────────────────────────── */}
      <section className="px-4 py-20 relative z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_50%,rgba(6,182,212,0.04),transparent)] pointer-events-none" />
        <div className="max-w-6xl mx-auto relative">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 bg-purple-950/60 border border-purple-800/50 text-purple-400 text-xs px-4 py-1.5 rounded-full mb-4">
              <Star className="w-3 h-3" /> Features
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Everything you need to build</h2>
            <p className="text-gray-400 max-w-xl mx-auto">A complete toolkit for students, makers, and engineers.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map(f => (
              <div key={f.title} className="group bg-gray-900/60 border border-gray-800 hover:border-gray-600 rounded-2xl p-6 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-black/20">
                <div className={`p-3 bg-gradient-to-br ${f.color} rounded-2xl w-fit mb-5 shadow-lg group-hover:scale-110 transition-transform`}>
                  <div className="text-white">{f.icon}</div>
                </div>
                <h3 className="text-white font-bold text-lg mb-2 group-hover:text-cyan-300 transition-colors">{f.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-4">{f.desc}</p>
                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                  <CheckCircle className="w-3.5 h-3.5 text-cyan-500" />
                  {f.detail}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── EXAMPLE PROJECTS ──────────────────────────────────────────────── */}
      <section className="px-4 py-16 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">Try these popular projects</h2>
            <p className="text-gray-500 text-sm">Click any project to get an instant component list</p>
          </div>
          <div className="flex flex-wrap gap-3 justify-center">
            {EXAMPLES.map(ex => (
              <Link key={ex} href={`/search?q=${encodeURIComponent(ex)}`}
                className="group flex items-center gap-2 bg-gray-900/60 hover:bg-gray-800 border border-gray-800 hover:border-cyan-700 text-gray-300 hover:text-cyan-300 px-4 py-2.5 rounded-full transition-all text-sm backdrop-blur-sm">
                {ex}
                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ──────────────────────────────────────────────────── */}
      <section className="px-4 py-20 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-amber-950/60 border border-amber-800/50 text-amber-400 text-xs px-4 py-1.5 rounded-full mb-4">
              <Users className="w-3 h-3" /> Testimonials
            </div>
            <h2 className="text-3xl font-bold text-white mb-3">Loved by students & makers</h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-6">
            {TESTIMONIALS.map(t => (
              <div key={t.name} className="bg-gray-900/60 border border-gray-800 rounded-2xl p-6 hover:border-gray-600 transition-all">
                <div className="flex items-center gap-1 mb-4">
                  {[1,2,3,4,5].map(i => <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />)}
                </div>
                <p className="text-gray-300 text-sm leading-relaxed mb-5 italic">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-gray-950 font-bold text-sm">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-white text-sm font-semibold">{t.name}</p>
                    <p className="text-gray-500 text-xs">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────────────── */}
      <section className="px-4 py-24 text-center relative z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_60%_at_50%_50%,rgba(6,182,212,0.08),transparent)] pointer-events-none" />
        <div className="relative max-w-2xl mx-auto">
          <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-cyan-500/30">
            <Globe className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">Ready to build?</h2>
          <p className="text-gray-400 text-lg mb-10">Join thousands of students and engineers who source smarter with COTsify.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/search" className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold px-10 py-4 rounded-full transition-all shadow-lg shadow-cyan-500/25 hover:scale-105">
              Start for free <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/explore" className="inline-flex items-center justify-center gap-2 bg-gray-900/80 hover:bg-gray-800 text-white px-10 py-4 rounded-full transition-all border border-gray-700 hover:border-cyan-700">
              <Compass className="w-4 h-4" /> Browse projects
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-gray-900 px-4 py-10">
        <div className="max-w-6xl mx-auto">
          <div className="grid sm:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 font-bold text-lg mb-3">
                <Cpu className="w-5 h-5 text-cyan-400" />
                <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">COTsify</span>
              </div>
              <p className="text-gray-500 text-sm leading-relaxed">Smart component sourcing for engineers and makers.</p>
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm mb-3">Features</h4>
              <div className="flex flex-col gap-2 text-sm text-gray-500">
                {["AI Analysis","Price Compare","Store Finder","AI Chat"].map(l => <span key={l}>{l}</span>)}
              </div>
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm mb-3">Pages</h4>
              <div className="flex flex-col gap-2 text-sm">
                {[["Search","/search"],["Explore","/explore"],["Catalog","/catalog"],["Dashboard","/dashboard"]].map(([l,h]) => (
                  <Link key={l} href={h} className="text-gray-500 hover:text-cyan-400 transition-colors">{l}</Link>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm mb-3">Tech Stack</h4>
              <div className="flex flex-col gap-2 text-sm text-gray-500">
                {["Next.js 16","FastAPI","Supabase","GPT-4o-mini"].map(l => <span key={l}>{l}</span>)}
              </div>
            </div>
          </div>
          <div className="border-t border-gray-900 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-gray-600 text-sm">© 2025 COTsify. Built for engineers.</p>
            <p className="text-gray-600 text-sm">Made with ❤️ in India</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
