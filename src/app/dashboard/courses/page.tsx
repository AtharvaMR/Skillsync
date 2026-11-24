'use client';

import { GraduationCap, AlertTriangle, CheckCircle2, ArrowRight, RefreshCcw, Search } from 'lucide-react';

export default function CoursesIntelligencePage() {
  const courses = [
    { 
      id: 'CS-401', 
      name: 'Advanced Web Development', 
      healthScore: 82, 
      alignmentScore: 65, 
      placementRate: '68%',
      status: 'Needs Update',
      enrolled: 12500
    },
    { 
      id: 'AI-101', 
      name: 'Applied Machine Learning', 
      healthScore: 95, 
      alignmentScore: 92, 
      placementRate: '88%',
      status: 'Healthy',
      enrolled: 8400
    },
    { 
      id: 'DT-201', 
      name: 'Data Entry Operations', 
      healthScore: 45, 
      alignmentScore: 30, 
      placementRate: '22%',
      status: 'Critical',
      enrolled: 45000
    },
    { 
      id: 'CY-301', 
      name: 'Network Security Fundamentals', 
      healthScore: 78, 
      alignmentScore: 85, 
      placementRate: '81%',
      status: 'Healthy',
      enrolled: 6200
    }
  ];

  const recommendations = [
    {
      course: 'Advanced Web Development',
      action: 'ADD MODULE',
      target: 'Next.js 14 App Router',
      evidence: '94% of React job postings now require or prefer Next.js experience.',
      impact: 'High (+15% estimated placement)',
      priority: 'Urgent'
    },
    {
      course: 'Advanced Web Development',
      action: 'REMOVE MODULE',
      target: 'jQuery Fundamentals',
      evidence: 'Demand dropped by 85% over 3 years. Only 2% of postings mention it.',
      impact: 'Medium (Frees up 12 training hours)',
      priority: 'High'
    },
    {
      course: 'Data Entry Operations',
      action: 'SUNSET COURSE',
      target: 'Entire Program',
      evidence: 'Automation and AI have reduced demand by 60%. Placement rate is below acceptable threshold (22%).',
      impact: 'Strategic Resource Reallocation',
      priority: 'Urgent'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <GraduationCap className="text-purple-600" />
            Curriculum Intelligence
          </h1>
          <p className="text-sm text-slate-500 mt-1">Monitor course health and industry alignment</p>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-100 text-emerald-600 rounded-lg"><CheckCircle2 size={24} /></div>
          <div>
            <div className="text-sm text-slate-500 font-medium">Healthy Courses</div>
            <div className="text-2xl font-bold text-slate-900">142</div>
            <div className="text-xs text-emerald-600 font-medium mt-1">Alignment Score &gt; 80%</div>
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-amber-100 text-amber-600 rounded-lg"><RefreshCcw size={24} /></div>
          <div>
            <div className="text-sm text-slate-500 font-medium">Needs Update</div>
            <div className="text-2xl font-bold text-slate-900">48</div>
            <div className="text-xs text-amber-600 font-medium mt-1">Alignment Score 50-80%</div>
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-rose-100 text-rose-600 rounded-lg"><AlertTriangle size={24} /></div>
          <div>
            <div className="text-sm text-slate-500 font-medium">Critical / Sunset Risk</div>
            <div className="text-2xl font-bold text-slate-900">12</div>
            <div className="text-xs text-rose-600 font-medium mt-1">Alignment Score &lt; 50%</div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recommendation Engine */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="p-5 border-b border-slate-200 bg-slate-50">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <RefreshCcw size={18} className="text-blue-600" />
              Kaizen Action Engine
            </h2>
            <p className="text-sm text-slate-500 mt-1">Evidence-based curriculum update recommendations</p>
          </div>
          <div className="p-5 flex-1 space-y-4">
            {recommendations.map((rec, i) => (
              <div key={i} className="border border-slate-200 rounded-lg p-4 bg-slate-50 hover:bg-white hover:shadow-md transition-all">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                      rec.action === 'ADD MODULE' ? 'bg-emerald-100 text-emerald-700' :
                      rec.action === 'REMOVE MODULE' ? 'bg-amber-100 text-amber-700' :
                      'bg-rose-100 text-rose-700'
                    }`}>
                      {rec.action}
                    </span>
                    <span className="text-sm font-bold text-slate-800">{rec.target}</span>
                  </div>
                  <span className={`text-xs font-bold ${rec.priority === 'Urgent' ? 'text-rose-600' : 'text-amber-600'}`}>
                    {rec.priority}
                  </span>
                </div>
                <div className="text-xs font-medium text-slate-500 mb-2">Course: {rec.course}</div>
                <div className="text-sm text-slate-600 bg-white p-3 border border-slate-100 rounded mb-3 shadow-sm">
                  <span className="font-semibold text-slate-700 text-xs uppercase tracking-wide block mb-1">Evidence:</span>
                  {rec.evidence}
                </div>
                <div className="flex justify-between items-center mt-4">
                  <div className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-1 rounded">
                    Impact: {rec.impact}
                  </div>
                  <button className="flex items-center gap-1 text-sm font-semibold text-white bg-slate-900 px-3 py-1.5 rounded hover:bg-slate-800 transition-colors">
                    Review <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Course Directory */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="p-5 border-b border-slate-200 flex justify-between items-center">
            <h2 className="text-lg font-bold text-slate-800">Course Portfolio Health</h2>
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
              <input type="text" placeholder="Search..." className="pl-8 pr-3 py-1.5 border border-slate-300 rounded text-sm w-48 outline-none focus:border-blue-500" />
            </div>
          </div>
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-600 text-xs font-semibold uppercase">
                <tr>
                  <th className="px-5 py-3">Course</th>
                  <th className="px-5 py-3 text-center">Alignment Score</th>
                  <th className="px-5 py-3 text-center">Placement</th>
                  <th className="px-5 py-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {courses.map((course, i) => (
                  <tr key={i} className="hover:bg-slate-50">
                    <td className="px-5 py-4">
                      <div className="font-bold text-slate-800">{course.name}</div>
                      <div className="text-xs text-slate-500 mt-0.5">{course.id} • {course.enrolled.toLocaleString()} enrolled</div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <span className="font-bold w-6">{course.alignmentScore}</span>
                        <div className="w-16 h-1.5 bg-slate-200 rounded-full">
                          <div className={`h-1.5 rounded-full ${
                            course.alignmentScore >= 80 ? 'bg-emerald-500' :
                            course.alignmentScore >= 50 ? 'bg-amber-500' : 'bg-rose-500'
                          }`} style={{ width: `${course.alignmentScore}%` }}></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-center font-semibold text-slate-700">
                      {course.placementRate}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider inline-block ${
                        course.status === 'Healthy' ? 'bg-emerald-100 text-emerald-700' :
                        course.status === 'Needs Update' ? 'bg-amber-100 text-amber-700' :
                        'bg-rose-100 text-rose-700'
                      }`}>
                        {course.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-3 border-t border-slate-200 bg-slate-50 text-center">
            <button className="text-sm font-semibold text-blue-600 hover:text-blue-800">View All 204 Courses</button>
          </div>
        </div>
      </div>
    </div>
  );
}
