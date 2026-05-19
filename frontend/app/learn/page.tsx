"use client";
import { useState, useEffect } from "react";
import RouteGuard from "@/components/RouteGuard";
import {
  GraduationCap, BookOpen, Play, CheckCircle2, Clock, Star,
  ExternalLink, Filter, Zap, Award, TrendingUp, Video,
  Globe, ChevronRight, Search, Lock, Unlock, BarChart3,
} from "lucide-react";

const LEARN_KEY = "cotsify_learn_progress";

interface Course {
  id: string; title: string; provider: string; category: string;
  level: "Beginner" | "Intermediate" | "Advanced"; duration: string;
  rating: number; students: string; url: string; free: boolean;
  cert: boolean; description: string; tags: string[];
}

const COURSES: Course[] = [
  // Electronics Basics
  { id: "e1", title: "Introduction to Electronics", provider: "Coursera (UC San Diego)", category: "Electronics", level: "Beginner", duration: "6 weeks", rating: 4.7, students: "280K", url: "https://www.coursera.org/learn/electronics", free: true, cert: true, description: "Learn resistors, capacitors, transistors and basic circuit analysis. Audit for free.", tags: ["circuits", "resistors", "capacitors"] },
  { id: "e2", title: "Electronic Circuits 1 – Basic Circuit Analysis", provider: "edX (Georgia Tech)", category: "Electronics", level: "Beginner", duration: "5 weeks", rating: 4.6, students: "150K", url: "https://www.edx.org/course/electronic-circuits-1-basic-circuit-analysis", free: true, cert: true, description: "Fundamental circuit analysis techniques. Audit free on edX.", tags: ["circuit-analysis", "kvl", "kcl"] },
  { id: "e3", title: "Basic Electronics – NPTEL", provider: "NPTEL (IIT)", category: "Electronics", level: "Beginner", duration: "12 weeks", rating: 4.8, students: "500K", url: "https://nptel.ac.in/courses/108/105/108105132/", free: true, cert: true, description: "Completely free IIT course with certificate exam. Covers semiconductors, diodes, transistors.", tags: ["nptel", "iit", "semiconductors"] },
  { id: "e4", title: "Analog Electronics – NPTEL", provider: "NPTEL (IIT Kharagpur)", category: "Electronics", level: "Intermediate", duration: "12 weeks", rating: 4.7, students: "320K", url: "https://nptel.ac.in/courses/108/105/108105066/", free: true, cert: true, description: "Op-amps, filters, oscillators. Free with paid certificate option.", tags: ["analog", "op-amp", "filters"] },
  // Arduino / Embedded
  { id: "a1", title: "Arduino Step by Step – Complete Course", provider: "YouTube (Paul McWhorter)", category: "Arduino", level: "Beginner", duration: "40 hours", rating: 4.9, students: "2M", url: "https://www.youtube.com/playlist?list=PLGs0VKk2DiYw-L-RibttcvK-WBZm8WLEP", free: true, cert: false, description: "The most comprehensive free Arduino course on YouTube. 73 lessons from scratch.", tags: ["arduino", "sensors", "projects"] },
  { id: "a2", title: "Arduino Programming & Hardware Fundamentals", provider: "Coursera (UC San Diego)", category: "Arduino", level: "Beginner", duration: "4 weeks", rating: 4.5, students: "95K", url: "https://www.coursera.org/learn/arduino-programming", free: true, cert: true, description: "Hands-on Arduino programming. Audit free on Coursera.", tags: ["arduino", "programming", "hardware"] },
  { id: "a3", title: "Embedded Systems – NPTEL", provider: "NPTEL (IIT Delhi)", category: "Arduino", level: "Intermediate", duration: "12 weeks", rating: 4.6, students: "180K", url: "https://nptel.ac.in/courses/108/102/108102045/", free: true, cert: true, description: "Microcontrollers, interrupts, timers, communication protocols. Free IIT course.", tags: ["embedded", "microcontroller", "rtos"] },
  { id: "a4", title: "ESP32 & ESP8266 – Complete Guide", provider: "YouTube (Random Nerd Tutorials)", category: "Arduino", level: "Intermediate", duration: "20 hours", rating: 4.8, students: "800K", url: "https://www.youtube.com/c/RandomNerdTutorials", free: true, cert: false, description: "Best free resource for ESP32/ESP8266 WiFi projects, sensors, web servers.", tags: ["esp32", "esp8266", "wifi"] },
  // IoT
  { id: "i1", title: "Introduction to the Internet of Things", provider: "Coursera (UC San Diego)", category: "IoT", level: "Beginner", duration: "5 weeks", rating: 4.6, students: "420K", url: "https://www.coursera.org/learn/iot", free: true, cert: true, description: "IoT architecture, sensors, actuators, networking. Audit free.", tags: ["iot", "sensors", "networking"] },
  { id: "i2", title: "IoT Specialization – 6 Courses", provider: "Coursera (UC San Diego)", category: "IoT", level: "Intermediate", duration: "6 months", rating: 4.5, students: "200K", url: "https://www.coursera.org/specializations/internet-of-things", free: true, cert: true, description: "Complete IoT specialization: sensors, Raspberry Pi, Arduino, cloud. Audit each course free.", tags: ["iot", "raspberry-pi", "cloud"] },
  { id: "i3", title: "IoT and Embedded Systems – NPTEL", provider: "NPTEL (IIT Bombay)", category: "IoT", level: "Intermediate", duration: "12 weeks", rating: 4.7, students: "250K", url: "https://nptel.ac.in/courses/106/105/106105166/", free: true, cert: true, description: "MQTT, cloud platforms, edge computing. Free with certificate.", tags: ["iot", "mqtt", "cloud", "edge"] },
  { id: "i4", title: "AWS IoT Core – Getting Started", provider: "AWS Training (Free)", category: "IoT", level: "Intermediate", duration: "4 hours", rating: 4.4, students: "120K", url: "https://explore.skillbuilder.aws/learn/course/external/view/elearning/194/aws-iot-getting-started", free: true, cert: true, description: "Connect devices to AWS IoT Core. Free AWS digital badge.", tags: ["aws", "iot", "cloud", "mqtt"] },
  // Robotics
  { id: "r1", title: "Robotics Specialization", provider: "Coursera (UPenn)", category: "Robotics", level: "Advanced", duration: "6 months", rating: 4.7, students: "180K", url: "https://www.coursera.org/specializations/robotics", free: true, cert: true, description: "Aerial robotics, kinematics, motion planning, perception. Audit free.", tags: ["robotics", "kinematics", "motion-planning"] },
  { id: "r2", title: "Modern Robotics – Northwestern", provider: "Coursera (Northwestern)", category: "Robotics", level: "Advanced", duration: "6 months", rating: 4.8, students: "95K", url: "https://www.coursera.org/specializations/modernrobotics", free: true, cert: true, description: "Mechanics, planning, control of robots. Rigorous mathematical treatment.", tags: ["robotics", "mechanics", "control"] },
  { id: "r3", title: "Robotics – NPTEL", provider: "NPTEL (IIT Bombay)", category: "Robotics", level: "Intermediate", duration: "12 weeks", rating: 4.6, students: "140K", url: "https://nptel.ac.in/courses/112/101/112101099/", free: true, cert: true, description: "Robot kinematics, dynamics, trajectory planning. Free IIT course.", tags: ["robotics", "kinematics", "nptel"] },
  { id: "r4", title: "ROS (Robot Operating System) Tutorial", provider: "YouTube (The Construct)", category: "Robotics", level: "Intermediate", duration: "15 hours", rating: 4.7, students: "500K", url: "https://www.youtube.com/c/TheConstruct", free: true, cert: false, description: "Complete ROS2 tutorials from beginner to advanced. Best free ROS resource.", tags: ["ros", "ros2", "robot-programming"] },
  // AI/ML
  { id: "m1", title: "Machine Learning – Andrew Ng", provider: "Coursera (Stanford)", category: "AI/ML", level: "Intermediate", duration: "11 weeks", rating: 4.9, students: "5M", url: "https://www.coursera.org/learn/machine-learning", free: true, cert: true, description: "The most famous ML course. Regression, neural networks, SVM. Audit free.", tags: ["machine-learning", "neural-networks", "python"] },
  { id: "m2", title: "Deep Learning Specialization", provider: "Coursera (deeplearning.ai)", category: "AI/ML", level: "Advanced", duration: "5 months", rating: 4.9, students: "800K", url: "https://www.coursera.org/specializations/deep-learning", free: true, cert: true, description: "CNNs, RNNs, transformers. Audit each course free.", tags: ["deep-learning", "cnn", "rnn", "tensorflow"] },
  { id: "m3", title: "TensorFlow for Microcontrollers (TinyML)", provider: "edX (Harvard)", category: "AI/ML", level: "Advanced", duration: "4 weeks", rating: 4.6, students: "80K", url: "https://www.edx.org/course/fundamentals-of-tinyml", free: true, cert: true, description: "Run ML models on Arduino and microcontrollers. Audit free.", tags: ["tinyml", "tensorflow", "arduino", "edge-ai"] },
  { id: "m4", title: "AI for Everyone – Andrew Ng", provider: "Coursera (deeplearning.ai)", category: "AI/ML", level: "Beginner", duration: "6 hours", rating: 4.8, students: "1.2M", url: "https://www.coursera.org/learn/ai-for-everyone", free: true, cert: true, description: "Non-technical AI overview. Perfect starting point. Audit free.", tags: ["ai", "overview", "beginner"] },
  // Python
  { id: "p1", title: "Python for Everybody Specialization", provider: "Coursera (UMich)", category: "Python", level: "Beginner", duration: "8 months", rating: 4.8, students: "2M", url: "https://www.coursera.org/specializations/python", free: true, cert: true, description: "Complete Python from scratch. Data structures, web scraping, databases. Audit free.", tags: ["python", "programming", "beginner"] },
  { id: "p2", title: "MicroPython for Microcontrollers", provider: "YouTube (Tony DiCola)", category: "Python", level: "Intermediate", duration: "8 hours", rating: 4.6, students: "200K", url: "https://www.youtube.com/results?search_query=micropython+tutorial+complete", free: true, cert: false, description: "Python on ESP32, Raspberry Pi Pico. Sensors, WiFi, MQTT.", tags: ["micropython", "esp32", "pico"] },
  // PCB Design
  { id: "c1", title: "PCB Design with KiCad", provider: "YouTube (Phil's Lab)", category: "PCB Design", level: "Intermediate", duration: "12 hours", rating: 4.9, students: "600K", url: "https://www.youtube.com/c/PhilsLab", free: true, cert: false, description: "Professional PCB design from schematic to fabrication using free KiCad software.", tags: ["pcb", "kicad", "schematic", "gerber"] },
  { id: "c2", title: "PCB Design – Altium Academy", provider: "Altium Academy (Free)", category: "PCB Design", level: "Intermediate", duration: "10 hours", rating: 4.5, students: "150K", url: "https://www.altium.com/altium-academy", free: true, cert: true, description: "Free PCB design courses with certificate from Altium.", tags: ["pcb", "altium", "design"] },
  { id: "c3", title: "VLSI Design – NPTEL", provider: "NPTEL (IIT Madras)", category: "PCB Design", level: "Advanced", duration: "12 weeks", rating: 4.6, students: "90K", url: "https://nptel.ac.in/courses/117/106/117106093/", free: true, cert: true, description: "CMOS design, layout, simulation. Free IIT course with certificate.", tags: ["vlsi", "cmos", "chip-design", "nptel"] },
];

const CATEGORIES = ["All", "Electronics", "Arduino", "IoT", "Robotics", "AI/ML", "Python", "PCB Design"];
const LEVELS = ["All", "Beginner", "Intermediate", "Advanced"];
const LEVEL_COLORS = {
  Beginner: "bg-green-950 text-green-400 border-green-800",
  Intermediate: "bg-yellow-950 text-yellow-400 border-yellow-800",
  Advanced: "bg-red-950 text-red-400 border-red-800",
};
const CAT_COLORS: Record<string, string> = {
  Electronics: "from-cyan-500 to-blue-600",
  Arduino: "from-blue-500 to-indigo-600",
  IoT: "from-teal-500 to-cyan-600",
  Robotics: "from-purple-500 to-pink-600",
  "AI/ML": "from-orange-500 to-red-600",
  Python: "from-yellow-500 to-amber-600",
  "PCB Design": "from-green-500 to-emerald-600",
};

function getProgress(): Record<string, "started" | "completed"> {
  if (typeof window === "undefined") return {};
  try { return JSON.parse(localStorage.getItem(LEARN_KEY) || "{}"); } catch { return {}; }
}
function setProgress(id: string, status: "started" | "completed" | null) {
  const p = getProgress();
  if (status === null) delete p[id]; else p[id] = status;
  localStorage.setItem(LEARN_KEY, JSON.stringify(p));
}

function LearnContent() {
  const [cat, setCat] = useState("All");
  const [level, setLevel] = useState("All");
  const [search, setSearch] = useState("");
  const [progress, setProgressState] = useState<Record<string, "started" | "completed">>({});

  useEffect(() => { setProgressState(getProgress()); }, []);

  const filtered = COURSES.filter(c =>
    (cat === "All" || c.category === cat) &&
    (level === "All" || c.level === level) &&
    (search === "" || c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.provider.toLowerCase().includes(search.toLowerCase()) ||
      c.tags.some(t => t.includes(search.toLowerCase())))
  );

  const completed = Object.values(progress).filter(v => v === "completed").length;
  const started = Object.values(progress).filter(v => v === "started").length;

  const handleProgress = (id: string, status: "started" | "completed" | null) => {
    setProgress(id, status);
    setProgressState(getProgress());
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-br from-purple-950/60 via-gray-900 to-cyan-950/40 border border-gray-800 rounded-3xl p-8 mb-8">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(139,92,246,0.2),transparent)] pointer-events-none" />
        <div className="relative text-center">
          <div className="inline-flex items-center gap-2 bg-purple-950/60 border border-purple-800/50 text-purple-400 text-xs px-4 py-1.5 rounded-full mb-4">
            <GraduationCap className="w-3.5 h-3.5" /> Free Learning Paths
          </div>
          <h1 className="text-4xl font-bold text-white mb-3">
            Learn & <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">Get Certified</span>
          </h1>
          <p className="text-gray-400 max-w-xl mx-auto mb-6">
            Curated free courses from Coursera, edX, NPTEL, and YouTube. Audit for free, earn certificates, level up your engineering skills.
          </p>
          <div className="flex justify-center gap-6">
            {[
              { label: "Free Courses", value: COURSES.length, color: "text-cyan-400" },
              { label: "Completed", value: completed, color: "text-green-400" },
              { label: "In Progress", value: started, color: "text-yellow-400" },
              { label: "Certificates", value: COURSES.filter(c => c.cert).length, color: "text-purple-400" },
            ].map(s => (
              <div key={s.label} className="text-center">
                <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
                <div className="text-gray-500 text-xs">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Progress bar */}
      {(completed + started) > 0 && (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4 mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-white font-medium text-sm">Your Progress</span>
            <span className="text-gray-400 text-xs">{completed}/{COURSES.length} completed</span>
          </div>
          <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full transition-all"
              style={{ width: `${(completed / COURSES.length) * 100}%` }} />
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search courses..."
            className="w-full bg-gray-900 border border-gray-800 rounded-xl pl-10 pr-4 py-2.5 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-cyan-600" />
        </div>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map(c => (
            <button key={c} onClick={() => setCat(c)}
              className={`text-xs px-3 py-2 rounded-xl border transition-all ${cat === c ? "bg-purple-500 text-white border-purple-500 font-semibold" : "bg-gray-900 text-gray-400 border-gray-800 hover:border-purple-700"}`}>
              {c}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          {LEVELS.map(l => (
            <button key={l} onClick={() => setLevel(l)}
              className={`text-xs px-3 py-2 rounded-xl border transition-all ${level === l ? "bg-cyan-500 text-gray-950 border-cyan-500 font-semibold" : "bg-gray-900 text-gray-400 border-gray-800 hover:border-cyan-700"}`}>
              {l}
            </button>
          ))}
        </div>
      </div>

      {/* Course grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map(course => {
          const prog = progress[course.id];
          const gradient = CAT_COLORS[course.category] || "from-gray-600 to-gray-700";
          return (
            <div key={course.id} className={`group bg-gray-900 border rounded-2xl overflow-hidden transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-black/30 ${prog === "completed" ? "border-green-800/60" : prog === "started" ? "border-yellow-800/60" : "border-gray-800 hover:border-gray-600"}`}>
              <div className={`h-1.5 bg-gradient-to-r ${gradient}`} />
              <div className="p-5">
                {/* Header */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex flex-wrap gap-1.5">
                    <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${LEVEL_COLORS[course.level]}`}>{course.level}</span>
                    {course.cert && (
                      <span className="text-xs px-2 py-0.5 rounded-full border bg-purple-950 text-purple-400 border-purple-800 flex items-center gap-1">
                        <Award className="w-3 h-3" /> Certificate
                      </span>
                    )}
                    <span className="text-xs px-2 py-0.5 rounded-full border bg-green-950 text-green-400 border-green-800">FREE</span>
                  </div>
                  {prog === "completed" && <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />}
                  {prog === "started" && <Play className="w-5 h-5 text-yellow-400 flex-shrink-0" />}
                </div>

                <h3 className="text-white font-bold text-sm mb-1 leading-snug group-hover:text-purple-300 transition-colors">{course.title}</h3>
                <p className="text-purple-400 text-xs mb-2 font-medium">{course.provider}</p>
                <p className="text-gray-400 text-xs leading-relaxed mb-3">{course.description}</p>

                <div className="flex items-center gap-3 text-xs text-gray-500 mb-4">
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{course.duration}</span>
                  <span className="flex items-center gap-1"><Star className="w-3 h-3 text-yellow-400" />{course.rating}</span>
                  <span className="flex items-center gap-1"><TrendingUp className="w-3 h-3" />{course.students}</span>
                </div>

                <div className="flex gap-2">
                  <a href={course.url} target="_blank" rel="noopener noreferrer"
                    className={`flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold py-2.5 rounded-xl transition-all bg-gradient-to-r ${gradient} text-white hover:opacity-90`}>
                    <ExternalLink className="w-3.5 h-3.5" /> Start Learning
                  </a>
                  <button
                    onClick={() => handleProgress(course.id, prog === "completed" ? null : prog === "started" ? "completed" : "started")}
                    className={`px-3 py-2.5 rounded-xl text-xs border transition-all ${prog === "completed" ? "bg-green-950 text-green-400 border-green-800" : prog === "started" ? "bg-yellow-950 text-yellow-400 border-yellow-800" : "bg-gray-800 text-gray-400 border-gray-700 hover:border-cyan-700"}`}
                    title={prog === "completed" ? "Mark incomplete" : prog === "started" ? "Mark complete" : "Mark started"}>
                    {prog === "completed" ? <CheckCircle2 className="w-3.5 h-3.5" /> : prog === "started" ? <Play className="w-3.5 h-3.5" /> : <BookOpen className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-20 bg-gray-900/50 border border-gray-800 rounded-2xl">
          <GraduationCap className="w-12 h-12 text-gray-600 mx-auto mb-3" />
          <p className="text-white font-semibold mb-1">No courses found</p>
          <p className="text-gray-500 text-sm">Try different filters</p>
        </div>
      )}
    </div>
  );
}

export default function LearnPage() {
  return <RouteGuard><LearnContent /></RouteGuard>;
}
