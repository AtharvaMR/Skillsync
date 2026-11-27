'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Lightbulb, Zap, ShieldAlert, CheckCircle2, ArrowRight } from 'lucide-react';

export default function RecommendationsPage() {
  const [loggedIds, setLoggedIds] = useState<string[]>([]);
  const [statusMsg, setStatusMsg] = useState('');

  const criticalActions = [
    {
      id: 'rec_sunset',
      title: 'Transition "Basic Office & Data Entry" into Digital Operations',
      evidence: 'Placement rate at 32% (26/80 graduates); legacy data entry demand declining (-35% YoY).',
      phase: 'act',
      category: 'Policy',
      impactMetric: 'Target: +20% placement lift via digital tools track',
    },
  ];

  const enhancements = [
    {
      id: 'rec_ts',
      title: 'Add TypeScript & API Error-Handling Lab to Full Stack Web Dev',
      evidence: 'Employer feedback (TCS) + 44% YoY growth in TypeScript job requirements.',
      phase: 'plan',
      category: 'Curriculum',
      impactMetric: 'Target: +15% frontend placement readiness',
    },
    {
      id: 'rec_ev',
      title: 'Add BMS Diagnostic Tooling Hours in Hubballi EV Lab',
      evidence: 'Tata Motors feedback + 112% growth in EV Battery Management demand.',
      phase: 'plan',
      category: 'Infrastructure',
      impactMetric: 'Target: Higher hands-on assessor validation pass rate',
    },
  ];

  const handleLogToKaizen = async (rec: {
    id: string;
    title: string;
    evidence: string;
    phase: string;
    category: string;
    impactMetric: string;
  }) => {
    setStatusMsg('');
    const res = await fetch('/api/kaizen', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: rec.title,
        phase: rec.phase,
        category: rec.category,
        evidence: rec.evidence,
        impactMetric: rec.impactMetric,
      }),
    });
    if (res.ok) {
      setLoggedIds((prev) => [...prev, rec.id]);
      setStatusMsg(`Logged "${rec.title}" into Digital Kaizen PDCA tracker.`);
    } else {
      setStatusMsg('Only trainers, institutes, analysts, or admins can log Kaizen actions.');
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Lightbulb className="text-blue-600" /> Recommendation Center
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Evidence-backed curriculum and infrastructure interventions ready for Kaizen PDCA tracking
          </p>
        </div>
        <Link href="/dashboard/kaizen" className="text-xs font-semibold text-blue-600 hover:underline inline-flex items-center gap-1">
          Open Kaizen PDCA Tracker <ArrowRight size={14} />
        </Link>
      </div>

      {statusMsg && (
        <div className="p-3 rounded-lg bg-blue-50 border border-blue-200 text-blue-800 text-sm">
          {statusMsg}
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white border border-rose-200 rounded-xl p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <ShieldAlert className="text-rose-600" />
            <h2 className="text-lg font-bold text-rose-900">Critical Course Actions</h2>
          </div>
          {criticalActions.map((rec) => (
            <div key={rec.id} className="p-4 bg-rose-50 rounded-lg border border-rose-100 space-y-2.5">
              <h3 className="font-bold text-rose-900 text-sm">{rec.title}</h3>
              <p className="text-xs text-rose-800">{rec.evidence}</p>
              <div className="flex flex-wrap gap-2 pt-1">
                {loggedIds.includes(rec.id) ? (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-white px-3 py-1.5 rounded border border-emerald-200">
                    <CheckCircle2 size={14} /> Logged in Kaizen
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleLogToKaizen(rec)}
                    className="bg-rose-600 text-white px-3.5 py-1.5 rounded text-xs font-semibold hover:bg-rose-700"
                  >
                    Log to Kaizen PDCA
                  </button>
                )}
                <Link href="/dashboard/courses" className="px-3.5 py-1.5 rounded text-xs font-semibold bg-white border border-rose-200 text-rose-800">
                  Review Courses
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white border border-blue-200 rounded-xl p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <Zap className="text-blue-600" />
            <h2 className="text-lg font-bold text-blue-900">Curriculum & Lab Enhancements</h2>
          </div>
          <div className="space-y-3">
            {enhancements.map((rec) => (
              <div key={rec.id} className="p-4 bg-blue-50 rounded-lg border border-blue-100 space-y-2.5">
                <h3 className="font-bold text-blue-900 text-sm">{rec.title}</h3>
                <p className="text-xs text-blue-800">{rec.evidence}</p>
                <div className="flex flex-wrap gap-2 pt-1">
                  {loggedIds.includes(rec.id) ? (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-white px-3 py-1.5 rounded border border-emerald-200">
                      <CheckCircle2 size={14} /> Logged in Kaizen
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleLogToKaizen(rec)}
                      className="bg-blue-600 text-white px-3.5 py-1.5 rounded text-xs font-semibold hover:bg-blue-700"
                    >
                      Log to Kaizen PDCA
                    </button>
                  )}
                  <Link href="/dashboard/curriculum" className="px-3.5 py-1.5 rounded text-xs font-semibold bg-white border border-blue-200 text-blue-800">
                    Open Alignment Matrix
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
