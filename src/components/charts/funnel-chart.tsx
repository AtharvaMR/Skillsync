"use client";

import React from "react";
import { Users, GraduationCap, Award, Briefcase, UserCheck, HeartHandshake } from "lucide-react";
import { cn } from "@/lib/utils";

interface PlacementFunnel {
  enrolled: number;
  completed: number;
  certified: number;
  placed: number;
  employed: number;
  retained: number;
}

interface FunnelChartProps {
  data: PlacementFunnel;
}

export function FunnelChart({ data }: FunnelChartProps) {
  const maxVal = data.enrolled;

  const steps = [
    { key: "enrolled", label: "Enrolled", icon: Users, color: "bg-blue-500", value: data.enrolled },
    { key: "completed", label: "Completed", icon: GraduationCap, color: "bg-indigo-500", value: data.completed },
    { key: "certified", label: "Certified", icon: Award, color: "bg-purple-500", value: data.certified },
    { key: "placed", label: "Placed", icon: Briefcase, color: "bg-pink-500", value: data.placed },
    { key: "employed", label: "Employed", icon: UserCheck, color: "bg-rose-500", value: data.employed },
    { key: "retained", label: "Retained (6m)", icon: HeartHandshake, color: "bg-orange-500", value: data.retained },
  ];

  return (
    <div className="w-full bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
      <h3 className="text-lg font-semibold text-slate-800 mb-6 text-center">Employment Pipeline Funnel</h3>
      <div className="space-y-4 max-w-2xl mx-auto">
        {steps.map((step, index) => {
          const widthPercent = (step.value / maxVal) * 100;
          const prevValue = index === 0 ? maxVal : steps[index - 1].value;
          const conversionRate = prevValue > 0 ? Math.round((step.value / prevValue) * 100) : 0;
          const overallRate = maxVal > 0 ? Math.round((step.value / maxVal) * 100) : 0;

          return (
            <div key={step.key} className="flex flex-col relative">
              {index > 0 && (
                <div className="absolute -top-4 right-2 text-[10px] font-medium text-slate-400 bg-white px-1 z-10">
                  {conversionRate}% conversion
                </div>
              )}
              <div className="flex items-center gap-4">
                <div className="w-32 flex items-center justify-end gap-2 text-right">
                  <span className="text-sm font-medium text-slate-700">{step.label}</span>
                  <div className={cn("p-1.5 rounded-md text-white shrink-0", step.color)}>
                    <step.icon size={14} />
                  </div>
                </div>
                
                <div className="flex-1 bg-slate-100 rounded-full h-8 overflow-hidden flex items-center relative">
                  <div
                    className={cn("h-full transition-all duration-1000 ease-out flex items-center justify-end pr-3", step.color)}
                    style={{ width: `${Math.max(widthPercent, 5)}%` }}
                  >
                    <span className="text-white font-bold text-sm tracking-wider">
                      {step.value.toLocaleString()}
                    </span>
                  </div>
                </div>
                
                <div className="w-16 text-left">
                  <span className="text-xs font-semibold text-slate-500">{overallRate}%</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
