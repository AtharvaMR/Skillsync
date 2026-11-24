'use client';

import { Map, TrendingUp, AlertTriangle } from 'lucide-react';

export default function DistrictsPage() {
  const districts = [
    { name: 'Pune, Maharashtra', demand: 'High', placement: 82, gap: 'Low', hotSkill: 'Automotive IoT' },
    { name: 'Surat, Gujarat', demand: 'High', placement: 78, gap: 'Low', hotSkill: 'Textile Tech' },
    { name: 'Bhopal, MP', demand: 'Medium', placement: 45, gap: 'High', hotSkill: 'Data Entry' },
    { name: 'Patna, Bihar', demand: 'Low', placement: 32, gap: 'Critical', hotSkill: 'Basic IT' },
    { name: 'Coimbatore, TN', demand: 'High', placement: 85, gap: 'Low', hotSkill: 'CNC Machining' },
  ];

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Map className="text-emerald-600" />
          District Intelligence
        </h1>
        <p className="text-sm text-slate-500 mt-1">Geographic mapping of skill supply and demand</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
         <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <h2 className="text-lg font-bold mb-4">Top Performing Districts</h2>
            <div className="space-y-3">
               {districts.filter(d => d.placement > 70).map((d, i) => (
                  <div key={i} className="flex items-center justify-between p-4 border border-slate-100 rounded-lg bg-slate-50">
                     <div>
                        <div className="font-bold text-slate-800">{d.name}</div>
                        <div className="text-xs text-slate-500 mt-1">Hot Skill: <span className="font-semibold text-slate-700">{d.hotSkill}</span></div>
                     </div>
                     <div className="text-right">
                        <div className="text-2xl font-bold text-emerald-600">{d.placement}%</div>
                        <div className="text-xs text-slate-500">Placement Rate</div>
                     </div>
                  </div>
               ))}
            </div>
         </div>

         <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex flex-col">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-rose-600">
               <AlertTriangle size={20}/>
               Intervention Required
            </h2>
            <div className="space-y-3 flex-1">
               {districts.filter(d => d.placement < 50).map((d, i) => (
                  <div key={i} className="p-4 border border-rose-100 rounded-lg bg-rose-50">
                     <div className="font-bold text-slate-800">{d.name}</div>
                     <div className="flex justify-between mt-2">
                        <span className="text-xs font-semibold text-rose-700 bg-rose-100 px-2 py-1 rounded">Gap: {d.gap}</span>
                        <span className="text-xs font-semibold text-slate-600 bg-white px-2 py-1 rounded shadow-sm border border-slate-200">Rate: {d.placement}%</span>
                     </div>
                  </div>
               ))}
            </div>
            <button className="w-full mt-4 bg-slate-900 text-white font-semibold py-2 rounded-lg text-sm hover:bg-slate-800">
               View Full Geographic Map
            </button>
         </div>
      </div>
    </div>
  );
}
