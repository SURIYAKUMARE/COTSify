"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { X, Sparkles, ArrowRight, Info, AlertTriangle, CheckCircle } from "lucide-react";

type BannerVariant = "info" | "tip" | "success" | "warning" | "promo";

interface BannerAction {
  label: string;
  href?: string;
  onClick?: () => void;
}

interface Props {
  /** Unique ID used to persist dismissal in localStorage */
  id: string;
  message: string;
  variant?: BannerVariant;
  action?: BannerAction;
  /** If true, the banner cannot be dismissed */
  persistent?: boolean;
  className?: string;
}

const VARIANT_CONFIG: Record<
  BannerVariant,
  { bg: string; border: string; text: string; icon: React.ReactNode }
> = {
  info: {
    bg: "bg-blue-950/60",
    border: "border-blue-800/50",
    text: "text-blue-300",
    icon: <Info className="w-4 h-4 text-blue-400 flex-shrink-0" />,
  },
  tip: {
    bg: "bg-cyan-950/60",
    border: "border-cyan-800/50",
    text: "text-cyan-300",
    icon: <Sparkles className="w-4 h-4 text-cyan-400 flex-shrink-0" />,
  },
  success: {
    bg: "bg-green-950/60",
    border: "border-green-800/50",
    text: "text-green-300",
    icon: <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />,
  },
  warning: {
    bg: "bg-amber-950/60",
    border: "border-amber-800/50",
    text: "text-amber-300",
    icon: <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />,
  },
  promo: {
    bg: "bg-gradient-to-r from-cyan-950/80 to-purple-950/80",
    border: "border-cyan-800/40",
    text: "text-white",
    icon: <Sparkles className="w-4 h-4 text-cyan-400 flex-shrink-0" />,
  },
};

const DISMISSED_KEY = "cotsify_dismissed_banners";

function getDismissed(): string[] {
  if (typeof window === "undefined") return [];
  return JSON.parse(localStorage.getItem(DISMISSED_KEY) || "[]");
}

function dismiss(id: string) {
  const current = getDismissed();
  if (!current.includes(id)) {
    localStorage.setItem(DISMISSED_KEY, JSON.stringify([...current, id]));
  }
}

/**
 * Dismissible announcement / tip banner.
 * Dismissal is persisted in localStorage so it stays hidden on refresh.
 *
 * @example
 * <FeatureBanner
 *   id="new-compare-feature"
 *   variant="tip"
 *   message="New: Compare up to 4 components side-by-side on the Compare page!"
 *   action={{ label: "Try it", href: "/compare" }}
 * />
 */
export default function FeatureBanner({
  id,
  message,
  variant = "info",
  action,
  persistent = false,
  className = "",
}: Props) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (persistent) {
      setVisible(true);
    } else {
      setVisible(!getDismissed().includes(id));
    }
  }, [id, persistent]);

  const handleDismiss = () => {
    dismiss(id);
    setVisible(false);
  };

  if (!visible) return null;

  const config = VARIANT_CONFIG[variant];

  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 rounded-2xl border ${config.bg} ${config.border} ${className}`}
      role="alert"
    >
      {config.icon}

      <p className={`flex-1 text-sm ${config.text} leading-snug`}>{message}</p>

      {action && (
        <>
          {action.href ? (
            <Link
              href={action.href}
              className={`flex items-center gap-1 text-xs font-semibold ${config.text} hover:opacity-80 transition-opacity whitespace-nowrap flex-shrink-0`}
            >
              {action.label}
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          ) : (
            <button
              onClick={action.onClick}
              className={`flex items-center gap-1 text-xs font-semibold ${config.text} hover:opacity-80 transition-opacity whitespace-nowrap flex-shrink-0`}
            >
              {action.label}
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </>
      )}

      {!persistent && (
        <button
          onClick={handleDismiss}
          className="text-gray-600 hover:text-gray-400 transition-colors flex-shrink-0 p-0.5 rounded"
          aria-label="Dismiss"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
