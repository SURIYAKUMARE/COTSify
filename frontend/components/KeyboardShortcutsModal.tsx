"use client";
import { useEffect, useState } from "react";
import { X, Keyboard, Search, LayoutDashboard, BookOpen, Compass, GitCompare, GraduationCap } from "lucide-react";

interface Shortcut {
  keys: string[];
  description: string;
  icon?: React.ReactNode;
}

const SHORTCUTS: { section: string; items: Shortcut[] }[] = [
  {
    section: "Navigation",
    items: [
      { keys: ["Ctrl", "K"], description: "Go to Search / focus search bar", icon: <Search className="w-3.5 h-3.5" /> },
      { keys: ["G", "D"], description: "Go to Dashboard", icon: <LayoutDashboard className="w-3.5 h-3.5" /> },
      { keys: ["G", "E"], description: "Go to Explore", icon: <Compass className="w-3.5 h-3.5" /> },
      { keys: ["G", "C"], description: "Go to Catalog", icon: <BookOpen className="w-3.5 h-3.5" /> },
      { keys: ["G", "L"], description: "Go to Learn", icon: <GraduationCap className="w-3.5 h-3.5" /> },
      { keys: ["G", "P"], description: "Go to Compare", icon: <GitCompare className="w-3.5 h-3.5" /> },
    ],
  },
  {
    section: "Search Page",
    items: [
      { keys: ["Enter"], description: "Submit search / analyze project" },
      { keys: ["Esc"], description: "Close dropdowns and modals" },
    ],
  },
  {
    section: "General",
    items: [
      { keys: ["?"], description: "Open this shortcuts panel" },
      { keys: ["Esc"], description: "Close any open modal" },
    ],
  },
];

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function KeyboardShortcutsModal({ open, onClose }: Props) {
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-gray-950 border border-gray-800 rounded-2xl w-full max-w-lg shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-800">
          <div className="flex items-center gap-2">
            <Keyboard className="w-4 h-4 text-cyan-400" />
            <h2 className="text-white font-semibold">Keyboard Shortcuts</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-white p-1.5 hover:bg-gray-800 rounded-lg transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Shortcuts list */}
        <div className="p-5 flex flex-col gap-5 max-h-[70vh] overflow-y-auto">
          {SHORTCUTS.map((group) => (
            <div key={group.section}>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">
                {group.section}
              </p>
              <div className="flex flex-col gap-1">
                {group.items.map((shortcut) => (
                  <div
                    key={shortcut.description}
                    className="flex items-center justify-between py-2 px-3 rounded-xl hover:bg-gray-900 transition-colors"
                  >
                    <div className="flex items-center gap-2 text-sm text-gray-300">
                      {shortcut.icon && (
                        <span className="text-gray-500">{shortcut.icon}</span>
                      )}
                      {shortcut.description}
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      {shortcut.keys.map((key, i) => (
                        <span key={key} className="flex items-center gap-1">
                          <kbd className="bg-gray-800 border border-gray-700 text-gray-300 text-xs px-2 py-1 rounded-lg font-mono min-w-[28px] text-center">
                            {key}
                          </kbd>
                          {i < shortcut.keys.length - 1 && (
                            <span className="text-gray-600 text-xs">+</span>
                          )}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-gray-800">
          <p className="text-xs text-gray-600 text-center">
            Press <kbd className="bg-gray-800 border border-gray-700 text-gray-400 px-1.5 py-0.5 rounded text-xs">?</kbd> anywhere to open this panel
          </p>
        </div>
      </div>
    </div>
  );
}
