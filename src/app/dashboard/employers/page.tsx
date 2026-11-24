'use client';

import { Building2, Search, Filter, Star, MessageSquare } from 'lucide-react';

export default function EmployersPage() {
  const employers = [
    { name: 'TechMahindra', sector: 'IT Services', jobs: 1250, feedbackScore: 4.8, requests: 12 },
    { name: 'Tata Motors', sector: 'Automotive', jobs: 850, feedbackScore: 4.5, requests: 8 },
    { name: 'HDFC Bank', sector: 'BFSI', jobs: 2100, feedbackScore: 4.2, requests: 5 },
    { name: 'L&T Construction', sector: 'Construction', jobs: 3400, feedbackScore: 4.1, requests: 22 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Building2 className="text-amber-600" />
            Employer Intelligence
          </h1>
          <p className="text-sm text-slate-500 mt-1">Manage employer network and validation loops</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Registered Employers', value: '8,452', sub: '+124 this month' },
          { label: 'Active Job Requisitions', value: '24,150', sub: 'Across all sectors' },
          { label: 'Feedback Submissions', value: '1,284', sub: 'Last 30 days' },
          { label: 'Curriculum Validations', value: '342', sub: 'Completed this quarter' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <div className="text-sm font-medium text-slate-500 mb-1">{stat.label}</div>
            <div className="text-2xl font-bold text-slate-900 mb-1">{stat.value}</div>
            <div className="text-xs text-slate-400">{stat.sub}</div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="p-5 border-b border-slate-200 flex justify-between items-center">
            <h2 className="text-lg font-bold text-slate-800">Top Employer Partners</h2>
            <div className="flex gap-2">
               <button className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-300 rounded text-sm font-medium text-slate-700"><Filter size={14}/> Filter</button>
            </div>
          </div>
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-600 text-xs font-semibold uppercase">
                <tr>
                  <th className="px-5 py-3">Employer</th>
                  <th className="px-5 py-3">Sector</th>
                  <th className="px-5 py-3 text-center">Active Jobs</th>
                  <th className="px-5 py-3 text-center">Feedback Score</th>
                  <th className="px-5 py-3 text-right">Pending Validations</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {employers.map((emp, i) => (
                  <tr key={i} className="hover:bg-slate-50">
                    <td className="px-5 py-4 font-bold text-slate-800">{emp.name}</td>
                    <td className="px-5 py-4"><span className="bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full text-xs font-medium">{emp.sector}</span></td>
                    <td className="px-5 py-4 text-center font-semibold text-slate-700">{emp.jobs.toLocaleString()}</td>
                    <td className="px-5 py-4 text-center">
                       <div className="flex items-center justify-center gap-1 text-amber-500 font-bold">
                          <Star size={14} fill="currentColor" /> {emp.feedbackScore}
                       </div>
                    </td>
                    <td className="px-5 py-4 text-right">
                       {emp.requests > 0 ? (
                          <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-bold">{emp.requests} Tasks</span>
                       ) : (
                          <span className="text-slate-400 text-xs font-medium">None</span>
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
