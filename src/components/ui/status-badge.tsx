import React from "react";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: string;
  size?: "sm" | "md";
  className?: string;
}

export function StatusBadge({ status, size = "md", className }: StatusBadgeProps) {
  const normalizedStatus = status.toUpperCase().replace(/\s+/g, "_");

  let colorClass = "bg-slate-100 text-slate-800 border-slate-200";

  if (["ACTIVE", "COMPLETED", "APPROVED", "EMPLOYED", "RETAINED", "HEALTHY", "SUCCESS"].includes(normalizedStatus)) {
    colorClass = "bg-emerald-100 text-emerald-800 border-emerald-200";
  } else if (["PENDING", "IN_PROGRESS", "AT_RISK", "WARNING", "REVIEW"].includes(normalizedStatus)) {
    colorClass = "bg-amber-100 text-amber-800 border-amber-200";
  } else if (["FAILED", "REJECTED", "DROPPED_OUT", "CRITICAL", "ERROR"].includes(normalizedStatus)) {
    colorClass = "bg-rose-100 text-rose-800 border-rose-200";
  } else if (["DRAFT", "ARCHIVED", "INACTIVE"].includes(normalizedStatus)) {
    colorClass = "bg-slate-100 text-slate-600 border-slate-200";
  }

  const sizeClass = size === "sm" ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-0.5 text-xs";

  return (
    <span className={cn("inline-flex items-center justify-center font-semibold rounded-full border", sizeClass, colorClass, className)}>
      {status.replace(/_/g, " ")}
    </span>
  );
}
