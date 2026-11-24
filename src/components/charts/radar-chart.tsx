"use client";

import React from "react";
import {
  ResponsiveContainer,
  Radar,
  RadarChart as RechartsRadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Tooltip
} from "recharts";

interface RadarChartProps {
  data: Array<{ subject: string; value: number; fullMark: number }>;
  title?: string;
  height?: number;
}

export function RadarChart({ data, title, height = 300 }: RadarChartProps) {
  return (
    <div className="w-full bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center">
      {title && <h3 className="text-lg font-semibold text-slate-800 mb-2 w-full text-left">{title}</h3>}
      <div style={{ height, width: "100%" }}>
        <ResponsiveContainer width="100%" height="100%">
          <RechartsRadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
            <PolarGrid stroke="#e2e8f0" />
            <PolarAngleAxis dataKey="subject" tick={{ fill: "#475569", fontSize: 11 }} />
            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: "#94a3b8", fontSize: 10 }} />
            <Tooltip
               contentStyle={{ backgroundColor: "#fff", borderRadius: "8px", border: "1px solid #e2e8f0", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}
            />
            <Radar name="Score" dataKey="value" stroke="#6366f1" fill="#6366f1" fillOpacity={0.4} />
          </RechartsRadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
