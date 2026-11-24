import React from "react";
import { cn } from "@/lib/utils";
import type { DemandLevel } from "@/types";

interface DemandIndicatorProps {
  level: DemandLevel;
  showLabel?: boolean;
  className?: string;
}

export function DemandIndicator({ level, showLabel = true, className }: DemandIndicatorProps) {
  const levelConfig: Record<string, { color: string; label: string }> = {
    high_demand: { color: "bg-emerald-500", label: "High Demand" },
    stable: { color: "bg-amber-500", label: "Stable" },
    oversupplied: { color: "bg-rose-500", label: "Oversupplied" },
    declining: { color: "bg-rose-700", label: "Declining" },
    emerging: { color: "bg-indigo-500", label: "Emerging" },
  };

  const { color, label } = levelConfig[level] || levelConfig.stable;

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <span className="relative flex h-3 w-3">
        {level === "emerging" && (
          <span className={cn("animate-ping absolute inline-flex h-full w-full rounded-full opacity-75", color)}></span>
        )}
        <span className={cn("relative inline-flex rounded-full h-3 w-3", color)}></span>
      </span>
      {showLabel && <span className="text-sm font-medium text-slate-700">{label}</span>}
    </div>
  );
}
