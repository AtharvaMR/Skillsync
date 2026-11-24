import Link from 'next/link';
import { ArrowRight, BarChart3, Briefcase, GraduationCap, Building2, Users, LineChart, RefreshCw, CheckCircle2 } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-slate-900 text-white sticky top-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center font-bold text-lg">S</div>
            <span className="font-bold text-xl tracking-tight">SkillSync</span>
          </div>
          <div className="flex gap-4">
            <Link href="/login" className="text-slate-300 hover:text-white px-3 py-2 text-sm font-medium transition-colors">
              Sign In
            </Link>
            <Link href="/login" className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
              Explore Dashboard
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6">
            Better Skills. <span className="text-blue-400">Better Jobs.</span> <br /> Stronger Bharat.
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-10 leading-relaxed">
            An evidence-driven Labour-Market Intelligence and Skill-Development Outcome Platform bridging the gap between industry needs and training curricula.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/login" className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-lg font-semibold text-lg flex items-center justify-center gap-2 transition-colors shadow-lg shadow-blue-900/50">
              Explore Dashboard <ArrowRight size={20} />
            </Link>
            <Link href="/login" className="bg-slate-800 hover:bg-slate-700 text-white px-8 py-4 rounded-lg font-semibold text-lg flex items-center justify-center gap-2 transition-colors border border-slate-700">
              View Skill Intelligence <BarChart3 size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* Problem Statement */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">The Dual Challenge</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">SkillSync addresses the two fundamental disconnections in the current skill ecosystem.</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-rose-50 border border-rose-100 p-8 rounded-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10"><GraduationCap size={120} /></div>
              <h3 className="text-xl font-bold text-rose-900 mb-3 flex items-center gap-2">
                <span className="bg-rose-200 text-rose-800 w-8 h-8 rounded-full flex items-center justify-center text-sm">1</span>
                Industry-Curriculum Misalignment
              </h3>
              <p className="text-rose-800/80 leading-relaxed">
                Training programs often teach outdated skills while modern industries struggle to find talent for emerging roles. The feedback loop from industry to curriculum is slow or non-existent.
              </p>
            </div>
            
            <div className="bg-amber-50 border border-amber-100 p-8 rounded-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10"><Briefcase size={120} /></div>
              <h3 className="text-xl font-bold text-amber-900 mb-3 flex items-center gap-2">
                <span className="bg-amber-200 text-amber-800 w-8 h-8 rounded-full flex items-center justify-center text-sm">2</span>
                Employment Outcome Visibility
              </h3>
              <p className="text-amber-800/80 leading-relaxed">
                Success is often measured by 'certifications issued' rather than 'sustained employment achieved'. Tracking candidates post-placement is historically difficult.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Kaizen Loop Visual */}
      <section className="py-20 bg-slate-50 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">The Continuous Improvement (Kaizen) Loop</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">Our platform creates a real-time feedback mechanism connecting all stakeholders.</p>
          </div>
          
          <div className="relative max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
            <div className="flex flex-wrap justify-center gap-4 text-sm font-medium text-slate-700">
              <div className="px-4 py-2 bg-blue-50 border border-blue-100 rounded-lg flex items-center gap-2"><Building2 size={16} className="text-blue-600"/> Industry Reality</div>
              <ArrowRight className="text-slate-400 self-center" />
              <div className="px-4 py-2 bg-indigo-50 border border-indigo-100 rounded-lg flex items-center gap-2"><BarChart3 size={16} className="text-indigo-600"/> Skill Intelligence</div>
              <ArrowRight className="text-slate-400 self-center" />
              <div className="px-4 py-2 bg-emerald-50 border border-emerald-100 rounded-lg flex items-center gap-2"><GraduationCap size={16} className="text-emerald-600"/> Curriculum Alignment</div>
              <ArrowRight className="text-slate-400 self-center" />
              <div className="px-4 py-2 bg-amber-50 border border-amber-100 rounded-lg flex items-center gap-2"><Briefcase size={16} className="text-amber-600"/> Placement Tracking</div>
              <ArrowRight className="text-slate-400 self-center" />
              <div className="px-4 py-2 bg-purple-50 border border-purple-100 rounded-lg flex items-center gap-2"><LineChart size={16} className="text-purple-600"/> Impact Analytics</div>
            </div>
            <div className="mt-8 flex justify-center">
               <div className="flex items-center gap-2 text-indigo-600 font-semibold bg-indigo-50 px-6 py-3 rounded-full border border-indigo-100">
                  <RefreshCw size={20} /> Continuous Evidence-Based Improvement
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Capabilities */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-slate-900 mb-16">Platform Capabilities</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: 'Labour Market Intelligence', icon: BarChart3, desc: 'Real-time job market analysis.' },
              { title: 'Skill Gap Analysis', icon: LineChart, desc: 'Identify critical missing competencies.' },
              { title: 'Curriculum Alignment', icon: GraduationCap, desc: 'Data-backed course updates.' },
              { title: 'Employment Outcome Tracking', icon: CheckCircle2, desc: 'Long-term placement verification.' },
              { title: 'Employer Validation', icon: Building2, desc: 'Direct feedback from industry.' },
              { title: 'District Planning', icon: Users, desc: 'Geographic skill supply-demand mapping.' },
              { title: 'Career Pathways', icon: Briefcase, desc: 'Predictive career trajectory modeling.' },
              { title: 'Kaizen Feedback Loop', icon: RefreshCw, desc: 'Automated improvement cycles.' }
            ].map((cap, i) => (
              <div key={i} className="bg-slate-50 border border-slate-200 p-6 rounded-xl hover:shadow-md transition-shadow">
                <cap.icon className="text-blue-600 mb-4 h-8 w-8" />
                <h3 className="font-semibold text-slate-900 mb-2">{cap.title}</h3>
                <p className="text-slate-600 text-sm">{cap.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-blue-500 rounded flex items-center justify-center font-bold text-xs text-white">S</div>
            <span className="font-semibold text-slate-200">SkillSync</span>
          </div>
          <p className="text-sm">© 2026 SkillSync. All rights reserved. DEMO ENVIRONMENT.</p>
        </div>
      </footer>
    </div>
  );
}
