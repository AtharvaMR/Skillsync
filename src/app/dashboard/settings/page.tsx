import { ArrowRight, Settings as SettingsIcon, Save, User, Bell, Lock, Database } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="max-w-4xl space-y-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <SettingsIcon className="text-slate-600" />
          Settings & Configuration
        </h1>
        <p className="text-sm text-slate-500 mt-1">Manage platform preferences and demo mode</p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="border-b border-slate-200 p-6">
          <h2 className="text-lg font-bold flex items-center gap-2"><User size={20}/> Profile Settings</h2>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
              <input type="text" defaultValue="Government Admin" className="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:border-blue-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
              <input type="email" defaultValue="admin@skillsync.gov.in" disabled className="w-full border border-slate-200 bg-slate-50 rounded px-3 py-2 text-sm text-slate-500" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Role / Designation</label>
            <input type="text" defaultValue="Director, Skill Development" className="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:border-blue-500 outline-none" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-indigo-200 shadow-sm overflow-hidden">
        <div className="border-b border-indigo-100 p-6 bg-indigo-50 flex justify-between items-center">
          <h2 className="text-lg font-bold text-indigo-900 flex items-center gap-2"><Database size={20}/> System Environment</h2>
          <span className="bg-indigo-200 text-indigo-800 text-xs px-2 py-1 rounded font-bold uppercase tracking-wider">Demo Mode Active</span>
        </div>
        <div className="p-6">
          <p className="text-sm text-slate-600 mb-4">
            The platform is currently running in DEMO MODE. All data presented in dashboards, including labour market intelligence, placement rates, and candidate details, are simulated for demonstration purposes.
          </p>
          <div className="flex gap-4 items-center">
             <button className="bg-slate-200 text-slate-400 font-semibold px-4 py-2 rounded text-sm cursor-not-allowed">
               Connect Live Database
             </button>
             <span className="text-xs text-slate-500">Requires production API keys</span>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
         <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg flex items-center gap-2 transition-colors">
            <Save size={18} /> Save Changes
         </button>
      </div>
    </div>
  );
}
