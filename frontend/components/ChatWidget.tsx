"use client";
import { useState, useRef, useEffect } from "react";
import {
  MessageCircle, X, Send, Loader2, Bot, User,
  Minimize2, Maximize2, Trash2, Sparkles,
} from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const SUGGESTIONS = [
  "What components do I need for a smart irrigation system?",
  "Compare Arduino Uno vs ESP32",
  "How to connect DHT11 to Arduino?",
  "Cheapest way to build a line following robot",
  "What is the price of Raspberry Pi 4 in India?",
];

const GEMINI_MODELS = [
  "gemini-2.0-flash",
  "gemini-1.5-flash",
  "gemini-1.5-flash-8b",
  "gemini-pro",
];

const CHAT_SYSTEM_PROMPT = `You are COTsify AI, an expert electronics and engineering assistant for Indian makers and students.
You help with:
- Component selection and Bill of Materials (BOM) for any electronics project
- Wiring diagrams and pin connections (Arduino, ESP32, Raspberry Pi, etc.)
- Price comparison in INR across Amazon, Flipkart, and Robu.in
- Project planning, difficulty estimation, and cost estimation
- Troubleshooting circuits and code
- Explaining electronics concepts clearly

Always be helpful, concise, and technical. Include INR prices when mentioning components.
Format responses with markdown: use **bold** for component names, bullet points for lists, and ## headings for sections.
If asked about any project, provide a complete component list with estimated prices in INR.`;

function formatMessage(text: string) {
  const lines = text.split("\n");
  return lines.map((line, i) => {
    if (line.startsWith("- ") || line.startsWith("• ")) {
      return <li key={i} className="ml-4 list-disc text-gray-200">{line.slice(2)}</li>;
    }
    if (line.startsWith("# ")) {
      return <p key={i} className="font-bold text-cyan-400 text-base">{line.slice(2)}</p>;
    }
    if (line.startsWith("## ")) {
      return <p key={i} className="font-bold text-cyan-300 text-sm">{line.slice(3)}</p>;
    }
    if (line.match(/^\d+\./)) {
      return <li key={i} className="ml-4 list-decimal text-gray-200">{line.replace(/^\d+\.\s*/, "")}</li>;
    }
    if (line.trim() === "") return <br key={i} />;
    const parts = line.split(/\*\*(.*?)\*\*/g);
    return (
      <p key={i} className="text-gray-200 leading-relaxed">
        {parts.map((part, j) =>
          j % 2 === 1 ? <strong key={j} className="text-white">{part}</strong> : part
        )}
      </p>
    );
  });
}

// ── Gemini direct call ────────────────────────────────────────────────────────
async function callGemini(messages: { role: string; content: string }[]): Promise<string> {
  const key = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  if (!key) throw new Error("No Gemini key");

  // Build Gemini contents (must alternate user/model, start with user)
  const contents: { role: string; parts: { text: string }[] }[] = [];
  for (const m of messages) {
    const role = m.role === "user" ? "user" : "model";
    // Merge consecutive same-role messages
    if (contents.length > 0 && contents[contents.length - 1].role === role) {
      contents[contents.length - 1].parts[0].text += "\n" + m.content;
    } else {
      contents.push({ role, parts: [{ text: m.content }] });
    }
  }
  // Gemini requires starting with user
  if (contents.length === 0 || contents[0].role !== "user") {
    contents.unshift({ role: "user", parts: [{ text: "Hello" }] });
  }

  for (const model of GEMINI_MODELS) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`;
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: CHAT_SYSTEM_PROMPT }] },
          contents,
          generationConfig: { temperature: 0.7, maxOutputTokens: 1024 },
        }),
      });

      if (res.status === 429) {
        // Rate limited — try next model
        continue;
      }
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        const msg = (err as { error?: { message?: string } })?.error?.message || "";
        // Model not found or not supported — try next
        if (res.status === 404 || msg.includes("not found") || msg.includes("deprecated")) continue;
        throw new Error(msg || `Gemini ${res.status}`);
      }

      const json = await res.json();
      const text: string = json?.candidates?.[0]?.content?.parts?.[0]?.text || "";
      if (!text) throw new Error("Empty response");
      return text;
    } catch (e) {
      const msg = e instanceof Error ? e.message : "";
      // Rate limit or model issue — try next
      if (msg.includes("429") || msg.includes("not found") || msg.includes("deprecated")) continue;
      throw e;
    }
  }
  throw new Error("All Gemini models failed or rate limited");
}

// ── OpenAI direct call ────────────────────────────────────────────────────────
async function callOpenAI(messages: { role: string; content: string }[]): Promise<string> {
  const key = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
  if (!key) throw new Error("No OpenAI key");

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${key}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: CHAT_SYSTEM_PROMPT },
        ...messages.map(m => ({ role: m.role as "user" | "assistant", content: m.content })),
      ],
      temperature: 0.7,
      max_tokens: 1024,
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as any)?.error?.message || `OpenAI ${res.status}`);
  }

  const json = await res.json();
  const text: string = json?.choices?.[0]?.message?.content || "";
  if (!text) throw new Error("Empty OpenAI response");
  return text;
}

// ── OpenAI streaming call ─────────────────────────────────────────────────────
async function* streamOpenAI(messages: { role: string; content: string }[]): AsyncGenerator<string> {
  const key = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
  if (!key) throw new Error("No OpenAI key");

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${key}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: CHAT_SYSTEM_PROMPT },
        ...messages.map(m => ({ role: m.role as "user" | "assistant", content: m.content })),
      ],
      temperature: 0.7,
      max_tokens: 1024,
      stream: true,
    }),
  });

  if (!res.ok) throw new Error(`OpenAI ${res.status}`);

  const reader = res.body?.getReader();
  const decoder = new TextDecoder();
  if (!reader) return;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    const chunk = decoder.decode(value);
    for (const line of chunk.split("\n")) {
      if (line.startsWith("data: ")) {
        const data = line.slice(6).trim();
        if (data === "[DONE]") return;
        try {
          const parsed = JSON.parse(data);
          const delta = parsed?.choices?.[0]?.delta?.content;
          if (delta) yield delta;
        } catch { /* ignore */ }
      }
    }
  }
}
  const msg = message.toLowerCase();

  if (["hello", "hi", "hey"].some(w => msg.includes(w))) {
    return "Hello! I'm **COTsify AI**, your engineering assistant.\n\nI can help with:\n- Component lists for any project\n- Price comparison (Amazon/Flipkart/Robu.in)\n- Technical specs and wiring\n- Arduino, ESP32, Raspberry Pi guidance\n\nWhat project are you building?";
  }

  const prices: Record<string, string> = {
    "arduino": "**Arduino Uno R3** — Amazon: ₹649 | Flipkart: ₹599 | Robu.in: ₹349",
    "esp32": "**ESP32 DevKit V1** — Amazon: ₹399 | Flipkart: ₹379 | Robu.in: ₹299",
    "esp8266": "**ESP8266 NodeMCU** — Amazon: ₹299 | Flipkart: ₹279 | Robu.in: ₹199",
    "raspberry pi": "**Raspberry Pi 4 4GB** — Amazon: ₹5,499 | Robu.in: ₹5,200",
    "dht11": "**DHT11 Sensor** — Amazon: ₹119 | Flipkart: ₹99 | Robu.in: ₹79",
    "dht22": "**DHT22 Sensor** — Amazon: ₹249 | Flipkart: ₹229 | Robu.in: ₹189",
    "ultrasonic": "**HC-SR04 Ultrasonic** — Amazon: ₹89 | Flipkart: ₹79 | Robu.in: ₹59",
    "relay": "**5V Relay Module** — Amazon: ₹89 | Flipkart: ₹79 | Robu.in: ₹59",
    "servo": "**SG90 Servo** — Amazon: ₹129 | Flipkart: ₹119 | Robu.in: ₹89",
    "l298n": "**L298N Motor Driver** — Amazon: ₹149 | Flipkart: ₹129 | Robu.in: ₹99",
    "oled": "**0.96\" OLED I2C** — Amazon: ₹199 | Flipkart: ₹179 | Robu.in: ₹149",
    "soil moisture": "**Capacitive Soil Moisture Sensor** — Amazon: ₹149 | Flipkart: ₹129 | Robu.in: ₹99",
  };

  for (const [key, info] of Object.entries(prices)) {
    if (msg.includes(key)) return info + "\n\n💡 Robu.in is usually cheapest for Indian buyers!";
  }

  if (msg.includes("arduino") && (msg.includes("esp32") || msg.includes("vs"))) {
    return "## Arduino Uno vs ESP32\n\n| Feature | Arduino Uno | ESP32 |\n|---|---|---|\n| CPU | 16MHz | 240MHz Dual-core |\n| RAM | 2KB | 520KB |\n| WiFi | ❌ | ✅ |\n| Bluetooth | ❌ | ✅ BLE |\n| Price | ₹649 | ₹399 |\n\n**Use ESP32** for IoT/WiFi projects. **Use Arduino** for learning basics.";
  }

  if (msg.includes("dht11") && (msg.includes("wire") || msg.includes("connect") || msg.includes("pin"))) {
    return "## DHT11 → Arduino Wiring\n\n- VCC → 5V\n- DATA → Digital Pin 2 (+ 10kΩ pull-up to VCC)\n- GND → GND\n\n**Library:** `DHT sensor library` by Adafruit";
  }

  if (msg.includes("irrigation")) {
    return "## Smart Irrigation Components\n\n- Arduino Uno R3 — ₹649\n- Soil Moisture Sensor ×2 — ₹149 each\n- ESP8266 NodeMCU — ₹299\n- 5V Relay Module — ₹89\n- Water Pump 12V — ₹199\n- DHT11 Sensor — ₹119\n- Jumper Wires — ₹99\n- Breadboard — ₹79\n\n**Total: ~₹1,800-2,200**\n\n💡 Use the **Search** tab for a full detailed BOM!";
  }

  if (msg.includes("line follow") || msg.includes("line robot")) {
    return "## Line Following Robot Components\n\n- Arduino Uno R3 — ₹649\n- IR Sensor Module ×2 — ₹59 each\n- L298N Motor Driver — ₹149\n- DC Gear Motor 6V ×2 — ₹179 each\n- Robot Chassis Kit — ₹299\n- Li-Po Battery 7.4V — ₹699\n\n**Total: ~₹2,200-2,500**";
  }

  if (msg.includes("buy") || msg.includes("where") || msg.includes("shop")) {
    return "## Best Places to Buy in India\n\n**Online:**\n- Robu.in — Cheapest for components\n- Amazon.in — Fast delivery\n- Flipkart — Good prices\n- ElectronicsComp.com\n\n**Offline:**\n- Mumbai: Lamington Road\n- Delhi: Lajpat Rai Market\n- Bangalore: SP Road\n- Chennai: Ritchie Street";
  }

  return `I can help with **"${message}"**!\n\nTry asking:\n- "What components for a ${message}?"\n- "Price of Arduino Uno"\n- "Arduino vs ESP32"\n- "How to wire DHT11 to Arduino"\n\nOr use the **Search** tab for a complete component list with prices! 🔍`;
}

export default function ChatWidget({ projectContext, inline = false }: { projectContext?: string; inline?: boolean }) {
  const [open, setOpen] = useState(inline);
  const [minimized, setMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Hello! I am COTsify AI, your engineering assistant.\n\nI can help you:\n- Identify components for your project\n- Compare prices across platforms\n- Explain technical specifications\n- Suggest alternatives and wiring\n\nWhat are you building today?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [streamingText, setStreamingText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamingText]);

  const addAssistantMessage = (content: string) => {
    setMessages(prev => [...prev, {
      id: crypto.randomUUID(),
      role: "assistant",
      content,
      timestamp: new Date(),
    }]);
  };

  const sendMessage = async (text?: string) => {
    const content = (text || input).trim();
    if (!content || loading) return;
    setInput("");

    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);
    setStreamingText("");

    const allMessages = [...messages, userMsg].map(m => ({ role: m.role, content: m.content }));
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

    // ── 1. Try OpenAI streaming (fastest, most reliable) ─────────────────────
    try {
      let fullText = "";
      for await (const chunk of streamOpenAI(allMessages)) {
        fullText += chunk;
        setStreamingText(fullText);
      }
      if (fullText) {
        setStreamingText("");
        addAssistantMessage(fullText);
        setLoading(false);
        return;
      }
    } catch { /* OpenAI failed — try next */ }

    // ── 2. Try Gemini directly from browser ──────────────────────────────────
    try {
      const reply = await callGemini(allMessages);
      setStreamingText("");
      addAssistantMessage(reply);
      setLoading(false);
      return;
    } catch { /* Gemini failed — try backend */ }

    // ── 3. Try backend streaming ──────────────────────────────────────────────
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 8000);

      const response = await fetch(`${backendUrl}/api/chat/stream`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: allMessages, project_context: projectContext, stream: true }),
        signal: controller.signal,
      });
      clearTimeout(timeout);

      if (!response.ok) throw new Error(`Backend ${response.status}`);

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let fullText = "";

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value);
          for (const line of chunk.split("\n")) {
            if (line.startsWith("data: ")) {
              const data = line.slice(6);
              if (data === "[DONE]") break;
              try {
                const parsed = JSON.parse(data);
                if (parsed.content) { fullText += parsed.content; setStreamingText(fullText); }
              } catch { /* ignore */ }
            }
          }
        }
      }

      if (fullText) {
        setStreamingText("");
        addAssistantMessage(fullText);
        setLoading(false);
        return;
      }
    } catch { /* backend unavailable */ }

    // ── 4. Try backend non-streaming ─────────────────────────────────────────
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 8000);
      const res = await fetch(`${backendUrl}/api/chat/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: allMessages, project_context: projectContext }),
        signal: controller.signal,
      });
      clearTimeout(timeout);
      if (res.ok) {
        const data = await res.json();
        if (data.message) {
          setStreamingText("");
          addAssistantMessage(data.message);
          setLoading(false);
          return;
        }
      }
    } catch { /* backend unavailable */ }

    // ── 5. Smart local fallback ───────────────────────────────────────────────
    setStreamingText("");
    addAssistantMessage(localSmartResponse(content));
    setLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([{
      id: "welcome",
      role: "assistant",
      content: "Chat cleared. How can I help you?",
      timestamp: new Date(),
    }]);
  };

  return (
    <>
      {/* Floating button */}
      {!inline && !open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-gradient-to-br from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 rounded-full shadow-2xl flex items-center justify-center transition-all hover:scale-110"
          title="Open AI Assistant"
        >
          <Sparkles className="w-6 h-6 text-white" />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-gray-950 animate-pulse" />
        </button>
      )}

      {/* Chat window */}
      {(inline || open) && (
        <div
          className={
            inline
              ? "flex flex-col bg-gray-900 border border-gray-800 rounded-2xl shadow-xl w-full h-[600px] max-w-4xl mx-auto"
              : `fixed right-6 z-50 flex flex-col bg-gray-950 border border-gray-700 rounded-2xl shadow-2xl transition-all ${
                  minimized ? "bottom-6 w-72 h-14" : "bottom-6 w-96 h-[600px]"
                }`
          }
          style={!inline ? { maxHeight: "calc(100vh - 100px)" } : {}}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-cyan-600 to-blue-700 rounded-t-2xl flex-shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-white font-semibold text-sm">COTsify AI</p>
                <p className="text-cyan-200 text-xs flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full inline-block" />
                  Online
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button onClick={clearChat} className="text-white/70 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors" title="Clear chat">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
              {!inline && (
                <>
                  <button onClick={() => setMinimized(!minimized)} className="text-white/70 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors">
                    {minimized ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
                  </button>
                  <button onClick={() => setOpen(false)} className="text-white/70 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </>
              )}
            </div>
          </div>

          {!minimized && (
            <>
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 min-h-0">
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex gap-2 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === "user" ? "bg-cyan-600" : "bg-gray-700"}`}>
                      {msg.role === "user"
                        ? <User className="w-3.5 h-3.5 text-white" />
                        : <Bot className="w-3.5 h-3.5 text-cyan-400" />}
                    </div>
                    <div className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm ${msg.role === "user" ? "bg-cyan-600 text-white rounded-tr-sm" : "bg-gray-800 text-gray-200 rounded-tl-sm"}`}>
                      <div className="flex flex-col gap-0.5">{formatMessage(msg.content)}</div>
                      <p className="text-xs opacity-50 mt-1 text-right">
                        {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                  </div>
                ))}

                {/* Streaming message */}
                {loading && streamingText && (
                  <div className="flex gap-2">
                    <div className="w-7 h-7 rounded-full bg-gray-700 flex items-center justify-center flex-shrink-0">
                      <Bot className="w-3.5 h-3.5 text-cyan-400" />
                    </div>
                    <div className="max-w-[80%] bg-gray-800 rounded-2xl rounded-tl-sm px-3 py-2 text-sm">
                      <div className="flex flex-col gap-0.5">{formatMessage(streamingText)}</div>
                      <span className="inline-block w-1.5 h-4 bg-cyan-400 animate-pulse ml-0.5" />
                    </div>
                  </div>
                )}

                {/* Loading dots */}
                {loading && !streamingText && (
                  <div className="flex gap-2">
                    <div className="w-7 h-7 rounded-full bg-gray-700 flex items-center justify-center flex-shrink-0">
                      <Bot className="w-3.5 h-3.5 text-cyan-400" />
                    </div>
                    <div className="bg-gray-800 rounded-2xl rounded-tl-sm px-4 py-3">
                      <div className="flex gap-1">
                        <span className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                        <span className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                        <span className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Suggestions */}
              {messages.length <= 1 && (
                <div className="px-4 pb-2 flex gap-2 overflow-x-auto flex-shrink-0">
                  {SUGGESTIONS.slice(0, 3).map((s) => (
                    <button
                      key={s}
                      onClick={() => sendMessage(s)}
                      className="text-xs bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-700 px-3 py-1.5 rounded-full whitespace-nowrap transition-colors flex-shrink-0"
                    >
                      {s.length > 35 ? s.slice(0, 35) + "..." : s}
                    </button>
                  ))}
                </div>
              )}

              {/* Input */}
              <div className="p-3 border-t border-gray-800 flex-shrink-0">
                <div className="flex gap-2 items-end bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 focus-within:border-cyan-600 transition-colors">
                  <textarea
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask about components, prices, wiring..."
                    rows={1}
                    className="flex-1 bg-transparent text-white text-sm placeholder-gray-500 resize-none focus:outline-none max-h-24"
                    style={{ lineHeight: "1.5" }}
                  />
                  <button
                    onClick={() => sendMessage()}
                    disabled={!input.trim() || loading}
                    className="w-8 h-8 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 rounded-lg flex items-center justify-center transition-colors flex-shrink-0"
                  >
                    {loading
                      ? <Loader2 className="w-4 h-4 text-gray-950 animate-spin" />
                      : <Send className="w-4 h-4 text-gray-950" />}
                  </button>
                </div>
                <p className="text-xs text-gray-600 mt-1.5 text-center">
                  Press Enter to send · Shift+Enter for new line
                </p>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}
