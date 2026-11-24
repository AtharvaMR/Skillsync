"use client";

import React from "react";
import {
  ResponsiveContainer,
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

interface BarChartProps {
  data: any[];
  xKey: string;
  yKey: string;
  color?: string;
  title?: string;
  height?: number;
  layout?: "vertical" | "horizontal";
}

export function BarChart({ data, xKey, yKey, color = "#3b82f6", title, height = 300, layout = "horizontal" }: BarChartProps) {
  const isVertical = layout === "vertical";

  return (
    <div className="w-full bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
      {title && <h3 className="text-lg font-semibold text-slate-800 mb-4">{title}</h3>}
      <div style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <RechartsBarChart
            data={data}
            layout={layout}
            margin={{ top: 10, right: 10, left: isVertical ? 20 : -20, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={!isVertical} horizontal={isVertical} stroke="#e2e8f0" />
            <XAxis
              type={isVertical ? "number" : "category"}
              dataKey={isVertical ? undefined : xKey}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "#64748b" }}
              dy={isVertical ? 0 : 10}
            />
            <YAxis
              type={isVertical ? "category" : "number"}
              dataKey={isVertical ? xKey : undefined}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "#64748b" }}
              width={isVertical ? 100 : undefined}
            />
            <Tooltip
              cursor={{ fill: "#f1f5f9" }}
              contentStyle={{ backgroundColor: "#fff", borderRadius: "8px", border: "1px solid #e2e8f0", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}
            />
            <Bar dataKey={yKey} fill={color} radius={isVertical ? [0, 4, 4, 0] : [4, 4, 0, 0]} barSize={isVertical ? 24 : 32} />
          </RechartsBarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
