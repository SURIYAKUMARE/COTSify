/**
 * Frontend AI service — calls Gemini or OpenAI directly from the browser.
 * Used as a fallback when the backend is not running.
 */
import { AnalyzeResponse, Component } from "./api";

const SYSTEM_PROMPT = `You are an expert electronics and software engineer.
Given a technical project title, extract ALL required components.
Return ONLY valid JSON matching this exact schema:
{
  "summary": "2-3 sentence project overview",
  "hardware": [
    {
      "name": "Component Name",
      "category": "hardware",
      "description": "What it does in this project",
      "quantity": 1,
      "search_query": "optimised Amazon/Flipkart search string"
    }
  ],
  "software": [
    {
      "name": "Tool/Library Name",
      "category": "software",
      "description": "Role in the project",
      "quantity": 1,
      "search_query": "download or buy query"
    }
  ]
}
Be thorough — include every sensor, microcontroller, power supply, wire, resistor, IDE, library, cloud service, etc.`;

// ── Gemini direct call ────────────────────────────────────────────────────────
export async function analyzeWithGemini(projectTitle: string): Promise<AnalyzeResponse> {
  const key = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  if (!key) throw new Error("No Gemini API key configured");

  // Use models available with this key (checked via API)
  const models = ["gemini-2.5-flash", "gemini-2.0-flash", "gemini-1.5-flash"];

  for (const model of models) {
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        if (attempt > 0) await new Promise(r => setTimeout(r, 1000 * attempt * 2)); // backoff

        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`;
        const payload = {
          contents: [{ parts: [{ text: `${SYSTEM_PROMPT}\n\nProject: ${projectTitle}\n\nReturn ONLY the JSON object, no markdown, no explanation.` }] }],
          generationConfig: { temperature: 0.2, maxOutputTokens: 4096 },
        };

        const res = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (res.status === 429) {
          console.warn(`Gemini ${model} rate limited, retrying...`);
          continue; // retry with backoff
        }
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          console.warn(`Gemini ${model} error ${res.status}:`, err?.error?.message);
          break; // try next model
        }

        const json = await res.json();
        let raw: string = json.candidates?.[0]?.content?.parts?.[0]?.text || "";
        raw = raw.replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/```\s*$/i, "").trim();
        const jsonStart = raw.indexOf("{");
        const jsonEnd = raw.lastIndexOf("}");
        if (jsonStart !== -1 && jsonEnd !== -1) raw = raw.slice(jsonStart, jsonEnd + 1);

        const data = JSON.parse(raw);
        if (!data.hardware || data.hardware.length === 0) throw new Error("Empty hardware list");

        return {
          project_title: projectTitle,
          summary: data.summary || `Component list for ${projectTitle}`,
          hardware: (data.hardware || []).map((c: any) => ({
            name: c.name || "Unknown", category: "hardware" as const,
            description: c.description || "", quantity: c.quantity || 1,
            search_query: c.search_query || c.name,
          })),
          software: (data.software || []).map((c: any) => ({
            name: c.name || "Unknown", category: "software" as const,
            description: c.description || "", quantity: c.quantity || 1,
            search_query: c.search_query || c.name,
          })),
        };
      } catch (e: any) {
        if (e?.message?.includes("429") || e?.message?.includes("rate")) continue;
        console.warn(`Gemini ${model} attempt ${attempt} failed:`, e?.message);
        break;
      }
    }
  }
  throw new Error("All Gemini models failed or rate limited");
}

// ── OpenAI direct call ────────────────────────────────────────────────────────
export async function analyzeWithOpenAI(projectTitle: string): Promise<AnalyzeResponse> {
  const key = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
  if (!key) throw new Error("No OpenAI API key configured");

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: `Project: ${projectTitle}` },
      ],
      temperature: 0.3,
      response_format: { type: "json_object" },
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message || `OpenAI API error ${res.status}`);
  }

  const json = await res.json();
  const data = JSON.parse(json.choices[0].message.content);

  return {
    project_title: projectTitle,
    summary: data.summary || "",
    hardware: (data.hardware || []).map((c: any) => ({ ...c, category: "hardware" } as Component)),
    software: (data.software || []).map((c: any) => ({ ...c, category: "software" } as Component)),
  };
}

// ── Smart analyze: tries backend → Gemini → OpenAI → fallback ────────────────
export async function smartAnalyze(
  projectTitle: string,
  backendFn: (title: string) => Promise<AnalyzeResponse>
): Promise<{ result: AnalyzeResponse; source: "backend" | "gemini" | "openai" | "fallback" }> {
  // 1. Try backend
  try {
    const result = await backendFn(projectTitle);
    return { result, source: "backend" };
  } catch {
    // backend not running — continue
  }

  // 2. Try Gemini (free, fast)
  try {
    const result = await analyzeWithGemini(projectTitle);
    return { result, source: "gemini" };
  } catch {
    // Gemini failed — continue
  }

  // 3. Try OpenAI
  try {
    const result = await analyzeWithOpenAI(projectTitle);
    return { result, source: "openai" };
  } catch {
    // OpenAI failed — continue
  }

  // 4. Return fallback
  return { result: getFallback(projectTitle), source: "fallback" };
}

// ── Fallback data ─────────────────────────────────────────────────────────────
function getFallback(title: string): AnalyzeResponse {
  const t = title.toLowerCase();
  const db: Record<string, Omit<AnalyzeResponse, "project_title">> = {
    "smart irrigation": {
      summary: "IoT-based irrigation system that monitors soil moisture and automates watering using sensors and a microcontroller connected to the cloud.",
      hardware: [
        { name: "Arduino Uno R3", category: "hardware", description: "Main microcontroller", quantity: 1, search_query: "Arduino Uno R3" },
        { name: "Soil Moisture Sensor", category: "hardware", description: "Detects soil water level", quantity: 2, search_query: "capacitive soil moisture sensor" },
        { name: "ESP8266 NodeMCU", category: "hardware", description: "WiFi connectivity", quantity: 1, search_query: "ESP8266 NodeMCU" },
        { name: "Relay Module 5V", category: "hardware", description: "Controls water pump", quantity: 1, search_query: "5V relay module" },
        { name: "Water Pump 12V", category: "hardware", description: "Pumps water to plants", quantity: 1, search_query: "12V submersible water pump" },
        { name: "DHT11 Sensor", category: "hardware", description: "Temperature and humidity", quantity: 1, search_query: "DHT11 sensor" },
        { name: "Jumper Wires", category: "hardware", description: "Circuit connections", quantity: 20, search_query: "jumper wires kit" },
        { name: "Breadboard", category: "hardware", description: "Prototyping board", quantity: 1, search_query: "830 point breadboard" },
      ],
      software: [
        { name: "Arduino IDE", category: "software", description: "Programming environment", quantity: 1, search_query: "Arduino IDE download" },
        { name: "Blynk IoT Platform", category: "software", description: "Cloud dashboard", quantity: 1, search_query: "Blynk IoT platform" },
      ],
    },
    "line following robot": {
      summary: "A robot that follows a black line on a white surface using IR sensors and a motor driver controlled by a microcontroller.",
      hardware: [
        { name: "Arduino Uno R3", category: "hardware", description: "Main controller", quantity: 1, search_query: "Arduino Uno R3" },
        { name: "IR Sensor Module", category: "hardware", description: "Detects line", quantity: 2, search_query: "IR infrared sensor module" },
        { name: "L298N Motor Driver", category: "hardware", description: "Controls DC motors", quantity: 1, search_query: "L298N motor driver" },
        { name: "DC Gear Motor 6V", category: "hardware", description: "Drives wheels", quantity: 2, search_query: "DC gear motor 6V" },
        { name: "2WD Robot Chassis", category: "hardware", description: "Robot body", quantity: 1, search_query: "2WD robot chassis kit" },
        { name: "Li-Po Battery 7.4V", category: "hardware", description: "Power supply", quantity: 1, search_query: "7.4V LiPo battery" },
      ],
      software: [
        { name: "Arduino IDE", category: "software", description: "Programming environment", quantity: 1, search_query: "Arduino IDE download" },
      ],
    },
    "home automation": {
      summary: "Smart home system controlling lights, fans, and appliances via smartphone app using ESP32 and relay modules.",
      hardware: [
        { name: "ESP32 DevKit V1", category: "hardware", description: "Main WiFi+BT controller", quantity: 1, search_query: "ESP32 DevKit V1" },
        { name: "4-Channel Relay Module", category: "hardware", description: "Controls appliances", quantity: 1, search_query: "4 channel relay module 5V" },
        { name: "DHT22 Sensor", category: "hardware", description: "Temperature/humidity", quantity: 1, search_query: "DHT22 sensor" },
        { name: "PIR Motion Sensor", category: "hardware", description: "Motion detection", quantity: 2, search_query: "PIR motion sensor HC-SR501" },
      ],
      software: [
        { name: "Arduino IDE", category: "software", description: "Programming environment", quantity: 1, search_query: "Arduino IDE download" },
        { name: "Blynk App", category: "software", description: "Mobile control app", quantity: 1, search_query: "Blynk IoT app" },
      ],
    },
    "face recognition": {
      summary: "Automated attendance system using OpenCV face recognition on Raspberry Pi with camera module.",
      hardware: [
        { name: "Raspberry Pi 4 Model B", category: "hardware", description: "Main processing unit", quantity: 1, search_query: "Raspberry Pi 4 4GB" },
        { name: "Raspberry Pi Camera Module V2", category: "hardware", description: "Captures face images", quantity: 1, search_query: "Raspberry Pi camera module v2" },
        { name: "MicroSD Card 32GB", category: "hardware", description: "OS and data storage", quantity: 1, search_query: "32GB microSD card" },
        { name: "5V 3A Power Supply", category: "hardware", description: "Powers Raspberry Pi", quantity: 1, search_query: "Raspberry Pi 5V 3A power supply" },
      ],
      software: [
        { name: "Raspberry Pi OS", category: "software", description: "Operating system", quantity: 1, search_query: "Raspberry Pi OS" },
        { name: "OpenCV", category: "software", description: "Face detection library", quantity: 1, search_query: "OpenCV Python" },
        { name: "face_recognition Library", category: "software", description: "Face recognition", quantity: 1, search_query: "face_recognition Python library" },
        { name: "Python 3", category: "software", description: "Programming language", quantity: 1, search_query: "Python 3 download" },
      ],
    },
  };

  const match = Object.entries(db).find(([k]) => t.includes(k));
  const data = match ? match[1] : {
    summary: "A technical project requiring various hardware and software components.",
    hardware: [
      { name: "Arduino Uno R3", category: "hardware" as const, description: "Main microcontroller", quantity: 1, search_query: "Arduino Uno R3" },
      { name: "Breadboard", category: "hardware" as const, description: "Prototyping board", quantity: 1, search_query: "830 point breadboard" },
      { name: "Jumper Wires Kit", category: "hardware" as const, description: "Circuit connections", quantity: 1, search_query: "jumper wires kit" },
      { name: "Resistor Kit", category: "hardware" as const, description: "Various resistors", quantity: 1, search_query: "resistor assortment kit" },
      { name: "LED Pack", category: "hardware" as const, description: "Indicator LEDs", quantity: 1, search_query: "LED assorted pack" },
    ],
    software: [
      { name: "Arduino IDE", category: "software" as const, description: "Development environment", quantity: 1, search_query: "Arduino IDE download" },
    ],
  };

  return { project_title: title, ...data };
}
