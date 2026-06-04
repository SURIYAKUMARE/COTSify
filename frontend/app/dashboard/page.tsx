"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { getProjects, deleteProjectLocal, updateProjectLocal, exportProjectBOM, SavedProject } from "@/lib/local-storage";
import RouteGuard from "@/components/RouteGuard";
import {
  LayoutDashboard, Search, Trash2, Bookmark, Cpu, Code, Clock,
  ExternalLink, Zap, Plus, Activity, BarChart2, Layers,
  ArrowUpRight, Calendar, Grid, List, Download, StickyNote,
  CheckCircle2, Circle, PlayCircle, Tag, IndianRupee, X,
  ChevronDown, Pencil, Save, BookOpen, Compass, FileText,
  TrendingUp, Target, Lightbulb, Users, ChevronUp,
  Mail, Star, Award, Brain, Database, Globe, BarChart3, MapPin,
  Code2, GraduationCap,
} from "lucide-react";
import FeatureBanner from "@/components/FeatureBanner";
import RecentSearches from "@/components/RecentSearches";

// Github icon (not in lucide-react, use inline SVG)
const GithubIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
  </svg>
);

// ── Team Data ─────────────────────────────────────────────────────────────────
const TEAM_MEMBERS = [
  {
    id: 1, name: "SURIYAKUMAR E", role: "Full Stack & Team Lead", num: "01",
    color: "from-cyan-500 to-blue-600", border: "border-cyan-800/50", bg: "bg-cyan-950/30",
    tagColor: "text-cyan-400", avatar: "S",
    tasks: [
      { done: true,  text: "Next.js 16 frontend architecture" },
      { done: true,  text: "FastAPI backend with 8 route modules" },
      { done: true,  text: "Supabase auth + Google OAuth" },
      { done: true,  text: "Vercel + Render deployment" },
      { done: true,  text: "AI integration (Gemini + OpenAI)" },
      { done: false, text: "Performance optimization" },
    ],
    skills: ["Next.js", "FastAPI", "Supabase", "AI APIs"],
    github: "https://github.com/SURIYAKUMARE",
    email: "suryaaswin000@gmail.com",
  },
  {
    id: 2, name: "JEFFREYNICKALAS M", role: "AI/ML Engineer", num: "02",
    color: "from-blue-500 to-purple-600", border: "border-blue-800/50", bg: "bg-blue-950/30",
    tagColor: "text-blue-400", avatar: "J",
    tasks: [
      { done: true,  text: "Prompt engineering for BOM extraction" },
      { done: true,  text: "COTsify AI chat assistant" },
      { done: true,  text: "Multi-model fallback pipeline" },
      { done: true,  text: "Component knowledge base (500+)" },
      { done: false, text: "Fine-tuning response accuracy" },
      { done: false, text: "Streaming chat responses" },
    ],
    skills: ["Gemini API", "OpenAI", "NLP", "Python"],
    github: "#",
    email: "jeffrey@example.com",
  },
  {
    id: 3, name: "JOVITA D", role: "UI/UX & Frontend", num: "03",
    color: "from-purple-500 to-pink-600", border: "border-purple-800/50", bg: "bg-purple-950/30",
    tagColor: "text-purple-400", avatar: "J",
    tasks: [
      { done: true,  text: "Dark-mode UI design system" },
      { done: true,  text: "Component catalog browser" },
      { done: true,  text: "Learning modules page" },
      { done: true,  text: "Mobile responsive design" },
      { done: false, text: "Animation & micro-interactions" },
      { done: false, text: "Accessibility improvements" },
    ],
    skills: ["Tailwind CSS", "React", "Figma", "Design"],
    github: "#",
    email: "jovita@example.com",
  },
  {
    id: 4, name: "PREDEEP KV", role: "Data & Research Lead", num: "04",
    color: "from-pink-500 to-rose-600", border: "border-pink-800/50", bg: "bg-pink-950/30",
    tagColor: "text-pink-400", avatar: "P",
    tasks: [
      { done: true,  text: "Price comparison engine" },
      { done: true,  text: "Google Maps Places integration" },
      { done: true,  text: "Supabase database schema" },
      { done: true,  text: "Indian market component pricing" },
      { done: false, text: "Real-time price scraping" },
      { done: false, text: "Store inventory tracking" },
    ],
    skills: ["Maps API", "PostgreSQL", "Research", "Data"],
    github: "#",
    email: "predeep@example.com",
  },
];

function TeamDashboard() {
  const [expanded, setExpanded] = useState<number | null>(null);
  const [editingMember, setEditingMember] = useState<number | null>(null);
  const [tasks, setTasks] = useState(() =>
    Object.fromEntries(TEAM_MEMBERS.map(m => [m.id, m.tasks.map(t => ({ ...t }))]))
  );
  const [newTask, setNewTask] = useState("");

  const toggleTask = (memberId: number, taskIdx: number) => {
    setTasks(prev => ({
      ...prev,
      [memberId]: prev[memberId].map((t, i) => i === taskIdx ? { ...t, done: !t.done } : t),
    }));
  };

  const addTask = (memberId: number) => {
    if (!newTask.trim()) return;
    setTasks(prev => ({
      ...prev,
      [memberId]: [...prev[memberId], { done: false, text: newTask.trim() }],
    }));
    setNewTask("");
  };

  const removeTask = (memberId: number, taskIdx: number) => {
    setTasks(prev => ({
      ...prev,
      [memberId]: prev[memberId].filter((_, i) => i !== taskIdx),
    }));
  };

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-semibold flex items-center gap-2">
          <Users className="w-4 h-4 text-cyan-400" /> Team Progress
        </h3>
        <Link href="/team" className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors">
          Full profiles <ExternalLink className="w-3 h-3" />
        </Link>
      </div>

      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {TEAM_MEMBERS.map(member => {
          const memberTasks = tasks[member.id];
          const done = memberTasks.filter(t => t.done).length;
          const total = memberTasks.length;
          const pct = total > 0 ? Math.round((done / total) * 100) : 0;
          const isExpanded = expanded === member.id;
          const isEditing = editingMember === member.id;

          return (
            <div key={member.id} className={`group relative bg-gray-900/60 border ${member.border} rounded-2xl overflow-hidden transition-all duration-300`}>
              {/* Gradient top bar */}
              <div className={`h-1 w-full bg-gradient-to-r ${member.color}`} />

              <div className="p-4">
                {/* Header */}
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-10 h-10 bg-gradient-to-br ${member.color} rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-lg`}>
                    {member.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-semibold text-xs leading-tight truncate">{member.name}</p>
                    <p className="text-gray-500 text-xs truncate">{member.role}</p>
                  </div>
                  <span className="text-gray-600 font-mono text-xs">{member.num}</span>
                </div>

                {/* Progress bar */}
                <div className="mb-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-500">Progress</span>
                    <span className={`text-xs font-bold ${member.tagColor}`}>{pct}%</span>
                  </div>
                  <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r ${member.color} transition-all duration-500`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <p className="text-gray-600 text-xs mt-1">{done}/{total} tasks done</p>
                </div>

                {/* Skills */}
                <div className="flex flex-wrap gap-1 mb-3">
                  {member.skills.map(s => (
                    <span key={s} className={`text-xs px-1.5 py-0.5 rounded-md ${member.bg} ${member.tagColor} border ${member.border}`}>{s}</span>
                  ))}
                </div>

                {/* Toggle tasks */}
                <button
                  onClick={() => setExpanded(isExpanded ? null : member.id)}
                  className={`w-full flex items-center justify-between text-xs px-3 py-2 rounded-xl border transition-all ${member.bg} ${member.border} ${member.tagColor}`}
                >
                  <span>Tasks ({total})</span>
                  {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>

                {/* Tasks expanded */}
                {isExpanded && (
                  <div className="mt-3 flex flex-col gap-1.5">
                    {memberTasks.map((task, idx) => (
                      <div key={idx} className="flex items-start gap-2 group/task">
                        <button
                          onClick={() => toggleTask(member.id, idx)}
                          className={`mt-0.5 flex-shrink-0 w-4 h-4 rounded border transition-all ${task.done ? `bg-gradient-to-br ${member.color} border-transparent` : "border-gray-600 hover:border-gray-400"}`}
                        >
                          {task.done && <CheckCircle2 className="w-4 h-4 text-white" />}
                        </button>
                        <span className={`text-xs flex-1 leading-relaxed ${task.done ? "line-through text-gray-600" : "text-gray-300"}`}>
                          {task.text}
                        </span>
                        {isEditing && (
                          <button onClick={() => removeTask(member.id, idx)} className="opacity-0 group-hover/task:opacity-100 text-red-500/60 hover:text-red-400 transition-all flex-shrink-0">
                            <X className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    ))}

                    {/* Add task */}
                    {isEditing && (
                      <div className="flex gap-1.5 mt-2">
                        <input
                          type="text"
                          value={newTask}
                          onChange={e => setNewTask(e.target.value)}
                          onKeyDown={e => e.key === "Enter" && addTask(member.id)}
                          placeholder="Add task..."
                          className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-2.5 py-1.5 text-white text-xs placeholder-gray-600 focus:outline-none focus:border-cyan-600"
                        />
                        <button
                          onClick={() => addTask(member.id)}
                          className={`px-2.5 py-1.5 bg-gradient-to-r ${member.color} text-white text-xs rounded-lg font-medium`}
                        >
                          Add
                        </button>
                      </div>
                    )}

                    {/* Edit toggle + social */}
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-800">
                      <button
                        onClick={() => setEditingMember(isEditing ? null : member.id)}
                        className={`text-xs flex items-center gap-1 px-2.5 py-1 rounded-lg border transition-all ${isEditing ? `${member.bg} ${member.tagColor} ${member.border}` : "text-gray-500 hover:text-gray-300 border-gray-700 hover:border-gray-600"}`}
                      >
                        <Pencil className="w-3 h-3" />
                        {isEditing ? "Done" : "Edit"}
                      </button>
                      <div className="flex gap-1.5">
                        {member.github !== "#" && (
                          <a href={member.github} target="_blank" rel="noopener noreferrer"
                            className="p-1.5 text-gray-600 hover:text-white bg-gray-800 hover:bg-gray-700 rounded-lg transition-all">
                            <GithubIcon className="w-3 h-3" />
                          </a>
                        )}
                        <a href={`mailto:${member.email}`}
                          className="p-1.5 text-gray-600 hover:text-cyan-400 bg-gray-800 hover:bg-gray-700 rounded-lg transition-all">
                          <Mail className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return <RouteGuard><DashboardContent /></RouteGuard>;
}

const STATUS_CONFIG = {
  planning:    { label: "Planning",     icon: <Circle className="w-3.5 h-3.5" />,      color: "text-gray-400",   bg: "bg-gray-800",   border: "border-gray-700" },
  in_progress: { label: "In Progress",  icon: <PlayCircle className="w-3.5 h-3.5" />,  color: "text-blue-400",   bg: "bg-blue-950/50", border: "border-blue-800" },
  completed:   { label: "Completed",    icon: <CheckCircle2 className="w-3.5 h-3.5" />, color: "text-green-400", bg: "bg-green-950/50", border: "border-green-800" },
};

const CARD_GRADIENTS = [
  "from-cyan-500 to-blue-600", "from-blue-500 to-purple-600",
  "from-purple-500 to-pink-600", "from-green-500 to-cyan-600",
  "from-amber-500 to-orange-600", "from-pink-500 to-rose-600",
];

function DashboardContent() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<SavedProject[]>([]);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [view, setView] = useState<"grid" | "list">("grid");
  const [filter, setFilter] = useState("all");
  const [editingNote, setEditingNote] = useState<string | null>(null);
  const [noteText, setNoteText] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => { setProjects(getProjects()); }, []);

  const refresh = () => setProjects(getProjects());

  const handleDelete = (id: string) => {
    setDeletingId(id);
    deleteProjectLocal(id);
    refresh();
    setDeletingId(null);
  };

  const handleStatusChange = (id: string, status: SavedProject["status"]) => {
    updateProjectLocal(id, { status });
    refresh();
  };

  const handleSaveNote = (id: string) => {
    updateProjectLocal(id, { notes: noteText });
    setEditingNote(null);
    refresh();
  };

  const handleExport = (project: SavedProject) => {
    const content = exportProjectBOM(project);
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${project.project_title.replace(/\s+/g, "_")}_BOM.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const displayName = user?.full_name || user?.email?.split("@")[0] || "Engineer";
  const totalHW = projects.reduce((s, p) => s + (p.analysis?.hardware?.length || 0), 0);
  const totalSW = projects.reduce((s, p) => s + (p.analysis?.software?.length || 0), 0);
  const totalBM = projects.reduce((s, p) => s + (p.bookmarked_components?.length || 0), 0);
  const completed = projects.filter(p => p.status === "completed").length;
  const inProgress = projects.filter(p => p.status === "in_progress").length;

  const filtered = filter === "bookmarked" ? projects.filter(p => p.bookmarked_components?.length > 0)
    : filter === "completed" ? projects.filter(p => p.status === "completed")
    : filter === "in_progress" ? projects.filter(p => p.status === "in_progress")
    : projects;

  const STATS = [
    { label: "Total Projects", value: projects.length, icon: <Layers className="w-5 h-5" />, color: "from-cyan-500 to-blue-600", bg: "bg-cyan-950/50", border: "border-cyan-800/50", text: "text-cyan-400" },
    { label: "In Progress", value: inProgress, icon: <PlayCircle className="w-5 h-5" />, color: "from-blue-500 to-indigo-600", bg: "bg-blue-950/50", border: "border-blue-800/50", text: "text-blue-400" },
    { label: "Completed", value: completed, icon: <CheckCircle2 className="w-5 h-5" />, color: "from-green-500 to-emerald-600", bg: "bg-green-950/50", border: "border-green-800/50", text: "text-green-400" },
    { label: "Bookmarked", value: totalBM, icon: <Bookmark className="w-5 h-5" />, color: "from-amber-500 to-orange-600", bg: "bg-amber-950/50", border: "border-amber-800/50", text: "text-amber-400" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div className="flex items-center gap-3">
          {user?.avatar_url ? (
            <img
              src={user.avatar_url}
              alt={displayName}
              className="w-12 h-12 rounded-2xl object-cover ring-2 ring-cyan-500/30 shadow-lg shadow-cyan-500/20"
            />
          ) : (
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-gray-950 font-bold text-xl shadow-lg shadow-cyan-500/20">
              {displayName[0]?.toUpperCase()}
            </div>
          )}
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-white">
                Welcome, <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">{displayName}</span>
              </h1>
              {user?.google_connected && (
                <span className="hidden sm:flex items-center gap-1 text-xs bg-blue-950/60 border border-blue-800/50 text-blue-400 px-2 py-0.5 rounded-full">
                  <svg className="w-3 h-3" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Google
                </span>
              )}
            </div>
            <p className="text-gray-500 text-sm">{projects.length} projects · {totalHW + totalSW} components tracked</p>
          </div>
        </div>
        <Link href="/search" className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-cyan-500/20 hover:scale-105">
          <Plus className="w-4 h-4" /> New Project
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {STATS.map((s) => (
          <div key={s.label} className={`relative overflow-hidden ${s.bg} border ${s.border} rounded-2xl p-5 group hover:scale-[1.02] transition-all cursor-default`}>
            <div className={`absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br ${s.color} rounded-full opacity-10 group-hover:opacity-20 transition-opacity`} />
            <div className={`inline-flex p-2 rounded-xl bg-gradient-to-br ${s.color} mb-3 shadow-lg`}>
              <div className="text-white">{s.icon}</div>
            </div>
            <div className={`text-3xl font-bold ${s.text} mb-1`}>{s.value}</div>
            <div className="text-gray-400 text-xs font-medium">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Feature banner */}
      <FeatureBanner
        id="dashboard-catalog-tip"
        variant="tip"
        message="Browse the Component Catalog to explore 500+ parts with specs, prices, and datasheets — no project needed."
        action={{ label: "Open Catalog", href: "/catalog" }}
        className="mb-6"
      />

      {/* Recent searches */}
      <RecentSearches compact className="mb-8" />

      {/* ── Quick Actions ──────────────────────────────────────────────────── */}
      <div className="mb-8">
        <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
          <Zap className="w-4 h-4 text-cyan-400" /> Quick Actions
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { href: "/search", icon: <Search className="w-5 h-5" />, label: "New Search", desc: "Analyze a project", gradient: "from-cyan-500 to-blue-600", bg: "bg-cyan-950/50 border-cyan-800/50 hover:border-cyan-600" },
            { href: "/explore", icon: <Compass className="w-5 h-5" />, label: "Browse Explore", desc: "Discover projects", gradient: "from-blue-500 to-purple-600", bg: "bg-blue-950/50 border-blue-800/50 hover:border-blue-600" },
            { href: "/catalog", icon: <BookOpen className="w-5 h-5" />, label: "View Catalog", desc: "Browse components", gradient: "from-purple-500 to-pink-600", bg: "bg-purple-950/50 border-purple-800/50 hover:border-purple-600" },
            { href: "/learn", icon: <GraduationCap className="w-5 h-5" />, label: "Learn & Quiz", desc: "Study electronics", gradient: "from-green-500 to-teal-600", bg: "bg-green-950/50 border-green-800/50 hover:border-green-600" },
          ].map((action) => (
            <Link key={action.label} href={action.href}
              className={`group flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all hover:-translate-y-1 hover:shadow-lg text-center ${action.bg}`}>
              <div className={`p-2.5 rounded-xl bg-gradient-to-br ${action.gradient} text-white group-hover:scale-110 transition-transform shadow-lg`}>
                {action.icon}
              </div>
              <div>
                <p className="text-white font-semibold text-sm">{action.label}</p>
                <p className="text-gray-500 text-xs">{action.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* ── Team Dashboard ─────────────────────────────────────────────────── */}
      <TeamDashboard />

      {/* ── Project Insights + Recent Activity ────────────────────────────── */}
      {projects.length > 0 && (
        <div className="grid sm:grid-cols-2 gap-5 mb-8">
          {/* Project Insights */}
          <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-5 backdrop-blur-sm">
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-cyan-400" /> Project Insights
            </h3>
            <div className="flex flex-col gap-3">
              {(() => {
                const catCounts: Record<string, number> = {};
                projects.forEach(p => {
                  const cat = p.project_title.toLowerCase().includes("iot") ? "IoT"
                    : p.project_title.toLowerCase().includes("robot") ? "Robotics"
                    : p.project_title.toLowerCase().includes("ai") || p.project_title.toLowerCase().includes("smart") ? "AI/Smart"
                    : "General";
                  catCounts[cat] = (catCounts[cat] || 0) + 1;
                });
                const topCat = Object.entries(catCounts).sort((a, b) => b[1] - a[1])[0];
                const allComponents = projects.flatMap(p => p.analysis?.hardware || []);
                const avgCost = projects.length > 0
                  ? Math.round(projects.reduce((s, p) => s + (p.analysis?.hardware?.length || 0) * 150, 0) / projects.length)
                  : 0;
                return (
                  <>
                    <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-xl">
                      <div className="flex items-center gap-2">
                        <Target className="w-4 h-4 text-cyan-400" />
                        <span className="text-gray-400 text-sm">Most common category</span>
                      </div>
                      <span className="text-white font-semibold text-sm">{topCat ? topCat[0] : "—"}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-xl">
                      <div className="flex items-center gap-2">
                        <IndianRupee className="w-4 h-4 text-green-400" />
                        <span className="text-gray-400 text-sm">Avg. estimated cost</span>
                      </div>
                      <span className="text-green-400 font-semibold text-sm">₹{avgCost.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-xl">
                      <div className="flex items-center gap-2">
                        <Cpu className="w-4 h-4 text-blue-400" />
                        <span className="text-gray-400 text-sm">Total components</span>
                      </div>
                      <span className="text-blue-400 font-semibold text-sm">{allComponents.length}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-xl">
                      <div className="flex items-center gap-2">
                        <Lightbulb className="w-4 h-4 text-amber-400" />
                        <span className="text-gray-400 text-sm">Completion rate</span>
                      </div>
                      <span className="text-amber-400 font-semibold text-sm">
                        {projects.length > 0 ? Math.round((projects.filter(p => p.status === "completed").length / projects.length) * 100) : 0}%
                      </span>
                    </div>
                  </>
                );
              })()}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-5 backdrop-blur-sm">
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan-400" /> Recent Activity
            </h3>
            <div className="flex flex-col gap-0">
              {projects.slice(0, 5).map((p, i) => {
                const date = new Date(p.created_at);
                const timeAgo = (() => {
                  const diff = Date.now() - date.getTime();
                  const days = Math.floor(diff / 86400000);
                  if (days === 0) return "Today";
                  if (days === 1) return "Yesterday";
                  if (days < 7) return `${days}d ago`;
                  return date.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
                })();
                const action = p.status === "completed" ? "Completed" : p.status === "in_progress" ? "Working on" : "Saved";
                const actionColor = p.status === "completed" ? "text-green-400" : p.status === "in_progress" ? "text-blue-400" : "text-gray-400";
                return (
                  <div key={p.id} className="flex items-start gap-3 relative">
                    {i < 4 && <div className="absolute left-3.5 top-7 bottom-0 w-px bg-gray-800" />}
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 z-10 ${p.status === "completed" ? "bg-green-950 border border-green-800" : p.status === "in_progress" ? "bg-blue-950 border border-blue-800" : "bg-gray-800 border border-gray-700"}`}>
                      {p.status === "completed" ? <CheckCircle2 className="w-3.5 h-3.5 text-green-400" /> : p.status === "in_progress" ? <PlayCircle className="w-3.5 h-3.5 text-blue-400" /> : <Circle className="w-3.5 h-3.5 text-gray-500" />}
                    </div>
                    <div className="flex-1 pb-4">
                      <p className="text-white text-sm">
                        <span className={`font-medium ${actionColor}`}>{action}</span>{" "}
                        <span className="text-gray-300">{p.project_title}</span>
                      </p>
                      <p className="text-gray-500 text-xs mt-0.5 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {timeAgo}
                        {p.analysis?.hardware && <span className="ml-2">· {p.analysis.hardware.length} components</span>}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Progress overview */}
      {projects.length > 0 && (
        <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-5 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan-400" /> Project Overview
            </h3>
            <div className="flex items-center gap-3 text-xs text-gray-500">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500 inline-block" />{completed} done</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500 inline-block" />{inProgress} active</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-gray-600 inline-block" />{projects.length - completed - inProgress} planning</span>
            </div>
          </div>
          {/* Progress bar */}
          <div className="h-3 bg-gray-800 rounded-full overflow-hidden flex">
            {completed > 0 && <div className="bg-green-500 h-full transition-all" style={{ width: `${(completed / projects.length) * 100}%` }} />}
            {inProgress > 0 && <div className="bg-blue-500 h-full transition-all" style={{ width: `${(inProgress / projects.length) * 100}%` }} />}
          </div>
          {/* Activity bars */}
          <div className="flex items-end gap-1.5 h-14 mt-4">
            {projects.slice(0, 14).map((p) => {
              const total = (p.analysis?.hardware?.length || 0) + (p.analysis?.software?.length || 0);
              const max = Math.max(...projects.map(x => (x.analysis?.hardware?.length || 0) + (x.analysis?.software?.length || 0)), 1);
              const h = Math.max(15, (total / max) * 100);
              const color = p.status === "completed" ? "from-green-600 to-green-500" : p.status === "in_progress" ? "from-blue-600 to-blue-500" : "from-gray-700 to-gray-600";
              return (
                <div key={p.id} className="flex-1 group cursor-pointer" title={`${p.project_title} (${total} components)`}>
                  <div className={`w-full rounded-t-md bg-gradient-to-t ${color} opacity-70 group-hover:opacity-100 transition-all`} style={{ height: `${h}%` }} />
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Filter + View */}
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <h2 className="text-white font-bold text-lg flex items-center gap-2">
          <BarChart2 className="w-5 h-5 text-cyan-400" /> Projects
          {filtered.length > 0 && <span className="text-xs bg-cyan-950 text-cyan-400 border border-cyan-800 px-2 py-0.5 rounded-full">{filtered.length}</span>}
        </h2>
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex bg-gray-900 border border-gray-800 rounded-xl p-1 gap-1">
            {[["all","All"],["in_progress","Active"],["completed","Done"],["bookmarked","Saved"]].map(([val, label]) => (
              <button key={val} onClick={() => setFilter(val)}
                className={`text-xs px-3 py-1.5 rounded-lg transition-colors ${filter === val ? "bg-gray-700 text-white" : "text-gray-500 hover:text-gray-300"}`}>
                {label}
              </button>
            ))}
          </div>
          <div className="flex bg-gray-900 border border-gray-800 rounded-xl p-1 gap-1">
            <button onClick={() => setView("grid")} className={`p-1.5 rounded-lg transition-colors ${view === "grid" ? "bg-gray-700 text-white" : "text-gray-500"}`}><Grid className="w-3.5 h-3.5" /></button>
            <button onClick={() => setView("list")} className={`p-1.5 rounded-lg transition-colors ${view === "list" ? "bg-gray-700 text-white" : "text-gray-500"}`}><List className="w-3.5 h-3.5" /></button>
          </div>
        </div>
      </div>

      {/* Empty */}
      {filtered.length === 0 && (
        <div className="text-center py-24 border border-dashed border-gray-800 rounded-2xl">
          <div className="w-20 h-20 bg-gradient-to-br from-cyan-950 to-blue-950 border border-cyan-800/50 rounded-2xl flex items-center justify-center mx-auto mb-5">
            <Search className="w-8 h-8 text-cyan-400" />
          </div>
          <h3 className="text-white font-semibold text-lg mb-2">No projects found</h3>
          <p className="text-gray-500 text-sm mb-6">Search for a project and save it to build your collection</p>
          <Link href="/search" className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold px-6 py-3 rounded-xl transition-all">
            <Zap className="w-4 h-4" /> Analyze a project
          </Link>
        </div>
      )}

      {/* Grid */}
      {filtered.length > 0 && view === "grid" && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i}
              onDelete={handleDelete} deleting={deletingId === project.id}
              onStatusChange={handleStatusChange}
              onExport={handleExport}
              onEditNote={(id, note) => { setEditingNote(id); setNoteText(note || ""); }}
              expanded={expandedId === project.id}
              onToggleExpand={(id) => setExpandedId(expandedId === id ? null : id)}
            />
          ))}
        </div>
      )}

      {/* List */}
      {filtered.length > 0 && view === "list" && (
        <div className="flex flex-col gap-3">
          {filtered.map((project) => (
            <ProjectListRow key={project.id} project={project}
              onDelete={handleDelete} deleting={deletingId === project.id}
              onStatusChange={handleStatusChange}
              onExport={handleExport}
              onEditNote={(id, note) => { setEditingNote(id); setNoteText(note || ""); }}
            />
          ))}
        </div>
      )}

      {/* Note modal */}
      {editingNote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-gray-950 border border-gray-800 rounded-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold flex items-center gap-2"><StickyNote className="w-4 h-4 text-cyan-400" /> Project Notes</h3>
              <button onClick={() => setEditingNote(null)} className="text-gray-500 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <textarea value={noteText} onChange={e => setNoteText(e.target.value)} rows={6}
              placeholder="Add notes, ideas, progress updates..."
              className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-cyan-600 resize-none mb-4" />
            <div className="flex gap-2">
              <button onClick={() => handleSaveNote(editingNote)}
                className="flex-1 flex items-center justify-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-gray-950 font-semibold py-2.5 rounded-xl transition-colors">
                <Save className="w-4 h-4" /> Save Note
              </button>
              <button onClick={() => setEditingNote(null)}
                className="px-4 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl transition-colors">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ProjectCard({ project, index, onDelete, deleting, onStatusChange, onExport, onEditNote, expanded, onToggleExpand }: {
  project: SavedProject; index: number; deleting: boolean; expanded: boolean;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, s: SavedProject["status"]) => void;
  onExport: (p: SavedProject) => void;
  onEditNote: (id: string, note?: string) => void;
  onToggleExpand: (id: string) => void;
}) {
  const hw = project.analysis?.hardware?.length || 0;
  const sw = project.analysis?.software?.length || 0;
  const bm = project.bookmarked_components?.length || 0;
  const date = new Date(project.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  const gradient = CARD_GRADIENTS[index % CARD_GRADIENTS.length];
  const initials = project.project_title.split(" ").slice(0, 2).map(w => w[0]).join("").toUpperCase();
  const status = project.status || "planning";
  const sc = STATUS_CONFIG[status];

  return (
    <div className="group bg-gray-900 border border-gray-800 hover:border-gray-600 rounded-2xl overflow-hidden transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/30">
      <div className={`h-1.5 w-full bg-gradient-to-r ${gradient}`} />
      <div className="p-5">
        {/* Header */}
        <div className="flex items-start gap-3 mb-3">
          <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-lg`}>
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-white font-semibold text-sm leading-snug line-clamp-2 group-hover:text-cyan-300 transition-colors">{project.project_title}</h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-gray-500 text-xs flex items-center gap-1"><Calendar className="w-3 h-3" />{date}</span>
            </div>
          </div>
        </div>

        {/* Status selector */}
        <div className="flex items-center gap-2 mb-3">
          {(["planning","in_progress","completed"] as const).map(s => {
            const c = STATUS_CONFIG[s];
            return (
              <button key={s} onClick={() => onStatusChange(project.id, s)}
                className={`flex items-center gap-1 text-xs px-2 py-1 rounded-lg border transition-all ${status === s ? `${c.bg} ${c.color} ${c.border}` : "bg-gray-800 text-gray-600 border-gray-700 hover:border-gray-600"}`}>
                {c.icon}{c.label}
              </button>
            );
          })}
        </div>

        {/* Stats */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          <span className="flex items-center gap-1 text-xs bg-cyan-950/60 text-cyan-400 border border-cyan-900 px-2 py-0.5 rounded-full"><Cpu className="w-3 h-3" />{hw}</span>
          <span className="flex items-center gap-1 text-xs bg-purple-950/60 text-purple-400 border border-purple-900 px-2 py-0.5 rounded-full"><Code className="w-3 h-3" />{sw}</span>
          {bm > 0 && <span className="flex items-center gap-1 text-xs bg-amber-950/60 text-amber-400 border border-amber-900 px-2 py-0.5 rounded-full"><Bookmark className="w-3 h-3" />{bm}</span>}
          {project.notes && <span className="flex items-center gap-1 text-xs bg-green-950/60 text-green-400 border border-green-900 px-2 py-0.5 rounded-full"><StickyNote className="w-3 h-3" />Note</span>}
        </div>

        {/* Expanded: show hardware list */}
        {expanded && (
          <div className="mb-3 bg-gray-800/50 rounded-xl p-3">
            <p className="text-gray-400 text-xs font-medium mb-2">Hardware:</p>
            <div className="flex flex-col gap-1">
              {project.analysis?.hardware?.slice(0, 5).map(h => (
                <div key={h.name} className="flex items-center justify-between text-xs">
                  <span className="text-gray-300">{h.name}</span>
                  <span className="text-gray-500">×{h.quantity}</span>
                </div>
              ))}
              {(project.analysis?.hardware?.length || 0) > 5 && (
                <span className="text-gray-500 text-xs">+{(project.analysis?.hardware?.length || 0) - 5} more</span>
              )}
            </div>
            {project.notes && (
              <div className="mt-2 pt-2 border-t border-gray-700">
                <p className="text-gray-400 text-xs font-medium mb-1">Notes:</p>
                <p className="text-gray-300 text-xs">{project.notes}</p>
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="grid grid-cols-4 gap-1.5">
          <Link href={`/search?q=${encodeURIComponent(project.project_title)}`}
            className="col-span-2 flex items-center justify-center gap-1 text-xs bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white border border-gray-700 hover:border-cyan-700 py-2 rounded-xl transition-all">
            <ArrowUpRight className="w-3.5 h-3.5" /> Open
          </Link>
          <button onClick={() => onEditNote(project.id, project.notes)}
            className="flex items-center justify-center text-xs bg-gray-800 hover:bg-green-950 text-gray-400 hover:text-green-400 border border-gray-700 hover:border-green-800 py-2 rounded-xl transition-all" title="Add note">
            <Pencil className="w-3.5 h-3.5" />
          </button>
          <button onClick={() => onExport(project)}
            className="flex items-center justify-center text-xs bg-gray-800 hover:bg-blue-950 text-gray-400 hover:text-blue-400 border border-gray-700 hover:border-blue-800 py-2 rounded-xl transition-all" title="Export BOM">
            <Download className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="flex gap-1.5 mt-1.5">
          <button onClick={() => onToggleExpand(project.id)}
            className="flex-1 flex items-center justify-center gap-1 text-xs text-gray-500 hover:text-gray-300 py-1.5 rounded-xl transition-colors">
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${expanded ? "rotate-180" : ""}`} />
            {expanded ? "Less" : "Details"}
          </button>
          <button onClick={() => onDelete(project.id)} disabled={deleting}
            className="flex items-center justify-center px-3 text-xs text-red-500/60 hover:text-red-400 hover:bg-red-950/30 rounded-xl transition-all disabled:opacity-50">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

function ProjectListRow({ project, onDelete, deleting, onStatusChange, onExport, onEditNote }: {
  project: SavedProject; deleting: boolean;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, s: SavedProject["status"]) => void;
  onExport: (p: SavedProject) => void;
  onEditNote: (id: string, note?: string) => void;
}) {
  const hw = project.analysis?.hardware?.length || 0;
  const sw = project.analysis?.software?.length || 0;
  const status = project.status || "planning";
  const sc = STATUS_CONFIG[status];
  const date = new Date(project.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short" });

  return (
    <div className="group bg-gray-900 border border-gray-800 hover:border-cyan-800/50 rounded-2xl px-5 py-4 flex items-center gap-4 transition-all">
      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
        {project.project_title.split(" ").slice(0, 2).map(w => w[0]).join("").toUpperCase()}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-white font-medium text-sm truncate group-hover:text-cyan-300 transition-colors">{project.project_title}</p>
        <div className="flex items-center gap-3 mt-1 text-xs text-gray-500 flex-wrap">
          <span className="flex items-center gap-1"><Cpu className="w-3 h-3 text-cyan-500" />{hw}</span>
          <span className="flex items-center gap-1"><Code className="w-3 h-3 text-purple-500" />{sw}</span>
          <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{date}</span>
          <span className={`flex items-center gap-1 ${sc.color}`}>{sc.icon}{sc.label}</span>
        </div>
      </div>
      <div className="flex items-center gap-1.5 flex-shrink-0">
        <Link href={`/search?q=${encodeURIComponent(project.project_title)}`}
          className="flex items-center gap-1 text-xs bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-700 px-3 py-2 rounded-xl transition-all">
          <ExternalLink className="w-3.5 h-3.5" /> Open
        </Link>
        <button onClick={() => onEditNote(project.id, project.notes)} title="Notes"
          className="p-2 text-gray-600 hover:text-green-400 hover:bg-green-950/30 rounded-xl transition-all">
          <Pencil className="w-4 h-4" />
        </button>
        <button onClick={() => onExport(project)} title="Export BOM"
          className="p-2 text-gray-600 hover:text-blue-400 hover:bg-blue-950/30 rounded-xl transition-all">
          <Download className="w-4 h-4" />
        </button>
        <button onClick={() => onDelete(project.id)} disabled={deleting}
          className="p-2 text-gray-600 hover:text-red-400 hover:bg-red-950/30 rounded-xl transition-all disabled:opacity-50">
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
