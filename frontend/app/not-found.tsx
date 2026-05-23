import Link from "next/link";
import { Search, Home, Compass, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        {/* Animated 404 */}
        <div className="relative mb-8">
          <div className="text-[120px] font-black text-transparent bg-gradient-to-br from-cyan-500/20 to-blue-600/20 bg-clip-text leading-none select-none">
            404
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-[120px] font-black bg-gradient-to-br from-cyan-400 to-blue-500 bg-clip-text text-transparent leading-none opacity-20 blur-sm">
              404
            </div>
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-24 h-24 bg-gradient-to-br from-cyan-500/10 to-blue-600/10 border border-cyan-800/30 rounded-3xl flex items-center justify-center">
              <Search className="w-10 h-10 text-cyan-400" />
            </div>
          </div>
        </div>

        <h1 className="text-2xl font-bold text-white mb-3">Page not found</h1>
        <p className="text-gray-400 text-sm mb-8 leading-relaxed">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold px-6 py-3 rounded-xl transition-all"
          >
            <Home className="w-4 h-4" /> Go Home
          </Link>
          <Link
            href="/search"
            className="flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-800 border border-gray-700 hover:border-cyan-700 text-gray-300 hover:text-white px-6 py-3 rounded-xl transition-all"
          >
            <Search className="w-4 h-4" /> Search Projects
          </Link>
          <Link
            href="/explore"
            className="flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-800 border border-gray-700 hover:border-cyan-700 text-gray-300 hover:text-white px-6 py-3 rounded-xl transition-all"
          >
            <Compass className="w-4 h-4" /> Explore
          </Link>
        </div>
      </div>
    </div>
  );
}
