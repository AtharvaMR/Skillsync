import React from "react";
import { MapPin, TrendingUp, Users } from "lucide-react";
import { SkillBadge } from "@/components/ui/skill-badge";

interface DistrictCardProps {
  district: {
    id: string;
    name: string;
    state: string;
    metrics: {
      placementRate: number;
      activeCandidates: number;
      topSkills: Array<{ name: string; demand: "high_demand" | "emerging" | "stable" | "declining" | "oversupplied" }>;
      economicGrowth: "HIGH" | "STABLE" | "DECLINING";
    }
  };
}

export function DistrictCard({ district }: DistrictCardProps) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-all">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
            <MapPin size={20} />
          </div>
          <div>
            <h3 className="font-bold text-slate-900">{district.name}</h3>
            <p className="text-xs text-slate-500">{district.state}</p>
          </div>
        </div>
        <div className="text-right">
          <span className="text-2xl font-bold text-emerald-600">{district.metrics.placementRate}%</span>
          <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Placement</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-5 p-3 bg-slate-50 rounded-lg border border-slate-100">
        <div className="flex flex-col gap-1">
          <span className="text-xs text-slate-500 flex items-center gap-1"><Users size={12}/> Candidates</span>
          <span className="font-semibold text-slate-800">{district.metrics.activeCandidates.toLocaleString()}</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-xs text-slate-500 flex items-center gap-1"><TrendingUp size={12}/> Economy</span>
          <span className="font-semibold text-slate-800">{district.metrics.economicGrowth}</span>
        </div>
      </div>

      <div>
        <h4 className="text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wider">Top Required Skills</h4>
        <div className="flex flex-wrap gap-2">
          {district.metrics.topSkills.map((skill) => (
            <SkillBadge key={skill.name} name={skill.name} demandLevel={skill.demand} size="sm" />
          ))}
        </div>
      </div>
    </div>
  );
}
