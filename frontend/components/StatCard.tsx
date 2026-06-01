"use client";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

type TrendDirection = "up" | "down" | "neutral";

interface Props {
  label: string;
  value: string | number;
  /** Optional sub-label shown below the value */
  sublabel?: string;
  /** Icon element to display */
  icon?: React.ReactNode;
  /** Gradient class for the icon background, e.g. "from-cyan-500 to-blue-600" */
  gradient?: string;
  /** Background tint class, e.g. "bg-cyan-950/50" */
  bg?: string;
  /** Border class, e.g. "border-cyan-800/50" */
  border?: string;
  /** Value text color class, e.g. "text-cyan-400" */
  valueColor?: string;
  /** Optional trend indicator */
  trend?: {
    direction: TrendDirection;
    label: string;
  };
  /** Make the card clickable */
  onClick?: () => void;
  className?: string;
}

const TREND_STYLES: Record<TrendDirection, { color: string; Icon: React.ElementType }> = {
  up:      { color: "text-green-400", Icon: TrendingUp },
  down:    { color: "text-red-400",   Icon: TrendingDown },
  neutral: { color: "text-gray-500",  Icon: Minus },
};

/**
 * Reusable stat/metric card used across dashboard, profile, and explore pages.
 *
 * @example
 * <StatCard
 *   label="Total Projects"
 *   value={12}
 *   icon={<Layers className="w-5 h-5" />}
 *   gradient="from-cyan-500 to-blue-600"
 *   bg="bg-cyan-950/50"
 *   border="border-cyan-800/50"
 *   valueColor="text-cyan-400"
 *   trend={{ direction: "up", label: "+3 this week" }}
 * />
 */
export default function StatCard({
  label,
  value,
  sublabel,
  icon,
  gradient = "from-cyan-500 to-blue-600",
  bg = "bg-gray-900/60",
  border = "border-gray-800",
  valueColor = "text-white",
  trend,
  onClick,
  className = "",
}: Props) {
  const Tag = onClick ? "button" : "div";
  const trendStyle = trend ? TREND_STYLES[trend.direction] : null;

  return (
    <Tag
      onClick={onClick}
      className={`relative overflow-hidden ${bg} border ${border} rounded-2xl p-5 text-left
        ${onClick ? "cursor-pointer hover:scale-[1.02] active:scale-[0.99] transition-transform" : ""}
        group ${className}`}
    >
      {/* Decorative glow blob */}
      <div
        className={`absolute -top-5 -right-5 w-24 h-24 bg-gradient-to-br ${gradient} rounded-full opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none`}
      />

      {/* Icon */}
      {icon && (
        <div className={`inline-flex p-2.5 rounded-xl bg-gradient-to-br ${gradient} mb-3 shadow-lg`}>
          <div className="text-white">{icon}</div>
        </div>
      )}

      {/* Value */}
      <div className={`text-3xl font-bold ${valueColor} mb-0.5 leading-none`}>
        {value}
      </div>

      {/* Label */}
      <div className="text-gray-400 text-sm font-medium mt-1">{label}</div>

      {/* Sublabel */}
      {sublabel && (
        <div className="text-gray-600 text-xs mt-0.5">{sublabel}</div>
      )}

      {/* Trend */}
      {trend && trendStyle && (
        <div className={`flex items-center gap-1 mt-2 text-xs font-medium ${trendStyle.color}`}>
          <trendStyle.Icon className="w-3.5 h-3.5" />
          {trend.label}
        </div>
      )}
    </Tag>
  );
}
