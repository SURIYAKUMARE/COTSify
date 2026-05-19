"use client";
import { useMemo } from "react";
import { DollarSign, Cpu, Code, TrendingUp } from "lucide-react";
import { Component } from "@/lib/api";

interface Props {
  components: Component[];
}

const HARDWARE_UNIT_COST = 350; // avg INR per hardware component
const SOFTWARE_UNIT_COST = 80;  // avg INR per software component (tools/licenses)

function getBudgetLabel(total: number): { label: string; color: string; bg: string; border: string } {
  if (total < 2000) return { label: "Low", color: "text-green-400", bg: "bg-green-950", border: "border-green-800" };
  if (total < 5000) return { label: "Medium", color: "text-yellow-400", bg: "bg-yellow-950", border: "border-yellow-800" };
  return { label: "High", color: "text-red-400", bg: "bg-red-950", border: "border-red-800" };
}

export default function CostEstimator({ components }: Props) {
  const { hardwareComponents, softwareComponents, hardwareCost, softwareCost, total, hardwarePct, softwarePct } =
    useMemo(() => {
      const hw = components.filter((c) => c.category === "hardware");
      const sw = components.filter((c) => c.category === "software");
      const hwCost = hw.reduce((sum, c) => sum + HARDWARE_UNIT_COST * (c.quantity || 1), 0);
      const swCost = sw.reduce((sum, c) => sum + SOFTWARE_UNIT_COST * (c.quantity || 1), 0);
      const tot = hwCost + swCost;
      const hwPct = tot > 0 ? Math.round((hwCost / tot) * 100) : 0;
      const swPct = tot > 0 ? 100 - hwPct : 0;
      return {
        hardwareComponents: hw,
        softwareComponents: sw,
        hardwareCost: hwCost,
        softwareCost: swCost,
        total: tot,
        hardwarePct: hwPct,
        softwarePct: swPct,
      };
    }, [components]);

  const budget = getBudgetLabel(total);

  if (components.length === 0) return null;

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-cyan-950 rounded-xl">
            <DollarSign className="w-4 h-4 text-cyan-400" />
          </div>
          <div>
            <h3 className="text-white font-semibold text-sm">Cost Estimator</h3>
            <p className="text-gray-500 text-xs">Estimated project budget</p>
          </div>
        </div>
        <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${budget.bg} ${budget.color} ${budget.border}`}>
          Budget: {budget.label}
        </span>
      </div>

      {/* Total */}
      <div className="bg-gradient-to-r from-cyan-950/60 to-blue-950/60 border border-cyan-800/40 rounded-xl px-4 py-3 mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-gray-400 text-sm">
          <TrendingUp className="w-4 h-4 text-cyan-400" />
          Total Estimated Cost
        </div>
        <span className="text-2xl font-bold text-cyan-400">₹{total.toLocaleString()}</span>
      </div>

      {/* Bar chart */}
      <div className="mb-4">
        <div className="flex rounded-full overflow-hidden h-3 bg-gray-800 mb-2">
          {hardwarePct > 0 && (
            <div
              className="bg-gradient-to-r from-cyan-500 to-cyan-400 transition-all duration-700"
              style={{ width: `${hardwarePct}%` }}
            />
          )}
          {softwarePct > 0 && (
            <div
              className="bg-gradient-to-r from-purple-500 to-purple-400 transition-all duration-700"
              style={{ width: `${softwarePct}%` }}
            />
          )}
        </div>
        <div className="flex justify-between text-xs text-gray-500">
          <span>Hardware {hardwarePct}%</span>
          <span>Software {softwarePct}%</span>
        </div>
      </div>

      {/* Breakdown */}
      <div className="grid grid-cols-2 gap-3">
        {/* Hardware */}
        <div className="bg-gray-800/60 border border-gray-700 rounded-xl p-3">
          <div className="flex items-center gap-1.5 mb-2">
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-xs text-gray-400 font-medium">Hardware</span>
          </div>
          <p className="text-white font-bold text-lg">₹{hardwareCost.toLocaleString()}</p>
          <p className="text-gray-500 text-xs mt-0.5">{hardwareComponents.length} components</p>
          <div className="mt-2 space-y-1 max-h-24 overflow-y-auto">
            {hardwareComponents.slice(0, 4).map((c) => (
              <div key={c.name} className="flex justify-between text-xs">
                <span className="text-gray-400 truncate max-w-[70%]">{c.name}</span>
                <span className="text-cyan-400 font-medium">₹{(HARDWARE_UNIT_COST * (c.quantity || 1)).toLocaleString()}</span>
              </div>
            ))}
            {hardwareComponents.length > 4 && (
              <p className="text-gray-600 text-xs">+{hardwareComponents.length - 4} more</p>
            )}
          </div>
        </div>

        {/* Software */}
        <div className="bg-gray-800/60 border border-gray-700 rounded-xl p-3">
          <div className="flex items-center gap-1.5 mb-2">
            <Code className="w-3.5 h-3.5 text-purple-400" />
            <span className="text-xs text-gray-400 font-medium">Software</span>
          </div>
          <p className="text-white font-bold text-lg">₹{softwareCost.toLocaleString()}</p>
          <p className="text-gray-500 text-xs mt-0.5">{softwareComponents.length} tools</p>
          <div className="mt-2 space-y-1 max-h-24 overflow-y-auto">
            {softwareComponents.slice(0, 4).map((c) => (
              <div key={c.name} className="flex justify-between text-xs">
                <span className="text-gray-400 truncate max-w-[70%]">{c.name}</span>
                <span className="text-purple-400 font-medium">₹{(SOFTWARE_UNIT_COST * (c.quantity || 1)).toLocaleString()}</span>
              </div>
            ))}
            {softwareComponents.length > 4 && (
              <p className="text-gray-600 text-xs">+{softwareComponents.length - 4} more</p>
            )}
          </div>
        </div>
      </div>

      <p className="text-gray-600 text-xs mt-3 text-center">
        * Estimates based on average Indian market prices. Actual costs may vary.
      </p>
    </div>
  );
}
