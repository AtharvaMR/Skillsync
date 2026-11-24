'use client';

import { GraduationCap, ArrowRight, Layers } from 'lucide-react';

export default function CurriculumAlignmentPage() {
  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Layers className="text-purple-600" />
          Curriculum Alignment
        </h1>
        <p className="text-sm text-slate-500 mt-1">Map course modules directly to industry requirements</p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
         <h2 className="text-lg font-bold mb-6">Alignment Matrix: Advanced Web Development</h2>
         
         <div className="space-y-6">
            <div className="grid grid-cols-12 gap-4 items-center bg-slate-50 p-4 rounded-lg border border-slate-200">
               <div className="col-span-4 font-bold text-slate-800">Current Module</div>
               <div className="col-span-1 text-center"><ArrowRight className="mx-auto text-slate-400" /></div>
               <div className="col-span-4 font-bold text-slate-800">Industry Requirement</div>
               <div className="col-span-3 font-bold text-slate-800 text-center">Status</div>
            </div>

            <div className="grid grid-cols-12 gap-4 items-center p-2 border-b border-slate-100">
               <div className="col-span-4 text-sm font-medium">React Basics</div>
               <div className="col-span-1 text-center"><ArrowRight className="mx-auto text-slate-300" /></div>
               <div className="col-span-4 text-sm text-slate-600">Frontend Frameworks</div>
               <div className="col-span-3 text-center"><span className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded text-xs font-bold">Aligned</span></div>
            </div>

            <div className="grid grid-cols-12 gap-4 items-center p-2 border-b border-slate-100">
               <div className="col-span-4 text-sm font-medium text-rose-500 line-through">jQuery UI</div>
               <div className="col-span-1 text-center"><ArrowRight className="mx-auto text-slate-300" /></div>
               <div className="col-span-4 text-sm text-slate-600 italic">No longer requested</div>
               <div className="col-span-3 text-center"><span className="bg-rose-100 text-rose-700 px-2 py-1 rounded text-xs font-bold">Remove</span></div>
            </div>

            <div className="grid grid-cols-12 gap-4 items-center p-2 border-b border-slate-100 bg-blue-50/50">
               <div className="col-span-4 text-sm font-medium italic text-blue-600">Missing Module</div>
               <div className="col-span-1 text-center"><ArrowRight className="mx-auto text-blue-300" /></div>
               <div className="col-span-4 text-sm font-semibold text-slate-800">Next.js / SSR</div>
               <div className="col-span-3 text-center"><span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-bold">Add</span></div>
            </div>
         </div>
         
         <div className="mt-8 flex justify-end">
            <button className="bg-purple-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-purple-700 transition-colors">
               Generate Syllabus Update Proposal
            </button>
         </div>
      </div>
    </div>
  );
}
