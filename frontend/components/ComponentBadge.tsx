"use client";
import { Cpu, Code, Wifi, Zap, Package, Tag } from "lucide-react";

type BadgeVariant =
  | "hardware"
  | "software"
  | "iot"
  | "ai"
  | "power"
  | "sensor"
  | "module"
  | "category"
  | "tag"
  | "custom";

type BadgeSize = "xs" | "sm" | "md";

interface Props {
  label: string;
  variant?: BadgeVariant;
  size?: BadgeSize;
  /** Override the auto-selected icon */
  icon?: React.ReactNode;
  /** Show a dot indicator instead of an icon */
  dot?: boolean;
  className?: string;
  onClick?: () => void;
}

const VARIANT_STYLES: Record<BadgeVariant, string> = {
  hardware:  "bg-cyan-950/70 text-cyan-400 border-cyan-800/60",
  software:  "bg-purple-950/70 text-purple-400 border-purple-800/60",
  iot:       "bg-blue-950/70 text-blue-400 border-blue-800/60",
  ai:        "bg-violet-950/70 text-violet-400 border-violet-800/60",
  power:     "bg-amber-950/70 text-amber-400 border-amber-800/60",
  sensor:    "bg-green-950/70 text-green-400 border-green-800/60",
  module:    "bg-pink-950/70 text-pink-400 border-pink-800/60",
  category:  "bg-gray-800/80 text-gray-300 border-gray-700",
  tag:       "bg-gray-900 text-gray-400 border-gray-800",
  custom:    "bg-gray-800 text-gray-300 border-gray-700",
};

const VARIANT_ICONS: Record<BadgeVariant, React.ReactNode> = {
  hardware:  <Cpu className="w-3 h-3" />,
  software:  <Code className="w-3 h-3" />,
  iot:       <Wifi className="w-3 h-3" />,
  ai:        <Zap className="w-3 h-3" />,
  power:     <Zap className="w-3 h-3" />,
  sensor:    <Package className="w-3 h-3" />,
  module:    <Package className="w-3 h-3" />,
  category:  <Tag className="w-3 h-3" />,
  tag:       <Tag className="w-3 h-3" />,
  custom:    null,
};

const SIZE_STYLES: Record<BadgeSize, string> = {
  xs: "text-xs px-1.5 py-0.5 gap-1",
  sm: "text-xs px-2 py-1 gap-1.5",
  md: "text-sm px-2.5 py-1 gap-1.5",
};

/** Infer variant from a label string */
export function inferVariant(label: string): BadgeVariant {
  const l = label.toLowerCase();
  if (l === "hardware") return "hardware";
  if (l === "software") return "software";
  if (l.includes("iot") || l.includes("wifi") || l.includes("wi-fi") || l.includes("mqtt")) return "iot";
  if (l.includes("ai") || l.includes("ml") || l.includes("neural") || l.includes("model")) return "ai";
  if (l.includes("sensor") || l.includes("dht") || l.includes("ldr") || l.includes("pir")) return "sensor";
  if (l.includes("module") || l.includes("shield") || l.includes("hat")) return "module";
  if (l.includes("power") || l.includes("battery") || l.includes("voltage") || l.includes("lipo")) return "power";
  return "tag";
}

/**
 * Reusable badge/pill for component categories, tags, and labels.
 *
 * @example
 * <ComponentBadge label="hardware" variant="hardware" />
 * <ComponentBadge label="ESP32" variant="iot" size="sm" />
 * <ComponentBadge label="Sensor" dot />
 */
export default function ComponentBadge({
  label,
  variant = "tag",
  size = "sm",
  icon,
  dot = false,
  className = "",
  onClick,
}: Props) {
  const styles = VARIANT_STYLES[variant];
  const sizeStyles = SIZE_STYLES[size];
  const defaultIcon = VARIANT_ICONS[variant];
  const resolvedIcon = icon ?? defaultIcon;

  const Tag = onClick ? "button" : "span";

  return (
    <Tag
      onClick={onClick}
      className={`inline-flex items-center font-medium rounded-full border transition-colors
        ${styles} ${sizeStyles}
        ${onClick ? "cursor-pointer hover:opacity-80 active:scale-95" : ""}
        ${className}`}
    >
      {dot ? (
        <span className="w-1.5 h-1.5 rounded-full bg-current flex-shrink-0" />
      ) : (
        resolvedIcon && <span className="flex-shrink-0">{resolvedIcon}</span>
      )}
      {label}
    </Tag>
  );
}
