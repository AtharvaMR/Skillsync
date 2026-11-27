'use client';

import { useState } from 'react';
import { Map, AlertTriangle } from 'lucide-react';

export default function DistrictsPage() {
  const [showAll, setShowAll] = useState(false);

  const districts = [
    { name: 'Bengaluru Urban, Karnataka', demand: 'High', placement: 84, gap: 'Low', hotSkill: 'TypeScript & Cloud' },
    { name: 'Dharwad (Hubballi), Karnataka', demand: 'Medium', placement: 68, gap: 'Medium', hotSkill: 'EV & Full Stack Web' },
    { name: 'Pune, Maharashtra', demand: 'High', placement: 82, gap: 'Low', hotSkill: 'Automotive IoT' },
    { name: 'Coimbatore, Tamil Nadu', demand: 'High', placement: 85, gap: 'Low', hotSkill: 'CNC Machining' },
    { name: 'Bhopal, Madhya Pradesh', demand: 'Medium', placement: 45, gap: 'High', hotSkill: 'Solar PV & Digital Ops' },
    { name: 'Patna, Bihar', demand: 'Low', placement: 32, gap: 'Critical', hotSkill: 'Foundational IT & Trade' },
  ];

  const displayed = showAll ? districts : districts.filter((d) => d.placement >= 65);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Map className="text-emerald-600" /> District Intelligence (Curated MVP View)
          </h1>
          <p className="text-sm text-slate-600 mt-1">Regional skill demand, placement gaps, and underserved district focus</p>
        </div>
        <button
          type="button"
          onClick={() => setShowAll(!showAll)}
          className="px-4 py-2 rounded-lg bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800"
        >
          {showAll ? 'Show Top Performing Only' : 'Show All Tracked Districts'}
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <h2 className="text-base font-bold text-slate-900 mb-4">
            {showAll ? 'All Tracked Districts' : 'High-Alignment Districts'}
          </h2>
          <div className="space-y-3">
            {displayed.map((d) => (
              <div key={d.name} className="flex items-center justify-between p-4 border border-slate-100 rounded-lg bg-slate-50">
                <div>
                  <div className="font-bold text-slate-800 text-sm">{d.name}</div>
                  <div className="text-xs text-slate-500 mt-1">
                    Priority Skill: <span className="font-semibold text-slate-700">{d.hotSkill}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-xl font-bold ${d.placement >= 70 ? 'text-emerald-600' : 'text-amber-600'}`}>
                    {d.placement}%
                  </div>
                  <div className="text-[11px] text-slate-500">Placement Rate</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex flex-col">
          <h2 className="text-base font-bold mb-4 flex items-center gap-2 text-rose-700">
            <AlertTriangle size={18} /> Underserved / Intervention Priority
          </h2>
          <div className="space-y-3 flex-1">
            {districts
              .filter((d) => d.placement < 50)
              .map((d) => (
                <div key={d.name} className="p-4 border border-rose-200 rounded-lg bg-rose-50">
                  <div className="font-bold text-slate-900 text-sm">{d.name}</div>
                  <div className="text-xs text-slate-600 mt-1">Recommended Focus: {d.hotSkill}</div>
                  <div className="flex justify-between mt-2">
                    <span className="text-xs font-semibold text-rose-700 bg-rose-100 px-2 py-0.5 rounded">Gap: {d.gap}</span>
                    <span className="text-xs font-semibold text-slate-700 bg-white px-2 py-0.5 rounded border border-slate-200">
                      Rate: {d.placement}%
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
