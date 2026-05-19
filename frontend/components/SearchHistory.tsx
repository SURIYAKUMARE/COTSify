"use client";
import { useState, useEffect } from "react";
import { Clock, X, TrendingUp, Search } from "lucide-react";

const HISTORY_KEY = "cotsify_search_history";
const MAX_HISTORY = 10;

export function getSearchHistory(): string[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]"); } catch { return []; }
}

export function addToSearchHistory(query: string) {
  if (!query.trim()) return;
  const history = getSearchHistory().filter(h => h.toLowerCase() !== query.toLowerCase());
  history.unshift(query.trim());
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, MAX_HISTORY)));
}

export function clearSearchHistory() {
  localStorage.setItem(HISTORY_KEY, JSON.stringify([]));
}

interface Props {
  onSelect: (query: string) => void;
  visible: boolean;
}

export default function SearchHistory({ onSelect, visible }: Props) {
  const [history, setHistory] = useState<string[]>([]);

  useEffect(() => {
    setHistory(getSearchHistory());
  }, [visible]);

  const handleRemove = (e: React.MouseEvent, item: string) => {
    e.stopPropagation();
    const updated = getSearchHistory().filter(h => h !== item);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
    setHistory(updated);
  };

  if (!visible || history.length === 0) return null;

  return (
    <div className="absolute top-full left-0 right-0 mt-2 bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl z-50 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-800">
        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <Clock className="w-3.5 h-3.5" /> Recent searches
        </div>
        <button
          onClick={() => { clearSearchHistory(); setHistory([]); }}
          className="text-xs text-gray-600 hover:text-gray-400 transition-colors"
        >
          Clear all
        </button>
      </div>
      <div className="py-1">
        {history.map((item, i) => (
          <div
            key={i}
            onClick={() => onSelect(item)}
            className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-800 cursor-pointer group transition-colors"
          >
            <Clock className="w-3.5 h-3.5 text-gray-600 flex-shrink-0" />
            <span className="text-gray-300 text-sm flex-1 truncate group-hover:text-white transition-colors">{item}</span>
            <button
              onClick={(e) => handleRemove(e, item)}
              className="opacity-0 group-hover:opacity-100 text-gray-600 hover:text-gray-400 transition-all p-0.5 rounded"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
