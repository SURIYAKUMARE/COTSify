"use client";
import { useState } from "react";
import Link from "next/link";
import RouteGuard from "@/components/RouteGuard";
import {
  Compass,
  Search,
  Cpu,
  Bot,
  Brain,
  Home,
  Shield,
  Leaf,
  ChevronRight,
  Zap,
  Package,
  Star,
} from "lucide-react";

type Difficulty = "Beginner" | "Intermediate" | "Advanced";
type Category = "IoT" | "Robotics" | "AI/ML" | "Home Automation" | "Security" | "Environment";

interface Project {
  name: string;
  difficulty: Difficulty;
  cost: number;
  components: number;
  category: Category;
  description: string;
}

const PROJECTS: Project[] = [
  { name: "Smart Irrigation System", difficulty: "Beginner", cost: 1800, components: 8, category: "IoT", description: "Automate plant watering using soil moisture sensors and ESP8266." },
  { name: "Line Following Robot", difficulty: "Beginner", cost: 2200, components: 6, category: "Robotics", description: "Build a robot that follows a black line using IR sensors." },
  { name: "Home Automation", difficulty: "Intermediate", cost: 6500, components: 5, category: "Home Automation", description: "Control lights, fans, and appliances via smartphone app." },
  { name: "Face Recognition Attendance", difficulty: "Advanced", cost: 4500, components: 5, category: "AI/ML", description: "Automated attendance system using OpenCV and Raspberry Pi." },
  { name: "Smart Parking System", difficulty: "Intermediate", cost: 2500, components: 7, category: "IoT", description: "Real-time parking slot detection with ultrasonic sensors." },
  { name: "Accident Detection Alert", difficulty: "Intermediate", cost: 3200, components: 6, category: "IoT", description: "Detect vehicle accidents and send GPS alerts via GSM module." },
  { name: "AI Virtual Assistant", difficulty: "Advanced", cost: 5500, components: 5, category: "AI/ML", description: "Voice-controlled assistant using NLP and Raspberry Pi." },
  { name: "Smart Helmet Safety", difficulty: "Intermediate", cost: 1500, components: 6, category: "Security", description: "Helmet with alcohol detection and accident alert system." },
  { name: "Object Detection System", difficulty: "Advanced", cost: 4000, components: 3, category: "AI/ML", description: "Real-time object detection using YOLO and camera module." },
  { name: "Fire Detection System", difficulty: "Beginner", cost: 800, components: 5, category: "Security", description: "Detect fire and smoke with automatic alarm and notification." },
  { name: "Gesture Controlled Robot", difficulty: "Advanced", cost: 3500, components: 6, category: "Robotics", description: "Control a robot using hand gestures via accelerometer." },
  { name: "Smart Street Light", difficulty: "Beginner", cost: 1200, components: 5, category: "Environment", description: "Auto-dimming street lights with LDR and motion sensors." },
  { name: "Human Following Robot", difficulty: "Advanced", cost: 2800, components: 5, category: "Robotics", description: "Robot that tracks and follows a human using ultrasonic sensors." },
  { name: "RFID Door Lock", difficulty: "Intermediate", cost: 1800, components: 6, category: "Security", description: "Secure door access system using RFID cards and Arduino." },
  { name: "Weather Monitoring Station", difficulty: "Beginner", cost: 1500, components: 5, category: "Environment", description: "Monitor temperature, humidity, and pressure with IoT dashboard." },
  { name: "Health Monitoring System", difficulty: "Intermediate", cost: 2500, components: 5, category: "IoT", description: "Track heart rate, SpO2, and temperature with cloud sync." },
  { name: "Smart Water Level Indicator", difficulty: "Beginner", cost: 900, components: 5, category: "IoT", description: "Monitor water tank levels with LED indicators and alerts." },
  { name: "IoT Smart Energy Meter", difficulty: "Intermediate", cost: 2000, components: 4, category: "IoT", description: "Measure and monitor home energy consumption in real time." },
  { name: "Smart Surveillance System", difficulty: "Advanced", cost: 5000, components: 4, category: "Security", description: "AI-powered CCTV with motion detection and cloud storage." },
  { name: "Bluetooth Controlled Car", difficulty: "Beginner", cost: 1800, components: 6, category: "Robotics", description: "Build a car controlled via Bluetooth from your smartphone." },
];

const CATEGORY_ICONS: Record<Category, React.ReactNode> = {
  IoT: <Cpu className="w-4 h-4" />,
  Robotics: <Bot className="w-4 h-4" />,
  "AI/ML": <Brain className="w-4 h-4" />,
  "Home Automation": <Home className="w-4 h-4" />,
  Security: <Shield className="w-4 h-4" />,
  Environment: <Leaf className="w-4 h-4" />,
};

const CATEGORY_COLORS: Record<Category, string> = {
  IoT: "from-cyan-500/20 to-blue-500/20 border-cyan-800/50 text-cyan-400",
  Robotics: "from-purple-500/20 to-pink-500/20 border-purple-800/50 text-purple-400",
  "AI/ML": "from-orange-500/20 to-red-500/20 border-orange-800/50 text-orange-400",
  "Home Automation": "from-green-500/20 to-teal-500/20 border-green-800/50 text-green-400",
  Security: "from-red-500/20 to-rose-500/20 border-red-800/50 text-red-400",
  Environment: "from-emerald-500/20 to-lime-500/20 border-emerald-800/50 text-emerald-400",
};

const CATEGORY_BADGE: Record<Category, string> = {
  IoT: "bg-cyan-950 text-cyan-400 border-cyan-800",
  Robotics: "bg-purple-950 text-purple-400 border-purple-800",
  "AI/ML": "bg-orange-950 text-orange-400 border-orange-800",
  "Home Automation": "bg-green-950 text-green-400 border-green-800",
  Security: "bg-red-950 text-red-400 border-red-800",
  Environment: "bg-emerald-950 text-emerald-400 border-emerald-800",
};

const DIFFICULTY_COLORS: Record<Difficulty, string> = {
  Beginner: "bg-green-950 text-green-400 border-green-800",
  Intermediate: "bg-yellow-950 text-yellow-400 border-yellow-800",
  Advanced: "bg-red-950 text-red-400 border-red-800",
};

const DIFFICULTY_STARS: Record<Difficulty, number> = {
  Beginner: 1,
  Intermediate: 2,
  Advanced: 3,
};

const ALL_CATEGORIES: ("All" | Category)[] = [
  "All", "IoT", "Robotics", "AI/ML", "Home Automation", "Security", "Environment",
];
const ALL_DIFFICULTIES: ("All" | Difficulty)[] = ["All", "Beginner", "Intermediate", "Advanced"];

function ProjectCard({ project }: { project: Project }) {
  const colorClass = CATEGORY_COLORS[project.category];
  const badgeClass = CATEGORY_BADGE[project.category];
  const diffClass = DIFFICULTY_COLORS[project.difficulty];
  const stars = DIFFICULTY_STARS[project.difficulty];

  return (
    <div
      className={`group relative bg-gradient-to-br ${colorClass} border rounded-2xl p-5 flex flex-col gap-3 hover:-translate-y-1 hover:shadow-lg hover:shadow-cyan-500/10 transition-all duration-300 backdrop-blur-sm`}
    >
      {/* Glow overlay on hover */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border font-medium ${badgeClass}`}>
          {CATEGORY_ICONS[project.category]}
          {project.category}
        </div>
        <div className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded-full border font-medium ${diffClass}`}>
          {Array.from({ length: 3 }).map((_, i) => (
            <Star
              key={i}
              className="w-2.5 h-2.5"
              fill={i < stars ? "currentColor" : "none"}
            />
          ))}
          {project.difficulty}
        </div>
      </div>

      {/* Title */}
      <h3 className="text-white font-bold text-base leading-snug">{project.name}</h3>

      {/* Description */}
      <p className="text-gray-400 text-xs leading-relaxed flex-1">{project.description}</p>

      {/* Stats row */}
      <div className="flex items-center gap-3 text-xs text-gray-400">
        <span className="flex items-center gap-1">
          <Zap className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-white font-semibold">₹{project.cost.toLocaleString()}</span>
        </span>
        <span className="text-gray-600">·</span>
        <span className="flex items-center gap-1">
          <Package className="w-3.5 h-3.5 text-purple-400" />
          <span className="text-white font-semibold">{project.components}</span> parts
        </span>
      </div>

      {/* Analyze button */}
      <Link
        href={`/search?q=${encodeURIComponent(project.name)}`}
        className="flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold py-2.5 rounded-xl text-sm transition-all group-hover:shadow-md group-hover:shadow-cyan-500/20"
      >
        Analyze Project
        <ChevronRight className="w-4 h-4" />
      </Link>
    </div>
  );
}

const QUICK_PICKS = [
  PROJECTS[0], // Smart Irrigation
  PROJECTS[1], // Line Following Robot
  PROJECTS[9], // Fire Detection
];

const SORT_OPTIONS = [
  { value: "default", label: "Default" },
  { value: "cost_asc", label: "Cost: Low → High" },
  { value: "cost_desc", label: "Cost: High → Low" },
  { value: "difficulty", label: "Difficulty" },
  { value: "category", label: "Category" },
];

function ExplorePage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<"All" | Category>("All");
  const [selectedDifficulty, setSelectedDifficulty] = useState<"All" | Difficulty>("All");
  const [sortBy, setSortBy] = useState("default");

  const filtered = PROJECTS.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchCat = selectedCategory === "All" || p.category === selectedCategory;
    const matchDiff = selectedDifficulty === "All" || p.difficulty === selectedDifficulty;
    return matchSearch && matchCat && matchDiff;
  }).sort((a, b) => {
    if (sortBy === "cost_asc") return a.cost - b.cost;
    if (sortBy === "cost_desc") return b.cost - a.cost;
    if (sortBy === "difficulty") {
      const order = { Beginner: 0, Intermediate: 1, Advanced: 2 };
      return order[a.difficulty] - order[b.difficulty];
    }
    if (sortBy === "category") return a.category.localeCompare(b.category);
    return 0;
  });

  const minCost = Math.min(...PROJECTS.map(p => p.cost));
  const maxCost = Math.max(...PROJECTS.map(p => p.cost));
  const categories = new Set(PROJECTS.map(p => p.category));

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-b from-gray-900 to-transparent border-b border-gray-800 px-4 py-12">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(6,182,212,0.15),transparent)] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_40%_40%_at_80%_50%,rgba(139,92,246,0.08),transparent)] pointer-events-none" />
        <div className="max-w-4xl mx-auto relative text-center">
          <div className="inline-flex items-center gap-2 bg-cyan-950/60 border border-cyan-800/50 text-cyan-400 text-xs px-4 py-1.5 rounded-full mb-4">
            <Compass className="w-3.5 h-3.5" />
            Project Explorer
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">
            Discover Your Next{" "}
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Build
            </span>
          </h1>
          <p className="text-gray-400 text-sm sm:text-base mb-8 max-w-xl mx-auto">
            Browse 20 curated project ideas across IoT, Robotics, AI/ML and more. Click Analyze to get a full component list and cost breakdown.
          </p>

          {/* Search */}
          <div className="relative max-w-lg mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search projects..."
              className="w-full bg-gray-900 border border-gray-700 rounded-2xl pl-11 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-600 transition-colors text-sm"
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* ── Stats bar ──────────────────────────────────────────────────── */}
        <div className="bg-gray-900/60 border border-gray-800 rounded-2xl px-5 py-3 mb-8 flex flex-wrap items-center gap-4 backdrop-blur-sm">
          <div className="flex items-center gap-2 text-sm">
            <span className="w-2 h-2 rounded-full bg-cyan-400 inline-block" />
            <span className="text-white font-semibold">{PROJECTS.length} Projects</span>
          </div>
          <div className="w-px h-4 bg-gray-700 hidden sm:block" />
          <div className="flex items-center gap-2 text-sm">
            <span className="w-2 h-2 rounded-full bg-blue-400 inline-block" />
            <span className="text-white font-semibold">{categories.size} Categories</span>
          </div>
          <div className="w-px h-4 bg-gray-700 hidden sm:block" />
          <div className="flex items-center gap-2 text-sm">
            <span className="w-2 h-2 rounded-full bg-green-400 inline-block" />
            <span className="text-white font-semibold">₹{minCost.toLocaleString()} – ₹{maxCost.toLocaleString()} range</span>
          </div>
          <div className="w-px h-4 bg-gray-700 hidden sm:block" />
          <div className="flex items-center gap-2 text-sm">
            <span className="w-2 h-2 rounded-full bg-purple-400 inline-block" />
            <span className="text-white font-semibold">Beginner to Advanced</span>
          </div>
        </div>

        {/* ── Quick Picks ────────────────────────────────────────────────── */}
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-lg">🔥</span>
            <h2 className="text-white font-bold text-lg">Quick Picks</h2>
            <span className="text-gray-500 text-sm">— most popular projects</span>
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            {QUICK_PICKS.map((project) => (
              <div key={project.name}
                className={`group relative bg-gradient-to-br ${CATEGORY_COLORS[project.category]} border rounded-2xl p-5 flex flex-col gap-3 hover:-translate-y-1 hover:shadow-lg hover:shadow-cyan-500/10 transition-all duration-300 backdrop-blur-sm`}>
                <div className="absolute top-3 right-3">
                  <span className="text-xs bg-orange-500/20 border border-orange-500/40 text-orange-400 px-2 py-0.5 rounded-full font-medium">🔥 Popular</span>
                </div>
                <div className="flex items-start gap-2 pr-16">
                  <div className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border font-medium ${CATEGORY_BADGE[project.category]}`}>
                    {CATEGORY_ICONS[project.category]}
                    {project.category}
                  </div>
                </div>
                <h3 className="text-white font-bold text-base leading-snug">{project.name}</h3>
                <p className="text-gray-400 text-xs leading-relaxed flex-1">{project.description}</p>
                <div className="flex items-center gap-3 text-xs text-gray-400">
                  <span className="flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5 text-cyan-400" />
                    <span className="text-white font-semibold">₹{project.cost.toLocaleString()}</span>
                  </span>
                  <span className="text-gray-600">·</span>
                  <span className="flex items-center gap-1">
                    <Package className="w-3.5 h-3.5 text-purple-400" />
                    <span className="text-white font-semibold">{project.components}</span> parts
                  </span>
                </div>
                <Link
                  href={`/search?q=${encodeURIComponent(project.name)}`}
                  className="flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold py-2.5 rounded-xl text-sm transition-all">
                  Analyze Project
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Filters + Sort */}
        <div className="flex flex-wrap gap-4 mb-6">
          {/* Category filter */}
          <div className="flex flex-wrap gap-2">
            <span className="text-gray-500 text-xs self-center mr-1">Category:</span>
            {ALL_CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border transition-all ${
                  selectedCategory === cat
                    ? "bg-cyan-500 text-gray-950 border-cyan-500 font-semibold"
                    : "bg-gray-900 text-gray-400 border-gray-700 hover:border-cyan-700 hover:text-cyan-400"
                }`}
              >
                {cat !== "All" && CATEGORY_ICONS[cat as Category]}
                {cat}
              </button>
            ))}
          </div>

          {/* Difficulty filter */}
          <div className="flex flex-wrap gap-2">
            <span className="text-gray-500 text-xs self-center mr-1">Difficulty:</span>
            {ALL_DIFFICULTIES.map((diff) => (
              <button
                key={diff}
                onClick={() => setSelectedDifficulty(diff)}
                className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                  selectedDifficulty === diff
                    ? "bg-cyan-500 text-gray-950 border-cyan-500 font-semibold"
                    : "bg-gray-900 text-gray-400 border-gray-700 hover:border-cyan-700 hover:text-cyan-400"
                }`}
              >
                {diff}
              </button>
            ))}
          </div>

          {/* Sort */}
          <div className="flex items-center gap-2 ml-auto">
            <span className="text-gray-500 text-xs">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-gray-900 border border-gray-700 text-gray-300 text-xs rounded-xl px-3 py-1.5 focus:outline-none focus:border-cyan-600 transition-colors"
            >
              {SORT_OPTIONS.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Results count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-400 text-sm">
            Showing <span className="text-white font-semibold">{filtered.length}</span> of{" "}
            <span className="text-white font-semibold">{PROJECTS.length}</span> projects
          </p>
          {(selectedCategory !== "All" || selectedDifficulty !== "All" || search) && (
            <button
              onClick={() => {
                setSearch("");
                setSelectedCategory("All");
                setSelectedDifficulty("All");
                setSortBy("default");
              }}
              className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              Clear filters
            </button>
          )}
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-24 bg-gray-900/50 border border-gray-800 rounded-2xl">
            <div className="text-5xl mb-4">🔍</div>
            <p className="text-white font-semibold mb-2">No projects found</p>
            <p className="text-gray-400 text-sm">Try adjusting your filters or search term</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map((project) => (
              <ProjectCard key={project.name} project={project} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function ExplorePage_() {
  return (
    <RouteGuard>
      <ExplorePage />
    </RouteGuard>
  );
}
