'use client';

import { Server, AlertCircle, Wrench, CheckCircle } from 'lucide-react';

export default function EquipmentPage() {
  const gaps = [
    { institute: 'Govt ITI Pune', course: 'CNC Machining', required: '5-Axis CNC Machine', current: '3-Axis (Outdated)', cost: '₹25L', priority: 'High' },
    { institute: 'Tech Hub Bangalore', course: 'Cloud Computing', required: 'AWS Educate Lab', current: 'Local Servers', cost: '₹5L', priority: 'Medium' },
    { institute: 'Skill Center Delhi', course: 'EV Maintenance', required: 'EV Battery Tester', current: 'None', cost: '₹8L', priority: 'High' },
  ];

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Server className="text-slate-600" />
          Equipment Intelligence
        </h1>
        <p className="text-sm text-slate-500 mt-1">Infrastructure gap analysis for training centers</p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 mb-6 flex items-start gap-4 border-l-4 border-l-amber-500">
         <AlertCircle className="text-amber-500 shrink-0 mt-1" size={24} />
         <div>
            <h3 className="font-bold text-lg text-slate-900 mb-1">System Alert: Critical Equipment Shortages</h3>
            <p className="text-sm text-slate-600">142 institutes are currently trying to teach emerging skills (EV, IoT, Advanced Manufacturing) without the necessary modern equipment, resulting in a 40% lower placement rate for these cohorts.</p>
         </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="p-5 border-b border-slate-200 bg-slate-50">
            <h2 className="text-lg font-bold text-slate-800">Priority Procurement Recommendations</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-white text-slate-600 text-xs font-semibold uppercase border-b border-slate-200">
                <tr>
                  <th className="px-5 py-4">Institute</th>
                  <th className="px-5 py-4">Course</th>
                  <th className="px-5 py-4">Equipment Needed</th>
                  <th className="px-5 py-4">Est. Cost</th>
                  <th className="px-5 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {gaps.map((gap, i) => (
                  <tr key={i} className="hover:bg-slate-50">
                    <td className="px-5 py-4 font-bold text-slate-800">{gap.institute}</td>
                    <td className="px-5 py-4 text-slate-600">{gap.course}</td>
                    <td className="px-5 py-4">
                       <div className="font-semibold text-rose-600">{gap.required}</div>
                       <div className="text-xs text-slate-500">Currently: {gap.current}</div>
                    </td>
                    <td className="px-5 py-4 font-mono font-medium">{gap.cost}</td>
                    <td className="px-5 py-4 text-right">
                       <button className="bg-slate-900 text-white px-3 py-1.5 rounded text-xs font-semibold hover:bg-slate-800">Approve Fund</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
      </div>
    </div>
  );
}
