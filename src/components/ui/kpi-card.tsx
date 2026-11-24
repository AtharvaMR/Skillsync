"use client";

import React from "react";
import { LucideIcon, ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface KPICardProps {
  title: string;
  value: string | number;
  unit?: string;
  trend: "up" | "down" | "stable";
  trendValue: number;
  icon: LucideIcon;
  color?: "blue" | "emerald" | "amber" | "rose" | "indigo";
}

export function KPICard({
  title,
  value,
  unit,
  trend,
  trendValue,
  icon: Icon,
  color = "blue",
}: KPICardProps) {
  const colorStyles = {
    blue: "bg-blue-50 text-blue-600",
    emerald: "bg-emerald-50 text-emerald-600",
    amber: "bg-amber-50 text-amber-600",
    rose: "bg-rose-50 text-rose-600",
    indigo: "bg-indigo-50 text-indigo-600",
  };

  const trendStyles = {
    up: "text-emerald-600 bg-emerald-50",
    down: "text-rose-600 bg-rose-50",
    stable: "text-slate-600 bg-slate-50",
  };

  const TrendIcon = trend === "up" ? ArrowUpRight : trend === "down" ? ArrowDownRight : Minus;

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider">{title}</h3>
        <div className={cn("p-2 rounded-lg", colorStyles[color])}>
          <Icon size={20} />
        </div>
      </div>
      
      <div className="flex items-baseline gap-1 mb-4">
        <span className="text-3xl font-bold text-slate-900">{value}</span>
        {unit && <span className="text-sm font-medium text-slate-500">{unit}</span>}
      </div>

      <div className="flex items-center gap-2">
        <div className={cn("flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium", trendStyles[trend])}>
          <TrendIcon size={14} />
          <span>{Math.abs(trendValue)}%</span>
        </div>
        <span className="text-xs text-slate-500">vs last period</span>
      </div>
    </div>
  );
}
