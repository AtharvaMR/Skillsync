'use client';

import { useEffect, useState } from 'react';
import { Settings as SettingsIcon, Save, User as UserIcon, Database, CheckCircle2, ShieldCheck } from 'lucide-react';
import type { User } from '@/types';

interface LockerEngineStatus {
  engine: string;
  configured: boolean;
  fingerprint: string | null;
}

export default function SettingsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [headline, setHeadline] = useState('');
  const [location, setLocation] = useState('');
  const [portfolioPublic, setPortfolioPublic] = useState(true);
  const [consentTracking, setConsentTracking] = useState(true);
  const [locker, setLocker] = useState<Record<string, LockerEngineStatus> | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setUser(data.user);
          if (data.user.role === 'student') {
            fetch('/api/learner/profile')
              .then((r) => r.json())
              .then((p) => {
                if (p.profile) {
                  setHeadline(p.profile.headline || '');
                  setLocation(p.profile.location || '');
                  setPortfolioPublic(Boolean(p.profile.portfolio_public));
                  setConsentTracking(Boolean(p.profile.consent_tracking));
                }
              });
          }
        }
      });

    fetch('/api/security/status')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.locker) setLocker(data.locker);
      });
  }, []);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    setSaved(false);
    try {
      if (user.role === 'student') {
        const res = await fetch('/api/learner/profile', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            headline,
            location,
            portfolio_public: portfolioPublic,
            consent_tracking: consentTracking,
          }),
        });
        if (res.ok) setSaved(true);
      } else {
        setSaved(true);
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <SettingsIcon className="text-slate-600" /> Settings & Privacy Controls
        </h1>
        <p className="text-sm text-slate-500 mt-1">Manage your account preferences, consent, and portfolio visibility.</p>
      </div>

      {saved && (
        <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center gap-2">
          <CheckCircle2 size={16} /> Settings saved.
        </div>
      )}

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="border-b border-slate-200 p-5">
          <h2 className="text-base font-bold flex items-center gap-2 text-slate-900">
            <UserIcon size={18} /> Account Details
          </h2>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Full Name</label>
              <input
                type="text"
                value={user?.name || ''}
                disabled
                className="w-full border border-slate-200 bg-slate-50 rounded-lg px-3 py-2 text-sm text-slate-600"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Email</label>
              <input
                type="email"
                value={user?.email || ''}
                disabled
                className="w-full border border-slate-200 bg-slate-50 rounded-lg px-3 py-2 text-sm text-slate-600"
              />
            </div>
          </div>

          {user?.role === 'student' && (
            <>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Learner Headline</label>
                  <input
                    type="text"
                    value={headline}
                    onChange={(e) => setHeadline(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">City / District</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
                  />
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <label className="flex items-center gap-2.5 text-sm text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={portfolioPublic}
                    onChange={(e) => setPortfolioPublic(e.target.checked)}
                  />
                  <span>Allow employers to view my public shareable Skill Portfolio link</span>
                </label>
                <label className="flex items-center gap-2.5 text-sm text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={consentTracking}
                    onChange={(e) => setConsentTracking(e.target.checked)}
                  />
                  <span>Consent to longitudinal training outcome & placement follow-up tracking</span>
                </label>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="border-b border-slate-200 p-5 bg-slate-50 flex justify-between items-center">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Database size={18} /> Persistence & Environment
          </h2>
          <span className="bg-blue-100 text-blue-800 text-xs px-2.5 py-0.5 rounded-full font-semibold">SQLite + Curated MVP</span>
        </div>
        <div className="p-6 text-sm text-slate-600 space-y-4">
          <p>
            User accounts, learner profiles, skill provenance, practical portfolios, assessments, opportunities, and Kaizen PDCA records persist locally in SQLite (<code className="text-xs bg-slate-100 px-1.5 py-0.5 rounded">dev.db</code>). Industry benchmark datasets are curated for MVP demonstration.
          </p>

          {locker && (
            <div className="pt-3 border-t border-slate-200">
              <div className="text-xs font-bold uppercase text-slate-700 mb-2.5 flex items-center gap-1.5">
                <ShieldCheck size={15} className="text-emerald-600" /> Server-Side Secret Locker Status (Keys Isolated in .env.local)
              </div>
              <div className="grid sm:grid-cols-2 gap-2.5">
                {Object.entries(locker).map(([key, info]) => (
                  <div key={key} className="p-3 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-between gap-2 text-xs">
                    <div>
                      <div className="font-semibold text-slate-900">{info.engine}</div>
                      <div className="text-[11px] text-slate-500">
                        SHA-256 Fingerprint: {info.fingerprint || 'none'}
                      </div>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded-full font-semibold ${
                        info.configured
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}
                    >
                      {info.configured ? 'Sealed' : 'Missing'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2.5 rounded-lg inline-flex items-center gap-2 text-sm transition-colors disabled:opacity-60"
        >
          <Save size={16} /> {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
}
