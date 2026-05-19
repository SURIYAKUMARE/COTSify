"use client";
import { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";

const THEME_KEY = "cotsify_theme";

export function useTheme() {
  const [dark, setDark] = useState(true);
  useEffect(() => {
    const saved = localStorage.getItem(THEME_KEY);
    const isDark = saved !== "light";
    setDark(isDark);
    applyTheme(isDark);
  }, []);
  const toggle = () => {
    const next = !dark;
    setDark(next);
    localStorage.setItem(THEME_KEY, next ? "dark" : "light");
    applyTheme(next);
  };
  return { dark, toggle };
}

function applyTheme(dark: boolean) {
  const root = document.documentElement;
  if (dark) {
    root.classList.add("dark");
    root.classList.remove("light");
    document.body.style.backgroundColor = "#030712";
    document.body.style.color = "#f9fafb";
  } else {
    root.classList.add("light");
    root.classList.remove("dark");
    document.body.style.backgroundColor = "#f8fafc";
    document.body.style.color = "#0f172a";
  }
}

export default function ThemeToggle() {
  const { dark, toggle } = useTheme();
  return (
    <button
      onClick={toggle}
      className="hidden lg:flex items-center justify-center w-8 h-8 rounded-lg bg-gray-900 border border-gray-800 hover:border-cyan-700 text-gray-400 hover:text-cyan-400 transition-all"
      title={dark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {dark ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
    </button>
  );
}
