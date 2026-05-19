"use client";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { Search, ExternalLink, Loader2, ShoppingCart, Globe, AlertCircle, RefreshCw } from "lucide-react";

interface SearchResult {
  title: string;
  link: string;
  snippet: string;
  platform?: string;
  price?: number;
  image?: string;
}

interface Props {
  componentName: string;
  searchQuery: string;
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

export default function GoogleSearchResults({ componentName, searchQuery }: Props) {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [source, setSource] = useState<"google" | "fallback" | "">("");
  const [error, setError] = useState("");

  const fetchResults = async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await api.get(`/api/search/products?q=${encodeURIComponent(searchQuery)}&num=6`);
      setResults(data.results);
      setSource(data.source);
    } catch {
      setError("Search unavailable");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (searchQuery) fetchResults();
  }, [searchQuery]);

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-gray-400 text-sm py-4">
        <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
        Searching Google for {componentName}...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center gap-2 text-red-400 text-sm">
        <AlertCircle className="w-4 h-4" /> {error}
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 text-sm text-gray-400">
          {source === "google" ? (
            <>
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span className="text-white font-medium">Google Search results</span>
            </>
          ) : (
            <>
              <Globe className="w-4 h-4 text-cyan-400" />
              <span>Direct store links</span>
            </>
          )}
        </div>
        <button onClick={fetchResults} className="text-gray-500 hover:text-cyan-400 transition-colors" title="Refresh">
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="flex flex-col gap-2">
        {results.map((r, i) => {
          const colorClass = PLATFORM_COLORS[r.platform || "Web"] || PLATFORM_COLORS.Web;
          return (
            <a key={i} href={r.link} target="_blank" rel="noopener noreferrer"
              className="group flex items-start gap-3 bg-gray-800/50 hover:bg-gray-800 border border-gray-700/50 hover:border-cyan-800/50 rounded-xl p-3 transition-all">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  {r.platform && (
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${colorClass}`}>
                      {r.platform}
                    </span>
                  )}
                  {r.price && (
                    <span className="text-xs font-bold text-cyan-400">₹{r.price.toLocaleString()}</span>
                  )}
                </div>
                <p className="text-white text-sm font-medium truncate group-hover:text-cyan-300 transition-colors">
                  {r.title}
                </p>
                <p className="text-gray-500 text-xs mt-0.5 line-clamp-1">{r.snippet}</p>
              </div>
              <ExternalLink className="w-4 h-4 text-gray-600 group-hover:text-cyan-400 transition-colors flex-shrink-0 mt-0.5" />
            </a>
          );
        })}
      </div>

      {source === "fallback" && (
        <div className="mt-3 p-3 bg-amber-950/30 border border-amber-800/50 rounded-xl">
          <p className="text-amber-400 text-xs flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5" />
            Configure Google Custom Search for live results.
            <a href="https://programmablesearchengine.google.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-amber-300">
              Set up here →
            </a>
          </p>
        </div>
      )}
    </div>
  );
}
