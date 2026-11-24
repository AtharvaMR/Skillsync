'use client';

import { BarChart3, Search, Filter, TrendingUp, TrendingDown, Info, ChevronDown } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';

export default function SkillsIntelligencePage() {
  const skillTrendData = [
    { month: 'Oct', 'AI/ML': 45, 'Cloud': 62, 'Cyber': 40, 'Web3': 20 },
    { month: 'Dec', 'AI/ML': 58, 'Cloud': 64, 'Cyber': 45, 'Web3': 18 },
    { month: 'Feb', 'AI/ML': 72, 'Cloud': 68, 'Cyber': 48, 'Web3': 15 },
    { month: 'Apr', 'AI/ML': 85, 'Cloud': 71, 'Cyber': 55, 'Web3': 12 },
    { month: 'Jun', 'AI/ML': 92, 'Cloud': 74, 'Cyber': 60, 'Web3': 10 },
    { month: 'Aug', 'AI/ML': 98, 'Cloud': 76, 'Cyber': 65, 'Web3': 8 },
    { month: 'Oct', 'AI/ML': 115, 'Cloud': 79, 'Cyber': 70, 'Web3': 5 },
  ];

  const topSkills = [
    { name: 'Generative AI', demandScore: 98, trend: '+142%', category: 'Emerging Tech', gap: 'High' },
    { name: 'Cloud Architecture (AWS/Azure)', demandScore: 92, trend: '+45%', category: 'Infrastructure', gap: 'Medium' },
    { name: 'Data Engineering', demandScore: 88, trend: '+60%', category: 'Data & Analytics', gap: 'High' },
    { name: 'Cybersecurity Operations', demandScore: 85, trend: '+55%', category: 'Security', gap: 'Critical' },
    { name: 'Full Stack Next.js', demandScore: 82, trend: '+30%', category: 'Software Dev', gap: 'Low' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <BarChart3 className="text-blue-600" />
            Skill Intelligence
          </h1>
          <p className="text-sm text-slate-500 mt-1">Real-time analysis of labour market skill demands</p>
        </div>
        
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Search skills..." 
              className="pl-9 pr-4 py-2 border border-slate-300 rounded-md text-sm outline-none focus:ring-2 focus:ring-blue-500 w-64 bg-white shadow-sm"
            />
          </div>
          <button className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-300 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-50 shadow-sm">
            <Filter size={16} /> Filters
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Tracked Skills', value: '1,452', sub: 'Across 24 sectors' },
          { label: 'High Demand Skills', value: '128', sub: 'Demand score > 80' },
          { label: 'Critical Gap Skills', value: '45', sub: 'Supply < 30% of demand' },
          { label: 'Declining Skills', value: '86', sub: 'Negative 12m growth' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <div className="text-sm font-medium text-slate-500 mb-1">{stat.label}</div>
            <div className="text-2xl font-bold text-slate-900 mb-1">{stat.value}</div>
            <div className="text-xs text-slate-400">{stat.sub}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-slate-800">Macro Skill Category Trends</h2>
            <button className="text-sm text-blue-600 font-medium hover:underline flex items-center gap-1">
              View Detailed Report <ChevronDown size={14} className="-rotate-90" />
            </button>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={skillTrendData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }} />
                <Legend iconType="circle" />
                <Line type="monotone" dataKey="AI/ML" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="Cloud" stroke="#10b981" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="Cyber" stroke="#f59e0b" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="Web3" stroke="#ef4444" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-slate-800">Supply-Demand Gap</h2>
            <Info size={16} className="text-slate-400" />
          </div>
          
          <div className="flex-1 space-y-6">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="font-semibold text-slate-700">Cybersecurity Operations</span>
                <span className="text-rose-600 font-bold">Critical Gap</span>
              </div>
              <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden flex">
                <div className="bg-blue-500 h-full w-[25%]" title="Supply: 25%"></div>
                <div className="bg-rose-100 h-full w-[75%]" title="Unmet Demand: 75%"></div>
              </div>
              <div className="flex justify-between text-xs mt-1 text-slate-500">
                <span>Supply: 12k</span>
                <span>Demand: 48k</span>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="font-semibold text-slate-700">Data Engineering</span>
                <span className="text-rose-600 font-bold">Critical Gap</span>
              </div>
              <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden flex">
                <div className="bg-blue-500 h-full w-[35%]" title="Supply: 35%"></div>
                <div className="bg-rose-100 h-full w-[65%]" title="Unmet Demand: 65%"></div>
              </div>
              <div className="flex justify-between text-xs mt-1 text-slate-500">
                <span>Supply: 28k</span>
                <span>Demand: 80k</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="font-semibold text-slate-700">Basic Data Entry</span>
                <span className="text-amber-600 font-bold">Oversupply</span>
              </div>
              <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden flex">
                <div className="bg-amber-500 h-full w-[100%]" title="Supply > Demand"></div>
              </div>
              <div className="flex justify-between text-xs mt-1 text-slate-500">
                <span>Supply: 150k</span>
                <span>Demand: 40k</span>
              </div>
            </div>
          </div>
          
          <button className="w-full mt-6 bg-slate-50 border border-slate-200 text-slate-700 py-2 rounded-md text-sm font-semibold hover:bg-slate-100 transition-colors">
            Generate Gap Report
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-lg font-bold text-slate-800">Top Skills by Demand Score</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-700 text-xs uppercase font-semibold">
              <tr>
                <th className="px-6 py-4">Skill Name</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Demand Score</th>
                <th className="px-6 py-4">YoY Growth</th>
                <th className="px-6 py-4">Gap Status</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {topSkills.map((skill, idx) => (
                <tr key={idx} className="hover:bg-slate-50">
                  <td className="px-6 py-4 font-semibold text-slate-900">{skill.name}</td>
                  <td className="px-6 py-4">
                    <span className="bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full text-xs font-medium">
                      {skill.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-full max-w-[100px] bg-slate-200 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${skill.demandScore}%` }}></div>
                      </div>
                      <span className="font-bold">{skill.demandScore}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="flex items-center text-emerald-600 font-medium gap-1">
                      <TrendingUp size={14} /> {skill.trend}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                      skill.gap === 'Critical' ? 'bg-rose-100 text-rose-700' : 
                      skill.gap === 'High' ? 'bg-amber-100 text-amber-700' : 
                      'bg-emerald-100 text-emerald-700'
                    }`}>
                      {skill.gap}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-blue-600 hover:text-blue-800 font-medium text-xs border border-blue-200 px-3 py-1.5 rounded bg-blue-50 hover:bg-blue-100 transition-colors">
                      View Details
                    </button>
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
