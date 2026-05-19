"use client";
import { useState, useEffect } from "react";
import { Cpu, Zap, TrendingUp, MapPin, BarChart3, ArrowRight, Sparkles, Shuffle, Flame } from "lucide-react";

const EXAMPLE_PROJECTS = [
  { title: "AI Smart Attendance System", tags: ["Raspberry Pi", "OpenCV", "Camera", "Python"], color: "from-cyan-500 to-blue-600" },
  { title: "Smart Parking System IoT", tags: ["Arduino", "Ultrasonic", "ESP8266", "LCD"], color: "from-blue-500 to-purple-600" },
  { title: "Smart Irrigation System using IoT", tags: ["Arduino", "Soil Sensor", "ESP8266", "Relay"], color: "from-green-500 to-cyan-600" },
  { title: "Accident Detection and Alert System", tags: ["Arduino", "GPS", "GSM", "Accelerometer"], color: "from-red-500 to-orange-600" },
  { title: "Smart Home Automation Voice Control", tags: ["ESP32", "Relay", "Alexa", "Google Home"], color: "from-purple-500 to-pink-600" },
  { title: "AI Virtual Assistant Device", tags: ["Raspberry Pi", "Mic", "Speaker", "Python"], color: "from-amber-500 to-orange-600" },
  { title: "Smart Helmet Safety Alcohol Detection", tags: ["Arduino", "MQ3", "IR Sensor", "Relay"], color: "from-pink-500 to-red-600" },
  { title: "AI Object Detection System", tags: ["Raspberry Pi", "Camera", "YOLOv8", "OpenCV"], color: "from-indigo-500 to-blue-600" },
  { title: "Line Following Robot", tags: ["Arduino", "IR Sensor", "L298N", "DC Motor"], color: "from-teal-500 to-green-600" },
  { title: "Fire Detection System", tags: ["Arduino", "Flame Sensor", "MQ2", "Buzzer"], color: "from-orange-500 to-red-600" },
  { title: "Gesture Controlled Robot", tags: ["Arduino", "MPU6050", "nRF24L01", "Motors"], color: "from-violet-500 to-purple-600" },
  { title: "Smart Street Light Auto ON OFF", tags: ["Arduino", "LDR", "Relay", "PIR"], color: "from-yellow-500 to-amber-600" },
  { title: "Human Following Robot", tags: ["Arduino", "Ultrasonic", "L298N", "Motors"], color: "from-cyan-500 to-teal-600" },
  { title: "RFID Door Lock System", tags: ["Arduino", "MFRC522", "Servo", "LCD"], color: "from-blue-500 to-indigo-600" },
  { title: "Weather Monitoring Station", tags: ["ESP8266", "DHT11", "Rain Sensor", "OLED"], color: "from-sky-500 to-blue-600" },
  { title: "Health Monitoring System", tags: ["ESP32", "MAX30100", "DS18B20", "OLED"], color: "from-rose-500 to-pink-600" },
  { title: "Smart Water Level Indicator", tags: ["Arduino", "Ultrasonic", "Relay", "LCD"], color: "from-blue-500 to-cyan-600" },
  { title: "IoT Smart Energy Meter", tags: ["ESP8266", "ACS712", "ZMPT101B", "LCD"], color: "from-green-500 to-emerald-600" },
  { title: "Smart Surveillance System", tags: ["Raspberry Pi", "Camera", "OpenCV", "PIR"], color: "from-gray-500 to-slate-600" },
];

const TRENDING_SEARCHES = [
  "Smart Irrigation System",
  "Line Following Robot",
  "Home Automation ESP32",
  "Face Recognition Attendance",
  "IoT Weather Station",
];

const DIFFICULTY_FILTERS = [
  { label: "Beginner", color: "bg-green-950/60 text-green-400 border-green-800/50 hover:border-green-600", projects: ["Fire Detection System", "Smart Water Level Indicator", "Smart Street Light Auto ON OFF", "Line Following Robot"] },
  { label: "Intermediate", color: "bg-yellow-950/60 text-yellow-400 border-yellow-800/50 hover:border-yellow-600", projects: ["Smart Irrigation System using IoT", "Smart Parking System IoT", "RFID Door Lock System", "Health Monitoring System"] },
  { label: "Advanced", color: "bg-red-950/60 text-red-400 border-red-800/50 hover:border-red-600", projects: ["AI Smart Attendance System", "AI Object Detection System", "AI Virtual Assistant Device", "Smart Surveillance System"] },
];

const STATS = [
  { icon: <Cpu className="w-5 h-5" />, value: "500+", label: "Components", color: "text-cyan-400" },
  { icon: <TrendingUp className="w-5 h-5" />, value: "3", label: "Platforms", color: "text-blue-400" },
  { icon: <MapPin className="w-5 h-5" />, value: "Local", label: "Store Finder", color: "text-purple-400" },
  { icon: <BarChart3 className="w-5 h-5" />, value: "Live", label: "Price Compare", color: "text-green-400" },
];

const TYPING_TEXTS = [
  "Smart Irrigation System using IoT",
  "Line Following Robot",
  "Home Automation with Raspberry Pi",
  "Gesture Controlled Robotic Arm",
  "Air Quality Monitoring Station",
  "Bluetooth Controlled Car",
];

export default function SearchEmptyState({ onSelect }: { onSelect: (title: string) => void }) {
  const [typingText, setTypingText] = useState("");
  const [textIndex, setTextIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [activeDifficulty, setActiveDifficulty] = useState<string | null>(null);

  // Typewriter effect
  useEffect(() => {
    const current = TYPING_TEXTS[textIndex];
    const timeout = setTimeout(() => {
      if (!deleting) {
        if (charIndex < current.length) {
          setTypingText(current.slice(0, charIndex + 1));
          setCharIndex(c => c + 1);
        } else {
          setTimeout(() => setDeleting(true), 1800);
        }
      } else {
        if (charIndex > 0) {
          setTypingText(current.slice(0, charIndex - 1));
          setCharIndex(c => c - 1);
        } else {
          setDeleting(false);
          setTextIndex(i => (i + 1) % TYPING_TEXTS.length);
        }
      }
    }, deleting ? 35 : 65);
    return () => clearTimeout(timeout);
  }, [charIndex, deleting, textIndex]);

  const handleRandomProject = () => {
    const random = EXAMPLE_PROJECTS[Math.floor(Math.random() * EXAMPLE_PROJECTS.length)];
    onSelect(random.title);
  };

  const displayedProjects = activeDifficulty
    ? EXAMPLE_PROJECTS.filter(p =>
        DIFFICULTY_FILTERS.find(d => d.label === activeDifficulty)?.projects.includes(p.title)
      )
    : EXAMPLE_PROJECTS;

  return (
    <div className="w-full relative">
      {/* Animated gradient background */}
      <div className="absolute inset-0 -z-10 overflow-hidden rounded-3xl pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,rgba(6,182,212,0.08),transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_80%_80%,rgba(139,92,246,0.06),transparent)]" />
      </div>

      {/* Typewriter hint */}
      <div className="text-center mb-8">
        <p className="text-gray-500 text-sm mb-2">Try searching for:</p>
        <div className="inline-flex items-center gap-2 text-cyan-400 text-lg font-medium min-h-[2rem]">
          <Sparkles className="w-4 h-4 flex-shrink-0" />
          <span>{typingText}</span>
          <span className="w-0.5 h-5 bg-cyan-400 animate-pulse inline-block" />
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {STATS.map((s) => (
          <div key={s.label} className="bg-gray-900/60 border border-gray-800 rounded-2xl p-4 text-center hover:border-gray-600 transition-colors hover:-translate-y-0.5 hover:shadow-lg hover:shadow-cyan-500/5">
            <div className={`flex justify-center mb-2 ${s.color}`}>{s.icon}</div>
            <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
            <div className="text-gray-500 text-xs mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Trending searches */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Flame className="w-4 h-4 text-orange-400" />
          <span className="text-white font-semibold text-sm">Trending searches</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {TRENDING_SEARCHES.map((t) => (
            <button key={t} onClick={() => onSelect(t)}
              className="flex items-center gap-1.5 text-xs bg-orange-950/40 hover:bg-orange-950/60 border border-orange-800/40 hover:border-orange-600/60 text-orange-300 px-3 py-1.5 rounded-full transition-all hover:scale-105">
              <Flame className="w-3 h-3" /> {t}
            </button>
          ))}
        </div>
      </div>

      {/* By difficulty + Random project */}
      <div className="flex flex-wrap items-center gap-3 mb-8">
        <span className="text-gray-500 text-xs">By difficulty:</span>
        {DIFFICULTY_FILTERS.map((d) => (
          <button key={d.label} onClick={() => setActiveDifficulty(activeDifficulty === d.label ? null : d.label)}
            className={`text-xs px-3 py-1.5 rounded-full border transition-all ${activeDifficulty === d.label ? d.color + " scale-105" : "bg-gray-900 text-gray-400 border-gray-700 hover:border-gray-600"}`}>
            {d.label}
          </button>
        ))}
        {activeDifficulty && (
          <button onClick={() => setActiveDifficulty(null)} className="text-xs text-gray-500 hover:text-gray-300 transition-colors">
            Clear
          </button>
        )}
        <button onClick={handleRandomProject}
          className="ml-auto flex items-center gap-1.5 text-xs bg-gradient-to-r from-purple-950/60 to-pink-950/60 hover:from-purple-900/60 hover:to-pink-900/60 border border-purple-800/50 hover:border-purple-600 text-purple-300 px-3 py-1.5 rounded-full transition-all hover:scale-105">
          <Shuffle className="w-3.5 h-3.5" /> Random project
        </button>
      </div>

      {/* Project cards */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-5">
          <Zap className="w-4 h-4 text-cyan-400" />
          <h2 className="text-white font-semibold">Popular Projects</h2>
          <span className="text-gray-500 text-sm">— click to analyze instantly</span>
          {activeDifficulty && (
            <span className="text-xs bg-cyan-950 text-cyan-400 border border-cyan-800 px-2 py-0.5 rounded-full ml-auto">
              {displayedProjects.length} shown
            </span>
          )}
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayedProjects.map((project, i) => (
            <button
              key={project.title}
              onClick={() => onSelect(project.title)}
              onMouseEnter={() => setHoveredCard(i)}
              onMouseLeave={() => setHoveredCard(null)}
              className="group text-left bg-gray-900/60 border border-gray-800 hover:border-cyan-700 rounded-2xl p-5 transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-cyan-500/10"
            >
              {/* Gradient top bar */}
              <div className={`h-1 w-full rounded-full bg-gradient-to-r ${project.color} mb-4 transition-all ${hoveredCard === i ? "opacity-100" : "opacity-50"}`} />

              <h3 className="text-white font-medium text-sm mb-3 leading-snug group-hover:text-cyan-300 transition-colors">
                {project.title}
              </h3>

              <div className="flex flex-wrap gap-1.5 mb-4">
                {project.tags.map(tag => (
                  <span key={tag} className="text-xs bg-gray-800 text-gray-400 px-2 py-0.5 rounded-full border border-gray-700">
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-1 text-xs text-cyan-500 group-hover:text-cyan-400 transition-colors">
                <span>Analyze now</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* How it works mini */}
      <div className="bg-gray-900/40 border border-gray-800 rounded-2xl p-6">
        <h3 className="text-white font-semibold mb-5 text-center">How COTsify works</h3>
        <div className="grid sm:grid-cols-3 gap-6">
          {[
            { step: "1", icon: "✏️", title: "Enter project title", desc: "Type any project name above" },
            { step: "2", icon: "🤖", title: "AI extracts components", desc: "GPT identifies every part needed" },
            { step: "3", icon: "🛒", title: "Compare & source", desc: "Find prices across Amazon, Flipkart, Robu.in" },
          ].map(item => (
            <div key={item.step} className="text-center">
              <div className="text-3xl mb-2">{item.icon}</div>
              <div className="text-xs font-bold text-cyan-500 tracking-widest mb-1">STEP {item.step}</div>
              <div className="text-white text-sm font-medium mb-1">{item.title}</div>
              <div className="text-gray-500 text-xs">{item.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
