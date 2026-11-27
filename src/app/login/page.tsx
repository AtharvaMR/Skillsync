'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Building2,
  GraduationCap,
  Users,
  Shield,
  LineChart,
  Briefcase,
  Loader2,
  KeyRound,
  UserPlus,
  ArrowLeft,
} from 'lucide-react';
import type { UserRole } from '@/types';

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('student');
  const [location, setLocation] = useState('');
  const [organisationName, setOrganisationName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const demoAccounts = [
    { role: 'Learner (Student)', email: 'student@skillsync.gov.in', icon: Briefcase, color: 'text-blue-600', bg: 'bg-blue-100' },
    { role: 'Trainer / Assessor', email: 'trainer@skillsync.gov.in', icon: Users, color: 'text-emerald-600', bg: 'bg-emerald-100' },
    { role: 'Institution', email: 'institute@skillsync.gov.in', icon: GraduationCap, color: 'text-indigo-600', bg: 'bg-indigo-100' },
    { role: 'Employer', email: 'employer@skillsync.gov.in', icon: Building2, color: 'text-amber-600', bg: 'bg-amber-100' },
    { role: 'Government Admin', email: 'admin@skillsync.gov.in', icon: Shield, color: 'text-slate-700', bg: 'bg-slate-200' },
    { role: 'Policy Analyst', email: 'analyst@skillsync.gov.in', icon: LineChart, color: 'text-rose-600', bg: 'bg-rose-100' },
  ];

  const handleDemoSelect = (selectedEmail: string) => {
    setMode('login');
    setError('');
    setEmail(selectedEmail);
    setPassword('SkillSync2024!');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const endpoint = mode === 'login' ? '/api/auth/login' : '/api/auth/register';
      const payload =
        mode === 'login'
          ? { email, password }
          : { name, email, password, role, location, organisationName };

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Authentication failed. Please check your details.');
        return;
      }

      router.push('/dashboard');
      router.refresh();
    } catch {
      setError('Network error while connecting to SkillSync. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Left side - Branding */}
      <div className="hidden lg:flex w-5/12 bg-slate-900 flex-col justify-between p-12 relative overflow-hidden">
        <div className="relative z-10">
          <Link href="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white text-sm mb-10 transition-colors">
            <ArrowLeft size={16} /> Back to Home
          </Link>
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center font-bold text-xl text-white">S</div>
            <div>
              <span className="font-bold text-2xl tracking-tight text-white block leading-none">SkillSync</span>
              <span className="text-xs text-blue-400 font-medium">UnlockED — Track 04</span>
            </div>
          </div>

          <h1 className="text-4xl font-bold text-white leading-tight mb-5">
            Proof of Skill. <br />
            <span className="text-blue-400">Path to Opportunity.</span>
          </h1>
          <p className="text-base text-slate-300 max-w-md leading-relaxed">
            Bridging education, verified practical competencies, and meaningful employment through evidence-driven Digital Kaizen.
          </p>
        </div>

        <div className="relative z-10 space-y-3 text-slate-400 text-xs border-t border-slate-800 pt-6">
          <div className="font-medium text-slate-300">Core Learner Journey</div>
          <div>Register → Build Skill Profile → Identify Skill Gaps → Complete Practical Work → Validate Competencies → Share Portfolio → Discover Opportunities</div>
        </div>
      </div>

      {/* Right side - Login / Registration Form */}
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-16 xl:px-24 py-10">
        <div className="w-full max-w-md mx-auto">
          <div className="lg:hidden mb-6 flex items-center justify-between">
            <Link href="/" className="text-sm text-slate-600 hover:text-slate-900 inline-flex items-center gap-1">
              <ArrowLeft size={16} /> Home
            </Link>
            <span className="font-bold text-lg text-slate-900">SkillSync</span>
          </div>

          {/* Mode Tabs */}
          <div className="flex rounded-lg bg-slate-200/70 p-1 mb-6">
            <button
              type="button"
              onClick={() => { setMode('login'); setError(''); }}
              className={`flex-1 py-2 text-sm font-semibold rounded-md transition-colors ${
                mode === 'login' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setMode('register'); setError(''); }}
              className={`flex-1 py-2 text-sm font-semibold rounded-md transition-colors ${
                mode === 'register' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Create Account
            </button>
          </div>

          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-900">
              {mode === 'login' ? 'Sign in to SkillSync' : 'Create your SkillSync account'}
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              {mode === 'login'
                ? 'Access your personalized learner, trainer, employer, or institutional workspace.'
                : 'Start building your verified skill profile and career pathway.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-rose-50 text-rose-700 p-3 rounded-lg text-sm border border-rose-200">
                {error}
              </div>
            )}

            {mode === 'register' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white text-sm"
                    placeholder="e.g., Kavya Rao"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Role</label>
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value as UserRole)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white text-sm"
                    >
                      <option value="student">Learner / Student</option>
                      <option value="trainer">Trainer / Assessor</option>
                      <option value="institute">Institution</option>
                      <option value="employer">Employer</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">City / District</label>
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full px-3.5 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white text-sm"
                      placeholder="e.g., Hubballi, KA"
                    />
                  </div>
                </div>

                {role !== 'student' && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Organisation / Institute</label>
                    <input
                      type="text"
                      value={organisationName}
                      onChange={(e) => setOrganisationName(e.target.value)}
                      className="w-full px-3.5 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white text-sm"
                      placeholder="e.g., Don Bosco Institute of Technology"
                    />
                  </div>
                )}
              </>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white text-sm"
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Password {mode === 'register' && <span className="text-xs text-slate-400">(min. 8 characters)</span>}
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3.5 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white text-sm"
                placeholder="••••••••"
                minLength={mode === 'register' ? 8 : undefined}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed shadow-sm text-sm"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={18} />
              ) : mode === 'login' ? (
                <KeyRound size={18} />
              ) : (
                <UserPlus size={18} />
              )}
              {mode === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          {/* Demo Quick-Login */}
          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-2 bg-slate-50 text-slate-500">Quick-Fill Demo Accounts</span>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2.5">
              {demoAccounts.map((account) => (
                <button
                  key={account.email}
                  type="button"
                  onClick={() => handleDemoSelect(account.email)}
                  className="flex items-center gap-2.5 p-2.5 text-left border border-slate-200 bg-white rounded-lg hover:border-blue-300 hover:bg-blue-50/60 transition-colors"
                >
                  <div className={`p-1.5 rounded-md ${account.bg} ${account.color}`}>
                    <account.icon size={15} />
                  </div>
                  <div className="text-xs font-semibold text-slate-800 truncate">{account.role}</div>
                </button>
              ))}
            </div>

            <p className="text-xs text-center text-slate-500 mt-4">
              Demo password: <strong className="text-slate-700 font-mono">SkillSync2024!</strong>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
