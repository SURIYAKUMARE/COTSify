"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { api } from "@/lib/api";
import RouteGuard from "@/components/RouteGuard";
import dynamic from "next/dynamic";
import {
  Search, Loader2, ExternalLink, Globe, ShoppingCart,
  AlertCircle, RefreshCw, Filter, TrendingDown, Star,
  Package, Zap, ChevronRight, Bot,
} from "lucide-react";

const ChatWidget = dynamic(() => import("@/components/ChatWidget"), { ssr: false });

interface SearchResult {
  title: string;
  link: string;
  snippet: string;
  platform?: string;
  price?: number;
  image?: string;
  display_link?: string;
}

const PLATFORM_COLORS: Record<string, string> = {
  Amazon: "bg-orange-950/60 text-orange-400 border-orange-800",
  Flipkart: "bg-blue-950/60 text-blue-400 border-blue-800",
  "Robu.in": "bg-green-950/60 text-green-400 border-green-800",
  ElectronicsComp: "bg-purple-950/60 text-purple-400 border-purple-800",
  QuartzComponents: "bg-cyan-950/60 text-cyan-400 border-cyan-800",
  "Google Shopping": "bg-red-950/60 text-red-400 border-red-800",
  Web: "bg-gray-800 text-gray-400 border-gray-700",
};

const QUICK_SEARCHES = [
  "Arduino Uno R3", "ESP32 DevKit", "Raspberry Pi 4",
  "Soil Moisture Sensor", "HC-SR04 Ultrasonic", "L298N Motor Driver",
  "DHT11 Sensor", "SG90 Servo Motor", "RFID Module",
  "16x2 LCD Display", "OLED Display I2C", "PIR Motion Sensor",
];

function GSearchContent() {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [inputValue, setInputValue] = useState(searchParams.get("q") || "");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [source, setSource] = useState("");
  const [error, setError] = useState("");
  const [searchType, setSearchType] = useState<"products" | "web">("products");
  const [filterPlatform, setFilterPlatform] = useState("All");
  const [sortBy, setSortBy] = useState("relevance");
  const [searchStatus, setSearchStatus] = useState<any>(null);

  useEffect(() => {
    // Check Google Search status
    api.get("/api/search/status").then(({ data }) => setSearchStatus(data)).catch(() => {});
    if (query) doSearch(query);
  }, []);

  const doSearch = async (q: string) => {
    if (!q.trim()) return;
    setLoading(true);
    setError("");
    setResults([]);
    try {
      const endpoint = searchType === "products" ? "/api/search/products" : "/api/search/web";
      const { data } = await api.get(`${endpoint}?q=${encodeURIComponent(q)}&num=10`);
      setResults(data.results);
      setSource(data.source);
    } catch {
      setError("Search failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setQuery(inputValue);
    doSearch(inputValue);
  };

  // Filter + sort
  const filtered = results
    .filter(r => filterPlatform === "All" || r.platform === filterPlatform)
    .sort((a, b) => {
      if (sortBy === "price_asc") return (a.price || 9999) - (b.price || 9999);
      if (sortBy === "price_desc") return (b.price || 0) - (a.price || 0);
      return 0;
    });

  const platforms = ["All", ...Array.from(new Set(results.map(r => r.platform || "Web")))];
  const priced = results.filter(r => r.price);
  const lowestPrice = priced.length ? Math.min(...priced.map(r => r.price!)) : null;

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 bg-blue-950/60 border border-blue-800/50 text-blue-400 text-xs px-4 py-1.5 rounded-full mb-4">
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Powered by Google Search
        </div>
        <h1 className="text-3xl font-bold text-white mb-3">
          Component <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Search Engine</span>
        </h1>
        <p className="text-gray-400 text-sm max-w-xl mx-auto">
          Search for any electronic component across Amazon, Flipkart, Robu.in and more — powered by Google.
        </p>
      </div>

      {/* Google Search status banner */}
      {searchStatus && !searchStatus.configured && (
        <div className="mb-6 bg-amber-950/40 border border-amber-800/50 rounded-2xl p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-amber-400 font-medium text-sm">Google Custom Search not configured</p>
            <p className="text-amber-500/70 text-xs mt-1">
              Showing direct store links. To enable live Google results:
            </p>
            <ol className="text-amber-500/70 text-xs mt-2 space-y-1 list-decimal list-inside">
              <li>Go to <a href="https://programmablesearchengine.google.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-amber-300">programmablesearchengine.google.com</a></li>
              <li>Create a new search engine → copy the Search Engine ID</li>
              <li>Get API key from <a href="https://console.cloud.google.com/apis/credentials" target="_blank" rel="noopener noreferrer" className="underline hover:text-amber-300">Google Cloud Console</a> → enable Custom Search API</li>
              <li>Add to <code className="bg-amber-950 px-1 rounded">backend/.env</code>: <code className="bg-amber-950 px-1 rounded">GOOGLE_SEARCH_API_KEY</code> and <code className="bg-amber-950 px-1 rounded">GOOGLE_SEARCH_ENGINE_ID</code></li>
            </ol>
          </div>
        </div>
      )}

      {/* Search bar */}
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              placeholder="Search for any component, e.g. Arduino Uno, ESP32, DHT11..."
              className="w-full bg-gray-900 border border-gray-700 rounded-2xl pl-12 pr-4 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-600 transition-colors text-sm"
            />
          </div>
          <button type="submit" disabled={loading || !inputValue.trim()}
            className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-50 text-white font-semibold px-6 py-4 rounded-2xl transition-all flex items-center gap-2">
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
            Search
          </button>
        </div>

        {/* Search type toggle */}
        <div className="flex gap-2 mt-3">
          <span className="text-gray-500 text-xs self-center">Search type:</span>
          {[["products","🛒 Products"],["web","🌐 Web"]].map(([val, label]) => (
            <button key={val} type="button" onClick={() => setSearchType(val as any)}
              className={`text-xs px-3 py-1.5 rounded-full border transition-all ${searchType === val ? "bg-cyan-500 text-gray-950 border-cyan-500 font-semibold" : "bg-gray-900 text-gray-400 border-gray-700 hover:border-cyan-700"}`}>
              {label}
            </button>
          ))}
        </div>
      </form>

      {/* Quick searches */}
      {!results.length && !loading && (
        <div className="mb-8">
          <p className="text-gray-500 text-xs mb-3 flex items-center gap-1.5"><Zap className="w-3.5 h-3.5 text-cyan-400" /> Popular searches:</p>
          <div className="flex flex-wrap gap-2">
            {QUICK_SEARCHES.map(q => (
              <button key={q} onClick={() => { setInputValue(q); setQuery(q); doSearch(q); }}
                className="text-xs bg-gray-900 hover:bg-gray-800 border border-gray-800 hover:border-cyan-700 text-gray-400 hover:text-cyan-400 px-3 py-1.5 rounded-full transition-all">
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex flex-col items-center gap-3 py-16 text-gray-400">
          <div className="flex items-center gap-2">
            <svg className="w-6 h-6 animate-spin" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span>Searching Google...</span>
          </div>
          <p className="text-xs text-gray-600">Finding best prices across Indian stores</p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 bg-red-950/50 border border-red-800 text-red-400 rounded-xl px-4 py-3 mb-6">
          <AlertCircle className="w-4 h-4" /> {error}
        </div>
      )}

      {/* Results */}
      {filtered.length > 0 && (
        <div>
          {/* Results header */}
          <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <span className="text-gray-400 text-sm">
                <span className="text-white font-semibold">{filtered.length}</span> results for "<span className="text-cyan-400">{query}</span>"
              </span>
              {source === "google" && (
                <span className="text-xs bg-green-950 text-green-400 border border-green-800 px-2 py-0.5 rounded-full">
                  Live Google results
                </span>
              )}
            </div>

            {/* Filters */}
            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex bg-gray-900 border border-gray-800 rounded-xl p-1 gap-1">
                {platforms.map(p => (
                  <button key={p} onClick={() => setFilterPlatform(p)}
                    className={`text-xs px-2.5 py-1 rounded-lg transition-colors ${filterPlatform === p ? "bg-gray-700 text-white" : "text-gray-500 hover:text-gray-300"}`}>
                    {p}
                  </button>
                ))}
              </div>
              <select value={sortBy} onChange={e => setSortBy(e.target.value)}
                className="text-xs bg-gray-900 border border-gray-800 text-gray-400 px-3 py-2 rounded-xl focus:outline-none focus:border-cyan-600">
                <option value="relevance">Sort: Relevance</option>
                <option value="price_asc">Price: Low → High</option>
                <option value="price_desc">Price: High → Low</option>
              </select>
            </div>
          </div>

          {/* Price summary */}
          {priced.length > 0 && (
            <div className="grid grid-cols-3 gap-3 mb-5">
              <div className="bg-green-950/40 border border-green-800/50 rounded-xl p-3 text-center">
                <div className="text-xs text-gray-500 mb-1 flex items-center justify-center gap-1"><TrendingDown className="w-3 h-3" /> Lowest</div>
                <div className="text-green-400 font-bold">₹{Math.min(...priced.map(r => r.price!)).toLocaleString()}</div>
              </div>
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-3 text-center">
                <div className="text-xs text-gray-500 mb-1">Average</div>
                <div className="text-white font-bold">₹{Math.round(priced.reduce((s, r) => s + r.price!, 0) / priced.length).toLocaleString()}</div>
              </div>
              <div className="bg-red-950/40 border border-red-800/50 rounded-xl p-3 text-center">
                <div className="text-xs text-gray-500 mb-1">Highest</div>
                <div className="text-red-400 font-bold">₹{Math.max(...priced.map(r => r.price!)).toLocaleString()}</div>
              </div>
            </div>
          )}

          {/* Result cards */}
          <div className="flex flex-col gap-3">
            {filtered.map((r, i) => {
              const colorClass = PLATFORM_COLORS[r.platform || "Web"] || PLATFORM_COLORS.Web;
              const isLowest = r.price && r.price === lowestPrice;
              return (
                <a key={i} href={r.link} target="_blank" rel="noopener noreferrer"
                  className={`group flex items-start gap-4 bg-gray-900 border rounded-2xl p-4 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/20 ${isLowest ? "border-green-700/50 hover:border-green-600" : "border-gray-800 hover:border-cyan-800/50"}`}>
                  {/* Platform badge */}
                  <div className="flex-shrink-0 mt-0.5">
                    <span className={`text-xs px-2.5 py-1 rounded-full border font-medium ${colorClass}`}>
                      {r.platform || "Web"}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-white font-medium text-sm group-hover:text-cyan-300 transition-colors line-clamp-1">{r.title}</p>
                        <p className="text-gray-500 text-xs mt-1 line-clamp-2">{r.snippet}</p>
                        {r.display_link && <p className="text-gray-600 text-xs mt-1">{r.display_link}</p>}
                      </div>
                      <div className="flex-shrink-0 text-right">
                        {r.price ? (
                          <div>
                            <div className={`font-bold text-lg ${isLowest ? "text-green-400" : "text-cyan-400"}`}>
                              ₹{r.price.toLocaleString()}
                            </div>
                            {isLowest && <div className="text-xs text-green-500">Best price</div>}
                          </div>
                        ) : (
                          <div className="text-gray-500 text-xs">Check price</div>
                        )}
                      </div>
                    </div>
                  </div>

                  <ExternalLink className="w-4 h-4 text-gray-600 group-hover:text-cyan-400 transition-colors flex-shrink-0 mt-1" />
                </a>
              );
            })}
          </div>

          {/* Google attribution */}
          {source === "google" && (
            <div className="mt-6 flex items-center justify-center gap-2 text-gray-600 text-xs">
              <span>Search powered by</span>
              <svg className="w-12 h-4" viewBox="0 0 272 92" xmlns="http://www.w3.org/2000/svg">
                <path fill="#4285F4" d="M115.75 47.18c0 12.77-9.99 22.18-22.25 22.18s-22.25-9.41-22.25-22.18C71.25 34.32 81.24 25 93.5 25s22.25 9.32 22.25 22.18zm-9.74 0c0-7.98-5.79-13.44-12.51-13.44S80.99 39.2 80.99 47.18c0 7.9 5.79 13.44 12.51 13.44s12.51-5.55 12.51-13.44z"/>
                <path fill="#EA4335" d="M163.75 47.18c0 12.77-9.99 22.18-22.25 22.18s-22.25-9.41-22.25-22.18c0-12.85 9.99-22.18 22.25-22.18s22.25 9.32 22.25 22.18zm-9.74 0c0-7.98-5.79-13.44-12.51-13.44s-12.51 5.46-12.51 13.44c0 7.9 5.79 13.44 12.51 13.44s12.51-5.55 12.51-13.44z"/>
              </svg>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function GSearchPage() {
  return (
    <RouteGuard>
      <Suspense fallback={<div className="flex items-center justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-cyan-400" /></div>}>
        <GSearchContent />
      </Suspense>
    </RouteGuard>
  );
}
