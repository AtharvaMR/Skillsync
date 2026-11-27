'use client';

import { useState } from 'react';
import { Server, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function EquipmentPage() {
  const [approved, setApproved] = useState<string[]>([]);

  const gaps = [
    { id: 'eq_1', institute: 'Govt ITI Hubballi', course: 'EV & Battery Service Technician', required: 'BMS Diagnostic Bench', current: 'Basic Multimeters', cost: '₹8L', priority: 'High' },
    { id: 'eq_2', institute: 'Govt ITI Pune', course: 'CNC Machining', required: '5-Axis CNC Trainer Unit', current: '3-Axis (Outdated)', cost: '₹25L', priority: 'High' },
    { id: 'eq_3', institute: 'Don Bosco Skill Hub', course: 'Cloud & DevOps Associate', required: 'Cloud Sandbox Lab Credits', current: 'Local Desktops', cost: '₹3L', priority: 'Medium' },
  ];

  const handleApprove = async (gap: (typeof gaps)[number]) => {
    setApproved((prev) => (prev.includes(gap.id) ? prev : [...prev, gap.id]));
    await fetch('/api/kaizen', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: `Procure ${gap.required} for ${gap.institute}`,
        phase: 'do',
        category: 'Infrastructure',
        evidence: `Equipment shortage impacting ${gap.course} hands-on training readiness`,
        impactMetric: `Budget allocated: ${gap.cost}`,
      }),
    }).catch(() => {});
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Server className="text-slate-700" /> Equipment & Infrastructure Intelligence
        </h1>
        <p className="text-sm text-slate-600 mt-1">Identify lab equipment gaps preventing hands-on competency training</p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex items-start gap-3 border-l-4 border-l-amber-500">
        <AlertCircle className="text-amber-600 shrink-0 mt-0.5" size={20} />
        <div>
          <h3 className="font-bold text-sm text-slate-900">Equipment Readiness Directly Impacts Practical Validation</h3>
          <p className="text-xs text-slate-600 mt-0.5">
            Curated MVP alert: Training centers teaching EV diagnostics and modern manufacturing without updated lab tooling face lower employer readiness scores.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-200 bg-slate-50">
          <h2 className="text-base font-bold text-slate-900">Priority Procurement Recommendations</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-white text-slate-600 text-xs font-semibold uppercase border-b border-slate-200">
              <tr>
                <th className="px-5 py-3.5">Institute</th>
                <th className="px-5 py-3.5">Course</th>
                <th className="px-5 py-3.5">Equipment Needed</th>
                <th className="px-5 py-3.5">Est. Cost</th>
                <th className="px-5 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {gaps.map((gap) => (
                <tr key={gap.id} className="hover:bg-slate-50">
                  <td className="px-5 py-4 font-bold text-slate-800">{gap.institute}</td>
                  <td className="px-5 py-4 text-slate-600">{gap.course}</td>
                  <td className="px-5 py-4">
                    <div className="font-semibold text-rose-700">{gap.required}</div>
                    <div className="text-xs text-slate-500">Currently: {gap.current}</div>
                  </td>
                  <td className="px-5 py-4 font-mono font-medium">{gap.cost}</td>
                  <td className="px-5 py-4 text-right">
                    {approved.includes(gap.id) ? (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded">
                        <CheckCircle2 size={13} /> Queued in Kaizen
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleApprove(gap)}
                        className="bg-slate-900 text-white px-3 py-1.5 rounded text-xs font-semibold hover:bg-slate-800"
                      >
                        Approve & Log
                      </button>
                    )}
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
