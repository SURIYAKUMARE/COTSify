"use client";
import { ClipboardList, ShoppingCart, Wrench, FlaskConical, CheckCircle2, ChevronRight } from "lucide-react";

interface Phase {
  id: string;
  label: string;
  icon: React.ReactNode;
  description: string;
  days: number;
  color: string;
  bg: string;
  border: string;
  connector: string;
}

const PHASES: Phase[] = [
  {
    id: "planning",
    label: "Planning",
    icon: <ClipboardList className="w-5 h-5" />,
    description: "Define requirements, research components, and create a circuit diagram.",
    days: 2,
    color: "text-blue-400",
    bg: "bg-blue-950",
    border: "border-blue-800",
    connector: "from-blue-500/40",
  },
  {
    id: "sourcing",
    label: "Sourcing",
    icon: <ShoppingCart className="w-5 h-5" />,
    description: "Order components online or purchase from local electronics stores.",
    days: 3,
    color: "text-yellow-400",
    bg: "bg-yellow-950",
    border: "border-yellow-800",
    connector: "from-yellow-500/40",
  },
  {
    id: "building",
    label: "Building",
    icon: <Wrench className="w-5 h-5" />,
    description: "Assemble hardware, write firmware, and integrate all modules.",
    days: 5,
    color: "text-orange-400",
    bg: "bg-orange-950",
    border: "border-orange-800",
    connector: "from-orange-500/40",
  },
  {
    id: "testing",
    label: "Testing",
    icon: <FlaskConical className="w-5 h-5" />,
    description: "Debug issues, calibrate sensors, and validate all functionality.",
    days: 3,
    color: "text-purple-400",
    bg: "bg-purple-950",
    border: "border-purple-800",
    connector: "from-purple-500/40",
  },
  {
    id: "complete",
    label: "Complete",
    icon: <CheckCircle2 className="w-5 h-5" />,
    description: "Final demo, documentation, and project submission.",
    days: 1,
    color: "text-green-400",
    bg: "bg-green-950",
    border: "border-green-800",
    connector: "from-green-500/40",
  },
];

const totalDays = PHASES.reduce((sum, p) => sum + p.days, 0);

export default function ProjectTimeline() {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-white font-semibold text-sm">Project Timeline</h3>
          <p className="text-gray-500 text-xs mt-0.5">Estimated phases to complete your build</p>
        </div>
        <span className="text-xs bg-cyan-950 text-cyan-400 border border-cyan-800 px-3 py-1 rounded-full font-medium">
          ~{totalDays} days total
        </span>
      </div>

      {/* Desktop: horizontal timeline */}
      <div className="hidden sm:flex items-start gap-0 mb-4">
        {PHASES.map((phase, idx) => (
          <div key={phase.id} className="flex items-start flex-1 min-w-0">
            {/* Phase block */}
            <div className="flex flex-col items-center flex-1 min-w-0">
              {/* Icon circle */}
              <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${phase.bg} ${phase.border} ${phase.color} mb-2 flex-shrink-0`}>
                {phase.icon}
              </div>
              {/* Label */}
              <p className={`text-xs font-semibold ${phase.color} mb-0.5`}>{phase.label}</p>
              <p className="text-gray-600 text-xs">{phase.days}d</p>
            </div>
            {/* Connector arrow */}
            {idx < PHASES.length - 1 && (
              <div className="flex items-center mt-4 flex-shrink-0">
                <ChevronRight className="w-4 h-4 text-gray-600" />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Progress bar */}
      <div className="hidden sm:flex rounded-full overflow-hidden h-2 bg-gray-800 mb-5">
        {PHASES.map((phase) => (
          <div
            key={phase.id}
            className={`${phase.bg} transition-all`}
            style={{ width: `${(phase.days / totalDays) * 100}%` }}
          />
        ))}
      </div>

      {/* Mobile: vertical list + Desktop: detail cards */}
      <div className="grid sm:grid-cols-5 gap-3">
        {PHASES.map((phase) => (
          <div
            key={phase.id}
            className={`${phase.bg} border ${phase.border} rounded-xl p-3 flex sm:flex-col gap-3 sm:gap-2`}
          >
            {/* Mobile icon */}
            <div className={`sm:hidden w-8 h-8 rounded-full flex items-center justify-center border ${phase.border} ${phase.color} flex-shrink-0`}>
              {phase.icon}
            </div>
            <div>
              <div className="flex items-center justify-between sm:justify-start gap-2 mb-1">
                <p className={`text-xs font-bold ${phase.color}`}>{phase.label}</p>
                <span className={`text-xs ${phase.color} opacity-70`}>{phase.days}d</span>
              </div>
              <p className="text-gray-400 text-xs leading-relaxed">{phase.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
