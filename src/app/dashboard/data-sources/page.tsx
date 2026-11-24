'use client';

import { Database, CheckCircle, RefreshCw, AlertCircle } from 'lucide-react';

export default function DataSourcesPage() {
  const sources = [
    { name: 'NCS (National Career Service)', status: 'Active', lastSync: '10 mins ago', records: '2.4M', health: 'Good' },
    { name: 'EPFO (Employment Data)', status: 'Active', lastSync: '1 hour ago', records: '8.1M', health: 'Good' },
    { name: 'LinkedIn API', status: 'Active', lastSync: '2 hours ago', records: '450K', health: 'Good' },
    { name: 'State Skill Portals', status: 'Warning', lastSync: '2 days ago', records: '1.2M', health: 'Degraded' },
  ];

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Database className="text-slate-600" />
          Data Sources & Ingestion
        </h1>
        <p className="text-sm text-slate-500 mt-1">Monitor the health of external data pipelines</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
         {sources.map((src, i) => (
            <div key={i} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
               <div className="flex justify-between items-start mb-4">
                  <h3 className="font-bold text-slate-800 text-sm">{src.name}</h3>
                  {src.health === 'Good' ? <CheckCircle size={18} className="text-emerald-500" /> : <AlertCircle size={18} className="text-amber-500" />}
               </div>
               <div className="text-2xl font-bold text-slate-900 mb-1">{src.records}</div>
               <div className="text-xs font-medium text-slate-500">Records Processed</div>
               <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span className="flex items-center gap-1"><RefreshCw size={12}/> {src.lastSync}</span>
                  <span className={`font-bold ${src.health === 'Good' ? 'text-emerald-600' : 'text-amber-600'}`}>{src.status}</span>
               </div>
            </div>
         ))}
      </div>
    </div>
  );
}
