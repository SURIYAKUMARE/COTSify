"use client";
import { useState, useEffect, useCallback, createContext, useContext, ReactNode } from "react";
import { CheckCircle2, AlertCircle, Info, X, AlertTriangle } from "lucide-react";

type ToastType = "success" | "error" | "info" | "warning";

interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

interface ToastContextType {
  toast: (message: string, type?: ToastType, duration?: number) => void;
  success: (message: string) => void;
  error: (message: string) => void;
  info: (message: string) => void;
  warning: (message: string) => void;
}

const ToastContext = createContext<ToastContextType>({
  toast: () => {}, success: () => {}, error: () => {}, info: () => {}, warning: () => {},
});

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const remove = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const toast = useCallback((message: string, type: ToastType = "info", duration = 3500) => {
    const id = crypto.randomUUID();
    setToasts(prev => [...prev.slice(-4), { id, message, type, duration }]);
    setTimeout(() => remove(id), duration);
  }, [remove]);

  const success = useCallback((m: string) => toast(m, "success"), [toast]);
  const error   = useCallback((m: string) => toast(m, "error", 5000), [toast]);
  const info    = useCallback((m: string) => toast(m, "info"), [toast]);
  const warning = useCallback((m: string) => toast(m, "warning", 4000), [toast]);

  const ICONS = {
    success: <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0" />,
    error:   <AlertCircle  className="w-4 h-4 text-red-400 flex-shrink-0" />,
    info:    <Info         className="w-4 h-4 text-blue-400 flex-shrink-0" />,
    warning: <AlertTriangle className="w-4 h-4 text-yellow-400 flex-shrink-0" />,
  };
  const STYLES = {
    success: "border-green-800/60 bg-green-950/80",
    error:   "border-red-800/60 bg-red-950/80",
    info:    "border-blue-800/60 bg-blue-950/80",
    warning: "border-yellow-800/60 bg-yellow-950/80",
  };

  return (
    <ToastContext.Provider value={{ toast, success, error, info, warning }}>
      {children}
      {/* Toast container */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] flex flex-col gap-2 items-center pointer-events-none" style={{ minWidth: 320 }}>
        {toasts.map(t => (
          <div key={t.id}
            className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-2xl border backdrop-blur-md shadow-2xl text-sm text-white max-w-sm w-full animate-in slide-in-from-bottom-4 ${STYLES[t.type]}`}
            style={{ animation: "slideUp 0.25s ease-out" }}>
            {ICONS[t.type]}
            <span className="flex-1">{t.message}</span>
            <button onClick={() => remove(t.id)} className="text-gray-500 hover:text-white transition-colors ml-1">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
      <style>{`@keyframes slideUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}`}</style>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);
