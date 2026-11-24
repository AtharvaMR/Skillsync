import React from "react";
import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface DataFreshnessBadgeProps {
  lastUpdated: string;
  className?: string;
}

export function DataFreshnessBadge({ lastUpdated, className }: DataFreshnessBadgeProps) {
  // Simple heuristic for demo purposes
  const date = new Date(lastUpdated);
  const now = new Date();
  const diffHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
  
  let status: "fresh" | "warning" | "stale" = "fresh";
  let colorClass = "bg-emerald-50 text-emerald-700 border-emerald-200";
  
  if (diffHours > 72) {
    status = "stale";
    colorClass = "bg-rose-50 text-rose-700 border-rose-200";
  } else if (diffHours > 24) {
    status = "warning";
    colorClass = "bg-amber-50 text-amber-700 border-amber-200";
  }

  // Format relative time
  let timeText = "";
  if (diffHours < 1) {
    timeText = "Just now";
  } else if (diffHours < 24) {
    timeText = `${Math.floor(diffHours)}h ago`;
  } else {
    timeText = `${Math.floor(diffHours / 24)}d ago`;
  }

  return (
    <div className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border", colorClass, className)}>
      <Clock size={12} />
      <span>Updated {timeText}</span>
    </div>
  );
}
