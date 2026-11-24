"use client";

import React from "react";
import { cn } from "@/lib/utils";
import type { CourseHealthBreakdown } from "@/types";

interface CourseHealthCardProps {
  name: string;
  score: number;
  breakdown: CourseHealthBreakdown;
  healthLevel: "HEALTHY" | "AT_RISK" | "CRITICAL";
}

export function CourseHealthCard({ name, score, breakdown, healthLevel }: CourseHealthCardProps) {
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const healthStyles = {
    HEALTHY: { text: "text-emerald-600", stroke: "stroke-emerald-500", bg: "bg-emerald-50 text-emerald-700" },
    AT_RISK: { text: "text-amber-600", stroke: "stroke-amber-500", bg: "bg-amber-50 text-amber-700" },
    CRITICAL: { text: "text-rose-600", stroke: "stroke-rose-500", bg: "bg-rose-50 text-rose-700" },
  };

  const { text, stroke, bg } = healthStyles[healthLevel];

  const breakdownItems = [
    { label: "Content Freshness", value: breakdown.curriculumFreshness },
    { label: "Industry Alignment", value: breakdown.industryAlignment },
    { label: "Placement Rate", value: breakdown.placementPerformance },
    { label: "Employer Satisfaction", value: breakdown.employerSatisfaction },
  ];

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">{name}</h3>
          <span className={cn("inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-2", bg)}>
            {healthLevel.replace("_", " ")}
          </span>
        </div>
        
        <div className="relative w-24 h-24 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle
              className="stroke-slate-100"
              strokeWidth="8"
              fill="transparent"
              r={radius}
              cx="50"
              cy="50"
            />
            <circle
              className={cn("transition-all duration-1000 ease-in-out", stroke)}
              strokeWidth="8"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              r={radius}
              cx="50"
              cy="50"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center flex-col">
            <span className={cn("text-2xl font-bold", text)}>{score}</span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="text-sm font-medium text-slate-700">Health Breakdown</h4>
        <div className="space-y-3">
          {breakdownItems.map((item) => (
            <div key={item.label}>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-600">{item.label}</span>
                <span className="font-medium text-slate-900">{item.value}/100</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-1.5">
                <div
                  className={cn("h-1.5 rounded-full", item.value >= 80 ? "bg-emerald-500" : item.value >= 60 ? "bg-amber-500" : "bg-rose-500")}
                  style={{ width: `${item.value}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
