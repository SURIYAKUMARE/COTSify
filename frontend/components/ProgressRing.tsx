"use client";

interface Props {
  /** 0–100 */
  value: number;
  /** Diameter in pixels */
  size?: number;
  /** Stroke width in pixels */
  strokeWidth?: number;
  /** Color of the progress arc — any valid CSS color or Tailwind arbitrary value */
  color?: string;
  /** Track (background ring) color */
  trackColor?: string;
  /** Content rendered in the center of the ring */
  children?: React.ReactNode;
  /** Show the percentage number in the center when no children are provided */
  showValue?: boolean;
  /** Label shown below the percentage */
  label?: string;
  className?: string;
}

/**
 * Circular SVG progress ring.
 *
 * @example
 * // Simple percentage ring
 * <ProgressRing value={72} size={80} color="#06b6d4" showValue />
 *
 * // With custom center content
 * <ProgressRing value={50} size={64}>
 *   <CheckCircle className="w-5 h-5 text-green-400" />
 * </ProgressRing>
 *
 * // With label
 * <ProgressRing value={33} size={96} color="#a855f7" showValue label="Tasks done" />
 */
export default function ProgressRing({
  value,
  size = 80,
  strokeWidth = 6,
  color = "#06b6d4",
  trackColor = "#1f2937",
  children,
  showValue = false,
  label,
  className = "",
}: Props) {
  const clamped = Math.min(100, Math.max(0, value));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (clamped / 100) * circumference;
  const center = size / 2;

  return (
    <div className={`flex flex-col items-center gap-1 ${className}`}>
      <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="-rotate-90"
          aria-label={`Progress: ${clamped}%`}
          role="img"
        >
          {/* Track */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke={trackColor}
            strokeWidth={strokeWidth}
          />
          {/* Progress arc */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ transition: "stroke-dashoffset 0.6s ease" }}
          />
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex items-center justify-center">
          {children ?? (
            showValue && (
              <span
                className="font-bold tabular-nums leading-none"
                style={{
                  fontSize: size * 0.22,
                  color,
                }}
              >
                {clamped}%
              </span>
            )
          )}
        </div>
      </div>

      {label && (
        <span className="text-xs text-gray-500 text-center leading-tight">{label}</span>
      )}
    </div>
  );
}
