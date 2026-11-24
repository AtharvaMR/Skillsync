'use client';

import { BarChart3, TrendingUp, Users, BookOpen, Building, AlertCircle, CheckCircle2, RefreshCw } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from 'recharts';

export default function DashboardPage() {
  const kpis = [
    { label: 'Placement Rate', value: '72.5%', trend: '+3.2%', icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-100' },
    { label: 'Employment Rate', value: '65.0%', trend: '+2.8%', icon: BriefcaseIcon, color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'Skill Match', value: '68.3%', trend: '+5.1%', icon: BarChart3, color: 'text-indigo-600', bg: 'bg-indigo-100' },
    { label: 'Course Health', value: '74.2%', trend: '+1.5%', icon: BookOpen, color: 'text-purple-600', bg: 'bg-purple-100' },
    { label: 'Employer Satisfaction', value: '78.0%', trend: '+4.3%', icon: Building, color: 'text-amber-600', bg: 'bg-amber-100' },
  ];

  const skillTrendData = [
    { month: 'Oct', 'Generative AI': 45, 'Cloud': 62, 'Data': 58, 'Cyber': 40 },
    { month: 'Nov', 'Generative AI': 52, 'Cloud': 65, 'Data': 60, 'Cyber': 42 },
    { month: 'Dec', 'Generative AI': 58, 'Cloud': 64, 'Data': 61, 'Cyber': 45 },
    { month: 'Jan', 'Generative AI': 65, 'Cloud': 66, 'Data': 63, 'Cyber': 47 },
    { month: 'Feb', 'Generative AI': 72, 'Cloud': 68, 'Data': 64, 'Cyber': 48 },
    { month: 'Mar', 'Generative AI': 80, 'Cloud': 70, 'Data': 65, 'Cyber': 52 },
    { month: 'Apr', 'Generative AI': 85, 'Cloud': 71, 'Data': 66, 'Cyber': 55 },
    { month: 'May', 'Generative AI': 88, 'Cloud': 73, 'Data': 65, 'Cyber': 58 },
    { month: 'Jun', 'Generative AI': 92, 'Cloud': 74, 'Data': 68, 'Cyber': 60 },
    { month: 'Jul', 'Generative AI': 95, 'Cloud': 75, 'Data': 69, 'Cyber': 63 },
    { month: 'Aug', 'Generative AI': 98, 'Cloud': 76, 'Data': 70, 'Cyber': 65 },
    { month: 'Sep', 'Generative AI': 100, 'Cloud': 78, 'Data': 72, 'Cyber': 68 },
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Government Overview</h1>
          <p className="text-sm text-slate-500">Holistic view of skill development ecosystem</p>
        </div>
        <div className="flex items-center gap-2 bg-white border border-slate-200 px-3 py-1.5 rounded-md text-sm font-medium text-slate-600 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          Data synced: 2 hours ago
        </div>
      </div>

      {/* KPI Row */}
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

      {/* Charts Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Skill Demand Trends */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-slate-900">Skill Demand Trends</h3>
            <select className="text-sm border border-slate-200 rounded-md px-2 py-1 bg-slate-50 text-slate-700 outline-none">
              <option>Last 12 Months</option>
              <option>Last 6 Months</option>
            </select>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={skillTrendData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                <Line type="monotone" dataKey="Generative AI" stroke="#3b82f6" strokeWidth={2} dot={false} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="Cloud" stroke="#10b981" strokeWidth={2} dot={false} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="Data" stroke="#f59e0b" strokeWidth={2} dot={false} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="Cyber" stroke="#8b5cf6" strokeWidth={2} dot={false} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Placement Trends */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-slate-900">Placement & Retention</h3>
            <select className="text-sm border border-slate-200 rounded-md px-2 py-1 bg-slate-50 text-slate-700 outline-none">
              <option>National Level</option>
              <option>State Level</option>
            </select>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={placementData}>
                <defs>
                  <linearGradient id="colorPlaced" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorRetained" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                <Area type="monotone" dataKey="placed" name="Placed (30 days)" stroke="#3b82f6" fillOpacity={1} fill="url(#colorPlaced)" />
                <Area type="monotone" dataKey="retained" name="Retained (6 months)" stroke="#10b981" fillOpacity={1} fill="url(#colorRetained)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Third Row */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Emerging Skills List */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 lg:col-span-1">
          <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
            <TrendingUp size={20} className="text-blue-600" />
            Hyper-Growth Skills
          </h3>
          <div className="space-y-4">
            {emergingSkills.map((skill, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-100 hover:border-blue-200 transition-colors">
                <div>
                  <div className="font-semibold text-slate-800 text-sm">{skill.name}</div>
                  <div className="text-xs text-slate-500 mt-0.5">{skill.category}</div>
                </div>
                <div className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-100 px-2 py-1 rounded">
                  <TrendingUp size={12} /> {skill.growth}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actionable Insights / Recommendations */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 lg:col-span-2">
          <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
            <AlertCircle size={20} className="text-amber-500" />
            Kaizen Recommendations
          </h3>
          <div className="space-y-4">
            {[
              { title: 'Update "Web Dev Fundamentals" Course', desc: 'Industry demand for React has shifted to Next.js. Course has 42% placement rate vs 78% for Next.js skilled candidates.', type: 'Curriculum', priority: 'High', color: 'rose' },
              { title: 'Equipment Gap in Pune District', desc: '5 CNC Machine Operator institutes in Pune lack latest 5-axis machines required by local auto manufacturers.', type: 'Infrastructure', priority: 'Medium', color: 'amber' },
              { title: 'Trainer Upskilling Required', desc: '72 trainers in Cyber Security module need certification in Cloud Security (AWS/Azure) to match new syllabus.', type: 'Trainer', priority: 'High', color: 'rose' },
            ].map((rec, i) => (
              <div key={i} className="flex gap-4 p-4 rounded-lg border border-slate-200 hover:shadow-md transition-shadow">
                <div className={`mt-1 w-2 h-2 rounded-full bg-${rec.color}-500 flex-shrink-0`}></div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h4 className="font-bold text-slate-800 text-sm">{rec.title}</h4>
                    <span className="text-xs font-semibold px-2 py-1 rounded bg-slate-100 text-slate-600">{rec.type}</span>
                  </div>
                  <p className="text-sm text-slate-600 mt-1 mb-3">{rec.desc}</p>
                  <div className="flex gap-2">
                    <button className="text-xs font-medium bg-blue-50 text-blue-700 px-3 py-1.5 rounded hover:bg-blue-100 transition-colors">View Evidence</button>
                    <button className="text-xs font-medium bg-slate-800 text-white px-3 py-1.5 rounded hover:bg-slate-700 transition-colors">Initiate Action</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function BriefcaseIcon(props: any) {
  return <Briefcase {...props} />;
}
import { Briefcase } from 'lucide-react';
