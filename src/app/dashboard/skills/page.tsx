'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { BarChart3, Search, TrendingUp, ArrowRight } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface SkillRow {
  id: string;
  name: string;
  category: string;
  description: string;
  demandScore: number;
  growthRate: number;
  demandLevel: string;
  sector: string;
}

export default function SkillsIntelligencePage() {
  const [skills, setSkills] = useState<SkillRow[]>([]);
  const [search, setSearch] = useState('');
  const [demandFilter, setDemandFilter] = useState('');
  const [loading, setLoading] = useState(true);

  const skillTrendData = [
    { month: 'Oct', 'AI/ML': 45, Cloud: 62, Cyber: 40, Web3: 20 },
    { month: 'Dec', 'AI/ML': 58, Cloud: 64, Cyber: 45, Web3: 18 },
    { month: 'Feb', 'AI/ML': 72, Cloud: 68, Cyber: 48, Web3: 15 },
    { month: 'Apr', 'AI/ML': 85, Cloud: 71, Cyber: 55, Web3: 12 },
    { month: 'Jun', 'AI/ML': 92, Cloud: 74, Cyber: 60, Web3: 10 },
    { month: 'Aug', 'AI/ML': 98, Cloud: 76, Cyber: 65, Web3: 8 },
    { month: 'Oct', 'AI/ML': 115, Cloud: 79, Cyber: 70, Web3: 5 },
  ];

  const fetchSkills = async (q = search, level = demandFilter) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (q.trim()) params.set('search', q.trim());
      if (level) params.set('demandLevel', level);
      const res = await fetch(`/api/skills?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setSkills(Array.isArray(data) ? data : []);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;
    const params = new URLSearchParams();
    if (demandFilter) params.set('demandLevel', demandFilter);
    fetch(`/api/skills?${params.toString()}`)
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        if (active) setSkills(Array.isArray(data) ? data : []);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [demandFilter]);

  const highDemandCount = skills.filter((s) => s.demandLevel === 'high_demand' || s.demandLevel === 'emerging').length;
  const decliningCount = skills.filter((s) => s.demandLevel === 'declining' || s.growthRate < 0).length;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <BarChart3 className="text-blue-600" /> Skill Intelligence
          </h1>
          <p className="text-sm text-slate-600 mt-1">Curated labour-market skill demand, growth trajectories, and gap signals</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchSkills(search, demandFilter)}
              placeholder="Search skills..."
              className="pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-sm bg-white"
            />
          </div>
          <select
            value={demandFilter}
            onChange={(e) => setDemandFilter(e.target.value)}
            className="px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white"
          >
            <option value="">All Demand Levels</option>
            <option value="emerging">Emerging</option>
            <option value="high_demand">High Demand</option>
            <option value="stable">Stable</option>
            <option value="declining">Declining</option>
          </select>
          <button
            type="button"
            onClick={() => fetchSkills(search, demandFilter)}
            className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-semibold"
          >
            Search
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-xs font-semibold uppercase text-slate-500">Tracked Benchmark Skills</div>
          <div className="text-2xl font-bold text-slate-900 mt-1">{skills.length}</div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-xs font-semibold uppercase text-slate-500">High Demand / Emerging</div>
          <div className="text-2xl font-bold text-emerald-700 mt-1">{highDemandCount}</div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-xs font-semibold uppercase text-slate-500">Declining Demand</div>
          <div className="text-2xl font-bold text-amber-700 mt-1">{decliningCount}</div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-base font-bold text-slate-900">Macro Skill Category Trends (Curated Index)</h2>
          <Link href="/dashboard/reports" className="text-xs font-semibold text-blue-600 hover:underline inline-flex items-center gap-1">
            Export Snapshot <ArrowRight size={13} />
          </Link>
        </div>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={skillTrendData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
              <Tooltip />
              <Legend iconType="circle" />
              <Line type="monotone" dataKey="AI/ML" stroke="#3b82f6" strokeWidth={2.5} />
              <Line type="monotone" dataKey="Cloud" stroke="#10b981" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="Cyber" stroke="#f59e0b" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="Web3" stroke="#ef4444" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-200 flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900">Skills Catalog (SQLite)</h2>
          <Link href="/dashboard/curriculum" className="text-xs font-semibold text-blue-600 hover:underline">
            Align with Curriculum →
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600 text-xs uppercase font-semibold">
              <tr>
                <th className="px-5 py-3">Skill</th>
                <th className="px-5 py-3">Sector</th>
                <th className="px-5 py-3">Demand Score</th>
                <th className="px-5 py-3">Growth</th>
                <th className="px-5 py-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-5 py-6 text-center text-slate-500">Loading skills...</td>
                </tr>
              ) : (
                skills.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50">
                    <td className="px-5 py-3.5">
                      <div className="font-semibold text-slate-900">{s.name}</div>
                      <div className="text-xs text-slate-500">{s.description}</div>
                    </td>
                    <td className="px-5 py-3.5 text-xs text-slate-600">{s.sector}</td>
                    <td className="px-5 py-3.5 font-bold text-slate-900">{s.demandScore}/100</td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex items-center gap-1 text-xs font-semibold ${s.growthRate >= 0 ? 'text-emerald-700' : 'text-rose-600'}`}>
                        <TrendingUp size={13} /> {s.growthRate >= 0 ? `+${s.growthRate}%` : `${s.growthRate}%`}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 capitalize">
                        {s.demandLevel.replace('_', ' ')}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
