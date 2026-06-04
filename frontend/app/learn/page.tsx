"use client";
import { useState, useEffect, useRef } from "react";
import RouteGuard from "@/components/RouteGuard";
import {
  GraduationCap, BookOpen, Play, CheckCircle2, Clock, Star,
  ExternalLink, Zap, Award, TrendingUp, Search, BarChart3,
  StickyNote, Timer, Brain, ChevronRight, ChevronLeft,
  RotateCcw, Check, X, Flame, Target, Map, Lightbulb,
  PenLine, Trash2, Save, Plus, ChevronDown, ChevronUp,
} from "lucide-react";

const LEARN_KEY = "cotsify_learn_progress";
const NOTES_KEY = "cotsify_study_notes";
const TIMER_KEY = "cotsify_study_time";
const QUIZ_KEY = "cotsify_quiz_scores";

interface Course {
  id: string; title: string; provider: string; category: string;
  level: "Beginner" | "Intermediate" | "Advanced"; duration: string;
  rating: number; students: string; url: string; free: boolean;
  cert: boolean; description: string; tags: string[];
}

const COURSES: Course[] = [
  { id: "e1", title: "Introduction to Electronics", provider: "Coursera (UC San Diego)", category: "Electronics", level: "Beginner", duration: "6 weeks", rating: 4.7, students: "280K", url: "https://www.coursera.org/learn/electronics", free: true, cert: true, description: "Learn resistors, capacitors, transistors and basic circuit analysis. Audit for free.", tags: ["circuits", "resistors", "capacitors"] },
  { id: "e2", title: "Electronic Circuits 1 – Basic Circuit Analysis", provider: "edX (Georgia Tech)", category: "Electronics", level: "Beginner", duration: "5 weeks", rating: 4.6, students: "150K", url: "https://www.edx.org/course/electronic-circuits-1-basic-circuit-analysis", free: true, cert: true, description: "Fundamental circuit analysis techniques. Audit free on edX.", tags: ["circuit-analysis", "kvl", "kcl"] },
  { id: "e3", title: "Basic Electronics – NPTEL", provider: "NPTEL (IIT)", category: "Electronics", level: "Beginner", duration: "12 weeks", rating: 4.8, students: "500K", url: "https://nptel.ac.in/courses/108/105/108105132/", free: true, cert: true, description: "Completely free IIT course with certificate exam. Covers semiconductors, diodes, transistors.", tags: ["nptel", "iit", "semiconductors"] },
  { id: "e4", title: "Analog Electronics – NPTEL", provider: "NPTEL (IIT Kharagpur)", category: "Electronics", level: "Intermediate", duration: "12 weeks", rating: 4.7, students: "320K", url: "https://nptel.ac.in/courses/108/105/108105066/", free: true, cert: true, description: "Op-amps, filters, oscillators. Free with paid certificate option.", tags: ["analog", "op-amp", "filters"] },
  { id: "a1", title: "Arduino Step by Step – Complete Course", provider: "YouTube (Paul McWhorter)", category: "Arduino", level: "Beginner", duration: "40 hours", rating: 4.9, students: "2M", url: "https://www.youtube.com/playlist?list=PLGs0VKk2DiYw-L-RibttcvK-WBZm8WLEP", free: true, cert: false, description: "The most comprehensive free Arduino course on YouTube. 73 lessons from scratch.", tags: ["arduino", "sensors", "projects"] },
  { id: "a2", title: "Arduino Programming & Hardware Fundamentals", provider: "Coursera (UC San Diego)", category: "Arduino", level: "Beginner", duration: "4 weeks", rating: 4.5, students: "95K", url: "https://www.coursera.org/learn/arduino-programming", free: true, cert: true, description: "Hands-on Arduino programming. Audit free on Coursera.", tags: ["arduino", "programming", "hardware"] },
  { id: "a3", title: "Embedded Systems – NPTEL", provider: "NPTEL (IIT Delhi)", category: "Arduino", level: "Intermediate", duration: "12 weeks", rating: 4.6, students: "180K", url: "https://nptel.ac.in/courses/108/102/108102045/", free: true, cert: true, description: "Microcontrollers, interrupts, timers, communication protocols. Free IIT course.", tags: ["embedded", "microcontroller", "rtos"] },
  { id: "a4", title: "ESP32 & ESP8266 – Complete Guide", provider: "YouTube (Random Nerd Tutorials)", category: "Arduino", level: "Intermediate", duration: "20 hours", rating: 4.8, students: "800K", url: "https://www.youtube.com/c/RandomNerdTutorials", free: true, cert: false, description: "Best free resource for ESP32/ESP8266 WiFi projects, sensors, web servers.", tags: ["esp32", "esp8266", "wifi"] },
  { id: "i1", title: "Introduction to the Internet of Things", provider: "Coursera (UC San Diego)", category: "IoT", level: "Beginner", duration: "5 weeks", rating: 4.6, students: "420K", url: "https://www.coursera.org/learn/iot", free: true, cert: true, description: "IoT architecture, sensors, actuators, networking. Audit free.", tags: ["iot", "sensors", "networking"] },
  { id: "i2", title: "IoT Specialization – 6 Courses", provider: "Coursera (UC San Diego)", category: "IoT", level: "Intermediate", duration: "6 months", rating: 4.5, students: "200K", url: "https://www.coursera.org/specializations/internet-of-things", free: true, cert: true, description: "Complete IoT specialization: sensors, Raspberry Pi, Arduino, cloud. Audit each course free.", tags: ["iot", "raspberry-pi", "cloud"] },
  { id: "i3", title: "IoT and Embedded Systems – NPTEL", provider: "NPTEL (IIT Bombay)", category: "IoT", level: "Intermediate", duration: "12 weeks", rating: 4.7, students: "250K", url: "https://nptel.ac.in/courses/106/105/106105166/", free: true, cert: true, description: "MQTT, cloud platforms, edge computing. Free with certificate.", tags: ["iot", "mqtt", "cloud", "edge"] },
  { id: "r1", title: "Robotics Specialization", provider: "Coursera (UPenn)", category: "Robotics", level: "Advanced", duration: "6 months", rating: 4.7, students: "180K", url: "https://www.coursera.org/specializations/robotics", free: true, cert: true, description: "Aerial robotics, kinematics, motion planning, perception. Audit free.", tags: ["robotics", "kinematics", "motion-planning"] },
  { id: "r2", title: "Modern Robotics – Northwestern", provider: "Coursera (Northwestern)", category: "Robotics", level: "Advanced", duration: "6 months", rating: 4.8, students: "95K", url: "https://www.coursera.org/specializations/modernrobotics", free: true, cert: true, description: "Mechanics, planning, control of robots. Rigorous mathematical treatment.", tags: ["robotics", "mechanics", "control"] },
  { id: "r3", title: "Robotics – NPTEL", provider: "NPTEL (IIT Bombay)", category: "Robotics", level: "Intermediate", duration: "12 weeks", rating: 4.6, students: "140K", url: "https://nptel.ac.in/courses/112/101/112101099/", free: true, cert: true, description: "Robot kinematics, dynamics, trajectory planning. Free IIT course.", tags: ["robotics", "kinematics", "nptel"] },
  { id: "r4", title: "ROS (Robot Operating System) Tutorial", provider: "YouTube (The Construct)", category: "Robotics", level: "Intermediate", duration: "15 hours", rating: 4.7, students: "500K", url: "https://www.youtube.com/c/TheConstruct", free: true, cert: false, description: "Complete ROS2 tutorials from beginner to advanced. Best free ROS resource.", tags: ["ros", "ros2", "robot-programming"] },
  { id: "m1", title: "Machine Learning – Andrew Ng", provider: "Coursera (Stanford)", category: "AI/ML", level: "Intermediate", duration: "11 weeks", rating: 4.9, students: "5M", url: "https://www.coursera.org/learn/machine-learning", free: true, cert: true, description: "The most famous ML course. Regression, neural networks, SVM. Audit free.", tags: ["machine-learning", "neural-networks", "python"] },
  { id: "m2", title: "Deep Learning Specialization", provider: "Coursera (deeplearning.ai)", category: "AI/ML", level: "Advanced", duration: "5 months", rating: 4.9, students: "800K", url: "https://www.coursera.org/specializations/deep-learning", free: true, cert: true, description: "CNNs, RNNs, transformers. Audit each course free.", tags: ["deep-learning", "cnn", "rnn", "tensorflow"] },
  { id: "m3", title: "TensorFlow for Microcontrollers (TinyML)", provider: "edX (Harvard)", category: "AI/ML", level: "Advanced", duration: "4 weeks", rating: 4.6, students: "80K", url: "https://www.edx.org/course/fundamentals-of-tinyml", free: true, cert: true, description: "Run ML models on Arduino and microcontrollers. Audit free.", tags: ["tinyml", "tensorflow", "arduino", "edge-ai"] },
  { id: "m4", title: "AI for Everyone – Andrew Ng", provider: "Coursera (deeplearning.ai)", category: "AI/ML", level: "Beginner", duration: "6 hours", rating: 4.8, students: "1.2M", url: "https://www.coursera.org/learn/ai-for-everyone", free: true, cert: true, description: "Non-technical AI overview. Perfect starting point. Audit free.", tags: ["ai", "overview", "beginner"] },
  { id: "p1", title: "Python for Everybody Specialization", provider: "Coursera (UMich)", category: "Python", level: "Beginner", duration: "8 months", rating: 4.8, students: "2M", url: "https://www.coursera.org/specializations/python", free: true, cert: true, description: "Complete Python from scratch. Data structures, web scraping, databases. Audit free.", tags: ["python", "programming", "beginner"] },
  { id: "p2", title: "MicroPython for Microcontrollers", provider: "YouTube (Tony DiCola)", category: "Python", level: "Intermediate", duration: "8 hours", rating: 4.6, students: "200K", url: "https://www.youtube.com/results?search_query=micropython+tutorial+complete", free: true, cert: false, description: "Python on ESP32, Raspberry Pi Pico. Sensors, WiFi, MQTT.", tags: ["micropython", "esp32", "pico"] },
  { id: "c1", title: "PCB Design with KiCad", provider: "YouTube (Phil's Lab)", category: "PCB Design", level: "Intermediate", duration: "12 hours", rating: 4.9, students: "600K", url: "https://www.youtube.com/c/PhilsLab", free: true, cert: false, description: "Professional PCB design from schematic to fabrication using free KiCad software.", tags: ["pcb", "kicad", "schematic", "gerber"] },
  { id: "c2", title: "PCB Design – Altium Academy", provider: "Altium Academy (Free)", category: "PCB Design", level: "Intermediate", duration: "10 hours", rating: 4.5, students: "150K", url: "https://www.altium.com/altium-academy", free: true, cert: true, description: "Free PCB design courses with certificate from Altium.", tags: ["pcb", "altium", "design"] },
  { id: "c3", title: "VLSI Design – NPTEL", provider: "NPTEL (IIT Madras)", category: "PCB Design", level: "Advanced", duration: "12 weeks", rating: 4.6, students: "90K", url: "https://nptel.ac.in/courses/117/106/117106093/", free: true, cert: true, description: "CMOS design, layout, simulation. Free IIT course with certificate.", tags: ["vlsi", "cmos", "chip-design", "nptel"] },
];

// ── Flashcard data ────────────────────────────────────────────────────────────
const FLASHCARDS = [
  { q: "What is Ohm's Law?", a: "V = I × R  (Voltage = Current × Resistance)" },
  { q: "What does GPIO stand for?", a: "General Purpose Input/Output — pins on a microcontroller that can be configured as input or output." },
  { q: "What is the operating voltage of Arduino Uno?", a: "5V logic level, powered via USB (5V) or barrel jack (7–12V recommended)." },
  { q: "What is the difference between analog and digital signals?", a: "Analog signals are continuous (any value in a range). Digital signals are discrete — only HIGH (1) or LOW (0)." },
  { q: "What is PWM?", a: "Pulse Width Modulation — simulates analog output by rapidly switching digital signal ON/OFF. Duty cycle controls effective voltage." },
  { q: "What is I2C?", a: "Inter-Integrated Circuit — 2-wire serial protocol (SDA + SCL). Supports multiple devices on same bus using unique addresses." },
  { q: "What is SPI?", a: "Serial Peripheral Interface — 4-wire protocol (MOSI, MISO, SCK, CS). Faster than I2C, used for displays and SD cards." },
  { q: "What is UART?", a: "Universal Asynchronous Receiver-Transmitter — 2-wire serial (TX/RX). Used for Arduino Serial Monitor and Bluetooth modules." },
  { q: "What is the ESP32 clock speed?", a: "240 MHz dual-core Xtensa LX6. Also has WiFi 802.11 b/g/n and Bluetooth 4.2 BLE built-in." },
  { q: "What is a pull-up resistor?", a: "A resistor connected between a signal pin and VCC to ensure the pin reads HIGH when not driven. Prevents floating inputs." },
  { q: "What does DHT11 measure?", a: "Temperature (0–50°C ±2°C) and Humidity (20–90% RH ±5%) via single-wire digital protocol." },
  { q: "What is MQTT?", a: "Message Queuing Telemetry Transport — lightweight publish/subscribe protocol for IoT. Uses broker (e.g. Mosquitto, AWS IoT)." },
  { q: "What is the difference between Arduino Uno and Nano?", a: "Both use ATmega328P at 16MHz. Nano is smaller (breadboard-friendly), Uno has more physical space and standard shield headers." },
  { q: "What is a H-Bridge?", a: "A circuit that allows a motor to be driven in both directions by controlling which side gets positive/negative voltage. L298N uses this." },
  { q: "What is Raspberry Pi used for vs Arduino?", a: "Raspberry Pi runs a full Linux OS — for complex tasks (AI, vision, web servers). Arduino is a microcontroller — for real-time hardware control." },
  { q: "What is the purpose of a capacitor in a circuit?", a: "Stores and releases electrical energy. Used for filtering noise, decoupling power supplies, and timing circuits." },
  { q: "What is a transistor?", a: "A semiconductor device used as a switch or amplifier. BJT (NPN/PNP) and MOSFET are common types in electronics." },
  { q: "What is the HC-SR04 range?", a: "2 cm to 400 cm (4 meters) with ~3mm accuracy. Uses 40kHz ultrasonic pulses. Trigger: 10µs HIGH pulse." },
  { q: "What is a relay module used for?", a: "Electrically controlled switch that lets a low-power microcontroller (5V) control high-power AC/DC loads (up to 250VAC 10A)." },
  { q: "What is the difference between 3.3V and 5V logic?", a: "ESP32/ESP8266 use 3.3V logic. Arduino Uno uses 5V. Connecting 5V signals to 3.3V pins can damage the device — use a level shifter." },
];

// ── Roadmap data ──────────────────────────────────────────────────────────────
const ROADMAPS = [
  {
    title: "IoT Developer", icon: "📡", color: "from-cyan-500 to-blue-600",
    steps: [
      { label: "Electronics Basics", desc: "Ohm's law, resistors, capacitors, breadboard", done: false },
      { label: "Arduino Fundamentals", desc: "GPIO, PWM, Serial, basic sensors", done: false },
      { label: "ESP8266 / ESP32 WiFi", desc: "WiFi connection, HTTP requests, web server", done: false },
      { label: "MQTT & Cloud", desc: "Publish/subscribe, AWS IoT, Node-RED", done: false },
      { label: "PCB Design", desc: "KiCad schematic, layout, fabrication", done: false },
      { label: "Build a Full IoT Project", desc: "End-to-end: sensor → cloud → dashboard", done: false },
    ],
  },
  {
    title: "Robotics Engineer", icon: "🤖", color: "from-purple-500 to-pink-600",
    steps: [
      { label: "Electronics & Microcontrollers", desc: "Arduino, motor drivers, sensors", done: false },
      { label: "Motor Control", desc: "DC motors, servos, stepper motors, L298N", done: false },
      { label: "Kinematics & Mechanics", desc: "Forward/inverse kinematics, chassis design", done: false },
      { label: "Sensors & Perception", desc: "Ultrasonic, IR, camera, IMU", done: false },
      { label: "ROS / ROS2", desc: "Robot Operating System, topics, nodes", done: false },
      { label: "AI & Computer Vision", desc: "OpenCV, object detection, SLAM", done: false },
    ],
  },
  {
    title: "AI/ML Engineer", icon: "🧠", color: "from-orange-500 to-red-600",
    steps: [
      { label: "Python Programming", desc: "Syntax, NumPy, Pandas, Matplotlib", done: false },
      { label: "Machine Learning Basics", desc: "Regression, classification, Andrew Ng course", done: false },
      { label: "Deep Learning", desc: "CNNs, RNNs, TensorFlow/PyTorch", done: false },
      { label: "Computer Vision", desc: "OpenCV, image classification, YOLO", done: false },
      { label: "TinyML / Edge AI", desc: "TensorFlow Lite, Arduino ML, Jetson Nano", done: false },
      { label: "Deploy a Model", desc: "Flask API, cloud deployment, real-time inference", done: false },
    ],
  },
];

const CATEGORIES = ["All", "Electronics", "Arduino", "IoT", "Robotics", "AI/ML", "Python", "PCB Design"];
const LEVELS = ["All", "Beginner", "Intermediate", "Advanced"];
const LEVEL_COLORS = {
  Beginner: "bg-green-950 text-green-400 border-green-800",
  Intermediate: "bg-yellow-950 text-yellow-400 border-yellow-800",
  Advanced: "bg-red-950 text-red-400 border-red-800",
};
const CAT_COLORS: Record<string, string> = {
  Electronics: "from-cyan-500 to-blue-600", Arduino: "from-blue-500 to-indigo-600",
  IoT: "from-teal-500 to-cyan-600", Robotics: "from-purple-500 to-pink-600",
  "AI/ML": "from-orange-500 to-red-600", Python: "from-yellow-500 to-amber-600",
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
function getNotes(): { id: string; text: string; topic: string; ts: number }[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(NOTES_KEY) || "[]"); } catch { return []; }
}
function saveNotes(notes: { id: string; text: string; topic: string; ts: number }[]) {
  localStorage.setItem(NOTES_KEY, JSON.stringify(notes));
}
function getTotalStudyTime(): number {
  if (typeof window === "undefined") return 0;
  return Number(localStorage.getItem(TIMER_KEY) || "0");
}
function addStudyTime(secs: number) {
  localStorage.setItem(TIMER_KEY, String(getTotalStudyTime() + secs));
}
function getQuizScores(): { date: string; score: number; total: number; topic: string }[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(QUIZ_KEY) || "[]"); } catch { return []; }
}
function saveQuizScore(score: number, total: number, topic: string) {
  const scores = getQuizScores();
  scores.unshift({ date: new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short" }), score, total, topic });
  localStorage.setItem(QUIZ_KEY, JSON.stringify(scores.slice(0, 20)));
}

// ── Quiz data ──────────────────────────────────────────────────────────────────
const QUIZ_QUESTIONS = [
  { q: "What does LED stand for?", options: ["Light Emitting Diode", "Low Energy Device", "Linear Electrical Detector", "Luminous Emission Device"], answer: 0, topic: "Electronics" },
  { q: "Which pin on Arduino Uno is the built-in LED?", options: ["Pin 0", "Pin 5", "Pin 13", "Pin A0"], answer: 2, topic: "Arduino" },
  { q: "What protocol does DHT11 use to communicate?", options: ["I2C", "SPI", "Single-wire digital", "UART"], answer: 2, topic: "Sensors" },
  { q: "What does MQTT stand for?", options: ["Message Queue Telemetry Transport", "Modular Query Transfer Technology", "Multi-Queue Transport Terminal", "Messaging Queue Telemetry Tool"], answer: 0, topic: "IoT" },
  { q: "ESP32 has how many cores?", options: ["1", "2", "4", "8"], answer: 1, topic: "Hardware" },
  { q: "What is the maximum voltage for Arduino Uno GPIO pins?", options: ["3.3V", "5V", "12V", "9V"], answer: 1, topic: "Arduino" },
  { q: "Which component stores electrical charge?", options: ["Resistor", "Inductor", "Capacitor", "Diode"], answer: 2, topic: "Electronics" },
  { q: "What does GPIO stand for?", options: ["General Purpose Input/Output", "Global Pin Interface Output", "Ground Point Input Override", "General Protocol I/O"], answer: 0, topic: "Hardware" },
  { q: "L298N is used to control:", options: ["Temperature sensors", "DC and stepper motors", "LCD displays", "WiFi modules"], answer: 1, topic: "Robotics" },
  { q: "Which language is used to program Arduino?", options: ["Python", "Java", "C/C++", "Rust"], answer: 2, topic: "Arduino" },
  { q: "What does PWM stand for?", options: ["Pulse Width Modulation", "Power Wave Mode", "Periodic Waveform Method", "Phase Width Monitor"], answer: 0, topic: "Electronics" },
  { q: "Raspberry Pi runs which OS?", options: ["Windows IoT", "FreeRTOS", "Linux-based OS", "macOS embedded"], answer: 2, topic: "Hardware" },
  { q: "HC-SR04 is used for:", options: ["Temperature measurement", "Distance measurement", "Color detection", "Gas detection"], answer: 1, topic: "Sensors" },
  { q: "I2C uses how many wires?", options: ["1", "2", "3", "4"], answer: 1, topic: "Communication" },
  { q: "SPI uses how many wires?", options: ["2", "3", "4", "6"], answer: 2, topic: "Communication" },
];

// ── Quiz component ─────────────────────────────────────────────────────────────
function QuizPanel() {
  const [topic, setTopic] = useState("All");
  const [questions, setQuestions] = useState<typeof QUIZ_QUESTIONS>([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [started, setStarted] = useState(false);
  const [history, setHistory] = useState<{ date: string; score: number; total: number; topic: string }[]>([]);

  useEffect(() => { setHistory(getQuizScores()); }, []);

  const topics = ["All", ...Array.from(new Set(QUIZ_QUESTIONS.map(q => q.topic)))];

  const startQuiz = () => {
    const filtered = topic === "All" ? QUIZ_QUESTIONS : QUIZ_QUESTIONS.filter(q => q.topic === topic);
    const shuffled = [...filtered].sort(() => Math.random() - 0.5).slice(0, 10);
    setQuestions(shuffled);
    setCurrent(0); setSelected(null); setAnswered(false);
    setScore(0); setFinished(false); setStarted(true);
  };

  const handleAnswer = (idx: number) => {
    if (answered) return;
    setSelected(idx);
    setAnswered(true);
    if (idx === questions[current].answer) setScore(s => s + 1);
  };

  const handleNext = () => {
    if (current + 1 >= questions.length) {
      saveQuizScore(score + (selected === questions[current].answer ? 0 : 0), questions.length, topic);
      // final score already tracked
      saveQuizScore(score, questions.length, topic);
      setHistory(getQuizScores());
      setFinished(true);
    } else {
      setCurrent(c => c + 1);
      setSelected(null);
      setAnswered(false);
    }
  };

  if (!started) return (
    <div className="max-w-lg mx-auto">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 text-center mb-6">
        <div className="text-5xl mb-4">🧠</div>
        <h3 className="text-white font-bold text-xl mb-2">Electronics Quiz</h3>
        <p className="text-gray-400 text-sm mb-6">Test your knowledge with 10 random questions. Choose a topic or go with mixed questions.</p>
        <div className="flex flex-wrap gap-2 justify-center mb-6">
          {topics.map(t => (
            <button key={t} onClick={() => setTopic(t)}
              className={`text-xs px-3 py-1.5 rounded-full border transition-all ${topic === t ? "bg-purple-500 text-white border-purple-500" : "bg-gray-800 text-gray-400 border-gray-700 hover:border-purple-600"}`}>
              {t}
            </button>
          ))}
        </div>
        <button onClick={startQuiz}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-400 hover:to-pink-500 text-white font-semibold px-8 py-3 rounded-xl transition-all hover:scale-105">
          Start Quiz → {topic !== "All" ? `(${topic})` : "(Mixed)"}
        </button>
      </div>
      {history.length > 0 && (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
          <h4 className="text-white font-semibold text-sm mb-3 flex items-center gap-2">📊 Recent Scores</h4>
          <div className="flex flex-col gap-2">
            {history.slice(0, 5).map((h, i) => (
              <div key={i} className="flex items-center justify-between text-xs bg-gray-800/50 rounded-xl px-3 py-2">
                <span className="text-gray-400">{h.date} · {h.topic}</span>
                <span className={`font-bold ${(h.score / h.total) >= 0.7 ? "text-green-400" : (h.score / h.total) >= 0.5 ? "text-yellow-400" : "text-red-400"}`}>
                  {h.score}/{h.total} ({Math.round((h.score / h.total) * 100)}%)
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  if (finished) {
    const pct = Math.round((score / questions.length) * 100);
    return (
      <div className="max-w-lg mx-auto text-center">
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8">
          <div className="text-6xl mb-4">{pct >= 80 ? "🏆" : pct >= 60 ? "🎯" : "📚"}</div>
          <h3 className="text-white font-bold text-2xl mb-2">Quiz Complete!</h3>
          <p className="text-gray-400 mb-4">You scored</p>
          <div className={`text-5xl font-bold mb-2 ${pct >= 70 ? "text-green-400" : pct >= 50 ? "text-yellow-400" : "text-red-400"}`}>{score}/{questions.length}</div>
          <p className="text-gray-500 text-sm mb-6">{pct}% accuracy · Topic: {topic}</p>
          <div className="h-3 bg-gray-800 rounded-full mb-6 overflow-hidden">
            <div className={`h-full rounded-full transition-all ${pct >= 70 ? "bg-gradient-to-r from-green-500 to-emerald-500" : pct >= 50 ? "bg-gradient-to-r from-yellow-500 to-amber-500" : "bg-gradient-to-r from-red-500 to-rose-500"}`}
              style={{ width: `${pct}%` }} />
          </div>
          <div className="flex gap-3 justify-center">
            <button onClick={startQuiz}
              className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-600 text-white font-semibold px-6 py-2.5 rounded-xl text-sm transition-all hover:scale-105">
              <RotateCcw className="w-4 h-4" /> Try Again
            </button>
            <button onClick={() => setStarted(false)}
              className="flex items-center gap-2 bg-gray-800 text-gray-300 border border-gray-700 px-6 py-2.5 rounded-xl text-sm transition-all hover:bg-gray-700">
              Change Topic
            </button>
          </div>
        </div>
      </div>
    );
  }

  const q = questions[current];
  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs text-gray-500">Question {current + 1} of {questions.length}</span>
          <div className="flex items-center gap-3">
            <span className="text-green-400 text-xs font-semibold">{score} correct</span>
            <span className="text-xs bg-purple-950 text-purple-400 border border-purple-800 px-2 py-0.5 rounded-full">{q.topic}</span>
          </div>
        </div>
        {/* Progress */}
        <div className="h-1.5 bg-gray-800 rounded-full mb-5">
          <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all"
            style={{ width: `${((current) / questions.length) * 100}%` }} />
        </div>
        {/* Question */}
        <p className="text-white font-semibold text-lg mb-5 leading-relaxed">{q.q}</p>
        {/* Options */}
        <div className="flex flex-col gap-2 mb-5">
          {q.options.map((opt, i) => {
            let style = "bg-gray-800/50 border-gray-700 text-gray-300 hover:border-purple-600";
            if (answered) {
              if (i === q.answer) style = "bg-green-950/60 border-green-700 text-green-300";
              else if (i === selected && i !== q.answer) style = "bg-red-950/60 border-red-700 text-red-300";
              else style = "bg-gray-800/30 border-gray-800 text-gray-600";
            } else if (selected === i) style = "bg-purple-950/60 border-purple-600 text-purple-300";
            return (
              <button key={i} onClick={() => handleAnswer(i)} disabled={answered}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-left text-sm transition-all disabled:cursor-default ${style}`}>
                <span className="w-6 h-6 rounded-full border border-current flex items-center justify-center text-xs font-bold flex-shrink-0">
                  {answered && i === q.answer ? "✓" : answered && i === selected && i !== q.answer ? "✗" : String.fromCharCode(65 + i)}
                </span>
                {opt}
              </button>
            );
          })}
        </div>
        {answered && (
          <div className={`text-sm p-3 rounded-xl mb-4 ${selected === q.answer ? "bg-green-950/40 border border-green-800/50 text-green-300" : "bg-red-950/40 border border-red-800/50 text-red-300"}`}>
            {selected === q.answer ? "✅ Correct!" : `❌ Incorrect. The answer is: ${q.options[q.answer]}`}
          </div>
        )}
        {answered && (
          <button onClick={handleNext}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-400 hover:to-pink-500 text-white font-semibold py-3 rounded-xl text-sm transition-all">
            {current + 1 >= questions.length ? "See Results 🏆" : "Next Question →"}
          </button>
        )}
      </div>
    </div>
  );
}
function FlashcardPanel() {
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [score, setScore] = useState({ correct: 0, wrong: 0 });
  const [done, setDone] = useState<Set<number>>(new Set());
  const card = FLASHCARDS[idx];
  const remaining = FLASHCARDS.length - done.size;

  const next = (correct: boolean) => {
    setScore(s => correct ? { ...s, correct: s.correct + 1 } : { ...s, wrong: s.wrong + 1 });
    setDone(d => new Set([...d, idx]));
    setFlipped(false);
    const nextIdx = FLASHCARDS.findIndex((_, i) => i > idx && !done.has(i));
    if (nextIdx !== -1) setIdx(nextIdx);
  };

  const reset = () => { setIdx(0); setFlipped(false); setScore({ correct: 0, wrong: 0 }); setDone(new Set()); };

  if (done.size === FLASHCARDS.length) return (
    <div className="text-center py-10">
      <div className="text-5xl mb-4">🎉</div>
      <h3 className="text-white font-bold text-xl mb-2">All cards done!</h3>
      <p className="text-gray-400 mb-2">Score: <span className="text-green-400 font-bold">{score.correct}</span> correct, <span className="text-red-400 font-bold">{score.wrong}</span> wrong</p>
      <p className="text-gray-500 text-sm mb-6">Accuracy: {Math.round((score.correct / FLASHCARDS.length) * 100)}%</p>
      <button onClick={reset} className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold px-6 py-3 rounded-xl mx-auto transition-all hover:scale-105">
        <RotateCcw className="w-4 h-4" /> Restart
      </button>
    </div>
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3 text-sm">
          <span className="text-green-400 flex items-center gap-1"><Check className="w-4 h-4" />{score.correct}</span>
          <span className="text-red-400 flex items-center gap-1"><X className="w-4 h-4" />{score.wrong}</span>
          <span className="text-gray-500">{remaining} remaining</span>
        </div>
        <button onClick={reset} className="text-xs text-gray-500 hover:text-gray-300 flex items-center gap-1 transition-colors">
          <RotateCcw className="w-3.5 h-3.5" /> Reset
        </button>
      </div>
      <div className="h-1.5 bg-gray-800 rounded-full mb-5 overflow-hidden">
        <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full transition-all" style={{ width: `${(done.size / FLASHCARDS.length) * 100}%` }} />
      </div>
      {/* Card */}
      <div onClick={() => setFlipped(f => !f)}
        className={`relative min-h-44 rounded-2xl border cursor-pointer transition-all select-none ${flipped ? "bg-gradient-to-br from-cyan-950/60 to-blue-950/60 border-cyan-700/50" : "bg-gray-900 border-gray-700 hover:border-cyan-700/50"}`}>
        <div className="p-6 flex flex-col items-center justify-center min-h-44 text-center">
          <span className="text-xs text-gray-500 mb-3 uppercase tracking-widest">{flipped ? "Answer" : "Question"} · {idx + 1}/{FLASHCARDS.length}</span>
          <p className={`font-semibold text-base leading-relaxed ${flipped ? "text-cyan-300" : "text-white"}`}>
            {flipped ? card.a : card.q}
          </p>
          {!flipped && <p className="text-gray-600 text-xs mt-4">Tap to reveal answer</p>}
        </div>
      </div>
      {flipped && (
        <div className="flex gap-3 mt-4">
          <button onClick={() => next(false)} className="flex-1 flex items-center justify-center gap-2 bg-red-950/60 hover:bg-red-950 text-red-400 border border-red-800/50 py-3 rounded-xl text-sm font-semibold transition-all">
            <X className="w-4 h-4" /> Didn't know
          </button>
          <button onClick={() => next(true)} className="flex-1 flex items-center justify-center gap-2 bg-green-950/60 hover:bg-green-950 text-green-400 border border-green-800/50 py-3 rounded-xl text-sm font-semibold transition-all">
            <Check className="w-4 h-4" /> Got it!
          </button>
        </div>
      )}
    </div>
  );
}

// ── Study Timer component ─────────────────────────────────────────────────────
function StudyTimer() {
  const [running, setRunning] = useState(false);
  const [secs, setSecs] = useState(0);
  const [totalSecs, setTotalSecs] = useState(0);
  const [mode, setMode] = useState<"stopwatch" | "pomodoro">("pomodoro");
  const [pomodoroSecs, setPomodoroSecs] = useState(25 * 60);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => { setTotalSecs(getTotalStudyTime()); }, []);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setSecs(s => {
          if (mode === "pomodoro") {
            if (s >= pomodoroSecs - 1) { setRunning(false); addStudyTime(pomodoroSecs); setTotalSecs(getTotalStudyTime()); return 0; }
          }
          return s + 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (secs > 0 && mode === "stopwatch") { addStudyTime(secs); setTotalSecs(getTotalStudyTime()); }
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [running]);

  const fmt = (s: number) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
  const fmtTotal = (s: number) => { const h = Math.floor(s / 3600); const m = Math.floor((s % 3600) / 60); return h > 0 ? `${h}h ${m}m` : `${m}m`; };
  const displaySecs = mode === "pomodoro" ? pomodoroSecs - secs : secs;
  const pct = mode === "pomodoro" ? (secs / pomodoroSecs) * 100 : Math.min((secs / 3600) * 100, 100);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex gap-2 mb-2">
        {(["pomodoro", "stopwatch"] as const).map(m => (
          <button key={m} onClick={() => { setMode(m); setSecs(0); setRunning(false); }}
            className={`text-xs px-4 py-1.5 rounded-full border transition-all capitalize ${mode === m ? "bg-cyan-950 text-cyan-400 border-cyan-700" : "bg-gray-800 text-gray-500 border-gray-700 hover:text-gray-300"}`}>
            {m === "pomodoro" ? "🍅 Pomodoro (25m)" : "⏱ Stopwatch"}
          </button>
        ))}
      </div>
      {/* Ring */}
      <div className="relative w-36 h-36">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 144 144">
          <circle cx="72" cy="72" r="60" fill="none" stroke="#1f2937" strokeWidth="10" />
          <circle cx="72" cy="72" r="60" fill="none" stroke="url(#timerGrad)" strokeWidth="10"
            strokeLinecap="round" strokeDasharray={`${2 * Math.PI * 60}`}
            strokeDashoffset={`${2 * Math.PI * 60 * (1 - pct / 100)}`}
            style={{ transition: "stroke-dashoffset 1s linear" }} />
          <defs>
            <linearGradient id="timerGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#06b6d4" />
              <stop offset="100%" stopColor="#3b82f6" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold text-white font-mono">{fmt(displaySecs)}</span>
          <span className="text-xs text-gray-500 mt-0.5">{running ? "studying" : "paused"}</span>
        </div>
      </div>
      <div className="flex gap-3">
        <button onClick={() => setRunning(r => !r)}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-sm transition-all ${running ? "bg-red-950 text-red-400 border border-red-800" : "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20"}`}>
          {running ? <><X className="w-4 h-4" /> Pause</> : <><Play className="w-4 h-4" /> Start</>}
        </button>
        <button onClick={() => { setSecs(0); setRunning(false); }}
          className="p-2.5 bg-gray-800 text-gray-400 border border-gray-700 rounded-xl hover:text-white transition-colors">
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
      <div className="text-center">
        <p className="text-gray-500 text-xs">Total study time</p>
        <p className="text-cyan-400 font-bold text-lg">{fmtTotal(totalSecs)}</p>
      </div>
    </div>
  );
}

// ── Study Notes component ─────────────────────────────────────────────────────
function StudyNotes() {
  const [notes, setNotesState] = useState<{ id: string; text: string; topic: string; ts: number }[]>([]);
  const [text, setText] = useState("");
  const [topic, setTopic] = useState("General");

  useEffect(() => { setNotesState(getNotes()); }, []);

  const addNote = () => {
    if (!text.trim()) return;
    const updated = [{ id: crypto.randomUUID(), text: text.trim(), topic, ts: Date.now() }, ...notes];
    saveNotes(updated); setNotesState(updated); setText("");
  };

  const deleteNote = (id: string) => {
    const updated = notes.filter(n => n.id !== id);
    saveNotes(updated); setNotesState(updated);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <div className="flex gap-2">
          <select value={topic} onChange={e => setTopic(e.target.value)}
            className="bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-cyan-600 flex-shrink-0">
            {["General","Electronics","Arduino","IoT","Robotics","AI/ML","Python","PCB Design"].map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
        <textarea value={text} onChange={e => setText(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter" && e.ctrlKey) addNote(); }}
          placeholder="Write a study note... (Ctrl+Enter to save)"
          rows={3}
          className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2.5 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-cyan-600 resize-none" />
        <button onClick={addNote} disabled={!text.trim()}
          className="self-end flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-40 text-white font-semibold px-4 py-2 rounded-xl text-sm transition-all">
          <Plus className="w-4 h-4" /> Add Note
        </button>
      </div>
      {notes.length === 0 ? (
        <div className="text-center py-8 text-gray-600 text-sm">No notes yet. Start writing!</div>
      ) : (
        <div className="flex flex-col gap-2 max-h-80 overflow-y-auto">
          {notes.map(n => (
            <div key={n.id} className="bg-gray-800/60 border border-gray-700/50 rounded-xl p-3 group">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs text-cyan-400 bg-cyan-950/60 border border-cyan-800/50 px-2 py-0.5 rounded-full">{n.topic}</span>
                <div className="flex items-center gap-2">
                  <span className="text-gray-600 text-xs">{new Date(n.ts).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</span>
                  <button onClick={() => deleteNote(n.id)} className="opacity-0 group-hover:opacity-100 text-gray-600 hover:text-red-400 transition-all">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">{n.text}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Roadmap component ─────────────────────────────────────────────────────────
function RoadmapPanel() {
  const ROADMAP_KEY = "cotsify_roadmap_progress";
  const [roadmapProgress, setRoadmapProgress] = useState<Record<string, boolean[]>>({});
  const [expanded, setExpanded] = useState<string | null>("IoT Developer");

  useEffect(() => {
    try { setRoadmapProgress(JSON.parse(localStorage.getItem(ROADMAP_KEY) || "{}")); } catch {}
  }, []);

  const toggleStep = (roadmapTitle: string, stepIdx: number) => {
    const current = roadmapProgress[roadmapTitle] || ROADMAPS.find(r => r.title === roadmapTitle)!.steps.map(() => false);
    const updated = current.map((v, i) => i === stepIdx ? !v : v);
    const next = { ...roadmapProgress, [roadmapTitle]: updated };
    setRoadmapProgress(next);
    localStorage.setItem(ROADMAP_KEY, JSON.stringify(next));
  };

  return (
    <div className="flex flex-col gap-4">
      {ROADMAPS.map(roadmap => {
        const steps = roadmapProgress[roadmap.title] || roadmap.steps.map(() => false);
        const done = steps.filter(Boolean).length;
        const pct = Math.round((done / steps.length) * 100);
        const isExpanded = expanded === roadmap.title;
        return (
          <div key={roadmap.title} className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
            <button onClick={() => setExpanded(isExpanded ? null : roadmap.title)}
              className="w-full flex items-center gap-3 px-5 py-4 hover:bg-gray-800/30 transition-colors">
              <span className="text-2xl">{roadmap.icon}</span>
              <div className="flex-1 text-left">
                <p className="text-white font-semibold text-sm">{roadmap.title}</p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex-1 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                    <div className={`h-full bg-gradient-to-r ${roadmap.color} rounded-full transition-all`} style={{ width: `${pct}%` }} />
                  </div>
                  <span className="text-xs text-gray-500">{done}/{steps.length}</span>
                </div>
              </div>
              {isExpanded ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
            </button>
            {isExpanded && (
              <div className="px-5 pb-5 flex flex-col gap-2">
                {roadmap.steps.map((step, i) => (
                  <button key={i} onClick={() => toggleStep(roadmap.title, i)}
                    className={`flex items-start gap-3 p-3 rounded-xl border text-left transition-all ${steps[i] ? "bg-green-950/30 border-green-800/50" : "bg-gray-800/30 border-gray-700/50 hover:border-gray-600"}`}>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 border-2 transition-all ${steps[i] ? `bg-gradient-to-br ${roadmap.color} border-transparent` : "border-gray-600"}`}>
                      {steps[i] && <Check className="w-3.5 h-3.5 text-white" />}
                    </div>
                    <div>
                      <p className={`text-sm font-medium ${steps[i] ? "text-green-400 line-through" : "text-white"}`}>{step.label}</p>
                      <p className="text-gray-500 text-xs mt-0.5">{step.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── Main LearnContent ─────────────────────────────────────────────────────────
function LearnContent() {
  const [cat, setCat] = useState("All");
  const [level, setLevel] = useState("All");
  const [search, setSearch] = useState("");
  const [progress, setProgressState] = useState<Record<string, "started" | "completed">>({});
  const [activeTab, setActiveTab] = useState<"courses" | "flashcards" | "quiz" | "notes" | "timer" | "roadmap">("courses");

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

  const STUDY_TABS = [
    { id: "courses", label: "Courses", icon: <BookOpen className="w-4 h-4" /> },
    { id: "flashcards", label: "Flashcards", icon: <Brain className="w-4 h-4" /> },
    { id: "quiz", label: "Quiz", icon: <Zap className="w-4 h-4" /> },
    { id: "roadmap", label: "Roadmap", icon: <Map className="w-4 h-4" /> },
    { id: "timer", label: "Study Timer", icon: <Timer className="w-4 h-4" /> },
    { id: "notes", label: "My Notes", icon: <StickyNote className="w-4 h-4" /> },
  ] as const;

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
            Curated free courses, flashcards, study timer, notes, and learning roadmaps — everything you need to level up.
          </p>
          <div className="flex justify-center gap-6 flex-wrap">
            {[
              { label: "Free Courses", value: COURSES.length, color: "text-cyan-400" },
              { label: "Completed", value: completed, color: "text-green-400" },
              { label: "In Progress", value: started, color: "text-yellow-400" },
              { label: "Flashcards", value: FLASHCARDS.length, color: "text-purple-400" },
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
            <span className="text-white font-medium text-sm flex items-center gap-2"><Flame className="w-4 h-4 text-orange-400" /> Your Progress</span>
            <span className="text-gray-400 text-xs">{completed}/{COURSES.length} completed</span>
          </div>
          <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full transition-all"
              style={{ width: `${(completed / COURSES.length) * 100}%` }} />
          </div>
        </div>
      )}

      {/* Tab bar */}
      <div className="flex gap-1 bg-gray-900 border border-gray-800 rounded-xl p-1 mb-6 overflow-x-auto">
        {STUDY_TABS.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${activeTab === t.id ? "bg-purple-950 text-purple-400 border border-purple-800" : "text-gray-500 hover:text-gray-300"}`}>
            {t.icon}{t.label}
          </button>
        ))}
      </div>

      {/* ── Courses tab ──────────────────────────────────────────────────── */}
      {activeTab === "courses" && (
        <>
          <div className="flex flex-wrap gap-3 mb-6">
            <div className="relative flex-1 min-w-48">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search courses..."
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
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map(course => {
              const prog = progress[course.id];
              const gradient = CAT_COLORS[course.category] || "from-gray-600 to-gray-700";
              return (
                <div key={course.id} className={`group bg-gray-900 border rounded-2xl overflow-hidden transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-black/30 ${prog === "completed" ? "border-green-800/60" : prog === "started" ? "border-yellow-800/60" : "border-gray-800 hover:border-gray-600"}`}>
                  <div className={`h-1.5 bg-gradient-to-r ${gradient}`} />
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div className="flex flex-wrap gap-1.5">
                        <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${LEVEL_COLORS[course.level]}`}>{course.level}</span>
                        {course.cert && <span className="text-xs px-2 py-0.5 rounded-full border bg-purple-950 text-purple-400 border-purple-800 flex items-center gap-1"><Award className="w-3 h-3" /> Cert</span>}
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
                      <button onClick={() => handleProgress(course.id, prog === "completed" ? null : prog === "started" ? "completed" : "started")}
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
        </>
      )}

      {/* ── Flashcards tab ───────────────────────────────────────────────── */}
      {activeTab === "flashcards" && (
        <div className="max-w-2xl mx-auto">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-5">
              <Brain className="w-5 h-5 text-purple-400" />
              <h2 className="text-white font-bold text-lg">Electronics Flashcards</h2>
              <span className="text-xs bg-purple-950 text-purple-400 border border-purple-800 px-2 py-0.5 rounded-full">{FLASHCARDS.length} cards</span>
            </div>
            <FlashcardPanel />
          </div>
        </div>
      )}

      {/* ── Quiz tab ─────────────────────────────────────────────────── */}
      {activeTab === "quiz" && <QuizPanel />}

      {/* ── Roadmap tab ──────────────────────────────────────────────────── */}
      {activeTab === "roadmap" && (
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-2 mb-5">
            <Map className="w-5 h-5 text-cyan-400" />
            <h2 className="text-white font-bold text-lg">Learning Roadmaps</h2>
            <span className="text-xs text-gray-500">Click steps to mark complete</span>
          </div>
          <RoadmapPanel />
        </div>
      )}

      {/* ── Timer tab ────────────────────────────────────────────────────── */}
      {activeTab === "timer" && (
        <div className="max-w-sm mx-auto">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8">
            <div className="flex items-center gap-2 mb-6 justify-center">
              <Timer className="w-5 h-5 text-cyan-400" />
              <h2 className="text-white font-bold text-lg">Study Timer</h2>
            </div>
            <StudyTimer />
          </div>
        </div>
      )}

      {/* ── Notes tab ────────────────────────────────────────────────────── */}
      {activeTab === "notes" && (
        <div className="max-w-2xl mx-auto">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-5">
              <StickyNote className="w-5 h-5 text-amber-400" />
              <h2 className="text-white font-bold text-lg">Study Notes</h2>
              <span className="text-xs text-gray-500">Saved locally in your browser</span>
            </div>
            <StudyNotes />
          </div>
        </div>
      )}
    </div>
  );
}

export default function LearnPage() {
  return <RouteGuard><LearnContent /></RouteGuard>;
}
