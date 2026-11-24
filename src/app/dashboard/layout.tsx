import Link from 'next/link';
import { Home, BarChart3, GraduationCap, Briefcase, Building2, Users, Settings, Database, Server, RefreshCw } from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar Placeholder */}
      <div className="w-64 bg-slate-900 text-slate-300 flex flex-col h-full flex-shrink-0">
        <div className="h-16 flex items-center px-6 border-b border-slate-800 text-white font-bold text-xl gap-2">
          <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center text-sm">S</div>
          SkillSync
        </div>
        <div className="flex-1 overflow-y-auto py-4">
          <nav className="space-y-1 px-3">
            {[
              { href: '/dashboard', icon: Home, label: 'Overview' },
              { href: '/dashboard/skills', icon: BarChart3, label: 'Skill Intelligence' },
              { href: '/dashboard/courses', icon: GraduationCap, label: 'Courses & Curriculum' },
              { href: '/dashboard/outcomes', icon: Briefcase, label: 'Employment Outcomes' },
              { href: '/dashboard/employers', icon: Building2, label: 'Employer Network' },
              { href: '/dashboard/candidates', icon: Users, label: 'Candidates' },
              { href: '/dashboard/districts', icon: BarChart3, label: 'District Intelligence' },
              { href: '/dashboard/trainers', icon: GraduationCap, label: 'Trainers' },
              { href: '/dashboard/equipment', icon: Server, label: 'Equipment' },
              { href: '/dashboard/recommendations', icon: Settings, label: 'Recommendations' },
              { href: '/dashboard/kaizen', icon: RefreshCw, label: 'Kaizen Loop' },
              { href: '/dashboard/reports', icon: BarChart3, label: 'Reports' },
              { href: '/dashboard/data-sources', icon: Database, label: 'Data Sources' },
              { href: '/dashboard/labour-market', icon: Briefcase, label: 'Labour Market' },
              { href: '/dashboard/curriculum', icon: GraduationCap, label: 'Curriculum Align' },
              { href: '/dashboard/settings', icon: Settings, label: 'Settings' },
            ].map((item, i) => (
              <Link key={i} href={item.href} className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-slate-800 hover:text-white text-sm font-medium transition-colors">
                <item.icon size={18} />
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Topbar Placeholder */}
        <div className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 flex-shrink-0 z-10 shadow-sm">
          <div className="font-semibold text-slate-800">SkillSync Workspace</div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium text-slate-600 hover:text-slate-900">Sign Out</Link>
            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold border border-indigo-200">
              GA
            </div>
          </div>
        </div>

        {/* Demo Banner Placeholder */}
        <div className="bg-indigo-50 border-b border-indigo-100 px-6 py-2 text-sm text-indigo-800 flex items-center gap-2 flex-shrink-0 font-medium">
          <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></div>
          DEMO ENVIRONMENT - Showing mock data for demonstration purposes
        </div>

        {/* Main Content */}
        <main className="flex-1 overflow-auto p-6 bg-slate-50 relative">
          {children}
        </main>
      </div>
    </div>
  );
}
