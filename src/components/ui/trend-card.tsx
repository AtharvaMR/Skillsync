"use client";

import React from "react";
import { ResponsiveContainer, LineChart, Line, YAxis } from "recharts";
import { cn } from "@/lib/utils";
import { ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";

interface TrendCardProps {
  title: string;
  data: Array<{ date: string; value: number }>;
  currentValue: string | number;
  trend: "up" | "down" | "stable";
  color?: "blue" | "emerald" | "amber" | "rose" | "indigo";
}

export function TrendCard({ title, data, currentValue, trend, color = "indigo" }: TrendCardProps) {
  const trendStyles = {
    up: "text-emerald-600",
    down: "text-rose-600",
    stable: "text-slate-600",
  };

  const TrendIcon = trend === "up" ? ArrowUpRight : trend === "down" ? ArrowDownRight : Minus;

  const hexColors = {
    blue: "#3b82f6",
    emerald: "#10b981",
    amber: "#f59e0b",
    rose: "#ef4444",
    indigo: "#6366f1",
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-sm font-medium text-slate-500">{title}</h3>
        <TrendIcon size={20} className={cn(trendStyles[trend])} />
      </div>
      
      <div className="flex items-end justify-between">
        <div>
          <span className="text-2xl font-bold text-slate-900">{currentValue}</span>
        </div>
        <div className="w-24 h-12">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <YAxis domain={['dataMin', 'dataMax']} hide />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke={hexColors[color]} 
                strokeWidth={2} 
                dot={false} 
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
