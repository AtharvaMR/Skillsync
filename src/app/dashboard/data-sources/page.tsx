'use client';

import { useEffect, useState } from 'react';
import { Database, CheckCircle, KeyRound, ShieldCheck } from 'lucide-react';

interface LockerEngine {
  engine: string;
  configured: boolean;
  fingerprint: string | null;
}

export default function DataSourcesPage() {
  const [locker, setLocker] = useState<Record<string, LockerEngine> | null>(null);

  useEffect(() => {
    let active = true;
    fetch('/api/security/status')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (active && data?.locker) setLocker(data.locker);
      });
    return () => {
      active = false;
    };
  }, []);

  const externalConnectors = [
    {
      name: 'National Career Service (NCS)',
      purpose: 'Live job requisitions & district hiring trends',
      requirement: 'Requires NCS Partner API Credentials',
    },
    {
      name: 'Skill India Digital Hub / NSDC',
      purpose: 'NSQF Qualification Packs & training center outcomes',
      requirement: 'Requires MSDE / NSDC OAuth Client Keys',
    },
    {
      name: 'EPFO / Longitudinal Retention Feeds',
      purpose: 'Consent-based 90/180/365-day post-placement verification',
      requirement: 'Requires Institutional Data Sharing Agreement',
    },
    {
      name: 'Employer Job & Apprenticeship Feeds',
      purpose: 'NAPS apprenticeships & verified hiring requirements',
      requirement: 'Currently powered by curated SQLite MVP dataset',
    },
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Database className="text-slate-700" /> Data Sources & Live Integrations
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          Transparent status of active AI/database connections and external integration adapters.
        </p>
      </div>

      {/* Live Connected Engines */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <ShieldCheck size={18} className="text-emerald-600" /> Active Local & AI Integrations
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/40">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-slate-900">SQLite Database (dev.db)</span>
              <CheckCircle size={16} className="text-emerald-600" />
            </div>
            <p className="text-xs text-slate-600 mt-1">
              Persistent storage for users, learner skills, portfolios, assessments, opportunities, feedback, and Kaizen PDCA cycles.
            </p>
            <div className="text-[11px] font-semibold text-emerald-700 mt-2">Active • Local Persistence</div>
          </div>

          {locker &&
            Object.entries(locker).map(([key, item]) => (
              <div key={key} className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-slate-900">{item.engine}</span>
                  <CheckCircle size={16} className={item.configured ? 'text-emerald-600' : 'text-amber-500'} />
                </div>
                <p className="text-xs text-slate-600 mt-1">
                  Server-only secret fingerprint: <code className="bg-white px-1 rounded">{item.fingerprint || 'none'}</code>
                </p>
                <div className={`text-[11px] font-semibold mt-2 ${item.configured ? 'text-emerald-700' : 'text-amber-700'}`}>
                  {item.configured ? 'Configured in .env.local' : 'Not Configured'}
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* External Government / Portal Connectors (Honest MVP status) */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <KeyRound size={18} className="text-amber-600" /> External Ecosystem Connectors (MVP Adapter Structure)
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          {externalConnectors.map((src) => (
            <div key={src.name} className="p-4 rounded-xl border border-slate-200 bg-slate-50/70">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-bold text-slate-900 text-sm">{src.name}</h3>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-800 border border-amber-200 shrink-0">
                  Curated MVP Data
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-1">{src.purpose}</p>
              <div className="text-[11px] text-slate-500 mt-2 font-medium">{src.requirement}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
