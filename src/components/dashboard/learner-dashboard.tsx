"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  BrainCircuit,
  FolderCheck,
  Briefcase,
  Compass,
  CheckCircle2,
  ArrowRight,
  ExternalLink,
  MapPin,
  BookOpen,
  Sparkles,
  MessageSquare,
} from "lucide-react";
import { ProvenanceBadge } from "@/components/ui/provenance-badge";
import type { User } from "@/types";

interface LearnerSkillRow {
  id: string;
  skill_name: string;
  category: string;
  proficiency: string;
  provenance: string;
  evidence_note: string;
  validated_by?: string | null;
}

interface PortfolioProjectRow {
  id: string;
  title: string;
  status: string;
  skills_json: string;
}

interface LearnerProfileRow {
  headline: string;
  location: string;
  education_level: string;
  target_role: string;
  portfolio_public: number;
}

export function LearnerDashboard({ user }: { user: User }) {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<LearnerProfileRow | null>(null);
  const [skills, setSkills] = useState<LearnerSkillRow[]>([]);
  const [projects, setProjects] = useState<PortfolioProjectRow[]>([]);

  useEffect(() => {
    fetch("/api/learner/profile")
      .then((res) => res.json())
      .then((data) => {
        if (data.profile) setProfile(data.profile);
        if (Array.isArray(data.skills)) setSkills(data.skills);
        if (Array.isArray(data.projects)) setProjects(data.projects);
      })
      .finally(() => setLoading(false));
  }, []);

  const counts = {
    total: skills.length,
    verified: skills.filter((s) => s.provenance === "employer_verified" || s.provenance === "assessor_validated").length,
    aiMapped: skills.filter((s) => s.provenance === "ai_mapped").length,
    selfDeclared: skills.filter((s) => s.provenance === "self_declared").length,
  };

  const validatedProjects = projects.filter((p) => p.status === "validated").length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded-full mb-2">
            Proof of Skill. Path to Opportunity.
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Welcome back, {user.name}</h1>
          <p className="text-sm text-slate-600 mt-1 flex flex-wrap items-center gap-3">
            <span>{profile?.headline || "SkillSync Learner"}</span>
            {profile?.location && (
              <span className="inline-flex items-center gap-1 text-slate-500">
                <MapPin size={14} /> {profile.location}
              </span>
            )}
            {profile?.target_role && (
              <span className="text-slate-700 font-medium">
                Target Role: <span className="text-blue-700">{profile.target_role}</span>
              </span>
            )}
          </p>
        </div>

        <div className="flex flex-wrap gap-2.5">
          <Link
            href="/dashboard/gap-analysis"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
          >
            <BrainCircuit size={16} /> Analyze Skill Gaps
          </Link>
          <Link
            href="/dashboard/assistant"
            className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
          >
            <MessageSquare size={16} /> Career Assistant
          </Link>
          <Link
            href={`/portfolio/${user.id}`}
            target="_blank"
            className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
          >
            Shareable Portfolio <ExternalLink size={15} />
          </Link>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <div className="text-xs font-semibold uppercase text-slate-500">Total Skills Logged</div>
          <div className="text-3xl font-bold text-slate-900 mt-2">{loading ? "—" : counts.total}</div>
          <p className="text-xs text-slate-500 mt-1">{counts.aiMapped} AI-mapped • {counts.selfDeclared} self-declared</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <div className="text-xs font-semibold uppercase text-emerald-700">Verified Competencies</div>
          <div className="text-3xl font-bold text-emerald-700 mt-2">{loading ? "—" : counts.verified}</div>
          <p className="text-xs text-slate-500 mt-1">Assessor-validated or employer-verified</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <div className="text-xs font-semibold uppercase text-slate-500">Practical Projects</div>
          <div className="text-3xl font-bold text-slate-900 mt-2">{loading ? "—" : projects.length}</div>
          <p className="text-xs text-slate-500 mt-1">{validatedProjects} validated by trainers</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <div className="text-xs font-semibold uppercase text-slate-500">Portfolio Visibility</div>
          <div className="text-lg font-bold text-slate-900 mt-2">
            {profile?.portfolio_public ? "Public Link Active" : "Private"}
          </div>
          <Link href="/dashboard/portfolio" className="text-xs text-blue-600 hover:underline mt-1 inline-block">
            Manage evidence & privacy →
          </Link>
        </div>
      </div>

      {/* Core Guided Journey */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            step: "1. Profile & Gaps",
            title: "AI Skill Gap Analysis",
            desc: "Upload your resume or enter skills to see missing requirements for your target role.",
            href: "/dashboard/gap-analysis",
            icon: BrainCircuit,
            accent: "text-blue-600 bg-blue-50",
          },
          {
            step: "2. Practical Work",
            title: "Evidence Skill Portfolio",
            desc: "Upload work samples, project demos, and request trainer competency validation.",
            href: "/dashboard/portfolio",
            icon: FolderCheck,
            accent: "text-emerald-600 bg-emerald-50",
          },
          {
            step: "3. Career Clarity",
            title: "Ikigai Discovery Aid",
            desc: "Reflect on interests, strengths, and community needs to explore pathways.",
            href: "/dashboard/ikigai",
            icon: Compass,
            accent: "text-indigo-600 bg-indigo-50",
          },
          {
            step: "4. Employment",
            title: "Matched Opportunities",
            desc: "Explore internships, apprenticeships, jobs, and courses matched to your skills.",
            href: "/dashboard/opportunities",
            icon: Briefcase,
            accent: "text-amber-600 bg-amber-50",
          },
        ].map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:border-blue-300 hover:shadow transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                  {card.step}
                </span>
                <div className={`p-2 rounded-lg ${card.accent}`}>
                  <card.icon size={18} />
                </div>
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-1.5">{card.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{card.desc}</p>
            </div>
            <div className="mt-4 text-xs font-semibold text-blue-600 inline-flex items-center gap-1">
              Open <ArrowRight size={14} />
            </div>
          </Link>
        ))}
      </div>

      {/* Skill Portfolio Snapshot + Recent Projects */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Sparkles size={18} className="text-blue-600" /> My Competency Provenance
            </h2>
            <Link href="/dashboard/gap-analysis" className="text-xs font-semibold text-blue-600 hover:underline">
              Update Skills →
            </Link>
          </div>
          {skills.length === 0 ? (
            <p className="text-sm text-slate-500 py-6 text-center">
              No skills added yet. Upload a resume or add skills in Skill Gap & AI.
            </p>
          ) : (
            <div className="space-y-2.5">
              {skills.slice(0, 8).map((s) => (
                <div
                  key={s.id}
                  className="flex items-center justify-between gap-3 p-3 rounded-lg border border-slate-100 bg-slate-50/70"
                >
                  <div className="min-w-0">
                    <div className="font-semibold text-sm text-slate-900">{s.skill_name}</div>
                    {s.evidence_note && (
                      <div className="text-xs text-slate-500 truncate">{s.evidence_note}</div>
                    )}
                  </div>
                  <ProvenanceBadge provenance={s.provenance} className="shrink-0" />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <BookOpen size={18} className="text-emerald-600" /> Practical Work & Assessments
            </h2>
            <Link href="/dashboard/portfolio" className="text-xs font-semibold text-blue-600 hover:underline">
              Manage Portfolio →
            </Link>
          </div>
          {projects.length === 0 ? (
            <p className="text-sm text-slate-500 py-6 text-center">
              No projects submitted yet. Add practical work to earn assessor validation.
            </p>
          ) : (
            <div className="space-y-3">
              {projects.map((p) => (
                <div key={p.id} className="p-3.5 rounded-lg border border-slate-200 bg-white">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-sm text-slate-900">{p.title}</h3>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[11px] font-semibold shrink-0 ${
                        p.status === "validated"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : p.status === "needs_revision"
                          ? "bg-amber-50 text-amber-700 border border-amber-200"
                          : "bg-blue-50 text-blue-700 border border-blue-200"
                      }`}
                    >
                      {p.status === "validated"
                        ? "Validated"
                        : p.status === "needs_revision"
                        ? "Needs Revision"
                        : "Awaiting Review"}
                    </span>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {(JSON.parse(p.skills_json || "[]") as string[]).map((sk) => (
                      <span key={sk} className="text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
