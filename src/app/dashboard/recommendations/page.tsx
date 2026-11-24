'use client';

import { Settings, Zap, ShieldAlert, BookOpen } from 'lucide-react';

export default function RecommendationsPage() {
  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Settings className="text-blue-600" />
          Recommendation Center
        </h1>
        <p className="text-sm text-slate-500 mt-1">Aggregated platform insights requiring action</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
         <div className="bg-white border border-rose-200 rounded-xl p-6 shadow-sm shadow-rose-100">
            <div className="flex items-center gap-2 mb-4">
               <ShieldAlert className="text-rose-600" />
               <h2 className="text-lg font-bold text-rose-900">Critical Actions</h2>
            </div>
            <div className="space-y-4">
               <div className="p-4 bg-rose-50 rounded-lg border border-rose-100">
                  <h3 className="font-bold text-rose-800 mb-1">Sunset "Basic Data Entry" Course</h3>
                  <p className="text-sm text-rose-700/80 mb-3">Placement rate dropped to 18%. Industry demand down 60%.</p>
                  <button className="bg-rose-600 text-white px-4 py-2 rounded text-sm font-semibold hover:bg-rose-700">Review Evidence & Execute</button>
               </div>
            </div>
         </div>

         <div className="bg-white border border-blue-200 rounded-xl p-6 shadow-sm shadow-blue-100">
            <div className="flex items-center gap-2 mb-4">
               <Zap className="text-blue-600" />
               <h2 className="text-lg font-bold text-blue-900">Curriculum Enhancements</h2>
            </div>
            <div className="space-y-4">
               <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                  <h3 className="font-bold text-blue-800 mb-1">Add "Next.js" to Web Dev</h3>
                  <p className="text-sm text-blue-700/80 mb-3">High industry demand. Missing from current syllabus.</p>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded text-sm font-semibold hover:bg-blue-700">View Proposed Syllabus</button>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
