'use client';

import { Users, Search, MapPin, Briefcase } from 'lucide-react';

export default function CandidatesPage() {
  const candidates = [
    { id: 'CND-8492', mask: 'R*** S***', location: 'Pune, MH', skills: ['React', 'Node.js', 'MongoDB'], status: 'Employed', course: 'Advanced Web Dev' },
    { id: 'CND-1029', mask: 'A*** K***', location: 'Bangalore, KA', skills: ['Python', 'SQL', 'AWS'], status: 'Looking', course: 'Data Engineering' },
    { id: 'CND-5581', mask: 'M*** P***', location: 'Delhi, DL', skills: ['AutoCAD', 'SolidWorks'], status: 'Employed', course: 'CAD Design' },
    { id: 'CND-3312', mask: 'K*** V***', location: 'Chennai, TN', skills: ['Cybersecurity', 'Linux'], status: 'Upskilling', course: 'Network Sec' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Users className="text-indigo-600" />
            Candidate Intelligence
          </h1>
          <p className="text-sm text-slate-500 mt-1">Anonymized view of candidate pool and trajectories</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: 'Total Candidates Tracked', value: '2.4M' },
          { label: 'Currently Enrolled', value: '850K' },
          { label: 'Active Job Seekers', value: '420K' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm text-center">
            <div className="text-sm font-medium text-slate-500 mb-1">{stat.label}</div>
            <div className="text-3xl font-bold text-slate-900">{stat.value}</div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="p-5 border-b border-slate-200 flex justify-between items-center bg-slate-50">
            <h2 className="text-lg font-bold text-slate-800">Candidate Pool (Anonymized)</h2>
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
              <input type="text" placeholder="Search by ID or Skill..." className="pl-8 pr-3 py-1.5 border border-slate-300 rounded text-sm w-64 outline-none focus:border-blue-500 bg-white" />
            </div>
          </div>
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left text-sm">
              <thead className="bg-white text-slate-600 text-xs font-semibold uppercase border-b border-slate-200">
                <tr>
                  <th className="px-5 py-4">Candidate ID</th>
                  <th className="px-5 py-4">Location</th>
                  <th className="px-5 py-4">Top Skills</th>
                  <th className="px-5 py-4">Origin Course</th>
                  <th className="px-5 py-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {candidates.map((cnd, i) => (
                  <tr key={i} className="hover:bg-slate-50">
                    <td className="px-5 py-4">
                       <div className="font-mono font-bold text-slate-800">{cnd.id}</div>
                       <div className="text-xs text-slate-500">{cnd.mask}</div>
                    </td>
                    <td className="px-5 py-4">
                       <div className="flex items-center gap-1 text-slate-600"><MapPin size={14}/> {cnd.location}</div>
                    </td>
                    <td className="px-5 py-4">
                       <div className="flex flex-wrap gap-1">
                          {cnd.skills.map(s => <span key={s} className="bg-slate-100 border border-slate-200 text-slate-600 px-2 py-0.5 rounded text-[10px] font-semibold">{s}</span>)}
                       </div>
                    </td>
                    <td className="px-5 py-4 text-slate-700 font-medium">{cnd.course}</td>
                    <td className="px-5 py-4 text-right">
                       <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                         cnd.status === 'Employed' ? 'bg-emerald-100 text-emerald-700' :
                         cnd.status === 'Looking' ? 'bg-blue-100 text-blue-700' :
                         'bg-amber-100 text-amber-700'
                       }`}>
                         {cnd.status}
                       </span>
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
