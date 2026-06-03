"use client";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { getProjects, SavedProject } from "@/lib/local-storage";
import RouteGuard from "@/components/RouteGuard";
import {
  User, Mail, Calendar, Cpu, Code, Bookmark, FolderOpen,
  TrendingUp, Clock, Search, ChevronRight, Edit3, Check,
  X, Loader2, Shield, LogOut, Award, Zap, Star,
  Target, Trophy, Download, Share2, CheckCircle2, Copy,
  BookOpen, Lightbulb, BarChart3, GraduationCap, Flame,
  Activity, Package, Globe, Layers, Lock, Unlock,
  Sparkles, CircuitBoard, Wifi, Brain, Home, Leaf,
  Map, Timer, StickyNote, Bot,
} from "lucide-react";

export default function ProfilePage() {
  return <RouteGuard><ProfileContent /></RouteGuard>;
}

// ── XP & Streak helpers ────────────────────────────────────────────────────
const XP_KEY = "cotsify_xp_log";
const STREAK_KEY = "cotsify_streak";

function getXP(): number {
  if (typeof window === "undefined") return 0;
  try { return JSON.parse(localStorage.getItem(XP_KEY) || "0"); } catch { return 0; }
}
function addXP(amount: number) {
  const cur = getXP();
  localStorage.setItem(XP_KEY, JSON.stringify(cur + amount));
}
function getStreak(): { days: number; lastDate: string } {
  if (typeof window === "undefined") return { days: 0, lastDate: "" };
  try { return JSON.parse(localStorage.getItem(STREAK_KEY) || '{"days":0,"lastDate":""}'); } catch { return { days: 0, lastDate: "" }; }
}

function xpToLevel(xp: number): { level: number; title: string; next: number; color: string } {
  const levels = [
    { xp: 0,    title: "Rookie",        color: "from-gray-500 to-gray-600" },
    { xp: 100,  title: "Tinkerer",      color: "from-green-500 to-emerald-600" },
    { xp: 300,  title: "Builder",       color: "from-cyan-500 to-blue-600" },
    { xp: 600,  title: "Engineer",      color: "from-blue-500 to-indigo-600" },
    { xp: 1000, title: "Hacker",        color: "from-purple-500 to-violet-600" },
    { xp: 1500, title: "Innovator",     color: "from-pink-500 to-rose-600" },
    { xp: 2200, title: "Expert",        color: "from-orange-500 to-amber-600" },
    { xp: 3000, title: "Master",        color: "from-yellow-500 to-amber-500" },
    { xp: 5000, title: "Grand Master",  color: "from-red-500 to-orange-600" },
  ];
  let current = levels[0];
  let nextXP = levels[1].xp;
  for (let i = 0; i < levels.length; i++) {
    if (xp >= levels[i].xp) {
      current = levels[i];
      nextXP = i < levels.length - 1 ? levels[i + 1].xp : levels[i].xp + 1000;
    }
  }
  return { level: levels.indexOf(current) + 1, title: current.title, next: nextXP, color: current.color };
}

// ── Badge definitions (50 badges) ─────────────────────────────────────────
function getAllBadges(projects: SavedProject[], totalHW: number, totalSW: number, totalBM: number, xp: number, streak: number) {
  const completed   = projects.filter(p => p.status === "completed").length;
  const inProgress  = projects.filter(p => p.status === "in_progress").length;
  const withNotes   = projects.filter(p => p.notes && p.notes.trim()).length;
  const hasIoT      = projects.some(p => /iot|esp|wifi|mqtt|nodemcu/i.test(p.project_title));
  const hasRobot    = projects.some(p => /robot|servo|motor|chassis|arm|manipulator/i.test(p.project_title));
  const hasAI       = projects.some(p => /ai|smart|ml|vision|detection|recognition|neural/i.test(p.project_title));
  const hasHome     = projects.some(p => /home|automation|smart home|appliance/i.test(p.project_title));
  const hasSecurity = projects.some(p => /security|lock|rfid|surveillance|alarm|camera/i.test(p.project_title));
  const hasEnv      = projects.some(p => /weather|environment|plant|garden|irrigation|solar/i.test(p.project_title));
  const hasHealth   = projects.some(p => /health|pulse|heart|medical|monitor|fitness/i.test(p.project_title));
  const hasVehicle  = projects.some(p => /car|vehicle|drone|autonomous|self.driv|robot car/i.test(p.project_title));
  const hasAudio    = projects.some(p => /audio|music|sound|speaker|amplif/i.test(p.project_title));
  const hasDisplay  = projects.some(p => /display|led|oled|lcd|screen|matrix/i.test(p.project_title));
  const hasBluetooth= projects.some(p => /bluetooth|hc-05|ble|wireless/i.test(p.project_title));
  const hasGPS      = projects.some(p => /gps|location|track|navigation/i.test(p.project_title));
  const hasSolar    = projects.some(p => /solar|renewable|energy/i.test(p.project_title));
  const categories  = new Set([
    hasIoT && "IoT", hasRobot && "Robot", hasAI && "AI",
    hasHome && "Home", hasSecurity && "Security", hasEnv && "Env",
  ].filter(Boolean)).size;

  const b = (icon: string, label: string, desc: string, earned: boolean, color: string, xpR: number, rarity: "Common"|"Rare"|"Epic"|"Legendary") =>
    ({ icon, label, desc, earned, color, xpReward: xpR, rarity });

  return [
    // ── 🟢 Common — First Steps ────────────────────────────────────────
    b("🚀","First Step",       "Save your first project",            projects.length >= 1,   "from-cyan-500 to-blue-600",      50,  "Common"),
    b("🔍","Researcher",       "Analyze 3 different projects",       projects.length >= 3,   "from-gray-500 to-slate-600",     30,  "Common"),
    b("📝","Note Taker",       "Add notes to a project",             withNotes >= 1,         "from-green-500 to-teal-600",     30,  "Common"),
    b("🔖","Bookworm",         "Bookmark 5 components",              totalBM >= 5,           "from-amber-500 to-orange-600",   40,  "Common"),
    b("📋","Planner",          "Have 3 planned projects",            projects.filter(p => (p.status||"planning")==="planning").length >= 3, "from-slate-500 to-gray-600", 30, "Common"),
    b("💡","Curious Mind",     "Analyze 5 projects",                 projects.length >= 5,   "from-yellow-400 to-amber-500",   50,  "Common"),
    b("⚡","Power Builder",    "Save 5 projects",                    projects.length >= 5,   "from-yellow-500 to-amber-600",   100, "Common"),
    b("✅","First Win",        "Complete your first project",        completed >= 1,         "from-green-500 to-emerald-600",  75,  "Common"),
    b("🧪","Experimenter",     "Track 10 hardware components",       totalHW >= 10,          "from-orange-400 to-red-500",     60,  "Common"),
    b("💾","Code Lover",       "Track 5 software tools",             totalSW >= 5,           "from-violet-400 to-purple-500",  40,  "Common"),
    b("📡","Wireless Wonder",  "Build a Bluetooth/WiFi project",     hasBluetooth,           "from-sky-400 to-blue-500",       60,  "Common"),
    b("🖥️","Display Wizard",   "Build a display project",            hasDisplay,             "from-purple-400 to-violet-500",  60,  "Common"),

    // ── 🔵 Rare — Builder ─────────────────────────────────────────────
    b("🏗️","Architect",        "Save 10 projects",                   projects.length >= 10,  "from-purple-500 to-pink-600",    200, "Rare"),
    b("🎯","On Target",        "Complete 3 projects",                completed >= 3,         "from-teal-500 to-cyan-600",      150, "Rare"),
    b("⚙️","Hardware Guru",    "Track 50 hardware components",       totalHW >= 50,          "from-red-500 to-pink-600",       150, "Rare"),
    b("💾","Coder",            "Track 20 software tools",            totalSW >= 20,          "from-violet-500 to-purple-600",  80,  "Rare"),
    b("🔖","Collector",        "Bookmark 20 components",             totalBM >= 20,          "from-amber-500 to-yellow-600",   80,  "Rare"),
    b("📝","Journalist",       "Add notes to 5 projects",            withNotes >= 5,         "from-green-400 to-emerald-600",  80,  "Rare"),
    b("📡","IoT Engineer",     "Build an IoT project",               hasIoT,                 "from-teal-500 to-cyan-600",      100, "Rare"),
    b("🤖","Robotics Dev",     "Build a robotics project",           hasRobot,               "from-blue-500 to-indigo-600",    100, "Rare"),
    b("🧠","AI Builder",       "Build an AI/ML project",             hasAI,                  "from-violet-500 to-purple-600",  120, "Rare"),
    b("🏠","Home Automator",   "Build a home automation project",    hasHome,                "from-green-500 to-emerald-600",  100, "Rare"),
    b("🔒","Security Expert",  "Build a security project",           hasSecurity,            "from-red-500 to-rose-600",       100, "Rare"),
    b("🌿","Eco Engineer",     "Build an environmental project",     hasEnv,                 "from-green-400 to-teal-600",     100, "Rare"),
    b("🎵","Audio Hacker",     "Build an audio project",             hasAudio,               "from-pink-400 to-rose-500",      100, "Rare"),
    b("🗺️","Navigator",        "Build a GPS/tracking project",       hasGPS,                 "from-blue-400 to-sky-500",       100, "Rare"),
    b("⚡","Speed Builder",    "Have 3 projects in progress",        inProgress >= 3,        "from-yellow-400 to-orange-500",  150, "Rare"),
    b("🔥","On Fire",          "3+ day study streak",                streak >= 3,            "from-orange-500 to-red-600",     200, "Rare"),
    b("⭐","XP Hunter",        "Earn 500 XP",                        xp >= 500,              "from-yellow-500 to-amber-600",   0,   "Rare"),
    b("🌍","Multi-Domain",     "Work in 3+ categories",              categories >= 3,        "from-teal-500 to-blue-600",      200, "Rare"),

    // ── 🟣 Epic — Advanced ────────────────────────────────────────────
    b("🌟","Prolific",         "Save 20 projects",                   projects.length >= 20,  "from-rose-500 to-red-600",       400, "Epic"),
    b("🏆","Champion",         "Complete 10 projects",               completed >= 10,        "from-yellow-400 to-amber-500",   300, "Epic"),
    b("🛠️","Hardware Master",  "Track 100+ components",              totalHW >= 100,         "from-pink-500 to-rose-600",      300, "Epic"),
    b("❤️","Health Tech",      "Build a health monitoring project",  hasHealth,              "from-pink-500 to-rose-600",      120, "Epic"),
    b("🚗","Auto Pioneer",     "Build an autonomous vehicle",        hasVehicle,             "from-blue-400 to-cyan-600",      150, "Epic"),
    b("☀️","Solar Pioneer",    "Build a solar/energy project",       hasSolar,               "from-yellow-400 to-orange-500",  150, "Epic"),
    b("🌈","All-Rounder",      "Build in 5 different categories",    categories >= 5,        "from-pink-500 to-violet-600",    300, "Epic"),
    b("🔥","Blazing Streak",   "7+ day streak",                      streak >= 7,            "from-red-500 to-orange-600",     400, "Epic"),
    b("💎","XP Legend",        "Earn 1000 XP",                       xp >= 1000,             "from-cyan-400 to-violet-600",    0,   "Epic"),
    b("🎓","Scholar",          "Complete all skill areas",           [hasIoT,hasRobot,hasAI,hasHome,hasSecurity].filter(Boolean).length >= 4, "from-purple-500 to-indigo-600", 300, "Epic"),
    b("📚","Encyclopedia",     "Track 200+ components total",        (totalHW + totalSW) >= 200, "from-indigo-500 to-blue-600", 400, "Epic"),

    // ── 🟡 Legendary — Mastery ────────────────────────────────────────
    b("👑","Hall of Fame",     "Complete 25 projects",               completed >= 25,        "from-yellow-500 to-orange-500",  750, "Legendary"),
    b("💎","Legend Builder",   "Save 50 projects",                   projects.length >= 50,  "from-cyan-400 to-violet-600",   1000, "Legendary"),
    b("🌠","Grandmaster",      "Reach level 8 (3000 XP)",            xp >= 3000,             "from-amber-400 to-yellow-500",  500, "Legendary"),
    b("🔱","COTsify Master",   "Earn 30+ badges",                    earnedCount(projects, totalHW, totalSW, totalBM, xp, streak) >= 30, "from-red-500 to-violet-600", 1000, "Legendary"),
    b("🚀","Universe Builder", "100+ hardware across all projects",  totalHW >= 100,         "from-violet-500 to-blue-600",   800, "Legendary"),
    b("🌍","Global Maker",     "Share your profile 3 times",         false,                  "from-blue-500 to-teal-600",     300, "Legendary"),
    b("⚗️","Mad Scientist",    "Build projects in all 6 categories", categories >= 6,        "from-green-400 to-violet-600",  500, "Legendary"),
    b("🎆","Grand Finale",     "Complete 50 projects",               completed >= 50,        "from-yellow-400 to-red-600",   2000, "Legendary"),
  ];
}

// Helper to count earned badges without circular ref
function earnedCount(projects: SavedProject[], totalHW: number, totalSW: number, totalBM: number, xp: number, streak: number): number {
  const completed  = projects.filter(p => p.status === "completed").length;
  const hasIoT     = projects.some(p => /iot|esp|wifi/i.test(p.project_title));
  const hasRobot   = projects.some(p => /robot/i.test(p.project_title));
  const hasAI      = projects.some(p => /ai|smart|ml/i.test(p.project_title));
  const hasHome    = projects.some(p => /home|automation/i.test(p.project_title));
  const hasSecurity= projects.some(p => /security|lock|rfid/i.test(p.project_title));
  const withNotes  = projects.filter(p => p.notes && p.notes.trim()).length;
  return [
    projects.length>=1, projects.length>=3, withNotes>=1, totalBM>=5,
    projects.filter(p=>(p.status||"planning")==="planning").length>=3,
    projects.length>=5, completed>=1, totalHW>=10, totalSW>=5,
    projects.length>=10, completed>=3, totalHW>=50, hasIoT, hasRobot, hasAI,
    hasHome, hasSecurity, xp>=500, projects.length>=20, completed>=10,
  ].filter(Boolean).length;
}

function useCountUp(target: number, duration = 1200) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (target === 0) { setVal(0); return; }
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setVal(target); clearInterval(timer); }
      else setVal(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);
  return val;
}

function StatCard({ label, value, color, icon }: { label: string; value: number; color: string; icon: React.ReactNode }) {
  const count = useCountUp(value);
  return (
    <div className="relative overflow-hidden bg-gray-900/80 border border-gray-800 rounded-2xl p-4 text-center group hover:scale-105 transition-all cursor-default">
      <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-10 transition-opacity rounded-2xl`} />
      <div className={`text-2xl font-bold bg-gradient-to-r ${color} bg-clip-text text-transparent`}>{count}</div>
      <div className="text-gray-500 text-xs mt-1 flex items-center justify-center gap-1">{icon}{label}</div>
    </div>
  );
}

function SkillBar({ label, value, color }: { label: string; value: number; color: string }) {
  const [width, setWidth] = useState(0);
  useEffect(() => { setTimeout(() => setWidth(value), 300); }, [value]);
  return (
    <div className="mb-3">
      <div className="flex justify-between text-xs mb-1.5">
        <span className="text-gray-300 font-medium">{label}</span>
        <span className="text-gray-500">{value}%</span>
      </div>
      <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
        <div className={`h-full bg-gradient-to-r ${color} rounded-full transition-all duration-1000 ease-out`} style={{ width: `${width}%` }} />
      </div>
    </div>
  );
}

function ActivityHeatmap({ projects }: { projects: SavedProject[] }) {
  const days = 84;
  const cells = Array.from({ length: days }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (days - 1 - i));
    const dateStr = date.toISOString().split("T")[0];
    const activity = projects.filter(p => p.created_at?.startsWith(dateStr)).length;
    return { date: dateStr, activity };
  });
  const weeks = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
  const getColor = (n: number) => n === 0 ? "bg-gray-800" : n === 1 ? "bg-cyan-900" : n === 2 ? "bg-cyan-700" : "bg-cyan-500";
  return (
    <div>
      <div className="flex gap-1">
        {weeks.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-1">
            {week.map((day, di) => (
              <div key={di} title={`${day.date}: ${day.activity} projects`}
                className={`w-3 h-3 rounded-sm ${getColor(day.activity)} transition-colors hover:ring-1 hover:ring-cyan-400`} />
            ))}
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2 mt-2 text-xs text-gray-600">
        <span>Less</span>
        {["bg-gray-800","bg-cyan-900","bg-cyan-700","bg-cyan-500"].map(c => <div key={c} className={`w-3 h-3 rounded-sm ${c}`} />)}
        <span>More</span>
      </div>
    </div>
  );
}

const RARITY_STYLES: Record<string, string> = {
  Common:    "border-gray-700 bg-gray-800/40",
  Rare:      "border-blue-800/60 bg-blue-950/30",
  Epic:      "border-purple-700/60 bg-purple-950/30",
  Legendary: "border-amber-600/60 bg-amber-950/30",
};
const RARITY_TEXT: Record<string, string> = {
  Common:    "text-gray-500",
  Rare:      "text-blue-400",
  Epic:      "text-purple-400",
  Legendary: "text-amber-400",
};

function ProfileContent() {
  const { user, updateProfile, signOut } = useAuth();
  const [projects, setProjects] = useState<SavedProject[]>([]);
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview"|"badges"|"skills"|"learn">("overview");
  const [copied, setCopied] = useState(false);
  const [rarityFilter, setRarityFilter] = useState<"All"|"Common"|"Rare"|"Epic"|"Legendary">("All");
  const [showEarned, setShowEarned] = useState<"all"|"earned"|"locked">("all");
  const [xp, setXp] = useState(0);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    const p = getProjects();
    setProjects(p);
    // Award XP based on projects
    const storedXP = getXP();
    const earnedXP = p.length * 50 + p.filter(x => x.status === "completed").length * 75;
    if (earnedXP > storedXP) localStorage.setItem(XP_KEY, JSON.stringify(earnedXP));
    setXp(Math.max(storedXP, earnedXP));
    // Streak
    const s = getStreak();
    const today = new Date().toISOString().split("T")[0];
    if (s.lastDate === today) { setStreak(s.days); }
    else if (p.length > 0) {
      const newStreak = { days: s.days + 1, lastDate: today };
      localStorage.setItem(STREAK_KEY, JSON.stringify(newStreak));
      setStreak(newStreak.days);
    }
  }, []);
  useEffect(() => { if (user) setEditName(user.full_name || ""); }, [user]);

  const displayName = user?.full_name || user?.email?.split("@")[0] || "Engineer";
  const totalHW = projects.reduce((s, p) => s + (p.analysis?.hardware?.length || 0), 0);
  const totalSW = projects.reduce((s, p) => s + (p.analysis?.software?.length || 0), 0);
  const totalBM = projects.reduce((s, p) => s + (p.bookmarked_components?.length || 0), 0);
  const completed = projects.filter(p => p.status === "completed").length;

  const allBadges = getAllBadges(projects, totalHW, totalSW, totalBM, xp, streak);
  const earnedBadges = allBadges.filter(b => b.earned).length;
  const xpInfo = xpToLevel(xp);
  const xpPct = Math.min(100, Math.round(((xp - (xpInfo.level === 1 ? 0 : [0,100,300,600,1000,1500,2200,3000,5000][xpInfo.level-1])) / (xpInfo.next - [0,100,300,600,1000,1500,2200,3000,5000][xpInfo.level-1])) * 100));

  const filteredBadges = allBadges.filter(b => {
    if (rarityFilter !== "All" && b.rarity !== rarityFilter) return false;
    if (showEarned === "earned" && !b.earned) return false;
    if (showEarned === "locked" && b.earned) return false;
    return true;
  });

  const skills = [
    { label: "Arduino / Embedded", value: Math.min(100, totalHW * 8), color: "from-cyan-500 to-blue-600" },
    { label: "IoT & Networking", value: Math.min(100, projects.filter(p => /iot|esp|wifi/i.test(p.project_title)).length * 25), color: "from-teal-500 to-cyan-600" },
    { label: "Robotics", value: Math.min(100, projects.filter(p => /robot/i.test(p.project_title)).length * 30), color: "from-purple-500 to-pink-600" },
    { label: "AI / ML", value: Math.min(100, projects.filter(p => /ai|smart|ml/i.test(p.project_title)).length * 30), color: "from-orange-500 to-red-600" },
    { label: "Software Tools", value: Math.min(100, totalSW * 6), color: "from-green-500 to-emerald-600" },
    { label: "Research & Notes", value: Math.min(100, projects.filter(p => p.notes).length * 20), color: "from-amber-500 to-orange-600" },
  ];

  const handleSave = async () => {
    setSaving(true);
    const result = await updateProfile({ full_name: editName.trim() || undefined });
    if (!result.error) { setSaveSuccess(true); setEditing(false); setTimeout(() => setSaveSuccess(false), 3000); }
    setSaving(false);
  };

  const handleShare = () => {
    const text = [`👤 ${displayName} on COTsify`, `⚡ Level ${xpInfo.level} ${xpInfo.title} | ${xp} XP`, `📊 ${projects.length} projects | ${totalHW} hardware components`, `🏆 ${earnedBadges}/${allBadges.length} badges earned`, `🔗 https://cotsify.vercel.app`].join("\n");
    navigator.clipboard.writeText(text).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); });
  };

  const handleExport = () => {
    const lines = [`# COTsify Profile — ${displayName}`, `Level: ${xpInfo.title} (${xp} XP) | Projects: ${projects.length} | Badges: ${earnedBadges}/${allBadges.length}`, "", "## Earned Badges", ...allBadges.filter(b => b.earned).map(b => `- ${b.icon} ${b.label}: ${b.desc}`), "", "## Projects", ...projects.map(p => `- ${p.project_title} [${p.status || "planning"}]`)];
    const blob = new Blob([lines.join("\n")], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "COTsify_Profile.txt"; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* ── Hero Banner ──────────────────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-3xl mb-6 bg-gradient-to-br from-violet-950 via-gray-900 to-cyan-950 border border-gray-800">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(139,92,246,0.3),transparent)] pointer-events-none" />
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "linear-gradient(rgba(139,92,246,1) 1px,transparent 1px),linear-gradient(90deg,rgba(139,92,246,1) 1px,transparent 1px)", backgroundSize: "40px 40px" }} />
        <div className="relative px-6 py-10 text-center">
          {/* Avatar */}
          <div className="relative inline-block mb-4">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-violet-400 to-cyan-500 flex items-center justify-center text-gray-950 text-4xl font-bold shadow-2xl shadow-violet-500/40 ring-4 ring-violet-500/30">
              {user?.avatar_url ? <img src={user.avatar_url} alt={displayName} className="w-full h-full rounded-full object-cover" /> : displayName[0]?.toUpperCase()}
            </div>
            <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full flex items-center justify-center text-xs font-bold text-gray-950 shadow-lg border-2 border-gray-950">
              {earnedBadges}
            </div>
          </div>
          {/* Name */}
          {editing ? (
            <div className="flex items-center justify-center gap-2 mb-2">
              <input value={editName} onChange={e => setEditName(e.target.value)} maxLength={50}
                className="bg-gray-800/80 border border-violet-600 rounded-xl px-4 py-2 text-white text-lg font-bold text-center focus:outline-none" />
              <button onClick={handleSave} disabled={saving} className="p-2 bg-violet-500 hover:bg-violet-400 text-white rounded-xl">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
              </button>
              <button onClick={() => setEditing(false)} className="p-2 bg-gray-700 text-gray-300 rounded-xl"><X className="w-4 h-4" /></button>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2 mb-1">
              <h1 className="text-2xl font-bold text-white">{displayName}</h1>
              <button onClick={() => setEditing(true)} className="p-1.5 text-gray-500 hover:text-violet-400 transition-colors"><Edit3 className="w-4 h-4" /></button>
            </div>
          )}
          {saveSuccess && <p className="text-green-400 text-xs mb-1 flex items-center justify-center gap-1"><Check className="w-3 h-3" /> Updated!</p>}
          <p className="text-gray-400 text-sm mb-3">{user?.email}</p>

          {/* Level + XP */}
          <div className="flex items-center justify-center gap-3 mb-4 flex-wrap">
            <span className={`text-sm font-bold px-4 py-1.5 rounded-full bg-gradient-to-r ${xpInfo.color} text-white shadow-lg`}>
              Lv.{xpInfo.level} {xpInfo.title}
            </span>
            <span className="text-xs bg-yellow-950/60 border border-yellow-800/50 text-yellow-400 px-3 py-1.5 rounded-full flex items-center gap-1">
              <Zap className="w-3 h-3" />{xp} XP
            </span>
            {streak > 0 && (
              <span className="text-xs bg-orange-950/60 border border-orange-800/50 text-orange-400 px-3 py-1.5 rounded-full flex items-center gap-1">
                <Flame className="w-3 h-3" />{streak} day streak
              </span>
            )}
            <span className="text-xs text-gray-500 bg-gray-800/60 border border-gray-700 px-3 py-1.5 rounded-full">
              {user?.provider === "supabase" ? "🔐 Supabase Auth" : "👤 Guest"}
            </span>
          </div>

          {/* XP Progress bar */}
          <div className="max-w-xs mx-auto mb-5">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>{xp} XP</span>
              <span>{xpInfo.next} XP to next level</span>
            </div>
            <div className="h-2.5 bg-gray-800/60 rounded-full overflow-hidden">
              <div className={`h-full bg-gradient-to-r ${xpInfo.color} rounded-full transition-all duration-1000`} style={{ width: `${xpPct}%` }} />
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex justify-center gap-2 flex-wrap">
            <button onClick={handleShare} className="flex items-center gap-1.5 text-xs bg-violet-950/60 hover:bg-violet-900/60 border border-violet-800/50 text-violet-300 px-4 py-2 rounded-xl transition-all">
              {copied ? <Check className="w-3.5 h-3.5" /> : <Share2 className="w-3.5 h-3.5" />} {copied ? "Copied!" : "Share"}
            </button>
            <button onClick={handleExport} className="flex items-center gap-1.5 text-xs bg-gray-800/60 hover:bg-gray-700/60 border border-gray-700 text-gray-300 px-4 py-2 rounded-xl transition-all">
              <Download className="w-3.5 h-3.5" /> Export
            </button>
            <button onClick={signOut} className="flex items-center gap-1.5 text-xs bg-red-950/60 hover:bg-red-900/60 border border-red-800/50 text-red-400 px-4 py-2 rounded-xl transition-all">
              <LogOut className="w-3.5 h-3.5" /> Sign out
            </button>
          </div>
        </div>
      </div>

      {/* ── Stats Row ──────────────────────────────────────────────────── */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 mb-6">
        <StatCard label="Projects"  value={projects.length} color="from-violet-500 to-purple-600" icon={<Layers className="w-3 h-3" />} />
        <StatCard label="Completed" value={completed}       color="from-green-500 to-emerald-600" icon={<CheckCircle2 className="w-3 h-3" />} />
        <StatCard label="Hardware"  value={totalHW}         color="from-cyan-500 to-blue-600"     icon={<Cpu className="w-3 h-3" />} />
        <StatCard label="Software"  value={totalSW}         color="from-purple-500 to-pink-600"   icon={<Code className="w-3 h-3" />} />
        <StatCard label="Bookmarks" value={totalBM}         color="from-amber-500 to-orange-600"  icon={<Bookmark className="w-3 h-3" />} />
        <StatCard label="Badges"    value={earnedBadges}    color="from-yellow-500 to-amber-600"  icon={<Trophy className="w-3 h-3" />} />
      </div>

      {/* ── Tabs ──────────────────────────────────────────────────────── */}
      <div className="flex bg-gray-900 border border-gray-800 rounded-xl p-1 gap-1 mb-6 overflow-x-auto">
        {([["overview","Overview",<Activity className="w-3.5 h-3.5" key="a"/>],["badges","Badges",<Award className="w-3.5 h-3.5" key="b"/>],["skills","Skills",<BarChart3 className="w-3.5 h-3.5" key="c"/>],["learn","Learning",<GraduationCap className="w-3.5 h-3.5" key="d"/>]] as const).map(([id, label, icon]) => (
          <button key={id} onClick={() => setActiveTab(id)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${activeTab === id ? "bg-violet-950 text-violet-400 border border-violet-800" : "text-gray-500 hover:text-gray-300"}`}>
            {icon}{label}
            {id === "badges" && earnedBadges > 0 && <span className="text-xs bg-amber-500 text-gray-950 font-bold px-1.5 py-0.5 rounded-full ml-0.5">{earnedBadges}</span>}
          </button>
        ))}
      </div>

      {/* ── OVERVIEW TAB ─────────────────────────────────────────────── */}
      {activeTab === "overview" && (
        <div className="grid lg:grid-cols-2 gap-5">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2"><Activity className="w-4 h-4 text-violet-400" /> Activity (Last 12 Weeks)</h3>
            <ActivityHeatmap projects={projects} />
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold flex items-center gap-2"><FolderOpen className="w-4 h-4 text-violet-400" /> Recent Projects</h3>
              <Link href="/dashboard" className="text-xs text-violet-400 hover:text-violet-300 flex items-center gap-1">All <ChevronRight className="w-3.5 h-3.5" /></Link>
            </div>
            {projects.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 text-sm mb-3">No projects yet</p>
                <Link href="/search" className="inline-flex items-center gap-2 text-sm bg-violet-500 hover:bg-violet-400 text-white font-semibold px-4 py-2 rounded-xl transition-colors">
                  <Search className="w-4 h-4" /> Start a project
                </Link>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {projects.slice(0, 5).map(p => (
                  <Link key={p.id} href={`/search?q=${encodeURIComponent(p.project_title)}`}
                    className="flex items-center justify-between bg-gray-800/50 hover:bg-gray-800 border border-gray-700/50 hover:border-violet-800 rounded-xl px-4 py-3 transition-all group">
                    <div className="min-w-0">
                      <p className="text-white text-sm font-medium truncate">{p.project_title}</p>
                      <div className="flex items-center gap-3 mt-0.5 text-xs text-gray-500">
                        <span className="flex items-center gap-1"><Cpu className="w-3 h-3 text-cyan-500" />{p.analysis?.hardware?.length || 0}</span>
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{new Date(p.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</span>
                        {p.status === "completed" && <span className="text-green-400 flex items-center gap-1"><CheckCircle2 className="w-3 h-3" />Done</span>}
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-violet-400 flex-shrink-0 transition-colors" />
                  </Link>
                ))}
              </div>
            )}
          </div>
          {/* Next badges to unlock */}
          <div className="lg:col-span-2 bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2"><Target className="w-4 h-4 text-amber-400" /> Next Badges to Unlock</h3>
            <div className="grid sm:grid-cols-3 gap-3">
              {allBadges.filter(b => !b.earned).slice(0, 6).map(b => (
                <div key={b.label} className={`flex items-center gap-3 p-3 rounded-xl border ${RARITY_STYLES[b.rarity]} opacity-70`}>
                  <div className="text-2xl">{b.icon}</div>
                  <div className="min-w-0">
                    <p className={`text-xs font-bold ${RARITY_TEXT[b.rarity]}`}>{b.label}</p>
                    <p className="text-gray-500 text-xs truncate">{b.desc}</p>
                    <p className="text-xs text-yellow-500 mt-0.5">+{b.xpReward} XP</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── BADGES TAB ───────────────────────────────────────────────── */}
      {activeTab === "badges" && (
        <div>
          {/* Summary bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
            {(["Common","Rare","Epic","Legendary"] as const).map(r => {
              const total = allBadges.filter(b => b.rarity === r).length;
              const earned = allBadges.filter(b => b.rarity === r && b.earned).length;
              return (
                <div key={r} className={`rounded-2xl p-3 border text-center cursor-pointer transition-all hover:scale-105 ${rarityFilter === r ? RARITY_STYLES[r] + " ring-1 ring-current" : RARITY_STYLES[r]}`}
                  onClick={() => setRarityFilter(rarityFilter === r ? "All" : r)}>
                  <div className={`text-lg font-bold ${RARITY_TEXT[r]}`}>{earned}/{total}</div>
                  <div className={`text-xs font-semibold ${RARITY_TEXT[r]}`}>{r}</div>
                </div>
              );
            })}
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2 mb-5 flex-wrap">
            <div className="flex gap-1 bg-gray-900 border border-gray-800 rounded-xl p-1">
              {(["all","earned","locked"] as const).map(f => (
                <button key={f} onClick={() => setShowEarned(f)}
                  className={`text-xs px-3 py-1.5 rounded-lg transition-colors capitalize ${showEarned === f ? "bg-amber-950 text-amber-400 border border-amber-800" : "text-gray-500 hover:text-gray-300"}`}>
                  {f === "all" ? `All (${allBadges.length})` : f === "earned" ? `Earned (${earnedBadges})` : `Locked (${allBadges.length - earnedBadges})`}
                </button>
              ))}
            </div>
            {rarityFilter !== "All" && (
              <button onClick={() => setRarityFilter("All")} className="text-xs text-gray-500 hover:text-gray-300 flex items-center gap-1 border border-gray-700 px-2 py-1.5 rounded-lg">
                <X className="w-3 h-3" /> Clear filter
              </button>
            )}
            <span className="text-gray-500 text-xs ml-auto">{filteredBadges.length} badges shown</span>
          </div>

          {/* Badge grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {filteredBadges.map((badge, i) => (
              <div key={i} className={`group relative rounded-2xl p-4 border transition-all ${badge.earned ? `${RARITY_STYLES[badge.rarity]} hover:scale-105 hover:border-current` : "bg-gray-800/20 border-gray-800/50 opacity-50 grayscale"}`}>
                {badge.earned && (
                  <div className="absolute top-2 right-2">
                    <CheckCircle2 className="w-4 h-4 text-green-400" />
                  </div>
                )}
                {!badge.earned && (
                  <div className="absolute top-2 right-2">
                    <Lock className="w-3.5 h-3.5 text-gray-600" />
                  </div>
                )}
                <div className="text-3xl mb-2 text-center">{badge.icon}</div>
                <div className={`text-xs font-bold text-center mb-1 ${badge.earned ? RARITY_TEXT[badge.rarity] : "text-gray-600"}`}>{badge.label}</div>
                <div className="text-xs text-gray-500 text-center leading-tight">{badge.desc}</div>
                <div className="flex items-center justify-center gap-1 mt-2">
                  <span className={`text-xs px-1.5 py-0.5 rounded-full border ${RARITY_STYLES[badge.rarity]} ${RARITY_TEXT[badge.rarity]} font-medium`}>{badge.rarity}</span>
                  {badge.xpReward > 0 && <span className="text-xs text-yellow-500">+{badge.xpReward} XP</span>}
                </div>
              </div>
            ))}
          </div>

          {filteredBadges.length === 0 && (
            <div className="text-center py-16 text-gray-500">
              <Award className="w-10 h-10 mx-auto mb-3 opacity-40" />
              <p>No badges match this filter</p>
            </div>
          )}
        </div>
      )}

      {/* ── SKILLS TAB ───────────────────────────────────────────────── */}
      {activeTab === "skills" && (
        <div className="grid sm:grid-cols-2 gap-5">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <h3 className="text-white font-semibold mb-5 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-violet-400" /> Skill Levels
            </h3>
            {skills.map(s => <SkillBar key={s.label} {...s} />)}
            {projects.length === 0 && (
              <p className="text-gray-500 text-sm text-center py-4">Save projects to build your skill profile</p>
            )}
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-amber-400" /> Recommended Next
            </h3>
            {[
              { title: "Smart Irrigation System", reason: "Great IoT starter", icon: "🌱", diff: "Beginner" },
              { title: "Line Following Robot", reason: "Learn robotics basics", icon: "🤖", diff: "Beginner" },
              { title: "Face Recognition Attendance", reason: "Explore AI/ML", icon: "🧠", diff: "Advanced" },
              { title: "Home Automation ESP32", reason: "Level up IoT skills", icon: "🏠", diff: "Intermediate" },
            ]
              .filter(r => !projects.some(p => p.project_title.toLowerCase().includes(r.title.toLowerCase().split(" ")[0])))
              .slice(0, 3)
              .map(r => (
                <Link key={r.title} href={`/search?q=${encodeURIComponent(r.title)}`}
                  className="flex items-center gap-3 bg-gray-800/50 hover:bg-gray-800 border border-gray-700/50 hover:border-violet-800 rounded-xl px-4 py-3 mb-2 transition-all group">
                  <span className="text-2xl">{r.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium">{r.title}</p>
                    <p className="text-gray-500 text-xs">{r.reason}</p>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full border flex-shrink-0 ${
                    r.diff === "Beginner" ? "bg-green-950 text-green-400 border-green-800"
                    : r.diff === "Intermediate" ? "bg-yellow-950 text-yellow-400 border-yellow-800"
                    : "bg-red-950 text-red-400 border-red-800"
                  }`}>{r.diff}</span>
                </Link>
              ))}
          </div>

          {/* Weekly Goals */}
          <div className="lg:col-span-1 bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <Target className="w-4 h-4 text-cyan-400" /> Weekly Goals
            </h3>
            {[
              { label: "Analyze 3 new projects", current: Math.min(3, projects.filter(p => { const d = new Date(p.created_at); const now = new Date(); return (now.getTime() - d.getTime()) < 7*24*60*60*1000; }).length), target: 3, color: "from-cyan-500 to-blue-600" },
              { label: "Complete 1 project", current: Math.min(1, projects.filter(p => p.status === "completed").length), target: 1, color: "from-green-500 to-emerald-600" },
              { label: "Bookmark 3 components", current: Math.min(3, totalBM), target: 3, color: "from-amber-500 to-orange-600" },
              { label: "Add notes to a project", current: Math.min(1, projects.filter(p => p.notes).length), target: 1, color: "from-purple-500 to-violet-600" },
            ].map(g => (
              <div key={g.label} className="mb-4">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-300">{g.label}</span>
                  <span className={`font-bold ${g.current >= g.target ? "text-green-400" : "text-gray-500"}`}>
                    {g.current >= g.target ? "✓ Done" : `${g.current}/${g.target}`}
                  </span>
                </div>
                <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                  <div className={`h-full bg-gradient-to-r ${g.color} rounded-full transition-all duration-700`}
                    style={{ width: `${Math.min(100, (g.current / g.target) * 100)}%` }} />
                </div>
              </div>
            ))}
          </div>

          {/* Engineer Card */}
          <div className="bg-gradient-to-br from-violet-950/60 via-gray-900 to-cyan-950/40 border border-violet-800/40 rounded-2xl p-5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-violet-500/10 to-cyan-500/10 rounded-full -translate-y-8 translate-x-8" />
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <Shield className="w-4 h-4 text-violet-400" /> Engineer Card
            </h3>
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-400 to-cyan-500 flex items-center justify-center text-gray-950 text-2xl font-bold shadow-lg flex-shrink-0">
                {displayName[0]?.toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-bold">{displayName}</p>
                <p className="text-gray-400 text-xs truncate">{user?.email}</p>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full bg-gradient-to-r ${xpInfo.color} text-white`}>Lv.{xpInfo.level} {xpInfo.title}</span>
                  <span className="text-xs bg-amber-950/60 text-amber-400 border border-amber-800/50 px-2 py-1 rounded-full">{earnedBadges} badges</span>
                  <span className="text-xs bg-cyan-950/60 text-cyan-400 border border-cyan-800/50 px-2 py-1 rounded-full">{projects.length} projects</span>
                </div>
              </div>
            </div>
            <button onClick={handleShare}
              className="mt-4 w-full flex items-center justify-center gap-2 text-xs bg-violet-950/60 hover:bg-violet-900/60 border border-violet-800/50 text-violet-300 py-2 rounded-xl transition-all">
              {copied ? <Check className="w-3.5 h-3.5" /> : <Share2 className="w-3.5 h-3.5" />}
              {copied ? "Copied to clipboard!" : "Share Engineer Card"}
            </button>
          </div>
        </div>
      )}

      {/* ── LEARNING TAB ─────────────────────────────────────────────── */}
      {activeTab === "learn" && (
        <div className="bg-gradient-to-br from-violet-950/40 to-cyan-950/40 border border-violet-800/30 rounded-2xl p-6 text-center">
          <GraduationCap className="w-12 h-12 text-violet-400 mx-auto mb-4" />
          <h3 className="text-white font-bold text-xl mb-2">Free Learning Paths</h3>
          <p className="text-gray-400 text-sm mb-6 max-w-md mx-auto">
            25+ free courses from Coursera, edX, NPTEL, and YouTube. Get certified in Electronics, IoT, Robotics, AI/ML and more.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            {[["Electronics","⚡"],["IoT","📡"],["Robotics","🤖"],["AI/ML","🧠"]].map(([cat, icon]) => (
              <Link key={cat} href="/learn"
                className="bg-gray-900/60 border border-gray-800 hover:border-violet-700 rounded-xl p-3 text-center transition-all hover:-translate-y-0.5">
                <div className="text-2xl mb-1">{icon}</div>
                <div className="text-white text-xs font-medium">{cat}</div>
                <div className="text-gray-500 text-xs">Free courses</div>
              </Link>
            ))}
          </div>
          <div className="grid sm:grid-cols-3 gap-3 mb-6 text-left">
            {[
              { label: "Flashcards", desc: "20 Q&A electronics cards", icon: "🃏", href: "/learn" },
              { label: "Study Timer", desc: "Pomodoro focus sessions", icon: "⏱️", href: "/learn" },
              { label: "Roadmaps", desc: "IoT · Robotics · AI/ML paths", icon: "🗺️", href: "/learn" },
            ].map(f => (
              <Link key={f.label} href={f.href}
                className="flex items-center gap-3 bg-gray-900/60 border border-gray-800 hover:border-violet-700 rounded-xl p-3 transition-all">
                <span className="text-2xl">{f.icon}</span>
                <div>
                  <p className="text-white text-sm font-medium">{f.label}</p>
                  <p className="text-gray-500 text-xs">{f.desc}</p>
                </div>
              </Link>
            ))}
          </div>
          <Link href="/learn"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-400 hover:to-purple-500 text-white font-semibold px-8 py-3 rounded-full transition-all shadow-lg shadow-violet-500/25 hover:scale-105">
            <GraduationCap className="w-4 h-4" /> Browse All Courses & Tools
          </Link>
        </div>
      )}

    </div>
  );
}
