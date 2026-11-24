import React from "react";
import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value: number; // 0 to 100
  label?: string;
  color?: "blue" | "emerald" | "amber" | "rose" | "indigo";
  showValue?: boolean;
  className?: string;
}

export function ProgressBar({ value, label, color = "blue", showValue = true, className }: ProgressBarProps) {
  const safeValue = Math.min(Math.max(value, 0), 100);
  
  const colorStyles = {
    blue: "bg-blue-500",
    emerald: "bg-emerald-500",
    amber: "bg-amber-500",
    rose: "bg-rose-500",
    indigo: "bg-indigo-500",
  };

  return (
    <div className={cn("w-full", className)}>
      {(label || showValue) && (
        <div className="flex justify-between items-center mb-1.5">
          {label && <span className="text-sm font-medium text-slate-700">{label}</span>}
          {showValue && <span className="text-sm font-medium text-slate-500">{Math.round(safeValue)}%</span>}
        </div>
      )}
      <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
        <div
          className={cn("h-2.5 rounded-full transition-all duration-500", colorStyles[color])}
          style={{ width: `${safeValue}%` }}
        />
      </div>
    </div>
  );
}
