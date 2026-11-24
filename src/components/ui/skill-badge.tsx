import React from "react";
import { cn } from "@/lib/utils";
import type { DemandLevel } from "@/types";

interface SkillBadgeProps {
  name: string;
  demandLevel: DemandLevel;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function SkillBadge({ name, demandLevel, size = "md", className }: SkillBadgeProps) {
  const sizeStyles = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-2.5 py-1 text-sm",
    lg: "px-3 py-1.5 text-base",
  };

  const demandStyles: Record<string, string> = {
    high_demand: "bg-emerald-100 text-emerald-800 border-emerald-200",
    stable: "bg-amber-100 text-amber-800 border-amber-200",
    oversupplied: "bg-rose-100 text-rose-800 border-rose-200",
    declining: "bg-rose-100 text-rose-800 border-rose-200",
    emerging: "bg-indigo-100 text-indigo-800 border-indigo-200",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center justify-center font-medium rounded-full border",
        sizeStyles[size],
        demandStyles[demandLevel],
        className
      )}
    >
      {name}
    </span>
  );
}
