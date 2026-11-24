"use client";

import React from "react";

export function KaizenLoopVisual() {
  return (
    <div className="w-full bg-slate-900 rounded-xl border border-slate-800 p-8 flex flex-col items-center justify-center overflow-hidden relative shadow-xl">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/40 via-slate-900 to-slate-900"></div>
      
      <h3 className="text-2xl font-black text-white mb-2 relative z-10 tracking-tight">Continuous Alignment Loop</h3>
      <p className="text-slate-400 text-sm mb-12 relative z-10 max-w-md text-center">SkillSync operates on a Kaizen methodology, continuously refining curriculum based on real-world outcomes.</p>

      <div className="relative w-[400px] h-[400px] z-10 flex items-center justify-center">
        {/* Core circle */}
        <div className="absolute w-64 h-64 rounded-full border-4 border-indigo-500/30 shadow-[0_0_50px_rgba(99,102,241,0.2)]"></div>
        <div className="absolute w-64 h-64 rounded-full border-t-4 border-r-4 border-indigo-400 animate-[spin_10s_linear_infinite]"></div>
        
        {/* Center label */}
        <div className="absolute w-32 h-32 bg-slate-800 rounded-full flex items-center justify-center z-20 border-4 border-slate-700 shadow-2xl">
          <span className="font-bold text-white text-center leading-tight">SkillSync<br/><span className="text-indigo-400 text-sm">Engine</span></span>
        </div>

        {/* Nodes */}
        <Node label="Industry Reality" angle={0} color="text-sky-400" bg="bg-sky-500/20" border="border-sky-500/50" />
        <Node label="Data Ingestion" angle={45} color="text-indigo-400" bg="bg-indigo-500/20" border="border-indigo-500/50" />
        <Node label="Skill Gap Analysis" angle={90} color="text-violet-400" bg="bg-violet-500/20" border="border-violet-500/50" />
        <Node label="Curriculum Alignment" angle={135} color="text-fuchsia-400" bg="bg-fuchsia-500/20" border="border-fuchsia-500/50" />
        <Node label="Training Execution" angle={180} color="text-pink-400" bg="bg-pink-500/20" border="border-pink-500/50" />
        <Node label="Placement" angle={225} color="text-rose-400" bg="bg-rose-500/20" border="border-rose-500/50" />
        <Node label="Outcome Tracking" angle={270} color="text-amber-400" bg="bg-amber-500/20" border="border-amber-500/50" />
        <Node label="Impact Analytics" angle={315} color="text-emerald-400" bg="bg-emerald-500/20" border="border-emerald-500/50" />
      </div>
    </div>
  );
}

function Node({ label, angle, color, bg, border }: { label: string, angle: number, color: string, bg: string, border: string }) {
  const radius = 170;
  const rad = (angle - 90) * (Math.PI / 180);
  const x = Math.cos(rad) * radius;
  const y = Math.sin(rad) * radius;

  return (
    <div 
      className={`absolute flex flex-col items-center justify-center transform -translate-x-1/2 -translate-y-1/2 transition-transform hover:scale-110 cursor-default`}
      style={{ left: `calc(50% + ${x}px)`, top: `calc(50% + ${y}px)` }}
    >
      <div className={`w-3 h-3 rounded-full mb-2 ${bg} ${border} border shadow-[0_0_10px_currentColor] ${color}`}></div>
      <span className={`text-[10px] font-bold uppercase tracking-wider text-center w-24 ${color} drop-shadow-md`}>
        {label}
      </span>
    </div>
  );
}
