'use client';

import { GraduationCap, Award, BookOpen } from 'lucide-react';

export default function TrainersPage() {
  const trainers = [
    { name: 'Dr. Ramesh Kumar', domain: 'Cloud Computing', certified: true, students: 450, rating: 4.8, upskillNeeded: false },
    { name: 'Anita Desai', domain: 'Web Development', certified: true, students: 320, rating: 4.5, upskillNeeded: true },
    { name: 'Suresh Patil', domain: 'Automotive', certified: false, students: 210, rating: 3.9, upskillNeeded: true },
  ];

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <GraduationCap className="text-blue-600" />
          Trainer Intelligence
        </h1>
        <p className="text-sm text-slate-500 mt-1">Monitor trainer certifications and upskilling needs</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
           <div className="text-3xl font-bold text-slate-900 mb-1">12,450</div>
           <div className="text-sm font-medium text-slate-500">Total Active Trainers</div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
           <div className="text-3xl font-bold text-emerald-600 mb-1">68%</div>
           <div className="text-sm font-medium text-slate-500">NSDC Certified</div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
           <div className="text-3xl font-bold text-amber-600 mb-1">3,240</div>
           <div className="text-sm font-medium text-slate-500">Require Upskilling</div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="p-5 border-b border-slate-200 bg-slate-50">
            <h2 className="text-lg font-bold text-slate-800">Trainer Directory Overview</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-white text-slate-600 text-xs font-semibold uppercase border-b border-slate-200">
                <tr>
                  <th className="px-5 py-4">Trainer Name</th>
                  <th className="px-5 py-4">Domain</th>
                  <th className="px-5 py-4 text-center">Certification</th>
                  <th className="px-5 py-4 text-center">Trained</th>
                  <th className="px-5 py-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {trainers.map((t, i) => (
                  <tr key={i} className="hover:bg-slate-50">
                    <td className="px-5 py-4 font-bold text-slate-800">{t.name}</td>
                    <td className="px-5 py-4 text-slate-600 font-medium">{t.domain}</td>
                    <td className="px-5 py-4 text-center">
                       {t.certified ? <Award className="mx-auto text-emerald-500" size={20} /> : <span className="text-xs text-slate-400">None</span>}
                    </td>
                    <td className="px-5 py-4 text-center font-bold text-slate-700">{t.students}</td>
                    <td className="px-5 py-4 text-right">
                       {t.upskillNeeded ? (
                          <span className="bg-amber-100 text-amber-700 px-2 py-1 rounded text-xs font-bold inline-block">Needs Upskill</span>
                       ) : (
                          <span className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded text-xs font-bold inline-block">Up to Date</span>
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
