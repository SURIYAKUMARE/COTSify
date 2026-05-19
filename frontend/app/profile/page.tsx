"use client";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { getProjects, SavedProject } from "@/lib/local-storage";
import RouteGuard from "@/components/RouteGuard";
import {
  User, Mail, Calendar, Cpu, Code, Bookmark, FolderOpen,
  TrendingUp, Clock, Search, ChevronRight, Edit3, Check,
  X, Camera, Loader2, Shield, LogOut, Award, Zap, Star,
  Target, Trophy, Download, Share2, CheckCircle2, Copy,
  BookOpen, Lightbulb, BarChart3, GraduationCap, Flame,
  Activity, Package, Globe, Layers,
} from "lucide-react";

export default function ProfilePage() {
  return <RouteGuard><ProfileContent /></RouteGuard>;
}

function useCountUp(target: number, duration = 1200) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (target === 0) return;
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

function getBadges(projects: SavedProject[]) {
  const hw = projects.reduce((s, p) => s + (p.analysis?.hardware?.length || 0), 0);
  const completed = projects.filter(p => p.status === "completed").length;
  const hasIoT = projects.some(p => /iot|esp|wifi/i.test(p.project_title));
  const hasRobot = projects.some(p => /robot/i.test(p.project_title));
  const hasAI = projects.some(p => /ai|smart|ml/i.test(p.project_title));
  const badges = [];
  if (projects.length >= 1) badges.push({ icon: "🚀", label: "First Project", desc: "Saved first project", earned: true, color: "from-cyan-500 to-blue-600" });
  if (projects.length >= 5) badges.push({ icon: "⚡", label: "Power Builder", desc: "5+ projects", earned: true, color: "from-yellow-500 to-amber-600" });
  if (projects.length >= 10) badges.push({ icon: "🏆", label: "Project Master", desc: "10+ projects", earned: true, color: "from-purple-500 to-pink-600" });
  if (hw >= 20) badges.push({ icon: "🔧", label: "Hardware Guru", desc: "20+ components", earned: true, color: "from-orange-500 to-red-600" });
  if (completed >= 3) badges.push({ icon: "✅", label: "Finisher", desc: "3+ completed", earned: true, color: "from-green-500 to-emerald-600" });
  if (hasIoT) badges.push({ icon: "📡", label: "IoT Engineer", desc: "Built IoT project", earned: true, color: "from-teal-500 to-cyan-600" });
  if (hasRobot) badges.push({ icon: "🤖", label: "Robotics Dev", desc: "Built robot", earned: true, color: "from-blue-500 to-indigo-600" });
  if (hasAI) badges.push({ icon: "🧠", label: "AI Builder", desc: "Built AI project", earned: true, color: "from-violet-500 to-purple-600" });
  if (projects.length < 1) badges.push({ icon: "🚀", label: "First Project", desc: "Save a project to unlock", earned: false, color: "from-gray-600 to-gray-700" });
  if (!hasIoT) badges.push({ icon: "📡", label: "IoT Engineer", desc: "Build an IoT project", earned: false, color: "from-gray-600 to-gray-700" });
  if (!hasRobot) badges.push({ icon: "🤖", label: "Robotics Dev", desc: "Build a robot project", earned: false, color: "from-gray-600 to-gray-700" });
  return badges.slice(0, 9);
}

function StatCard({ label, value, color, icon }: { label: string; value: number; color: string; icon: React.ReactNode }) {
  const count = useCountUp(value);
  return (
    <div className={`relative overflow-hidden bg-gray-900/80 border border-gray-800 rounded-2xl p-4 text-center group hover:scale-105 transition-all`}>
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
  const days = 84; // 12 weeks
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
        {["bg-gray-800", "bg-cyan-900", "bg-cyan-700", "bg-cyan-500"].map(c => (
          <div key={c} className={`w-3 h-3 rounded-sm ${c}`} />
        ))}
        <span>More</span>
      </div>
    </div>
  );
}

function ProfileContent() {
  const { user, updateProfile, signOut } = useAuth();
  const [projects, setProjects] = useState<SavedProject[]>([]);
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "badges" | "skills" | "learn">("overview");
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { setProjects(getProjects()); }, []);
  useEffect(() => { if (user) setEditName(user.full_name || ""); }, [user]);

  const displayName = user?.full_name || user?.email?.split("@")[0] || "Engineer";
  const totalHW = projects.reduce((s, p) => s + (p.analysis?.hardware?.length || 0), 0);
  const totalSW = projects.reduce((s, p) => s + (p.analysis?.software?.length || 0), 0);
  const totalBM = projects.reduce((s, p) => s + (p.bookmarked_components?.length || 0), 0);
  const completed = projects.filter(p => p.status === "completed").length;
  const badges = getBadges(projects);
  const earnedBadges = badges.filter(b => b.earned).length;

  const level = projects.length >= 10 ? "Advanced" : projects.length >= 5 ? "Intermediate" : "Beginner";
  const levelColor = level === "Advanced" ? "from-red-500 to-orange-500" : level === "Intermediate" ? "from-yellow-500 to-amber-500" : "from-green-500 to-cyan-500";
  const levelPct = projects.length >= 10 ? 100 : projects.length >= 5 ? Math.round(((projects.length - 5) / 5) * 100) : Math.round((projects.length / 5) * 100);

  const skills = [
    { label: "Arduino / Embedded", value: Math.min(100, totalHW * 8), color: "from-cyan-500 to-blue-600" },
    { label: "IoT & Networking", value: Math.min(100, projects.filter(p => /iot|esp|wifi/i.test(p.project_title)).length * 25), color: "from-teal-500 to-cyan-600" },
    { label: "Robotics", value: Math.min(100, projects.filter(p => /robot/i.test(p.project_title)).length * 30), color: "from-purple-500 to-pink-600" },
    { label: "AI / ML", value: Math.min(100, projects.filter(p => /ai|smart|ml/i.test(p.project_title)).length * 30), color: "from-orange-500 to-red-600" },
    { label: "Software Tools", value: Math.min(100, totalSW * 6), color: "from-green-500 to-emerald-600" },
  ];

  const handleSave = async () => {
    setSaving(true);
    const result = await updateProfile({ full_name: editName.trim() || undefined });
    if (!result.error) { setSaveSuccess(true); setEditing(false); setTimeout(() => setSaveSuccess(false), 3000); }
    setSaving(false);
  };

  const handleShare = () => {
    const text = [`👤 ${displayName} on COTsify`, `📊 ${projects.length} projects | ${totalHW} hardware | ${totalSW} software`, `🏆 ${earnedBadges} badges | Level: ${level}`, `🔗 https://cotsify.vercel.app`].join("\n");
    navigator.clipboard.writeText(text).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); });
  };

  const handleExport = () => {
    const lines = [`# COTsify Profile — ${displayName}`, `Level: ${level} | Projects: ${projects.length} | Badges: ${earnedBadges}`, "", "## Projects", ...projects.map(p => `- ${p.project_title} [${p.status || "planning"}]`)];
    const blob = new Blob([lines.join("\n")], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "COTsify_Profile.txt"; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* ── Hero Banner ─────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-3xl mb-6 bg-gradient-to-br from-violet-950 via-gray-900 to-cyan-950 border border-gray-800">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(139,92,246,0.3),transparent)] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_40%_40%_at_90%_80%,rgba(6,182,212,0.15),transparent)] pointer-events-none" />
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "linear-gradient(rgba(139,92,246,1) 1px,transparent 1px),linear-gradient(90deg,rgba(139,92,246,1) 1px,transparent 1px)", backgroundSize: "40px 40px" }} />
        <div className="relative px-6 py-10 text-center">
          {/* Avatar */}
          <div className="relative inline-block mb-4">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-violet-400 to-cyan-500 flex items-center justify-center text-gray-950 text-4xl font-bold shadow-2xl shadow-violet-500/40 ring-4 ring-violet-500/30">
              {user?.avatar_url ? <img src={user.avatar_url} alt={displayName} className="w-full h-full rounded-full object-cover" /> : displayName[0]?.toUpperCase()}
            </div>
            <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full flex items-center justify-center text-xs font-bold text-gray-950 shadow-lg">
              {earnedBadges}
            </div>
          </div>
          {editing ? (
            <div className="flex items-center justify-center gap-2 mb-2">
              <input value={editName} onChange={e => setEditName(e.target.value)} maxLength={50}
                className="bg-gray-800/80 border border-violet-600 rounded-xl px-4 py-2 text-white text-lg font-bold text-center focus:outline-none backdrop-blur-sm" />
              <button onClick={handleSave} disabled={saving} className="p-2 bg-violet-500 hover:bg-violet-400 text-white rounded-xl transition-colors">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
              </button>
              <button onClick={() => setEditing(false)} className="p-2 bg-gray-700 text-gray-300 rounded-xl transition-colors"><X className="w-4 h-4" /></button>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2 mb-1">
              <h1 className="text-2xl font-bold text-white">{displayName}</h1>
              <button onClick={() => setEditing(true)} className="p-1.5 text-gray-500 hover:text-violet-400 transition-colors"><Edit3 className="w-4 h-4" /></button>
            </div>
          )}
          {saveSuccess && <p className="text-green-400 text-xs mb-1 flex items-center justify-center gap-1"><Check className="w-3 h-3" /> Updated!</p>}
          <p className="text-gray-400 text-sm mb-3">{user?.email}</p>
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className={`text-xs font-bold px-3 py-1 rounded-full bg-gradient-to-r ${levelColor} text-white shadow-lg`}>{level}</span>
            <span className="text-xs text-gray-500 bg-gray-800/60 border border-gray-700 px-3 py-1 rounded-full">{user?.provider === "supabase" ? "🔐 Supabase Auth" : "👤 Guest"}</span>
          </div>
          {/* Level progress */}
          <div className="max-w-xs mx-auto mb-5">
            <div className="h-2 bg-gray-800/60 rounded-full overflow-hidden">
              <div className={`h-full bg-gradient-to-r ${levelColor} rounded-full transition-all duration-1000`} style={{ width: `${levelPct}%` }} />
            </div>
            <p className="text-gray-500 text-xs mt-1">{level === "Advanced" ? "Max level!" : `${projects.length >= 5 ? 10 - projects.length : 5 - projects.length} more projects to ${level === "Beginner" ? "Intermediate" : "Advanced"}`}</p>
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

      {/* ── Stats Row ───────────────────────────────────────────────────── */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 mb-6">
        <StatCard label="Projects" value={projects.length} color="from-violet-500 to-purple-600" icon={<Layers className="w-3 h-3" />} />
        <StatCard label="Completed" value={completed} color="from-green-500 to-emerald-600" icon={<CheckCircle2 className="w-3 h-3" />} />
        <StatCard label="Hardware" value={totalHW} color="from-cyan-500 to-blue-600" icon={<Cpu className="w-3 h-3" />} />
        <StatCard label="Software" value={totalSW} color="from-purple-500 to-pink-600" icon={<Code className="w-3 h-3" />} />
        <StatCard label="Bookmarks" value={totalBM} color="from-amber-500 to-orange-600" icon={<Bookmark className="w-3 h-3" />} />
        <StatCard label="Badges" value={earnedBadges} color="from-yellow-500 to-amber-600" icon={<Trophy className="w-3 h-3" />} />
      </div>

      {/* ── Tabs ────────────────────────────────────────────────────────── */}
      <div className="flex bg-gray-900 border border-gray-800 rounded-xl p-1 gap-1 mb-6 overflow-x-auto">
        {([["overview","Overview",<Activity className="w-3.5 h-3.5" />],["badges","Badges",<Award className="w-3.5 h-3.5" />],["skills","Skills",<BarChart3 className="w-3.5 h-3.5" />],["learn","Learning",<GraduationCap className="w-3.5 h-3.5" />]] as const).map(([id, label, icon]) => (
          <button key={id} onClick={() => setActiveTab(id)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${activeTab === id ? "bg-violet-950 text-violet-400 border border-violet-800" : "text-gray-500 hover:text-gray-300"}`}>
            {icon}{label}
          </button>
        ))}
      </div>

      {/* ── Overview Tab ────────────────────────────────────────────────── */}
      {activeTab === "overview" && (
        <div className="grid lg:grid-cols-2 gap-5">
          {/* Activity Heatmap */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2"><Activity className="w-4 h-4 text-violet-400" /> Activity (Last 12 Weeks)</h3>
            <ActivityHeatmap projects={projects} />
          </div>
          {/* Recent Projects */}
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
          {/* Engineer Card */}
          <div className="lg:col-span-2 bg-gradient-to-br from-violet-950/60 via-gray-900 to-cyan-950/40 border border-violet-800/40 rounded-2xl p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-violet-500/10 to-cyan-500/10 rounded-full -translate-y-8 translate-x-8" />
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold flex items-center gap-2"><Shield className="w-4 h-4 text-violet-400" /> Engineer Card</h3>
              <button onClick={handleShare} className="text-xs text-violet-400 hover:text-violet-300 flex items-center gap-1 transition-colors">
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />} {copied ? "Copied!" : "Copy"}
              </button>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-400 to-cyan-500 flex items-center justify-center text-gray-950 text-2xl font-bold shadow-lg flex-shrink-0">
                {displayName[0]?.toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-bold text-lg">{displayName}</p>
                <p className="text-gray-400 text-sm">{user?.email}</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full bg-gradient-to-r ${levelColor} text-white`}>{level}</span>
                  <span className="text-xs bg-amber-950/60 text-amber-400 border border-amber-800/50 px-2.5 py-1 rounded-full">🏆 {earnedBadges} badges</span>
                  <span className="text-xs bg-cyan-950/60 text-cyan-400 border border-cyan-800/50 px-2.5 py-1 rounded-full">📦 {projects.length} projects</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Badges Tab ──────────────────────────────────────────────────── */}
      {activeTab === "badges" && (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-white font-semibold flex items-center gap-2"><Award className="w-4 h-4 text-amber-400" /> Achievement Badges</h3>
            <span className="text-xs text-amber-400 bg-amber-950/50 border border-amber-800 px-2 py-0.5 rounded-full">{earnedBadges}/{badges.length} earned</span>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {badges.map((badge, i) => (
              <div key={i} className={`rounded-2xl p-4 text-center border transition-all ${badge.earned ? "bg-gradient-to-br from-amber-950/40 to-orange-950/40 border-amber-800/50 hover:border-amber-600 hover:scale-105" : "bg-gray-800/30 border-gray-800 opacity-40"}`}>
                <div className="text-3xl mb-2">{badge.icon}</div>
                <div className={`text-xs font-bold mb-1 ${badge.earned ? "text-white" : "text-gray-500"}`}>{badge.label}</div>
                <div className="text-xs text-gray-500">{badge.desc}</div>
                {badge.earned && <div className="mt-2 text-xs text-amber-400 flex items-center justify-center gap-1"><Star className="w-3 h-3 fill-amber-400" /> Earned</div>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Skills Tab ──────────────────────────────────────────────────── */}
      {activeTab === "skills" && (
        <div className="grid sm:grid-cols-2 gap-5">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <h3 className="text-white font-semibold mb-5 flex items-center gap-2"><BarChart3 className="w-4 h-4 text-violet-400" /> Skill Levels</h3>
            {skills.map(s => <SkillBar key={s.label} {...s} />)}
            {projects.length === 0 && <p className="text-gray-500 text-sm text-center py-4">Save projects to build your skill profile</p>}
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2"><Lightbulb className="w-4 h-4 text-amber-400" /> Recommended Next</h3>
            {[
              { title: "Smart Irrigation System", reason: "Great IoT starter", icon: "🌱", diff: "Beginner" },
              { title: "Line Following Robot", reason: "Learn robotics basics", icon: "🤖", diff: "Beginner" },
              { title: "Face Recognition Attendance", reason: "Explore AI/ML", icon: "🧠", diff: "Advanced" },
              { title: "Home Automation ESP32", reason: "Level up IoT skills", icon: "🏠", diff: "Intermediate" },
            ].filter(r => !projects.some(p => p.project_title.toLowerCase().includes(r.title.toLowerCase().split(" ")[0]))).slice(0, 3).map(r => (
              <Link key={r.title} href={`/search?q=${encodeURIComponent(r.title)}`}
                className="flex items-center gap-3 bg-gray-800/50 hover:bg-gray-800 border border-gray-700/50 hover:border-violet-800 rounded-xl px-4 py-3 mb-2 transition-all group">
                <span className="text-2xl">{r.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium">{r.title}</p>
                  <p className="text-gray-500 text-xs">{r.reason}</p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full border flex-shrink-0 ${r.diff === "Beginner" ? "bg-green-950 text-green-400 border-green-800" : r.diff === "Intermediate" ? "bg-yellow-950 text-yellow-400 border-yellow-800" : "bg-red-950 text-red-400 border-red-800"}`}>{r.diff}</span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* ── Learning Tab ────────────────────────────────────────────────── */}
      {activeTab === "learn" && (
        <div className="bg-gradient-to-br from-violet-950/40 to-cyan-950/40 border border-violet-800/30 rounded-2xl p-6 text-center">
          <GraduationCap className="w-12 h-12 text-violet-400 mx-auto mb-4" />
          <h3 className="text-white font-bold text-xl mb-2">Free Learning Paths</h3>
          <p className="text-gray-400 text-sm mb-6 max-w-md mx-auto">25+ free courses from Coursera, edX, NPTEL, and YouTube. Get certified in Electronics, IoT, Robotics, AI/ML and more.</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            {[["Electronics","⚡"],["IoT","📡"],["Robotics","🤖"],["AI/ML","🧠"]].map(([cat, icon]) => (
              <Link key={cat} href={`/learn`} className="bg-gray-900/60 border border-gray-800 hover:border-violet-700 rounded-xl p-3 text-center transition-all hover:-translate-y-0.5">
                <div className="text-2xl mb-1">{icon}</div>
                <div className="text-white text-xs font-medium">{cat}</div>
                <div className="text-gray-500 text-xs">Free courses</div>
              </Link>
            ))}
          </div>
          <Link href="/learn" className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-400 hover:to-purple-500 text-white font-semibold px-8 py-3 rounded-full transition-all shadow-lg shadow-violet-500/25 hover:scale-105">
            <GraduationCap className="w-4 h-4" /> Browse All Courses
          </Link>
        </div>
      )}
    </div>
  );
}
