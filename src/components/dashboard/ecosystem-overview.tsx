'use client';

import { BarChart3, TrendingUp, BookOpen, Building, AlertCircle, Briefcase } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from 'recharts';

export function EcosystemOverview() {
  const kpis = [
    { label: 'Placement Rate', value: '72.5%', trend: '+3.2%', icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-100' },
    { label: 'Employment Rate', value: '65.0%', trend: '+2.8%', icon: Briefcase, color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'Skill Match', value: '68.3%', trend: '+5.1%', icon: BarChart3, color: 'text-indigo-600', bg: 'bg-indigo-100' },
    { label: 'Course Health', value: '74.2%', trend: '+1.5%', icon: BookOpen, color: 'text-purple-600', bg: 'bg-purple-100' },
    { label: 'Employer Satisfaction', value: '78.0%', trend: '+4.3%', icon: Building, color: 'text-amber-600', bg: 'bg-amber-100' },
  ];

  const skillTrendData = [
    { month: 'Oct', 'Generative AI': 45, Cloud: 62, Data: 58, Cyber: 40 },
    { month: 'Nov', 'Generative AI': 52, Cloud: 65, Data: 60, Cyber: 42 },
    { month: 'Dec', 'Generative AI': 58, Cloud: 64, Data: 61, Cyber: 45 },
    { month: 'Jan', 'Generative AI': 65, Cloud: 66, Data: 63, Cyber: 47 },
    { month: 'Feb', 'Generative AI': 72, Cloud: 68, Data: 64, Cyber: 48 },
    { month: 'Mar', 'Generative AI': 80, Cloud: 70, Data: 65, Cyber: 52 },
    { month: 'Apr', 'Generative AI': 85, Cloud: 71, Data: 66, Cyber: 55 },
    { month: 'May', 'Generative AI': 88, Cloud: 73, Data: 65, Cyber: 58 },
    { month: 'Jun', 'Generative AI': 92, Cloud: 74, Data: 68, Cyber: 60 },
    { month: 'Jul', 'Generative AI': 95, Cloud: 75, Data: 69, Cyber: 63 },
    { month: 'Aug', 'Generative AI': 98, Cloud: 76, Data: 70, Cyber: 65 },
    { month: 'Sep', 'Generative AI': 100, Cloud: 78, Data: 72, Cyber: 68 },
  ];

  const placementData = [
    { month: 'Oct', placed: 4200, retained: 3800 },
    { month: 'Nov', placed: 4500, retained: 3900 },
    { month: 'Dec', placed: 4800, retained: 4100 },
    { month: 'Jan', placed: 5100, retained: 4400 },
    { month: 'Feb', placed: 5400, retained: 4600 },
    { month: 'Mar', placed: 5800, retained: 4900 },
    { month: 'Apr', placed: 6200, retained: 5200 },
    { month: 'May', placed: 6500, retained: 5500 },
    { month: 'Jun', placed: 6800, retained: 5800 },
    { month: 'Jul', placed: 7200, retained: 6100 },
    { month: 'Aug', placed: 7500, retained: 6400 },
    { month: 'Sep', placed: 8000, retained: 6800 },
  ];

  const emergingSkills = [
    { name: 'Prompt Engineering', growth: '+142%', category: 'AI/ML' },
    { name: 'Rust Programming', growth: '+85%', category: 'Software' },
    { name: 'Cloud Cost Optimization', growth: '+64%', category: 'Cloud' },
    { name: 'EV Battery Management', growth: '+112%', category: 'Automotive' },
    { name: 'Green Hydrogen Ops', growth: '+95%', category: 'Energy' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Ecosystem Overview</h1>
          <p className="text-sm text-slate-500">Holistic view of skill development, curriculum alignment, and employment outcomes</p>
        </div>
        <div className="flex items-center gap-2 bg-white border border-slate-200 px-3 py-1.5 rounded-md text-sm font-medium text-slate-600 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          Curated MVP Dataset
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {kpis.map((kpi, i) => (
          <div key={i} className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex flex-col">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-2 rounded-lg ${kpi.bg} ${kpi.color}`}>
                <kpi.icon size={20} />
              </div>
              <span className="flex items-center text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                {kpi.trend}
              </span>
            </div>
            <h3 className="text-3xl font-bold text-slate-900 mb-1">{kpi.value}</h3>
            <p className="text-sm font-medium text-slate-500">{kpi.label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Skill Demand Trends</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={skillTrendData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                <Line type="monotone" dataKey="Generative AI" stroke="#3b82f6" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="Cloud" stroke="#10b981" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="Data" stroke="#f59e0b" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="Cyber" stroke="#8b5cf6" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Placement & Retention</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={placementData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                <Area type="monotone" dataKey="placed" name="Placed (30 days)" stroke="#3b82f6" fill="#dbeafe" />
                <Area type="monotone" dataKey="retained" name="Retained (6 months)" stroke="#10b981" fill="#d1fae5" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 lg:col-span-1">
          <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
            <TrendingUp size={20} className="text-blue-600" /> Hyper-Growth Skills
          </h3>
          <div className="space-y-3">
            {emergingSkills.map((skill, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-100">
                <div>
                  <div className="font-semibold text-slate-800 text-sm">{skill.name}</div>
                  <div className="text-xs text-slate-500 mt-0.5">{skill.category}</div>
                </div>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-1 rounded">
                  {skill.growth}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 lg:col-span-2">
          <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
            <AlertCircle size={20} className="text-amber-500" /> Kaizen Recommendations
          </h3>
          <div className="space-y-3">
            {[
              { title: 'Add TypeScript & REST API Testing to Web Dev', desc: 'Regional employer feedback highlights TypeScript and API error-handling gaps among freshers.', type: 'Curriculum' },
              { title: 'Equipment Upgrade in Hubballi EV Lab', desc: 'BMS diagnostic tooling needed for 20-week EV & Battery Technician cohort.', type: 'Infrastructure' },
              { title: 'Trainer Upskilling in Cloud Security', desc: 'Align trainer competencies with updated cybersecurity operations syllabus.', type: 'Trainer' },
            ].map((rec, i) => (
              <div key={i} className="p-4 rounded-lg border border-slate-200">
                <div className="flex justify-between items-start gap-2">
                  <h4 className="font-bold text-slate-800 text-sm">{rec.title}</h4>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600">{rec.type}</span>
                </div>
                <p className="text-sm text-slate-600 mt-1">{rec.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
