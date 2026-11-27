import Link from 'next/link';
import {
  ArrowRight,
  BarChart3,
  Briefcase,
  GraduationCap,
  Building2,
  Compass,
  FolderCheck,
  RefreshCw,
  CheckCircle2,
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Header */}
      <header className="bg-slate-900 text-white sticky top-0 z-50 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-base">S</div>
            <span className="font-bold text-lg tracking-tight">SkillSync</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-slate-300 hover:text-white px-3 py-2 text-sm font-medium transition-colors">
              Sign In
            </Link>
            <Link href="/login" className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors">
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-slate-900 text-white py-20 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-300 text-xs font-semibold mb-6">
            UnlockED • Proof of Skill. Path to Opportunity.
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-5">
            Better Skills. <span className="text-blue-400">Better Jobs.</span> Stronger Bharat.
          </h1>
          <p className="text-lg text-slate-300 max-w-3xl mx-auto mb-9 leading-relaxed">
            An AI-powered education and employment intelligence platform connecting industry demand, curriculum alignment, practical competency validation, and accessible career pathways.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/login"
              className="bg-blue-600 hover:bg-blue-500 text-white px-7 py-3.5 rounded-lg font-semibold text-base inline-flex items-center justify-center gap-2 transition-colors"
            >
              Start Learner Journey <ArrowRight size={18} />
            </Link>
            <Link
              href="/portfolio/usr_stu_001"
              className="bg-slate-800 hover:bg-slate-700 text-white px-7 py-3.5 rounded-lg font-semibold text-base inline-flex items-center justify-center gap-2 transition-colors border border-slate-700"
            >
              View Sample Verified Portfolio <FolderCheck size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Core Journey */}
      <section className="py-16 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">End-to-End Learner & Ecosystem Loop</h2>
            <p className="text-sm sm:text-base text-slate-600 mt-2">
              Making learning relevant, practical skills visible, and meaningful opportunities accessible.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { title: '1. Skill Profile & Gap Analysis', icon: BarChart3, desc: 'Upload resumes or list skills to see clear explanations of missing role competencies.' },
              { title: '2. Practical Skill Portfolio', icon: FolderCheck, desc: 'Submit work samples and projects mapped cleanly to industry skills.' },
              { title: '3. Assessor Validation', icon: CheckCircle2, desc: 'Trainers and employers validate practical proof—distinguishing AI-mapped vs. verified skills.' },
              { title: '4. Opportunity Matching', icon: Briefcase, desc: 'Discover internships, apprenticeships, jobs, and training with transparent match reasons.' },
            ].map((item) => (
              <div key={item.title} className="p-6 rounded-xl border border-slate-200 bg-slate-50">
                <item.icon className="text-blue-600 mb-3" size={24} />
                <h3 className="font-bold text-slate-900 text-base mb-1.5">{item.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Methodology */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-8">
          <div className="bg-white border border-slate-200 rounded-xl p-7 shadow-sm">
            <div className="flex items-center gap-2 text-blue-700 font-semibold text-xs uppercase mb-2">
              <RefreshCw size={15} /> Core Methodology
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Digital Kaizen (Genchi Genbutsu + PDCA)</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Observe live industry requirements, Plan curriculum and skill updates, Do targeted interventions, Check practical competencies and retention outcomes, and Act continuously on evidence.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-7 shadow-sm">
            <div className="flex items-center gap-2 text-indigo-700 font-semibold text-xs uppercase mb-2">
              <Compass size={15} /> Optional Guidance Aid
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Ikigai-Inspired Career Discovery</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Helps learners reflect on where their interests, strengths, societal needs, and market demand intersect—supporting informed exploration without automated career lock-in.
            </p>
          </div>
        </div>
      </section>

      {/* Stakeholders */}
      <section className="py-16 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            { role: 'Learners', icon: Briefcase, desc: 'Skill-gap analysis, practical portfolios, shareable proof links, and matched opportunities.' },
            { role: 'Trainers & Institutions', icon: GraduationCap, desc: 'Competency validation queues, course health scores, and curriculum alignment.' },
            { role: 'Employers', icon: Building2, desc: 'Competency-based candidate discovery and direct curriculum feedback.' },
            { role: 'Administrators', icon: BarChart3, desc: 'District demand, outcomes analytics, and Kaizen PDCA tracking.' },
          ].map((st) => (
            <div key={st.role} className="p-5 rounded-xl border border-slate-200">
              <st.icon className="text-slate-700 mb-2.5" size={20} />
              <h4 className="font-bold text-slate-900 text-sm mb-1">{st.role}</h4>
              <p className="text-xs text-slate-600">{st.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-8 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs">
          <div className="font-semibold text-slate-200">SkillSync — Proof of Skill. Path to Opportunity.</div>
          <div>wHACKiest 2026 • Track 04: UnlockED • Demo Environment</div>
        </div>
      </footer>
    </div>
  );
}
