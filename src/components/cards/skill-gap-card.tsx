import React from "react";
import { ProgressBar } from "@/components/ui/progress-bar";
import { cn } from "@/lib/utils";

interface SkillGapCardProps {
  skillName: string;
  industryDemand: number; // 0-100
  curriculumCoverage: number; // 0-100
  gap: number;
  classification: "CRITICAL_SHORTAGE" | "ADEQUATE" | "OVERSUPPLY";
}

export function SkillGapCard({ skillName, industryDemand, curriculumCoverage, gap, classification }: SkillGapCardProps) {
  const isCritical = classification === "CRITICAL_SHORTAGE";
  const isOversupply = classification === "OVERSUPPLY";
  
  return (
    <div className={cn(
      "bg-white rounded-xl border p-5 shadow-sm transition-all",
      isCritical ? "border-rose-200 bg-rose-50/30" : "border-slate-200"
    )}>
      <div className="flex justify-between items-start mb-4">
        <h3 className="font-bold text-slate-900">{skillName}</h3>
        <span className={cn(
          "px-2 py-0.5 rounded text-xs font-bold",
          isCritical ? "bg-rose-100 text-rose-700" : 
          isOversupply ? "bg-amber-100 text-amber-700" : 
          "bg-emerald-100 text-emerald-700"
        )}>
          {classification.replace("_", " ")}
        </span>
      </div>

      <div className="space-y-4">
        <div>
          <ProgressBar 
            value={industryDemand} 
            label="Industry Demand" 
            color="indigo" 
          />
        </div>
        <div>
          <ProgressBar 
            value={curriculumCoverage} 
            label="Curriculum Coverage" 
            color="emerald" 
          />
        </div>
      </div>

      <div className="mt-5 pt-4 border-t border-slate-100 flex justify-between items-center">
        <span className="text-sm text-slate-500 font-medium">Calculated Gap</span>
        <span className={cn(
          "text-lg font-bold",
          gap > 20 ? "text-rose-600" : gap > 0 ? "text-amber-600" : "text-emerald-600"
        )}>
          {gap > 0 ? `+${gap}%` : `${gap}%`} shortfall
        </span>
      </div>
    </div>
  );
}
