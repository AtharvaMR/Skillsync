import { ArrowRight, CheckCircle, Clock } from 'lucide-react';
import Link from 'next/link';

export default function KaizenLoopPage() {
  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          Kaizen Improvement Loop
        </h1>
        <p className="text-sm text-slate-500 mt-1">Automated Plan-Do-Check-Act cycle for curriculum evolution</p>
      </div>

      <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm mb-6 text-center">
         <h2 className="text-xl font-bold mb-4">Current Cycle Status: Evaluating Impact</h2>
         <div className="flex justify-center items-center gap-4 mb-8">
            <div className="flex flex-col items-center gap-2">
               <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center border-2 border-emerald-500 shadow-sm"><CheckCircle size={24}/></div>
               <span className="text-xs font-bold text-slate-700">1. Data Ingestion</span>
            </div>
            <div className="w-16 h-1 bg-emerald-500"></div>
            <div className="flex flex-col items-center gap-2">
               <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center border-2 border-emerald-500 shadow-sm"><CheckCircle size={24}/></div>
               <span className="text-xs font-bold text-slate-700">2. Intelligence</span>
            </div>
            <div className="w-16 h-1 bg-emerald-500"></div>
            <div className="flex flex-col items-center gap-2">
               <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center border-2 border-blue-500 shadow-sm animate-pulse"><Clock size={24}/></div>
               <span className="text-xs font-bold text-slate-700">3. Action Engine</span>
            </div>
            <div className="w-16 h-1 bg-slate-200"></div>
            <div className="flex flex-col items-center gap-2">
               <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center border-2 border-slate-200"><ArrowRight size={24}/></div>
               <span className="text-xs font-bold text-slate-700">4. Outcome Check</span>
            </div>
         </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-lg mb-4">Pending Interventions</h3>
          <ul className="space-y-4">
             <li className="border-l-4 border-amber-500 pl-4 py-2">
                <p className="font-semibold text-sm">Update AI Curriculum</p>
                <p className="text-xs text-slate-500 mt-1">Pending approval from NSDC council.</p>
             </li>
             <li className="border-l-4 border-amber-500 pl-4 py-2">
                <p className="font-semibold text-sm">Trainer Upskilling Campaign</p>
                <p className="text-xs text-slate-500 mt-1">Scheduling Phase for 150 trainers in Cyber.</p>
             </li>
          </ul>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-lg mb-4">Completed Cycle Impacts</h3>
          <ul className="space-y-4">
             <li className="border-l-4 border-emerald-500 pl-4 py-2 bg-slate-50">
                <p className="font-semibold text-sm">Next.js Integration in Web Dev</p>
                <p className="text-xs text-emerald-600 font-bold mt-1">Result: +18% Placement Rate</p>
             </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
