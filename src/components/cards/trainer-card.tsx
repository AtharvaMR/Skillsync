import React from "react";
import { Award, AlertCircle, CheckCircle2 } from "lucide-react";
import { ProgressBar } from "@/components/ui/progress-bar";

interface TrainerCardProps {
  name: string;
  skills: Array<{ name: string; proficiency: number }>;
  gapSkills: string[];
  recommendations: string[];
}

export function TrainerCard({ name, skills, gapSkills, recommendations }: TrainerCardProps) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
      <div className="p-5 border-b border-slate-100 bg-slate-50 flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-lg border border-indigo-200">
          {name.split(" ").map(n => n[0]).join("")}
        </div>
        <div>
          <h3 className="font-bold text-slate-900 text-lg">{name}</h3>
          <span className="text-xs font-medium bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded flex items-center gap-1 w-max mt-1">
            <Award size={12} /> Certified Master Trainer
          </span>
        </div>
      </div>

      <div className="p-5 flex-1">
        <h4 className="text-sm font-semibold text-slate-700 mb-3">Current Proficiencies</h4>
        <div className="space-y-3 mb-6">
          {skills.map((skill) => (
            <ProgressBar 
              key={skill.name} 
              value={skill.proficiency} 
              label={skill.name} 
              color={skill.proficiency > 80 ? "emerald" : "blue"} 
            />
          ))}
        </div>

        {gapSkills.length > 0 && (
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-rose-700 flex items-center gap-1 mb-2">
              <AlertCircle size={16} /> Skill Gaps Identified
            </h4>
            <div className="flex flex-wrap gap-2">
              {gapSkills.map(skill => (
                <span key={skill} className="px-2 py-1 bg-rose-50 text-rose-700 text-xs rounded border border-rose-100 font-medium">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        <div>
          <h4 className="text-sm font-semibold text-slate-700 mb-2">Recommended Upskilling</h4>
          <ul className="space-y-2">
            {recommendations.map((rec, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm text-slate-600 bg-slate-50 p-2 rounded border border-slate-100">
                <CheckCircle2 size={16} className="text-indigo-500 mt-0.5 shrink-0" />
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
