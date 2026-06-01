"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Clock, X, Search, TrendingUp, ChevronRight } from "lucide-react";

const STORAGE_KEY = "cotsify_recent_searches";
const MAX_SEARCHES = 8;

export interface RecentSearch {
  query: string;
  timestamp: number;
}

/** Call this from the search page to persist a query */
export function saveRecentSearch(query: string) {
  if (typeof window === "undefined" || !query.trim()) return;
  const existing: RecentSearch[] = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  const filtered = existing.filter((s) => s.query.toLowerCase() !== query.toLowerCase());
  const updated = [{ query: query.trim(), timestamp: Date.now() }, ...filtered].slice(0, MAX_SEARCHES);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}

export function getRecentSearches(): RecentSearch[] {
  if (typeof window === "undefined") return [];
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
}

export function clearRecentSearches() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}

interface Props {
  /** Compact mode shows fewer items and no timestamps */
  compact?: boolean;
  /** Called when user clicks a search item */
  onSelect?: (query: string) => void;
  className?: string;
}

export default function RecentSearches({ compact = false, onSelect, className = "" }: Props) {
  const [searches, setSearches] = useState<RecentSearch[]>([]);

  useEffect(() => {
    setSearches(getRecentSearches());
    // Sync across tabs
    const handler = () => setSearches(getRecentSearches());
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  const remove = (query: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const updated = searches.filter((s) => s.query !== query);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setSearches(updated);
  };

  const clearAll = () => {
    clearRecentSearches();
    setSearches([]);
  };

  const formatTime = (ts: number) => {
    const diff = Date.now() - ts;
    const mins = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  if (searches.length === 0) return null;

  const displayed = compact ? searches.slice(0, 4) : searches;

  return (
    <div className={`bg-gray-900/60 border border-gray-800 rounded-2xl overflow-hidden ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
        <div className="flex items-center gap-2 text-sm font-semibold text-white">
          <Clock className="w-4 h-4 text-cyan-400" />
          Recent Searches
        </div>
        <button
          onClick={clearAll}
          className="text-xs text-gray-500 hover:text-red-400 transition-colors px-2 py-1 rounded-lg hover:bg-red-950/30"
        >
          Clear all
        </button>
      </div>

      {/* Search list */}
      <ul className="divide-y divide-gray-800/50">
        {displayed.map((item) => {
          const content = (
            <div className="flex items-center gap-3 px-4 py-3 hover:bg-gray-800/50 transition-colors group cursor-pointer">
              <Search className="w-3.5 h-3.5 text-gray-600 flex-shrink-0 group-hover:text-cyan-400 transition-colors" />
              <span className="flex-1 text-sm text-gray-300 group-hover:text-white transition-colors truncate">
                {item.query}
              </span>
              {!compact && (
                <span className="text-xs text-gray-600 flex-shrink-0 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  {formatTime(item.timestamp)}
                </span>
              )}
              <button
                onClick={(e) => remove(item.query, e)}
                className="opacity-0 group-hover:opacity-100 text-gray-600 hover:text-red-400 transition-all flex-shrink-0 p-0.5 rounded"
                title="Remove"
              >
                <X className="w-3.5 h-3.5" />
              </button>
              <ChevronRight className="w-3.5 h-3.5 text-gray-700 group-hover:text-cyan-400 transition-colors flex-shrink-0" />
            </div>
          );

          return (
            <li key={item.query}>
              {onSelect ? (
                <div onClick={() => onSelect(item.query)}>{content}</div>
              ) : (
                <Link href={`/search?q=${encodeURIComponent(item.query)}`}>{content}</Link>
              )}
            </li>
          );
        })}
      </ul>

      {/* Footer — show more link in compact mode */}
      {compact && searches.length > 4 && (
        <div className="px-4 py-2.5 border-t border-gray-800">
          <Link
            href="/search"
            className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-1"
          >
            View all {searches.length} searches <ChevronRight className="w-3 h-3" />
          </Link>
        </div>
      )}
    </div>
  );
}
