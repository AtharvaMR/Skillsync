'use client';

import { Briefcase, PieChart as PieChartIcon, TrendingUp, AlertCircle, FileText } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

export default function OutcomesPage() {
  const pieData = [
    { name: 'Placed in Core Sector', value: 45 },
    { name: 'Placed in Other Sector', value: 20 },
    { name: 'Self Employed', value: 15 },
    { name: 'Higher Education', value: 10 },
    { name: 'Unemployed', value: 10 },
  ];
  
  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6', '#ef4444'];

  const wageData = [
    { month: 'Month 1', wage: 15000 },
    { month: 'Month 3', wage: 16500 },
    { month: 'Month 6', wage: 18000 },
    { month: 'Month 12', wage: 22000 },
  ];

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Briefcase className="text-blue-600" />
          Employment Outcomes
        </h1>
        <p className="text-sm text-slate-500 mt-1">Track long-term placement and retention metrics</p>
      </div>

      <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm overflow-x-auto">
        <h2 className="text-lg font-bold mb-6 text-center">National Skill Development Funnel</h2>
        <div className="flex justify-between items-center min-w-[800px] max-w-5xl mx-auto">
          {[
            { label: 'Enrolled', val: '1.2M', rate: '100%' },
            { label: 'Completed', val: '950K', rate: '79%' },
            { label: 'Certified', val: '880K', rate: '73%' },
            { label: 'Placed', val: '610K', rate: '51%' },
            { label: 'Retained 6m', val: '450K', rate: '37%' },
          ].map((step, i, arr) => (
            <div key={i} className="flex flex-col items-center relative flex-1">
              <div className="w-24 h-24 rounded-full bg-slate-50 border-4 border-blue-500 flex flex-col items-center justify-center z-10 bg-white">
                <span className="font-bold text-lg text-slate-900">{step.val}</span>
                <span className="text-xs text-blue-600 font-bold">{step.rate}</span>
              </div>
              <div className="mt-4 font-semibold text-slate-700 text-sm">{step.label}</div>
              {i < arr.length - 1 && (
                <div className="absolute top-12 left-[50%] w-full h-1 bg-slate-200 -z-10">
                  <div className="h-full bg-blue-500" style={{width: '100%'}}></div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center">
          <h3 className="font-bold text-lg self-start mb-4">Post-Training Status</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap gap-4 justify-center mt-4">
             {pieData.map((d, i) => (
                <div key={i} className="flex items-center gap-2 text-xs font-medium text-slate-600">
                   <div className="w-3 h-3 rounded-full" style={{backgroundColor: COLORS[i]}}></div>
                   {d.name} ({d.value}%)
                </div>
             ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-lg mb-4">Average Wage Progression (INR)</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={wageData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip cursor={{fill: '#f1f5f9'}} />
                <Bar dataKey="wage" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
