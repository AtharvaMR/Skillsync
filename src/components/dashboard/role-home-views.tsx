import Link from 'next/link';
import { ClipboardCheck, BookOpen, GraduationCap, Users, Building2, Briefcase, ArrowRight, RefreshCw } from 'lucide-react';
import type { User } from '@/types';

export function InstitutionTrainerOverview({
  user,
  pendingReviews,
  courseCount,
}: {
  user: User;
  pendingReviews: number;
  courseCount: number;
}) {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            {user.role === 'trainer' ? 'Trainer & Assessor Workspace' : 'Institution Intelligence'}
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            {user.organisationName || 'Training Partner'} • Validate practical learner competencies and align curricula with industry demand
          </p>
        </div>
        <Link
          href="/dashboard/assessments"
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
        >
          <ClipboardCheck size={16} /> Review Submissions ({pendingReviews})
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <div className="text-xs font-semibold uppercase text-slate-500">Pending Portfolio Reviews</div>
          <div className="text-3xl font-bold text-amber-600 mt-2">{pendingReviews}</div>
          <p className="text-xs text-slate-500 mt-1">Learner projects awaiting assessor sign-off</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <div className="text-xs font-semibold uppercase text-slate-500">Tracked Courses</div>
          <div className="text-3xl font-bold text-slate-900 mt-2">{courseCount}</div>
          <p className="text-xs text-slate-500 mt-1">Active curricula monitored via Digital Kaizen</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <div className="text-xs font-semibold uppercase text-slate-500">Validation Standard</div>
          <div className="text-lg font-bold text-emerald-700 mt-2">Human-in-the-Loop</div>
          <p className="text-xs text-slate-500 mt-1">AI maps competencies; assessors certify work</p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {[
          { title: 'Competency Validation Queue', desc: 'Inspect learner work samples and issue assessor-validated badges.', href: '/dashboard/assessments', icon: ClipboardCheck },
          { title: 'Curriculum Alignment & Health', desc: 'Compare course skills against live employer requirements.', href: '/dashboard/curriculum', icon: GraduationCap },
          { title: 'Digital Kaizen PDCA Loop', desc: 'Track Plan-Do-Check-Act curriculum improvements.', href: '/dashboard/kaizen', icon: RefreshCw },
          { title: 'Courses & Outcomes', desc: 'Review completion, placement, and course health breakdowns.', href: '/dashboard/courses', icon: BookOpen },
          { title: 'Trainer & Equipment Gaps', desc: 'Identify upskilling and lab infrastructure needs.', href: '/dashboard/trainers', icon: Users },
        ].map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:border-blue-300 transition-colors flex flex-col justify-between"
          >
            <div>
              <card.icon size={20} className="text-blue-600 mb-3" />
              <h3 className="font-bold text-slate-900 text-sm mb-1">{card.title}</h3>
              <p className="text-xs text-slate-600">{card.desc}</p>
            </div>
            <span className="mt-3 text-xs font-semibold text-blue-600 inline-flex items-center gap-1">
              Open <ArrowRight size={13} />
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}

export function EmployerOverview({
  user,
  opportunityCount,
  verifiedLearnerCount,
}: {
  user: User;
  opportunityCount: number;
  verifiedLearnerCount: number;
}) {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Employer Talent & Validation Portal</h1>
          <p className="text-sm text-slate-600 mt-1">
            {user.organisationName || 'Hiring Partner'} • Discover learners by verified practical competencies and guide training curricula
          </p>
        </div>
        <Link
          href="/dashboard/candidates"
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
        >
          <Users size={16} /> Discover Verified Talent
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <div className="text-xs font-semibold uppercase text-slate-500">Active Opportunities</div>
          <div className="text-3xl font-bold text-slate-900 mt-2">{opportunityCount}</div>
          <p className="text-xs text-slate-500 mt-1">Internships, apprenticeships, and entry-level roles</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <div className="text-xs font-semibold uppercase text-emerald-700">Validated Portfolios</div>
          <div className="text-3xl font-bold text-emerald-700 mt-2">{verifiedLearnerCount}</div>
          <p className="text-xs text-slate-500 mt-1">Learners with assessor-validated project proof</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <div className="text-xs font-semibold uppercase text-slate-500">Feedback Loop</div>
          <div className="text-lg font-bold text-blue-700 mt-2">Industry → Curriculum</div>
          <p className="text-xs text-slate-500 mt-1">Submit skill-gap feedback directly to institutes</p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {[
          { title: 'Competency-Based Candidate Discovery', desc: 'View learner skill provenance and public practical portfolios.', href: '/dashboard/candidates', icon: Users },
          { title: 'Post & Manage Opportunities', desc: 'Publish internships, apprenticeships, and entry-level openings.', href: '/dashboard/opportunities', icon: Briefcase },
          { title: 'Submit Curriculum Feedback', desc: 'Report emerging skill gaps and validate course updates.', href: '/dashboard/employers', icon: Building2 },
        ].map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:border-blue-300 transition-colors flex flex-col justify-between"
          >
            <div>
              <card.icon size={20} className="text-blue-600 mb-3" />
              <h3 className="font-bold text-slate-900 text-sm mb-1">{card.title}</h3>
              <p className="text-xs text-slate-600">{card.desc}</p>
            </div>
            <span className="mt-3 text-xs font-semibold text-blue-600 inline-flex items-center gap-1">
              Open <ArrowRight size={13} />
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
