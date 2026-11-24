'use client';

import { FileText, Download, Filter } from 'lucide-react';

export default function ReportsPage() {
  const reports = [
    { title: 'Q3 State of Skills Report', type: 'Quarterly', date: 'Oct 1, 2026', size: '2.4 MB' },
    { title: 'Placement Gap Analysis', type: 'Analytical', date: 'Sep 28, 2026', size: '1.1 MB' },
    { title: 'Emerging Tech Demand', type: 'Intelligence', date: 'Sep 15, 2026', size: '3.5 MB' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <FileText className="text-indigo-600" />
            Platform Reports
          </h1>
          <p className="text-sm text-slate-500 mt-1">Generated insights and exportable documents</p>
        </div>
        <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700">
           Generate New Report
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
         <h2 className="text-lg font-bold mb-4">Recent Reports</h2>
         <div className="space-y-3">
            {reports.map((r, i) => (
               <div key={i} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-4">
                     <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center"><FileText size={20}/></div>
                     <div>
                        <div className="font-bold text-slate-800">{r.title}</div>
                        <div className="text-xs text-slate-500">{r.type} • Generated {r.date}</div>
                     </div>
                  </div>
                  <button className="text-slate-500 hover:text-indigo-600 p-2 border border-slate-200 rounded hover:border-indigo-200 bg-white shadow-sm flex items-center gap-2 text-sm font-medium">
                     <Download size={16}/> Download PDF
                  </button>
               </div>
            ))}
         </div>
      </div>
    </div>
  );
}
