'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Building2, GraduationCap, Users, Shield, LineChart, Briefcase, Loader2, KeyRound } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const demoAccounts = [
    { role: 'Government Admin', email: 'admin@skillsync.gov.in', icon: Shield, color: 'text-indigo-600', bg: 'bg-indigo-100' },
    { role: 'Institute', email: 'institute@skillsync.gov.in', icon: GraduationCap, color: 'text-emerald-600', bg: 'bg-emerald-100' },
    { role: 'Trainer', email: 'trainer@skillsync.gov.in', icon: Users, color: 'text-blue-600', bg: 'bg-blue-100' },
    { role: 'Employer', email: 'employer@skillsync.gov.in', icon: Building2, color: 'text-amber-600', bg: 'bg-amber-100' },
    { role: 'Student', email: 'student@skillsync.gov.in', icon: Briefcase, color: 'text-purple-600', bg: 'bg-purple-100' },
    { role: 'Analyst', email: 'analyst@skillsync.gov.in', icon: LineChart, color: 'text-rose-600', bg: 'bg-rose-100' },
  ];

  const handleDemoSelect = (selectedEmail: string) => {
    setEmail(selectedEmail);
    setPassword('SkillSync2024!');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      if (email && password === 'SkillSync2024!') {
        // Redirect to dashboard
        router.push('/dashboard');
      } else {
        setError('Invalid credentials. Please use a demo account.');
      }
    } catch (err) {
      setError('An error occurred during login.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Left side - Branding */}
      <div className="hidden lg:flex w-1/2 bg-slate-900 flex-col justify-between p-12 relative overflow-hidden">
        {/* Abstract pattern background */}
        <div className="absolute inset-0 opacity-10">
          <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center font-bold text-2xl text-white shadow-lg shadow-blue-500/20">S</div>
            <span className="font-bold text-3xl tracking-tight text-white">SkillSync</span>
          </div>
          
          <h1 className="text-5xl font-extrabold text-white leading-tight mb-6">
            Evidence-Driven <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
              Skill Development
            </span>
          </h1>
          <p className="text-xl text-slate-300 max-w-lg leading-relaxed">
            Connecting industry reality with curriculum design and employment outcomes for a stronger Bharat.
          </p>
        </div>

        <div className="relative z-10 text-slate-400 text-sm">
          Secure Government Portal • DEMO ENVIRONMENT
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-20 xl:px-32 relative">
        <div className="w-full max-w-md mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-slate-900">Sign in to your account</h2>
            <p className="mt-2 text-sm text-slate-600">Enter your credentials to access the dashboard</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="bg-rose-50 text-rose-600 p-3 rounded-md text-sm border border-rose-100 flex items-center gap-2">
                <div className="w-1 h-full bg-rose-500 rounded-full"></div>
                {error}
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email address</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                placeholder="••••••••"
                required
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed shadow-sm"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : <KeyRound size={20} />}
              Sign In
            </button>
          </form>

          <div className="mt-12">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-slate-50 text-slate-500">Quick Login (Demo Accounts)</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              {demoAccounts.map((account, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleDemoSelect(account.email)}
                  className="flex items-center gap-3 p-3 text-left border border-slate-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all group"
                >
                  <div className={`p-2 rounded-md ${account.bg} ${account.color} group-hover:scale-110 transition-transform`}>
                    <account.icon size={16} />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-slate-900">{account.role}</div>
                  </div>
                </button>
              ))}
            </div>
            
            <p className="text-xs text-center text-slate-500 mt-6">
              Password for all demo accounts: <strong className="text-slate-700 font-mono">SkillSync2024!</strong>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
