"use client";

import React from "react";
import { ArrowDown, BookOpen, Briefcase, Target, MapPin } from "lucide-react";

interface CareerPathwayProps {
  pathway: {
    currentSkills: string[];
    skillGaps: string[];
    recommendedCourses: string[];
    targetOccupation: string;
    potentialJobs: number;
    expectedSalary: string;
  };
}

export function CareerPathway({ pathway }: CareerPathwayProps) {
  return (
    <div className="bg-slate-50 rounded-xl border border-slate-200 p-6 relative">
      <div className="absolute left-[39px] top-10 bottom-10 w-0.5 bg-indigo-200"></div>

      <div className="space-y-8 relative">
        {/* Step 1 */}
        <div className="flex gap-4">
          <div className="w-8 h-8 rounded-full bg-white border-2 border-slate-300 flex items-center justify-center shrink-0 z-10 shadow-sm">
            <span className="text-xs font-bold text-slate-500">1</span>
          </div>
          <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm flex-1">
            <h4 className="text-sm font-bold text-slate-800 mb-2">Current Skills Base</h4>
            <div className="flex flex-wrap gap-1.5">
              {pathway.currentSkills.map(s => (
                <span key={s} className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded font-medium">{s}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Step 2 */}
        <div className="flex gap-4">
          <div className="w-8 h-8 rounded-full bg-white border-2 border-rose-300 flex items-center justify-center shrink-0 z-10 shadow-sm">
            <Target size={14} className="text-rose-500" />
          </div>
          <div className="bg-white p-4 rounded-lg border border-rose-100 shadow-sm flex-1">
            <h4 className="text-sm font-bold text-rose-800 mb-2">Identified Skill Gaps</h4>
            <div className="flex flex-wrap gap-1.5">
              {pathway.skillGaps.map(s => (
                <span key={s} className="px-2 py-1 bg-rose-50 text-rose-700 border border-rose-100 text-xs rounded font-medium">{s}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Step 3 */}
        <div className="flex gap-4">
          <div className="w-8 h-8 rounded-full bg-white border-2 border-indigo-400 flex items-center justify-center shrink-0 z-10 shadow-sm">
            <BookOpen size={14} className="text-indigo-600" />
          </div>
          <div className="bg-white p-4 rounded-lg border border-indigo-100 shadow-sm flex-1">
            <h4 className="text-sm font-bold text-indigo-800 mb-2">Recommended Learning Path</h4>
            <ul className="space-y-2">
              {pathway.recommendedCourses.map((c, i) => (
                <li key={i} className="text-sm text-slate-700 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span> {c}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Step 4 */}
        <div className="flex gap-4">
          <div className="w-8 h-8 rounded-full bg-emerald-500 border-2 border-emerald-500 flex items-center justify-center shrink-0 z-10 shadow-sm">
            <Briefcase size={14} className="text-white" />
          </div>
          <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-200 shadow-sm flex-1">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="text-sm font-bold text-emerald-900 mb-1">Target Occupation</h4>
                <p className="text-lg font-black text-emerald-700">{pathway.targetOccupation}</p>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Salary Ext.</span>
                <p className="font-bold text-slate-800">{pathway.expectedSalary}</p>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-emerald-200 flex items-center gap-2 text-sm font-medium text-emerald-800">
              <MapPin size={16} /> {pathway.potentialJobs} matching jobs in district
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
