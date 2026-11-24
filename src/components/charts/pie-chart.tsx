"use client";

import React from "react";
import { ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell, Tooltip, Legend } from "recharts";

interface PieChartProps {
  data: Array<{ name: string; value: number; color?: string }>;
  title?: string;
  height?: number;
  innerRadius?: number;
}

export function PieChart({ data, title, height = 300, innerRadius = 0 }: PieChartProps) {
  const defaultColors = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#6366f1", "#8b5cf6", "#ec4899"];

  return (
    <div className="w-full bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col">
      {title && <h3 className="text-lg font-semibold text-slate-800 mb-2">{title}</h3>}
      <div style={{ height }} className="flex-1 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsPieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={innerRadius}
              outerRadius={height / 2 - 40}
              paddingAngle={2}
              dataKey="value"
              stroke="none"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color || defaultColors[index % defaultColors.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ backgroundColor: "#fff", borderRadius: "8px", border: "1px solid #e2e8f0", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}
            />
            <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
          </RechartsPieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
