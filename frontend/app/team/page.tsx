"use client";
import { useState } from "react";
import Link from "next/link";
import {
  Linkedin, Mail, ExternalLink, Code2, Cpu, Brain,
  Database, Globe, Zap, Star, Award, BookOpen, ArrowLeft,
  ChevronDown, ChevronUp, Layers, Bot, BarChart3, MapPin,
} from "lucide-react";

const GithubIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
  </svg>
);

// ── Team Data ─────────────────────────────────────────────────────────────────
const TEAM = [
  {
    id: 1,
    name: "SURIYAKUMAR E",
    role: "Full Stack Developer & Team Lead",
    dept: "AIML",
    num: "01",
    avatar: "S",
    color: "from-cyan-500 to-blue-600",
    glow: "shadow-cyan-500/30",
    border: "border-cyan-800/50",
    bg: "bg-cyan-950/30",
    tagColor: "text-cyan-400 bg-cyan-950/60 border-cyan-800/50",
    bio: "Led the full-stack development of COTsify. Designed the system architecture, built the FastAPI backend, and implemented the AI-powered component extraction pipeline using Gemini and OpenAI APIs.",
    contributions: [
      { icon: <Bot className="w-4 h-4" />, title: "AI Integration", desc: "Integrated Gemini 2.0 Flash and GPT-4o-mini for intelligent component extraction" },
      { icon: <Code2 className="w-4 h-4" />, title: "Backend API", desc: "Built FastAPI backend with 8 route modules, Supabase auth, and CORS configuration" },
      { icon: <Globe className="w-4 h-4" />, title: "Frontend Architecture", desc: "Designed Next.js 16 app structure with auth context, route guards, and state management" },
      { icon: <Zap className="w-4 h-4" />, title: "Deployment", desc: "Deployed frontend on Vercel and backend on Render with CI/CD via GitHub" },
    ],
    skills: ["Next.js", "FastAPI", "Python", "TypeScript", "Supabase", "Vercel", "OpenAI API", "Gemini API"],
    github: "https://github.com/SURIYAKUMARE",
    linkedin: "#",
    email: "suryaaswin000@gmail.com",
  },
  {
    id: 2,
    name: "JEFFREYNICKALAS M",
    role: "AI/ML Engineer",
    dept: "AIML",
    num: "02",
    avatar: "J",
    color: "from-blue-500 to-purple-600",
    glow: "shadow-blue-500/30",
    border: "border-blue-800/50",
    bg: "bg-blue-950/30",
    tagColor: "text-blue-400 bg-blue-950/60 border-blue-800/50",
    bio: "Focused on the machine learning pipeline and AI model integration. Designed the prompt engineering strategy for component extraction and built the intelligent chat assistant with context-aware responses.",
    contributions: [
      { icon: <Brain className="w-4 h-4" />, title: "Prompt Engineering", desc: "Designed system prompts for accurate BOM extraction across 500+ component types" },
      { icon: <Bot className="w-4 h-4" />, title: "Chat Assistant", desc: "Built the COTsify AI chat with local knowledge base and multi-model fallback" },
      { icon: <Layers className="w-4 h-4" />, title: "Model Pipeline", desc: "Implemented Gemini → OpenAI → local fallback chain for 100% uptime" },
      { icon: <Database className="w-4 h-4" />, title: "Data Processing", desc: "Built component catalog with 500+ entries and technical specifications" },
    ],
    skills: ["Python", "LangChain", "Gemini API", "OpenAI API", "Prompt Engineering", "NLP", "FastAPI", "JSON"],
    github: "#",
    linkedin: "#",
    email: "jeffrey@example.com",
  },
  {
    id: 3,
    name: "JOVITA D",
    role: "UI/UX Designer & Frontend Developer",
    dept: "AIML",
    num: "03",
    avatar: "J",
    color: "from-purple-500 to-pink-600",
    glow: "shadow-purple-500/30",
    border: "border-purple-800/50",
    bg: "bg-purple-950/30",
    tagColor: "text-purple-400 bg-purple-950/60 border-purple-800/50",
    bio: "Designed the complete UI/UX of COTsify with a focus on dark-mode aesthetics and intuitive user flows. Built the component catalog, explore page, and learning modules with responsive design.",
    contributions: [
      { icon: <Star className="w-4 h-4" />, title: "UI/UX Design", desc: "Designed the dark-mode interface with glassmorphism effects and gradient accents" },
      { icon: <BookOpen className="w-4 h-4" />, title: "Catalog & Learn", desc: "Built the component catalog browser and interactive learning modules" },
      { icon: <Layers className="w-4 h-4" />, title: "Component Cards", desc: "Designed reusable component cards with bookmark, compare, and cart features" },
      { icon: <Globe className="w-4 h-4" />, title: "Responsive Design", desc: "Ensured full mobile responsiveness across all 12 pages" },
    ],
    skills: ["Tailwind CSS", "React", "Figma", "TypeScript", "Next.js", "Framer Motion", "Accessibility", "SVG"],
    github: "#",
    linkedin: "#",
    email: "jovita@example.com",
  },
  {
    id: 4,
    name: "PREDEEP KV",
    role: "Data Engineer & Research Lead",
    dept: "AIML",
    num: "04",
    avatar: "P",
    color: "from-pink-500 to-rose-600",
    glow: "shadow-pink-500/30",
    border: "border-pink-800/50",
    bg: "bg-pink-950/30",
    tagColor: "text-pink-400 bg-pink-950/60 border-pink-800/50",
    bio: "Led the research and data engineering aspects of COTsify. Built the price comparison engine, Google Maps integration for nearby stores, and the project timeline estimation system.",
    contributions: [
      { icon: <BarChart3 className="w-4 h-4" />, title: "Price Comparison", desc: "Built multi-platform price scraping and comparison engine for Amazon, Flipkart, Robu.in" },
      { icon: <MapPin className="w-4 h-4" />, title: "Maps Integration", desc: "Integrated Google Maps Places API for real-time nearby electronics store discovery" },
      { icon: <Database className="w-4 h-4" />, title: "Database Design", desc: "Designed Supabase schema for projects, components, and user profiles" },
      { icon: <Cpu className="w-4 h-4" />, title: "Research", desc: "Researched 500+ electronic components and curated pricing data for Indian market" },
    ],
    skills: ["PostgreSQL", "Supabase", "Google Maps API", "Python", "Data Analysis", "REST APIs", "SQL", "Research"],
    github: "#",
    linkedin: "#",
    email: "predeep@example.com",
  },
];

const PROJECT_STATS = [
  { value: "12", label: "Pages Built", color: "text-cyan-400" },
  { value: "500+", label: "Components", color: "text-blue-400" },
  { value: "8", label: "API Routes", color: "text-purple-400" },
  { value: "4", label: "AI Models", color: "text-pink-400" },
];

// ── Member Card ───────────────────────────────────────────────────────────────
function MemberCard({ member }: { member: typeof TEAM[0] }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={`group relative bg-gray-900/60 border ${member.border} rounded-3xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1`}>
      {/* Gradient top bar */}
      <div className={`h-1.5 w-full bg-gradient-to-r ${member.color}`} />

      {/* Glow background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${member.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300 pointer-events-none`} />

      <div className="p-6 relative">
        {/* Header */}
        <div className="flex items-start gap-4 mb-5">
          <div className="relative flex-shrink-0">
            <div className={`w-16 h-16 bg-gradient-to-br ${member.color} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
              <span className="text-white font-bold text-2xl">{member.avatar}</span>
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gray-900 border border-gray-700 rounded-full flex items-center justify-center">
              <span className="text-gray-500 text-xs font-mono">{member.num}</span>
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-white font-bold text-lg leading-tight group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:from-white group-hover:to-gray-300 transition-all">
              {member.name}
            </h3>
            <p className="text-gray-400 text-sm mt-0.5">{member.role}</p>
            <span className={`inline-flex items-center text-xs px-2.5 py-0.5 rounded-full border font-medium mt-2 ${member.tagColor}`}>
              {member.dept}
            </span>
          </div>
        </div>

        {/* Bio */}
        <p className="text-gray-400 text-sm leading-relaxed mb-5">{member.bio}</p>

        {/* Skills */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          {member.skills.map(skill => (
            <span key={skill} className="text-xs bg-gray-800 border border-gray-700 text-gray-300 px-2.5 py-1 rounded-full">
              {skill}
            </span>
          ))}
        </div>

        {/* Contributions toggle */}
        <button
          onClick={() => setExpanded(!expanded)}
          className={`w-full flex items-center justify-between text-sm font-medium px-4 py-2.5 rounded-xl border transition-all ${member.bg} ${member.border}`}
        >
          <span className={member.tagColor.split(" ")[0]}>View Contributions ({member.contributions.length})</span>
          {expanded ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
        </button>

        {/* Contributions expanded */}
        {expanded && (
          <div className="mt-3 flex flex-col gap-2">
            {member.contributions.map((c) => (
              <div key={c.title} className={`flex items-start gap-3 p-3 rounded-xl border ${member.bg} ${member.border}`}>
                <div className={`mt-0.5 flex-shrink-0 ${member.tagColor.split(" ")[0]}`}>{c.icon}</div>
                <div>
                  <p className="text-white text-sm font-medium">{c.title}</p>
                  <p className="text-gray-500 text-xs mt-0.5">{c.desc}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Social links */}
        <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-800">
          {member.github !== "#" && (
            <a href={member.github} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-white bg-gray-800 hover:bg-gray-700 border border-gray-700 px-3 py-1.5 rounded-lg transition-all">
              <GithubIcon className="w-3.5 h-3.5" /> GitHub
            </a>
          )}
          <a href={`mailto:${member.email}`}
            className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-white bg-gray-800 hover:bg-gray-700 border border-gray-700 px-3 py-1.5 rounded-lg transition-all">
            <Mail className="w-3.5 h-3.5" /> Email
          </a>
          <a href={member.linkedin} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-blue-400 bg-gray-800 hover:bg-gray-700 border border-gray-700 px-3 py-1.5 rounded-lg transition-all ml-auto">
            <Linkedin className="w-3.5 h-3.5" /> LinkedIn
          </a>
        </div>
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function TeamPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative px-4 pt-16 pb-20 overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(6,182,212,0.15),transparent)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_40%_30%_at_80%_80%,rgba(139,92,246,0.1),transparent)]" />
          <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: "linear-gradient(rgba(6,182,212,1) 1px, transparent 1px), linear-gradient(90deg, rgba(6,182,212,1) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
        </div>

        <div className="relative max-w-4xl mx-auto text-center">
          <Link href="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-300 text-sm mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to home
          </Link>

          <div className="inline-flex items-center gap-2 bg-cyan-950/60 border border-cyan-800/60 text-cyan-400 text-xs px-4 py-2 rounded-full mb-6">
            <Users className="w-3.5 h-3.5" /> Meet the Team
          </div>

          <h1 className="text-5xl sm:text-6xl font-bold mb-4">
            <span className="text-white">Built by </span>
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500 bg-clip-text text-transparent">AIML Students</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-10">
            COTsify is a final year project by 4 passionate AIML students who wanted to make electronics sourcing smarter for every maker in India.
          </p>

          {/* Project stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto">
            {PROJECT_STATS.map(s => (
              <div key={s.label} className="bg-gray-900/60 border border-gray-800 rounded-2xl p-4 text-center backdrop-blur-sm">
                <div className={`text-3xl font-bold ${s.color} mb-1`}>{s.value}</div>
                <div className="text-gray-500 text-xs">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team grid */}
      <section className="px-4 pb-20 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="grid sm:grid-cols-2 xl:grid-cols-2 gap-6">
            {TEAM.map(member => (
              <MemberCard key={member.id} member={member} />
            ))}
          </div>
        </div>
      </section>

      {/* Project info */}
      <section className="px-4 pb-20 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-gray-900/80 to-gray-900/40 border border-gray-800 rounded-3xl p-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_50%_50%,rgba(6,182,212,0.05),transparent)] pointer-events-none" />
            <div className="relative">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-white font-bold text-xl">About the Project</h2>
                  <p className="text-gray-500 text-sm">Final Year Project — 2025</p>
                </div>
              </div>
              <p className="text-gray-400 leading-relaxed mb-6">
                COTsify (Component Optimization Tool) is an AI-powered platform that helps engineering students and makers identify, source, and compare electronic components for any project. Built with Next.js, FastAPI, Supabase, and multiple AI APIs, it represents a complete full-stack solution developed as a final year project by the AIML department.
              </p>
              <div className="grid sm:grid-cols-3 gap-4">
                {[
                  { label: "Department", value: "Artificial Intelligence & Machine Learning" },
                  { label: "Year", value: "Final Year — 2025" },
                  { label: "Tech Stack", value: "Next.js · FastAPI · Supabase · Gemini AI" },
                ].map(item => (
                  <div key={item.label} className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
                    <p className="text-gray-500 text-xs mb-1">{item.label}</p>
                    <p className="text-white text-sm font-medium">{item.value}</p>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-3 mt-6">
                <a href="https://github.com/SURIYAKUMARE/COTSify" target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-300 hover:text-white px-4 py-2 rounded-xl text-sm transition-all">
                  <GithubIcon className="w-4 h-4" /> View on GitHub
                </a>
                <Link href="/search"
                  className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white px-4 py-2 rounded-xl text-sm transition-all font-medium">
                  <ExternalLink className="w-4 h-4" /> Try COTsify
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// Need Users import
function Users({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  );
}
