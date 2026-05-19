"use client";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import {
  Search, LayoutDashboard, User, LogOut, BookOpen,
  Compass, Globe, Menu, X, ChevronRight, Keyboard, GitCompare,
  GraduationCap, Shield,
} from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";

// Shows Admin link only when admin session is active
function AdminLink() {
  const [isAdmin, setIsAdmin] = useState(false);
  useEffect(() => {
    setIsAdmin(localStorage.getItem("cotsify_admin_session") === "1");
    const handler = () => setIsAdmin(localStorage.getItem("cotsify_admin_session") === "1");
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);
  if (!isAdmin) return null;
  return (
    <Link href="/admin" className="hidden lg:flex items-center gap-1.5 text-xs bg-red-950/60 hover:bg-red-900/60 border border-red-800/50 text-red-400 px-2.5 py-1.5 rounded-lg transition-colors">
      <Shield className="w-3 h-3" /> Admin
    </Link>
  );
}

const NAV_LINKS = [
  { href: "/search", icon: <Search className="w-4 h-4" />, label: "Search" },
  { href: "/gsearch", icon: <Globe className="w-4 h-4" />, label: "G-Search" },
  { href: "/explore", icon: <Compass className="w-4 h-4" />, label: "Explore" },
  { href: "/catalog", icon: <BookOpen className="w-4 h-4" />, label: "Catalog" },
  { href: "/learn", icon: <GraduationCap className="w-4 h-4" />, label: "Learn" },
  { href: "/compare", icon: <GitCompare className="w-4 h-4" />, label: "Compare" },
  { href: "/dashboard", icon: <LayoutDashboard className="w-4 h-4" />, label: "Dashboard" },
  { href: "/profile", icon: <User className="w-4 h-4" />, label: "Profile" },
];

export default function Navbar() {
  const path = usePathname();
  const router = useRouter();
  const { user, signOut } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showShortcut, setShowShortcut] = useState(false);

  const active = (href: string) =>
    path.startsWith(href)
      ? "text-cyan-400 bg-gray-800"
      : "text-gray-400 hover:text-white hover:bg-gray-800/50";

  // Cmd/Ctrl+K → focus search
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "k") {
      e.preventDefault();
      router.push("/search");
      // Flash shortcut hint
      setShowShortcut(true);
      setTimeout(() => setShowShortcut(false), 1500);
    }
    if (e.key === "Escape") setMobileOpen(false);
  }, [router]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  // Close mobile menu on route change
  useEffect(() => { setMobileOpen(false); }, [path]);

  return (
    <>
      <nav className="sticky top-0 z-50 bg-gray-950/90 backdrop-blur border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-xl flex-shrink-0">
            <img src="/cotsify-logo.svg" alt="COTsify" className="w-8 h-8" />
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              COTsify
            </span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-1.5 text-sm px-3 py-2 rounded-lg transition-colors ${active(link.href)}`}
              >
                {link.icon}
                <span className="hidden lg:inline">{link.label}</span>
              </Link>
            ))}
          </div>

          {/* Desktop right side */}
          <div className="hidden md:flex items-center gap-2">
            {/* Cmd+K hint */}
            <button
              onClick={() => router.push("/search")}
              className="hidden lg:flex items-center gap-1.5 text-xs text-gray-600 hover:text-gray-400 bg-gray-900 border border-gray-800 px-2.5 py-1.5 rounded-lg transition-colors"
              title="Go to Search (Ctrl+K)"
            >
              <Keyboard className="w-3 h-3" />
              <span>Ctrl+K</span>
            </button>
            {/* Admin link */}
            <AdminLink />
            {/* Theme toggle */}
            <ThemeToggle />

            {user ? (
              <div className="flex items-center gap-2">
                <span className="hidden sm:flex items-center gap-2 text-sm text-gray-300 bg-gray-800 border border-gray-700 px-3 py-1.5 rounded-full">
                  {user.avatar_url ? (
                    <img src={user.avatar_url} alt={user.full_name || user.email} className="w-5 h-5 rounded-full object-cover" />
                  ) : (
                    <div className="w-5 h-5 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-gray-950 text-xs font-bold">
                      {(user.full_name || user.email)[0].toUpperCase()}
                    </div>
                  )}
                  <span className="max-w-[100px] truncate">{user.full_name || user.email.split("@")[0]}</span>
                  {user.google_connected && (
                    <svg className="w-3.5 h-3.5 flex-shrink-0" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                  )}
                </span>
                <button
                  onClick={signOut}
                  className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-red-400 px-3 py-2 rounded-lg transition-colors"
                  title="Sign out"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden lg:inline">Sign out</span>
                </button>
              </div>
            ) : (
              <Link
                href="/auth/signin"
                className="text-sm bg-cyan-500 hover:bg-cyan-400 text-gray-950 font-semibold px-4 py-1.5 rounded-full transition-colors"
              >
                Sign in
              </Link>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Cmd+K flash */}
        {showShortcut && (
          <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-cyan-500 text-gray-950 text-xs font-bold px-3 py-1.5 rounded-full shadow-lg animate-bounce z-50">
            ⌨️ Navigating to Search...
          </div>
        )}
      </nav>

      {/* Mobile drawer overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <div className="absolute top-0 right-0 h-full w-72 bg-gray-950 border-l border-gray-800 flex flex-col shadow-2xl">
            {/* Drawer header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-800">
              <div className="flex items-center gap-2">
                <img src="/cotsify-logo.svg" alt="COTsify" className="w-7 h-7" />
                <span className="font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">COTsify</span>
              </div>
              <button onClick={() => setMobileOpen(false)} className="text-gray-500 hover:text-white p-1.5 hover:bg-gray-800 rounded-lg transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* User info */}
            {user && (
              <div className="px-5 py-4 border-b border-gray-800">
                <div className="flex items-center gap-3">
                  {user.avatar_url ? (
                    <img src={user.avatar_url} alt={user.full_name || user.email} className="w-10 h-10 rounded-full object-cover ring-2 ring-cyan-500/30" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-gray-950 font-bold">
                      {(user.full_name || user.email)[0].toUpperCase()}
                    </div>
                  )}
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className="text-white font-medium text-sm truncate">{user.full_name || user.email.split("@")[0]}</p>
                      {user.google_connected && (
                        <svg className="w-3.5 h-3.5 flex-shrink-0" viewBox="0 0 24 24">
                          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                        </svg>
                      )}
                    </div>
                    <p className="text-gray-500 text-xs truncate">{user.email}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Nav links */}
            <div className="flex-1 overflow-y-auto py-3 px-3">
              {NAV_LINKS.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl mb-1 transition-colors ${
                    path.startsWith(link.href)
                      ? "bg-cyan-950/60 text-cyan-400 border border-cyan-800/50"
                      : "text-gray-400 hover:text-white hover:bg-gray-800"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {link.icon}
                    <span className="font-medium">{link.label}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 opacity-50" />
                </Link>
              ))}
            </div>

            {/* Keyboard shortcut hint */}
            <div className="px-5 py-3 border-t border-gray-800">
              <div className="flex items-center gap-2 text-xs text-gray-600 mb-3">
                <Keyboard className="w-3.5 h-3.5" />
                <span>Press <kbd className="bg-gray-800 border border-gray-700 px-1.5 py-0.5 rounded text-gray-400">Ctrl+K</kbd> to search</span>
              </div>
            </div>

            {/* Sign out */}
            {user ? (
              <div className="px-5 pb-5">
                <button
                  onClick={signOut}
                  className="w-full flex items-center justify-center gap-2 text-sm text-red-400 hover:text-red-300 bg-red-950/30 hover:bg-red-950/50 border border-red-900/50 py-3 rounded-xl transition-colors"
                >
                  <LogOut className="w-4 h-4" /> Sign out
                </button>
              </div>
            ) : (
              <div className="px-5 pb-5">
                <Link href="/auth/signin" className="w-full flex items-center justify-center bg-cyan-500 hover:bg-cyan-400 text-gray-950 font-semibold py-3 rounded-xl transition-colors text-sm">
                  Sign in
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
