export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div className="w-12 h-12 border-2 border-cyan-500/30 rounded-full" />
          <div className="absolute inset-0 w-12 h-12 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
        </div>
        <div className="flex items-center gap-2">
          <img src="/cotsify-logo.svg" alt="COTsify" className="w-6 h-6" />
          <span className="text-sm font-semibold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            COTsify
          </span>
        </div>
      </div>
    </div>
  );
}
