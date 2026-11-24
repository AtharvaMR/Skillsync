import React from "react";
import { cn } from "@/lib/utils";
import { ShieldCheck, ShieldAlert, Shield } from "lucide-react";

interface ConfidenceBadgeProps {
  level: "HIGH" | "MEDIUM" | "LOW";
  score?: number;
  className?: string;
}

export function ConfidenceBadge({ level, score, className }: ConfidenceBadgeProps) {
  const styles = {
    HIGH: {
      colors: "bg-emerald-100 text-emerald-800 border-emerald-200",
      icon: ShieldCheck,
    },
    MEDIUM: {
      colors: "bg-amber-100 text-amber-800 border-amber-200",
      icon: Shield,
    },
    LOW: {
      colors: "bg-rose-100 text-rose-800 border-rose-200",
      icon: ShieldAlert,
    },
  };

  const config = styles[level];
  const Icon = config.icon;

  return (
    <span className={cn("inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-semibold border", config.colors, className)}>
      <Icon size={12} />
      {level} CONFIDENCE
      {score !== undefined && <span className="ml-1 opacity-75">({Math.round(score * 100)}%)</span>}
    </span>
  );
}
