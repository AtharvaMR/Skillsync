'use client';

import { Briefcase, TrendingUp, Search } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function LabourMarketPage() {
  const jobTrends = [
    { month: 'Jan', jobs: 120000 },
    { month: 'Mar', jobs: 145000 },
    { month: 'May', jobs: 135000 },
    { month: 'Jul', jobs: 180000 },
    { month: 'Sep', jobs: 210000 },
  ];

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Briefcase className="text-blue-600" />
          Labour Market Intelligence
        </h1>
        <p className="text-sm text-slate-500 mt-1">Macro-level employment and sector trends</p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
         <h2 className="text-lg font-bold mb-4">Total Active Job Postings Trend</h2>
         <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
               <AreaChart data={jobTrends}>
                  <defs>
                     <linearGradient id="colorJobs" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                     </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip />
                  <Area type="monotone" dataKey="jobs" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorJobs)" />
               </AreaChart>
            </ResponsiveContainer>
         </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
         <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <h2 className="text-lg font-bold mb-4">Top Hiring Sectors</h2>
            <div className="space-y-4">
               {[
                  { sector: 'IT / Software', share: 35 },
                  { sector: 'BFSI', share: 22 },
                  { sector: 'Manufacturing', share: 18 },
                  { sector: 'Healthcare', share: 12 },
               ].map((s, i) => (
                  <div key={i}>
                     <div className="flex justify-between text-sm mb-1 font-medium">
                        <span>{s.sector}</span>
                        <span>{s.share}%</span>
                     </div>
                     <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div className="bg-blue-500 h-full" style={{width: `${s.share}%`}}></div>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </div>
    </div>
  );
}
